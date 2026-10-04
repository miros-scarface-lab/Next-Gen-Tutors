import { ArrowRight, CheckCircle2, Smartphone } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';

type CTAProps = {
  title?: string;
  description?: string;
  badgeText?: string;
};

export default function CTA({ title, description, badgeText }: CTAProps) {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="cta" className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="container-max">
        <div
          ref={ref}
          className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-ink-900 via-primary-900 to-ink-900 p-8 sm:p-12 lg:p-16 reveal ${visible ? 'visible' : ''}`}
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl" />

          <div className="relative grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold mb-5">
                <Smartphone className="w-4 h-4" />
                {badgeText || 'Available on Web & Mobile'}
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.15] tracking-tight text-balance">
                {title || 'Find your perfect tutor or tuition in minutes'}
              </h2>

              <p className="mt-5 text-lg text-primary-100 leading-relaxed">
                {description ||
                  'Find tutors and tuitions directly — fast and simple, 100% commission free. Connect students and tutors instantly with Next Gen Tutors.'}
              </p>

              <div className="mt-7 space-y-3">
                {['No media fee, ever', 'Direct contact with tutors', 'Verified and trusted profiles'].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success-400 flex-shrink-0" />
                    <span className="text-white/90 font-medium text-[15px]">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a
                  href="#"
                  className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 hover:bg-primary-50 font-bold px-7 py-3.5 rounded-full shadow-xl transition-all hover:scale-105 group"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-bold px-7 py-3.5 rounded-full transition-all"
                >
                  Learn More
                </a>
              </div>
            </div>

            {/* Right: Phone mockup */}
            <div className="relative hidden lg:block">
              <div className="relative mx-auto w-64 h-[480px]">
                {/* Phone frame */}
                <div className="absolute inset-0 bg-ink-900 rounded-[2.5rem] shadow-2xl border-8 border-ink-800 p-2">
                  <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden">
                    {/* Phone screen content */}
                    <div className="bg-gradient-to-b from-primary-600 to-primary-800 p-5 text-center">
                      <div className="w-16 h-16 mx-auto bg-white/20 rounded-2xl flex items-center justify-center mb-3">
                        <Smartphone className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-white font-bold text-sm">Next Gen Tutors</p>
                      <p className="text-primary-200 text-xs mt-1">Next Gen Tutors</p>
                    </div>
                    <div className="p-4 space-y-3">
                      {['Math Tutor - BUET', 'Physics - Dhaka Univ.', 'English - IUT'].map((item, i) => (
                        <div key={i} className="bg-ink-50 rounded-xl p-3 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="w-5 h-5 text-primary-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-ink-900 truncate">{item}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className="text-xs text-warning-400">★★★★★</span>
                              <span className="text-xs text-ink-400">4.9</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-3 text-center">
                        <span className="text-white text-xs font-bold">Find a Tutor</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Glow */}
                <div className="absolute -inset-4 bg-primary-500/20 rounded-[3rem] blur-2xl -z-10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
