import { BookOpen, MapPin, Monitor, ShieldCheck, Star } from 'lucide-react';
import type { TuitionPost, Tutor } from '@/types/cms';
import { useReveal } from '@/hooks/useReveal';

type DirectoryProps = {
  tutors: Tutor[];
  tuitionPosts: TuitionPost[];
};

export default function Directory({ tutors, tuitionPosts }: DirectoryProps) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  if (!tutors.length && !tuitionPosts.length) return null;

  return (
    <section id="tutors" className="py-20 lg:py-28 bg-ink-50">
      <div className="container-max">
        <div ref={ref} className={`max-w-2xl mx-auto text-center mb-14 reveal ${visible ? 'visible' : ''}`}>
          <span className="text-sm font-bold text-primary-600 uppercase tracking-wider">Find Your Match</span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink-900 tracking-tight">Tutors and tuition opportunities</h2>
          <p className="mt-5 text-lg text-ink-600 leading-relaxed">Explore trusted tutors and current learning opportunities managed by Next Gen Tutors.</p>
        </div>

        {tutors.length > 0 && (
          <div className="mb-14">
            <div className="flex items-center justify-between gap-4 mb-6">
              <h3 className="text-2xl font-bold text-ink-900">Featured tutors</h3>
              <span className="text-sm font-semibold text-ink-500">{tutors.length} available</span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutors.slice(0, 6).map((tutor) => (
                <article key={tutor.id} className="bg-white rounded-2xl border border-ink-100 p-5 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-500/10 transition-all">
                  <div className="flex items-center gap-4">
                    {tutor.avatar_url ? (
                      <img src={tutor.avatar_url} alt={tutor.name} className="w-16 h-16 rounded-2xl object-cover" />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center text-xl font-bold">{tutor.name.charAt(0)}</div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-ink-900 truncate">{tutor.name}</h4>
                        {tutor.is_verified && <ShieldCheck className="w-4 h-4 text-success-500 flex-shrink-0" />}
                      </div>
                      <p className="text-sm text-ink-500 truncate">{tutor.headline}</p>
                      <div className="flex items-center gap-1 mt-1 text-warning-500 text-sm"><Star className="w-3.5 h-3.5 fill-warning-500" /> {tutor.rating.toFixed(1)}</div>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-ink-600 line-clamp-2">{tutor.bio}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {tutor.subjects.slice(0, 3).map((subject) => <span key={subject} className="px-2.5 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold">{subject}</span>)}
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-sm text-ink-500"><MapPin className="w-4 h-4" />{tutor.location}</div>
                </article>
              ))}
            </div>
          </div>
        )}

        {tuitionPosts.length > 0 && (
          <div>
            <div className="flex items-center justify-between gap-4 mb-6">
              <h3 className="text-2xl font-bold text-ink-900">Latest tuition opportunities</h3>
              <span className="text-sm font-semibold text-ink-500">{tuitionPosts.length} open</span>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {tuitionPosts.slice(0, 6).map((post) => (
                <article key={post.id} className="bg-white rounded-2xl border border-ink-100 p-6 hover:border-primary-200 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div><h4 className="text-lg font-bold text-ink-900">{post.title}</h4><p className="text-sm text-primary-600 font-semibold mt-1">{post.subject} · {post.grade_level}</p></div>
                    <BookOpen className="w-5 h-5 text-primary-500 flex-shrink-0" />
                  </div>
                  <p className="mt-3 text-sm text-ink-600 leading-relaxed">{post.description}</p>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-ink-500"><span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4" />{post.location}</span><span className="inline-flex items-center gap-1.5"><Monitor className="w-4 h-4" />{post.mode}</span><span className="font-semibold text-success-600">{post.budget}</span></div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
