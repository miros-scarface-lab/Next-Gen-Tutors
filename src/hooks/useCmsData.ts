import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { CmsData, SiteSettings, TestimonialRecord, TuitionPost, Tutor } from '@/types/cms';

const emptyData: CmsData = {
  settings: null,
  tutors: [],
  tuitionPosts: [],
  testimonials: [],
};

export function useCmsData() {
  const [data, setData] = useState<CmsData>(emptyData);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [settingsResult, tutorsResult, tuitionResult, testimonialsResult] = await Promise.all([
        supabase.from('site_settings').select('*').maybeSingle<SiteSettings>(),
        supabase.from('tutors').select('*').order('is_featured', { ascending: false }).order('created_at', { ascending: false }),
        supabase.from('tuition_posts').select('*').eq('is_active', true).order('created_at', { ascending: false }),
        supabase.from('testimonials').select('*').eq('is_published', true).order('sort_order', { ascending: true }),
      ]);

      if (!settingsResult.error && !tutorsResult.error && !tuitionResult.error && !testimonialsResult.error) {
        setData({
          settings: settingsResult.data,
          tutors: (tutorsResult.data ?? []) as Tutor[],
          tuitionPosts: (tuitionResult.data ?? []) as TuitionPost[],
          testimonials: (testimonialsResult.data ?? []) as TestimonialRecord[],
        });
      }
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
