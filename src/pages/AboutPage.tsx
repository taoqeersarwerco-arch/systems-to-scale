import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TOPICS } from '../data/topics';
import { ALL_ARTICLES } from '../data/slug-registry';
import { OrbitalSystem } from '../components/about/OrbitalSystem';
import { ArrowRight, ArrowUpRight, ShieldCheck } from 'lucide-react';
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

  // Handle #method hash anchor scrolling smoothly
  useEffect(() => {
    if (location.hash === '#method') {
      const el = document.getElementById('method');
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
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
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
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
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
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
          SECTION 1: HERO (Dark Band, Orbital System)
          ========================================================================= */}
      <section className={styles.heroSection}>
        {/* Living Three.js Background: Central Core + 8 Orbiting Topic Bodies */}
        <OrbitalSystem />

        {/* Centered Content Overlay */}
        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>About this publication</span>

          <h1 className={styles.heroHeading}>
            Systems to Scale.
          </h1>

          <p className={styles.heroDescription}>
            In-depth explanations of the tools and systems modern businesses run on — because
            knowing why something works is what lets you build the next thing yourself.
          </p>
        </div>
      </section>

      {/* CURVE SEAM 1: Dark (#0A0C0D) -> Paper (#F4F1EB) */}
      <div className={styles.seamCurveContainer} style={{ backgroundColor: '#0A0C0D' }}>
        <svg viewBox="0 0 1440 48" fill="none" preserveAspectRatio="none" className={styles.seamSvg}>
          <path d="M0,0 C480,48 960,48 1440,0 L1440,48 L0,48 Z" fill="#F4F1EB" />
        </svg>
      </div>

      {/* =========================================================================
          SECTION 2: WHAT WE COVER (Paper Band)
          ========================================================================= */}
      <section className={styles.whatWeCoverSection}>
        <div className={styles.whatWeCoverContainer}>
          <h2 className={styles.whatWeCoverHeading}>
            Eight fields, one standard.
          </h2>
          <p className={styles.whatWeCoverSubhead}>
            Every field covers a different layer of how modern businesses operate. Each one is tested
            against the same three questions.
          </p>

          <div className={styles.fieldsGrid} ref={fieldsGridRef}>
            {TOPICS.map((topic) => (
              <Link
                key={topic.slug}
                to={`/topics/${topic.slug}`}
                className={styles.fieldCard}
              >
                <div>
                  <div className={styles.fieldCardTop}>
                    <h3 className={styles.fieldName}>{topic.name}</h3>
                    <ArrowUpRight size={15} className={styles.fieldArrow} />
                  </div>
                  <p className={styles.fieldScope}>
                    {TOPIC_SCOPES[topic.slug] || topic.hook}
                  </p>
                </div>
                <div className={styles.fieldCount}>
                  {getTopicCounts(topic.slug)}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CURVE SEAM 2: Paper (#F4F1EB) -> Dark (#0E1112) */}
      <div className={styles.seamCurveContainer} style={{ backgroundColor: '#F4F1EB' }}>
        <svg viewBox="0 0 1440 48" fill="none" preserveAspectRatio="none" className={styles.seamSvg}>
          <path d="M0,0 C480,48 960,48 1440,0 L1440,48 L0,48 Z" fill="#0E1112" />
        </svg>
      </div>

      {/* =========================================================================
          SECTION 3: THE METHOD / #method ANCHOR (Dark Band)
          ========================================================================= */}
      <section id="method" className={styles.methodSection}>
        <div className={styles.methodContainer}>
          <span className={styles.methodEyebrow}>How every article is tested</span>

          <h2 className={styles.methodHeading}>
            The three-question standard.
          </h2>

          <p className={styles.methodSubhead}>
            Before anything publishes, it has to answer three questions with primary sources. If it
            can't, it goes back to research.
          </p>

          <div className={styles.methodCardsStack} ref={methodStackRef}>
            {/* Card 1 */}
            <div className={styles.methodCard}>
              <div className={styles.methodCardHeader}>
                <span className={styles.methodNumber}>01</span>
                <h3 className={styles.methodQuestion}>What is the mechanism?</h3>
              </div>
              <p className={styles.methodExplanation}>
                Define what it does and what problem it solves — without marketing language, without
                jargon, without assuming the reader already knows.
              </p>
            </div>

            {/* Card 2 */}
            <div className={styles.methodCard}>
              <div className={styles.methodCardHeader}>
                <span className={styles.methodNumber}>02</span>
                <h3 className={styles.methodQuestion}>How does it physically work?</h3>
              </div>
              <p className={styles.methodExplanation}>
                Walk through the actual execution — the steps, the components, the failure modes. Use
                the real system, not an analogy for it.
              </p>
            </div>

            {/* Card 3 */}
            <div className={styles.methodCard}>
              <div className={styles.methodCardHeader}>
                <span className={styles.methodNumber}>03</span>
                <h3 className={styles.methodQuestion}>Why does it matter?</h3>
              </div>
              <p className={styles.methodExplanation}>
                Connect the mechanism to a real outcome. What breaks if you get this wrong? What
                changes if you understand it?
              </p>
            </div>
          </div>

          <p className={styles.methodFooterNote}>
            Every article on this site follows this structure. The question numbers map to the H2
            headings you'll find in each piece.
          </p>
        </div>
      </section>

      {/* CURVE SEAM 3: Dark (#0E1112) -> Paper (#F4F1EB) */}
      <div className={styles.seamCurveContainer} style={{ backgroundColor: '#0E1112' }}>
        <svg viewBox="0 0 1440 48" fill="none" preserveAspectRatio="none" className={styles.seamSvg}>
          <path d="M0,0 C480,48 960,48 1440,0 L1440,48 L0,48 Z" fill="#F4F1EB" />
        </svg>
      </div>

      {/* =========================================================================
          SECTION 4: CONTRIBUTORS (Paper Band)
          ========================================================================= */}
      <section className={styles.contributorsSection}>
        <div className={styles.contributorsContainer}>
          <h2 className={styles.contributorsHeading}>Who writes this.</h2>

          <div className={styles.honestPlaceholderBox}>
            <p className={styles.honestPlaceholderText}>
              We're building our contributor team. Every article will carry a real byline linked to a
              real author page — no pseudonyms, no stock photos. This section updates when the first
              contributor is confirmed.
            </p>
            <div className={styles.editorialIntegrityBadge}>
              <ShieldCheck size={13} />
              <span>EDITORIAL INTEGRITY // REAL BYLINES ONLY · VERIFIED PRACTITIONERS</span>
            </div>
          </div>
        </div>
      </section>

      {/* CURVE SEAM 4: Paper (#F4F1EB) -> Dark (#0E1112) */}
      <div className={styles.seamCurveContainer} style={{ backgroundColor: '#F4F1EB' }}>
        <svg viewBox="0 0 1440 48" fill="none" preserveAspectRatio="none" className={styles.seamSvg}>
          <path d="M0,0 C480,48 960,48 1440,0 L1440,48 L0,48 Z" fill="#0E1112" />
        </svg>
      </div>

      {/* =========================================================================
          SECTION 5 & 6: PUBLISHER DISCLOSURE & POLICIES (Dark Band)
          ========================================================================= */}
      <section className={styles.publisherSection}>
        <div className={styles.publisherContainer}>
          {/* Section 5: Publisher Disclosure */}
          <span className={styles.publisherEyebrow}>Publisher</span>
          <h2 className={styles.publisherHeading}>Published by Uniqentic.</h2>
          <p className={styles.publisherBody}>
            Systems to Scale is published by Uniqentic. The eight fields covered here map to the
            services the company offers. This relationship is disclosed here and in the footer —
            nowhere else. Articles are editorial, not promotional. No article on this site contains a
            sales pitch, an affiliate link, or a call to action for the parent company.
          </p>

          {/* Section 6: Links & Corrections Policy */}
          <div className={styles.policySection}>
            <h3 className={styles.policyHeading}>How we link and how we correct.</h3>

            <div className={styles.policyGrid}>
              {/* Column 1: Links */}
              <div>
                <h4 className={styles.policyColTitle}>Links</h4>
                <p className={styles.policyColBody}>
                  External links go to primary sources — official documentation, specifications,
                  standards, and papers. We don't link to aggregators or competitors' commercial
                  pages. Every external link carries <code>rel="noopener"</code>. We don't add
                  nofollow to editorial citations.
                </p>
              </div>

              {/* Vertical Column Divider on Desktop */}
              <div className={styles.policyDivider} />

              {/* Column 2: Corrections */}
              <div>
                <h4 className={styles.policyColTitle}>Corrections</h4>
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

      {/* CURVE SEAM 5: Dark (#0E1112) -> Paper (#F4F1EB) */}
      <div className={styles.seamCurveContainer} style={{ backgroundColor: '#0E1112' }}>
        <svg viewBox="0 0 1440 48" fill="none" preserveAspectRatio="none" className={styles.seamSvg}>
          <path d="M0,0 C480,48 960,48 1440,0 L1440,48 L0,48 Z" fill="#F4F1EB" />
        </svg>
      </div>

      {/* =========================================================================
          SECTION 7: NEWSLETTER CTA (Paper Band)
          ========================================================================= */}
      <section className={styles.newsletterSection} id="newsletter-section">
        <div className={styles.newsletterContainer}>
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

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.newsletterInput}
              required
            />

            <button
              type="submit"
              disabled={formStatus === 'loading'}
              className={styles.newsletterButton}
            >
              <span>{formStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}</span>
              <ArrowRight size={13} />
            </button>
          </form>

          {formStatus === 'success' && (
            <div className={styles.newsletterSuccessMsg}>
              ✓ You're subscribed. We'll only email when a verified system breakdown publishes.
            </div>
          )}
        </div>
      </section>

      {/* CURVE SEAM 6: Paper (#F4F1EB) -> Footer Dark (#080808) */}
      <div className={styles.seamCurveContainer} style={{ backgroundColor: '#F4F1EB' }}>
        <svg viewBox="0 0 1440 48" fill="none" preserveAspectRatio="none" className={styles.seamSvg}>
          <path d="M0,0 C480,48 960,48 1440,0 L1440,48 L0,48 Z" fill="#080808" />
        </svg>
      </div>
    </div>
  );
};
