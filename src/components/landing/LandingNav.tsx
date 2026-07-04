import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LandingLogo } from './LandingLogo';

const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#about', label: 'About' },
] as const;

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 border-b transition-shadow duration-300
        bg-white/90 backdrop-blur-md
        ${scrolled ? 'shadow-md border-transparent' : 'border-[rgba(0,0,0,0.06)] shadow-sm'}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-md lg:px-8">
        <LandingLogo />

        <nav className="hidden md:flex items-center gap-8" aria-label="Landing">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-on-surface-variant hover:text-primary font-medium text-body-sm transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/login"
            className="hidden sm:inline-flex text-on-surface-variant hover:text-on-surface font-medium text-body-sm px-3 py-2"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="bg-primary text-white font-semibold text-body-sm px-4 py-2.5 rounded-lg
                       hover:bg-primary-container transition-colors shadow-sm"
          >
            <span className="sm:hidden">Get started</span>
            <span className="hidden sm:inline">Get started free</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
