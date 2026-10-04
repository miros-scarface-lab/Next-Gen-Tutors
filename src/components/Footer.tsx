import { Facebook, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { navLinks } from '@/data/content';

type FooterProps = {
  brandName?: string;
  description?: string;
  email?: string;
  phone?: string;
  location?: string;
};

export default function Footer({ brandName = 'Next Gen Tutors', description, email = 'hello@nextgentutors.com', phone = '+880 1000 000000', location = 'Dhaka, Bangladesh' }: FooterProps) {
  return (
    <footer className="bg-ink-950 text-ink-300 pt-16 pb-8">
      <div className="container-max">
        {/* Ready to get started banner */}
        <div className="mb-14 text-center">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
            Ready to get started?
          </h3>
          <p className="text-ink-400 max-w-xl mx-auto mb-6">
            Join students, guardians, and tutors building better learning experiences together.
          </p>
          <a
            href="#cta"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 text-white font-bold px-7 py-3.5 rounded-full shadow-lg shadow-primary-500/30 transition-all hover:scale-105 group"
          >
            Join Now — It&apos;s Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Divider */}
        <div className="border-t border-ink-800 pt-12" />

        {/* Footer content */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a href="#home" className="flex items-center gap-3 mb-4">
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
              {description ?? 'Connect with expert tutors who will help you achieve your academic goals. Personalized learning, flexible scheduling, and proven results.'}
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-ink-800 hover:bg-primary-600 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-ink-800 hover:bg-primary-600 flex items-center justify-center transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-ink-800 hover:bg-primary-600 flex items-center justify-center transition-colors"
                aria-label="Phone"
              >
                <Phone className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
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
              Support
            </h4>
            <ul className="space-y-3">
              {['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service', 'FAQ'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-ink-400 hover:text-primary-400 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
              Get in Touch
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
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-sm text-ink-400 hover:text-primary-400 transition-colors">
                  {phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-ink-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-ink-500">
            &copy; 2026 Next Gen Tutors. All rights reserved.
          </p>
          <p className="text-sm text-ink-500">
            Made with care for learners everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}
