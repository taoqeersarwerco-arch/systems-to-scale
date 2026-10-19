import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TOPICS } from '../data/topics';
import { OrbitalSystem } from '../components/about/OrbitalSystem';
import { SystemMechanismVisualizer } from '../components/about/SystemMechanismVisualizer';
import {
  Zap,
  TrendingUp,
  Layout,
  ShoppingBag,
  MessageSquare,
  Bot,
  BarChart3,
  Compass,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Radio,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '../styles/about.module.css';

gsap.registerPlugin(ScrollTrigger);

// Clean plain-English one-line mechanism explanations for the 8 topics
const SYSTEM_STATEMENTS: Record<string, string> = {
  'ai-automation': 'How automated workflows execute, fault, and self-heal without human intervention.',
  'marketing-ads': 'How real-time programmatic auctions settle bids and track attribution in milliseconds.',
  'web-design': 'How the browser engine turns code and styles into smooth, interactive pixels.',
  'e-commerce': 'How online checkout systems verify, authorize, and lock in payments securely.',
  'customer-service': 'How support requests route through real-time priority queues and escalation rules.',
  'virtual-assistance': 'How complex operational tasks hand off smoothly between teams across time zones.',
  'pitch-decks': 'How structured narrative arcs and visual pacing persuade decision-makers.',
  'personal-assistance': 'How conflict resolution and message triage protect executive attention and focus.',
};

// Pure monochrome topic vector icon mapping
const renderTopicVectorIcon = (slug: string) => {
  switch (slug) {
    case 'ai-automation':
      return <Zap size={16} className={styles.topicVectorIcon} />;
    case 'marketing-ads':
      return <TrendingUp size={16} className={styles.topicVectorIcon} />;
    case 'web-design':
      return <Layout size={16} className={styles.topicVectorIcon} />;
    case 'e-commerce':
      return <ShoppingBag size={16} className={styles.topicVectorIcon} />;
    case 'customer-service':
      return <MessageSquare size={16} className={styles.topicVectorIcon} />;
    case 'virtual-assistance':
      return <Bot size={16} className={styles.topicVectorIcon} />;
    case 'pitch-decks':
      return <BarChart3 size={16} className={styles.topicVectorIcon} />;
    case 'personal-assistance':
      return <Compass size={16} className={styles.topicVectorIcon} />;
    default:
      return <Sparkles size={16} className={styles.topicVectorIcon} />;
  }
};

export const AboutPage: React.FC = () => {
  const location = useLocation();
  const sectionHeaderRef = useRef<HTMLDivElement>(null);
  const fieldsGridRef = useRef<HTMLDivElement>(null);
  const methodStackRef = useRef<HTMLDivElement>(null);

  // Active hover tracking for mechanism animations
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Newsletter form states
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [mountTime] = useState<number>(Date.now());

  // Interactive 3D tilt & spotlight tracking with damped inertia physics
  const activeCardRef = useRef<HTMLElement | null>(null);
  const targetTiltRef = useRef({ x: 0, y: 0, spotX: 0, spotY: 0 });
  const currentTiltRef = useRef({ x: 0, y: 0, spotX: 0, spotY: 0 });
  const tiltRafIdRef = useRef<number | null>(null);

  const startTiltLoop = () => {
    if (tiltRafIdRef.current) return;
    const loop = () => {
      const el = activeCardRef.current;
      if (!el) {
        tiltRafIdRef.current = null;
        return;
      }
      const curr = currentTiltRef.current;
      const tgt = targetTiltRef.current;

      // Silky smooth exponential damping (cinematic camera gimbal feel)
      curr.x += (tgt.x - curr.x) * 0.14;
      curr.y += (tgt.y - curr.y) * 0.14;
      curr.spotX += (tgt.spotX - curr.spotX) * 0.14;
      curr.spotY += (tgt.spotY - curr.spotY) * 0.14;

      el.style.setProperty('--card-rotate-x', `${curr.x.toFixed(2)}deg`);
      el.style.setProperty('--card-rotate-y', `${curr.y.toFixed(2)}deg`);
      el.style.setProperty('--spotlight-x', `${curr.spotX.toFixed(1)}px`);
      el.style.setProperty('--spotlight-y', `${curr.spotY.toFixed(1)}px`);

      const isSettled =
        Math.abs(tgt.x - curr.x) < 0.02 &&
        Math.abs(tgt.y - curr.y) < 0.02 &&
        Math.abs(tgt.spotX - curr.spotX) < 0.5 &&
        Math.abs(tgt.spotY - curr.spotY) < 0.5;

      if (!isSettled || tgt.x !== 0 || tgt.y !== 0) {
        tiltRafIdRef.current = requestAnimationFrame(loop);
      } else {
        tiltRafIdRef.current = null;
      }
    };
    tiltRafIdRef.current = requestAnimationFrame(loop);
  };

  const handleCardMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -7;
    const rotateY = ((x / rect.width) - 0.5) * 7;

    activeCardRef.current = e.currentTarget;
    targetTiltRef.current = { x: rotateX, y: rotateY, spotX: x, spotY: y };
    startTiltLoop();
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    targetTiltRef.current = {
      x: 0,
      y: 0,
      spotX: currentTiltRef.current.spotX,
      spotY: currentTiltRef.current.spotY,
    };
    startTiltLoop();
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
      // 1. Cinematic Section Header Reveal with Optical Lens Focus
      if (sectionHeaderRef.current) {
        const eyebrow = sectionHeaderRef.current.querySelector(`.${styles.sectionEyebrow}`);
        const heading = sectionHeaderRef.current.querySelector(`.${styles.whatWeCoverHeading}`);
        const subhead = sectionHeaderRef.current.querySelector(`.${styles.whatWeCoverSubhead}`);

        const headerTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionHeaderRef.current,
            start: 'top 85%',
            once: true,
          },
        });

        if (eyebrow) {
          headerTl.fromTo(
            eyebrow,
            { opacity: 0, y: 16, scale: 0.94 },
            { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' }
          );
        }

        if (heading) {
          headerTl.fromTo(
            heading,
            { opacity: 0, y: 28, filter: 'blur(8px)' },
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.85, ease: 'power3.out' },
            '-=0.4'
          );
        }

        if (subhead) {
          headerTl.fromTo(
            subhead,
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' },
            '-=0.55'
          );
        }
      }

      // 2. Cinematic Perspective Camera Sweep for System Cards Grid
      if (fieldsGridRef.current) {
        const cards = fieldsGridRef.current.querySelectorAll(`.${styles.fieldCard}`);
        gsap.fromTo(
          cards,
          {
            opacity: 0,
            y: 48,
            scale: 0.95,
            rotateX: 10,
            filter: 'blur(6px)',
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            filter: 'blur(0px)',
            duration: 1.0,
            stagger: {
              amount: 0.45,
              grid: [4, 2],
              from: 'start',
              ease: 'power2.out',
            },
            ease: 'power3.out',
            clearProps: 'filter,transform', // critical: keeps 3D mouse tilt 100% hardware smooth after entrance
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


        {/* 4-Corner Reticle Hardware Accents */}
        <div className={styles.heroReticleTl} aria-hidden="true" />
        <div className={styles.heroReticleTr} aria-hidden="true" />
        <div className={styles.heroReticleBl} aria-hidden="true" />
        <div className={styles.heroReticleBr} aria-hidden="true" />

        {/* Living Three.js Background: Central Core + 8 Orbiting Topic Bodies */}
        <OrbitalSystem />

        {/* Centered Content Overlay */}
        <div className={styles.heroContent}>
          <div className={styles.heroEyebrow}>
            <Sparkles size={12} className={styles.eyebrowIcon} />
            <span>ABOUT THIS PUBLICATION</span>
          </div>

          <h1 className={styles.heroHeading}>
            Systems to Scale.
          </h1>

          <p className={styles.heroDescription}>
            In-depth explanations of the tools and systems modern businesses run on — because
            knowing why something works is what lets you build the next thing yourself.
          </p>

          {/* Sleek Frosted Editorial Standard Capsule */}
          <div className={styles.editorialStandardCapsule}>
            <span className={styles.capsuleItem}>8 CORE DISCIPLINES</span>
            <span className={styles.capsuleDot} aria-hidden="true">•</span>
            <span className={styles.capsuleItem}>3-QUESTION STANDARD</span>
            <span className={styles.capsuleDot} aria-hidden="true">•</span>
            <span className={styles.capsuleItem}>PRIMARY DOCS ONLY</span>
            <span className={styles.capsuleDot} aria-hidden="true">•</span>
            <span className={styles.capsuleItem}>ZERO COMMERCIAL BIAS</span>
          </div>
        </div>

        {/* Bottom Animated Scroll Indicator */}
        <a href="#what-we-cover" className={styles.scrollIndicator}>
          <span>EXPLORE PUBLICATION</span>
          <ChevronDown size={15} />
        </a>
      </section>

      {/* CURVE SEAM 1: Ground (#080808) -> Panel (#0D0F10) */}
      <div className={styles.seamCurveContainer} style={{ backgroundColor: '#080808' }}>
        <svg viewBox="0 0 1440 44" fill="none" preserveAspectRatio="none" className={styles.seamSvg}>
          <path d="M0,0 C480,44 960,44 1440,0 L1440,44 L0,44 Z" fill="#0D0F10" />
        </svg>
      </div>

      {/* =========================================================================
          SECTION 2: THE EIGHT SYSTEMS (Cinematic Living Mechanism Cards)
          ========================================================================= */}
      <section className={styles.whatWeCoverSection} id="what-we-cover">
        <div className={styles.whatWeCoverContainer}>
          <div className={styles.sectionHeaderCenter} ref={sectionHeaderRef}>
            <div className={styles.sectionEyebrow}>
              <Compass size={12} />
              <span>THE EIGHT SYSTEMS</span>
            </div>
            <h2 className={styles.whatWeCoverHeading}>
              Eight systems. One clear explanation.
            </h2>
            <p className={styles.whatWeCoverSubhead}>
              The fundamental mechanisms modern businesses run on, deconstructed and visualized in motion.
            </p>
          </div>

          <div className={styles.fieldsGrid} ref={fieldsGridRef}>
            {TOPICS.map((topic) => {
              const isHovered = hoveredCard === topic.slug;
              return (
                <Link
                  key={topic.slug}
                  to={`/topics/${topic.slug}`}
                  className={styles.fieldCard}
                  onMouseEnter={() => setHoveredCard(topic.slug)}
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={(e) => {
                    handleCardMouseLeave(e);
                    setHoveredCard(null);
                  }}
                >
                  <div>
                    {/* Top Header: Vector Icon + Name + Subtle Arrow (Zero numbers, zero discipline tags) */}
                    <div className={styles.fieldCardTop}>
                      <div className={styles.fieldTitleRow}>
                        {renderTopicVectorIcon(topic.slug)}
                        <h3 className={styles.fieldName}>{topic.name}</h3>
                      </div>
                      <ArrowUpRight size={16} className={styles.fieldArrow} />
                    </div>

                    {/* Living Kinetic Mechanism Canvas (See the system in action) */}
                    <div className={styles.visualizerWindow}>
                      <SystemMechanismVisualizer
                        topicSlug={topic.slug}
                        isHovered={isHovered}
                      />
                    </div>

                    {/* Clean Plain-English One-Line Explanation */}
                    <p className={styles.fieldScope}>
                      {SYSTEM_STATEMENTS[topic.slug] || topic.hook}
                    </p>
                  </div>

                  {/* Clean Minimal Interactive Indicator (Zero numbers, zero article terms) */}
                  <div className={styles.fieldFooter}>
                    <div className={styles.fieldStatusPill}>
                      <span className={styles.fieldStatusDot} />
                      <span>EXPLORE SYSTEM</span>
                    </div>
                    <span className={styles.fieldActionText}>
                      VIEW DETAILS →
                    </span>
                  </div>
                </Link>
              );
            })}
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
