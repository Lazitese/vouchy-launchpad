-- Add plan column to profiles table for tracking user subscription
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'agency'));

-- Add ai_credits_used column to track monthly AI usage
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS ai_credits_used INTEGER DEFAULT 0;

-- Add ai_credits_reset_at to track when credits should reset
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS ai_credits_reset_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Add summary and golden_quote columns to testimonials for video AI features
ALTER TABLE public.testimonials
ADD COLUMN IF NOT EXISTS ai_summary TEXT;

ALTER TABLE public.testimonials
ADD COLUMN IF NOT EXISTS golden_quote TEXT;