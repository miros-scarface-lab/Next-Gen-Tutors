/*
  # Expand Site Settings Table for Full Website Customizability

  1. New Columns in `public.site_settings`
    - `hero_badge_text` (text)
    - `hero_image_url` (text)
    - `features_title` (text)
    - `features_subtitle` (text)
    - `how_it_works_title` (text)
    - `how_it_works_subtitle` (text)
    - `directory_title` (text)
    - `directory_subtitle` (text)
    - `testimonials_title` (text)
    - `testimonials_subtitle` (text)
    - `cta_title` (text)
    - `cta_description` (text)
    - `cta_badge_text` (text)
*/

ALTER TABLE public.site_settings 
  ADD COLUMN IF NOT EXISTS hero_badge_text text DEFAULT '100% Commission-Free Platform',
  ADD COLUMN IF NOT EXISTS hero_image_url text DEFAULT 'https://images.pexels.com/photos/5311406/pexels-photo-5311406.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  ADD COLUMN IF NOT EXISTS features_title text DEFAULT 'Why Choose Next Gen Tutors',
  ADD COLUMN IF NOT EXISTS features_subtitle text DEFAULT 'Built to connect students and qualified tutors seamlessly.',
  ADD COLUMN IF NOT EXISTS how_it_works_title text DEFAULT 'How Next Gen Tutors Works',
  ADD COLUMN IF NOT EXISTS how_it_works_subtitle text DEFAULT 'Four simple steps to get started.',
  ADD COLUMN IF NOT EXISTS directory_title text DEFAULT 'Tutors and tuition opportunities',
  ADD COLUMN IF NOT EXISTS directory_subtitle text DEFAULT 'Explore verified expert tutors and current learning opportunities.',
  ADD COLUMN IF NOT EXISTS testimonials_title text DEFAULT 'Loved by Students, Parents & Tutors',
  ADD COLUMN IF NOT EXISTS testimonials_subtitle text DEFAULT 'Read real feedback from our community.',
  ADD COLUMN IF NOT EXISTS cta_title text DEFAULT 'Find your perfect tutor or tuition in minutes',
  ADD COLUMN IF NOT EXISTS cta_description text DEFAULT 'Find tutors and tuitions directly — fast and simple, 100% commission free.',
  ADD COLUMN IF NOT EXISTS cta_badge_text text DEFAULT 'Available on Web & Mobile';
