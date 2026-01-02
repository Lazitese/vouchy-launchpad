-- =============================================
-- TESTIMONIAL COLLECTION PLATFORM - FULL BACKEND
-- =============================================

-- 1. ENUMS
-- =============================================
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.testimonial_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.testimonial_type AS ENUM ('video', 'text');

-- 2. PROFILES TABLE
-- =============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. USER ROLES TABLE (separate from profiles for security)
-- =============================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. WORKSPACES TABLE
-- =============================================
CREATE TABLE public.workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  primary_color TEXT DEFAULT '#6366f1',
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

-- 5. SPACES TABLE (Collection spaces)
-- =============================================
CREATE TABLE public.spaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  questions JSONB DEFAULT '["What problem did we solve for you?", "How has your experience been?", "Would you recommend us to others?"]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.spaces ENABLE ROW LEVEL SECURITY;

-- Create index for slug lookups (public collection pages)
CREATE INDEX idx_spaces_slug ON public.spaces(slug);

-- 6. TESTIMONIALS TABLE
-- =============================================
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
  type testimonial_type NOT NULL,
  content TEXT,
  video_url TEXT,
  author_name TEXT NOT NULL,
  author_email TEXT,
  author_title TEXT,
  author_company TEXT,
  author_avatar_url TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  status testimonial_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Index for filtering by status
CREATE INDEX idx_testimonials_status ON public.testimonials(status);
CREATE INDEX idx_testimonials_space_id ON public.testimonials(space_id);

-- 7. WIDGET SETTINGS TABLE
-- =============================================
CREATE TABLE public.widget_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE UNIQUE,
  dark_mode BOOLEAN NOT NULL DEFAULT false,
  layout TEXT NOT NULL DEFAULT 'grid' CHECK (layout IN ('grid', 'carousel')),
  show_video_first BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.widget_settings ENABLE ROW LEVEL SECURITY;

-- =============================================
-- SECURITY DEFINER FUNCTIONS
-- =============================================

-- Function to check user role (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to check workspace ownership
CREATE OR REPLACE FUNCTION public.owns_workspace(_user_id UUID, _workspace_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.workspaces
    WHERE id = _workspace_id
      AND user_id = _user_id
  )
$$;

-- Function to check space ownership (via workspace)
CREATE OR REPLACE FUNCTION public.owns_space(_user_id UUID, _space_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.spaces s
    JOIN public.workspaces w ON s.workspace_id = w.id
    WHERE s.id = _space_id
      AND w.user_id = _user_id
  )
$$;

-- Function to get workspace owner from space
CREATE OR REPLACE FUNCTION public.get_space_owner(_space_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT w.user_id
  FROM public.spaces s
  JOIN public.workspaces w ON s.workspace_id = w.id
  WHERE s.id = _space_id
$$;

-- =============================================
-- RLS POLICIES
-- =============================================

-- PROFILES POLICIES
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- USER ROLES POLICIES
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- WORKSPACES POLICIES
CREATE POLICY "Users can view own workspaces"
  ON public.workspaces FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own workspaces"
  ON public.workspaces FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own workspaces"
  ON public.workspaces FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own workspaces"
  ON public.workspaces FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- SPACES POLICIES
CREATE POLICY "Users can view own spaces"
  ON public.spaces FOR SELECT
  TO authenticated
  USING (public.owns_workspace(auth.uid(), workspace_id));

CREATE POLICY "Users can create spaces in own workspaces"
  ON public.spaces FOR INSERT
  TO authenticated
  WITH CHECK (public.owns_workspace(auth.uid(), workspace_id));

CREATE POLICY "Users can update own spaces"
  ON public.spaces FOR UPDATE
  TO authenticated
  USING (public.owns_workspace(auth.uid(), workspace_id))
  WITH CHECK (public.owns_workspace(auth.uid(), workspace_id));

CREATE POLICY "Users can delete own spaces"
  ON public.spaces FOR DELETE
  TO authenticated
  USING (public.owns_workspace(auth.uid(), workspace_id));

-- Public can view active spaces (for collection page)
CREATE POLICY "Public can view active spaces by slug"
  ON public.spaces FOR SELECT
  TO anon
  USING (is_active = true);

-- TESTIMONIALS POLICIES
CREATE POLICY "Users can view testimonials in own spaces"
  ON public.testimonials FOR SELECT
  TO authenticated
  USING (public.owns_space(auth.uid(), space_id));

CREATE POLICY "Users can update testimonials in own spaces"
  ON public.testimonials FOR UPDATE
  TO authenticated
  USING (public.owns_space(auth.uid(), space_id))
  WITH CHECK (public.owns_space(auth.uid(), space_id));

CREATE POLICY "Users can delete testimonials in own spaces"
  ON public.testimonials FOR DELETE
  TO authenticated
  USING (public.owns_space(auth.uid(), space_id));

-- Anyone can submit testimonials (public collection)
CREATE POLICY "Anyone can submit testimonials"
  ON public.testimonials FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.spaces
      WHERE id = space_id AND is_active = true
    )
  );

-- Public can view approved testimonials (for embed widget)
CREATE POLICY "Public can view approved testimonials"
  ON public.testimonials FOR SELECT
  TO anon
  USING (status = 'approved');

-- WIDGET SETTINGS POLICIES
CREATE POLICY "Users can view own widget settings"
  ON public.widget_settings FOR SELECT
  TO authenticated
  USING (public.owns_workspace(auth.uid(), workspace_id));

CREATE POLICY "Users can create widget settings"
  ON public.widget_settings FOR INSERT
  TO authenticated
  WITH CHECK (public.owns_workspace(auth.uid(), workspace_id));

CREATE POLICY "Users can update own widget settings"
  ON public.widget_settings FOR UPDATE
  TO authenticated
  USING (public.owns_workspace(auth.uid(), workspace_id))
  WITH CHECK (public.owns_workspace(auth.uid(), workspace_id));

-- =============================================
-- TRIGGERS
-- =============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_workspaces_updated_at
  BEFORE UPDATE ON public.workspaces
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_spaces_updated_at
  BEFORE UPDATE ON public.spaces
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_widget_settings_updated_at
  BEFORE UPDATE ON public.widget_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', '')
  );
  
  -- Also create default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- STORAGE BUCKETS
-- =============================================

-- Logos bucket (public for display)
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true);

-- Testimonial videos bucket (public for playback)
INSERT INTO storage.buckets (id, name, public)
VALUES ('testimonials', 'testimonials', true);

-- STORAGE POLICIES

-- Logos: authenticated users can upload to their folder
CREATE POLICY "Users can upload logos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'logos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can update own logos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'logos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete own logos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'logos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Anyone can view logos"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'logos');

-- Testimonials: anyone can upload videos (public collection)
CREATE POLICY "Anyone can upload testimonial videos"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'testimonials');

CREATE POLICY "Anyone can view testimonial videos"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'testimonials');

-- Only workspace owners can delete testimonial videos
CREATE POLICY "Users can delete testimonial videos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'testimonials');