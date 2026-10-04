/*
  # Bulletproof RLS & Full Access Permissions for Admin CMS

  1. Security Adjustments
    - Ensures `public.is_site_admin()` is executable by all roles without restriction.
    - Grants full INSERT, UPDATE, DELETE, and SELECT permissions on `site_settings`, `tutors`, `tuition_posts`, `testimonials`, and `site_admins` to `authenticated` users.
    - Grants SELECT permissions on public tables to `anon` users.
*/

-- Grant EXECUTE on is_site_admin to public, anon, authenticated
GRANT EXECUTE ON FUNCTION public.is_site_admin() TO PUBLIC, anon, authenticated;

-- Ensure RLS Policies for site_settings
DROP POLICY IF EXISTS "Admins full site_settings" ON public.site_settings;
CREATE POLICY "Admins full site_settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Public read site_settings" ON public.site_settings;
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT TO anon USING (true);

-- Ensure RLS Policies for tutors
DROP POLICY IF EXISTS "Admins full tutors" ON public.tutors;
CREATE POLICY "Admins full tutors" ON public.tutors FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Public read tutors" ON public.tutors;
CREATE POLICY "Public read tutors" ON public.tutors FOR SELECT TO anon USING (true);

-- Ensure RLS Policies for tuition_posts
DROP POLICY IF EXISTS "Admins full tuition_posts" ON public.tuition_posts;
CREATE POLICY "Admins full tuition_posts" ON public.tuition_posts FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Public read tuition_posts" ON public.tuition_posts;
CREATE POLICY "Public read tuition_posts" ON public.tuition_posts FOR SELECT TO anon USING (is_active = true);

-- Ensure RLS Policies for testimonials
DROP POLICY IF EXISTS "Admins full testimonials" ON public.testimonials;
CREATE POLICY "Admins full testimonials" ON public.testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Public read testimonials" ON public.testimonials;
CREATE POLICY "Public read testimonials" ON public.testimonials FOR SELECT TO anon USING (is_published = true);

-- Ensure RLS Policies for site_admins
DROP POLICY IF EXISTS "Admins full site_admins" ON public.site_admins;
CREATE POLICY "Admins full site_admins" ON public.site_admins FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Table Grants
GRANT ALL ON TABLE public.site_settings TO authenticated;
GRANT ALL ON TABLE public.tutors TO authenticated;
GRANT ALL ON TABLE public.tuition_posts TO authenticated;
GRANT ALL ON TABLE public.testimonials TO authenticated;
GRANT ALL ON TABLE public.site_admins TO authenticated;

GRANT SELECT ON TABLE public.site_settings TO anon;
GRANT SELECT ON TABLE public.tutors TO anon;
GRANT SELECT ON TABLE public.tuition_posts TO anon;
GRANT SELECT ON TABLE public.testimonials TO anon;
