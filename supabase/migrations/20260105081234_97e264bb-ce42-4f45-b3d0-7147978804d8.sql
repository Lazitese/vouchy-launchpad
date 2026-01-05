-- Fix 1: Create a view for public testimonials that excludes sensitive email data
CREATE OR REPLACE VIEW public.public_testimonials AS
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

-- Fix 2: Add DELETE policy for widget_settings
CREATE POLICY "Users can delete own widget settings" 
ON public.widget_settings 
FOR DELETE 
USING (owns_workspace(auth.uid(), workspace_id));