import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, ArrowUpRight } from 'lucide-react';
import styles from '../../styles/header.module.css';

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
      setIsScrolled(window.scrollY > 40);
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
        className={`${styles.headerPill} ${isScrolled ? styles.headerPillScrolled : ''}`}
        aria-label="Primary Navigation"
      >
        {/* Top Rim Traveling Horizon Ray */}
        <div className={styles.headerRay} />

        {/* 1. Cinematic Living Logo Micro-Mark */}
        <Link
          to="/"
          className={styles.logoLink}
          aria-label="Systems to Scale — Return to Overview"
        >
          <svg
            width="34"
            height="34"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.logoMicroSvg}
            aria-hidden="true"
          >
            {/* Base Pipeline Conduits */}
            <path
              d="M12 36 L12 24 L24 24"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M28 24 L36 24 L36 12"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Living Conduit Currents */}
            <path
              d="M12 36 L12 24 L24 24 M28 24 L36 24 L36 12"
              className={styles.microPipeCurrent}
            />

            {/* Node 1: Origin Foundation Circle */}
            <circle cx="12" cy="36" r="4.5" fill="#FFFFFF" className={styles.microNodePulse} />

            {/* Node 2: Center Scaling Core */}
            <rect
              x="20"
              y="20"
              width="8"
              height="8"
              rx="2"
              fill="#090A0C"
              stroke="#FFFFFF"
              strokeWidth="3.2"
            />
            {/* Core center dot */}
            <circle cx="24" cy="24" r="1.5" fill="#FFFFFF" />

            {/* Node 3: Apex High-Scale Arrow */}
            <polygon
              points="36,6 42,14 30,14"
              fill="#FFFFFF"
              className={styles.microNodePulse}
            />

            {/* Auxiliary Telemetry Trace */}
            <circle cx="24" cy="36" r="1.8" fill="rgba(255, 255, 255, 0.5)" />
            <line
              x1="16.5"
              y1="36"
              x2="22"
              y2="36"
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="1.6"
              strokeDasharray="2 2"
            />
          </svg>
        </Link>

        {/* 2. Desktop Navigation Links */}
        <nav className={styles.desktopNav}>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
              >
                {isActive && <span className={styles.activeDot} />}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* 3. Cinematic Search Trigger Command Capsule */}
        <button
          id="sts-header-search-btn"
          onClick={onOpenSearch}
          className={styles.searchTrigger}
          aria-label="Open search command console"
        >
          <Search size={15} className={styles.searchIcon} />
          <span className={styles.searchKbd}>⌘K</span>
        </button>

        {/* 4. Island CTA Button: Subscribe Dispatch */}
        <button
          onClick={onOpenSubscribe || (() => {
            const el = document.getElementById('newsletter-section');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            } else {
              window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }
          })}
          className={styles.ctaButton}
        >
          <span>Subscribe</span>
        </button>

        {/* 5. Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={styles.mobileToggle}
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Fullscreen Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={styles.mobileOverlay}>
          <nav className={styles.mobileNavLinks}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={styles.mobileNavLink}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};
