import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { CmsData, SiteSettings, TestimonialRecord, TuitionPost, Tutor, QuickQuestionRecord } from '@/types/cms';

const emptyData: CmsData = {
  settings: null,
  tutors: [],
  tuitionPosts: [],
  testimonials: [],
  quickQuestions: [],
};

export function useCmsData() {
  const [data, setData] = useState<CmsData>(emptyData);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [settingsResult, tutorsResult, tuitionResult, testimonialsResult, questionsResult] = await Promise.all([
        supabase.from('site_settings').select('*').maybeSingle<SiteSettings>(),
        supabase.from('tutors').select('*').order('is_featured', { ascending: false }).order('created_at', { ascending: false }),
        supabase.from('tuition_posts').select('*').eq('is_active', true).order('created_at', { ascending: false }),
        supabase.from('testimonials').select('*').eq('is_published', true).order('sort_order', { ascending: true }),
        supabase.from('quick_questions').select('*').order('sort_order', { ascending: true }),
      ]);

      if (settingsResult.error) console.error('Settings error:', settingsResult.error);
      if (tutorsResult.error) console.error('Tutors error:', tutorsResult.error);
      if (tuitionResult.error) console.error('Tuition error:', tuitionResult.error);
      if (testimonialsResult.error) console.error('Testimonials error:', testimonialsResult.error);
      if (questionsResult.error) console.error('Questions error:', questionsResult.error);

      const settingsData = settingsResult.data || null;

      setData({
        settings: settingsData,
        tutors: (tutorsResult.data ?? []) as Tutor[],
        tuitionPosts: (tuitionResult.data ?? []) as TuitionPost[],
        testimonials: (testimonialsResult.data ?? []) as TestimonialRecord[],
        quickQuestions: (questionsResult.data ?? []) as QuickQuestionRecord[],
      });
    } catch (error) {
      console.error('Could not load public CMS content', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, loading, reload: load };
}

