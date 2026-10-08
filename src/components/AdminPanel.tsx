import { FormEvent, useCallback, useEffect, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Download,
  GraduationCap,
  LogOut,
  Plus,
  RefreshCw,
  Save,
  Search,
  Shield,
  ShieldCheck,
  Star,
  Trash2,
  Users,
  X,
  Zap,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { SiteSettings, TestimonialRecord, TuitionPost, Tutor, QuickQuestionRecord, TuitionRequest } from '@/types/cms';
import { siteSettingsSchema } from '@/lib/schema';

type AdminTab = 'dashboard' | 'settings' | 'tutors' | 'tuition' | 'testimonials' | 'faqs' | 'requests';

type TutorForm = Omit<Tutor, 'id' | 'created_at' | 'updated_at'>;
type TuitionForm = Omit<TuitionPost, 'id' | 'created_at' | 'updated_at'>;
type TestimonialForm = Omit<TestimonialRecord, 'id' | 'created_at' | 'updated_at'>;
type QuickQuestionForm = Omit<QuickQuestionRecord, 'id' | 'created_at' | 'updated_at'>;

const emptyQuickQuestion: QuickQuestionForm = {
  icon_name: 'MessageCircle',
  question: '',
  answer: '',
  action_url: '',
  action_text: '',
  sort_order: 0,
};

const defaultSettings: SiteSettings = {
  singleton: true,
  brand_name: 'Next Gen Tutors',
  hero_title: 'আপনার সন্তানের জন্য সেরা ও অভিজ্ঞ টিউটর খুঁজুন',
  hero_description:
    'বুয়েট, ঢাকা বিশ্ববিদ্যালয়, আইইউটি ও মেডিকেল সহ শীর্ষ বিশ্ববিদ্যালয়ের অভিজ্ঞ ও বিশ্বস্ত টিউটরদের সাথে সরাসরি যোগাযোগ করুন। কোনো মধ্যস্বত্বভোগী বা কমিশন ছাড়াই।',
  hero_badge_text: '১০০% কমিশন-মুক্ত প্ল্যাটফর্ম',
  hero_image_url: 'https://images.pexels.com/photos/5311406/pexels-photo-5311406.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  features_title: 'আমাদের প্ল্যাটফর্মের বিশেষ সুবিধাসমূহ',
  features_subtitle: 'অভিভাবক ও শিক্ষকদের মধ্যে সরাসরি যোগাযোগের সুবিধাজনক সিস্টেম।',
  how_it_works_title: 'কীভাবে আপনার টিউটর খুঁজে পাবেন',
  how_it_works_subtitle: 'মাত্র ৪টি সহজ ধাপ অনুসরণ করে যুক্ত হন আপনার পছন্দের টিউটরের সাথে।',
  directory_title: 'আমাদের যাচাইকৃত সেরা টিউটরবৃন্দ',
  directory_subtitle: 'Next Gen Tutors-এর সেরা ও অভিজ্ঞ টিউটরদের সাথে সরাসরি যোগাযোগ করুন।',
  testimonials_title: 'অভিভাবক ও শিক্ষকদের অনুভূতি',
  testimonials_subtitle: 'আমাদের ব্যবহারকারী সম্মানিত অভিভাবক ও টিউটরদের বাস্তব অভিজ্ঞতা।',
  cta_title: 'কয়েক মিনিটেই আপনার পছন্দের টিউটর খুঁজে নিন',
  cta_description: 'সরাসরি টিউটরের সাথে কথা বলুন — দ্রুত, সহজ এবং ১০০% কমিশন মুক্ত।',
  cta_badge_text: 'ওয়েব ও মোবাইলে সহজলভ্য',
  contact_email: 'nextgentutors247@gmail.com',
  contact_phone: '01318126412',
  location: 'Pirojpur, Chittagong, Bangladesh',
  footer_description: 'অভিজ্ঞ ও দক্ষ টিউটরদের সাথে সরাসরি যোগাযোগ করে পড়াশোনায় সেরা সাফল্য অর্জন করুন। কোনো মিডিয়া ফি ছাড়াই শতভাগ বিশ্বস্ত সেবা।',
  updated_at: '',
  custom_texts: {},
};

const avatarPresets = [
  { name: 'Male 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
  { name: 'Male 2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
  { name: 'Male 3', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
  { name: 'Female 1', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80' },
  { name: 'Female 2', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80' },
];

const emptyTutor: TutorForm = {
  name: '',
  department: '',
  student_level: '',
  whatsapp_number: '01318126412',
  headline: '',
  bio: '',
  subjects: [],
  location: '',
  avatar_url: '',
  rating: 5,
  is_verified: false,
  is_featured: false,
};
const emptyTuition: TuitionForm = {
  title: '',
  subject: '',
  grade_level: '',
  location: '',
  mode: 'In-person',
  budget: '',
  description: '',
  is_active: true,
};
const emptyTestimonial: TestimonialForm = {
  quote: '',
  name: '',
  title: '',
  organization: '',
  sort_order: 0,
  is_published: true,
};

export default function AdminPanel() {
  const [sessionReady, setSessionReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [tab, setTab] = useState<AdminTab>('dashboard');

  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [tuitionPosts, setTuitionPosts] = useState<TuitionPost[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialRecord[]>([]);
  const [quickQuestions, setQuickQuestions] = useState<QuickQuestionRecord[]>([]);
  const [tuitionRequests, setTuitionRequests] = useState<TuitionRequest[]>([]);

  const [tutorForm, setTutorForm] = useState<TutorForm>(emptyTutor);
  const [tuitionForm, setTuitionForm] = useState<TuitionForm>(emptyTuition);
  const [testimonialForm, setTestimonialForm] = useState<TestimonialForm>(emptyTestimonial);
  const [questionForm, setQuestionForm] = useState<QuickQuestionForm>(emptyQuickQuestion);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadCms = useCallback(async () => {
    const [settingsResult, tutorsResult, tuitionResult, testimonialsResult, questionsResult, requestsResult] = await Promise.all([
      supabase.from('site_settings').select('*').maybeSingle(),
      supabase.from('tutors').select('*').order('created_at', { ascending: false }),
      supabase.from('tuition_posts').select('*').order('created_at', { ascending: false }),
      supabase.from('testimonials').select('*').order('sort_order', { ascending: true }),
      supabase.from('quick_questions').select('*').order('sort_order', { ascending: true }),
      supabase.from('tuition_requests').select('*').order('created_at', { ascending: false }),
    ]);
    if (settingsResult.data) setSettings(settingsResult.data as SiteSettings);
    if (tutorsResult.data) setTutors(tutorsResult.data as Tutor[]);
    if (tuitionResult.data) setTuitionPosts(tuitionResult.data as TuitionPost[]);
    if (testimonialsResult.data) setTestimonials(testimonialsResult.data as TestimonialRecord[]);
    if (questionsResult.data) setQuickQuestions(questionsResult.data as QuickQuestionRecord[]);
    if (requestsResult.data) setTuitionRequests(requestsResult.data as TuitionRequest[]);
  }, []);

  const checkSession = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      setSessionReady(true);
      return;
    }
    const { data: adminResult } = await supabase.rpc('is_site_admin');
    setIsAdmin(Boolean(adminResult));
    setSessionReady(true);
    if (adminResult) await loadCms();
  }, [loadCms]);

  useEffect(() => {
    void checkSession();
    const { data } = supabase.auth.onAuthStateChange(() => {
      void checkSession();
    });
    return () => data.subscription.unsubscribe();
  }, [checkSession]);

  const showNotification = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 4000);
  };

  const handleAuth = async (event: FormEvent) => {
    event.preventDefault();
    setAuthError('');
    const inputVal = username.trim();
    const loginEmail = inputVal.includes('@') ? inputVal : `${inputVal}@nextgentutors.com`;
    const result = await supabase.auth.signInWithPassword({ email: loginEmail, password });
    if (result.error) {
      setAuthError('Invalid username or password.');
      return;
    }
  };

  const save = async (action: () => PromiseLike<{ error: { message?: string; details?: string } | null }>, success: string) => {
    setSaving(true);
    const result = await action();
    setSaving(false);
    if (result.error) {
      const errMsg = result.error.message || result.error.details || JSON.stringify(result.error);
      showNotification(`Error: ${errMsg}`);
      return false;
    }
    showNotification(success);
    await loadCms();
    return true;
  };

  const saveSettings = async (event: FormEvent) => {
    event.preventDefault();
    await save(
      () => supabase.from('site_settings').upsert(settings, { onConflict: 'singleton' }),
      'Website settings saved successfully.'
    );
  };

  const saveTutor = async (event: FormEvent) => {
    event.preventDefault();
    const payload = { ...tutorForm, subjects: tutorForm.subjects.filter(Boolean) };
    const result = editingId
      ? await save(() => supabase.from('tutors').update(payload).eq('id', editingId), 'Tutor updated.')
      : await save(() => supabase.from('tutors').insert(payload), 'New tutor added.');
    if (result) {
      setTutorForm(emptyTutor);
      setEditingId(null);
    }
  };

  const saveTuition = async (event: FormEvent) => {
    event.preventDefault();
    const result = editingId
      ? await save(() => supabase.from('tuition_posts').update(tuitionForm).eq('id', editingId), 'Tuition post updated.')
      : await save(() => supabase.from('tuition_posts').insert(tuitionForm), 'New tuition post created.');
    if (result) {
      setTuitionForm(emptyTuition);
      setEditingId(null);
    }
  };

  const saveTestimonial = async (event: FormEvent) => {
    event.preventDefault();
    const result = editingId
      ? await save(() => supabase.from('testimonials').update(testimonialForm).eq('id', editingId), 'Testimonial updated.')
      : await save(() => supabase.from('testimonials').insert(testimonialForm), 'New testimonial added.');
    if (result) {
      setTestimonialForm(emptyTestimonial);
      setEditingId(null);
    }
  };

  const saveQuestion = async (event: FormEvent) => {
    event.preventDefault();
    const result = editingId
      ? await save(() => supabase.from('quick_questions').update(questionForm).eq('id', editingId), 'Question updated.')
      : await save(() => supabase.from('quick_questions').insert(questionForm), 'New question added.');
    if (result) {
      setQuestionForm(emptyQuickQuestion);
      setEditingId(null);
    }
  };

  const updateRequestStatus = async (id: string, status: 'pending' | 'contacted' | 'assigned' | 'cancelled') => {
    await save(
      () => supabase.from('tuition_requests').update({ status }).eq('id', id),
      'Guardian request status updated.'
    );
  };

  const remove = async (table: string, id: string) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    await save(() => supabase.from(table).delete().eq('id', id), 'Record removed successfully.');
  };

  const deleteTutor = async (tutor: Tutor) => {
    if (
      !window.confirm(
        `Are you sure you want to delete tutor "${tutor.name}"? This will permanently remove their profile picture as well.`
      )
    )
      return;

    setSaving(true);
    try {
      // 1. Delete image from Supabase storage if uploaded there
      if (tutor.avatar_url && tutor.avatar_url.includes('tutor-avatars')) {
        const parts = tutor.avatar_url.split('/tutor-avatars/');
        if (parts.length > 1) {
          const filePath = parts[1].split('?')[0];
          await supabase.storage.from('tutor-avatars').remove([filePath]);
        }
      }

      // 2. Delete tutor from database
      const result = await save(
        () => supabase.from('tutors').delete().eq('id', tutor.id),
        `Tutor "${tutor.name}" and profile picture removed successfully.`
      );

      if (result && editingId === tutor.id) {
        setEditingId(null);
        setTutorForm(emptyTutor);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showNotification(`Error deleting tutor: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `tutor_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

      // 1. Attempt upload to Supabase storage bucket 'tutor-avatars'
      const { data, error } = await supabase.storage.from('tutor-avatars').upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage.from('tutor-avatars').getPublicUrl(fileName);
        setTutorForm((prev) => ({ ...prev, avatar_url: publicUrlData.publicUrl }));
        showNotification('Direct image uploaded & stored in storage bucket!');
      } else {
        console.warn('Storage bucket upload notice, falling back to data URL:', error);
        // 2. Fallback: Compress and read as base64 Data URL
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.src = e.target?.result as string;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 600;
            const MAX_HEIGHT = 600;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            setTutorForm((prev) => ({ ...prev, avatar_url: dataUrl }));
            showNotification('Image uploaded and processed successfully!');
          };
        };
        reader.readAsDataURL(file);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showNotification(`Upload error: ${msg}`);
    } finally {
      setUploadingImage(false);
      event.target.value = '';
    }
  };

  // Instant inline quick-toggles
  const toggleTutorVerified = async (tutor: Tutor) => {
    await save(
      () => supabase.from('tutors').update({ is_verified: !tutor.is_verified }).eq('id', tutor.id),
      `${tutor.name} verification status updated.`
    );
  };

  const toggleTutorFeatured = async (tutor: Tutor) => {
    await save(
      () => supabase.from('tutors').update({ is_featured: !tutor.is_featured }).eq('id', tutor.id),
      `${tutor.name} featured status updated.`
    );
  };

  const toggleTuitionActive = async (post: TuitionPost) => {
    await save(
      () => supabase.from('tuition_posts').update({ is_active: !post.is_active }).eq('id', post.id),
      `Tuition post status changed.`
    );
  };

  const toggleTestimonialPublished = async (item: TestimonialRecord) => {
    await save(
      () => supabase.from('testimonials').update({ is_published: !item.is_published }).eq('id', item.id),
      `Testimonial visibility updated.`
    );
  };

  const exportBackupJson = () => {
    const dataObj = { settings, tutors, tuitionPosts, testimonials, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(dataObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nextgen-tutors-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showNotification('Backup downloaded successfully!');
  };

  const startTutorEdit = (item: Tutor) => {
    setEditingId(item.id);
    setTutorForm({
      name: item.name,
      department: item.department || '',
      student_level: item.student_level || '',
      whatsapp_number: item.whatsapp_number || '01318126412',
      headline: item.headline,
      bio: item.bio,
      subjects: item.subjects,
      location: item.location,
      avatar_url: item.avatar_url,
      rating: item.rating,
      is_verified: item.is_verified,
      is_featured: item.is_featured,
    });
  };

  const startTuitionEdit = (item: TuitionPost) => {
    setEditingId(item.id);
    setTuitionForm({
      title: item.title,
      subject: item.subject,
      grade_level: item.grade_level,
      location: item.location,
      mode: item.mode,
      budget: item.budget,
      description: item.description,
      is_active: item.is_active,
    });
  };

  const startTestimonialEdit = (item: TestimonialRecord) => {
    setEditingId(item.id);
    setTestimonialForm({
      quote: item.quote,
      name: item.name,
      title: item.title,
      organization: item.organization,
      sort_order: item.sort_order,
      is_published: item.is_published,
    });
  };

  if (!sessionReady)
    return (
      <div className="min-h-screen bg-ink-50 flex items-center justify-center text-ink-600">
        <RefreshCw className="w-6 h-6 animate-spin text-primary-600 mr-2" /> Loading admin portal...
      </div>
    );

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-ink-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl border border-ink-100 shadow-xl p-8">
          <a href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to website
          </a>
          <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-5">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-bold text-ink-900">Admin Login</h1>
          <p className="mt-3 text-ink-600">Sign in with your administrator credentials to manage website content.</p>
          <form onSubmit={handleAuth} className="mt-7 space-y-4">
            <input
              required
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="admin-input"
            />
            <input
              required
              minLength={6}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="admin-input"
            />
            {authError && <p className="rounded-xl bg-error-50 px-4 py-3 text-sm text-error-700">{authError}</p>}
            <button className="w-full admin-button" type="submit">
              Sign in
            </button>
          </form>
        </div>
      </div>
    );
  }

  const tabItems: { id: AdminTab; label: string; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard Overview' },
    { id: 'requests', label: 'Guardian Requests', badge: tuitionRequests.length },
    { id: 'settings', label: 'Website Settings' },
    { id: 'tutors', label: 'Tutors', badge: tutors.length },
    { id: 'tuition', label: 'Tuition Posts', badge: tuitionPosts.length },
    { id: 'testimonials', label: 'Testimonials', badge: testimonials.length },
    { id: 'faqs', label: 'Quick FAQs', badge: quickQuestions.length },
  ];

  const filteredTutors = tutors.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subjects.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredTuition = tuitionPosts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTestimonials = testimonials.filter(
    (tm) =>
      tm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tm.quote.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tm.organization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Top Header Bar */}
      <header className="bg-white border-b border-ink-100 sticky top-0 z-20 shadow-sm">
        <div className="container-max py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center font-bold text-lg">
              NT
            </div>
            <div>
              <p className="text-xs font-bold text-primary-600 uppercase tracking-wider">Next Gen Tutors</p>
              <h1 className="text-xl font-bold text-ink-900">Admin Control Center</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={exportBackupJson} className="admin-secondary text-xs flex items-center gap-1.5">
              <Download className="w-4 h-4 text-primary-600" /> Export Backup
            </button>
            <a href="/" className="hidden sm:inline-flex admin-secondary text-xs">
              <ArrowLeft className="w-4 h-4" /> Live Site
            </a>
            <button
              onClick={() => {
                void supabase.auth.signOut();
                setIsAdmin(false);
              }}
              className="admin-secondary text-xs hover:bg-error-50 hover:text-error-600"
            >
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="container-max py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
          {tabItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setTab(item.id);
                setEditingId(null);
                setSearchQuery('');
              }}
              className={`whitespace-nowrap px-4 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
                tab === item.id
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                  : 'bg-white text-ink-600 border border-ink-200 hover:border-primary-300'
              }`}
            >
              {item.label}
              {typeof item.badge === 'number' && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    tab === item.id ? 'bg-white/20 text-white' : 'bg-ink-100 text-ink-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Global Toast Notification */}
        {notice && (
          <div className={`mb-6 rounded-2xl px-5 py-3.5 text-sm font-semibold flex items-center justify-between shadow-sm animate-fade-in ${
            notice.startsWith('Error')
              ? 'bg-error-50 border border-error-200 text-error-800'
              : 'bg-success-50 border border-success-200 text-success-800'
          }`}>
            <div className="flex items-center gap-2.5">
              <Check className={`w-5 h-5 ${notice.startsWith('Error') ? 'text-error-600' : 'text-success-600'}`} />
              <span>{notice}</span>
            </div>
            <button onClick={() => setNotice('')} className={`${notice.startsWith('Error') ? 'text-error-600 hover:text-error-900' : 'text-success-600 hover:text-success-900'}`}>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* GUARDIAN REQUESTS TAB */}
        {tab === 'requests' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">অভিভাবক টিউশন রিকোয়েস্টসমূহ</h2>
                <p className="text-xs text-slate-500 mt-1">অভিভাবকদের জমাকৃত টিউশন চাহিদা পর্যবেক্ষণ, ফিল্টার ও স্ট্যাটাস আপডেট করুন</p>
              </div>
              <div className="text-xs font-bold bg-indigo-50 border border-indigo-200 text-indigo-700 px-3 py-1.5 rounded-lg">
                মোট রিকোয়েস্ট: {tuitionRequests.length} টি
              </div>
            </div>

            {tuitionRequests.length > 0 ? (
              <div className="grid gap-4">
                {tuitionRequests.map((req) => (
                  <div key={req.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-base">{req.guardian_name}</span>
                          <span className="text-xs font-semibold text-slate-500">({req.guardian_phone})</span>
                        </div>
                        <p className="text-xs text-indigo-600 font-semibold mt-0.5">
                          শ্রেণি: {req.student_class} | বিষয়: {req.subjects}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={req.status}
                          onChange={(e) => updateRequestStatus(req.id, e.target.value as any)}
                          className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 focus:outline-none"
                        >
                          <option value="pending">পেন্ডিং (Pending)</option>
                          <option value="contacted">যোগাযোগ করা হয়েছে (Contacted)</option>
                          <option value="assigned">টিউটর অ্যাসাইনড (Assigned)</option>
                          <option value="cancelled">বাতিল (Cancelled)</option>
                        </select>

                        <a
                          href={`https://wa.me/${req.guardian_phone.replace(/\D/g, '').replace(/^0/, '880')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1"
                        >
                          WhatsApp
                        </a>

                        <button
                          onClick={() => remove('tuition_requests', req.id)}
                          className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg"
                        >
                          মুছুন
                        </button>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-3 text-xs text-slate-600 font-medium">
                      <div><strong className="text-slate-900">এলাকা:</strong> {req.location}</div>
                      <div><strong className="text-slate-900">সম্মানী বাজেট:</strong> {req.salary_budget}</div>
                      <div><strong className="text-slate-900">দিন:</strong> {req.days_per_week || 'সপ্তাহে ৩ দিন'}</div>
                      <div><strong className="text-slate-900">শিক্ষক জেন্ডার:</strong> {req.preferred_gender === 'Male' ? 'পুরুষ' : req.preferred_gender === 'Female' ? 'নারী' : 'যেকোনো'}</div>
                      <div><strong className="text-slate-900">বিশ্ববিদ্যালয়:</strong> {req.preferred_university || 'যেকোনো'}</div>
                      <div><strong className="text-slate-900">তারিখ:</strong> {req.created_at ? new Date(req.created_at).toLocaleDateString() : 'আজ'}</div>
                    </div>

                    {req.notes && (
                      <div className="bg-slate-50 p-2.5 rounded-lg text-xs text-slate-700 font-medium border border-slate-200/80">
                        <strong>অতিরিক্ত নোট:</strong> {req.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-slate-500 font-medium">
                এখনো কোনো অভিভাবক টিউশন রিকোয়েস্ট জমা দেননি।
              </div>
            )}
          </div>
        )}

        {/* DASHBOARD TAB */}
        {tab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white rounded-3xl border border-ink-100 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-ink-500">Total Tutors</span>
                  <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-3xl font-extrabold text-ink-900">{tutors.length}</p>
                <p className="mt-2 text-xs text-ink-500 font-medium">
                  {tutors.filter((t) => t.is_verified).length} Verified · {tutors.filter((t) => t.is_featured).length} Featured
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-ink-100 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-ink-500">Active Tuitions</span>
                  <div className="w-10 h-10 rounded-xl bg-accent-50 text-accent-600 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-3xl font-extrabold text-ink-900">{tuitionPosts.length}</p>
                <p className="mt-2 text-xs text-ink-500 font-medium">
                  {tuitionPosts.filter((p) => p.is_active).length} Visible on site
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-ink-100 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-ink-500">Testimonials</span>
                  <div className="w-10 h-10 rounded-xl bg-warning-50 text-warning-600 flex items-center justify-center">
                    <Star className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-3xl font-extrabold text-ink-900">{testimonials.length}</p>
                <p className="mt-2 text-xs text-ink-500 font-medium">
                  {testimonials.filter((t) => t.is_published).length} Published
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-ink-100 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-ink-500">Database Status</span>
                  <div className="w-10 h-10 rounded-xl bg-success-50 text-success-600 flex items-center justify-center">
                    <Zap className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-success-500 animate-pulse" />
                  <p className="text-lg font-bold text-ink-900">Connected</p>
                </div>
                <p className="mt-2 text-xs text-ink-500 font-medium">Supabase Realtime Sync Active</p>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="admin-card space-y-6">
              <h2 className="text-xl font-bold text-ink-900">Quick Actions & Portal Info</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <button
                  onClick={() => setTab('tutors')}
                  className="p-5 rounded-2xl border border-ink-100 bg-ink-50 hover:bg-primary-50 hover:border-primary-200 text-left transition-all group"
                >
                  <p className="font-bold text-ink-900 group-hover:text-primary-600 flex items-center justify-between">
                    Add New Tutor <Plus className="w-4 h-4" />
                  </p>
                  <p className="text-xs text-ink-500 mt-1">Register new verified tutor profiles</p>
                </button>

                <button
                  onClick={() => setTab('tuition')}
                  className="p-5 rounded-2xl border border-ink-100 bg-ink-50 hover:bg-primary-50 hover:border-primary-200 text-left transition-all group"
                >
                  <p className="font-bold text-ink-900 group-hover:text-primary-600 flex items-center justify-between">
                    Post Tuition Opportunity <Plus className="w-4 h-4" />
                  </p>
                  <p className="text-xs text-ink-500 mt-1">Publish student tuition requests</p>
                </button>

                <button
                  onClick={exportBackupJson}
                  className="p-5 rounded-2xl border border-ink-100 bg-ink-50 hover:bg-primary-50 hover:border-primary-200 text-left transition-all group"
                >
                  <p className="font-bold text-ink-900 group-hover:text-primary-600 flex items-center justify-between">
                    Download Database Backup <Download className="w-4 h-4" />
                  </p>
                  <p className="text-xs text-ink-500 mt-1">Save copy of all CMS records as JSON</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {tab === 'settings' && (
          <form onSubmit={saveSettings} className="flex flex-col lg:flex-row gap-6 items-start relative">
            {/* Sidebar Navigation */}
            <div className="w-full lg:w-72 shrink-0 bg-white p-5 rounded-3xl border border-ink-100 shadow-sm lg:sticky lg:top-24 max-h-[85vh] overflow-y-auto hidden md:block">
              <h3 className="font-bold text-ink-900 mb-4 uppercase tracking-wider text-xs">Settings Categories</h3>
              <nav className="flex flex-col gap-1">
                <a href="#cat-1" className="text-sm font-semibold text-ink-600 hover:bg-primary-50 hover:text-primary-600 px-3 py-2 rounded-xl transition-colors">1. Brand & Contact Info</a>
                <a href="#cat-2" className="text-sm font-semibold text-ink-600 hover:bg-primary-50 hover:text-primary-600 px-3 py-2 rounded-xl transition-colors">2. Hero Section</a>
                <a href="#cat-3" className="text-sm font-semibold text-ink-600 hover:bg-primary-50 hover:text-primary-600 px-3 py-2 rounded-xl transition-colors">3. Features</a>
                <a href="#cat-4" className="text-sm font-semibold text-ink-600 hover:bg-primary-50 hover:text-primary-600 px-3 py-2 rounded-xl transition-colors">4. How It Works</a>
                <a href="#cat-5" className="text-sm font-semibold text-ink-600 hover:bg-primary-50 hover:text-primary-600 px-3 py-2 rounded-xl transition-colors">5. Tutors Directory</a>
                <a href="#cat-6" className="text-sm font-semibold text-ink-600 hover:bg-primary-50 hover:text-primary-600 px-3 py-2 rounded-xl transition-colors">6. Testimonials</a>
                <a href="#cat-7" className="text-sm font-semibold text-ink-600 hover:bg-primary-50 hover:text-primary-600 px-3 py-2 rounded-xl transition-colors">7. CTA & Footer</a>
                <a href="#cat-8" className="text-sm font-semibold text-ink-600 hover:bg-primary-50 hover:text-primary-600 px-3 py-2 rounded-xl transition-colors">8. Advanced Texts</a>
              </nav>
              <div className="mt-6 pt-6 border-t border-ink-100">
                <button disabled={saving} className="admin-button w-full shadow-md justify-center" type="submit">
                  <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>

            {/* Main Form Content */}
            <div className="flex-1 min-w-0 bg-white rounded-3xl border border-ink-100 p-6 sm:p-8 shadow-sm space-y-12">
              <div className="flex items-center justify-between sm:hidden mb-2">
                <h2 className="text-xl font-bold text-ink-900">Settings</h2>
                <button disabled={saving} className="admin-button px-4 py-2 text-xs" type="submit">
                  <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
                </button>
              </div>

              <div id="cat-1" className="scroll-mt-32">
                <h3 className="text-lg font-bold text-ink-900 mb-4 pb-2 border-b border-ink-100 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs">1</span>
                  Brand & General Contact Information
                </h3>
                <div className="grid md:grid-cols-2 gap-5 pt-2">
                <Field label="Brand Name">
                  <input
                    className="admin-input"
                    value={settings.brand_name}
                    onChange={(e) => setSettings({ ...settings, brand_name: e.target.value })}
                  />
                </Field>
                <Field label="Contact Email">
                  <input
                    className="admin-input"
                    type="email"
                    value={settings.contact_email}
                    onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                  />
                </Field>
                <Field label="Contact Phone / WhatsApp">
                  <input
                    className="admin-input"
                    value={settings.contact_phone}
                    onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                  />
                </Field>
                <Field label="Office Location / Address">
                  <input
                    className="admin-input"
                    value={settings.location}
                    onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                  />
                </Field>
              </div>
            </div>

            <div id="cat-2" className="scroll-mt-32">
              <h3 className="text-lg font-bold text-ink-900 mb-4 pb-2 border-b border-ink-100 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs">2</span>
                Hero Section
              </h3>
              <div className="grid md:grid-cols-2 gap-5 pt-2">
                <Field label="Hero Badge Text">
                  <input
                    className="admin-input"
                    value={settings.hero_badge_text || ''}
                    onChange={(e) => setSettings({ ...settings, hero_badge_text: e.target.value })}
                  />
                </Field>
                <Field label="Hero Image URL">
                  <input
                    className="admin-input"
                    value={settings.hero_image_url || ''}
                    onChange={(e) => setSettings({ ...settings, hero_image_url: e.target.value })}
                    placeholder="https://..."
                  />
                </Field>
                <Field label="Hero Main Title" className="md:col-span-2">
                  <textarea
                    className="admin-input min-h-20"
                    value={settings.hero_title}
                    onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
                  />
                </Field>
                <Field label="Hero Description" className="md:col-span-2">
                  <textarea
                    className="admin-input min-h-24"
                    value={settings.hero_description}
                    onChange={(e) => setSettings({ ...settings, hero_description: e.target.value })}
                  />
                </Field>
              </div>
            </div>

            <div id="cat-3" className="scroll-mt-32">
              <h3 className="text-lg font-bold text-ink-900 mb-4 pb-2 border-b border-ink-100 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs">3</span>
                Features Section
              </h3>
              <div className="grid md:grid-cols-2 gap-5 pt-2">
                <Field label="Features Title">
                  <input
                    className="admin-input"
                    value={settings.features_title || ''}
                    onChange={(e) => setSettings({ ...settings, features_title: e.target.value })}
                  />
                </Field>
                <Field label="Features Subtitle">
                  <input
                    className="admin-input"
                    value={settings.features_subtitle || ''}
                    onChange={(e) => setSettings({ ...settings, features_subtitle: e.target.value })}
                  />
                </Field>
              </div>
            </div>

            <div id="cat-4" className="scroll-mt-32">
              <h3 className="text-lg font-bold text-ink-900 mb-4 pb-2 border-b border-ink-100 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs">4</span>
                How It Works Section
              </h3>
              <div className="grid md:grid-cols-2 gap-5 pt-2">
                <Field label="How It Works Title">
                  <input
                    className="admin-input"
                    value={settings.how_it_works_title || ''}
                    onChange={(e) => setSettings({ ...settings, how_it_works_title: e.target.value })}
                  />
                </Field>
                <Field label="How It Works Subtitle">
                  <input
                    className="admin-input"
                    value={settings.how_it_works_subtitle || ''}
                    onChange={(e) => setSettings({ ...settings, how_it_works_subtitle: e.target.value })}
                  />
                </Field>
              </div>
            </div>

            <div id="cat-5" className="scroll-mt-32">
              <h3 className="text-lg font-bold text-ink-900 mb-4 pb-2 border-b border-ink-100 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs">5</span>
                Tutors Directory Section
              </h3>
              <div className="grid md:grid-cols-2 gap-5 pt-2">
                <Field label="Directory Section Title">
                  <input
                    className="admin-input"
                    value={settings.directory_title || ''}
                    onChange={(e) => setSettings({ ...settings, directory_title: e.target.value })}
                  />
                </Field>
                <Field label="Directory Section Subtitle">
                  <input
                    className="admin-input"
                    value={settings.directory_subtitle || ''}
                    onChange={(e) => setSettings({ ...settings, directory_subtitle: e.target.value })}
                  />
                </Field>
              </div>
            </div>

            <div id="cat-6" className="scroll-mt-32">
              <h3 className="text-lg font-bold text-ink-900 mb-4 pb-2 border-b border-ink-100 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs">6</span>
                Testimonials Section
              </h3>
              <div className="grid md:grid-cols-2 gap-5 pt-2">
                <Field label="Testimonials Title">
                  <input
                    className="admin-input"
                    value={settings.testimonials_title || ''}
                    onChange={(e) => setSettings({ ...settings, testimonials_title: e.target.value })}
                  />
                </Field>
                <Field label="Testimonials Subtitle">
                  <input
                    className="admin-input"
                    value={settings.testimonials_subtitle || ''}
                    onChange={(e) => setSettings({ ...settings, testimonials_subtitle: e.target.value })}
                  />
                </Field>
              </div>
            </div>

            <div id="cat-7" className="scroll-mt-32">
              <h3 className="text-lg font-bold text-ink-900 mb-4 pb-2 border-b border-ink-100 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs">7</span>
                Call to Action (CTA) & Footer Section
              </h3>
              <div className="grid md:grid-cols-2 gap-5 pt-2">
                <Field label="CTA Badge Text">
                  <input
                    className="admin-input"
                    value={settings.cta_badge_text || ''}
                    onChange={(e) => setSettings({ ...settings, cta_badge_text: e.target.value })}
                  />
                </Field>
                <Field label="CTA Title">
                  <input
                    className="admin-input"
                    value={settings.cta_title || ''}
                    onChange={(e) => setSettings({ ...settings, cta_title: e.target.value })}
                  />
                </Field>
                <Field label="CTA Description" className="md:col-span-2">
                  <textarea
                    className="admin-input min-h-20"
                    value={settings.cta_description || ''}
                    onChange={(e) => setSettings({ ...settings, cta_description: e.target.value })}
                  />
                </Field>
                <Field label="Footer Description" className="md:col-span-2">
                  <textarea
                    className="admin-input min-h-20"
                    value={settings.footer_description}
                    onChange={(e) => setSettings({ ...settings, footer_description: e.target.value })}
                  />
                </Field>
              </div>
            </div>

            <div id="cat-8" className="scroll-mt-32 pt-4">
              <h3 className="text-xl font-bold text-ink-900 mb-6 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs">8</span>
                Advanced Text Customizations
              </h3>
              <div className="space-y-10">
                {siteSettingsSchema.map((section, idx) => (
                  <div key={section.category} className="bg-ink-50 p-6 rounded-2xl border border-ink-100 shadow-sm">
                    <h4 className="text-md font-bold text-ink-900 mb-4">{8 + idx}. {section.category}</h4>
                    <div className="grid md:grid-cols-2 gap-5">
                      {section.fields.map(f => (
                        <Field key={f.key} label={f.label} className={f.key.includes('desc') || f.key.includes('msg') ? "md:col-span-2" : ""}>
                          {f.key.includes('desc') || f.key.includes('msg') ? (
                            <textarea
                              className="admin-input min-h-20"
                              value={settings.custom_texts?.[f.key] || ''}
                              onChange={(e) => setSettings(prev => ({ ...prev, custom_texts: { ...prev.custom_texts, [f.key]: e.target.value } }))}
                              placeholder={f.default}
                            />
                          ) : (
                            <input
                              className="admin-input"
                              value={settings.custom_texts?.[f.key] || ''}
                              onChange={(e) => setSettings(prev => ({ ...prev, custom_texts: { ...prev.custom_texts, [f.key]: e.target.value } }))}
                              placeholder={f.default}
                            />
                          )}
                        </Field>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Mobile Save Button (Desktop is in sidebar) */}
            <div className="pt-4 border-t border-ink-100 mt-8 md:hidden">
              <button disabled={saving} className="admin-button w-full justify-center" type="submit">
                <Save className="w-5 h-5" /> {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
          </form>
        )}

        {/* TUTORS TAB */}
        {tab === 'tutors' && (
          <ContentManager
            title="Tutors Management"
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSubmit={saveTutor}
            submitLabel={editingId ? 'Update Tutor Profile' : 'Add Tutor Profile'}
            saving={saving}
            onCancel={() => {
              setEditingId(null);
              setTutorForm(emptyTutor);
            }}
            form={
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Full Name">
                  <input
                    required
                    className="admin-input"
                    value={tutorForm.name}
                    onChange={(e) => setTutorForm({ ...tutorForm, name: e.target.value })}
                    placeholder="e.g. Istiak Rahman Shourov"
                  />
                </Field>

                <Field label="Department / Institution">
                  <input
                    className="admin-input"
                    value={tutorForm.department || ''}
                    onChange={(e) => setTutorForm({ ...tutorForm, department: e.target.value })}
                    placeholder="e.g. EEE, Islamic University of Technology (IUT)"
                  />
                </Field>

                <Field label="Student Status / Year">
                  <input
                    className="admin-input"
                    value={tutorForm.student_level || ''}
                    onChange={(e) => setTutorForm({ ...tutorForm, student_level: e.target.value })}
                    placeholder="e.g. 4th Year Student / Graduate"
                  />
                </Field>

                <Field label="WhatsApp Phone Number">
                  <input
                    className="admin-input"
                    value={tutorForm.whatsapp_number || ''}
                    onChange={(e) => setTutorForm({ ...tutorForm, whatsapp_number: e.target.value })}
                    placeholder="e.g. 01318126412"
                  />
                </Field>

                <Field label="Headline">
                  <input
                    className="admin-input"
                    value={tutorForm.headline}
                    onChange={(e) => setTutorForm({ ...tutorForm, headline: e.target.value })}
                    placeholder="e.g. EEE Undergrad at IUT | 3+ Years Exp"
                  />
                </Field>

                <Field label="Services Offered / Subjects (comma separated)">
                  <input
                    className="admin-input"
                    value={tutorForm.subjects.join(', ')}
                    onChange={(e) =>
                      setTutorForm({
                        ...tutorForm,
                        subjects: e.target.value.split(',').map((v) => v.trim()),
                      })
                    }
                    placeholder="e.g. Physics, Higher Math, ICT"
                  />
                </Field>

                <Field label="Location">
                  <input
                    className="admin-input"
                    value={tutorForm.location}
                    onChange={(e) => setTutorForm({ ...tutorForm, location: e.target.value })}
                    placeholder="e.g. Uttara, Dhaka"
                  />
                </Field>

                <div className="md:col-span-2 space-y-3 bg-ink-50 p-4 rounded-2xl border border-ink-100">
                  <Field label="Tutor Profile Picture (Upload Direct Image)">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-1">
                      {/* Current Preview */}
                      <div className="relative w-20 h-20 rounded-2xl bg-white border-2 border-ink-200 overflow-hidden shrink-0 flex items-center justify-center shadow-sm">
                        {tutorForm.avatar_url ? (
                          <img src={tutorForm.avatar_url} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-ink-300" />
                        )}
                      </div>

                      <div className="flex-1 space-y-2.5 w-full">
                        {/* File Upload Button */}
                        <div className="flex flex-wrap items-center gap-3">
                          <label className="cursor-pointer inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-95">
                            <Upload className="w-4 h-4" />
                            <span>{uploadingImage ? 'Uploading Image...' : 'Upload Image from Device'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileUpload}
                              disabled={uploadingImage}
                              className="hidden"
                            />
                          </label>

                          {tutorForm.avatar_url && (
                            <button
                              type="button"
                              onClick={() => setTutorForm((prev) => ({ ...prev, avatar_url: '' }))}
                              className="text-xs text-error-600 hover:text-error-700 font-bold hover:underline"
                            >
                              Remove Picture
                            </button>
                          )}
                        </div>

                        <p className="text-[11px] text-ink-500 font-medium">
                          Select an image file from your device. When saved, picture is stored and deleted when tutor is deleted.
                        </p>

                        <input
                          className="admin-input text-xs"
                          value={tutorForm.avatar_url}
                          onChange={(e) => setTutorForm({ ...tutorForm, avatar_url: e.target.value })}
                          placeholder="Or paste external image URL (https://...)"
                        />
                      </div>
                    </div>
                  </Field>

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-ink-200/60">
                    <span className="text-xs font-bold text-ink-500">Quick Presets:</span>
                    {avatarPresets.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => setTutorForm({ ...tutorForm, avatar_url: preset.url })}
                        className="text-xs bg-white hover:bg-primary-100 hover:text-primary-700 border border-ink-200 px-2.5 py-1 rounded-md font-medium transition-colors"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                <Field label="Rating (0 - 5.0)">
                  <input
                    className="admin-input"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={tutorForm.rating}
                    onChange={(e) => setTutorForm({ ...tutorForm, rating: Number(e.target.value) })}
                  />
                </Field>

                <div className="flex gap-6 items-center pt-6">
                  <CheckBox
                    label="Verified Badge"
                    checked={tutorForm.is_verified}
                    onChange={(v) => setTutorForm({ ...tutorForm, is_verified: v })}
                  />
                  <CheckBox
                    label="Featured on Homepage"
                    checked={tutorForm.is_featured}
                    onChange={(v) => setTutorForm({ ...tutorForm, is_featured: v })}
                  />
                </div>

                <div className="md:col-span-2">
                  <Field label="Bio / Details">
                    <textarea
                      className="admin-input min-h-24"
                      value={tutorForm.bio}
                      onChange={(e) => setTutorForm({ ...tutorForm, bio: e.target.value })}
                      placeholder="Brief description of teaching background and approach..."
                    />
                  </Field>
                </div>
              </div>
            }
            list={filteredTutors.map((item) => (
              <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  {item.avatar_url ? (
                    <img src={item.avatar_url} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
                      {item.name.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-ink-900 truncate">{item.name}</p>
                      {item.is_verified && <ShieldCheck className="w-4 h-4 text-success-500" />}
                      {item.is_featured && (
                        <span className="text-[10px] uppercase tracking-wider font-extrabold bg-warning-100 text-warning-800 px-2 py-0.5 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-ink-500 truncate">
                      {item.headline} · {item.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => void toggleTutorVerified(item)}
                    title="Toggle Verified"
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      item.is_verified
                        ? 'bg-success-100 text-success-800 hover:bg-success-200'
                        : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
                    }`}
                  >
                    {item.is_verified ? 'Verified' : '+ Verify'}
                  </button>

                  <button
                    onClick={() => void toggleTutorFeatured(item)}
                    title="Toggle Featured"
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      item.is_featured
                        ? 'bg-warning-100 text-warning-800 hover:bg-warning-200'
                        : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
                    }`}
                  >
                    {item.is_featured ? 'Featured' : '+ Feature'}
                  </button>

                  <button onClick={() => startTutorEdit(item)} className="admin-secondary text-xs">
                    Edit
                  </button>

                  <button
                    onClick={() => void deleteTutor(item)}
                    title="Delete tutor and profile picture"
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-error-600 hover:bg-error-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          />
        )}

        {/* TUITION POSTS TAB */}
        {tab === 'tuition' && (
          <ContentManager
            title="Tuition Opportunities"
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSubmit={saveTuition}
            submitLabel={editingId ? 'Update Tuition Post' : 'Post New Tuition'}
            saving={saving}
            onCancel={() => {
              setEditingId(null);
              setTuitionForm(emptyTuition);
            }}
            form={
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Title">
                  <input
                    required
                    className="admin-input"
                    value={tuitionForm.title}
                    onChange={(e) => setTuitionForm({ ...tuitionForm, title: e.target.value })}
                    placeholder="e.g. Need HSC Physics & Higher Math Tutor"
                  />
                </Field>

                <Field label="Subject">
                  <input
                    required
                    className="admin-input"
                    value={tuitionForm.subject}
                    onChange={(e) => setTuitionForm({ ...tuitionForm, subject: e.target.value })}
                    placeholder="e.g. Physics & Higher Math"
                  />
                </Field>

                <Field label="Grade / Class Level">
                  <input
                    className="admin-input"
                    value={tuitionForm.grade_level}
                    onChange={(e) => setTuitionForm({ ...tuitionForm, grade_level: e.target.value })}
                    placeholder="e.g. HSC 2nd Year"
                  />
                </Field>

                <Field label="Location">
                  <input
                    className="admin-input"
                    value={tuitionForm.location}
                    onChange={(e) => setTuitionForm({ ...tuitionForm, location: e.target.value })}
                    placeholder="e.g. Uttara Sector 4, Dhaka"
                  />
                </Field>

                <Field label="Mode">
                  <input
                    className="admin-input"
                    value={tuitionForm.mode}
                    onChange={(e) => setTuitionForm({ ...tuitionForm, mode: e.target.value })}
                    placeholder="In-person or Online"
                  />
                </Field>

                <Field label="Budget / Salary Offer">
                  <input
                    className="admin-input"
                    value={tuitionForm.budget}
                    onChange={(e) => setTuitionForm({ ...tuitionForm, budget: e.target.value })}
                    placeholder="e.g. 10,000 BDT/month (3 days/wk)"
                  />
                </Field>

                <div className="md:col-span-2">
                  <Field label="Description">
                    <textarea
                      className="admin-input min-h-24"
                      value={tuitionForm.description}
                      onChange={(e) => setTuitionForm({ ...tuitionForm, description: e.target.value })}
                      placeholder="Requirements, days per week, preferences..."
                    />
                  </Field>
                </div>

                <div className="md:col-span-2 pt-2">
                  <CheckBox
                    label="Visible on Website"
                    checked={tuitionForm.is_active}
                    onChange={(v) => setTuitionForm({ ...tuitionForm, is_active: v })}
                  />
                </div>
              </div>
            }
            list={filteredTuition.map((item) => (
              <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-ink-900 truncate">{item.title}</p>
                    {!item.is_active && (
                      <span className="text-[10px] uppercase font-bold bg-ink-200 text-ink-600 px-2 py-0.5 rounded-full">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ink-500 truncate">
                    {item.subject} · {item.location} · {item.budget}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => void toggleTuitionActive(item)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      item.is_active
                        ? 'bg-success-100 text-success-800 hover:bg-success-200'
                        : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
                    }`}
                  >
                    {item.is_active ? 'Active' : 'Hidden'}
                  </button>

                  <button onClick={() => startTuitionEdit(item)} className="admin-secondary text-xs">
                    Edit
                  </button>

                  <button
                    onClick={() => void remove('tuition_posts', item.id)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-error-600 hover:bg-error-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          />
        )}

        {/* TESTIMONIALS TAB */}
        {tab === 'testimonials' && (
          <ContentManager
            title="Student & Parent Reviews"
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSubmit={saveTestimonial}
            submitLabel={editingId ? 'Update Review' : 'Add New Review'}
            saving={saving}
            onCancel={() => {
              setEditingId(null);
              setTestimonialForm(emptyTestimonial);
            }}
            form={
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Field label="Quote / Review text">
                    <textarea
                      required
                      className="admin-input min-h-28"
                      value={testimonialForm.quote}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })}
                      placeholder="Client testimonial quote..."
                    />
                  </Field>
                </div>

                <Field label="Author Name">
                  <input
                    required
                    className="admin-input"
                    value={testimonialForm.name}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                    placeholder="e.g. Istiak Rahman Shourov"
                  />
                </Field>

                <Field label="Title / Year">
                  <input
                    className="admin-input"
                    value={testimonialForm.title}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, title: e.target.value })}
                    placeholder="e.g. 4th Year, EEE"
                  />
                </Field>

                <Field label="Organization / University">
                  <input
                    className="admin-input"
                    value={testimonialForm.organization}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, organization: e.target.value })}
                    placeholder="e.g. Islamic University of Technology"
                  />
                </Field>

                <Field label="Sort Order">
                  <input
                    className="admin-input"
                    type="number"
                    value={testimonialForm.sort_order}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, sort_order: Number(e.target.value) })}
                  />
                </Field>

                <div className="md:col-span-2 pt-2">
                  <CheckBox
                    label="Published on Website"
                    checked={testimonialForm.is_published}
                    onChange={(v) => setTestimonialForm({ ...testimonialForm, is_published: v })}
                  />
                </div>
              </div>
            }
            list={filteredTestimonials.map((item) => (
              <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-ink-900 truncate">{item.name}</p>
                    {!item.is_published && (
                      <span className="text-[10px] uppercase font-bold bg-ink-200 text-ink-600 px-2 py-0.5 rounded-full">
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ink-500 truncate">{item.organization}</p>
                  <p className="text-xs text-ink-400 truncate mt-0.5 italic">"{item.quote}"</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => void toggleTestimonialPublished(item)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      item.is_published
                        ? 'bg-success-100 text-success-800 hover:bg-success-200'
                        : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
                    }`}
                  >
                    {item.is_published ? 'Published' : 'Draft'}
                  </button>

                  <button onClick={() => startTestimonialEdit(item)} className="admin-secondary text-xs">
                    Edit
                  </button>

                  <button
                    onClick={() => void remove('testimonials', item.id)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-error-600 hover:bg-error-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          />
        )}
        {tab === 'faqs' && (
          <ContentManager
            title="Quick FAQ"
            saving={saving}
            submitLabel={editingId ? 'Update FAQ' : 'Add New FAQ'}
            onCancel={() => {
              setEditingId(null);
              setQuestionForm(emptyQuickQuestion);
            }}
            onSubmit={saveQuestion}
            form={
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <Field label="Question">
                    <input
                      required
                      type="text"
                      className="admin-input"
                      value={questionForm.question}
                      onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                      placeholder="e.g. আপনাদের সার্ভিস চার্জ কত?"
                    />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Answer">
                    <textarea
                      required
                      className="admin-input min-h-[80px]"
                      value={questionForm.answer}
                      onChange={(e) => setQuestionForm({ ...questionForm, answer: e.target.value })}
                      placeholder="Answer text..."
                    />
                  </Field>
                </div>
                <Field label="Icon Name (Lucide)">
                  <input
                    required
                    type="text"
                    className="admin-input"
                    value={questionForm.icon_name}
                    onChange={(e) => setQuestionForm({ ...questionForm, icon_name: e.target.value })}
                    placeholder="e.g. HelpCircle, BookOpen, MessageCircle"
                  />
                </Field>
                <Field label="Sort Order">
                  <input
                    type="number"
                    className="admin-input"
                    value={questionForm.sort_order}
                    onChange={(e) => setQuestionForm({ ...questionForm, sort_order: parseInt(e.target.value) || 0 })}
                  />
                </Field>
                <Field label="Action Text (Optional)">
                  <input
                    type="text"
                    className="admin-input"
                    value={questionForm.action_text || ''}
                    onChange={(e) => setQuestionForm({ ...questionForm, action_text: e.target.value })}
                    placeholder="e.g. WhatsApp-এ মেসেজ দিন"
                  />
                </Field>
                <Field label="Action URL (Optional)">
                  <input
                    type="url"
                    className="admin-input"
                    value={questionForm.action_url || ''}
                    onChange={(e) => setQuestionForm({ ...questionForm, action_url: e.target.value })}
                    placeholder="https://..."
                  />
                </Field>
              </div>
            }
            list={quickQuestions.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-ink-900 truncate flex items-center gap-2">
                    {item.question} <span className="text-[10px] bg-ink-100 text-ink-500 px-1.5 py-0.5 rounded">Order: {item.sort_order}</span>
                  </h3>
                  <p className="text-xs text-ink-500 truncate mt-0.5">{item.answer}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setEditingId(item.id);
                      setQuestionForm({
                        icon_name: item.icon_name,
                        question: item.question,
                        answer: item.answer,
                        action_url: item.action_url || '',
                        action_text: item.action_text || '',
                        sort_order: item.sort_order,
                      });
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="admin-secondary text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => void remove('quick_questions', item.id)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-error-600 hover:bg-error-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          />
        )}
      </main>
    </div>
  );
}

function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block space-y-2 ${className}`}>
      <span className="text-xs font-bold uppercase tracking-wider text-ink-700">{label}</span>
      {children}
    </label>
  );
}

function CheckBox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2.5 text-xs font-bold text-ink-700 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 accent-primary-600"
      />
      {label}
    </label>
  );
}

function ContentManager({
  title,
  form,
  list,
  searchQuery,
  onSearchChange,
  onSubmit,
  onCancel,
  submitLabel,
  saving,
}: {
  title: string;
  form: React.ReactNode;
  list: React.ReactNode;
  searchQuery?: string;
  onSearchChange?: (v: string) => void;
  onSubmit: (event: FormEvent) => void;
  onCancel: () => void;
  submitLabel: string;
  saving?: boolean;
}) {
  return (
    <div className="space-y-8">
      {/* Editor Form Card */}
      <form onSubmit={onSubmit} className="admin-card space-y-5">
        <div className="flex items-center justify-between gap-4 border-b border-ink-100 pb-4">
          <h2 className="text-lg font-bold text-ink-900">{title} Form</h2>
          <button type="button" onClick={onCancel} className="admin-secondary text-xs">
            <Plus className="w-4 h-4" /> Reset Form
          </button>
        </div>

        {form}

        <div className="flex gap-3 pt-2">
          <button disabled={saving} className="admin-button" type="submit">
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : submitLabel}
          </button>
          <button type="button" onClick={onCancel} className="admin-secondary">
            <X className="w-4 h-4" /> Cancel
          </button>
        </div>
      </form>

      {/* Record List Card */}
      <div className="admin-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-bold text-ink-900">Manage Records</h2>
          {typeof onSearchChange === 'function' && (
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search records..."
                className="w-full bg-ink-50 border border-ink-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:bg-white focus:border-primary-500 focus:outline-none"
              />
            </div>
          )}
        </div>

        <div className="divide-y divide-ink-100">{list}</div>
      </div>
    </div>
  );
}
