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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="container-max flex items-center justify-between py-4">
          <a href="/" className="flex items-center gap-3 group">
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
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{settings?.custom_texts?.tutors_back_home || 'হোমে ফিরে যান'}</span>
            </a>
            <a
              href={settings?.custom_texts?.footer_wa_link || "https://wa.me/8801318126412"}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl shadow-sm transition-all hover:scale-105"
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
        <section className="bg-gradient-to-b from-indigo-900 via-slate-900 to-indigo-950 text-white py-14 lg:py-18 relative overflow-hidden border-b border-slate-800">
          <div className="container-max relative z-10 text-center max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>{tutors.length} জন যাচাইকৃত টিউটর তালিকাভুক্ত</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              {settings?.custom_texts?.tutors_page_title || 'আমাদের সকল অভিজ্ঞ ও যাচাইকৃত টিউটরবৃন্দ'}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-medium">
              {settings?.custom_texts?.tutors_page_subtitle || 'পিরোজপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়ের (PSTU) অভিজ্ঞ টিউটরদের সাথে কোনো কমিশন ছাড়াই সরাসরি যোগাযোগ করুন।'}
            </p>
          </div>
        </section>

        {/* Filter Pills & Directory Container */}
        <section className="container-max mt-8">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-indigo-600" /> ফিল্টার:
            </span>
            {departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setSelectedDept(dept.id)}
                className={`text-xs sm:text-sm font-bold px-4 py-2 rounded-lg transition-all ${selectedDept === dept.id
                  ? 'bg-indigo-600 text-white shadow-sm'
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTutors.map((tutor) => {
                const rawPhone = tutor.whatsapp_number || '01318126412';
                const cleanPhone = rawPhone.replace(/\D/g, '').replace(/^0/, '880');
                const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                  `হ্যালো! আমি Next Gen Tutors ওয়েবসাইটে ${tutor.name}-এর প্রোফাইল দেখে যোগাযোগ করছি।`
                )}`;

                return (
                  <article
                    key={tutor.id}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Container */}
                      <div className="relative h-60 w-full bg-slate-100 overflow-hidden group border-b border-slate-200/80">
                        {tutor.avatar_url ? (
                          <img
                            src={tutor.avatar_url}
                            alt={tutor.name}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-indigo-700 to-indigo-900 text-white flex items-center justify-center text-6xl font-bold">
                            {tutor.name.charAt(0)}
                          </div>
                        )}

                        {/* Rating Badge */}
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1 text-xs font-bold text-slate-900 border border-slate-200/60">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{(tutor.rating || 5.0).toFixed(1)}</span>
                        </div>

                        {/* Verified Badge */}
                        {tutor.is_verified && (
                          <div className="absolute top-3 right-3 bg-emerald-600 text-white px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1 text-xs font-bold">
                            <ShieldCheck className="w-4 h-4" />
                            <span>{settings?.custom_texts?.hero_stat_verified || 'যাচাইকৃত'}</span>
                          </div>
                        )}
                      </div>

                      {/* Content Section */}
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-slate-900">{tutor.name}</h3>

                        <p className="text-xs sm:text-sm font-semibold text-indigo-600 mt-1 flex items-center gap-1.5">
                          <GraduationCap className="w-4 h-4 shrink-0" />
                          <span>{tutor.university || tutor.department}</span>
                        </p>

                        <p className="text-xs text-slate-500 mt-0.5 font-medium">
                          {tutor.department}
                        </p>

                        {tutor.bio && (
                          <p className="mt-3 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed font-medium">{tutor.bio}</p>
                        )}

                        {/* Subjects */}
                        <div className="mt-4">
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">বিষয়সমূহ:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {tutor.subjects.map((subject) => (
                              <span
                                key={subject}
                                className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100"
                              >
                                {subject}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Location */}
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span>{tutor.location || 'পিরোজপুর, বাংলাদেশ'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-5 pt-0 space-y-2">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm py-2.5 px-4 rounded-lg shadow-sm transition-all"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{settings?.custom_texts?.tutor_modal_contact || 'মেসেজ দিন (WhatsApp)'}</span>
                      </a>
                      <button
                        onClick={() => setSelectedTutor(tutor)}
                        className="w-full inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2 px-4 rounded-lg transition-colors"
                      >
                        <span>{settings?.custom_texts?.dir_btn_view_profile || 'সম্পূর্ণ প্রোফাইল দেখুন'}</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
              <div className="w-14 h-14 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">কোনো টিউটর পাওয়া যায়নি</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-md mx-auto font-medium">
                আপনার অনুসন্ধানের সাপেক্ষে কোনো ফলাফল পাওয়া যায়নি। অনুগ্রহ করে অন্য ফিল্টার চেষ্টা করুন।
              </p>
              <button
                onClick={() => {
                  setSelectedDept('all');
                }}
                className="mt-5 inline-flex items-center gap-2 bg-indigo-600 text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow hover:bg-indigo-700 transition-colors"
              >
                সকল টিউটর রিসেট করুন
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Tutor Detail Modal */}
      {selectedTutor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 relative">
            <button
              onClick={() => setSelectedTutor(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4 mb-6 pr-8">
              <img
                src={selectedTutor.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                alt={selectedTutor.name}
                className="w-20 h-20 rounded-xl object-cover border border-slate-200"
              />
              <div>
                <h3 className="text-xl font-bold text-slate-900">{selectedTutor.name}</h3>
                <p className="text-sm font-semibold text-indigo-600 mt-0.5">{selectedTutor.university}</p>
                <p className="text-xs text-slate-500 font-medium">{selectedTutor.department}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-md border border-emerald-200/60">
                    সম্মানী: {selectedTutor.salary}
                  </span>
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md">
                    অভিজ্ঞতা: {selectedTutor.experience || '২+ বছর'}
                  </span>
                </div>
              </div>
            </div>

            {selectedTutor.bio && (
              <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">সম্পর্কে</h4>
                <p className="text-sm text-slate-700 leading-relaxed font-medium bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                  {selectedTutor.bio}
                </p>
              </div>
            )}

            <div className="mb-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">যে বিষয়গুলো পড়ান</h4>
              <div className="flex flex-wrap gap-2">
                {selectedTutor.subjects?.map((sub) => (
                  <span key={sub} className="text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60 px-3 py-1 rounded-lg">
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">পড়ানোর এলাকা</h4>
              <p className="text-sm text-slate-700 font-medium flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <MapPin className="w-4 h-4 text-indigo-600" />
                {selectedTutor.location}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedTutor(null)}
                className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg transition-colors"
              >
                বন্ধ করুন
              </button>
              <a
                href={`https://wa.me/${(selectedTutor.whatsapp_number || '01318126412')
                  .replace(/\D/g, '')
                  .replace(/^0/, '880')}?text=${encodeURIComponent(
                    `হ্যালো! আমি Next Gen Tutors ওয়েবসাইটে ${selectedTutor.name}-এর প্রোফাইল দেখে যোগাযোগ করছি।`
                  )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                সরাসরি WhatsApp-এ কথা বলুন
              </a>
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
