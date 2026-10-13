export type SiteSettings = {
  singleton: boolean;
  brand_name: string;
  hero_title: string;
  hero_description: string;
  hero_badge_text: string;
  hero_image_url: string;
  features_title: string;
  features_subtitle: string;
  how_it_works_title: string;
  how_it_works_subtitle: string;
  directory_title: string;
  directory_subtitle: string;
  testimonials_title: string;
  testimonials_subtitle: string;
  cta_title: string;
  cta_description: string;
  cta_badge_text: string;
  contact_email: string;
  contact_phone: string;
  location: string;
  footer_description: string;
  updated_at: string;
  custom_texts: Record<string, any>;
};

export const defaultSiteSettings: SiteSettings = {
  singleton: true,
  brand_name: 'Mentorio Pirojpur',
  hero_title: 'আপনার সন্তানের জন্য সেরা ও অভিজ্ঞ টিউটর খুঁজুন',
  hero_description: 'পিরোজপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়ের (PrSTU) অভিজ্ঞ ও বিশ্বস্ত টিউটরদের সাথে সরাসরি যোগাযোগ করুন। কোনো মধ্যস্বত্বভোগী বা কমিশন ছাড়াই।',
  hero_badge_text: '১০০% কমিশন-মুক্ত প্ল্যাটফর্ম',
  hero_image_url: '/hero-image.png',
  features_title: 'আমাদের প্ল্যাটফর্মের বিশেষ সুবিধাসমূহ',
  features_subtitle: 'অভিভাবক ও শিক্ষকদের মধ্যে সরাসরি যোগাযোগের সুবিধাজনক সিস্টেম।',
  how_it_works_title: 'কীভাবে আপনার টিউটর খুঁজে পাবেন',
  how_it_works_subtitle: 'মাত্র ৪টি সহজ ধাপ অনুসরণ করে যুক্ত হন আপনার পছন্দের টিউটরের সাথে।',
  directory_title: 'আমাদের যাচাইকৃত সেরা টিউটরবৃন্দ',
  directory_subtitle: 'Mentorio Pirojpur-এর সেরা ও অভিজ্ঞ টিউটরদের সাথে সরাসরি যোগাযোগ করুন।',
  testimonials_title: 'অভিভাবক ও শিক্ষকদের অনুভূতি',
  testimonials_subtitle: 'আমাদের ব্যবহারকারী সম্মানিত অভিভাবক ও টিউটরদের বাস্তব অভিজ্ঞতা।',
  cta_title: 'কয়েক মিনিটেই আপনার পছন্দের টিউটর খুঁজে নিন',
  cta_description: 'সরাসরি টিউটরের সাথে কথা বলুন — দ্রুত, সহজ এবং ১০০% কমিশন মুক্ত। Mentorio Pirojpur-এর সাথেই যুক্ত থাকুন।',
  cta_badge_text: 'ওয়েব ও মোবাইলে সহজলভ্য',
  contact_email: 'nextgentutors247@gmail.com',
  contact_phone: '01318126412',
  location: 'Pirojpur, Barishal, Bangladesh',
  footer_description: 'অভিজ্ঞ ও দক্ষ টিউটরদের সাথে সরাসরি যোগাযোগ করে পড়াশোনায় সেরা সাফল্য অর্জন করুন। কোনো মিডিয়া ফি ছাড়াই শতভাগ বিশ্বস্ত সেবা।',
  updated_at: '',
  custom_texts: {},
};

export type TutorProject = {
  id?: string;
  title: string;
  description: string;
  image_url: string;
  link_url?: string;
};

export type Tutor = {
  id: string;
  name: string;
  department?: string;
  student_level?: string;
  whatsapp_number?: string;
  headline: string;
  bio: string;
  subjects: string[];
  location: string;
  avatar_url: string;
  rating: number;
  is_verified: boolean;
  is_featured: boolean;
  projects?: TutorProject[];
  created_at: string;
  updated_at: string;
};

export type TuitionPost = {
  id: string;
  title: string;
  subject: string;
  grade_level: string;
  location: string;
  mode: string;
  budget: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type TestimonialRecord = {
  id: string;
  quote: string;
  name: string;
  title: string;
  organization: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type QuickQuestionRecord = {
  id: string;
  icon_name: string;
  question: string;
  answer: string;
  action_url?: string;
  action_text?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type TuitionRequest = {
  id: string;
  guardian_name: string;
  guardian_phone: string;
  guardian_email?: string;
  student_class: string;
  subjects: string;
  preferred_gender?: string;
  preferred_university?: string;
  salary_budget: string;
  days_per_week?: string;
  location: string;
  notes?: string;
  status: 'pending' | 'contacted' | 'assigned' | 'cancelled';
  created_at?: string;
  updated_at?: string;
};

export type CmsData = {
  settings: SiteSettings | null;
  tutors: Tutor[];
  tuitionPosts: TuitionPost[];
  testimonials: TestimonialRecord[];
  quickQuestions: QuickQuestionRecord[];
  tuitionRequests?: TuitionRequest[];
};


