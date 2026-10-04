import { BookOpen, MapPin, MessageCircle, Monitor, GraduationCap, ShieldCheck, Star } from 'lucide-react';
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
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink-900 tracking-tight">
            Tutors and tuition opportunities
          </h2>
          <p className="mt-5 text-lg text-ink-600 leading-relaxed">
            Explore verified expert tutors and current learning opportunities managed by Next Gen Tutors.
          </p>
        </div>

        {tutors.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center justify-between gap-4 mb-8">
              <div>
                <h3 className="text-2xl font-bold text-ink-900">Featured Tutors</h3>
                <p className="text-sm text-ink-500 mt-1">Directly connect with top verified tutors</p>
              </div>
              <span className="text-sm font-bold bg-primary-50 text-primary-700 px-3.5 py-1.5 rounded-full">
                {tutors.length} Available
              </span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tutors.slice(0, 9).map((tutor) => {
                const rawPhone = tutor.whatsapp_number || '01318126412';
                const cleanPhone = rawPhone.replace(/\D/g, '').replace(/^0/, '880');
                const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                  `Hello! I saw ${tutor.name}'s profile on Next Gen Tutors website and would like to contact regarding tuition.`
                )}`;

                return (
                  <article
                    key={tutor.id}
                    className="bg-white rounded-3xl border border-ink-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-1 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Large Picture Container */}
                      <div className="relative h-64 sm:h-72 w-full bg-ink-100 overflow-hidden group">
                        {tutor.avatar_url ? (
                          <img
                            src={tutor.avatar_url}
                            alt={tutor.name}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center text-6xl font-bold">
                            {tutor.name.charAt(0)}
                          </div>
                        )}

                        {/* Rating Badge */}
                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md flex items-center gap-1 text-xs font-bold text-ink-900">
                          <Star className="w-3.5 h-3.5 fill-warning-500 text-warning-500" />
                          <span>{(tutor.rating || 5.0).toFixed(1)}</span>
                        </div>

                        {/* Verified Badge */}
                        {tutor.is_verified && (
                          <div className="absolute top-4 right-4 bg-success-500 text-white px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 text-xs font-bold">
                            <ShieldCheck className="w-4 h-4" />
                            <span>Verified</span>
                          </div>
                        )}
                      </div>

                      {/* Content Below Picture */}
                      <div className="p-6">
                        {/* Name */}
                        <h4 className="text-xl font-bold text-ink-900">{tutor.name}</h4>

                        {/* Department / Institution */}
                        <p className="text-sm font-bold text-primary-600 mt-1 flex items-center gap-1.5">
                          <GraduationCap className="w-4 h-4" />
                          {tutor.department || tutor.headline || 'General Instructor'}
                        </p>

                        {/* Student / Level */}
                        {tutor.student_level && (
                          <p className="text-xs font-semibold text-ink-500 mt-1">
                            Student Status: {tutor.student_level}
                          </p>
                        )}

                        {/* Bio / Description */}
                        {tutor.bio && <p className="mt-3 text-sm text-ink-600 line-clamp-2 leading-relaxed">{tutor.bio}</p>}

                        {/* Services Offered / Subjects */}
                        <div className="mt-4">
                          <p className="text-xs font-bold text-ink-400 uppercase tracking-wider mb-2">Services Offered:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {tutor.subjects.map((subject) => (
                              <span
                                key={subject}
                                className="px-3 py-1 rounded-lg bg-primary-50 text-primary-700 text-xs font-semibold border border-primary-100"
                              >
                                {subject}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Location */}
                        <div className="mt-4 pt-4 border-t border-ink-100 flex items-center gap-1.5 text-xs font-semibold text-ink-500">
                          <MapPin className="w-4 h-4 text-primary-500" />
                          <span>{tutor.location || 'Dhaka, Bangladesh'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Send Message Button (WhatsApp) */}
                    <div className="p-6 pt-0">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm py-3.5 px-4 rounded-2xl shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/30 transition-all hover:scale-[1.02]"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span>Send Message (WhatsApp)</span>
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {tuitionPosts.length > 0 && (
          <div>
            <div className="flex items-center justify-between gap-4 mb-8">
              <div>
                <h3 className="text-2xl font-bold text-ink-900">Latest Tuition Opportunities</h3>
                <p className="text-sm text-ink-500 mt-1">Open requests posted by guardians & students</p>
              </div>
              <span className="text-sm font-bold bg-accent-50 text-accent-700 px-3.5 py-1.5 rounded-full">
                {tuitionPosts.length} Open
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {tuitionPosts.slice(0, 6).map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-3xl border border-ink-100 p-6 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-500/5 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-lg font-bold text-ink-900">{post.title}</h4>
                        <p className="text-sm text-primary-600 font-semibold mt-1">
                          {post.subject} · {post.grade_level}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                        <BookOpen className="w-5 h-5" />
                      </div>
                    </div>

                    <p className="mt-3 text-sm text-ink-600 leading-relaxed">{post.description}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-ink-100 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-ink-500">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-ink-400" />
                        {post.location}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Monitor className="w-3.5 h-3.5 text-ink-400" />
                        {post.mode}
                      </span>
                    </div>
                    <span className="font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                      {post.budget}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
