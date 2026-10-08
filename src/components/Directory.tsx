import { useState } from 'react';
import { MapPin, MessageCircle, GraduationCap, ShieldCheck, Star, ArrowRight, X } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';
import { navigate } from '@/lib/navigation';

import type { SiteSettings, Tutor } from '@/types/cms';

type DirectoryProps = {
  settings?: SiteSettings | null;
  tutors?: Tutor[];
  title?: string;
  subtitle?: string;
};

export default function Directory({ settings, tutors = [], title, subtitle }: DirectoryProps) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);

  const displayTutors = tutors.slice(0, 6);

  return (
    <section id="directory" className="py-14 lg:py-20 bg-white relative">
      <div className="container-max">
        {/* Section Heading - Compact Margin to prevent huge gap */}
        <div ref={ref} className={`max-w-3xl mx-auto text-center mb-10 reveal ${visible ? 'visible' : ''}`}>
          <span className="inline-block text-xs sm:text-sm font-bold text-indigo-700 uppercase tracking-wider bg-indigo-50 border border-indigo-200/80 px-3.5 py-1 rounded-full mb-3">
            {settings?.custom_texts?.dir_badge || 'যাচাইকৃত টিউটর প্যানেল'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
            {title || 'আমাদের সেরা ও অভিজ্ঞ টিউটরবৃন্দ'}
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed font-medium">
            {subtitle || 'আপনার এলাকার সেরা বিশ্ববিদ্যালয় থেকে আসা শিক্ষক বেছে নিন কোনো মাধ্যম ছাড়াই।'}
          </p>
        </div>

        {/* Tutor Cards Grid with Sharp Edges & NO student level/year */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayTutors.map((tutor, i) => (
            <div
              key={tutor.id}
              className="group bg-white border border-slate-200 hover:border-indigo-300 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1 flex flex-col justify-between"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(24px)',
                transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s`,
              }}
            >
              <div>
                {/* Header Profile Info */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative">
                    <img
                      src={tutor.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                      alt={tutor.name}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                    />
                    {tutor.is_verified && (
                      <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-md shadow" title="Verified Tutor">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-lg font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                        {tutor.name}
                      </h3>
                      {tutor.rating && (
                        <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                          <span className="text-xs font-bold text-amber-900">{tutor.rating}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-600 text-xs mt-1 font-semibold truncate">
                      <GraduationCap className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                      <span className="truncate">{tutor.university}</span>
                    </div>

                    <p className="text-xs text-slate-500 mt-0.5 font-medium truncate">
                      {tutor.department}
                    </p>
                  </div>
                </div>

                {/* Location Badge */}
                <div className="flex items-center gap-1.5 text-slate-600 text-xs font-medium bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-lg mb-4">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{tutor.location}</span>
                </div>

                {/* Subjects Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {tutor.subjects?.slice(0, 3).map((sub) => (
                    <span key={sub} className="text-xs font-semibold bg-indigo-50 border border-indigo-100 text-indigo-700 px-2.5 py-1 rounded-md">
                      {sub}
                    </span>
                  ))}
                  {(tutor.subjects?.length || 0) > 3 && (
                    <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                      +{(tutor.subjects?.length || 0) - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 mt-auto">
                <div>
                  <span className="text-[11px] text-slate-500 font-medium block">সম্মানী</span>
                  <span className="text-base font-extrabold text-slate-900">{tutor.salary}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedTutor(tutor)}
                    className="text-xs font-bold text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200/70 px-3 py-2 rounded-lg transition-colors"
                  >
                    {settings?.custom_texts?.dir_btn_view_profile || "প্রোফাইল"}
                  </button>

                  <a
                    href={tutor.contact_whatsapp ? `https://wa.me/${tutor.contact_whatsapp.replace(/[^0-9]/g, '')}` : (settings?.custom_texts?.footer_wa_link || "https://wa.me/8801318126412")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-2 rounded-lg transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    যোগাযোগ
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-10 text-center">
          <a
            href="/tutors"
            onClick={(e) => {
              e.preventDefault();
              navigate('/tutors');
            }}
            className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-md hover:-translate-y-0.5"
          >
            {settings?.custom_texts?.dir_btn_view_all || "সকল টিউটর তালিকা দেখুন"}
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Tutor Profile Modal */}
      {selectedTutor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
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
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-xl transition-colors"
              >
                বন্ধ করুন
              </button>
              <a
                href={selectedTutor.contact_whatsapp ? `https://wa.me/${selectedTutor.contact_whatsapp.replace(/[^0-9]/g, '')}` : (settings?.custom_texts?.footer_wa_link || "https://wa.me/8801318126412")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                সরাসরি WhatsApp-এ কথা বলুন
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
