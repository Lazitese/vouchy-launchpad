-- TABLES

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
    form_settings jsonb,
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

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_user_id ON public.ai_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_space_id ON public.ai_usage_logs(space_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_created_at ON public.ai_usage_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_testimonials_space_status ON public.testimonials(space_id, status);
CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON public.testimonials(created_at DESC);
