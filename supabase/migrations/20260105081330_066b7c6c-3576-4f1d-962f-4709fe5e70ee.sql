-- Fix the security definer view issue by dropping and recreating with SECURITY INVOKER
DROP VIEW IF EXISTS public.public_testimonials;

CREATE VIEW public.public_testimonials 
WITH (security_invoker = true) AS
SELECT 
  id,
  space_id,
  type,
  content,
  video_url,
  author_name,
  author_title,
  author_company,
  author_avatar_url,
  rating,
  status,
  created_at,
  ai_summary,
  golden_quote
FROM public.testimonials
WHERE status = 'approved';