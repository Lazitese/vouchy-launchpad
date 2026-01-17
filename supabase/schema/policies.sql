-- RLS POLICIES

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.widget_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;

-- PROFILES (Optimized)
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (id = (SELECT auth.uid()));
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (id = (SELECT auth.uid()));

-- WORKSPACES (Optimized)
CREATE POLICY "workspaces_select" ON public.workspaces FOR SELECT USING (user_id = (SELECT auth.uid()));
CREATE POLICY "workspaces_insert" ON public.workspaces FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY "workspaces_update" ON public.workspaces FOR UPDATE USING (user_id = (SELECT auth.uid()));
CREATE POLICY "workspaces_delete" ON public.workspaces FOR DELETE USING (user_id = (SELECT auth.uid()));

-- SPACES (Optimized)
CREATE POLICY "spaces_select_optimized" ON public.spaces 
FOR SELECT 
USING (
  is_active = true
  OR
  EXISTS (
    SELECT 1 FROM workspaces w 
    WHERE w.id = workspace_id 
    AND w.user_id = auth.uid()
  )
);

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

-- TESTIMONIALS (Optimized + Security Fix)
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

CREATE POLICY "testimonials_select_optimized" ON public.testimonials 
FOR SELECT 
USING (
  status = 'approved'
  OR
  EXISTS (
    SELECT 1 FROM spaces s 
    JOIN workspaces w ON s.workspace_id = w.id 
    WHERE s.id = testimonials.space_id 
    AND w.user_id = auth.uid()
  )
);

CREATE POLICY "Owners can update testimonials in their spaces" ON public.testimonials 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM spaces s 
    JOIN workspaces w ON s.workspace_id = w.id 
    WHERE s.id = testimonials.space_id 
    AND w.user_id = auth.uid()
  )
);

CREATE POLICY "Owners can delete testimonials in their spaces" ON public.testimonials 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM spaces s 
    JOIN workspaces w ON s.workspace_id = w.id 
    WHERE s.id = testimonials.space_id 
    AND w.user_id = auth.uid()
  )
);

-- WIDGET SETTINGS (Security Fix)
CREATE POLICY "widget_settings_select" ON public.widget_settings 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM workspaces w 
    WHERE w.id = widget_settings.workspace_id 
    AND w.user_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM spaces s 
    WHERE s.workspace_id = widget_settings.workspace_id 
    AND s.is_active = true
  )
);

CREATE POLICY "Owners can manage widget settings" ON public.widget_settings 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM workspaces w 
    WHERE w.id = workspace_id 
    AND w.user_id = auth.uid()
  )
);

-- USER ROLES
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- AI USAGE LOGS
CREATE POLICY "Users can view their own AI usage logs" ON public.ai_usage_logs FOR SELECT USING (auth.uid() = user_id);
