import { Search, Star, Users, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { navigate } from '@/App';

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
    <section id="home" className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-grid-bg opacity-60" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-200/40 rounded-full blur-3xl animate-blob" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-200/30 rounded-full blur-3xl animate-blob" style={{ animationDelay: '3s' }} />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-success-200/30 rounded-full blur-3xl animate-blob" style={{ animationDelay: '5s' }} />

      <div className="container-max relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text */}
          <div className="text-center lg:text-left animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              {badgeText || '১০০% কমিশন-মুক্ত প্ল্যাটফর্ম'}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-ink-900 leading-[1.15] tracking-tight text-balance">
              {title ? title : <>আপনার সন্তানের জন্য সেরা ও অভিজ্ঞ <span className="gradient-text">টিউটর খুঁজুন</span></>}
            </h1>

            <p className="mt-6 text-lg text-ink-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
              {description ?? 'বুয়েট, ঢাকা বিশ্ববিদ্যালয়, আইইউটি সহ শীর্ষ বিশ্ববিদ্যালয়ের অভিজ্ঞ ও বিশ্বস্ত টিউটরদের সাথে সরাসরি যোগাযোগ করুন। কোনো মধ্যস্বত্বভোগী বা কমিশন ছাড়াই।'}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href={settings?.custom_texts?.footer_wa_link || "https://wa.me/8801318126412"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold px-7 py-3.5 rounded-full shadow-xl shadow-emerald-600/30 hover:shadow-2xl hover:shadow-emerald-600/40 transition-all hover:scale-105 group"
              >
                {settings?.custom_texts?.nav_whatsapp_btn || "দ্রুত যোগাযোগ (WhatsApp)"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="/tutors"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/tutors');
                }}
                className="inline-flex items-center justify-center gap-2 bg-white border border-ink-200 hover:border-primary-300 text-ink-700 hover:text-primary-600 font-bold px-7 py-3.5 rounded-full shadow-sm hover:shadow-md transition-all"
              >
                {settings?.custom_texts?.hero_btn_find_tutor || "টিউটরবৃন্দ দেখুন"}
              </a>
            </div>

            {/* Trust badges */}
            <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3">
              <div className="flex items-center gap-2 text-ink-600">
                <ShieldCheck className="w-5 h-5 text-success-500" />
                <span className="text-sm font-semibold">{settings?.custom_texts?.hero_stat_verified || "যাচাইকৃত টিউটর"}</span>
              </div>
              <div className="flex items-center gap-2 text-ink-600">
                <Star className="w-5 h-5 text-warning-400 fill-warning-400" />
                <span className="text-sm font-semibold">{settings?.custom_texts?.stat_3_label ? `${settings?.custom_texts?.stat_3_label} ${settings?.custom_texts?.stat_3_val}` : "রেটিং ৪.৯/৫"}</span>
              </div>
              <div className="flex items-center gap-2 text-ink-600">
                <Users className="w-5 h-5 text-primary-500" />
                <span className="text-sm font-semibold">{settings?.custom_texts?.hero_stat_students || "৫০,০০০+ টিউটর"}</span>
              </div>
            </div>
          </div>

          {/* Right: Image with floating cards */}
          <div className="relative animate-slide-in-right">
            <div className="relative">
              {/* Main image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-ink-900/20 ring-1 ring-ink-900/5 bg-white flex items-center justify-center p-8">
                <img
                  src={'/hero-image.png'}
                  alt="Tutor helping a student study"
                  className="w-full h-auto max-h-[420px] lg:max-h-[500px] object-contain"
                />
              </div>

              {/* Floating card: Tutor found */}
              <div className="absolute -top-4 -left-4 lg:-left-8 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 animate-float">
                <div className="w-11 h-11 rounded-xl bg-success-50 flex items-center justify-center">
                  <ShieldCheck className="w-5.5 h-5.5 text-success-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-ink-500">টিউটর ভেরিফাইড</p>
                  <p className="text-sm font-bold text-ink-900">আইডি নিশ্চিত</p>
                </div>
              </div>

              {/* Floating card: Rating */}
              <div className="absolute -bottom-5 -right-4 lg:-right-8 bg-white rounded-2xl shadow-xl p-4 animate-float" style={{ animationDelay: '2s' }}>
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-warning-400 fill-warning-400" />
                  ))}
                </div>
                <p className="text-xs font-semibold text-ink-500">১,২০০+ রিভিউ</p>
                <p className="text-sm font-bold text-ink-900">শীর্ষ টিউটরবৃন্দ</p>
              </div>

              {/* Floating card: Search */}
              <div className="absolute top-1/2 -right-2 lg:right-4 bg-white rounded-2xl shadow-xl p-3.5 flex items-center gap-2.5 animate-float" style={{ animationDelay: '4s' }}>
                <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center">
                  <Search className="w-4.5 h-4.5 text-primary-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-ink-500">খোঁজা হচ্ছে...</p>
                  <p className="text-sm font-bold text-ink-900">গণিত, পদার্থবিজ্ঞান</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
