import { useState } from 'react';
import {
  ArrowLeft,
  GraduationCap,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  Star,
  Users,
  X,
  Filter,
} from 'lucide-react';
import type { Tutor, SiteSettings } from '@/types/cms';

type TutorsPageProps = {
  tutors: Tutor[];
  brandName?: string;
  settings?: SiteSettings | null;
};

export default function TutorsPage({ tutors, brandName = 'Next Gen Tutors', settings }: TutorsPageProps) {
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);

  const departments = [
    { id: 'all', label: settings?.custom_texts?.filter_all || 'সকল টিউটর' }
  ];

  const dynamicFilters = [
    { id: 'filter_1', labelKey: 'filter_1_label', keywordKey: 'filter_1_keyword', defaultLabel: 'ইঞ্জিনিয়ারিং', defaultKeywords: ['engineering', 'eng', 'ইঞ্জিনিয়ারিং', 'eee', 'cse', 'ce', 'me'] },
    { id: 'filter_2', labelKey: 'filter_2_label', keywordKey: 'filter_2_keyword', defaultLabel: 'গণিত', defaultKeywords: ['math', 'গণিত'] },
    { id: 'filter_3', labelKey: 'filter_3_label', keywordKey: 'filter_3_keyword', defaultLabel: 'মনোবিজ্ঞান', defaultKeywords: ['psychology', 'মনোবিজ্ঞান'] },
    { id: 'filter_4', labelKey: 'filter_4_label', keywordKey: 'filter_4_keyword', defaultLabel: 'পরিসংখ্যান', defaultKeywords: ['stat', 'statistics', 'পরিসংখ্যান'] },
    { id: 'filter_5', labelKey: 'filter_5_label', keywordKey: 'filter_5_keyword' },
    { id: 'filter_6', labelKey: 'filter_6_label', keywordKey: 'filter_6_keyword' },
  ];

  dynamicFilters.forEach(f => {
    const label = settings?.custom_texts?.[f.labelKey] || f.defaultLabel;
    if (label) {
      departments.push({ id: f.id, label });
    }
  });

  const filteredTutors = tutors.filter((tutor) => {
    if (selectedDept === 'all') return true;
    
    const dept = (tutor.department || '').toLowerCase();
    const activeFilter = dynamicFilters.find(f => f.id === selectedDept);
    
    if (activeFilter) {
      const keywordsStr = settings?.custom_texts?.[activeFilter.keywordKey];
      const keywords = keywordsStr 
        ? keywordsStr.split(',').map((k: string) => k.trim().toLowerCase()).filter(Boolean)
        : (activeFilter.defaultKeywords || []);
      
      return keywords.some((k: string) => dept.includes(k));
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="container-max flex items-center justify-between py-4">
          <a href="/" className="flex items-center gap-3 group">
            <img
              src="/Blue_and_Yellow_Modern_Next_Generation_Academy_Logo.png"
              alt={brandName}
              className="w-10 h-10 object-contain group-hover:scale-105 transition-transform"
            />
            <span className="font-display text-lg font-bold tracking-tight text-ink-900">
              {brandName.split(' ')[0]} <span className="text-primary-600">{brandName.split(' ').slice(1).join(' ')}</span>
            </span>
          </a>

          <div className="flex items-center gap-3">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-ink-700 hover:text-primary-600 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-full transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{settings?.custom_texts?.tutors_back_home || 'হোমে ফিরে যান'}</span>
            </a>
            <a
              href={settings?.custom_texts?.footer_wa_link || "https://wa.me/8801318126412"}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-full shadow-md transition-all hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{settings?.custom_texts?.nav_whatsapp_btn || 'হোয়াটসঅ্যাপ যোগাযোগ'}</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-24">
        {/* Banner Section */}
        <section className="bg-gradient-to-b from-primary-900 via-primary-800 to-primary-950 text-white py-16 lg:py-20 relative overflow-hidden">
          <div className="absolute inset-0 hero-grid-bg opacity-20" />
          <div className="container-max relative z-10 text-center max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-primary-700/50 border border-primary-500/30 text-primary-200 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <Users className="w-4 h-4 text-primary-300" />
              <span>{tutors.length} জন যাচাইকৃত টিউটর তালিকাভুক্ত</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              {settings?.custom_texts?.tutors_page_title || 'আমাদের সকল অভিজ্ঞ ও যাচাইকৃত টিউটরবৃন্দ'}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-primary-100 leading-relaxed">
              {settings?.custom_texts?.tutors_page_subtitle || 'বুয়েট, ঢাকা বিশ্ববিদ্যালয়, আইইউটি ও মেডিকেলসহ দেশের শীর্ষ প্রতিষ্ঠানের টিউটরদের সাথে কোনো কমিশন ছাড়াই সরাসরি যোগাযোগ করুন।'}
            </p>

          </div>
        </section>

        {/* Filter Pills & Directory Container */}
        <section className="container-max mt-8">
          {/* Institution Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> ফিল্টার:
            </span>
            {departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setSelectedDept(dept.id)}
                className={`text-xs sm:text-sm font-bold px-4 py-2 rounded-xl transition-all ${selectedDept === dept.id
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/30'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
              >
                {dept.label}
              </button>
            ))}
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              {selectedDept !== 'all'
                ? `${departments.find((d) => d.id === selectedDept)?.label} (${filteredTutors.length})`
                : `সকল টিউটর (${filteredTutors.length})`}
            </h2>
          </div>

          {/* Tutors Grid */}
          {filteredTutors.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredTutors.map((tutor) => {
                const rawPhone = tutor.whatsapp_number || '01318126412';
                const cleanPhone = rawPhone.replace(/\D/g, '').replace(/^0/, '880');
                const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                  `হ্যালো! আমি Next Gen Tutors ওয়েবসাইটে ${tutor.name}-এর প্রোফাইল দেখে যোগাযোগ করছি।`
                )}`;

                return (
                  <article
                    key={tutor.id}
                    className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-1 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Container */}
                      <div className="relative h-64 sm:h-72 w-full bg-slate-100 overflow-hidden group">
                        {tutor.avatar_url ? (
                          <img
                            src={tutor.avatar_url}
                            alt={tutor.name}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary-600 to-primary-800 text-white flex items-center justify-center text-6xl font-bold">
                            {tutor.name.charAt(0)}
                          </div>
                        )}

                        {/* Rating Badge */}
                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md flex items-center gap-1 text-xs font-bold text-slate-900">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{(tutor.rating || 5.0).toFixed(1)}</span>
                        </div>

                        {/* Verified Badge */}
                        {tutor.is_verified && (
                          <div className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 text-xs font-bold">
                            <ShieldCheck className="w-4 h-4" />
                            <span>{settings?.custom_texts?.hero_stat_verified || 'যাচাইকৃত'}</span>
                          </div>
                        )}
                      </div>

                      {/* Content Section */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-slate-900">{tutor.name}</h3>

                        <p className="text-sm font-bold text-primary-600 mt-1 flex items-center gap-1.5">
                          <GraduationCap className="w-4 h-4 shrink-0" />
                          <span>{tutor.department || tutor.headline || 'সাধারণ ইনস্ট্রাক্টর'}</span>
                        </p>

                        {tutor.student_level && (
                          <p className="text-xs font-semibold text-slate-500 mt-1">
                            শিক্ষার্থীর অবস্থান: {tutor.student_level}
                          </p>
                        )}

                        {tutor.bio && (
                          <p className="mt-3 text-sm text-slate-600 line-clamp-2 leading-relaxed">{tutor.bio}</p>
                        )}

                        {/* Subjects */}
                        <div className="mt-4">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">বিষয়সমূহ:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {tutor.subjects.map((subject) => (
                              <span
                                key={subject}
                                className="px-3 py-1 rounded-lg bg-primary-50 text-primary-700 text-xs font-semibold border border-primary-100"
                              >
                                {subject}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Location */}
                        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                          <MapPin className="w-4 h-4 text-primary-500 shrink-0" />
                          <span>{tutor.location || 'ঢাকা, বাংলাদেশ'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-6 pt-0 space-y-2.5">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md transition-all hover:scale-[1.01]"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{settings?.custom_texts?.tutor_modal_contact || 'মেসেজ দিন (WhatsApp)'}</span>
                      </a>
                      <button
                        onClick={() => setSelectedTutor(tutor)}
                        className="w-full inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 px-4 rounded-xl transition-colors"
                      >
                        <span>{settings?.custom_texts?.dir_btn_view_profile || 'সম্পূর্ণ প্রোফাইল দেখুন'}</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">কোনো টিউটর পাওয়া যায়নি</h3>
              <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
                আপনার অনুসন্ধানের সাপেক্ষে কোনো ফলাফল পাওয়া যায়নি। অনুগ্রহ করে অন্য বিষয় বা কিওয়ার্ড দিয়ে চেষ্টা করুন।
              </p>
              <button
                onClick={() => {
                  setSelectedDept('all');
                }}
                className="mt-6 inline-flex items-center gap-2 bg-primary-600 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow hover:bg-primary-700 transition-colors"
              >
                সকল টিউটর রিসেট করুন
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Tutor Detail Modal */}
      {selectedTutor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col justify-between">
            <div className="relative">
              {/* Header Image */}
              <div className="h-48 sm:h-56 w-full bg-slate-100 relative">
                {selectedTutor.avatar_url ? (
                  <img
                    src={selectedTutor.avatar_url}
                    alt={selectedTutor.name}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-600 to-primary-800 text-white flex items-center justify-center text-7xl font-bold">
                    {selectedTutor.name.charAt(0)}
                  </div>
                )}
                <button
                  onClick={() => setSelectedTutor(null)}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white text-slate-700 p-2 rounded-full shadow-lg transition-transform hover:scale-110"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{selectedTutor.name}</h2>
                    {selectedTutor.is_verified && (
                      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" /> verified
                      </span>
                    )}
                  </div>

                  <p className="text-base font-bold text-primary-600 mt-2 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    {selectedTutor.department || selectedTutor.headline}
                  </p>

                  {selectedTutor.student_level && (
                    <p className="text-xs font-semibold text-slate-500 mt-1">
                      শিক্ষার্থীর বর্ষ/লেভেল: {selectedTutor.student_level}
                    </p>
                  )}
                </div>

                {/* Rating & Location */}
                <div className="flex flex-wrap items-center gap-4 py-3 border-y border-slate-100 text-sm font-semibold text-slate-600">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-slate-900">{(selectedTutor.rating || 5.0).toFixed(1)} / 5.0</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary-500" />
                    <span>{selectedTutor.location || 'ঢাকা, বাংলাদেশ'}</span>
                  </div>
                </div>

                {/* Bio */}
                {selectedTutor.bio && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">বিবরণ (Bio):</h4>
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{selectedTutor.bio}</p>
                  </div>
                )}

                {/* Subjects */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">যেসব বিষয়ে পড়ানো হয়:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTutor.subjects.map((subject) => (
                      <span
                        key={subject}
                        className="px-3 py-1.5 rounded-xl bg-primary-50 text-primary-700 text-xs font-bold border border-primary-100"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Direct Action Contacts */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                  <a
                    href={`https://wa.me/${(selectedTutor.whatsapp_number || '01318126412')
                      .replace(/\D/g, '')
                      .replace(/^0/, '880')}?text=${encodeURIComponent(
                        `হ্যালো! আমি Next Gen Tutors ওয়েবসাইটে ${selectedTutor.name}-এর প্রোফাইল দেখে যোগাযোগ করছি।`
                      )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-5 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02]"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>WhatsApp মেসেজ</span>
                  </a>

                  <a
                    href={`tel:${selectedTutor.whatsapp_number || '01318126412'}`}
                    className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3.5 px-5 rounded-2xl transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>কল করুন ({selectedTutor.whatsapp_number || '01318126412'})</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-center text-xs font-medium">
        <div className="container-max">
          <p>© 2026 {brandName}. সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </footer>
    </div>
  );
}
