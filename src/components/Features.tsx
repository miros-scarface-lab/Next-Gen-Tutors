import { features } from '@/data/content';
import { useReveal } from '@/hooks/useReveal';

import type { SiteSettings } from '@/types/cms';

type FeaturesProps = {
  settings?: SiteSettings | null;
  title?: string;
  subtitle?: string;
};

export default function Features({ settings, title, subtitle }: FeaturesProps) {
  const { ref, visible } = useReveal<HTMLDivElement>();

  const cardColors = [
    'from-primary-500/10 to-violet-500/10 hover:from-primary-500/20 hover:to-violet-500/20',
    'from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20',
    'from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20',
    'from-rose-500/10 to-pink-500/10 hover:from-rose-500/20 hover:to-pink-500/20',
    'from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20',
    'from-fuchsia-500/10 to-purple-500/10 hover:from-fuchsia-500/20 hover:to-purple-500/20',
  ];

  const iconColors = [
    'from-primary-500 to-violet-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
    'from-cyan-500 to-blue-600',
    'from-fuchsia-500 to-purple-600',
  ];

  return (
    <section id="features" className="py-16 lg:py-24 bg-dark-700 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
      <div className="container-max">
        {/* Section heading */}
        <div ref={ref} className={`max-w-2xl mx-auto text-center mb-14 reveal ${visible ? 'visible' : ''}`}>
          <span className="text-sm font-bold text-primary-400 uppercase tracking-wider">
            {settings?.custom_texts?.feat_badge || 'প্ল্যাটফর্মের বৈশিষ্ট্যসমূহ'}
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight text-balance">
            {title || (
              <>
                টিউটর ও অভিভাবকদের জন্য{' '}
                <span className="gradient-text">প্রয়োজনীয় সবকিছু</span>
              </>
            )}
          </h2>
          <p className="mt-5 text-lg text-gray-400 leading-relaxed">
            {subtitle ||
              'সরাসরি যোগাযোগ ও ভেরিফাইড টিউটর খোঁজার সবচেয়ে সহজ এবং নির্ভরযোগ্য মাধ্যম।'}
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`group relative card-shine rounded-2xl p-7 bg-gradient-to-br ${cardColors[i % cardColors.length]} border border-white/5 hover:border-white/10 transition-all duration-500 hover:-translate-y-1`}
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(30px)',
                  transition: `all 0.6s ease-out ${i * 0.1}s`,
                }}
              >
                {/* Icon */}
                <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${iconColors[i % iconColors.length]} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7 text-white" strokeWidth={2} />
                </div>

                <h3 className="text-xl font-bold text-white mb-2.5 relative z-10">
                  {settings?.custom_texts?.[`feat_${i + 1}_title`] || feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed text-[15px] relative z-10">
                  {settings?.custom_texts?.[`feat_${i + 1}_desc`] || feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
