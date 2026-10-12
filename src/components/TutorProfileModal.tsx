import { useEffect, useState } from 'react';
import {
  GraduationCap,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Star,
  X,
  Briefcase,
  ExternalLink,
  BookOpen,
  ArrowLeft,
  Eye,
  FileText,
} from 'lucide-react';
import type { Tutor, SiteSettings, TutorProject } from '@/types/cms';

type TutorProfileModalProps = {
  tutor: Tutor | null;
  onClose: () => void;
  settings?: SiteSettings | null;
};

// Formats text supporting markdown-like headings, lists, bold text, links, code, and paragraphs
function FormattedDescription({ text }: { text: string }) {
  if (!text) return null;

  const lines = text.split('\n');

  const renderInlineFormatted = (content: string) => {
    const urlOrLinkRegex = /((?:https?:\/\/[^\s)]+)|(?:\[.*?\]\(.*?\))|(?:\*\*.*?\*\*)|(?:\*.*?\*)|(?:`.*?`))/g;
    const parts = content.split(urlOrLinkRegex);

    return parts.map((part, i) => {
      if (!part) return null;

      // Bold: **text**
      if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
        return (
          <strong key={i} className="font-bold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }

      // Italic: *text*
      if (part.startsWith('*') && part.endsWith('*') && part.length >= 2 && !part.startsWith('**')) {
        return (
          <em key={i} className="italic text-slate-800">
            {part.slice(1, -1)}
          </em>
        );
      }

      // Inline code: `code`
      if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
        return (
          <code
            key={i}
            className="bg-slate-200/80 px-1.5 py-0.5 rounded text-xs font-mono font-semibold text-primary-700 border border-slate-300/60"
          >
            {part.slice(1, -1)}
          </code>
        );
      }

      // Markdown link: [text](url)
      const mdLinkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (mdLinkMatch) {
        return (
          <a
            key={i}
            href={mdLinkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-800 underline font-semibold inline-flex items-center gap-0.5"
          >
            <span>{mdLinkMatch[1]}</span>
            <ExternalLink className="w-3 h-3 inline ml-0.5" />
          </a>
        );
      }

      // Raw URL: https://...
      if (part.startsWith('http://') || part.startsWith('https://')) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-800 underline font-semibold break-all"
          >
            {part}
          </a>
        );
      }

      return part;
    });
  };

  return (
    <div className="space-y-3.5 text-slate-700 leading-relaxed text-sm sm:text-base">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-2" />;
        }

        // # Heading 1
        if (trimmed.startsWith('# ')) {
          return (
            <h2
              key={idx}
              className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-6 mb-3 pb-2 border-b border-slate-200 tracking-tight first:mt-0 flex items-center gap-2"
            >
              <span className="w-1.5 h-6 bg-primary-600 rounded-full shrink-0" />
              <span>{trimmed.substring(2)}</span>
            </h2>
          );
        }

        // ## Heading 2
        if (trimmed.startsWith('## ')) {
          return (
            <h3
              key={idx}
              className="text-lg sm:text-xl font-bold text-slate-900 mt-5 mb-2.5 tracking-tight first:mt-0 flex items-center gap-2"
            >
              <span className="w-1 h-5 bg-indigo-500 rounded-full shrink-0" />
              <span>{trimmed.substring(3)}</span>
            </h3>
          );
        }

        // ### Heading 3
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="text-base sm:text-lg font-bold text-slate-800 mt-4 mb-2 first:mt-0">
              {trimmed.substring(4)}
            </h4>
          );
        }

        // #### Heading 4
        if (trimmed.startsWith('#### ')) {
          return (
            <h5 key={idx} className="text-sm sm:text-base font-bold text-slate-700 mt-3 mb-1.5 first:mt-0">
              {trimmed.substring(5)}
            </h5>
          );
        }

        // Blockquote >
        if (trimmed.startsWith('> ')) {
          return (
            <blockquote
              key={idx}
              className="border-l-4 border-primary-500 pl-4 py-1.5 my-2 italic text-slate-700 bg-primary-50/50 rounded-r-xl"
            >
              {renderInlineFormatted(trimmed.substring(2))}
            </blockquote>
          );
        }

        // Bullet list item
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
          return (
            <div key={idx} className="flex items-start gap-2.5 ml-2 my-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-600 mt-2 shrink-0" />
              <span className="leading-relaxed">{renderInlineFormatted(trimmed.replace(/^[-*•]\s+/, ''))}</span>
            </div>
          );
        }

        // Numbered list item: 1. , 2.
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2.5 ml-2 my-1.5">
              <span className="text-xs font-bold text-primary-700 bg-primary-100 rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                {numMatch[1]}
              </span>
              <span className="leading-relaxed">{renderInlineFormatted(numMatch[2])}</span>
            </div>
          );
        }

        // Standard text paragraph
        return (
          <p key={idx} className="leading-relaxed">
            {renderInlineFormatted(line)}
          </p>
        );
      })}
    </div>
  );
}

// Cleans markdown symbols for card preview snippets
function getCleanSnippet(text?: string) {
  if (!text) return '';
  return text
    .split('\n')
    .map((line) =>
      line
        .replace(/^#{1,6}\s+/, '')
        .replace(/^[-*•]\s+/, '')
        .replace(/^\d+\.\s+/, '')
        .replace(/^>\s+/, '')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/\[(.*?)\]\(.*?\)/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .trim()
    )
    .filter(Boolean)
    .join(' ');
}

export default function TutorProfileModal({ tutor, onClose, settings }: TutorProfileModalProps) {
  const [selectedProject, setSelectedProject] = useState<TutorProject | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedProject) {
          setSelectedProject(null);
        } else {
          onClose();
        }
      }
    };
    if (tutor) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [tutor, selectedProject, onClose]);

  if (!tutor) return null;

  const rawPhone = tutor.whatsapp_number || '01318126412';
  const cleanPhone = rawPhone.replace(/\D/g, '').replace(/^0/, '880');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `হ্যালো! আমি Next Gen Tutors ওয়েবসাইটে ${tutor.name}-এর প্রোফাইল দেখে যোগাযোগ করছি।`
  )}`;

  const projects = tutor.projects || [];

  return (
    <>
      {/* Main Profile Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/65 backdrop-blur-sm animate-fade-in"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200/80 flex flex-col justify-between">
          <div>
            {/* Header Banner & Close */}
            <div className="relative h-44 sm:h-52 w-full bg-gradient-to-r from-primary-800 via-primary-700 to-indigo-900 overflow-hidden">
              <div className="absolute inset-0 hero-grid-bg opacity-30" />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 p-2 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95"
                aria-label="Close Profile"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Overview Card (floating over header) */}
            <div className="px-6 sm:px-8 pb-6">
              <div className="relative -mt-20 sm:-mt-24 mb-6 flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
                {/* Avatar */}
                <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-3xl border-4 border-white shadow-xl bg-slate-100 overflow-hidden shrink-0">
                  {tutor.avatar_url ? (
                    <img
                      src={tutor.avatar_url}
                      alt={tutor.name}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-600 to-primary-800 text-white flex items-center justify-center text-6xl font-bold">
                      {tutor.name.charAt(0)}
                    </div>
                  )}
                  {/* Rating Badge */}
                  <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 text-xs font-bold text-slate-900">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{(tutor.rating || 5.0).toFixed(1)}</span>
                  </div>
                </div>

                {/* Name & Credentials */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{tutor.name}</h2>
                    {tutor.is_verified && (
                      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>{settings?.custom_texts?.hero_stat_verified || 'যাচাইকৃত'}</span>
                      </span>
                    )}
                  </div>

                  <p className="text-sm sm:text-base font-bold text-primary-600 mt-1.5 flex items-center justify-center sm:justify-start gap-2">
                    <GraduationCap className="w-4 h-4 shrink-0" />
                    <span>{tutor.department || tutor.headline || 'সম্মানিত ইনস্ট্রাক্টর'}</span>
                  </p>

                  {tutor.student_level && (
                    <p className="text-xs font-semibold text-slate-500 mt-1">
                      শিক্ষার্থীর অবস্থান / বর্ষ: <span className="text-slate-700">{tutor.student_level}</span>
                    </p>
                  )}

                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-semibold text-slate-500 mt-2">
                    <MapPin className="w-3.5 h-3.5 text-primary-500 shrink-0" />
                    <span>{tutor.location || 'ঢাকা, বাংলাদেশ'}</span>
                  </div>
                </div>
              </div>

              {/* Quick Contact Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 py-3 border-y border-slate-100 mb-6">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-5 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{settings?.custom_texts?.tutor_modal_contact || 'WhatsApp মেসেজ দিন'}</span>
                </a>

                <a
                  href={`tel:${tutor.whatsapp_number || '01318126412'}`}
                  className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-5 rounded-2xl transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>সরাসরি কল করুন</span>
                </a>
              </div>

              {/* Bio */}
              {tutor.bio && (
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    {settings?.custom_texts?.tutor_modal_about || 'শিক্ষক পরিচিতি (Bio):'}
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-100 font-medium">
                    {tutor.bio}
                  </p>
                </div>
              )}

              {/* Subjects */}
              {tutor.subjects && tutor.subjects.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                    {settings?.custom_texts?.tutor_modal_subjects || 'যেসব বিষয়ে পড়ানো হয়:'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {tutor.subjects.map((subject) => (
                      <span
                        key={subject}
                        className="px-3.5 py-1.5 rounded-xl bg-primary-50 text-primary-700 text-xs font-bold border border-primary-100/80 shadow-2xs"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* EXTENDED SECTION: PROJECTS & WORK PORTFOLIO */}
              <div className="pt-6 border-t border-slate-200">
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-primary-100 text-primary-700 rounded-xl">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900">
                        প্রজেক্ট, গবেষণা ও কাজের বিবরণী (Works & Projects)
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        প্রজেক্টের কার্ডে ক্লিক করে সম্পূর্ণ ছবি, ডকুমেন্টেশন ও বিস্তারিত বিবরণ দেখুন
                      </p>
                    </div>
                  </div>

                  {projects.length > 0 && (
                    <span className="text-xs font-bold bg-primary-50 text-primary-700 border border-primary-200/60 px-3 py-1 rounded-full shrink-0">
                      {projects.length} টি কাজ
                    </span>
                  )}
                </div>

                {projects.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                    {projects.map((project, idx) => {
                      const cleanDesc = getCleanSnippet(project.description);
                      return (
                        <div
                          key={project.id || idx}
                          onClick={() => setSelectedProject(project)}
                          className="bg-white hover:bg-slate-50/90 border border-slate-200 hover:border-primary-400 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                          title="সম্পূর্ণ বিবরণ দেখতে ট্যাপ করুন"
                        >
                          <div>
                            {/* Picture of Work / Project with hover overlay */}
                            <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                              {project.image_url ? (
                                <img
                                  src={project.image_url}
                                  alt={project.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              ) : (
                                <div className="h-full w-full bg-gradient-to-br from-primary-500/10 to-indigo-500/10 flex items-center justify-center text-primary-400 border-b border-slate-200">
                                  <BookOpen className="w-10 h-10" />
                                </div>
                              )}

                              {/* Tap to View Overlay Pill */}
                              <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                                <span className="bg-white/95 text-slate-900 text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                  <Eye className="w-3.5 h-3.5 text-primary-600" />
                                  <span>সম্পূর্ণ বিবরণ দেখতে ক্লিক করুন</span>
                                </span>
                              </div>
                            </div>

                            {/* Title & Description Snippet */}
                            <div className="p-4 sm:p-5">
                              <h4 className="text-base font-bold text-slate-900 group-hover:text-primary-600 transition-colors leading-snug">
                                {project.title}
                              </h4>
                              {cleanDesc && (
                                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed line-clamp-3 font-normal">
                                  {cleanDesc}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Card Actions */}
                          <div className="p-4 sm:p-5 pt-0 flex items-center justify-between gap-2 border-t border-slate-100 mt-2 pt-3">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProject(project);
                              }}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-bold text-primary-700 bg-primary-50 hover:bg-primary-100 border border-primary-200/80 px-3.5 py-2 rounded-xl transition-all shadow-xs"
                            >
                              <FileText className="w-3.5 h-3.5 text-primary-600" />
                              <span>সম্পূর্ণ বিবরণ দেখুন</span>
                            </button>

                            {project.link_url && (
                              <a
                                href={project.link_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-3 py-2 rounded-xl transition-all group/link"
                                title="সরাসরি আর্টিকেল লিংক ওপেন করুন"
                              >
                                <span>আর্টিকেল</span>
                                <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-slate-500">
                    <Briefcase className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-semibold text-slate-700">বর্তমানে কোনো প্রজেক্ট বা কাজের লিংক যুক্ত করা নেই</p>
                    <p className="text-xs text-slate-400 mt-1">শিক্ষক সরাসরি যোগাযোগ সাপেক্ষে অভিজ্ঞতা ও কাজের নমুনা প্রদর্শন করবেন।</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DETAILED PROJECT MODAL (Shows full picture, complete description, & links) */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedProject(null);
          }}
        >
          <div className="bg-white rounded-3xl max-w-2xl sm:max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200/90 relative flex flex-col justify-between">
            <div>
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-20 bg-white/95 hover:bg-white text-slate-700 hover:text-slate-900 p-2.5 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95"
                aria-label="Close Project Details"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Full Image Display */}
              {selectedProject.image_url ? (
                <div className="relative w-full max-h-[380px] sm:max-h-[460px] bg-slate-950/5 flex items-center justify-center overflow-hidden border-b border-slate-200 rounded-t-3xl">
                  <img
                    src={selectedProject.image_url}
                    alt={selectedProject.title}
                    className="w-full h-auto max-h-[460px] object-contain sm:object-cover"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/65 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                    <Briefcase className="w-3.5 h-3.5 text-primary-300" />
                    <span>প্রজেক্ট পোর্টফোলিও স্ন্যাপশট</span>
                  </div>
                  <a
                    href={selectedProject.image_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-slate-800 text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md transition-all hover:scale-105"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-600" />
                    <span>পূর্ণ ছবি দেখুন</span>
                  </a>
                </div>
              ) : (
                <div className="h-36 w-full bg-gradient-to-r from-primary-800 to-indigo-900 flex items-center justify-center text-white/80 rounded-t-3xl border-b border-slate-200">
                  <Briefcase className="w-12 h-12" />
                </div>
              )}

              {/* Project Details Content */}
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  {/* Category & Tutor Tag */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <span className="inline-flex items-center gap-1.5 bg-primary-50 text-primary-700 text-xs font-bold px-3 py-1.5 rounded-full border border-primary-200/60">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>প্রজেক্ট ও কাজের পূর্ণাঙ্গ বিবরণী</span>
                    </span>

                    <span className="text-xs font-semibold text-slate-500">
                      ইনস্ট্রাক্টর: <strong className="text-slate-900 font-bold">{tutor.name}</strong>
                      {tutor.department && <span className="text-slate-400"> ({tutor.department})</span>}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug tracking-tight">
                    {selectedProject.title}
                  </h2>
                </div>

                {/* Primary Action Banner (If Article/Project link provided) */}
                {selectedProject.link_url && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>মূল আর্টিকেল / লাইভ প্রজেক্ট লিংক</span>
                      </div>
                      <p className="text-xs text-emerald-700 truncate mt-1 font-mono">
                        {selectedProject.link_url}
                      </p>
                    </div>

                    <a
                      href={selectedProject.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition-all hover:scale-105 shrink-0"
                    >
                      <span>আর্টিকেল বা প্রজেক্ট দেখুন</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}

                {/* Full Description with Markdown Formatting */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    বিস্তারিত বিবরণ (Full Description & Overview):
                  </h4>
                  <div className="bg-slate-50/80 p-5 sm:p-7 rounded-2xl border border-slate-200/80 shadow-2xs">
                    {selectedProject.description ? (
                      <FormattedDescription text={selectedProject.description} />
                    ) : (
                      <p className="text-sm text-slate-500 italic">কোনো অতিরিক্ত বিবরণ যোগ করা নেই।</p>
                    )}
                  </div>
                </div>

                {/* Instructor Contact Callout */}
                <div className="p-4 sm:p-5 rounded-2xl bg-primary-50/70 border border-primary-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-primary-950">
                      এই প্রজেক্ট বা স্কিল বিষয়ে {tutor.name}-এর সাথে যোগাযোগ করুন
                    </h4>
                    <p className="text-xs text-primary-700 mt-0.5">
                      প্রজেক্ট সংক্রান্ত প্রশ্ন বা প্রাইভেট টিউশনের জন্য সরাসরি যোগাযোগ করতে পারেন
                    </p>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp বার্তা</span>
                    </a>
                    <a
                      href={`tel:${tutor.whatsapp_number || '01318126412'}`}
                      className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-200 transition-all shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>কল</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="p-5 sm:p-6 bg-slate-50/90 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-b-3xl">
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all shadow-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>টিউটর প্রোফাইলে ফিরে যান</span>
              </button>

              {selectedProject.link_url && (
                <a
                  href={selectedProject.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-md transition-all hover:scale-105"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>আর্টিকেল বা প্রজেক্ট ওপেন করুন</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
