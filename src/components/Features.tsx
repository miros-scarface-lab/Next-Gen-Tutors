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
    <section id="features" className="py-16 lg:py-24 bg-white relative">
      <div className="container-max">
        {/* Section Heading */}
        <div ref={ref} className={`max-w-3xl mx-auto text-center mb-14 reveal ${visible ? 'visible' : ''}`}>
          <span className="inline-block text-xs sm:text-sm font-bold text-indigo-700 uppercase tracking-wider bg-indigo-50 border border-indigo-200/80 px-3.5 py-1 rounded-full mb-3">
            {settings?.custom_texts?.feat_badge || 'প্ল্যাটফর্মের বৈশিষ্ট্যসমূহ'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
            {title || 'কেন আমাদের সার্ভিস বেছে নেবেন?'}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
            {subtitle || 'শিক্ষার্থী ও অভিভাবক উভয়ের সুবিধার্থে আমাদের প্ল্যাটফর্মে রয়েছে আধুনিক ও নির্ভরযোগ্য ফিচারস।'}
          </p>
        </div>

        {/* Feature Cards Grid with Sharp Edges */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feat, i) => {
            const featTitle = settings?.custom_texts?.[`feat_${i + 1}_title`] || feat.title;
            const featDesc = settings?.custom_texts?.[`feat_${i + 1}_desc`] || feat.description;
            
            return (
              <div
                key={feat.title}
                className="group relative bg-slate-50/80 hover:bg-white border border-slate-200 hover:border-indigo-300 rounded-xl p-6 sm:p-8 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(24px)',
                  transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.12}s`,
                }}
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-6 shadow-md shadow-indigo-600/20 group-hover:scale-110 transition-transform duration-300">
                  <feat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                  {featTitle}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                  {featDesc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
