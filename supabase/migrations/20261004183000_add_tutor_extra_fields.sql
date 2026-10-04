/*
  # Add Department, Student Level, and WhatsApp Number to Tutors

  1. New Columns in `public.tutors`
    - `department` (text): Department & University/Institution name
    - `student_level` (text): Year/Level status (e.g. 4th Year Student)
    - `whatsapp_number` (text): WhatsApp contact number (defaults to 01318126412)
*/

ALTER TABLE public.tutors 
  ADD COLUMN IF NOT EXISTS department text DEFAULT '',
  ADD COLUMN IF NOT EXISTS student_level text DEFAULT '',
  ADD COLUMN IF NOT EXISTS whatsapp_number text DEFAULT '01318126412';

-- Update existing sample tutors with rich initial values
UPDATE public.tutors 
SET 
  department = 'EEE, Islamic University of Technology (IUT)',
  student_level = '4th Year Student',
  whatsapp_number = '01318126412'
WHERE name LIKE '%Istiak%';

UPDATE public.tutors 
SET 
  department = 'EEE, Bangladesh University of Engineering & Technology (BUET)',
  student_level = 'Graduate / Olympiad Trainer',
  whatsapp_number = '01318126412'
WHERE name LIKE '%Rasel%';

UPDATE public.tutors 
SET 
  department = 'Disaster Science, Dhaka University (DU)',
  student_level = '3rd Year Student',
  whatsapp_number = '01318126412'
WHERE name LIKE '%Abrar%';
