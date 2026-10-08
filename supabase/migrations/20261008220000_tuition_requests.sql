/*
  # Tuition Requests Table Setup
  
  1. New Table: `public.tuition_requests`
    - `id` (uuid, primary key)
    - `guardian_name` (text, not null)
    - `guardian_phone` (text, not null)
    - `guardian_email` (text, default '')
    - `student_class` (text, not null)
    - `subjects` (text, not null)
    - `preferred_gender` (text, default 'Any')
    - `preferred_university` (text, default '')
    - `salary_budget` (text, not null)
    - `days_per_week` (text, default '3 Days/Week')
    - `location` (text, not null)
    - `notes` (text, default '')
    - `status` (text, default 'pending')
    - `created_at` (timestamptz, default now())
    - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `public.tuition_requests`
    - Allow anyone (public/authenticated) to insert new requests
    - Allow admins to select, update, and delete all requests
*/

CREATE TABLE IF NOT EXISTS public.tuition_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guardian_name text NOT NULL,
  guardian_phone text NOT NULL,
  guardian_email text NOT NULL DEFAULT '',
  student_class text NOT NULL,
  subjects text NOT NULL,
  preferred_gender text NOT NULL DEFAULT 'Any',
  preferred_university text NOT NULL DEFAULT '',
  salary_budget text NOT NULL,
  days_per_week text NOT NULL DEFAULT '3 Days/Week',
  location text NOT NULL,
  notes text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'assigned', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index for fast status querying
CREATE INDEX IF NOT EXISTS tuition_requests_created_idx ON public.tuition_requests (created_at DESC);

-- Enable RLS
ALTER TABLE public.tuition_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Anyone can insert tuition requests" ON public.tuition_requests;
CREATE POLICY "Anyone can insert tuition requests" ON public.tuition_requests 
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view non-cancelled requests" ON public.tuition_requests;
CREATE POLICY "Public can view non-cancelled requests" ON public.tuition_requests 
  FOR SELECT TO anon, authenticated USING (status != 'cancelled' OR public.is_site_admin());

DROP POLICY IF EXISTS "Admins can update tuition requests" ON public.tuition_requests;
CREATE POLICY "Admins can update tuition requests" ON public.tuition_requests 
  FOR UPDATE TO authenticated USING (public.is_site_admin()) WITH CHECK (public.is_site_admin());

DROP POLICY IF EXISTS "Admins can delete tuition requests" ON public.tuition_requests;
CREATE POLICY "Admins can delete tuition requests" ON public.tuition_requests 
  FOR DELETE TO authenticated USING (public.is_site_admin());
