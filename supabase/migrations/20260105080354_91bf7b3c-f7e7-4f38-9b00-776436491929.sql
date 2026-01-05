-- Create a secure function to get space owner's plan
CREATE OR REPLACE FUNCTION public.get_space_owner_plan(_space_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(p.plan, 'free')
  FROM public.spaces s
  JOIN public.workspaces w ON s.workspace_id = w.id
  JOIN public.profiles p ON w.user_id = p.id
  WHERE s.id = _space_id
$$;