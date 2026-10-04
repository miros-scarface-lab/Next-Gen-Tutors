/*
# Create Next Gen Tutors CMS and directory data

1. New Tables
- `site_settings`: one public website settings row for the brand name, hero copy, contact details, and footer content.
- `tutors`: tutor profiles shown on the public website, including subjects, location, verification, rating, and profile copy.
- `tuition_posts`: tuition opportunities shown to visitors, including subject, grade level, location, mode, budget, and active status.
- `testimonials`: reviews managed by the CMS and displayed on the public website.
- `site_admins`: links authenticated Supabase users to administrator access.

2. Security
- Row Level Security is enabled on every new table.
- Public visitors can read only public site settings, tutor profiles, active tuition posts, and published testimonials.
- Only authenticated users listed in `site_admins` can create, edit, or remove CMS content.
- Administrator checks are performed in the database through a SECURITY DEFINER helper with a fixed search path.
- The browser never receives or controls a service-role credential.

3. Important Notes
- `site_settings` is intentionally limited to one row using a boolean singleton key.
- Tutor and tuition records are retained when hidden so content can be restored instead of deleted accidentally.
- An authenticated Supabase user must be added to `site_admins` before they can use the admin panel.
*/

CREATE TABLE IF NOT EXISTS public.site_settings (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton = true),
  brand_name text NOT NULL DEFAULT 'Next Gen Tutors',
  hero_title text NOT NULL DEFAULT 'Find Your Perfect Tutor Anytime, Anywhere',
  hero_description text NOT NULL DEFAULT 'Find the right tutor with confidence. Connect with verified, experienced tutors and start learning with purpose.',
  contact_email text NOT NULL DEFAULT 'hello@nextgentutors.com',
  contact_phone text NOT NULL DEFAULT '+880 1000 000000',
  location text NOT NULL DEFAULT 'Dhaka, Bangladesh',
  footer_description text NOT NULL DEFAULT 'Connect with expert tutors who will help you achieve your academic goals.',
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.site_settings (singleton)
VALUES (true)
ON CONFLICT (singleton) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.tutors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  headline text NOT NULL DEFAULT '',
  bio text NOT NULL DEFAULT '',
  subjects text[] NOT NULL DEFAULT '{}',
  location text NOT NULL DEFAULT '',
  avatar_url text NOT NULL DEFAULT '',
  rating numeric(2,1) NOT NULL DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),
  is_verified boolean NOT NULL DEFAULT false,
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tuition_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subject text NOT NULL,
  grade_level text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  mode text NOT NULL DEFAULT 'In-person',
  budget text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote text NOT NULL,
  name text NOT NULL,
  title text NOT NULL DEFAULT '',
  organization text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.site_admins (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS tutors_featured_idx ON public.tutors (is_featured, created_at DESC);
CREATE INDEX IF NOT EXISTS tuition_posts_active_idx ON public.tuition_posts (is_active, created_at DESC);
CREATE INDEX IF NOT EXISTS testimonials_published_idx ON public.testimonials (is_published, sort_order);

CREATE OR REPLACE FUNCTION public.is_site_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.site_admins
    WHERE user_id = auth.uid()
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_site_admin() FROM anon;
GRANT EXECUTE ON FUNCTION public.is_site_admin() TO authenticated;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tuition_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read site settings" ON public.site_settings;
CREATE POLICY "Public can read site settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Admins can insert site settings" ON public.site_settings;
CREATE POLICY "Admins can insert site settings" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (public.is_site_admin());
DROP POLICY IF EXISTS "Admins can update site settings" ON public.site_settings;
CREATE POLICY "Admins can update site settings" ON public.site_settings FOR UPDATE TO authenticated USING (public.is_site_admin()) WITH CHECK (public.is_site_admin());
DROP POLICY IF EXISTS "Admins can delete site settings" ON public.site_settings;
CREATE POLICY "Admins can delete site settings" ON public.site_settings FOR DELETE TO authenticated USING (public.is_site_admin());

DROP POLICY IF EXISTS "Public can read tutors" ON public.tutors;
CREATE POLICY "Public can read tutors" ON public.tutors FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Admins can insert tutors" ON public.tutors;
CREATE POLICY "Admins can insert tutors" ON public.tutors FOR INSERT TO authenticated WITH CHECK (public.is_site_admin());
DROP POLICY IF EXISTS "Admins can update tutors" ON public.tutors;
CREATE POLICY "Admins can update tutors" ON public.tutors FOR UPDATE TO authenticated USING (public.is_site_admin()) WITH CHECK (public.is_site_admin());
DROP POLICY IF EXISTS "Admins can delete tutors" ON public.tutors;
CREATE POLICY "Admins can delete tutors" ON public.tutors FOR DELETE TO authenticated USING (public.is_site_admin());

DROP POLICY IF EXISTS "Public can read active tuition posts" ON public.tuition_posts;
CREATE POLICY "Public can read active tuition posts" ON public.tuition_posts FOR SELECT TO anon, authenticated USING (is_active = true OR public.is_site_admin());
DROP POLICY IF EXISTS "Admins can insert tuition posts" ON public.tuition_posts;
CREATE POLICY "Admins can insert tuition posts" ON public.tuition_posts FOR INSERT TO authenticated WITH CHECK (public.is_site_admin());
DROP POLICY IF EXISTS "Admins can update tuition posts" ON public.tuition_posts;
CREATE POLICY "Admins can update tuition posts" ON public.tuition_posts FOR UPDATE TO authenticated USING (public.is_site_admin()) WITH CHECK (public.is_site_admin());
DROP POLICY IF EXISTS "Admins can delete tuition posts" ON public.tuition_posts;
CREATE POLICY "Admins can delete tuition posts" ON public.tuition_posts FOR DELETE TO authenticated USING (public.is_site_admin());

DROP POLICY IF EXISTS "Public can read published testimonials" ON public.testimonials;
CREATE POLICY "Public can read published testimonials" ON public.testimonials FOR SELECT TO anon, authenticated USING (is_published = true OR public.is_site_admin());
DROP POLICY IF EXISTS "Admins can insert testimonials" ON public.testimonials;
CREATE POLICY "Admins can insert testimonials" ON public.testimonials FOR INSERT TO authenticated WITH CHECK (public.is_site_admin());
DROP POLICY IF EXISTS "Admins can update testimonials" ON public.testimonials;
CREATE POLICY "Admins can update testimonials" ON public.testimonials FOR UPDATE TO authenticated USING (public.is_site_admin()) WITH CHECK (public.is_site_admin());
DROP POLICY IF EXISTS "Admins can delete testimonials" ON public.testimonials;
CREATE POLICY "Admins can delete testimonials" ON public.testimonials FOR DELETE TO authenticated USING (public.is_site_admin());

DROP POLICY IF EXISTS "Admins can read admin records" ON public.site_admins;
CREATE POLICY "Admins can read admin records" ON public.site_admins FOR SELECT TO authenticated USING (public.is_site_admin());
DROP POLICY IF EXISTS "Admins can insert admin records" ON public.site_admins;
CREATE POLICY "Admins can insert admin records" ON public.site_admins FOR INSERT TO authenticated WITH CHECK (public.is_site_admin());
DROP POLICY IF EXISTS "Admins can update admin records" ON public.site_admins;
CREATE POLICY "Admins can update admin records" ON public.site_admins FOR UPDATE TO authenticated USING (public.is_site_admin()) WITH CHECK (public.is_site_admin());
DROP POLICY IF EXISTS "Admins can delete admin records" ON public.site_admins;
CREATE POLICY "Admins can delete admin records" ON public.site_admins FOR DELETE TO authenticated USING (public.is_site_admin());
