import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { defaultSiteSettings } from '@/types/cms';
import type { CmsData, SiteSettings, TestimonialRecord, TuitionPost, Tutor, QuickQuestionRecord } from '@/types/cms';

export const CMS_CACHE_KEY = 'mentorio_cms_data_cache_v2';

function getInitialData(): CmsData {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(CMS_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === 'object') {
          return {
            settings: { ...defaultSiteSettings, ...(parsed.settings || {}) },
            tutors: Array.isArray(parsed.tutors) ? parsed.tutors : [],
            tuitionPosts: Array.isArray(parsed.tuitionPosts) ? parsed.tuitionPosts : [],
            testimonials: Array.isArray(parsed.testimonials) ? parsed.testimonials : [],
            quickQuestions: Array.isArray(parsed.quickQuestions) ? parsed.quickQuestions : [],
          };
        }
      }
    } catch {
      // ignore JSON parse error
    }
  }

  return {
    settings: defaultSiteSettings,
    tutors: [],
    tuitionPosts: [],
    testimonials: [],
    quickQuestions: [],
  };
}

export function useCmsData() {
  const [data, setData] = useState<CmsData>(getInitialData);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [settingsResult, tutorsResult, tuitionResult, testimonialsResult, questionsResult] = await Promise.all([
        supabase.from('site_settings').select('*').maybeSingle<SiteSettings>(),
        supabase.from('tutors').select('*').order('created_at', { ascending: false }),
        supabase.from('tuition_posts').select('*').eq('is_active', true).order('created_at', { ascending: false }),
        supabase.from('testimonials').select('*').eq('is_published', true).order('sort_order', { ascending: true }),
        supabase.from('quick_questions').select('*').order('sort_order', { ascending: true }),
      ]);

      if (settingsResult.error) console.error('Settings error:', settingsResult.error);
      if (tutorsResult.error) console.error('Tutors error:', tutorsResult.error);
      if (tuitionResult.error) console.error('Tuition error:', tuitionResult.error);
      if (testimonialsResult.error) console.error('Testimonials error:', testimonialsResult.error);
      if (questionsResult.error) console.error('Questions error:', questionsResult.error);

      const settingsData = settingsResult.data ? { ...defaultSiteSettings, ...settingsResult.data } : defaultSiteSettings;
      const rawCustomTexts = settingsData.custom_texts || {};

      const tutorsList = (tutorsResult.data ?? []).map((tutor: any) => ({
        ...tutor,
        projects: (Array.isArray(tutor.projects) && tutor.projects.length > 0)
          ? tutor.projects
          : (rawCustomTexts[`tutor_projects_${tutor.id}`] || tutor.projects || []),
      })) as Tutor[];

      // Sort featured tutors first
      tutorsList.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));

      const freshData: CmsData = {
        settings: settingsData,
        tutors: tutorsList,
        tuitionPosts: (tuitionResult.data ?? []) as TuitionPost[],
        testimonials: (testimonialsResult.data ?? []) as TestimonialRecord[],
        quickQuestions: (questionsResult.data ?? []) as QuickQuestionRecord[],
      };

      setData(freshData);

      try {
        localStorage.setItem(CMS_CACHE_KEY, JSON.stringify(freshData));
      } catch {
        // ignore quota errors
      }
    } catch (error) {
      console.error('Could not load public CMS content', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();

    const handleSync = () => {
      setData(getInitialData());
    };
    window.addEventListener('mentorio_cms_updated', handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      window.removeEventListener('mentorio_cms_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [load]);

  return { data, loading, reload: load };
}
