import { useState } from 'react';
import { MapPin, MessageCircle, GraduationCap, ShieldCheck, Star, ArrowRight, Briefcase } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';
import { navigate } from '@/lib/navigation';
import TutorProfileModal from '@/components/TutorProfileModal';
import type { SiteSettings, Tutor } from '@/types/cms';

type DirectoryProps = {
  settings?: SiteSettings | null;
  tutors?: Tutor[];
  loading?: boolean;
  title?: string;
  subtitle?: string;
};

export default function Directory({ settings, tutors = [], loading = false, title, subtitle }: DirectoryProps) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);

  const displayTutors = tutors.slice(0, 6);

  return (
    <section id="directory" className="py-14 lg:py-20 bg-white relative">
      <div className="container-max">
        {/* Section Heading */}
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

        {/* Loading Skeletons State */}
        {loading && displayTutors.length === 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs animate-pulse flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-200 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-slate-200 rounded-lg w-3/4" />
                      <div className="h-3.5 bg-slate-200 rounded-md w-1/2" />
                      <div className="h-4 bg-indigo-100 rounded-md w-24 mt-1" />
                    </div>
                  </div>
                  <div className="h-8 bg-slate-100 rounded-xl mb-4" />
                  <div className="flex gap-2">
                    <div className="h-6 bg-indigo-50 rounded-lg w-16" />
                    <div className="h-6 bg-indigo-50 rounded-lg w-20" />
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100 flex gap-3 mt-6">
                  <div className="h-10 bg-slate-200 rounded-xl flex-1" />
                  <div className="h-10 bg-emerald-200 rounded-xl w-24" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State if no tutors found */}
        {!loading && displayTutors.length === 0 && (
          <div className="py-14 text-center bg-slate-50 border border-dashed border-slate-200 rounded-3xl max-w-xl mx-auto">
            <GraduationCap className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-base font-bold text-slate-700">বর্তমানে কোনো টিউটর তালিকাভুক্ত নেই</p>
            <p className="text-xs text-slate-400 mt-1">শীঘ্রই নতুন টিউটরদের প্রোফাইল ও প্রজেক্ট প্রদর্শিত হবে।</p>
          </div>
        )}

        {/* Tutor Cards Grid */}
        {displayTutors.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayTutors.map((tutor) => {
              const projectCount = tutor.projects?.length || 0;
              const waNumber = (tutor as any).contact_whatsapp || tutor.whatsapp_number || '01318126412';
              const cleanPhone = waNumber.replace(/\D/g, '').replace(/^0/, '880');
              const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                `হ্যালো! আমি Next Gen Tutors ওয়েবসাইটে ${tutor.name}-এর প্রোফাইল দেখে যোগাযোগ করছি।`
              )}`;

              return (
                <div
                  key={tutor.id}
                  className="group bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    {/* Header Profile Info */}
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        onClick={() => setSelectedTutor(tutor)}
                        className="relative cursor-pointer shrink-0"
                        title="প্রোফাইল দেখতে ক্লিক করুন"
                      >
                        <img
                          src={
                            tutor.avatar_url ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
                          }
                          alt={tutor.name}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 group-hover:scale-105 transition-transform"
                        />
                        {tutor.is_verified && (
                          <div
                            className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full shadow"
                            title="Verified Tutor"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h3
                            onClick={() => setSelectedTutor(tutor)}
                            className="text-lg font-bold text-slate-900 truncate group-hover:text-indigo-600 cursor-pointer transition-colors"
                          >
                            {tutor.name}
                          </h3>
                          {tutor.rating && (
                            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md shrink-0">
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                              <span className="text-xs font-bold text-amber-900">{tutor.rating}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 text-slate-600 text-xs mt-1 font-semibold truncate">
                          <GraduationCap className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                          <span className="truncate">
                            {tutor.department || (tutor as any).university || tutor.headline || 'সম্মানিত ইনস্ট্রাক্টর'}
                          </span>
                        </div>

                        {projectCount > 0 && (
                          <div className="mt-1.5">
                            <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-100 text-[11px] font-bold px-2 py-0.5 rounded-md">
                              <Briefcase className="w-3 h-3 text-indigo-600" />
                              <span>{projectCount}টি প্রজেক্ট</span>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Location Badge */}
                    <div className="flex items-center gap-1.5 text-slate-600 text-xs font-medium bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl mb-4">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{tutor.location || 'পিরোজপুর'}</span>
                    </div>

                    {/* Subjects Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {tutor.subjects?.slice(0, 3).map((sub) => (
                        <span
                          key={sub}
                          className="text-xs font-semibold bg-indigo-50 border border-indigo-100 text-indigo-700 px-2.5 py-1 rounded-lg"
                        >
                          {sub}
                        </span>
                      ))}
                      {(tutor.subjects?.length || 0) > 3 && (
                        <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">
                          +{(tutor.subjects?.length || 0) - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 mt-auto">
                    <button
                      type="button"
                      onClick={() => setSelectedTutor(tutor)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200/80 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer"
                    >
                      <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{settings?.custom_texts?.dir_btn_view_profile || 'প্রোফাইল ও প্রজেক্ট'}</span>
                    </button>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2.5 rounded-xl transition-colors shadow-sm"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>মেসেজ</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View All Button */}
        {displayTutors.length > 0 && (
          <div className="mt-10 text-center">
            <a
              href="/tutors"
              onClick={(e) => {
                e.preventDefault();
                navigate('/tutors');
              }}
              className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-md hover:-translate-y-0.5 cursor-pointer"
            >
              <span>{settings?.custom_texts?.dir_btn_view_all || 'সকল টিউটর তালিকা দেখুন'}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        )}

        {/* Tutor Profile Modal with Extended Projects & Works */}
        <TutorProfileModal
          tutor={selectedTutor}
          onClose={() => setSelectedTutor(null)}
          settings={settings}
        />
      </div>
    </section>
  );
}
