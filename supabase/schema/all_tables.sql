-- Supabase Schema Export
-- Generated: 2026-01-17
-- Project ID: dcncqdsrllzjceouydxn

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

-- 2. ENUMS
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.testimonial_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.testimonial_type AS ENUM ('video', 'text');

-- 3. TABLES

-- PROFILES
CREATE TABLE public.profiles (
    id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text,
    full_name text,
    avatar_url text,
    plan text DEFAULT 'free'::text,
    ai_credits_used integer DEFAULT 0,
    ai_credits_reset_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- WORKSPACES
CREATE TABLE public.workspaces (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id),
    name text NOT NULL,
    logo_url text,
    primary_color text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- SPACES
CREATE TABLE public.spaces (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL PRIMARY KEY,
    workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    name text NOT NULL,
    slug text NOT NULL UNIQUE,
    questions jsonb,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- TESTIMONIALS
CREATE TABLE public.testimonials (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL PRIMARY KEY,
    space_id uuid NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
    type public.testimonial_type NOT NULL,
    status public.testimonial_status DEFAULT 'pending'::public.testimonial_status,
    rating integer NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    title text,
    company text,
    avatar_url text,
    content text,
    video_url text,
    golden_quote text,
    ai_summary text,
    name text NOT NULL,
    email text,
    is_favorite boolean DEFAULT false
);

-- WIDGET SETTINGS
CREATE TABLE public.widget_settings (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL PRIMARY KEY,
    workspace_id uuid NOT NULL UNIQUE REFERENCES public.workspaces(id) ON DELETE CASCADE,
    layout text DEFAULT 'grid'::text,
    dark_mode boolean DEFAULT false,
    show_video_first boolean DEFAULT true,
    appearance jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    space_filtering jsonb DEFAULT '[]'::jsonb,
    display_limit integer,
    ordering text DEFAULT 'newest'::text
);

-- USER ROLES
CREATE TABLE public.user_roles (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role public.app_role DEFAULT 'user'::public.app_role,
    created_at timestamp with time zone DEFAULT now()
);

-- AI USAGE LOGS
CREATE TABLE public.ai_usage_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES public.profiles(id),
    space_id uuid REFERENCES public.spaces(id),
    credits integer DEFAULT 1 NOT NULL,
    action text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- 4. FUNCTIONS

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

-- 5. TRIGGERS
-- Note: These triggers are attached to auth.users, so schema creation must handle that.
-- In a real Supabase environment, these are applied once.

-- CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
-- CREATE TRIGGER on_auth_user_role_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- 6. RLS POLICIES

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.widget_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own workspaces" ON public.workspaces FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create workspaces" ON public.workspaces FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own workspaces" ON public.workspaces FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own workspaces" ON public.workspaces FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Public can read active spaces" ON public.spaces FOR SELECT USING (is_active = true);
CREATE POLICY "Owners can manage spaces" ON public.spaces FOR ALL USING (EXISTS (SELECT 1 FROM public.workspaces w WHERE w.id = workspace_id AND w.user_id = auth.uid()));

CREATE POLICY "Anyone can insert testimonials for active spaces" ON public.testimonials FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM spaces s WHERE s.id = testimonials.space_id AND s.is_active = true));
CREATE POLICY "Public can view approved testimonials" ON public.testimonials FOR SELECT USING (status = 'approved');
CREATE POLICY "Owners can view all testimonials in their spaces" ON public.testimonials FOR SELECT USING (EXISTS (SELECT 1 FROM spaces s JOIN workspaces w ON s.workspace_id = w.id WHERE s.id = testimonials.space_id AND w.user_id = auth.uid()));
CREATE POLICY "Owners can update testimonials in their spaces" ON public.testimonials FOR UPDATE USING (EXISTS (SELECT 1 FROM spaces s JOIN workspaces w ON s.workspace_id = w.id WHERE s.id = testimonials.space_id AND w.user_id = auth.uid()));
CREATE POLICY "Owners can delete testimonials in their spaces" ON public.testimonials FOR DELETE USING (EXISTS (SELECT 1 FROM spaces s JOIN workspaces w ON s.workspace_id = w.id WHERE s.id = testimonials.space_id AND w.user_id = auth.uid()));

CREATE POLICY "Public can view widget settings" ON public.widget_settings FOR SELECT USING (true);
CREATE POLICY "Owners can manage widget settings" ON public.widget_settings FOR ALL USING (EXISTS (SELECT 1 FROM workspaces w WHERE w.id = workspace_id AND w.user_id = auth.uid()));

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own AI usage logs" ON public.ai_usage_logs FOR SELECT USING (auth.uid() = user_id);

-- 7. STORAGE BUCKETS & POLICIES

-- INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true) ON CONFLICT (id) DO NOTHING;
-- INSERT INTO storage.buckets (id, name, public) VALUES ('testimonials', 'testimonials', true) ON CONFLICT (id) DO NOTHING;

-- CREATE POLICY "Public Access Logos" ON storage.objects FOR SELECT USING (bucket_id = 'logos');
-- CREATE POLICY "Auth Upload Logos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'logos' AND auth.role() = 'authenticated');
-- CREATE POLICY "Owner Update Logos" ON storage.objects FOR UPDATE USING (bucket_id = 'logos' AND auth.uid() = owner);
-- CREATE POLICY "Owner Delete Logos" ON storage.objects FOR DELETE USING (bucket_id = 'logos' AND auth.uid() = owner);

-- CREATE POLICY "Public Access Testimonials" ON storage.objects FOR SELECT USING (bucket_id = 'testimonials');
-- CREATE POLICY "Anyone Upload Testimonials" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'testimonials');
