import { MapPin, MessageCircle, GraduationCap, ShieldCheck, Star, ArrowRight } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';
import { navigate } from '@/App';

import type { SiteSettings, Tutor } from '@/types/cms';

type DirectoryProps = {
  settings?: SiteSettings | null;
  tutors: Tutor[];
  title?: string;
  subtitle?: string;
};

export default function Directory({ settings, tutors, title, subtitle }: DirectoryProps) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  if (!tutors.length) return null;

  return (
    <section id="tutors" className="py-20 lg:py-28 bg-ink-50">
      <div className="container-max">
        <div ref={ref} className={`max-w-2xl mx-auto text-center mb-14 reveal ${visible ? 'visible' : ''}`}>
          <span className="text-sm font-bold text-primary-600 uppercase tracking-wider">পছন্দের টিউটর খুঁজুন</span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink-900 tracking-tight">
            {title || 'আমাদের যাচাইকৃত সেরা টিউটরবৃন্দ'}
          </h2>
          <p className="mt-5 text-lg text-ink-600 leading-relaxed">
            {subtitle || 'Next Gen Tutors-এর সেরা ও অভিজ্ঞ যাচাইকৃত টিউটরদের সাথে সরাসরি যোগাযোগ করুন।'}
          </p>
        </div>

        {tutors.length > 0 && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h3 className="text-2xl font-bold text-ink-900">ফিচার্ড টিউটরবৃন্দ</h3>
                <p className="text-sm text-ink-500 mt-1">সেরা ভেরিফাইড টিউটরদের সাথে সরাসরি যোগাযোগ করুন</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold bg-primary-50 text-primary-700 px-3 py-1.5 rounded-full">
                  {tutors.length} জন উপলব্ধ
                </span>
                <a
                  href="/tutors"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/tutors');
                  }}
                  className="inline-flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs px-4 py-2 rounded-full shadow transition-all hover:scale-105"
                >
                  <span>{settings?.custom_texts?.dir_btn_view_all || 'সকল টিউটর দেখুন'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tutors.map((tutor) => {
                const rawPhone = tutor.whatsapp_number || '01318126412';
                const cleanPhone = rawPhone.replace(/\D/g, '').replace(/^0/, '880');
                const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                  `হ্যালো! আমি Next Gen Tutors ওয়েবসাইটে ${tutor.name}-এর প্রোফাইল দেখে যোগাযোগ করছি।`
                )}`;

                return (
                  <article
                    key={tutor.id}
                    className="bg-white rounded-3xl border border-ink-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-1 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Large Picture Container */}
                      <div className="relative h-64 sm:h-72 w-full bg-ink-100 overflow-hidden group">
                        {tutor.avatar_url ? (
                          <img
                            src={tutor.avatar_url}
                            alt={tutor.name}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center text-6xl font-bold">
                            {tutor.name.charAt(0)}
                          </div>
                        )}

                        {/* Rating Badge */}
                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md flex items-center gap-1 text-xs font-bold text-ink-900">
                          <Star className="w-3.5 h-3.5 fill-warning-500 text-warning-500" />
                          <span>{(tutor.rating || 5.0).toFixed(1)}</span>
                        </div>

                        {/* Verified Badge */}
                        {tutor.is_verified && (
                          <div className="absolute top-4 right-4 bg-success-500 text-white px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 text-xs font-bold">
                            <ShieldCheck className="w-4 h-4" />
                            <span>{settings?.custom_texts?.hero_stat_verified || 'যাচাইকৃত'}</span>
                          </div>
                        )}
                      </div>

                      {/* Content Below Picture */}
                      <div className="p-6">
                        {/* Name */}
                        <h4 className="text-xl font-bold text-ink-900">{tutor.name}</h4>

                        {/* Department / Institution */}
                        <p className="text-sm font-bold text-primary-600 mt-1 flex items-center gap-1.5">
                          <GraduationCap className="w-4 h-4" />
                          {tutor.department || tutor.headline || 'সাধারণ ইনস্ট্রাক্টর'}
                        </p>

                        {/* Student / Level */}
                        {tutor.student_level && (
                          <p className="text-xs font-semibold text-ink-500 mt-1">
                            শিক্ষার্থীর অবস্থান: {tutor.student_level}
                          </p>
                        )}

                        {/* Bio / Description */}
                        {tutor.bio && <p className="mt-3 text-sm text-ink-600 line-clamp-2 leading-relaxed">{tutor.bio}</p>}

                        {/* Services Offered / Subjects */}
                        <div className="mt-4">
                          <p className="text-xs font-bold text-ink-400 uppercase tracking-wider mb-2">যেসব বিষয়ে পড়ানো হয়:</p>
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
                        <div className="mt-4 pt-4 border-t border-ink-100 flex items-center gap-1.5 text-xs font-semibold text-ink-500">
                          <MapPin className="w-4 h-4 text-primary-500" />
                          <span>{tutor.location || 'ঢাকা, বাংলাদেশ'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Send Message Button (WhatsApp) */}
                    <div className="p-6 pt-0">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm py-3.5 px-4 rounded-2xl shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/30 transition-all hover:scale-[1.02]"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span>{settings?.custom_texts?.tutor_modal_contact || 'মেসেজ দিন (WhatsApp)'}</span>
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Bottom Banner to Separate Tutors Page */}
            <div className="mt-14 text-center bg-gradient-to-r from-primary-900 via-primary-800 to-primary-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-primary-800/80">
              <h4 className="text-2xl sm:text-3xl font-extrabold">সকল টিউটরদের আলাদা পেজে দেখুন</h4>
              <p className="mt-3 text-primary-200 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                পিরোজপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়ের মানসম্মত টিউটর খুঁজে পাওয়ার জন্য এটি একটি চমৎকার প্ল্যাটফর্ম। সার্ভিস অত্যন্ত দ্রুত ও আন্তরিক।

              </p>
              <a
                href="/tutors"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/tutors');
                }}
                className="mt-6 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-8 py-3.5 rounded-full shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
              >
                <span>{settings?.custom_texts?.dir_btn_view_all || 'আলাদা টিউটর পেজে যান'}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
