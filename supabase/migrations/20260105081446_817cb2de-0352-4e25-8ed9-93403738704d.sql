-- Drop the public view (not needed - we'll use RLS on the base table)
DROP VIEW IF EXISTS public.public_testimonials;

-- The testimonials table already has proper RLS policies:
-- 1. "Public can view approved testimonials" - allows SELECT on approved testimonials
-- 2. "Users can view testimonials in own spaces" - allows owners to see all testimonials
-- The public policy exposes email which is an issue. However, we need a different approach.

-- Create a function to get public testimonials without email
CREATE OR REPLACE FUNCTION public.get_public_testimonials(_space_id uuid)
RETURNS TABLE (
  id uuid,
  space_id uuid,
  type text,
  content text,
  video_url text,
  author_name text,
  author_title text,
  author_company text,
  author_avatar_url text,
  rating integer,
  status text,
  created_at timestamptz,
  ai_summary text,
  golden_quote text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    t.id,
    t.space_id,
    t.type::text,
    t.content,
    t.video_url,
    t.author_name,
    t.author_title,
    t.author_company,
    t.author_avatar_url,
    t.rating,
    t.status::text,
    t.created_at,
    t.ai_summary,
    t.golden_quote
  FROM public.testimonials t
  WHERE t.space_id = _space_id
    AND t.status = 'approved'
$$;