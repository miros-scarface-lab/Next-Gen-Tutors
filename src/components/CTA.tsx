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
          className={`relative rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 p-8 sm:p-12 lg:p-14 border border-indigo-800/50 shadow-xl reveal ${visible ? 'visible' : ''}`}
        >
          <div className="relative grid lg:grid-cols-2 gap-10 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 px-3.5 py-1 rounded-full text-xs font-semibold mb-5">
                <Smartphone className="w-4 h-4 text-indigo-400" />
                {badgeText || 'ওয়েব ও মোবাইলে সহজলভ্য'}
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight text-balance">
                {title || 'কয়েক মিনিটেই আপনার পছন্দের টিউটর খুঁজে নিন'}
              </h2>

              <p className="mt-4 text-base text-slate-300 leading-relaxed font-medium">
                {description || 'সরাসরি টিউটরের সাথে কথা বলুন — দ্রুত, সহজ এবং ১০০% কমিশন মুক্ত। Next Gen Tutors-এর সাথেই যুক্ত থাকুন।'}
              </p>

              <div className="mt-6 space-y-2.5">
                {[
                  settings?.custom_texts?.cta_bullet_1 || 'কোনো মিডিয়া ফি বা হিডেন চার্জ নেই',
                  settings?.custom_texts?.cta_bullet_2 || 'টিউটরের সাথে সরাসরি যোগাযোগের সুবিধা',
                  settings?.custom_texts?.cta_bullet_3 || 'যাচাইকৃত ও ১০০% নির্ভরযোগ্য প্রোফাইল'
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-slate-200 font-medium text-xs sm:text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a
                  href={settings?.custom_texts?.footer_wa_link || "https://wa.me/8801318126412"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-7 py-3.5 rounded-xl shadow-md transition-all hover:-translate-y-0.5 group text-sm sm:text-base"
                >
                  {settings?.custom_texts?.cta_btn_primary || "দ্রুত যোগাযোগ করুন (WhatsApp)"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="tel:01318126412"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-bold px-7 py-3.5 rounded-xl transition-all text-sm sm:text-base"
                >
                  {settings?.custom_texts?.cta_btn_secondary || "কল করুন: 01318126412"}
                </a>
              </div>
            </div>

            {/* Right Phone Mockup */}
            <div className="relative hidden lg:block">
              <div className="relative mx-auto w-64 h-[440px]">
                <div className="absolute inset-0 bg-slate-900 rounded-2xl shadow-2xl border-4 border-slate-700 p-2">
                  <div className="w-full h-full bg-slate-50 rounded-xl overflow-hidden">
                    <div className="bg-indigo-600 p-4 text-center">
                      <div className="w-12 h-12 mx-auto bg-white/20 rounded-xl flex items-center justify-center mb-2">
                        <Smartphone className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-white font-bold text-xs">Next Gen Tutors</p>
                    </div>
                    <div className="p-3 space-y-2.5">
                      {['Math Tutor - BUET', 'Physics - Dhaka Univ.', 'English - IUT'].map((item, i) => (
                        <div key={i} className="bg-white border border-slate-200 rounded-lg p-2.5 flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">{item}</p>
                            <p className="text-[10px] text-amber-600 font-semibold">★★★★★ 4.9</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
