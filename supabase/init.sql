-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create Enums
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.testimonial_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.testimonial_type AS ENUM ('video', 'text');

-- Create Tables

-- PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free',
  ai_credits_used INTEGER DEFAULT 0,
  ai_credits_reset_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- WORKSPACES
CREATE TABLE IF NOT EXISTS public.workspaces (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  logo_url TEXT,
  primary_color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SPACES
CREATE TABLE IF NOT EXISTS public.spaces (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  questions JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TESTIMONIALS
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  space_id UUID REFERENCES public.spaces(id) ON DELETE CASCADE NOT NULL,
  type public.testimonial_type NOT NULL,
  status public.testimonial_status DEFAULT 'pending',
  author_name TEXT NOT NULL,
  author_email TEXT,
  author_title TEXT,
  author_company TEXT,
  author_avatar_url TEXT,
  content TEXT, -- For text testimonials
  video_url TEXT, -- For video testimonials
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  ai_summary TEXT,
  golden_quote TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- WIDGET SETTINGS
CREATE TABLE IF NOT EXISTS public.widget_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL UNIQUE,
  layout TEXT DEFAULT 'grid',
  dark_mode BOOLEAN DEFAULT false,
  show_video_first BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- USER ROLES
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.widget_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Helper Functions

CREATE OR REPLACE FUNCTION public.has_role(_role public.app_role)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = _role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.owns_workspace(_workspace_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.workspaces
    WHERE id = _workspace_id AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.owns_space(_space_id UUID)
RETURNS BOOLEAN AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_space_owner(_space_id UUID)
RETURNS UUID AS $$
DECLARE
  _owner_id UUID;
BEGIN
  SELECT w.user_id INTO _owner_id
  FROM public.spaces s
  JOIN public.workspaces w ON s.workspace_id = w.id
  WHERE s.id = _space_id;
  
  RETURN _owner_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies

-- PROFILES
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- WORKSPACES
CREATE POLICY "Users can view own workspaces" ON public.workspaces
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create workspaces" ON public.workspaces
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workspaces" ON public.workspaces
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workspaces" ON public.workspaces
  FOR DELETE USING (auth.uid() = user_id);

-- SPACES
-- Public read for active spaces (needed for collection forms to verify slug/existence) -- Actually careful here. 
-- We want anyone to read BASIC info about a space if they have the slug, primarily for collection.
-- But standard policy:
CREATE POLICY "Public can read active spaces" ON public.spaces
  FOR SELECT USING (is_active = true);

CREATE POLICY "Owners can manage spaces" ON public.spaces
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.workspaces w
      WHERE w.id = workspace_id AND w.user_id = auth.uid()
    )
  );

-- TESTIMONIALS
CREATE POLICY "Anyone can insert testimonials for active spaces" ON public.testimonials
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.spaces s
      WHERE s.id = space_id AND s.is_active = true
    )
  );

CREATE POLICY "Public can view approved testimonials" ON public.testimonials
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Owners can view all testimonials in their spaces" ON public.testimonials
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.spaces s
      JOIN public.workspaces w ON s.workspace_id = w.id
      WHERE s.id = public.testimonials.space_id AND w.user_id = auth.uid()
    )
  );

CREATE POLICY "Owners can update testimonials in their spaces" ON public.testimonials
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.spaces s
      JOIN public.workspaces w ON s.workspace_id = w.id
      WHERE s.id = public.testimonials.space_id AND w.user_id = auth.uid()
    )
  );

CREATE POLICY "Owners can delete testimonials in their spaces" ON public.testimonials
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.spaces s
      JOIN public.workspaces w ON s.workspace_id = w.id
      WHERE s.id = public.testimonials.space_id AND w.user_id = auth.uid()
    )
  );

-- WIDGET SETTINGS
CREATE POLICY "Public can view widget settings" ON public.widget_settings
  FOR SELECT USING (true); -- Generally needed for rendering widgets publicly? Or restricted? Warning: Public might need it.

CREATE POLICY "Owners can manage widget settings" ON public.widget_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.workspaces w
      WHERE w.id = workspace_id AND w.user_id = auth.uid()
    )
  );

-- USER ROLES
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Trigger for new user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists to avoid error on rerun
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Storage Buckets (Note: Creation often requires calling storage API or insert into storage.buckets if using pure SQL)
-- Standard Supabase SQL for storage setup:

INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('testimonials', 'testimonials', true) ON CONFLICT (id) DO NOTHING;

-- Storage Policies
-- Logos: Public read, Authenticated upload (or owner upload). 
-- Allow any auth user to upload logo? Usually restricted to workspace owners but finding workspace owner from storage policy is hard without file path conventions.
-- Simple: Auth users can upload, Anyone can read.

CREATE POLICY "Public Access Logos" ON storage.objects FOR SELECT USING (bucket_id = 'logos');
CREATE POLICY "Auth Upload Logos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'logos' AND auth.role() = 'authenticated');
CREATE POLICY "Owner Update Logos" ON storage.objects FOR UPDATE USING (bucket_id = 'logos' AND auth.uid() = owner);
CREATE POLICY "Owner Delete Logos" ON storage.objects FOR DELETE USING (bucket_id = 'logos' AND auth.uid() = owner);

-- Testimonials: Public read, Public upload (for video collection!)
-- Wait, video upload from anonymous users?
-- Yes, if `testimonials` bucket is public.
-- But `storage.objects` RLS needs to allow it.
CREATE POLICY "Public Access Testimonials" ON storage.objects FOR SELECT USING (bucket_id = 'testimonials');
CREATE POLICY "Anyone Upload Testimonials" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'testimonials'); 
-- Note: "Anyone" for insert usually means usage of anon key.

