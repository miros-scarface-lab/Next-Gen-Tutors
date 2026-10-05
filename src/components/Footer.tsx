import { Facebook, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { navLinks } from '@/data/content';
import { navigate } from '@/App';

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
    <footer className="bg-ink-950 text-ink-300 pt-16 pb-8">
      <div className="container-max">
        {/* Ready to get started banner */}
        <div className="mb-14 text-center">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
            {settings?.custom_texts?.footer_banner_title || 'আজই যোগাযোগ করুন!'}
          </h3>
          <p className="text-ink-400 max-w-xl mx-auto mb-6">
            {settings?.custom_texts?.footer_banner_subtitle || 'শিক্ষার্থী, অভিভাবক ও টিউটরদের একটি বিশ্বস্ত ও নিরাপদ লার্নিং প্ল্যাটফর্ম।'}
          </p>
          <a
            href={settings?.custom_texts?.footer_wa_link || "https://wa.me/8801318126412"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold px-7 py-3.5 rounded-full shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 group"
          >
            {settings?.custom_texts?.cta_btn_primary || "দ্রুত যোগাযোগ করুন (WhatsApp)"}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Divider */}
        <div className="border-t border-ink-800 pt-12" />

        {/* Footer content */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="flex items-center gap-3 mb-4">
              <img
                src="/Blue_and_Yellow_Modern_Next_Generation_Academy_Logo.png"
                alt="Next Gen Tutors"
                className="w-14 h-14 object-contain rounded-xl bg-white"
              />
              <span className="font-display text-xl font-bold text-white">
                {brandName}
              </span>
            </a>
            <p className="text-sm leading-relaxed text-ink-400 mb-5">
              {description ?? 'অভিজ্ঞ ও দক্ষ টিউটরদের সাথে সরাসরি যোগাযোগ করে পড়াশোনায় সেরা সাফল্য অর্জন করুন। কোনো মিডিয়া ফি ছাড়াই শতভাগ বিশ্বস্ত সেবা।'}
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              <a
                href="https://wa.me/8801318126412"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-ink-800 hover:bg-emerald-600 flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <Phone className="w-5 h-5 text-white" />
              </a>
              <a
                href={`mailto:${email}`}
                className="w-10 h-10 rounded-xl bg-ink-800 hover:bg-primary-600 flex items-center justify-center transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
              {settings?.custom_texts?.footer_quick_links || 'দ্রুত লিঙ্কসমূহ'}
            </h4>
            <ul className="space-y-3">
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
                    className="text-sm text-ink-400 hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
              {settings?.custom_texts?.footer_social_title || 'আমাদের সাথে যুক্ত থাকুন'}
            </h4>
            <ul className="space-y-3">
              {(settings?.custom_texts?.footer_support_links || 'হেল্প সেন্টার, আমাদের সাথে যোগাযোগ, প্রাইভেসি পলিসি, ব্যবহারের শর্তাবলী, সাধারণ প্রশ্নাবলী (FAQ)').split(',').map((item: string) => (
                <li key={item.trim()}>
                  <a
                    href="#"
                    className="text-sm text-ink-400 hover:text-primary-400 transition-colors"
                  >
                    {item.trim()}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
              {settings?.custom_texts?.footer_contact_title || 'যোগাযোগের ঠিকানা'}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-ink-400">{location}</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <a href={`mailto:${email}`} className="text-sm text-ink-400 hover:text-primary-400 transition-colors">
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <a href={`https://wa.me/8801318126412`} target="_blank" rel="noopener noreferrer" className="text-sm text-ink-400 hover:text-primary-400 transition-colors">
                  {phone} (WhatsApp)
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-ink-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-ink-500">
            {settings?.custom_texts?.footer_copyright || '© 2026 Next Gen Tutors. সর্বস্বত্ব সংরক্ষিত।'}
          </p>
          <p className="text-sm text-ink-500">
            {settings?.custom_texts?.footer_bottom_text || 'শিক্ষার্থীদের সাফল্যের জন্য নিবেদিত।'}
          </p>
        </div>
      </div>
    </footer>
  );
}
