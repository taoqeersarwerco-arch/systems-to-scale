import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { StsLogo } from '../ui/StsLogo';
import { Search, Menu, X } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenSubscribe?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch, onOpenSubscribe }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Topics', path: '/topics' },
    { label: 'Articles', path: '/articles' },
    { label: 'About', path: '/about' },
    { label: 'Community', path: '/community' }
  ];

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          maxWidth: 'fit-content',
          borderRadius: '999px',
          background: 'rgba(var(--sts-ground-rgb), 0.8)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid var(--sts-border)',
          padding: isScrolled ? '6px 20px' : '8px 24px',
          height: '52px',
          display: 'flex',
          alignItems: 'center',
          gap: '32px',
          opacity: isScrolled ? 0.95 : 1,
          transition: 'all var(--sts-dur-panel) var(--sts-ease)'
        }}
        className="sts-header-pill"
      >
        {/* 1. Logo mark only (34px height, fill brass, links to /) */}
        <Link
          to="/"
          aria-label="Systems to Scale"
          style={{ display: 'inline-flex', alignItems: 'center' }}
        >
          <StsLogo size={34} color="var(--sts-brass)" />
        </Link>

        {/* 2. Nav links */}
        <nav
          className="sts-desktop-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px'
          }}
        >
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  fontFamily: 'var(--sts-font-body)',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: isActive ? 'var(--sts-bone)' : 'var(--sts-muted)',
                  textDecoration: 'none',
                  transition: 'color var(--sts-dur-in) var(--sts-ease)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--sts-bone)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = isActive ? 'var(--sts-bone)' : 'var(--sts-muted)')}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* 3. Search icon + ⌘K */}
        <button
          onClick={onOpenSearch}
          className="sts-search-trigger"
          aria-label="Search"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--sts-muted)',
            cursor: 'pointer',
            transition: 'color var(--sts-dur-in) var(--sts-ease)'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--sts-bone)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--sts-muted)')}
        >
          <Search size={20} />
          <span
            className="sts-kbd-label"
            style={{
              fontFamily: 'var(--sts-font-mono)',
              fontSize: '11px',
              color: 'var(--sts-muted)'
            }}
          >
            ⌘K
          </span>
        </button>

        {/* 4. Newsletter CTA pill button */}
        <button
          onClick={onOpenSubscribe || (() => {
            const el = document.getElementById('newsletter-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          })}
          className="sts-cta-btn"
          style={{
            borderRadius: '999px',
            padding: '6px 18px',
            color: '#000000',
            fontSize: '13px',
            fontWeight: 600,
            fontFamily: 'var(--sts-font-body)',
            background: '#FFFFFF',
            cursor: 'pointer',
            transition: 'all var(--sts-dur-in) var(--sts-ease)',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#EDEDED';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#FFFFFF';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Subscribe
        </button>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sts-mobile-toggle"
          aria-label="Toggle navigation"
          style={{
            display: 'none',
            color: 'var(--sts-muted)',
            padding: '2px'
          }}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Mobile full-screen overlay */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--sts-ground)',
            zIndex: 99,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '32px'
          }}
        >
          <div style={{ marginBottom: '16px' }}>
            <StsLogo size={48} color="var(--sts-brass)" />
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontFamily: 'var(--sts-font-display)',
                  fontSize: '24px',
                  fontWeight: 600,
                  color: 'var(--sts-bone)'
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      <style>{`
        @media (max-width: 760px) {
          .sts-desktop-nav, .sts-cta-btn, .sts-kbd-label {
            display: none !important;
          }
          .sts-mobile-toggle {
            display: inline-flex !important;
          }
          .sts-header-pill {
            gap: 16px !important;
            padding: 8px 16px !important;
            width: calc(100% - 32px);
            max-width: 100% !important;
            justify-content: space-between;
          }
        }
      `}</style>
    </>
  );
};
