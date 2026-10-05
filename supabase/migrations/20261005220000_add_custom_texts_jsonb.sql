-- Add custom_texts jsonb column to site_settings table
ALTER TABLE public.site_settings
ADD COLUMN IF NOT EXISTS custom_texts jsonb DEFAULT '{}'::jsonb;
