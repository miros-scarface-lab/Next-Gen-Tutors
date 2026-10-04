import { FormEvent, useCallback, useEffect, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Download,
  Eye,
  Filter,
  GraduationCap,
  LogOut,
  Plus,
  RefreshCw,
  Search,
  Shield,
  ShieldCheck,
  Star,
  StarOff,
  Trash2,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { SiteSettings, TestimonialRecord, TuitionPost, Tutor } from '@/types/cms';

type AdminTab = 'dashboard' | 'settings' | 'tutors' | 'tuition' | 'testimonials';

type TutorForm = Omit<Tutor, 'id' | 'created_at' | 'updated_at'>;
type TuitionForm = Omit<TuitionPost, 'id' | 'created_at' | 'updated_at'>;
type TestimonialForm = Omit<TestimonialRecord, 'id' | 'created_at' | 'updated_at'>;

const defaultSettings: SiteSettings = {
  singleton: true,
  brand_name: 'Next Gen Tutors',
  hero_title: 'Find Your Perfect Tutor Anytime, Anywhere',
  hero_description:
    'Find the right tutor with confidence. Connect with verified, experienced tutors and start learning with purpose.',
  contact_email: 'hello@nextgentutors.com',
  contact_phone: '+880 1000 000000',
  location: 'Dhaka, Bangladesh',
  footer_description: 'Connect with expert tutors who will help you achieve your academic goals.',
  updated_at: '',
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

  const [tutorForm, setTutorForm] = useState<TutorForm>(emptyTutor);
  const [tuitionForm, setTuitionForm] = useState<TuitionForm>(emptyTuition);
  const [testimonialForm, setTestimonialForm] = useState<TestimonialForm>(emptyTestimonial);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadCms = useCallback(async () => {
    const [settingsResult, tutorsResult, tuitionResult, testimonialsResult] = await Promise.all([
      supabase.from('site_settings').select('*').maybeSingle(),
      supabase.from('tutors').select('*').order('created_at', { ascending: false }),
      supabase.from('tuition_posts').select('*').order('created_at', { ascending: false }),
      supabase.from('testimonials').select('*').order('sort_order', { ascending: true }),
    ]);
    if (settingsResult.data) setSettings(settingsResult.data as SiteSettings);
    if (tutorsResult.data) setTutors(tutorsResult.data as Tutor[]);
    if (tuitionResult.data) setTuitionPosts(tuitionResult.data as TuitionPost[]);
    if (testimonialsResult.data) setTestimonials(testimonialsResult.data as TestimonialRecord[]);
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

  const save = async (action: () => PromiseLike<{ error: unknown }>, success: string) => {
    setSaving(true);
    const result = await action();
    setSaving(false);
    if (result.error) {
      showNotification('Failed to save change. Please try again.');
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

  const remove = async (table: string, id: string) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    await save(() => supabase.from(table).delete().eq('id', id), 'Record removed successfully.');
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
    { id: 'settings', label: 'Website Settings' },
    { id: 'tutors', label: 'Tutors', badge: tutors.length },
    { id: 'tuition', label: 'Tuition Posts', badge: tuitionPosts.length },
    { id: 'testimonials', label: 'Testimonials', badge: testimonials.length },
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
          <div className="mb-6 rounded-2xl bg-success-50 border border-success-200 text-success-800 px-5 py-3.5 text-sm font-semibold flex items-center justify-between shadow-sm animate-fade-in">
            <div className="flex items-center gap-2.5">
              <Check className="w-5 h-5 text-success-600" />
              <span>{notice}</span>
            </div>
            <button onClick={() => setNotice('')} className="text-success-600 hover:text-success-900">
              <X className="w-4 h-4" />
            </button>
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
          <form onSubmit={saveSettings} className="admin-card grid md:grid-cols-2 gap-5">
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
            <Field label="Hero Title">
              <textarea
                className="admin-input min-h-24"
                value={settings.hero_title}
                onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
              />
            </Field>
            <Field label="Hero Description">
              <textarea
                className="admin-input min-h-24"
                value={settings.hero_description}
                onChange={(e) => setSettings({ ...settings, hero_description: e.target.value })}
              />
            </Field>
            <Field label="Contact Phone">
              <input
                className="admin-input"
                value={settings.contact_phone}
                onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
              />
            </Field>
            <Field label="Office Location">
              <input
                className="admin-input"
                value={settings.location}
                onChange={(e) => setSettings({ ...settings, location: e.target.value })}
              />
            </Field>
            <Field label="Footer Description">
              <textarea
                className="admin-input min-h-24"
                value={settings.footer_description}
                onChange={(e) => setSettings({ ...settings, footer_description: e.target.value })}
              />
            </Field>
            <div className="md:col-span-2 pt-2">
              <button disabled={saving} className="admin-button" type="submit">
                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Website Settings'}
              </button>
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

                <Field label="Headline">
                  <input
                    className="admin-input"
                    value={tutorForm.headline}
                    onChange={(e) => setTutorForm({ ...tutorForm, headline: e.target.value })}
                    placeholder="e.g. EEE Undergrad at IUT | 3+ Years Exp"
                  />
                </Field>

                <Field label="Subjects (comma separated)">
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

                <div className="md:col-span-2 space-y-2">
                  <Field label="Profile Image URL">
                    <input
                      className="admin-input"
                      value={tutorForm.avatar_url}
                      onChange={(e) => setTutorForm({ ...tutorForm, avatar_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </Field>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-xs font-bold text-ink-500">Quick Presets:</span>
                    {avatarPresets.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => setTutorForm({ ...tutorForm, avatar_url: preset.url })}
                        className="text-xs bg-ink-100 hover:bg-primary-100 hover:text-primary-700 px-2.5 py-1 rounded-md font-medium transition-colors"
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
                    onClick={() => void remove('tutors', item.id)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-error-600 hover:bg-error-50"
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
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
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
}: {
  title: string;
  form: React.ReactNode;
  list: React.ReactNode;
  searchQuery?: string;
  onSearchChange?: (v: string) => void;
  onSubmit: (event: FormEvent) => void;
  onCancel: () => void;
  submitLabel: string;
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
          <button className="admin-button" type="submit">
            <Save className="w-4 h-4" /> {submitLabel}
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
