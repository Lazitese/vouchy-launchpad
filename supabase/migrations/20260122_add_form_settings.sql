-- Add form_settings column to spaces table for customizable form fields
ALTER TABLE public.spaces ADD COLUMN IF NOT EXISTS form_settings jsonb DEFAULT '{
  "fields": {
    "name": { "enabled": true, "required": true, "label": "Your name" },
    "email": { "enabled": true, "required": true, "label": "Email address" },
    "title": { "enabled": true, "required": false, "label": "Job title" },
    "company": { "enabled": true, "required": false, "label": "Company" },
    "rating": { "enabled": true, "required": true, "label": "Rating" },
    "avatar": { "enabled": true, "required": false, "label": "Your photo" },
    "testimonial": { "enabled": true, "required": true, "label": "Your testimonial", "minLength": 10, "maxLength": 2000, "placeholder": "Share your experience..." }
  },
  "theme": {
    "accentColor": "#10b981",
    "backgroundColor": "#ffffff",
    "cardStyle": "modern"
  },
  "messages": {
    "title": "Share your experience",
    "subtitle": "Help others by sharing your honest feedback",
    "submitButton": "Submit Review",
    "successTitle": "Thank you!",
    "successMessage": "Your testimonial has been submitted successfully."
  }
}'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN public.spaces.form_settings IS 'Customizable form settings including field visibility, validation rules, theming, and messages';
