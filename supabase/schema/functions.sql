-- FUNCTIONS

CREATE OR REPLACE FUNCTION public.has_role(_role public.app_role)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = _role
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.owns_workspace(_workspace_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.workspaces
    WHERE id = _workspace_id AND user_id = auth.uid()
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.owns_space(_space_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
DECLARE
  _workspace_id UUID;
BEGIN
  SELECT workspace_id INTO _workspace_id
  FROM public.spaces
  WHERE id = _space_id;
  
  RETURN EXISTS (
    SELECT 1 FROM public.workspaces
    WHERE id = _workspace_id AND user_id = auth.uid()
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_space_owner(_space_id uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
DECLARE
  _owner_id UUID;
BEGIN
  SELECT w.user_id INTO _owner_id
  FROM public.spaces s
  JOIN public.workspaces w ON s.workspace_id = w.id
  WHERE s.id = _space_id;
  
  RETURN _owner_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user_role()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  RETURN new;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_space_owner_plan(_space_id uuid)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
DECLARE
  _plan TEXT;
BEGIN
  SELECT p.plan INTO _plan
  FROM public.spaces s
  JOIN public.workspaces w ON s.workspace_id = w.id
  JOIN public.profiles p ON w.user_id = p.id
  WHERE s.id = _space_id;
  
  RETURN _plan;
END;
$function$;

-- Update: Security Fix for Testimonials (Function & Trigger)
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

DROP TRIGGER IF EXISTS enforce_pending_status_trigger ON public.testimonials;
CREATE TRIGGER enforce_pending_status_trigger
  BEFORE INSERT ON public.testimonials
  FOR EACH ROW
  EXECUTE FUNCTION enforce_pending_status();
