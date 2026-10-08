import { Quote, Star } from 'lucide-react';
import { testimonials as fallbackTestimonials } from '@/data/content';
import { useReveal } from '@/hooks/useReveal';
import type { TestimonialRecord, SiteSettings } from '@/types/cms';

type TestimonialsProps = {
  settings?: SiteSettings | null;
  items?: TestimonialRecord[];
  title?: string;
  subtitle?: string;
};

export default function Testimonials({ settings, items, title, subtitle }: TestimonialsProps) {
  const displayedTestimonials = items?.length ? items : fallbackTestimonials.map((item, index) => ({ ...item, id: String(index), organization: item.org, sort_order: index, is_published: true, created_at: '', updated_at: '' }));
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="testimonials" className="py-16 lg:py-24 bg-slate-50 border-t border-slate-200/80 relative">
      <div className="container-max">
        {/* Section Heading */}
        <div ref={ref} className={`max-w-3xl mx-auto text-center mb-14 reveal ${visible ? 'visible' : ''}`}>
          <span className="inline-block text-xs sm:text-sm font-bold text-indigo-700 uppercase tracking-wider bg-indigo-50 border border-indigo-200/80 px-3.5 py-1 rounded-full mb-3">
            {settings?.custom_texts?.testimonials_badge || 'অভিভাবক ও শিক্ষার্থীদের মতামত'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
            {title || 'আমাদের প্ল্যাটফর্ম সম্পর্কে অনুভূতি'}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
            {subtitle || 'Next Gen Tutors ব্যবহারকারী সম্মানিত অভিভাবক, শিক্ষার্থী ও শিক্ষকদের অভিজ্ঞতা ও মতামত জেনে নিন।'}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedTestimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 hover:border-indigo-300 rounded-xl p-7 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1 flex flex-col justify-between"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(24px)',
                transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s`,
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-200/60 flex items-center justify-center">
                    <Quote className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-slate-700 leading-relaxed text-sm font-medium mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{t.title}</p>
                <p className="text-xs text-indigo-600 font-semibold mt-0.5">{t.organization}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
