/*
  # Full Database Settlement & Comprehensive Seed Data

  1. Enhancements
    - Adds `username` and `email` columns to `public.site_admins` table for full readability.
    - Seeds default admin account (`admins` / `12340987` -> `admins@nextgentutors.com`).
    - Seeds rich default sample Tutors, Tuition Posts, and Testimonials so the website directory is populated out of the box.

  2. Security
    - Retains RLS policies and `is_site_admin()` helper function.
*/

-- Ensure extensions exist
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- Upgrade site_admins table structure if needed
ALTER TABLE public.site_admins ADD COLUMN IF NOT EXISTS username text DEFAULT 'admins';
ALTER TABLE public.site_admins ADD COLUMN IF NOT EXISTS email text DEFAULT 'admins@nextgentutors.com';

-- 1. Seed Default Admin User
DO $$
DECLARE
  admin_user_id uuid := 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admins@nextgentutors.com') THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      created_at,
      updated_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      admin_user_id,
      'authenticated',
      'authenticated',
      'admins@nextgentutors.com',
      extensions.crypt('12340987', extensions.gen_salt('bf')),
      now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"username": "admins"}',
      false,
      now(),
      now()
    );

    INSERT INTO public.site_admins (user_id, username, email)
    VALUES (admin_user_id, 'admins', 'admins@nextgentutors.com')
    ON CONFLICT (user_id) DO UPDATE SET username = 'admins', email = 'admins@nextgentutors.com';
  ELSE
    SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admins@nextgentutors.com';
    INSERT INTO public.site_admins (user_id, username, email)
    VALUES (admin_user_id, 'admins', 'admins@nextgentutors.com')
    ON CONFLICT (user_id) DO UPDATE SET username = 'admins', email = 'admins@nextgentutors.com';
  END IF;
END $$;

-- 2. Seed Sample Tutors (if none exist)
INSERT INTO public.tutors (id, name, headline, bio, subjects, location, avatar_url, rating, is_verified, is_featured)
SELECT 
  gen_random_uuid(),
  'Istiak Rahman Shourov',
  'EEE Undergrad at IUT | 3+ Years Experience',
  'Specialized in Higher Mathematics and Physics for HSC and English Medium students. Dedicated to building deep conceptual understanding.',
  ARRAY['Physics', 'Higher Math', 'ICT'],
  'Uttara, Dhaka',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  5.0,
  true,
  true
WHERE NOT EXISTS (SELECT 1 FROM public.tutors);

INSERT INTO public.tutors (name, headline, bio, subjects, location, avatar_url, rating, is_verified, is_featured)
SELECT 
  'Rasel Mahmud',
  'BUET EEE | Math & Physics Olympiad Trainer',
  'Experienced tutor for Admission candidates, HSC, and A-Level students. Passionate about problem-solving techniques.',
  ARRAY['Higher Math', 'Physics', 'General Math'],
  'Dhanmondi, Dhaka',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  4.9,
  true,
  true
WHERE (SELECT count(*) FROM public.tutors) = 1;

INSERT INTO public.tutors (name, headline, bio, subjects, location, avatar_url, rating, is_verified, is_featured)
SELECT 
  'Abrar Hamim',
  'Dhaka University | Science Specialist',
  'Teaching Chemistry and General Science for Class 8-10. Focus on clear concepts, notes, and exam success.',
  ARRAY['Chemistry', 'General Science', 'Biology'],
  'Mirpur, Dhaka',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  4.8,
  true,
  false
WHERE (SELECT count(*) FROM public.tutors) = 2;

-- 3. Seed Sample Tuition Posts (if none exist)
INSERT INTO public.tuition_posts (id, title, subject, grade_level, location, mode, budget, description, is_active)
SELECT 
  gen_random_uuid(),
  'Need HSC 2026 Physics & Higher Math Tutor',
  'Physics & Higher Math',
  'HSC 2nd Year',
  'Uttara Sector 4, Dhaka',
  'In-person',
  '10,000 BDT/month (3 days/week)',
  'Looking for an experienced BUET/IUT tutor for HSC 2nd year student. Must be punctual and strong in problem solving.',
  true
WHERE NOT EXISTS (SELECT 1 FROM public.tuition_posts);

INSERT INTO public.tuition_posts (title, subject, grade_level, location, mode, budget, description, is_active)
SELECT 
  'Class 10 All Science Subjects Tutor',
  'Physics, Chemistry, Math',
  'Class 10 (SSC candidate)',
  'Dhanmondi Road 27, Dhaka',
  'In-person',
  '8,000 BDT/month (4 days/week)',
  'Urgent tutor needed for SSC candidate. Female tutor preferred.',
  true
WHERE (SELECT count(*) FROM public.tuition_posts) = 1;

INSERT INTO public.tuition_posts (title, subject, grade_level, location, mode, budget, description, is_active)
SELECT 
  'O-Level Chemistry & Physics Online Tutor',
  'Chemistry & Physics',
  'O-Level (Edexcel)',
  'Online (Zoom)',
  'Online',
  '12,000 BDT/month (3 days/week)',
  'Seeking an expert Cambridge/Edexcel curriculum tutor for online classes.',
  true
WHERE (SELECT count(*) FROM public.tuition_posts) = 2;

-- 4. Seed Testimonials (if none exist)
INSERT INTO public.testimonials (id, quote, name, title, organization, sort_order, is_published)
SELECT 
  gen_random_uuid(),
  'Complete free media fee and good salary payment from guardian. Almost 1 year tuition with Next Gen Tutors, got students, Alhamdulillah. Highly trusted media.',
  'Istiak Rahman Shourov',
  '4th Year, EEE',
  'Islamic University of Technology (IUT)',
  1,
  true
WHERE NOT EXISTS (SELECT 1 FROM public.testimonials);

INSERT INTO public.testimonials (quote, name, title, organization, sort_order, is_published)
SELECT 
  'Next Gen Tutors is doing excellent work in finding qualified tutors from BUET or other prestigious institutes. They are responding very fast and ensuring helpful attitude to students.',
  'Ataur Rahman',
  'FCPS, FRCP, FACP',
  'Associate Professor (Medicine)',
  2,
  true
WHERE (SELECT count(*) FROM public.testimonials) = 1;

INSERT INTO public.testimonials (quote, name, title, organization, sort_order, is_published)
SELECT 
  'Thank you. Very satisfied! Found a tuition without paying media fee. Highly recommend this page.',
  'Abrar Hamim',
  '3rd Year, Disaster Science',
  'Dhaka University',
  3,
  true
WHERE (SELECT count(*) FROM public.testimonials) = 2;

INSERT INTO public.testimonials (quote, name, title, organization, sort_order, is_published)
SELECT 
  'I found a tuition through them and Alhamdulillah they don''t charge any media fee and their behavior is also very good. I highly recommend them for finding any tuition.',
  'Mahmud Nahid',
  '2nd Year, EEE',
  'IUT',
  4,
  true
WHERE (SELECT count(*) FROM public.testimonials) = 3;
