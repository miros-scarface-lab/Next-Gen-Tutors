import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  GraduationCap,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  BookOpen,
  DollarSign,
  Clock,
  User,
  ListOrdered,
  Search,
  Filter,
  Briefcase
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { navigate } from '@/lib/navigation';
import type { SiteSettings, TuitionRequest } from '@/types/cms';

type TuitionRequestPageProps = {
  settings?: SiteSettings | null;
  brandName?: string;
};

// Seed/Fallback requests so live requests feed is never empty even before database seed
const initialDemoRequests: TuitionRequest[] = [
  {
    id: 'seed-req-1',
    guardian_name: 'আহমেদ রফিক',
    guardian_phone: '01712345678',
    student_class: 'HSC (১ম / ২য় বর্ষ)',
    subjects: 'উচ্চতর গণিত, পদার্থবিজ্ঞান ও রসায়ন',
    location: 'পিরোজপুর সদর, হাসপাতাল রোড',
    salary_budget: '৮,০০০ - ১০,০০০ টাকা / মাস',
    days_per_week: 'সপ্তাহে ৩ দিন',
    preferred_gender: 'Any',
    preferred_university: 'PrSTU / বুয়েট / ঢাবি',
    notes: 'সন্ধ্যায় পড়াতে হবে, নিয়মিত মক টেস্ট নেওয়া প্রয়োজন।',
    status: 'pending',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'seed-req-2',
    guardian_name: 'ফারহানা ইসলাম',
    guardian_phone: '01898765432',
    student_class: 'SSC (৯ম / ১০ম শ্রেণি)',
    subjects: 'সাধারণ গণিত, ইংরেজি ও আইসিটি',
    location: 'পিরোজপুর কলেজ রোড',
    salary_budget: '৬,০০০ - ৮,০০০ টাকা / মাস',
    days_per_week: 'সপ্তাহে ৪ দিন',
    preferred_gender: 'Female',
    preferred_university: 'PrSTU শিক্ষার্থী',
    notes: 'ছাত্রীর জন্য নারী শিক্ষিকা প্রয়োজন।',
    status: 'pending',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 'seed-req-3',
    guardian_name: 'মোহাম্মদ সেলিম',
    guardian_phone: '01911223344',
    student_class: 'Class 6 - 8 (জেএসসি)',
    subjects: 'সকল বিষয় (All Subjects)',
    location: 'পিরোজপুর বিশ্ববিদ্যালয় ক্যাম্পাস সংলগ্ন',
    salary_budget: '৫,০০০ - ৭,০০০ টাকা / মাস',
    days_per_week: 'সপ্তাহে ৫ দিন',
    preferred_gender: 'Any',
    preferred_university: 'PrSTU',
    notes: 'বেসিক মজবুত করতে হবে।',
    status: 'pending',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString()
  }
];

export default function TuitionRequestPage({ settings, brandName = 'Mentorio Pirojpur' }: TuitionRequestPageProps) {
  // Active Tab: 'form' (নতুন রিকোয়েস্ট) or 'live' (চলমান টিউশন রিকোয়েস্টসমূহ)
  const [activeTab, setActiveTab] = useState<'form' | 'live'>('form');

  // Guardian details (auto-remembered in localStorage)
  const [guardianName, setGuardianName] = useState(() => {
    return localStorage.getItem('ngt_cached_guardian_name') || '';
  });
  const [guardianPhone, setGuardianPhone] = useState(() => {
    return localStorage.getItem('ngt_cached_guardian_phone') || '';
  });
  const [guardianEmail, setGuardianEmail] = useState(() => {
    return localStorage.getItem('ngt_cached_guardian_email') || '';
  });

  // Tuition Details input state
  const [studentClass, setStudentClass] = useState('HSC (১ম / ২য় বর্ষ)');
  const [subjects, setSubjects] = useState('');
  const [location, setLocation] = useState('');
  const [salaryBudget, setSalaryBudget] = useState('৮,০০০ - ১০,০০০ টাকা / মাস');
  const [daysPerWeek, setDaysPerWeek] = useState('সপ্তাহে ৩ দিন');
  const [preferredGender, setPreferredGender] = useState('Any');
  const [preferredUniversity, setPreferredUniversity] = useState('PrSTU / বুয়েট / ঢাবি');
  const [notes, setNotes] = useState('');

  // Form submission state
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<TuitionRequest | null>(null);

  // Live and My Requests state
  const [allRequests, setAllRequests] = useState<TuitionRequest[]>(initialDemoRequests);
  const [myRequests, setMyRequests] = useState<TuitionRequest[]>([]);
  const [filterClass, setFilterClass] = useState('all');

  // Load requests on mount
  useEffect(() => {
    loadPublicRequests();
    if (guardianPhone) {
      loadMyRequests(guardianPhone);
    }
  }, [guardianPhone]);

  const loadPublicRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('tuition_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setAllRequests(data as TuitionRequest[]);
      } else {
        // Fallback: merge seed with master localStorage list
        const localMaster = localStorage.getItem('ngt_all_tuition_requests');
        if (localMaster) {
          const parsed: TuitionRequest[] = JSON.parse(localMaster);
          const ids = new Set(parsed.map(r => r.id));
          const merged = [...parsed, ...initialDemoRequests.filter(r => !ids.has(r.id))];
          setAllRequests(merged);
        } else {
          setAllRequests(initialDemoRequests);
        }
      }
    } catch {
      const localMaster = localStorage.getItem('ngt_all_tuition_requests');
      if (localMaster) {
        setAllRequests(JSON.parse(localMaster));
      } else {
        setAllRequests(initialDemoRequests);
      }
    }
  };

  const loadMyRequests = (phone: string) => {
    const local = localStorage.getItem(`ngt_requests_${phone}`);
    if (local) {
      try {
        setMyRequests(JSON.parse(local));
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!guardianName.trim() || !guardianPhone.trim()) {
      alert('অনুগ্রহ করে আপনার নাম এবং মোবাইল নম্বর প্রদান করুন');
      return;
    }

    if (!subjects.trim() || !location.trim() || !salaryBudget.trim()) {
      alert('অনুগ্রহ করে বিষয়, এলাকা এবং বাজেট পূরণ করুন');
      return;
    }

    setSubmitting(true);

    // Save guardian info to local cache for next time
    localStorage.setItem('ngt_cached_guardian_name', guardianName.trim());
    localStorage.setItem('ngt_cached_guardian_phone', guardianPhone.trim());
    localStorage.setItem('ngt_cached_guardian_email', guardianEmail.trim());

    const newReq: Omit<TuitionRequest, 'id'> = {
      guardian_name: guardianName.trim(),
      guardian_phone: guardianPhone.trim(),
      guardian_email: guardianEmail.trim(),
      student_class: studentClass,
      subjects: subjects.trim(),
      preferred_gender: preferredGender,
      preferred_university: preferredUniversity,
      salary_budget: salaryBudget,
      days_per_week: daysPerWeek,
      location: location.trim(),
      notes: notes.trim(),
      status: 'pending',
    };

    try {
      // 1. Try Supabase Insert
      const { data, error } = await supabase
        .from('tuition_requests')
        .insert([newReq])
        .select('*')
        .single();

      let savedItem: TuitionRequest;

      if (!error && data) {
        savedItem = data as TuitionRequest;
      } else {
        console.warn('Supabase insert note (table or RLS): storing locally & notifying WhatsApp', error);
        savedItem = {
          ...newReq,
          id: `req-${Date.now()}`,
          created_at: new Date().toISOString()
        };
      }

      // 2. Persist locally to personal and global lists
      saveLocalRequest(savedItem);

      // 3. Update in-memory state so it immediately shows on page
      setAllRequests(prev => [savedItem, ...prev.filter(r => r.id !== savedItem.id)]);
      setMyRequests(prev => [savedItem, ...prev.filter(r => r.id !== savedItem.id)]);
      setSubmittedSuccess(savedItem);

      // 4. Reset specific inputs
      setSubjects('');
      setNotes('');
    } catch (err) {
      console.warn('Submission caught error:', err);
      const fallbackItem: TuitionRequest = {
        ...newReq,
        id: `req-${Date.now()}`,
        created_at: new Date().toISOString()
      };
      saveLocalRequest(fallbackItem);
      setAllRequests(prev => [fallbackItem, ...prev.filter(r => r.id !== fallbackItem.id)]);
      setMyRequests(prev => [fallbackItem, ...prev.filter(r => r.id !== fallbackItem.id)]);
      setSubmittedSuccess(fallbackItem);
    } finally {
      setSubmitting(false);
    }
  };

  const saveLocalRequest = (req: TuitionRequest) => {
    // 1. Save to phone list
    const phone = req.guardian_phone;
    const existing = localStorage.getItem(`ngt_requests_${phone}`);
    const list: TuitionRequest[] = existing ? JSON.parse(existing) : [];
    const updated = [req, ...list.filter((r) => r.id !== req.id)];
    localStorage.setItem(`ngt_requests_${phone}`, JSON.stringify(updated));

    // 2. Save to global master list for Admin Panel and public view
    const globalExisting = localStorage.getItem('ngt_all_tuition_requests');
    const globalList: TuitionRequest[] = globalExisting ? JSON.parse(globalExisting) : [];
    const globalUpdated = [req, ...globalList.filter((r) => r.id !== req.id)];
    localStorage.setItem('ngt_all_tuition_requests', JSON.stringify(globalUpdated));
  };

  // Filter live requests by class
  const filteredLiveRequests = allRequests.filter(req => {
    if (filterClass === 'all') return true;
    return req.student_class.toLowerCase().includes(filterClass.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="container-max flex items-center justify-between py-4">
          <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="flex items-center gap-3 group">
            <img
              src="/Blue_and_Yellow_Modern_Next_Generation_Academy_Logo.png"
              alt={brandName}
              className="w-10 h-10 object-contain group-hover:scale-105 transition-transform"
            />
            <span className="font-display text-lg font-bold tracking-tight text-slate-900">
              {brandName.split(' ')[0]} <span className="text-indigo-600">{brandName.split(' ').slice(1).join(' ')}</span>
            </span>
          </a>

          <div className="flex items-center gap-3">
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); navigate('/'); }}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>হোমে ফিরে যান</span>
            </a>
            <a
              href="/tutors"
              onClick={(e) => { e.preventDefault(); navigate('/tutors'); }}
              className="hidden sm:inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-indigo-700 hover:text-indigo-800 bg-indigo-50 border border-indigo-200/80 px-4 py-2 rounded-xl transition-all"
            >
              <GraduationCap className="w-4 h-4" />
              <span>টিউটর তালিকা</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 pb-24">
        {/* Banner Section with SEO Keywords */}
        <section className="bg-gradient-to-b from-indigo-900 via-slate-900 to-indigo-950 text-white py-14 lg:py-18 relative overflow-hidden border-b border-slate-800">
          <div className="container-max relative z-10 text-center max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>১০০% কমিশন-মুক্ত অভিভাবক ও টিউটর সার্ভিস</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              টিউটর রিকোয়েস্ট ও টিউশন পোস্ট
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-medium">
              আপনার সন্তানের বিষয় ও বাজেট অনুযায়ী অভিজ্ঞ শিক্ষক খুঁজতে ফর্মটি পূরণ করুন, অথবা নিচে চলমান টিউশন রিকোয়েস্টগুলো দেখুন।
            </p>

            {/* Navigation Tabs */}
            <div className="mt-8 inline-flex p-1.5 bg-slate-800/80 backdrop-blur rounded-2xl border border-slate-700/80 shadow-lg">
              <button
                type="button"
                onClick={() => setActiveTab('form')}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  activeTab === 'form'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>নতুন টিউটর রিকোয়েস্ট করুন</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('live')}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  activeTab === 'live'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <ListOrdered className="w-4 h-4" />
                <span>চলমান টিউশন রিকোয়েস্ট ({allRequests.length})</span>
              </button>
            </div>
          </div>
        </section>

        <section className="container-max mt-10 max-w-4xl">
          {activeTab === 'form' ? (
            /* TAB 1: TUITION REQUEST FORM */
            <div className="space-y-8">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm">
                <div className="border-b border-slate-100 pb-5 mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-indigo-600" />
                    টিউশন চাহিদাপত্র পূরণ করুন
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                    নিচের তথ্যগুলো পূরণ করে সরাসরি জমা দিন। কোনো মিডিয়া ফি ছাড়াই আপনার সাথে সরাসরি যোগাযোগ করা হবে।
                  </p>
                </div>

                <form onSubmit={handleSubmitRequest} className="space-y-6">
                  {/* Guardian Personal Contact Section */}
                  <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                    <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-4 h-4 text-indigo-600" />
                      অভিভাবকের যোগাযোগের তথ্য
                    </h3>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          আপনার নাম *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="যেমন: ইঞ্জি. শফিকুর রহমান"
                          value={guardianName}
                          onChange={(e) => setGuardianName(e.target.value)}
                          className="w-full bg-white border border-slate-200 focus:border-indigo-500 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          মোবাইল নম্বর (WhatsApp) *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="যেমন: 01318126412"
                          value={guardianPhone}
                          onChange={(e) => setGuardianPhone(e.target.value)}
                          className="w-full bg-white border border-slate-200 focus:border-indigo-500 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        ইমেইল (ঐচ্ছিক)
                      </label>
                      <input
                        type="email"
                        placeholder="আপনার ইমেইল অ্যাড্রেস"
                        value={guardianEmail}
                        onChange={(e) => setGuardianEmail(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:border-indigo-500 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>

                  {/* Tuition Requirements Section */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    {/* Class / Grade Level */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        শিক্ষার্থীর শ্রেণি / লেভেল *
                      </label>
                      <select
                        value={studentClass}
                        onChange={(e) => setStudentClass(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="Class 1 - 5">ক্লাস ১ - ৫</option>
                        <option value="Class 6 - 8 (জেএসসি)">ক্লাস ৬ - ৮ (জেএসসি)</option>
                        <option value="SSC (৯ম / ১০ম শ্রেণি)">এসএসসি / ৯ম-১০ম শ্রেণি (বিজ্ঞান/মানবিক/ব্যবসায়)</option>
                        <option value="HSC (১ম / ২য় বর্ষ)">এইচএসসি / ১ম-২য় বর্ষ (বিজ্ঞান/মানবিক/ব্যবসায়)</option>
                        <option value="বিশ্ববিদ্যালয় ভর্তি পরীক্ষা">বিশ্ববিদ্যালয় ভর্তি পরীক্ষার্থী</option>
                        <option value="O-Level / A-Level">O-Level / A-Level (English Medium)</option>
                        <option value="অন্যান্য">অন্যান্য</option>
                      </select>
                    </div>

                    {/* Subjects */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        যে বিষয়গুলো পড়াতে হবে *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="যেমন: পদার্থবিজ্ঞান, উচ্চতর গণিত, রসায়ন"
                        value={subjects}
                        onChange={(e) => setSubjects(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    {/* Location */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        পড়ানোর এলাকা / অবস্থান *
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          placeholder="যেমন: পিরোজপুর সদর / কলেজ রোড"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    {/* Monthly Budget */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        সম্মানী / মান্থলি বাজেট *
                      </label>
                      <div className="relative">
                        <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          placeholder="যেমন: ৮,০০০ - ১০,০০০ টাকা / মাস"
                          value={salaryBudget}
                          onChange={(e) => setSalaryBudget(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-6">
                    {/* Days per week */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        সপ্তাহে কত দিন?
                      </label>
                      <select
                        value={daysPerWeek}
                        onChange={(e) => setDaysPerWeek(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="সপ্তাহে ৩ দিন">সপ্তাহে ৩ দিন</option>
                        <option value="সপ্তাহে ৪ দিন">সপ্তাহে ৪ দিন</option>
                        <option value="সপ্তাহে ৫ দিন">সপ্তাহে ৫ দিন</option>
                        <option value="সপ্তাহে ৬ দিন">সপ্তাহে ৬ দিন</option>
                      </select>
                    </div>

                    {/* Preferred Gender */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        শিক্ষকের জেন্ডার পছন্দ
                      </label>
                      <select
                        value={preferredGender}
                        onChange={(e) => setPreferredGender(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="Any">যেকোনো (পুরুষ/নারী)</option>
                        <option value="Male">ছাত্র/ছাত্রীর জন্য পুরুষ শিক্ষক</option>
                        <option value="Female">ছাত্রীর জন্য নারী শিক্ষিকা</option>
                      </select>
                    </div>

                    {/* Preferred Institution */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        শিক্ষকের প্রতিষ্ঠান পছন্দ
                      </label>
                      <input
                        type="text"
                        placeholder="যেমন: PrSTU / বুয়েট / ঢাবি"
                        value={preferredUniversity}
                        onChange={(e) => setPreferredUniversity(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      অতিরিক্ত কোনো চাহিদা বা নোট (ঐচ্ছিক)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="যেমন: সন্ধ্যার পরে পড়ানো ভালো হয়, অথবা অভিজ্ঞতার সনদ দেখতে চাই।"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-emerald-600/20 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2.5 text-base cursor-pointer"
                  >
                    {submitting ? (
                      <span>জমা দেওয়া হচ্ছে...</span>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>টিউশন রিকোয়েস্ট নিশ্চিত করুন</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* My Submitted Requests Box if any */}
              {myRequests.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <ListOrdered className="w-5 h-5 text-indigo-600" />
                    আপনার সম্প্রতি জমা দেওয়া রিকোয়েস্টসমূহ ({myRequests.length})
                  </h3>

                  <div className="space-y-4">
                    {myRequests.map((req) => (
                      <div key={req.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">{req.student_class}</span>
                            <span className="text-xs text-indigo-600 font-semibold">• {req.subjects}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 font-medium">
                            এলাকা: {req.location} | বাজেট: {req.salary_budget} ({req.days_per_week})
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                            req.status === 'assigned'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : req.status === 'contacted'
                              ? 'bg-blue-100 text-blue-800 border-blue-300'
                              : 'bg-amber-100 text-amber-800 border-amber-300'
                          }`}>
                            {req.status === 'assigned' ? 'টিউটর কনফার্মড' : req.status === 'contacted' ? 'যোগাযোগ করা হয়েছে' : 'পেন্ডিং / শিক্ষক খোঁজা হচ্ছে'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* TAB 2: LIVE TUITION REQUESTS FEED (SHOWING ON WEBSITE) */
            <div className="space-y-6">
              {/* Filter Row */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">শ্রেণি ফিল্টার:</span>
                  <select
                    value={filterClass}
                    onChange={(e) => setFilterClass(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-xs font-bold text-slate-800 focus:outline-none"
                  >
                    <option value="all">সকল শ্রেণি ({allRequests.length})</option>
                    <option value="HSC">এইচএসসি (HSC)</option>
                    <option value="SSC">এসএসসি (SSC)</option>
                    <option value="Class">ক্লাস ১ - ৮</option>
                  </select>
                </div>

                <button
                  onClick={() => setActiveTab('form')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>নতুন রিকোয়েস্ট পোস্ট করুন</span>
                </button>
              </div>

              {/* Feed Grid */}
              <div className="grid md:grid-cols-2 gap-5">
                {filteredLiveRequests.map((req) => {
                  const applyWaMsg = `আসসালামু আলাইকুম! Mentorio Pirojpur ওয়েবসাইটে রিকোয়েস্ট (${req.student_class} - ${req.subjects}, এলাকা: ${req.location}) দেখে আমি এই টিউশনে পড়াতে আগ্রহী।`;
                  const applyUrl = `https://wa.me/8801318126412?text=${encodeURIComponent(applyWaMsg)}`;

                  return (
                    <div
                      key={req.id}
                      className="bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Header Status & Class */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2.5 py-1 rounded-lg">
                            {req.student_class}
                          </span>
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                            req.status === 'assigned'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            {req.status === 'assigned' ? '✓ টিউটর কনফার্মড' : '● শিক্ষক খোঁজা হচ্ছে'}
                          </span>
                        </div>

                        {/* Subject */}
                        <h3 className="text-base font-bold text-slate-900 leading-snug mb-2">
                          {req.subjects}
                        </h3>

                        {/* Location & Budget Info */}
                        <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                          <div className="flex items-center gap-1.5 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>এলাকা: <strong className="text-slate-800">{req.location}</strong></span>
                          </div>

                          <div className="flex items-center gap-1.5 font-medium">
                            <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>বাজেট: <strong className="text-emerald-700">{req.salary_budget}</strong> ({req.days_per_week})</span>
                          </div>

                          {req.preferred_university && (
                            <div className="flex items-center gap-1.5 font-medium text-slate-500">
                              <GraduationCap className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                              <span>পছন্দ: {req.preferred_university}</span>
                            </div>
                          )}

                          {req.notes && (
                            <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg mt-2 border border-slate-100">
                              "{req.notes}"
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Card Action for Tutors */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                        <span className="text-[10px] text-slate-400 font-medium">
                          পোস্ট আইডি: #{req.id.slice(-6)}
                        </span>

                        <a
                          href={applyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 rounded-xl transition-all shadow-xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>টিউশন নিতে যোগাযোগ</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Success Modal with 1-Click WhatsApp Direct Notification */}
      {submittedSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center shadow-2xl border border-slate-200">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">রিকোয়েস্ট সফলভাবে জমা হয়েছে!</h3>
            <p className="text-sm text-slate-600 mt-2 font-medium leading-relaxed">
              আপনার টিউশন রিকোয়েস্ট সফলভাবে নথিভুক্ত হয়েছে। আমাদের টিম খুব দ্রুত উপযুক্ত টিউটর বাছাই করে আপনার সাথে যোগাযোগ করবে।
            </p>

            <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
              <a
                href={`https://wa.me/8801318126412?text=${encodeURIComponent(
                  `আসসালামু আলাইকুম, আমি Mentorio Pirojpur ওয়েবসাইটে একটি টিউশন রিকোয়েস্ট জমা দিয়েছি:\n- অভিভাবক: ${submittedSuccess.guardian_name}\n- মোবাইল: ${submittedSuccess.guardian_phone}\n- শ্রেণি: ${submittedSuccess.student_class}\n- বিষয়: ${submittedSuccess.subjects}\n- এলাকা: ${submittedSuccess.location}\n- বাজেট: ${submittedSuccess.salary_budget}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all text-sm hover:scale-105"
              >
                <MessageCircle className="w-4 h-4" />
                <span>তাৎক্ষণিক WhatsApp-এ নোটিফাই করুন</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setSubmittedSuccess(null);
                  setActiveTab('live');
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer"
              >
                লাইভ টিউশন রিকোয়েস্ট দেখুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-center text-xs font-medium">
        <div className="container-max">
          <p>© 2026 {brandName}. সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </footer>
    </div>
  );
}
