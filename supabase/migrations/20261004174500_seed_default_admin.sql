/*
  # Seed Default Admin Account

  Sets up default admin user:
  - Username: admins (mapped to admins@nextgentutors.com)
  - Password: 12340987
*/

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

DO $$
DECLARE
  admin_user_id uuid := gen_random_uuid();
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
      recovery_token,
      confirmation_token,
      email_change_token_new,
      email_change,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      created_at,
      updated_at,
      phone,
      phone_confirmed_at,
      phone_change,
      phone_change_token,
      email_change_token_current,
      email_change_confirm_status,
      banned_until,
      reauthentication_token,
      reauthentication_sent_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      admin_user_id,
      'authenticated',
      'authenticated',
      'admins@nextgentutors.com',
      extensions.crypt('12340987', extensions.gen_salt('bf')),
      now(),
      '',
      '',
      '',
      '',
      '{"provider": "email", "providers": ["email"]}',
      '{"username": "admins"}',
      false,
      now(),
      now(),
      NULL,
      NULL,
      '',
      '',
      '',
      0,
      NULL,
      '',
      NULL
    );

    INSERT INTO public.site_admins (user_id)
    VALUES (admin_user_id)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
END $$;
