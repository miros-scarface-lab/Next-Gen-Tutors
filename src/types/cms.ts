export type SiteSettings = {
  singleton: boolean;
  brand_name: string;
  hero_title: string;
  hero_description: string;
  contact_email: string;
  contact_phone: string;
  location: string;
  footer_description: string;
  updated_at: string;
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

export type CmsData = {
  settings: SiteSettings | null;
  tutors: Tutor[];
  tuitionPosts: TuitionPost[];
  testimonials: TestimonialRecord[];
};
