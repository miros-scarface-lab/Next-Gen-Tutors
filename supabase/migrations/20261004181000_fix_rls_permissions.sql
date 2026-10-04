/*
  # Fix RLS Permissions and Execute Rights for is_site_admin()

  1. Security Fixes
    - Grant EXECUTE permission on `public.is_site_admin()` function to `anon` and `authenticated` roles.
    - Simplify public SELECT policies for `tuition_posts` and `testimonials` to ensure smooth anonymous reads without permission errors.
*/

-- Grant execute rights to both anon and authenticated roles
GRANT EXECUTE ON FUNCTION public.is_site_admin() TO anon, authenticated;

-- Update Tuition Posts SELECT Policy
DROP POLICY IF EXISTS "Public can read active tuition posts" ON public.tuition_posts;
CREATE POLICY "Public can read active tuition posts" ON public.tuition_posts 
  FOR SELECT TO anon, authenticated 
  USING (is_active = true OR public.is_site_admin());

-- Update Testimonials SELECT Policy
DROP POLICY IF EXISTS "Public can read published testimonials" ON public.testimonials;
CREATE POLICY "Public can read published testimonials" ON public.testimonials 
  FOR SELECT TO anon, authenticated 
  USING (is_published = true OR public.is_site_admin());
