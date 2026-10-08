import { MapPin, Users, BookOpen, Award } from 'lucide-react';
import { stats } from '@/data/content';
import { useReveal } from '@/hooks/useReveal';
import type { SiteSettings } from '@/types/cms';

const statIcons = [Users, BookOpen, Award, MapPin];

export default function Stats({ settings }: { settings?: SiteSettings | null }) {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="about" className="py-16 lg:py-24 bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white relative overflow-hidden">
      {/* Ambient background blur */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />

      <div className="container-max relative z-10">
        <div ref={ref} className={`text-center mb-14 reveal ${visible ? 'visible' : ''}`}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight text-balance">
            {settings?.custom_texts?.stats_title || 'বিশ্বস্ত টিউটর নেটওয়ার্ক'}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
            {settings?.custom_texts?.stats_subtitle || 'কোনো মিডিয়া বা তৃতীয় পক্ষ ছাড়াই দেশের শত শত দক্ষ ও অভিজ্ঞ শিক্ষকের সাথে যুক্ত হওয়ার নির্ভরযোগ্য মাধ্যম।'}
          </p>
        </div>

        {/* Stats Grid with Sharp Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = statIcons[i];
            return (
              <div
                key={stat.label}
                className="bg-white/5 border border-white/10 backdrop-blur rounded-xl p-6 text-center transition-all duration-300 hover:border-indigo-400/40"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(24px)',
                  transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s`,
                }}
              >
                <div className="inline-flex w-12 h-12 rounded-lg bg-indigo-500/20 border border-indigo-400/30 items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-indigo-300" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {settings?.custom_texts?.[`stat_${i + 1}_val`] || stat.value}
                </div>
                <p className="mt-2 text-xs sm:text-sm font-semibold text-slate-300">
                  {settings?.custom_texts?.[`stat_${i + 1}_label`] || stat.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Location Map Section */}
        <div className="mt-14 rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-8 lg:p-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {settings?.custom_texts?.stats_map_title || 'সারাদেশব্যাপী আমাদের সেবা'}
              </h3>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base font-medium">
                {settings?.custom_texts?.stats_map_subtitle || 'পিরোজপুর সহ বাংলাদেশের বিভিন্ন এলাকায় আমাদের যাচাইকৃত অভিজ্ঞ টিউটর সেবা রয়েছে। আপনি যেখানেই থাকুন না কেন, আপনার পছন্দের টিউটর খুঁজে পাওয়া এখন সহজ।'}
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                {(settings?.custom_texts?.stats_map_cities || 'পিরোজপুর')
                  .split(',')
                  .map((c: string) => c.trim())
                  .filter(Boolean)
                  .map((city: string) => (
                  <span
                    key={city}
                    className="inline-flex items-center gap-1.5 bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold px-3.5 py-1.5 rounded-lg"
                  >
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                    {city}
                  </span>
                ))}
              </div>
            </div>

            {/* Decorative Location Graphic */}
            <div className="relative h-56 rounded-xl bg-slate-950/50 border border-white/10 overflow-hidden flex items-center justify-center p-6 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 mx-auto flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <h4 className="text-white font-bold text-base">পিরোজপুর ও আশেপাশের এলাকা</h4>
                <p className="text-xs text-slate-400 font-medium">যাচাইকৃত হোম ও অনলাইন টিউটরিং সার্ভিস</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
