-- ============================================
-- CRITICAL SECURITY FIXES
-- Priority 1 - Apply Immediately
-- ============================================

-- 1. Fix enforce_pending_status() function search_path vulnerability
-- Reference: https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable

DROP FUNCTION IF EXISTS enforce_pending_status();

CREATE OR REPLACE FUNCTION enforce_pending_status()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.status := 'pending';
  RETURN NEW;
END;
$$;

-- Recreate trigger (in case it was dropped)
DROP TRIGGER IF EXISTS enforce_pending_status_trigger ON public.testimonials;
CREATE TRIGGER enforce_pending_status_trigger
  BEFORE INSERT ON public.testimonials
  FOR EACH ROW
  EXECUTE FUNCTION enforce_pending_status();


-- 2. Add missing indexes for ai_usage_logs foreign keys
-- Improves query performance significantly

CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_user_id 
ON public.ai_usage_logs(user_id);

CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_space_id 
ON public.ai_usage_logs(space_id);

CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_created_at 
ON public.ai_usage_logs(created_at DESC);


-- 3. Optimize RLS policies by combining multiple permissive policies
-- This improves performance by reducing policy evaluations

-- 3a. Optimize testimonials SELECT policies
DROP POLICY IF EXISTS "Public can view approved testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Owners can view all testimonials in their spaces" ON public.testimonials;

CREATE POLICY "testimonials_select_optimized" ON public.testimonials 
FOR SELECT 
USING (
  -- Public can view approved testimonials
  status = 'approved'
  OR
  -- Owners can view all testimonials in their spaces
  EXISTS (
    SELECT 1 FROM spaces s 
    JOIN workspaces w ON s.workspace_id = w.id 
    WHERE s.id = testimonials.space_id 
    AND w.user_id = auth.uid()
  )
);


-- 3b. Optimize spaces SELECT policies
DROP POLICY IF EXISTS "Public can read active spaces" ON public.spaces;
DROP POLICY IF EXISTS "Owners can manage spaces" ON public.spaces;

-- Recreate SELECT policy (optimized)
CREATE POLICY "spaces_select_optimized" ON public.spaces 
FOR SELECT 
USING (
  -- Public can read active spaces
  is_active = true
  OR
  -- Owners can view their spaces
  EXISTS (
    SELECT 1 FROM workspaces w 
    WHERE w.id = workspace_id 
    AND w.user_id = auth.uid()
  )
);

-- Recreate other operations for owners
CREATE POLICY "spaces_insert" ON public.spaces 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM workspaces w 
    WHERE w.id = workspace_id 
    AND w.user_id = auth.uid()
  )
);

CREATE POLICY "spaces_update" ON public.spaces 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM workspaces w 
    WHERE w.id = workspace_id 
    AND w.user_id = auth.uid()
  )
);

CREATE POLICY "spaces_delete" ON public.spaces 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM workspaces w 
    WHERE w.id = workspace_id 
    AND w.user_id = auth.uid()
  )
);


-- 4. Optimize profiles policies to cache auth.uid()
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "profiles_select" ON public.profiles 
FOR SELECT 
USING (id = (SELECT auth.uid()));

CREATE POLICY "profiles_update" ON public.profiles 
FOR UPDATE 
USING (id = (SELECT auth.uid()));


-- 5. Optimize workspaces policies
DROP POLICY IF EXISTS "Users can view own workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Users can create workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Users can update own workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Users can delete own workspaces" ON public.workspaces;

CREATE POLICY "workspaces_select" ON public.workspaces 
FOR SELECT 
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "workspaces_insert" ON public.workspaces 
FOR INSERT 
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "workspaces_update" ON public.workspaces 
FOR UPDATE 
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "workspaces_delete" ON public.workspaces 
FOR DELETE 
USING (user_id = (SELECT auth.uid()));


-- 6. Add index for testimonials queries (commonly filtered by space_id and status)
CREATE INDEX IF NOT EXISTS idx_testimonials_space_status 
ON public.testimonials(space_id, status);

CREATE INDEX IF NOT EXISTS idx_testimonials_created_at 
ON public.testimonials(created_at DESC);


-- Verification queries (run these to confirm changes)
-- SELECT trigger_name, event_manipulation, action_timing 
-- FROM information_schema.triggers 
-- WHERE trigger_name = 'enforce_pending_status_trigger';

-- SELECT indexname, tablename 
-- FROM pg_indexes 
-- WHERE schemaname = 'public' 
-- AND tablename IN ('ai_usage_logs', 'testimonials')
-- ORDER BY tablename, indexname;
