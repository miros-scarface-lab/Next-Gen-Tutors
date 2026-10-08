import { steps } from '@/data/content';
import { useReveal } from '@/hooks/useReveal';
import type { SiteSettings } from '@/types/cms';

const stepImages = [
  'https://images.pexels.com/photos/265076/pexels-photo-265076.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/6502728/pexels-photo-6502728.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/5212350/pexels-photo-5212350.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/31290544/pexels-photo-31290544.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
];

type HowItWorksProps = {
  settings?: SiteSettings | null;
  title?: string;
  subtitle?: string;
};

export default function HowItWorks({ settings, title, subtitle }: HowItWorksProps) {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="how-it-works" className="py-16 lg:py-24 bg-slate-50 border-y border-slate-200/80 relative overflow-hidden">
      <div className="container-max relative z-10">
        {/* Section Heading */}
        <div ref={ref} className={`max-w-3xl mx-auto text-center mb-14 reveal ${visible ? 'visible' : ''}`}>
          <span className="inline-block text-xs sm:text-sm font-bold text-indigo-700 uppercase tracking-wider bg-indigo-50 border border-indigo-200/80 px-3.5 py-1 rounded-full mb-3">
            {settings?.custom_texts?.how_it_works_badge || 'সহজ প্রক্রিয়া'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
            {title || 'কীভাবে আপনার টিউটর খুঁজে পাবেন'}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
            {subtitle || 'টিউটর খোঁজা এখন অত্যন্ত সহজ। মাত্র ৪টি সহজ ধাপ অনুসরণ করে আপনার পছন্দের টিউটরের সাথে যুক্ত হন।'}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="relative group bg-white border border-slate-200 hover:border-indigo-300 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1 h-full flex flex-col justify-between"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(24px)',
                transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.12}s`,
              }}
            >
              <div>
                {/* Image */}
                <div className="relative w-full h-36 rounded-lg overflow-hidden mb-5 border border-slate-200/80">
                  <img
                    src={stepImages[i]}
                    alt={step.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 bg-indigo-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-md shadow">
                    ধাপ {step.number}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {settings?.custom_texts?.[`step_${i + 1}_title`] || step.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                  {settings?.custom_texts?.[`step_${i + 1}_desc`] || step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
