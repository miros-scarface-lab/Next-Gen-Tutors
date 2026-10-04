import { Quote, Star } from 'lucide-react';
import { testimonials as fallbackTestimonials } from '@/data/content';
import { useReveal } from '@/hooks/useReveal';
import type { TestimonialRecord } from '@/types/cms';

type TestimonialsProps = { items?: TestimonialRecord[] };

export default function Testimonials({ items }: TestimonialsProps) {
  const displayedTestimonials = items?.length ? items : fallbackTestimonials.map((item, index) => ({ ...item, id: String(index), organization: item.org, sort_order: index, is_published: true, created_at: '', updated_at: '' }));
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="container-max">
        {/* Heading */}
        <div ref={ref} className={`max-w-2xl mx-auto text-center mb-16 reveal ${visible ? 'visible' : ''}`}>
          <span className="text-sm font-bold text-primary-600 uppercase tracking-wider">
            Community Stories
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink-900 tracking-tight text-balance">
            What Our Community Says
          </h2>
          <p className="mt-5 text-lg text-ink-600 leading-relaxed">
            Don&apos;t just take our word for it. Here&apos;s what our users have to say
            about their experience with Next Gen Tutors.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {displayedTestimonials.map((t, i) => (
            <div
              key={i}
              className="relative bg-gradient-to-br from-ink-50 to-white border border-ink-100 rounded-2xl p-7 hover:shadow-xl hover:shadow-ink-900/5 transition-all duration-300 hover:-translate-y-1 group"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(30px)',
                transition: `all 0.6s ease-out ${i * 0.1}s`,
              }}
            >
              {/* Quote icon */}
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center mb-5 group-hover:bg-primary-600 transition-all duration-300">
                <Quote className="w-5 h-5 text-primary-500 group-hover:text-white transition-colors" />
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 text-warning-400 fill-warning-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-ink-700 leading-relaxed text-[15px] mb-6 line-clamp-6">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="pt-5 border-t border-ink-100">
                <p className="font-bold text-ink-900 text-[15px]">{t.name}</p>
                <p className="text-sm text-ink-500 mt-0.5">{t.title}</p>
                <p className="text-sm text-primary-600 font-semibold mt-0.5">{t.organization}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
