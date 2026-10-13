import { ArrowRight, CheckCircle2, Smartphone } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';
import type { SiteSettings } from '@/types/cms';

type CTAProps = {
  settings?: SiteSettings | null;
  title?: string;
  description?: string;
  badgeText?: string;
};

export default function CTA({ settings, title, description, badgeText }: CTAProps) {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="cta" className="py-16 lg:py-24 bg-white relative overflow-hidden">
      <div className="container-max">
        <div
          ref={ref}
          className={`relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 p-8 sm:p-12 lg:p-16 border border-indigo-800/50 shadow-2xl text-center max-w-4xl mx-auto reveal ${visible ? 'visible' : ''}`}
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 px-4 py-1.5 rounded-full text-xs font-semibold mb-6">
              <Smartphone className="w-4 h-4 text-indigo-400" />
              {badgeText || 'ওয়েব ও মোবাইলে সহজলভ্য'}
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight text-balance">
              {title || 'কয়েক মিনিটেই আপনার পছন্দের টিউটর খুঁজে নিন'}
            </h2>

            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-medium max-w-2xl mx-auto">
              {description || 'সরাসরি টিউটরের সাথে কথা বলুন — দ্রুত, সহজ এবং ১০০% কমিশন মুক্ত। Next Gen Tutors-এর সাথেই যুক্ত থাকুন।'}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {[
                settings?.custom_texts?.cta_bullet_1 || 'কোনো মিডিয়া ফি বা হিডেন চার্জ নেই',
                settings?.custom_texts?.cta_bullet_2 || 'টিউটরের সাথে সরাসরি যোগাযোগের সুবিধা',
                settings?.custom_texts?.cta_bullet_3 || 'যাচাইকৃত ও ১০০% নির্ভরযোগ্য প্রোফাইল'
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-slate-200 font-medium text-xs sm:text-sm">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={settings?.custom_texts?.footer_wa_link || "https://wa.me/8801318126412"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-emerald-600/25 transition-all hover:-translate-y-0.5 group text-sm sm:text-base cursor-pointer"
              >
                {settings?.custom_texts?.cta_btn_primary || "দ্রুত যোগাযোগ করুন (WhatsApp)"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="tel:01318126412"
                className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl transition-all text-sm sm:text-base hover:-translate-y-0.5 cursor-pointer"
              >
                {settings?.custom_texts?.cta_btn_secondary || "কল করুন: 01318126412"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
