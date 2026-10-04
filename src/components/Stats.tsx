import { MapPin, Users, BookOpen, Award } from 'lucide-react';
import { stats } from '@/data/content';
import { useReveal } from '@/hooks/useReveal';

const statIcons = [Users, BookOpen, Award, MapPin];

export default function Stats() {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="about" className="py-20 lg:py-28 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-300 rounded-full blur-3xl" />
      </div>
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="container-max relative">
        <div ref={ref} className={`text-center mb-14 reveal ${visible ? 'visible' : ''}`}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight text-balance">
            Trusted by Millions
          </h2>
          <p className="mt-5 text-lg text-primary-100 leading-relaxed max-w-2xl mx-auto">
            Connecting with millions of qualified tutors across the country,
            without any third party media.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, i) => {
            const Icon = statIcons[i];
            return (
              <div
                key={stat.label}
                className="text-center"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(30px)',
                  transition: `all 0.6s ease-out ${i * 0.12}s`,
                }}
              >
                <div className="inline-flex w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 items-center justify-center mb-4">
                  <Icon className="w-7 h-7 text-white" strokeWidth={1.8} />
                </div>
                <div className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                  {stat.value}
                </div>
                <p className="mt-2 text-sm lg:text-base font-medium text-primary-200">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Map-like visual */}
        <div className="mt-16 relative rounded-3xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                Nationwide Coverage
              </h3>
              <p className="text-primary-100 leading-relaxed text-base lg:text-lg">
                From bustling cities to quiet towns, our network of tutors spans
                every district. Wherever you are, a qualified tutor is just a
                search away. Join the largest tuition community in the country.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {['Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Sylhet', 'Barishal', 'Rangpur', 'Mymensingh'].map((city) => (
                  <span
                    key={city}
                    className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    {city}
                  </span>
                ))}
              </div>
            </div>

            {/* Decorative map dots */}
            <div className="relative h-64 lg:h-80 rounded-2xl bg-primary-950/40 overflow-hidden">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
                  backgroundSize: '30px 30px',
                }}
              />
              {/* Simulated location pins */}
              {[
                { top: '20%', left: '30%' },
                { top: '45%', left: '55%' },
                { top: '70%', left: '25%' },
                { top: '30%', left: '70%' },
                { top: '60%', left: '65%' },
                { top: '15%', left: '60%' },
                { top: '80%', left: '45%' },
                { top: '50%', left: '35%' },
              ].map((pos, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 bg-primary-400 rounded-full ring-4 ring-primary-400/20 animate-pulse-slow"
                  style={{ top: pos.top, left: pos.left, animationDelay: `${i * 0.5}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
