import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, ArrowRight, Check } from 'lucide-react';
import { CinematicLogoEngine } from '../ui/CinematicLogoEngine';
import styles from '../../styles/footer.module.css';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
  };

  const topicsList = [
    { name: 'AI & Automation', path: '/topics/ai-automation' },
    { name: 'Marketing & Ads', path: '/topics/marketing-ads' },
    { name: 'Web Design', path: '/topics/web-design' },
    { name: 'E-commerce', path: '/topics/e-commerce' },
    { name: 'Customer Service', path: '/topics/customer-service' },
    { name: 'Virtual Assistance', path: '/topics/virtual-assistance' },
    { name: 'Pitch Decks', path: '/topics/pitch-decks' },
    { name: 'Personal Assistance', path: '/topics/personal-assistance' }
  ];

  const publicationList = [
    { name: 'About Editorial', path: '/about' },
    { name: 'Articles Archive', path: '/articles' },
    { name: 'Topics Hub', path: '/topics' },
    { name: 'Community Hub', path: '/community' },
    { name: 'Contact Editors', path: '/contact' }
  ];

  const standardsList = [
    { name: 'Verified Practitioners', path: '/about#standards' },
    { name: 'Publisher Independence', path: '/about#standards' },
    { name: 'Primary Documentation', path: '/about#standards' },
    { name: 'Open Revision History', path: '/about#standards' }
  ];

  const legalList = [
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Cookie Settings', path: '/cookies' }
  ];

  return (
    <footer className={styles.footerContainer} aria-label="Global Site Footer">
      {/* 1. Top Horizon Atmospheric Light Bar & Traveling Photon Beam */}
      <div className={styles.horizonLightBar} />
      <div className={styles.horizonTravelingBeam} />

      {/* 2. Ambient Obsidian Radial Bloom */}
      <div className={styles.ambientRadialGlow} />

      <div className={styles.footerInner}>
        {/* ==================================================================
            TOP DECK: BRAND OBSERVATORY STAGE & DISPATCH CONSOLE
            ================================================================== */}
        <div className={styles.brandDeck}>
          {/* Left: Cinematic Living Logo Engine + Lockup */}
          <div className={styles.brandLeftStage}>
            <CinematicLogoEngine size={84} showRings={true} interactive={true} />

            <div className={styles.brandIdentityLockup}>
              <div className={styles.observatoryPill}>
                <span className={styles.radarBeacon} />
                Observatory Engine Online
              </div>

              <h3 className={styles.brandTitle}>Systems to Scale</h3>

              <p className={styles.brandTagline}>
                Understand the mechanism, not just the steps.
              </p>

              <p className={styles.brandScopeParagraph}>
                An independent publication dedicated to reverse-engineering how complex engineering systems, automated pipelines, and digital organizations scale.
              </p>
            </div>
          </div>

          {/* Right: The Weekly Dispatch Console */}
          <div className={styles.dispatchConsole}>
            <div className={styles.dispatchHeader}>
              <span className={styles.dispatchEyebrow}>Weekly Dispatch</span>
              <h4 className={styles.dispatchTitle}>Direct mechanism breakdowns in your inbox</h4>
            </div>

            {subscribed ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  borderRadius: '9999px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#10B981',
                  fontSize: '13px',
                  fontWeight: 500
                }}
              >
                <Check size={16} />
                <span>You're subscribed. Welcome to the observatory dispatch.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className={styles.dispatchForm}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className={styles.dispatchInput}
                  aria-label="Email address for dispatch"
                />
                <button type="submit" className={styles.dispatchSubmitBtn}>
                  <span>Join</span>
                  <ArrowRight size={13} />
                </button>
              </form>
            )}

            <div className={styles.dispatchTrustRow}>
              <span className={styles.dispatchTrustPill}>
                <span className={styles.dispatchTrustCheck}>✓</span> One email per breakdown
              </span>
              <span className={styles.dispatchTrustPill}>
                <span className={styles.dispatchTrustCheck}>✓</span> Zero spam
              </span>
              <span className={styles.dispatchTrustPill}>
                <span className={styles.dispatchTrustCheck}>✓</span> One-click unsubscribe
              </span>
            </div>
          </div>
        </div>

        {/* ==================================================================
            MIDDLE DECK: 4-COLUMN ARCHITECTURAL DIRECTORY
            ================================================================== */}
        <div className={styles.directoryDivider} />

        <div className={styles.directoryGrid}>
          {/* Column 1 — Disciplines & Systems */}
          <div className={styles.directoryColumn}>
            <h5 className={styles.columnHeader}>
              <span className={styles.columnHeaderDot} />
              Disciplines & Systems
            </h5>
            <div className={styles.linkList}>
              {topicsList.map((t) => (
                <Link key={t.path} to={t.path} className={styles.directoryLink}>
                  <span>{t.name}</span>
                  <span className={styles.linkArrow}>→</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2 — Publication */}
          <div className={styles.directoryColumn}>
            <h5 className={styles.columnHeader}>
              <span className={styles.columnHeaderDot} />
              Publication
            </h5>
            <div className={styles.linkList}>
              {publicationList.map((p) => (
                <Link key={p.path} to={p.path} className={styles.directoryLink}>
                  <span>{p.name}</span>
                  <span className={styles.linkArrow}>→</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3 — Standards & Integrity */}
          <div className={styles.directoryColumn}>
            <h5 className={styles.columnHeader}>
              <span className={styles.columnHeaderDot} />
              Integrity & Standards
            </h5>
            <div className={styles.linkList}>
              {standardsList.map((s) => (
                <Link key={s.name} to={s.path} className={styles.directoryLink}>
                  <span>{s.name}</span>
                  <span className={styles.linkArrow}>→</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Column 4 — Legal & Colophon */}
          <div className={styles.directoryColumn}>
            <h5 className={styles.columnHeader}>
              <span className={styles.columnHeaderDot} />
              Legal & Registry
            </h5>
            <div className={styles.linkList}>
              {legalList.map((l) => (
                <Link key={l.path} to={l.path} className={styles.directoryLink}>
                  <span>{l.name}</span>
                  <span className={styles.linkArrow}>→</span>
                </Link>
              ))}
              <a
                href="https://github.com/taoqeersarwerco-arch/systems-to-scale"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.directoryLink}
              >
                <span>GitHub Repository</span>
                <span className={styles.linkArrow}>↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* ==================================================================
            GIANT ARCHITECTURAL WATERMARK
            ================================================================== */}
        <div className={styles.giantWatermarkContainer} aria-hidden="true">
          <span className={styles.giantWatermarkText}>SYSTEMS TO SCALE</span>
        </div>

        {/* ==================================================================
            BOTTOM COLOPHON & RETURN TO ORBIT
            ================================================================== */}
        <div className={styles.colophonBar}>
          <div className={styles.colophonPublisher}>
            Systems to Scale is published by <strong>Uniqentic</strong>. Researching scalable architecture.
          </div>

          <div className={styles.colophonCopyright}>
            © 2026 Systems to Scale. All rights reserved.
          </div>

          <button
            onClick={scrollToTop}
            className={styles.backToTopButton}
            aria-label="Scroll back to top of page"
          >
            <span>Return to top</span>
            <div className={styles.backToTopCircle}>
              <ArrowUp size={11} />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
};
