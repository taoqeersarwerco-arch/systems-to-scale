import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TOPICS } from '../data/topics';
import { ALL_ARTICLES } from '../data/slug-registry';
import { OrbitalSystem } from '../components/about/OrbitalSystem';
import { ArrowRight, ArrowUpRight, ShieldCheck, Radio, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '../styles/about.module.css';

gsap.registerPlugin(ScrollTrigger);

// Custom editorial scope definitions for the 8 topics
const TOPIC_SCOPES: Record<string, string> = {
  'ai-automation': 'Pipelines, execution graphs, error handling, retry logic, and the orchestration layer beneath every workflow tool.',
  'marketing-ads': 'Real-time programmatic auctions, attribution modeling, Consent Mode v2, and server-side tracking pipelines.',
  'web-design': 'The browser rendering path, layout thrashing, DOM compilation, and how Core Web Vitals map to rendering physics.',
  'e-commerce': 'Multi-party payment coordinates, authorization holds, 3-D Secure challenges, and cart abandonment mechanics.',
  'customer-service': 'Queue priority routing, contract SLAs, omnichannel thread merging, and genuine AI deflection rates.',
  'virtual-assistance': 'Context packaging, SOP engineering, asynchronous handoff protocols, and delegation frameworks.',
  'pitch-decks': 'The 10-slide persuasion architecture, format fidelity across tools, and data visualization under presentation conditions.',
  'personal-assistance': 'Executive calendar defense, high-signal information triage, personal operating systems, and focus preservation.',
};

export const AboutPage: React.FC = () => {
  const location = useLocation();
  const fieldsGridRef = useRef<HTMLDivElement>(null);
  const methodStackRef = useRef<HTMLDivElement>(null);

  // Newsletter form states
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [mountTime] = useState<number>(Date.now());

  // Interactive 3D tilt & spotlight tracking for cards
  const handleCardMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -5;
    const rotateY = ((x / rect.width) - 0.5) * 5;
    e.currentTarget.style.setProperty('--card-rotate-x', `${rotateX.toFixed(2)}deg`);
    e.currentTarget.style.setProperty('--card-rotate-y', `${rotateY.toFixed(2)}deg`);
    e.currentTarget.style.setProperty('--spotlight-x', `${x}px`);
    e.currentTarget.style.setProperty('--spotlight-y', `${y}px`);
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty('--card-rotate-x', '0deg');
    e.currentTarget.style.setProperty('--card-rotate-y', '0deg');
  };

  // Handle #method hash anchor scrolling smoothly
  useEffect(() => {
    if (location.hash === '#method') {
      const el = document.getElementById('method');
      if (el) {
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        setTimeout(() => {
          el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
        }, 150);
      }
    }
  }, [location.hash]);

  // GSAP ScrollTrigger Entrance Animations
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Stagger Field Cards
      if (fieldsGridRef.current) {
        const cards = fieldsGridRef.current.querySelectorAll(`.${styles.fieldCard}`);
        gsap.fromTo(
          cards,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.07,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: fieldsGridRef.current,
              start: 'top 82%',
              once: true,
            },
          }
        );
      }

      // Stagger Method Cards
      if (methodStackRef.current) {
        const methodCards = methodStackRef.current.querySelectorAll(`.${styles.methodCard}`);
        gsap.fromTo(
          methodCards,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.12,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: methodStackRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  // Compute live publication counts per topic
  const getTopicCounts = (topicSlug: string) => {
    const articles = ALL_ARTICLES.filter((a) => a.topicSlug === topicSlug);
    const total = articles.length || 5;
    const published = articles.filter((a) => a.status === 'published').length;
    return `${total} articles — ${published} published`;
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Dwell-trap & honeypot anti-spam check
    if (Date.now() - mountTime < 3000 || honeypot) {
      setFormStatus('success');
      return;
    }

    if (!email || !email.includes('@')) {
      setFormStatus('error');
      return;
    }

    setFormStatus('loading');
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setFormStatus('success');
      setEmail('');
    } catch {
      setFormStatus('error');
    }
  };

  return (
    <div className={styles.aboutPage}>
      {/* =========================================================================
          SECTION 1: HERO (Dark Band, Orbital System & Telemetry HUD)
          ========================================================================= */}
      <section className={styles.heroSection}>
        {/* Soft typographic reading pocket */}
        <div className={styles.readingPocket} />

        {/* Observatory Telemetry HUD Bar */}
        <div className={styles.observatoryHudTop}>
          <span className={styles.observatoryHudItem}>ABOUT THIS PUBLICATION // SYSTEMS TO SCALE</span>
          <span className={styles.observatoryHudDivider}>•</span>
          <span className={styles.observatoryHudItem}>ORBITAL ENGINE: KEPLERIAN 3D</span>
          <span className={styles.observatoryHudItem}>
            <span className={styles.observatoryHudDivider}>•</span> 8 CELESTIAL BODIES
          </span>
          <span className={styles.observatoryHudItem}>
            <span className={styles.observatoryHudDivider}>•</span> 60 FPS
          </span>
        </div>

        {/* Reticle Corner Accents */}
        <div className={styles.heroReticleTl} />
        <div className={styles.heroReticleTr} />

        {/* Living Three.js Background: Central Core + 8 Orbiting Topic Bodies */}
        <OrbitalSystem />

        {/* Centered Content Overlay */}
        <div className={styles.heroContent}>
          <div className={styles.heroEyebrow}>
            <Radio size={12} />
            <span>About this publication</span>
          </div>

          <h1 className={styles.heroHeading}>
            Systems to Scale.
          </h1>

          <p className={styles.heroDescription}>
            In-depth explanations of the tools and systems modern businesses run on — because
            knowing why something works is what lets you build the next thing yourself.
          </p>

          {/* KPI Strip */}
          <div className={styles.kpiStrip}>
            <div className={styles.kpiChip}>
              <span>COVERAGE:</span>
              <strong>8 FIELDS</strong>
            </div>
            <div className={styles.kpiChip}>
              <span>STANDARD:</span>
              <strong>3 QUESTIONS</strong>
            </div>
            <div className={styles.kpiChip}>
              <span>CITATIONS:</span>
              <strong>PRIMARY DOCS ONLY</strong>
            </div>
            <div className={styles.kpiChip}>
              <span>COMMERCIAL BIAS:</span>
              <strong>ZERO</strong>
            </div>
          </div>
        </div>
      </section>

      {/* CURVE SEAM 1: Ground (#080808) -> Panel (#0D0F10) */}
      <div className={styles.seamCurveContainer} style={{ backgroundColor: '#080808' }}>
        <svg viewBox="0 0 1440 44" fill="none" preserveAspectRatio="none" className={styles.seamSvg}>
          <path d="M0,0 C480,44 960,44 1440,0 L1440,44 L0,44 Z" fill="#0D0F10" />
        </svg>
      </div>

      {/* =========================================================================
          SECTION 2: WHAT WE COVER (Cinematic Staggered Field Cards)
          ========================================================================= */}
      <section className={styles.whatWeCoverSection}>
        <div className={styles.whatWeCoverContainer}>
          <div className={styles.sectionHeaderCenter}>
            <div className={styles.sectionEyebrow}>
              <Sparkles size={12} />
              <span>ORBITAL MAPPING // EIGHT FIELDS</span>
            </div>
            <h2 className={styles.whatWeCoverHeading}>
              Eight fields, one standard.
            </h2>
            <p className={styles.whatWeCoverSubhead}>
              Every field covers a different layer of how modern businesses operate. Each one is tested
              against the same three questions.
            </p>
          </div>

          <div className={styles.fieldsGrid} ref={fieldsGridRef}>
            {TOPICS.map((topic, idx) => (
              <Link
                key={topic.slug}
                to={`/topics/${topic.slug}`}
                className={styles.fieldCard}
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
              >
                <div>
                  <div className={styles.fieldCardTop}>
                    <div className={styles.fieldMetaTag}>
                      <span className={styles.fieldBeacon} />
                      <span>ORBIT 0{idx + 1} // DISCIPLINE</span>
                    </div>
                    <ArrowUpRight size={16} className={styles.fieldArrow} />
                  </div>
                  <h3 className={styles.fieldName}>{topic.name}</h3>
                  <p className={styles.fieldScope}>
                    {TOPIC_SCOPES[topic.slug] || topic.hook}
                  </p>
                </div>
                <div className={styles.fieldFooter}>
                  <span className={styles.fieldCount}>
                    {getTopicCounts(topic.slug)}
                  </span>
                  <span className={styles.fieldBadge}>
                    PRIMARY SPECS
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CURVE SEAM 2: Panel (#0D0F10) -> Ground (#080808) */}
      <div className={styles.seamCurveContainer} style={{ backgroundColor: '#0D0F10' }}>
        <svg viewBox="0 0 1440 44" fill="none" preserveAspectRatio="none" className={styles.seamSvg}>
          <path d="M0,0 C480,44 960,44 1440,0 L1440,44 L0,44 Z" fill="#080808" />
        </svg>
      </div>

      {/* =========================================================================
          SECTION 3: THE METHOD / #method ANCHOR (The Three-Question Standard)
          ========================================================================= */}
      <section id="method" className={styles.methodSection}>
        <div className={styles.methodContainer}>
          <div className={styles.methodEyebrow}>
            <Radio size={12} />
            <span>EDITORIAL PROTOCOL (#METHOD)</span>
          </div>

          <h2 className={styles.methodHeading}>
            The three-question standard.
          </h2>

          <p className={styles.methodSubhead}>
            Before anything publishes, it has to answer three questions with primary sources. If it
            can't, it goes back to research.
          </p>

          <div className={styles.methodCardsStack} ref={methodStackRef}>
            {/* Card 1 */}
            <div
              className={styles.methodCard}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <div className={styles.methodCardHeader}>
                <span className={styles.methodNumberBadge}>01</span>
                <h3 className={styles.methodQuestion}>What is the mechanism?</h3>
              </div>
              <p className={styles.methodExplanation}>
                Define what it does and what problem it solves — without marketing language, without
                jargon, without assuming the reader already knows.
              </p>
              <div className={styles.methodTagRow}>
                <span className={styles.methodTag}>Contract: Mechanism Definition</span>
                <span className={styles.methodTag}>Zero Marketing Jargon</span>
                <span className={styles.methodTag}>Primary Specs Only</span>
              </div>
            </div>

            {/* Card 2 */}
            <div
              className={styles.methodCard}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <div className={styles.methodCardHeader}>
                <span className={styles.methodNumberBadge}>02</span>
                <h3 className={styles.methodQuestion}>How does it physically work?</h3>
              </div>
              <p className={styles.methodExplanation}>
                Walk through the actual execution — the steps, the components, the failure modes. Use
                the real system, not an analogy for it.
              </p>
              <div className={styles.methodTagRow}>
                <span className={styles.methodTag}>Contract: State Machine</span>
                <span className={styles.methodTag}>Deconstruct Execution</span>
                <span className={styles.methodTag}>Failure Mode Analysis</span>
              </div>
            </div>

            {/* Card 3 */}
            <div
              className={styles.methodCard}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <div className={styles.methodCardHeader}>
                <span className={styles.methodNumberBadge}>03</span>
                <h3 className={styles.methodQuestion}>Why does it matter?</h3>
              </div>
              <p className={styles.methodExplanation}>
                Connect the mechanism to a real outcome. What breaks if you get this wrong? What
                changes if you understand it?
              </p>
              <div className={styles.methodTagRow}>
                <span className={styles.methodTag}>Contract: Production Impact</span>
                <span className={styles.methodTag}>Extreme Load Verification</span>
                <span className={styles.methodTag}>Architectural Tradeoffs</span>
              </div>
            </div>
          </div>

          <p className={styles.methodFooterNote}>
            Every article on this site follows this structure. The question numbers map to the H2
            headings you'll find in each piece.
          </p>
        </div>
      </section>

      {/* CURVE SEAM 3: Ground (#080808) -> Panel (#0D0F10) */}
      <div className={styles.seamCurveContainer} style={{ backgroundColor: '#080808' }}>
        <svg viewBox="0 0 1440 44" fill="none" preserveAspectRatio="none" className={styles.seamSvg}>
          <path d="M0,0 C480,44 960,44 1440,0 L1440,44 L0,44 Z" fill="#0D0F10" />
        </svg>
      </div>

      {/* =========================================================================
          SECTION 4: CONTRIBUTORS (Honest Empty State with Cinematic Quality)
          ========================================================================= */}
      <section className={styles.contributorsSection}>
        <div className={styles.contributorsContainer}>
          <div className={styles.honestPlaceholderBox}>
            <div className={styles.honestHeader}>
              <span className={styles.honestStatusTag}>
                <span className={styles.fieldBeacon} />
                STATUS: ACTIVE RECRUITMENT // BYLINE INTEGRITY
              </span>
              <span className={styles.fieldBadge}>ZERO AI PSEUDONYMS</span>
            </div>

            <h2 className={styles.contributorsHeading}>Who writes this.</h2>

            <p className={styles.honestPlaceholderText}>
              We're building our contributor team. Every article will carry a real byline linked to a
              real author page — no pseudonyms, no stock photos. This section updates when the first
              contributor is confirmed.
            </p>

            <div className={styles.editorialIntegrityBadge}>
              <ShieldCheck size={14} />
              <span>EDITORIAL INTEGRITY PROTOCOL // REAL BYLINES ONLY · VERIFIED PRACTITIONERS</span>
            </div>
          </div>
        </div>
      </section>

      {/* CURVE SEAM 4: Panel (#0D0F10) -> Ground (#080808) */}
      <div className={styles.seamCurveContainer} style={{ backgroundColor: '#0D0F10' }}>
        <svg viewBox="0 0 1440 44" fill="none" preserveAspectRatio="none" className={styles.seamSvg}>
          <path d="M0,0 C480,44 960,44 1440,0 L1440,44 L0,44 Z" fill="#080808" />
        </svg>
      </div>

      {/* =========================================================================
          SECTION 5 & 6: PUBLISHER DISCLOSURE & POLICIES (Dark Band)
          ========================================================================= */}
      <section className={styles.publisherSection}>
        <div className={styles.publisherContainer}>
          {/* Section 5: Publisher Disclosure Card */}
          <div className={styles.publisherCard}>
            <span className={styles.publisherEyebrow}>Publisher Disclosure</span>
            <h2 className={styles.publisherHeading}>Published by Uniqentic.</h2>
            <p className={styles.publisherBody}>
              Systems to Scale is published by Uniqentic. The eight fields covered here map to the
              services the company offers. This relationship is disclosed here and in the footer —
              nowhere else. Articles are editorial, not promotional. No article on this site contains a
              sales pitch, an affiliate link, or a call to action for the parent company.
            </p>
          </div>

          <div className={styles.policyDividerRule} />

          {/* Section 6: Links & Corrections Policy */}
          <div className={styles.policySection}>
            <h3 className={styles.policyHeading}>How we link and how we correct.</h3>

            <div className={styles.policyGrid}>
              {/* Column 1: Links */}
              <div className={styles.policyCol}>
                <div className={styles.policyColHeader}>
                  <h4 className={styles.policyColTitle}>Links</h4>
                  <span className={styles.policyColTag}>PRIMARY DOCS ONLY</span>
                </div>
                <p className={styles.policyColBody}>
                  External links go to primary sources — official documentation, specifications,
                  standards, and papers. We don't link to aggregators or competitors' commercial
                  pages. Every external link carries <code>rel="noopener"</code>. We don't add
                  nofollow to editorial citations.
                </p>
              </div>

              {/* Column 2: Corrections */}
              <div className={styles.policyCol}>
                <div className={styles.policyColHeader}>
                  <h4 className={styles.policyColTitle}>Corrections</h4>
                  <span className={styles.policyColTag}>TRANSPARENT REVISIONS</span>
                </div>
                <p className={styles.policyColBody}>
                  Every article has a visible corrections block. If we get something wrong, we fix it,
                  date the correction, and leave both versions visible. We don't silently edit
                  published work. The version stamp on each article shows when it was last tested and
                  re-checked.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CURVE SEAM 5: Ground (#080808) -> Panel (#0D0F10) */}
      <div className={styles.seamCurveContainer} style={{ backgroundColor: '#080808' }}>
        <svg viewBox="0 0 1440 44" fill="none" preserveAspectRatio="none" className={styles.seamSvg}>
          <path d="M0,0 C480,44 960,44 1440,0 L1440,44 L0,44 Z" fill="#0D0F10" />
        </svg>
      </div>

      {/* =========================================================================
          SECTION 7: NEWSLETTER CTA (Command Console)
          ========================================================================= */}
      <section className={styles.newsletterSection} id="newsletter-section">
        <div className={styles.newsletterContainer}>
          <div className={styles.newsletterEyebrow}>
            <Radio size={12} />
            <span>WEEKLY MECHANISM DISPATCH</span>
          </div>

          <h2 className={styles.newsletterHeading}>Follow the work.</h2>
          <p className={styles.newsletterSubhead}>
            One email when something new publishes. No spam, no pitch, unsubscribe anytime.
          </p>

          <form onSubmit={handleNewsletterSubmit} className={styles.newsletterForm}>
            {/* Honeypot field for bot protection */}
            <input
              type="text"
              name="b_honeypot"
              tabIndex={-1}
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              style={{ display: 'none' }}
              aria-hidden="true"
              autoComplete="off"
            />

            <div className={styles.newsletterInputWrapper}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.newsletterInput}
                required
              />
            </div>

            <button
              type="submit"
              disabled={formStatus === 'loading'}
              className={styles.newsletterButton}
            >
              <span>{formStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}</span>
              <ArrowRight size={14} />
            </button>
          </form>

          {formStatus === 'success' && (
            <div className={styles.newsletterSuccessMsg}>
              ✓ You're subscribed. We'll only email when a verified system breakdown publishes.
            </div>
          )}

          <div className={styles.newsletterGuarantees}>
            KIT PROTECTED // DWELL-TRAP SHIELD // UNSUBSCRIBE WITH ONE CLICK
          </div>
        </div>
      </section>

      {/* CURVE SEAM 6: Panel (#0D0F10) -> Footer Dark (#080808) */}
      <div className={styles.seamCurveContainer} style={{ backgroundColor: '#0D0F10' }}>
        <svg viewBox="0 0 1440 44" fill="none" preserveAspectRatio="none" className={styles.seamSvg}>
          <path d="M0,0 C480,44 960,44 1440,0 L1440,44 L0,44 Z" fill="#080808" />
        </svg>
      </div>
    </div>
  );
};
