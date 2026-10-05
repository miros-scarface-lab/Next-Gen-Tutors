CREATE TABLE IF NOT EXISTS public.quick_questions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  icon_name text NOT NULL DEFAULT 'MessageCircle',
  question text NOT NULL,
  answer text NOT NULL,
  action_url text,
  action_text text,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.quick_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on quick_questions"
  ON public.quick_questions FOR SELECT
  USING (true);

CREATE POLICY "Allow admin all access on quick_questions"
  ON public.quick_questions FOR ALL
  USING (auth.uid() IN (SELECT id FROM admins));

-- Seed default questions
INSERT INTO public.quick_questions (icon_name, question, answer, action_url, action_text, sort_order) VALUES
('Building2', 'আপনারদের প্রতিষ্ঠানের নাম কী?', 'Next Gen Tutors', NULL, NULL, 1),
('MapPin', 'আপনারদের ঠিকানা কোথায়?', 'Pirojpur, Chittagong, Bangladesh', NULL, NULL, 2),
('PhoneCall', 'আপনারদের সাথে যোগাযোগের মাধ্যমগুলো কী কী?', 'আমাদের সাথে যোগাযোগের মাধ্যমসমূহ:
• WhatsApp: 01318126412
• Call: 01626881259, 01744854853
• Web: nextgen-tutors.netlify.app
• Email: nextgentutors247@gmail.com', 'https://wa.me/8801318126412', 'WhatsApp-এ যোগাযোগ করুন', 3),
('Clock', 'টিউটর পেতে কেমন সময় লাগতে পারে?', 'আপনার চাহিদা অনুযায়ী উপযুক্ত টিউটর খুঁজে পাওয়ার পর দ্রুত যোগাযোগ করা হবে।', NULL, NULL, 4),
('Banknote', 'আপনারদের টিউশন ফি কত?', 'টিউশন ফি শ্রেণি, বিষয়, পড়ানোর স্থান ও সময়ের ওপর নির্ভর করে। বিস্তারিত জানতে যোগাযোগ করুন।', 'https://wa.me/8801318126412?text=হ্যালো!%20টিউশন%20ফি%20সম্পর্কে%20জানতে%20চাই।', 'WhatsApp-এ ফি জানুন', 5),
('GraduationCap', 'টিউশন করাতে চাইলে কী করতে হবে?', 'আপনার নাম, শিক্ষাগত যোগ্যতা, অভিজ্ঞতা, বিষয় ও অবস্থান জানিয়ে CV/বিস্তারিত তথ্য পাঠান।', 'https://wa.me/8801318126412?text=হ্যালো!%20আমি%20টিউশন%20করাতে%20চাই।', 'CV পাঠান WhatsApp-এ', 6),
('BookOpen', 'টিউটর খুঁজলে কী কী তথ্য দিতে হবে?', 'আপনার শ্রেণি, বিষয়, এলাকা ও পছন্দের সময় জানাবেন।', 'https://wa.me/8801318126412?text=হ্যালো!%20আমার%20একজন%20টিউটর%20প্রয়োজন।', 'টিউটর রিকোয়েস্ট পাঠান', 7)
ON CONFLICT DO NOTHING;
