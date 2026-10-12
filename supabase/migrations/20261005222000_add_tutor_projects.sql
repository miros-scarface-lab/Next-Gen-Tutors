-- Add projects jsonb column to tutors table
ALTER TABLE public.tutors 
ADD COLUMN IF NOT EXISTS projects jsonb DEFAULT '[]'::jsonb;
