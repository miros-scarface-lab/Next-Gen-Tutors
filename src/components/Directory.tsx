import { MapPin, MessageCircle, GraduationCap, ShieldCheck, Star, ArrowRight } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';
import { navigate } from '@/lib/navigation';

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
    <section id="tutors" className="py-16 lg:py-20 bg-dark-600 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
      <div className="absolute -top-40 right-0 w-[500px] h-[500px] bg-primary-600/8 rounded-full blur-[120px]" />

      <div className="container-max relative">
        <div ref={ref} className={`max-w-2xl mx-auto text-center mb-10 reveal ${visible ? 'visible' : ''}`}>
          <span className="text-sm font-bold text-primary-400 uppercase tracking-wider">পছন্দের টিউটর খুঁজুন</span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {title || 'আমাদের যাচাইকৃত সেরা টিউটরবৃন্দ'}
          </h2>
          <p className="mt-4 text-lg text-gray-400 leading-relaxed">
            {subtitle || 'Next Gen Tutors-এর সেরা ও অভিজ্ঞ যাচাইকৃত টিউটরদের সাথে সরাসরি যোগাযোগ করুন।'}
          </p>
        </div>

        {tutors.length > 0 && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">ফিচার্ড টিউটরবৃন্দ</h3>
                <p className="text-sm text-gray-500 mt-0.5">সেরা ভেরিফাইড টিউটরদের সাথে সরাসরি যোগাযোগ করুন</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold glass text-primary-300 px-3 py-1.5 rounded-full">
                  {tutors.length} জন উপলব্ধ
                </span>
                <a
                  href="/tutors"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/tutors');
                  }}
                  className="inline-flex items-center gap-1.5 bg-gradient-to-r from-primary-600 to-violet-600 hover:from-primary-500 hover:to-violet-500 text-white font-bold text-xs px-4 py-2 rounded-full shadow-lg shadow-primary-500/20 transition-all hover:scale-105"
                >
                  <span>{settings?.custom_texts?.dir_btn_view_all || 'সকল টিউটর দেখুন'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutors.map((tutor) => {
                const rawPhone = tutor.whatsapp_number || '01318126412';
                const cleanPhone = rawPhone.replace(/\D/g, '').replace(/^0/, '880');
                const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                  `হ্যালো! আমি Next Gen Tutors ওয়েবসাইটে ${tutor.name}-এর প্রোফাইল দেখে যোগাযোগ করছি।`
                )}`;

                return (
                  <article
                    key={tutor.id}
                    className="card-shine bg-dark-200 rounded-2xl border border-white/5 overflow-hidden hover:border-primary-500/30 hover:shadow-glow transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Large Picture Container */}
                      <div className="relative h-60 sm:h-68 w-full bg-dark-300 overflow-hidden">
                        {tutor.avatar_url ? (
                          <img
                            src={tutor.avatar_url}
                            alt={tutor.name}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary-600 to-violet-700 text-white flex items-center justify-center text-6xl font-bold">
                            {tutor.name.charAt(0)}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-200 via-transparent to-transparent opacity-60" />

                        {/* Rating Badge */}
                        <div className="absolute top-3 left-3 glass-white px-3 py-1.5 rounded-full flex items-center gap-1 text-xs font-bold text-gray-900 shadow-md">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{(tutor.rating || 5.0).toFixed(1)}</span>
                        </div>

                        {/* Verified Badge */}
                        {tutor.is_verified && (
                          <div className="absolute top-3 right-3 bg-emerald-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold shadow-md">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>{settings?.custom_texts?.hero_stat_verified || 'যাচাইকৃত'}</span>
                          </div>
                        )}
                      </div>

                      {/* Content Below Picture */}
                      <div className="p-5">
                        <h4 className="text-lg font-bold text-white">{tutor.name}</h4>

                        <p className="text-sm font-semibold text-primary-400 mt-1 flex items-center gap-1.5">
                          <GraduationCap className="w-4 h-4" />
                          {tutor.department || tutor.headline || 'সাধারণ ইনস্ট্রাক্টর'}
                        </p>

                        {tutor.bio && <p className="mt-2.5 text-sm text-gray-400 line-clamp-2 leading-relaxed">{tutor.bio}</p>}

                        {/* Subjects */}
                        <div className="mt-3">
                          <div className="flex flex-wrap gap-1.5">
                            {tutor.subjects.map((subject) => (
                              <span
                                key={subject}
                                className="px-2.5 py-0.5 rounded-full bg-primary-500/10 text-primary-300 text-xs font-semibold border border-primary-500/15"
                              >
                                {subject}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Location */}
                        <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                          <MapPin className="w-3.5 h-3.5 text-primary-400" />
                          <span>{tutor.location || 'ঢাকা, বাংলাদেশ'}</span>
                        </div>
                      </div>
                    </div>

                    {/* WhatsApp Button */}
                    <div className="p-5 pt-0">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all hover:scale-[1.02]"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span>{settings?.custom_texts?.tutor_modal_contact || 'মেসেজ দিন (WhatsApp)'}</span>
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Bottom Banner */}
            <div className="mt-12 text-center bg-gradient-to-r from-primary-900/50 via-violet-900/50 to-primary-900/50 glass text-white rounded-2xl p-8 sm:p-10">
              <h4 className="text-2xl sm:text-3xl font-extrabold">সকল টিউটরদের আলাদা পেজে দেখুন</h4>
              <p className="mt-3 text-gray-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                পিরোজপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়ের মানসম্মত টিউটর খুঁজে পাওয়ার জন্য এটি একটি চমৎকার প্ল্যাটফর্ম। সার্ভিস অত্যন্ত দ্রুত ও আন্তরিক।
              </p>
              <a
                href="/tutors"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/tutors');
                }}
                className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-sm px-8 py-3.5 rounded-full shadow-lg shadow-emerald-500/25 transition-all hover:scale-105"
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
