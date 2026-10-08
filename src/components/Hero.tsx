import { Search, Star, Users, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { navigate } from '@/lib/navigation';

import type { SiteSettings } from '@/types/cms';

type HeroProps = {
  settings?: SiteSettings | null;
  title?: string;
  description?: string;
  badgeText?: string;
  imageUrl?: string;
};

export default function Hero({ settings, title, description, badgeText, imageUrl }: HeroProps) {
  return (
    <section id="home" className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-gradient-to-b from-slate-100 via-indigo-50/40 to-slate-50 border-b border-slate-200/70">
      {/* Background Soft Glow Ambient Effects */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-indigo-200/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-100/40 rounded-full blur-[100px] pointer-events-none" />

      <div className="container-max relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div className="text-center lg:text-left animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200/80 text-indigo-700 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              {badgeText || '১০০% কমিশন-মুক্ত প্ল্যাটফর্ম'}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold text-slate-900 leading-[1.15] tracking-tight text-balance">
              {title ? title : <>আপনার সন্তানের জন্য সেরা ও অভিজ্ঞ <span className="gradient-text-indigo">টিউটর খুঁজুন</span></>}
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
              {description ?? 'পিরোজপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়ের (PrSTU) অভিজ্ঞ ও বিশ্বস্ত টিউটরদের সাথে সরাসরি যোগাযোগ করুন। কোনো মধ্যস্বত্বভোগী বা কমিশন ছাড়াই।'}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href={settings?.custom_texts?.footer_wa_link || "https://wa.me/8801318126412"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-7 py-3.5 rounded-xl shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 group text-sm sm:text-base"
              >
                {settings?.custom_texts?.nav_whatsapp_btn || "দ্রুত যোগাযোগ (WhatsApp)"}
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="/tutors"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/tutors');
                }}
                className="inline-flex items-center justify-center gap-2 bg-white border border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/50 text-slate-800 font-bold px-7 py-3.5 rounded-xl shadow-sm transition-all duration-200 hover:-translate-y-0.5 text-sm sm:text-base"
              >
                {settings?.custom_texts?.hero_btn_find_tutor || "টিউটরবৃন্দ দেখুন"}
              </a>
            </div>

            {/* Trust Badges */}
            <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6 border-t border-slate-200/80 pt-6">
              <div className="flex items-center gap-2 text-slate-700">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-xs sm:text-sm font-bold">{settings?.custom_texts?.hero_stat_verified || "যাচাইকৃত টিউটর"}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Star className="w-4 h-4 text-amber-600 fill-amber-500" />
                </div>
                <span className="text-xs sm:text-sm font-bold">{settings?.custom_texts?.stat_3_label ? `${settings?.custom_texts?.stat_3_label} ${settings?.custom_texts?.stat_3_val}` : "রেটিং ৪.৯/৫"}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Users className="w-4 h-4 text-indigo-600" />
                </div>
                <span className="text-xs sm:text-sm font-bold">{settings?.custom_texts?.hero_stat_students || "৫০+ টিউটর"}</span>
              </div>
            </div>
          </div>

          {/* Right: Sharp Floating Image Card */}
          <div className="relative animate-fade-in-up">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Sharp Image Frame */}
              <div className="relative rounded-2xl overflow-hidden bg-white p-2 border border-slate-200 shadow-xl shadow-indigo-950/5">
                <img
                  src={imageUrl || settings?.hero_image_url || '/hero-image.png'}
                  alt="Next Gen Tutors Hero"
                  className="w-full h-[400px] lg:h-[480px] object-cover rounded-xl"
                />
              </div>

              {/* Floating Badge 1: Verification */}
              <div className="absolute -top-4 -left-4 lg:-left-6 bg-white/95 backdrop-blur border border-slate-200/90 rounded-xl shadow-lg p-3.5 flex items-center gap-3 animate-float">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200/60 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">টিউটর ভেরিফাইড</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-900">১০০% শতভাগ নিশ্চিত</p>
                </div>
              </div>

              {/* Floating Badge 2: Rating */}
              <div className="absolute -bottom-5 -right-4 lg:-right-6 bg-white/95 backdrop-blur border border-slate-200/90 rounded-xl shadow-lg p-3.5 animate-float" style={{ animationDelay: '2s' }}>
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                  ))}
                </div>
                <p className="text-[11px] font-semibold text-slate-500">১,২০০+ রিভিউ</p>
                <p className="text-xs sm:text-sm font-bold text-slate-900">শীর্ষ টিউটরবৃন্দ</p>
              </div>

              {/* Floating Badge 3: Search */}
              <div className="absolute top-1/2 -right-3 lg:right-2 bg-white/95 backdrop-blur border border-slate-200/90 rounded-xl shadow-lg p-3 flex items-center gap-2.5 animate-float" style={{ animationDelay: '4s' }}>
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200/60 flex items-center justify-center">
                  <Search className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500">খোঁজা হচ্ছে...</p>
                  <p className="text-xs font-bold text-slate-900">গণিত, পদার্থবিজ্ঞান</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
