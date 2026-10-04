/*
# Harden Next Gen Tutors administrator access

1. Security Changes
- Remove inherited PUBLIC and anonymous execution permissions from the administrator-check function.
- Keep execution available only to signed-in users so the admin panel can verify its session.
- Remove direct table privileges from browser roles on `site_admins`; the table is accessed only inside the protected database function.

2. Important Notes
- Public website content permissions are unchanged.
- Administrator access remains controlled by membership in `site_admins`.
*/

REVOKE EXECUTE ON FUNCTION public.is_site_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_site_admin() FROM anon;
GRANT EXECUTE ON FUNCTION public.is_site_admin() TO authenticated;

REVOKE ALL ON TABLE public.site_admins FROM anon;
REVOKE ALL ON TABLE public.site_admins FROM authenticated;
