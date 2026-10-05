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

  return (
    <section id="features" className="py-20 lg:py-28 bg-white relative">
      <div className="container-max">
        {/* Section heading */}
        <div ref={ref} className={`max-w-2xl mx-auto text-center mb-16 reveal ${visible ? 'visible' : ''}`}>
          <span className="text-sm font-bold text-primary-600 uppercase tracking-wider">
            {settings?.custom_texts?.feat_badge || 'প্ল্যাটফর্মের বৈশিষ্ট্যসমূহ'}
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink-900 tracking-tight text-balance">
            {title || (
              <>
                টিউটর ও অভিভাবকদের জন্য{' '}
                <span className="gradient-text">প্রয়োজনীয় সবকিছু</span>
              </>
            )}
          </h2>
          <p className="mt-5 text-lg text-ink-600 leading-relaxed">
            {subtitle ||
              'সরাসরি যোগাযোগ ও ভেরিফাইড টিউটর খোঁজার সবচেয়ে সহজ এবং নির্ভরযোগ্য মাধ্যম।'}
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative bg-white border border-ink-100 rounded-2xl p-7 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 hover:-translate-y-1"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(30px)',
                  transition: `all 0.6s ease-out ${i * 0.1}s`,
                }}
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center mb-5 group-hover:from-primary-500 group-hover:to-primary-700 transition-all duration-300">
                  <Icon className="w-7 h-7 text-primary-600 group-hover:text-white transition-colors" strokeWidth={2} />
                </div>

                <h3 className="text-xl font-bold text-ink-900 mb-2.5">
                  {settings?.custom_texts?.[`feat_${i + 1}_title`] || feature.title}
                </h3>
                <p className="text-ink-600 leading-relaxed text-[15px]">
                  {settings?.custom_texts?.[`feat_${i + 1}_desc`] || feature.description}
                </p>

                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary-50/0 group-hover:bg-primary-50/50 rounded-bl-full rounded-tr-2xl transition-all duration-300 -z-10" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
