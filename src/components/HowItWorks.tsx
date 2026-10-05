import { steps } from '@/data/content';
import { useReveal } from '@/hooks/useReveal';

const stepImages = [
  'https://images.pexels.com/photos/265076/pexels-photo-265076.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/6502728/pexels-photo-6502728.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/5212350/pexels-photo-5212350.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/31290544/pexels-photo-31290544.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
];

type HowItWorksProps = {
  title?: string;
  subtitle?: string;
};

export default function HowItWorks({ title, subtitle }: HowItWorksProps) {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-ink-50 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent" />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100/50 rounded-full blur-3xl" />

      <div className="container-max relative">
        {/* Heading */}
        <div ref={ref} className={`max-w-2xl mx-auto text-center mb-16 reveal ${visible ? 'visible' : ''}`}>
          <span className="text-sm font-bold text-primary-600 uppercase tracking-wider">
            সহজ প্রক্রিয়া
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink-900 tracking-tight text-balance">
            {title || 'কীভাবে আপনার টিউটর খুঁজে পাবেন'}
          </h2>
          <p className="mt-5 text-lg text-ink-600 leading-relaxed">
            {subtitle || 'টিউটর খোঁজা এখন অত্যন্ত সহজ। মাত্র ৪টি সহজ ধাপ অনুসরণ করে আপনার পছন্দের টিউটরের সাথে যুক্ত হন।'}
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="relative group"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(30px)',
                transition: `all 0.6s ease-out ${i * 0.15}s`,
              }}
            >
              {/* Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 border border-ink-100 hover:border-primary-200 h-full">
                {/* Image */}
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden mb-5 ring-4 ring-ink-50 group-hover:ring-primary-100 transition-all">
                  <img
                    src={stepImages[i]}
                    alt={step.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Number */}
                <div className="text-3xl font-extrabold gradient-text mb-3">
                  {step.number}
                </div>

                <h3 className="text-lg font-bold text-ink-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-ink-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connecting arrow (desktop) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-primary-300">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
