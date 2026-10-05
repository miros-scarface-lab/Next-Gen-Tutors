import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { navLinks } from '@/data/content';
import { navigate } from '@/App';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/')) {
      e.preventDefault();
      navigate(href);
      setMobileOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.06)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="container-max flex items-center justify-between py-4">
        <a href="/" onClick={(e) => handleNavClick(e, '/')} className="flex items-center gap-3 group">
          <img
            src="/Blue_and_Yellow_Modern_Next_Generation_Academy_Logo.png"
            alt="Next Gen Tutors"
            className="w-12 h-12 object-contain group-hover:scale-105 transition-transform"
          />
          <span className="font-display text-xl font-bold tracking-tight text-ink-900">
            Next Gen <span className="text-primary-600">Tutors</span>
          </span>
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm font-semibold text-ink-600 hover:text-primary-600 transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300" />
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://wa.me/8801318126412"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 px-5 py-2.5 rounded-full shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/40 transition-all hover:scale-105"
          >
            দ্রুত যোগাযোগ (WhatsApp)
          </a>
        </div>

        <button
          className="md:hidden p-2 text-ink-700"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-ink-100 animate-fade-in">
          <ul className="container-max py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="block py-3 px-2 text-base font-semibold text-ink-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-3">
              <a
                href="https://wa.me/8801318126412"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-sm font-bold text-white bg-emerald-600 px-4 py-2.5 rounded-full"
              >
                দ্রুত যোগাযোগ (WhatsApp)
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
