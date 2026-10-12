import { useEffect } from 'react';
import {
  GraduationCap,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Star,
  X,
  Briefcase,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import type { Tutor, SiteSettings } from '@/types/cms';

type TutorProfileModalProps = {
  tutor: Tutor | null;
  onClose: () => void;
  settings?: SiteSettings | null;
};

export default function TutorProfileModal({ tutor, onClose, settings }: TutorProfileModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (tutor) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [tutor, onClose]);

  if (!tutor) return null;

  const rawPhone = tutor.whatsapp_number || '01318126412';
  const cleanPhone = rawPhone.replace(/\D/g, '').replace(/^0/, '880');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `হ্যালো! আমি Next Gen Tutors ওয়েবসাইটে ${tutor.name}-এর প্রোফাইল দেখে যোগাযোগ করছি।`
  )}`;

  const projects = tutor.projects || [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/65 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200/80 flex flex-col justify-between">
        <div>
          {/* Header Banner & Close */}
          <div className="relative h-44 sm:h-52 w-full bg-gradient-to-r from-primary-800 via-primary-700 to-indigo-900 overflow-hidden">
            <div className="absolute inset-0 hero-grid-bg opacity-30" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 p-2 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95"
              aria-label="Close Profile"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Overview Card (floating over header) */}
          <div className="px-6 sm:px-8 pb-6">
            <div className="relative -mt-20 sm:-mt-24 mb-6 flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              {/* Avatar */}
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-3xl border-4 border-white shadow-xl bg-slate-100 overflow-hidden shrink-0">
                {tutor.avatar_url ? (
                  <img
                    src={tutor.avatar_url}
                    alt={tutor.name}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-600 to-primary-800 text-white flex items-center justify-center text-6xl font-bold">
                    {tutor.name.charAt(0)}
                  </div>
                )}
                {/* Rating Badge */}
                <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 text-xs font-bold text-slate-900">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{(tutor.rating || 5.0).toFixed(1)}</span>
                </div>
              </div>

              {/* Name & Credentials */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{tutor.name}</h2>
                  {tutor.is_verified && (
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>{settings?.custom_texts?.hero_stat_verified || 'যাচাইকৃত'}</span>
                    </span>
                  )}
                </div>

                <p className="text-sm sm:text-base font-bold text-primary-600 mt-1.5 flex items-center justify-center sm:justify-start gap-2">
                  <GraduationCap className="w-4 h-4 shrink-0" />
                  <span>{tutor.department || tutor.headline || 'সম্মানিত ইনস্ট্রাক্টর'}</span>
                </p>

                {tutor.student_level && (
                  <p className="text-xs font-semibold text-slate-500 mt-1">
                    শিক্ষার্থীর অবস্থান / বর্ষ: <span className="text-slate-700">{tutor.student_level}</span>
                  </p>
                )}

                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-semibold text-slate-500 mt-2">
                  <MapPin className="w-3.5 h-3.5 text-primary-500 shrink-0" />
                  <span>{tutor.location || 'ঢাকা, বাংলাদেশ'}</span>
                </div>
              </div>
            </div>

            {/* Quick Contact Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 py-3 border-y border-slate-100 mb-6">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-5 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-95"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{settings?.custom_texts?.tutor_modal_contact || 'WhatsApp মেসেজ দিন'}</span>
              </a>

              <a
                href={`tel:${tutor.whatsapp_number || '01318126412'}`}
                className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-5 rounded-2xl transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>সরাসরি কল করুন</span>
              </a>
            </div>

            {/* Bio */}
            {tutor.bio && (
              <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  {settings?.custom_texts?.tutor_modal_about || 'শিক্ষক পরিচিতি (Bio):'}
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {tutor.bio}
                </p>
              </div>
            )}

            {/* Subjects */}
            {tutor.subjects && tutor.subjects.length > 0 && (
              <div className="mb-8">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  {settings?.custom_texts?.tutor_modal_subjects || 'যেসব বিষয়ে পড়ানো হয়:'}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {tutor.subjects.map((subject) => (
                    <span
                      key={subject}
                      className="px-3.5 py-1.5 rounded-xl bg-primary-50 text-primary-700 text-xs font-bold border border-primary-100/80 shadow-2xs"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* EXTENDED SECTION: PROJECTS & WORK PORTFOLIO */}
            <div className="pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-primary-100 text-primary-700 rounded-xl">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900">
                      প্রজেক্ট, গবেষণা ও কাজের বিবরণী (Works & Projects)
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      এই শিক্ষকের উল্লেখযোগ্য প্রকল্প, আর্টিকেল বা বাস্তব কাজের পোর্টফোলিও
                    </p>
                  </div>
                </div>

                {projects.length > 0 && (
                  <span className="text-xs font-bold bg-primary-50 text-primary-700 border border-primary-200/60 px-3 py-1 rounded-full shrink-0">
                    {projects.length} টি কাজ
                  </span>
                )}
              </div>

              {projects.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                  {projects.map((project, idx) => (
                    <div
                      key={project.id || idx}
                      className="bg-slate-50/70 hover:bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-primary-300 transition-all flex flex-col justify-between group"
                    >
                      <div>
                        {/* Picture of Work / Project */}
                        {project.image_url ? (
                          <div className="relative h-44 w-full bg-slate-200 overflow-hidden">
                            <img
                              src={project.image_url}
                              alt={project.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        ) : (
                          <div className="h-28 w-full bg-gradient-to-br from-primary-500/10 to-indigo-500/10 flex items-center justify-center text-primary-400 border-b border-slate-200">
                            <BookOpen className="w-8 h-8" />
                          </div>
                        )}

                        {/* Title & Description */}
                        <div className="p-4 sm:p-5">
                          <h4 className="text-base font-bold text-slate-900 group-hover:text-primary-600 transition-colors leading-snug">
                            {project.title}
                          </h4>
                          {project.description && (
                            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed whitespace-pre-line line-clamp-4">
                              {project.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Article or Project Link */}
                      {project.link_url && (
                        <div className="p-4 sm:p-5 pt-0">
                          <a
                            href={project.link_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-3.5 py-2 rounded-xl transition-all shadow-xs group/link"
                          >
                            <span>আর্টিকেল বা প্রজেক্ট দেখুন</span>
                            <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-slate-500">
                  <Briefcase className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p className="text-sm font-semibold text-slate-700">বর্তমানে কোনো প্রজেক্ট বা কাজের লিংক যুক্ত করা নেই</p>
                  <p className="text-xs text-slate-400 mt-1">শিক্ষক সরাসরি যোগাযোগ সাপেক্ষে অভিজ্ঞতা ও কাজের নমুনা প্রদর্শন করবেন।</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
