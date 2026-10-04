import { FormEvent, useCallback, useEffect, useState } from 'react';
import { ArrowLeft, Check, LogOut, Plus, Save, Shield, Trash2, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { SiteSettings, TestimonialRecord, TuitionPost, Tutor } from '@/types/cms';

type AdminTab = 'settings' | 'tutors' | 'tuition' | 'testimonials';
type AuthMode = 'sign-in' | 'sign-up';

type TutorForm = Omit<Tutor, 'id' | 'created_at' | 'updated_at'>;
type TuitionForm = Omit<TuitionPost, 'id' | 'created_at' | 'updated_at'>;
type TestimonialForm = Omit<TestimonialRecord, 'id' | 'created_at' | 'updated_at'>;

const defaultSettings: SiteSettings = {
  singleton: true,
  brand_name: 'Next Gen Tutors',
  hero_title: 'Find Your Perfect Tutor Anytime, Anywhere',
  hero_description: 'Find the right tutor with confidence. Connect with verified, experienced tutors and start learning with purpose.',
  contact_email: 'hello@nextgentutors.com',
  contact_phone: '+880 1000 000000',
  location: 'Dhaka, Bangladesh',
  footer_description: 'Connect with expert tutors who will help you achieve your academic goals.',
  updated_at: '',
};

const emptyTutor: TutorForm = { name: '', headline: '', bio: '', subjects: [], location: '', avatar_url: '', rating: 5, is_verified: false, is_featured: false };
const emptyTuition: TuitionForm = { title: '', subject: '', grade_level: '', location: '', mode: 'In-person', budget: '', description: '', is_active: true };
const emptyTestimonial: TestimonialForm = { quote: '', name: '', title: '', organization: '', sort_order: 0, is_published: true };

function messageForError() {
  return 'We could not save that change. Please try again.';
}

export default function AdminPanel() {
  const [sessionReady, setSessionReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [tab, setTab] = useState<AdminTab>('settings');
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
    const { data } = supabase.auth.onAuthStateChange(() => { void checkSession(); });
    return () => data.subscription.unsubscribe();
  }, [checkSession]);

  const handleAuth = async (event: FormEvent) => {
    event.preventDefault();
    setAuthError('');
    const result = authMode === 'sign-in'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    if (result.error) {
      setAuthError(authMode === 'sign-in' ? 'The email or password was not accepted.' : 'We could not create that account. Please check your details.');
      return;
    }
    if (authMode === 'sign-up') {
      setAuthError('Account created. An administrator must approve this account before it can access the panel.');
    }
  };

  const save = async (action: () => PromiseLike<{ error: unknown }>, success: string) => {
    setSaving(true);
    setNotice('');
    const result = await action();
    setSaving(false);
    if (result.error) {
      setNotice(messageForError());
      return false;
    }
    setNotice(success);
    await loadCms();
    return true;
  };

  const saveSettings = async (event: FormEvent) => {
    event.preventDefault();
    await save(() => supabase.from('site_settings').upsert(settings, { onConflict: 'singleton' }), 'Website settings saved.');
  };

  const saveTutor = async (event: FormEvent) => {
    event.preventDefault();
    const payload = { ...tutorForm, subjects: tutorForm.subjects.filter(Boolean) };
    const result = editingId
      ? await save(() => supabase.from('tutors').update(payload).eq('id', editingId), 'Tutor saved.')
      : await save(() => supabase.from('tutors').insert(payload), 'Tutor added.');
    if (result) { setTutorForm(emptyTutor); setEditingId(null); }
  };

  const saveTuition = async (event: FormEvent) => {
    event.preventDefault();
    const result = editingId
      ? await save(() => supabase.from('tuition_posts').update(tuitionForm).eq('id', editingId), 'Tuition post saved.')
      : await save(() => supabase.from('tuition_posts').insert(tuitionForm), 'Tuition post added.');
    if (result) { setTuitionForm(emptyTuition); setEditingId(null); }
  };

  const saveTestimonial = async (event: FormEvent) => {
    event.preventDefault();
    const result = editingId
      ? await save(() => supabase.from('testimonials').update(testimonialForm).eq('id', editingId), 'Testimonial saved.')
      : await save(() => supabase.from('testimonials').insert(testimonialForm), 'Testimonial added.');
    if (result) { setTestimonialForm(emptyTestimonial); setEditingId(null); }
  };

  const remove = async (table: string, id: string) => {
    if (!window.confirm('Remove this item from the CMS?')) return;
    await save(() => supabase.from(table).delete().eq('id', id), 'Item removed.');
  };

  const startTutorEdit = (item: Tutor) => { setEditingId(item.id); setTutorForm({ name: item.name, headline: item.headline, bio: item.bio, subjects: item.subjects, location: item.location, avatar_url: item.avatar_url, rating: item.rating, is_verified: item.is_verified, is_featured: item.is_featured }); };
  const startTuitionEdit = (item: TuitionPost) => { setEditingId(item.id); setTuitionForm({ title: item.title, subject: item.subject, grade_level: item.grade_level, location: item.location, mode: item.mode, budget: item.budget, description: item.description, is_active: item.is_active }); };
  const startTestimonialEdit = (item: TestimonialRecord) => { setEditingId(item.id); setTestimonialForm({ quote: item.quote, name: item.name, title: item.title, organization: item.organization, sort_order: item.sort_order, is_published: item.is_published }); };

  if (!sessionReady) return <div className="min-h-screen bg-ink-50 flex items-center justify-center text-ink-600">Loading admin panel...</div>;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-ink-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl border border-ink-100 shadow-xl p-8">
          <a href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 mb-8"><ArrowLeft className="w-4 h-4" /> Back to website</a>
          <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-5"><Shield className="w-7 h-7" /></div>
          <h1 className="text-3xl font-bold text-ink-900">Private admin panel</h1>
          <p className="mt-3 text-ink-600">Sign in with an approved administrator account to manage every public detail.</p>
          <form onSubmit={handleAuth} className="mt-7 space-y-4">
            <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" className="admin-input" />
            <input required minLength={6} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" className="admin-input" />
            {authError && <p className="rounded-xl bg-error-50 px-4 py-3 text-sm text-error-700">{authError}</p>}
            <button className="w-full admin-button" type="submit">{authMode === 'sign-in' ? 'Sign in' : 'Create account'}</button>
          </form>
          <button onClick={() => { setAuthMode(authMode === 'sign-in' ? 'sign-up' : 'sign-in'); setAuthError(''); }} className="w-full mt-4 text-sm font-semibold text-primary-600">{authMode === 'sign-in' ? 'Need an account? Create one' : 'Already have an account? Sign in'}</button>
        </div>
      </div>
    );
  }

  const tabItems: { id: AdminTab; label: string }[] = [
    { id: 'settings', label: 'Website settings' },
    { id: 'tutors', label: 'Tutors' },
    { id: 'tuition', label: 'Tuition posts' },
    { id: 'testimonials', label: 'Testimonials' },
  ];

  return (
    <div className="min-h-screen bg-ink-50">
      <header className="bg-white border-b border-ink-100 sticky top-0 z-20">
        <div className="container-max py-4 flex items-center justify-between gap-4"><div><p className="text-sm font-bold text-primary-600 uppercase tracking-wider">Next Gen Tutors</p><h1 className="text-2xl font-bold text-ink-900">Content manager</h1></div><div className="flex items-center gap-3"><a href="/" className="hidden sm:inline-flex admin-secondary"><ArrowLeft className="w-4 h-4" /> View website</a><button onClick={() => { void supabase.auth.signOut(); setIsAdmin(false); }} className="admin-secondary"><LogOut className="w-4 h-4" /> Sign out</button></div></div>
      </header>
      <main className="container-max py-8">
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8">{tabItems.map((item) => <button key={item.id} onClick={() => { setTab(item.id); setEditingId(null); }} className={`whitespace-nowrap px-4 py-2.5 rounded-full text-sm font-bold transition-colors ${tab === item.id ? 'bg-primary-600 text-white' : 'bg-white text-ink-600 border border-ink-200 hover:border-primary-300'}`}>{item.label}</button>)}</div>
        {notice && <div className="mb-6 rounded-xl bg-success-50 text-success-700 px-4 py-3 text-sm font-semibold flex items-center gap-2"><Check className="w-4 h-4" />{notice}</div>}
        {tab === 'settings' && <form onSubmit={saveSettings} className="admin-card grid md:grid-cols-2 gap-5"><Field label="Brand name"><input className="admin-input" value={settings.brand_name} onChange={(event) => setSettings({ ...settings, brand_name: event.target.value })} /></Field><Field label="Contact email"><input className="admin-input" type="email" value={settings.contact_email} onChange={(event) => setSettings({ ...settings, contact_email: event.target.value })} /></Field><Field label="Hero title"><textarea className="admin-input min-h-24" value={settings.hero_title} onChange={(event) => setSettings({ ...settings, hero_title: event.target.value })} /></Field><Field label="Hero description"><textarea className="admin-input min-h-24" value={settings.hero_description} onChange={(event) => setSettings({ ...settings, hero_description: event.target.value })} /></Field><Field label="Phone"><input className="admin-input" value={settings.contact_phone} onChange={(event) => setSettings({ ...settings, contact_phone: event.target.value })} /></Field><Field label="Location"><input className="admin-input" value={settings.location} onChange={(event) => setSettings({ ...settings, location: event.target.value })} /></Field><Field label="Footer description"><textarea className="admin-input min-h-24" value={settings.footer_description} onChange={(event) => setSettings({ ...settings, footer_description: event.target.value })} /></Field><div className="md:col-span-2"><button disabled={saving} className="admin-button"><Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save website settings'}</button></div></form>}
        {tab === 'tutors' && <ContentManager title="Tutors" onSubmit={saveTutor} submitLabel={editingId ? 'Save tutor' : 'Add tutor'} onCancel={() => { setEditingId(null); setTutorForm(emptyTutor); }} form={<div className="grid md:grid-cols-2 gap-4"><Field label="Name"><input required className="admin-input" value={tutorForm.name} onChange={(event) => setTutorForm({ ...tutorForm, name: event.target.value })} /></Field><Field label="Headline"><input className="admin-input" value={tutorForm.headline} onChange={(event) => setTutorForm({ ...tutorForm, headline: event.target.value })} /></Field><Field label="Subjects (comma separated)"><input className="admin-input" value={tutorForm.subjects.join(', ')} onChange={(event) => setTutorForm({ ...tutorForm, subjects: event.target.value.split(',').map((value) => value.trim()) })} /></Field><Field label="Location"><input className="admin-input" value={tutorForm.location} onChange={(event) => setTutorForm({ ...tutorForm, location: event.target.value })} /></Field><Field label="Profile image URL"><input className="admin-input" value={tutorForm.avatar_url} onChange={(event) => setTutorForm({ ...tutorForm, avatar_url: event.target.value })} /></Field><Field label="Rating"><input className="admin-input" type="number" min="0" max="5" step="0.1" value={tutorForm.rating} onChange={(event) => setTutorForm({ ...tutorForm, rating: Number(event.target.value) })} /></Field><Field label="Bio"><textarea className="admin-input min-h-24" value={tutorForm.bio} onChange={(event) => setTutorForm({ ...tutorForm, bio: event.target.value })} /></Field><div className="flex gap-5 items-center"><CheckBox label="Verified" checked={tutorForm.is_verified} onChange={(value) => setTutorForm({ ...tutorForm, is_verified: value })} /><CheckBox label="Featured" checked={tutorForm.is_featured} onChange={(value) => setTutorForm({ ...tutorForm, is_featured: value })} /></div></div>} list={tutors.map((item) => <ListRow key={item.id} title={item.name} detail={`${item.headline} · ${item.location}`} onEdit={() => startTutorEdit(item)} onRemove={() => void remove('tutors', item.id)} />)} />}
        {tab === 'tuition' && <ContentManager title="Tuition posts" onSubmit={saveTuition} submitLabel={editingId ? 'Save tuition post' : 'Add tuition post'} onCancel={() => { setEditingId(null); setTuitionForm(emptyTuition); }} form={<div className="grid md:grid-cols-2 gap-4"><Field label="Title"><input required className="admin-input" value={tuitionForm.title} onChange={(event) => setTuitionForm({ ...tuitionForm, title: event.target.value })} /></Field><Field label="Subject"><input required className="admin-input" value={tuitionForm.subject} onChange={(event) => setTuitionForm({ ...tuitionForm, subject: event.target.value })} /></Field><Field label="Grade level"><input className="admin-input" value={tuitionForm.grade_level} onChange={(event) => setTuitionForm({ ...tuitionForm, grade_level: event.target.value })} /></Field><Field label="Location"><input className="admin-input" value={tuitionForm.location} onChange={(event) => setTuitionForm({ ...tuitionForm, location: event.target.value })} /></Field><Field label="Mode"><input className="admin-input" value={tuitionForm.mode} onChange={(event) => setTuitionForm({ ...tuitionForm, mode: event.target.value })} /></Field><Field label="Budget"><input className="admin-input" value={tuitionForm.budget} onChange={(event) => setTuitionForm({ ...tuitionForm, budget: event.target.value })} /></Field><Field label="Description"><textarea className="admin-input min-h-24" value={tuitionForm.description} onChange={(event) => setTuitionForm({ ...tuitionForm, description: event.target.value })} /></Field><CheckBox label="Visible on website" checked={tuitionForm.is_active} onChange={(value) => setTuitionForm({ ...tuitionForm, is_active: value })} /></div>} list={tuitionPosts.map((item) => <ListRow key={item.id} title={item.title} detail={`${item.subject} · ${item.location}`} onEdit={() => startTuitionEdit(item)} onRemove={() => void remove('tuition_posts', item.id)} />)} />}
        {tab === 'testimonials' && <ContentManager title="Testimonials" onSubmit={saveTestimonial} submitLabel={editingId ? 'Save testimonial' : 'Add testimonial'} onCancel={() => { setEditingId(null); setTestimonialForm(emptyTestimonial); }} form={<div className="grid md:grid-cols-2 gap-4"><Field label="Quote"><textarea required className="admin-input min-h-28" value={testimonialForm.quote} onChange={(event) => setTestimonialForm({ ...testimonialForm, quote: event.target.value })} /></Field><Field label="Name"><input required className="admin-input" value={testimonialForm.name} onChange={(event) => setTestimonialForm({ ...testimonialForm, name: event.target.value })} /></Field><Field label="Title"><input className="admin-input" value={testimonialForm.title} onChange={(event) => setTestimonialForm({ ...testimonialForm, title: event.target.value })} /></Field><Field label="Organization"><input className="admin-input" value={testimonialForm.organization} onChange={(event) => setTestimonialForm({ ...testimonialForm, organization: event.target.value })} /></Field><Field label="Display order"><input className="admin-input" type="number" value={testimonialForm.sort_order} onChange={(event) => setTestimonialForm({ ...testimonialForm, sort_order: Number(event.target.value) })} /></Field><CheckBox label="Published" checked={testimonialForm.is_published} onChange={(value) => setTestimonialForm({ ...testimonialForm, is_published: value })} /></div>} list={testimonials.map((item) => <ListRow key={item.id} title={item.name} detail={item.organization} onEdit={() => startTestimonialEdit(item)} onRemove={() => void remove('testimonials', item.id)} />)} />}
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block space-y-2"><span className="text-sm font-bold text-ink-700">{label}</span>{children}</label>; }
function CheckBox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) { return <label className="flex items-center gap-2 text-sm font-semibold text-ink-700"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="w-4 h-4 accent-primary-600" />{label}</label>; }
function ContentManager({ title, form, list, onSubmit, onCancel, submitLabel }: { title: string; form: React.ReactNode; list: React.ReactNode; onSubmit: (event: FormEvent) => void; onCancel: () => void; submitLabel: string }) { return <div className="space-y-8"><form onSubmit={onSubmit} className="admin-card space-y-5"><div className="flex items-center justify-between gap-4"><h2 className="text-xl font-bold text-ink-900">{title}</h2><button type="button" onClick={onCancel} className="admin-secondary"><Plus className="w-4 h-4" /> New</button></div>{form}<div className="flex gap-3"><button className="admin-button" type="submit"><Save className="w-4 h-4" />{submitLabel}</button><button type="button" onClick={onCancel} className="admin-secondary"><X className="w-4 h-4" /> Clear</button></div></form><div className="admin-card"><h2 className="text-xl font-bold text-ink-900 mb-5">Published records</h2><div className="divide-y divide-ink-100">{list}</div></div></div>; }
function ListRow({ title, detail, onEdit, onRemove }: { title: string; detail: string; onEdit: () => void; onRemove: () => void }) { return <div className="py-4 flex items-center justify-between gap-4"><div className="min-w-0"><p className="font-bold text-ink-900 truncate">{title}</p><p className="text-sm text-ink-500 truncate">{detail}</p></div><div className="flex items-center gap-2 flex-shrink-0"><button onClick={onEdit} className="admin-secondary">Edit</button><button onClick={onRemove} className="w-10 h-10 rounded-xl flex items-center justify-center text-error-600 hover:bg-error-50" aria-label={`Remove ${title}`}><Trash2 className="w-4 h-4" /></button></div></div>; }
