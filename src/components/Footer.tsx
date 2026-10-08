import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { navLinks } from '@/data/content';
import { navigate } from '@/lib/navigation';

import type { SiteSettings } from '@/types/cms';

type FooterProps = {
  settings?: SiteSettings | null;
  brandName?: string;
  description?: string;
  email?: string;
  phone?: string;
  location?: string;
};

export default function Footer({ settings, brandName = 'Next Gen Tutors', description, email = 'nextgentutors247@gmail.com', phone = '01318126412', location = 'Pirojpur, Chittagong, Bangladesh' }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-8 border-t border-slate-800">
      <div className="container-max">
        {/* Banner Section */}
        <div className="mb-12 text-center bg-slate-800/80 border border-slate-700/70 p-8 rounded-2xl">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            {settings?.custom_texts?.footer_banner_title || 'আজই আপনার পছন্দের টিউটরের সাথে যোগাযোগ করুন!'}
          </h3>
          <p className="text-slate-300 max-w-xl mx-auto mb-6 text-sm sm:text-base font-medium">
            {settings?.custom_texts?.footer_banner_subtitle || 'শিক্ষার্থী, অভিভাবক ও টিউটরদের একটি বিশ্বস্ত ও নিরাপদ লার্নিং প্ল্যাটফর্ম।'}
          </p>
          <a
            href={settings?.custom_texts?.footer_wa_link || "https://wa.me/8801318126412"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-7 py-3 rounded-xl shadow-md transition-all hover:-translate-y-0.5 group text-sm sm:text-base"
          >
            {settings?.custom_texts?.cta_btn_primary || "দ্রুত যোগাযোগ (WhatsApp)"}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Footer Main Links */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 pt-4">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="flex items-center gap-3 mb-4">
              <img
                src="/Blue_and_Yellow_Modern_Next_Generation_Academy_Logo.png"
                alt="Next Gen Tutors"
                className="w-12 h-12 object-contain rounded-xl bg-white p-1"
              />
              <span className="font-display text-lg font-bold text-white">
                {brandName}
              </span>
            </a>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-400 mb-5 font-medium">
              {description ?? 'অভিজ্ঞ ও দক্ষ টিউটরদের সাথে সরাসরি যোগাযোগ করে পড়াশোনায় সেরা সাফল্য অর্জন করুন। কোনো মিডিয়া ফি ছাড়াই শতভাগ বিশ্বস্ত সেবা।'}
            </p>
            <div className="flex items-center gap-2.5">
              <a
                href="https://wa.me/8801318126412"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 hover:bg-emerald-600 hover:border-emerald-600 flex items-center justify-center transition-colors text-white"
                aria-label="WhatsApp"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${email}`}
                className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 hover:bg-indigo-600 hover:border-indigo-600 flex items-center justify-center transition-colors text-white"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              {settings?.custom_texts?.footer_quick_links || 'দ্রুত লিঙ্কসমূহ'}
            </h4>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      if (link.href.startsWith('/')) {
                        e.preventDefault();
                        navigate(link.href);
                      }
                    }}
                    className="text-xs sm:text-sm text-slate-400 hover:text-indigo-400 transition-colors font-medium"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              {settings?.custom_texts?.footer_social_title || 'আমাদের সেবা'}
            </h4>
            <ul className="space-y-2.5">
              {(settings?.custom_texts?.footer_support_links || 'হোম টিউটর, অনলাইন টিউটর, বিষয়ভিত্তিক শিক্ষক, পিরোজপুর এলাকা, কাস্টমার সাপোর্ট').split(',').map((item: string) => (
                <li key={item.trim()}>
                  <span className="text-xs sm:text-sm text-slate-400 font-medium">
                    {item.trim()}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              {settings?.custom_texts?.footer_contact_title || 'যোগাযোগের ঠিকানা'}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-slate-400 font-medium">{location}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                <a href={`mailto:${email}`} className="text-xs sm:text-sm text-slate-400 hover:text-indigo-400 transition-colors font-medium">
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <a href={`https://wa.me/8801318126412`} target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-slate-400 hover:text-emerald-400 transition-colors font-medium">
                  {phone} (WhatsApp)
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <p>
            {settings?.custom_texts?.footer_copyright || '© 2026 Next Gen Tutors. সর্বস্বত্ব সংরক্ষিত।'}
          </p>
          <p>
            {settings?.custom_texts?.footer_bottom_text || 'শিক্ষার্থীদের সাফল্যের জন্য নিবেদিত।'}
          </p>
        </div>
      </div>
    </footer>
  );
}
