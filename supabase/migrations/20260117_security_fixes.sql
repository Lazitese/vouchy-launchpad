-- Security Migration: Fix testimonials INSERT policy and widget_settings SELECT policy

-- 1. Drop existing testimonials INSERT policy
DROP POLICY IF EXISTS "Anyone can insert testimonials for active spaces" ON public.testimonials;

-- 2. Create new INSERT policy with WITH CHECK to force status = 'pending'
CREATE POLICY "Anyone can insert testimonials for active spaces" 
ON public.testimonials 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM spaces s 
    WHERE s.id = testimonials.space_id 
    AND s.is_active = true
  )
  AND status = 'pending'
);

-- 3. Create trigger function to override status to 'pending' on insert
CREATE OR REPLACE FUNCTION enforce_pending_status()
RETURNS TRIGGER AS $$
BEGIN
  NEW.status := 'pending';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create trigger on testimonials table
DROP TRIGGER IF EXISTS enforce_pending_status_trigger ON public.testimonials;
CREATE TRIGGER enforce_pending_status_trigger
  BEFORE INSERT ON public.testimonials
  FOR EACH ROW
  EXECUTE FUNCTION enforce_pending_status();

-- 5. Update widget_settings SELECT policy
DROP POLICY IF EXISTS "Public can view widget settings" ON public.widget_settings;

CREATE POLICY "Public can view widget settings" 
ON public.widget_settings 
FOR SELECT 
USING (
  -- Allow if user is the owner
  EXISTS (
    SELECT 1 FROM workspaces w 
    WHERE w.id = widget_settings.workspace_id 
    AND w.user_id = auth.uid()
  )
  OR
  -- Allow if workspace has at least one public/active space
  EXISTS (
    SELECT 1 FROM spaces s 
    WHERE s.workspace_id = widget_settings.workspace_id 
    AND s.is_active = true
  )
);
