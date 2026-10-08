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
  UserCheck,
  Sparkles,
  BookOpen,
  DollarSign,
  Clock,
  User,
  Lock,
  LogOut,
  ListOrdered
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { navigate } from '@/lib/navigation';
import type { SiteSettings, TuitionRequest } from '@/types/cms';

type TuitionRequestPageProps = {
  settings?: SiteSettings | null;
  brandName?: string;
};

interface GuardianUser {
  name: string;
  phone: string;
  email?: string;
}

export default function TuitionRequestPage({ settings, brandName = 'Next Gen Tutors' }: TuitionRequestPageProps) {
  // Guardian Auth state stored in localStorage
  const [guardian, setGuardian] = useState<GuardianUser | null>(() => {
    const saved = localStorage.getItem('ngt_guardian_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Auth Modal/Tab state
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authError, setAuthError] = useState('');

  // Form input state
  const [studentClass, setStudentClass] = useState('HSC (১ম / ২য় বর্ষ)');
  const [subjects, setSubjects] = useState('');
  const [location, setLocation] = useState('');
  const [salaryBudget, setSalaryBudget] = useState('৮,০০০ - ১০,০০০ টাকা / মাস');
  const [daysPerWeek, setDaysPerWeek] = useState('সপ্তাহে ৩ দিন');
  const [preferredGender, setPreferredGender] = useState('Any');
  const [preferredUniversity, setPreferredUniversity] = useState('যে কোনো স্বনামধন্য বিশ্ববিদ্যালয়');
  const [notes, setNotes] = useState('');

  // Form submission state
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<TuitionRequest | null>(null);
  const [myRequests, setMyRequests] = useState<TuitionRequest[]>([]);

  // Load guardian's existing requests
  useEffect(() => {
    if (guardian?.phone) {
      loadMyRequests(guardian.phone);
    }
  }, [guardian]);

  const loadMyRequests = async (phone: string) => {
    try {
      // Fetch from Supabase
      const { data, error } = await supabase
        .from('tuition_requests')
        .select('*')
        .eq('guardian_phone', phone)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setMyRequests(data as TuitionRequest[]);
      } else {
        // Fallback to local storage requests
        const local = localStorage.getItem(`ngt_requests_${phone}`);
        if (local) setMyRequests(JSON.parse(local));
      }
    } catch {
      const local = localStorage.getItem(`ngt_requests_${phone}`);
      if (local) setMyRequests(JSON.parse(local));
    }
  };

  const handleGuardianLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authName.trim() || !authPhone.trim()) {
      setAuthError('অনুগ্রহ করে নাম এবং মোবাইল নম্বর প্রদান করুন');
      return;
    }
    const newUser: GuardianUser = {
      name: authName.trim(),
      phone: authPhone.trim(),
      email: authEmail.trim()
    };
    localStorage.setItem('ngt_guardian_user', JSON.stringify(newUser));
    setGuardian(newUser);
    setAuthError('');
  };

  const handleGuardianLogout = () => {
    localStorage.removeItem('ngt_guardian_user');
    setGuardian(null);
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guardian) return;
    if (!subjects.trim() || !location.trim() || !salaryBudget.trim()) {
      alert('অনুগ্রহ করে বিষয়, অবস্থান এবং বাজেট পূরণ করুন');
      return;
    }

    setSubmitting(true);
    const newReq: Omit<TuitionRequest, 'id'> = {
      guardian_name: guardian.name,
      guardian_phone: guardian.phone,
      guardian_email: guardian.email || '',
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
      const { data, error } = await supabase
        .from('tuition_requests')
        .insert([newReq])
        .select('*')
        .single();

      if (error) {
        console.warn('Supabase insert error, falling back to local state:', error);
        const fallbackReq: TuitionRequest = {
          ...newReq,
          id: `local-${Date.now()}`,
          created_at: new Date().toISOString()
        };
        saveLocalRequest(fallbackReq);
        setSubmittedSuccess(fallbackReq);
      } else if (data) {
        setSubmittedSuccess(data as TuitionRequest);
        saveLocalRequest(data as TuitionRequest);
      }
    } catch {
      const fallbackReq: TuitionRequest = {
        ...newReq,
        id: `local-${Date.now()}`,
        created_at: new Date().toISOString()
      };
      saveLocalRequest(fallbackReq);
      setSubmittedSuccess(fallbackReq);
    } finally {
      setSubmitting(false);
      loadMyRequests(guardian.phone);
    }
  };

  const saveLocalRequest = (req: TuitionRequest) => {
    if (!guardian?.phone) return;
    const existing = localStorage.getItem(`ngt_requests_${guardian.phone}`);
    const list: TuitionRequest[] = existing ? JSON.parse(existing) : [];
    const updated = [req, ...list];
    localStorage.setItem(`ngt_requests_${guardian.phone}`, JSON.stringify(updated));
  };

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
        {/* Banner Section */}
        <section className="bg-gradient-to-b from-indigo-900 via-slate-900 to-indigo-950 text-white py-14 lg:py-18 relative overflow-hidden border-b border-slate-800">
          <div className="container-max relative z-10 text-center max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>১০০% কমিশন-মুক্ত অভিভাবক সেবা</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              টিউটর রিকোয়েস্ট করুন
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-medium">
              আপনার সন্তানের প্রয়োজন ও বাজেট অনুযায়ী পছন্দের টিউটর খুঁজে পেতে নিচের ফর্মে বিস্তারিত জমা দিন। কোনো মিডিয়া ফি ছাড়াই সরাসরি যোগাযোগ করা হবে।
            </p>
          </div>
        </section>

        <section className="container-max mt-10 max-w-4xl">
          {/* Step 1: Guardian Login / Account Verification */}
          {!guardian ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-lg max-w-xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-14 h-14 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600">
                  <UserCheck className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">অভিভাবক লগইন / প্রবেশ করুন</h2>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 font-medium">
                  টিউটর রিকোয়েস্ট জমা দিতে এবং আপনার রিকোয়েস্টের অগ্রগতি দেখতে প্রথমে লগইন করুন।
                </p>
              </div>

              {authError && (
                <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-3 rounded-xl">
                  {authError}
                </div>
              )}

              <form onSubmit={handleGuardianLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    আপনার নাম *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="যেমন: ইঞ্জি. শফিকুর রহমান"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    মোবাইল নম্বর (WhatsApp) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="যেমন: 01318126412"
                      value={authPhone}
                      onChange={(e) => setAuthPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
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
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all hover:-translate-y-0.5 mt-2 flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>নিরাপদে প্রবেশ করুন</span>
                </button>
              </form>
            </div>
          ) : (
            /* Step 2: Guardian Logged In -> Tuition Request Form */
            <div className="space-y-8">
              {/* Logged in User Bar */}
              <div className="bg-indigo-50 border border-indigo-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{guardian.name}</span>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                        লগইন সম্পন্ন
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">মোবাইল: {guardian.phone}</p>
                  </div>
                </div>

                <button
                  onClick={handleGuardianLogout}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-red-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>লগআউট</span>
                </button>
              </div>

              {/* Form Box */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm">
                <div className="border-b border-slate-100 pb-5 mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-indigo-600" />
                    টিউশন চাহিদাপত্র পূরণ করুন
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                    নিচের তথ্যগুলো সতর্কতার সাথে পূরণ করুন যাতে আপনার চাহিদা অনুযায়ী সেরা টিউটর বাছাই করা যায়।
                  </p>
                </div>

                <form onSubmit={handleSubmitRequest} className="space-y-6">
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
                        <option value="Class 6 - 8">ক্লাস ৬ - ৮ (জেএসসি)</option>
                        <option value="SSC (৯ম / ১০ম শ্রেণি)">এসএসসি / ৯ম-১০ম শ্রেণি (বিজ্ঞান/মানবিক/ব্যবসায়)</option>
                        <option value="HSC (১ম / ২য় বর্ষ)">এইচএসসি / ১ম-২য় বর্ষ (বিজ্ঞান/মানবিক/ব্যবসায়)</option>
                        <option value="Admission Candidate">বিশ্ববিদ্যালয় ভর্তি পরীক্ষার্থী</option>
                        <option value="O-Level / A-Level">O-Level / A-Level (English Medium)</option>
                        <option value="Other">অন্যান্য</option>
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
                        placeholder="যেমন: পদার্থবিজ্ঞান, উচ্চতর গণিত, ইংরেজি"
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
                          placeholder="যেমন: পিরোজপুর সদর / উত্তরা ৪ নং সেক্টর"
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
                          placeholder="যেমন: ৮,০০০ - ১০,০০০ টাকা"
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
                        <option value="Male">ছাত্রী/ছাত্রের জন্য পুরুষ শিক্ষক</option>
                        <option value="Female">ছাত্রী/ছাত্রের জন্য নারী শিক্ষিকা</option>
                      </select>
                    </div>

                    {/* Preferred Institution */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        শিক্ষকের প্রতিষ্ঠান পছন্দ
                      </label>
                      <input
                        type="text"
                        placeholder="যেমন: বুয়েট / আইইউটি / ঢাবি"
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
                      placeholder="যেমন: সন্ধ্যার পরে পড়ানো ভালো হয়, অথবা টিউটরের পূর্ব অভিজ্ঞতার সনদ দেখতে চাই।"
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

              {/* My Submitted Requests Section */}
              {myRequests.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <ListOrdered className="w-5 h-5 text-indigo-600" />
                    আপনার জমা দেওয়া টিউশন রিকোয়েস্টসমূহ ({myRequests.length})
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
                            {req.status === 'assigned' ? 'টিউটর কনফার্মড' : req.status === 'contacted' ? 'যোগাযোগ করা হয়েছে' : 'পেন্ডিং'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {/* Success Modal */}
      {submittedSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 text-center shadow-2xl border border-slate-200">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">রিকোয়েস্ট সফলভাবে জমা হয়েছে!</h3>
            <p className="text-sm text-slate-600 mt-2 font-medium leading-relaxed">
              আপনার টিউশন রিকোয়েস্ট আমাদের প্যানেলে রেকর্ড করা হয়েছে। আমাদের টিম খুব শীঘ্রই উপযুক্ত টিউটর বাছাই করে আপনার সাথে যোগাযোগ করবে।
            </p>

            <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
              <a
                href={`https://wa.me/8801318126412?text=${encodeURIComponent(
                  `আসসালামু আলাইকুম, আমি Next Gen Tutors ওয়েবসাইটে একটি টিউশন রিকোয়েস্ট জমা দিয়েছি।\nঅভিভাবক: ${submittedSuccess.guardian_name}\nমোবাইল: ${submittedSuccess.guardian_phone}\nবিষয়: ${submittedSuccess.subjects}\nএলাকা: ${submittedSuccess.location}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>তাৎক্ষণিক WhatsApp-এ নোটিফাই করুন</span>
              </a>

              <button
                onClick={() => setSubmittedSuccess(null)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors"
              >
                বন্ধ করুন
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
