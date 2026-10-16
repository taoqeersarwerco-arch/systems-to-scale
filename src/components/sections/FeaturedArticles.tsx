import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  Lock,
  Database,
  Cpu,
  CheckCircle2,
  Radio,
  TrendingUp,
  Eye,
  FileCode2,
  Layout,
  Sparkles,
  CreditCard,
  CheckCheck,
  Inbox,
  ClockAlert,
  Smile,
  ListTodo,
  Globe,
  Award,
  LucideIcon
} from 'lucide-react';
import { SLUG_REGISTRY } from '../../data/slug-registry';
import './FeaturedArticles.css';

gsap.registerPlugin(ScrollTrigger);

interface MicroNode {
  label: string;
  icon: LucideIcon;
}

interface FeaturedItem {
  title: string;
  topicBadge: string;
  focusQuestion: string;
  slug: string;
  microNodes: MicroNode[];
}

const FEATURED_PILLARS: FeaturedItem[] = [
  {
    title: 'How automation pipelines actually work',
    topicBadge: 'AI & Automation',
    focusQuestion: 'What happens inside a pipeline when it faults mid-run — and how retry, backoff, and dead-letter queues keep it alive.',
    slug: 'automation-pipelines-explained',
    microNodes: [
      { label: 'Ingest', icon: Database },
      { label: 'Mutex Lock', icon: Cpu },
      { label: 'WAL Commit', icon: CheckCircle2 }
    ]
  },
  {
    title: 'How a real-time ad auction works',
    topicBadge: 'Marketing & Ads',
    focusQuestion: 'How billions of ad impressions settle in under 100 milliseconds through programmatic bidding.',
    slug: 'how-ad-auctions-work',
    microNodes: [
      { label: 'SSP Bid', icon: Radio },
      { label: 'Multi-DSP', icon: TrendingUp },
      { label: 'Vickrey Clear', icon: Eye }
    ]
  },
  {
    title: 'How a browser renders a page',
    topicBadge: 'Web Design',
    focusQuestion: 'The journey from raw HTML to visible pixels — parsing, layout, paint, and why render-blocking resources stall it.',
    slug: 'how-browsers-render-pages',
    microNodes: [
      { label: 'DOM Tree', icon: FileCode2 },
      { label: 'Reflow Layout', icon: Layout },
      { label: '60FPS Paint', icon: Sparkles }
    ]
  },
  {
    title: 'How an online checkout works',
    topicBadge: 'E-commerce',
    focusQuestion: 'The full payment flow: tokenisation, authorization holds, capture, 3-D Secure verification, and what happens when it fails.',
    slug: 'how-online-checkout-works',
    microNodes: [
      { label: '3DS Vault', icon: CreditCard },
      { label: 'Auth Hold', icon: Lock },
      { label: 'Async Settle', icon: CheckCheck }
    ]
  },
  {
    title: 'How ticket routing works',
    topicBadge: 'Customer Service',
    focusQuestion: 'How a support ticket gets classified, prioritised by SLA, routed to the right queue, and escalated when it stalls.',
    slug: 'how-ticket-routing-works',
    microNodes: [
      { label: 'Ticket Ingest', icon: Inbox },
      { label: 'SLA Escalation', icon: ClockAlert },
      { label: 'CSAT Resolve', icon: Smile }
    ]
  },
  {
    title: 'How task delegation works',
    topicBadge: 'Virtual Assistance',
    focusQuestion: 'How a task moves from requester to operator without losing context — SOPs, async handoffs, and clean boundaries.',
    slug: 'how-task-delegation-works',
    microNodes: [
      { label: 'Task Queue', icon: ListTodo },
      { label: 'Timezone Orbit', icon: Globe },
      { label: 'QA Rubric', icon: Award }
    ]
  }
];

export const FeaturedArticles: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [isHeaderRevealed, setIsHeaderRevealed] = useState(false);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced || !gridRef.current || !sectionRef.current) {
      setIsHeaderRevealed(true);
      return;
    }

    const ctx = gsap.context(() => {
      // Header character-reveal trigger
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 82%',
        onEnter: () => setIsHeaderRevealed(true)
      });

      // Staggered card entrance cascade across 3 columns
      const cards = gridRef.current?.children;
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.09,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 85%'
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const headerTitle = 'Start here.';

  return (
    <section
      id="featured-articles"
      ref={sectionRef}
      className="sts-section"
      style={{
        background: 'var(--sts-ground, #0E1112)',
        position: 'relative',
        zIndex: 10,
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        paddingTop: '80px',
        paddingBottom: '80px',
        scrollMarginTop: '80px'
      }}
    >
      <div className="sts-container" style={{ maxWidth: '1140px', margin: '0 auto', padding: '0 24px' }}>
        {/* Section Header: Pure Monochrome & Character-Reveal */}
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 52px auto' }}>
          <div className="sts-eyebrow" style={{ marginBottom: '12px', justifyContent: 'center' }}>
            <span>FEATURED RESEARCH</span>
          </div>

          <h2 className={`sts-featured-header-title ${isHeaderRevealed ? 'revealed' : ''}`}>
            {headerTitle.split(' ').map((word, wIdx, arr) => (
              <span key={wIdx} className="word">
                {word.split('').map((char, cIdx) => {
                  const globalIdx = wIdx * 6 + cIdx;
                  return (
                    <span
                      key={cIdx}
                      className="ch"
                      style={{
                        animationDelay: `${0.08 + globalIdx * 0.038}s`
                      }}
                    >
                      {char}
                    </span>
                  );
                })}
                {wIdx < arr.length - 1 && (
                  <span className="ch" style={{ width: '8px' }}>
                    &nbsp;
                  </span>
                )}
              </span>
            ))}
          </h2>

          <p
            style={{
              fontFamily: 'var(--sts-font-body, sans-serif)',
              fontSize: '15px',
              color: 'var(--sts-muted, #9CA3AF)',
              lineHeight: 1.6
            }}
          >
            Foundational deep dives — each one covers a whole field from the ground up.
          </p>
        </div>

        {/* 3-Column Architectural Grid */}
        <div
          ref={gridRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            maxWidth: '1100px',
            margin: '0 auto'
          }}
          className="sts-featured-grid"
        >
          {FEATURED_PILLARS.map((item) => {
            const article = SLUG_REGISTRY[item.slug];
            const isPublished = Boolean(article && article.status === 'published');

            const cardContent = (
              <div className={`sts-pillar-card ${isPublished ? 'published' : 'locked'}`}>
                {/* Top laser streak on published hover */}
                {isPublished && (
                  <div className="sts-pillar-topline">
                    <b />
                  </div>
                )}

                {/* Subtle security hatch pattern for locked cards */}
                {!isPublished && <div className="sts-pillar-hatch" />}

                <div>
                  {/* Category & Status Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <span
                      style={{
                        fontFamily: 'var(--sts-font-mono, monospace)',
                        fontSize: '11px',
                        color: isPublished ? '#A3A3A3' : '#666666',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '4px',
                        padding: '2px 8px',
                        background: 'rgba(255, 255, 255, 0.025)'
                      }}
                    >
                      {item.topicBadge}
                    </span>

                    {!isPublished && (
                      <span className="sts-locked-badge">
                        <Lock size={10} />
                        <span>QUEUED</span>
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: 'var(--sts-font-display, sans-serif)',
                      fontSize: '17.5px',
                      fontWeight: 600,
                      color: isPublished ? '#FFFFFF' : 'rgba(255, 255, 255, 0.72)',
                      lineHeight: 1.32,
                      marginBottom: '10px',
                      letterSpacing: '-0.02em'
                    }}
                  >
                    {item.title}
                  </h3>

                  {/* Focus Question */}
                  <p
                    style={{
                      fontFamily: 'var(--sts-font-body, sans-serif)',
                      fontSize: '13.5px',
                      color: isPublished ? 'var(--sts-muted, #9CA3AF)' : 'rgba(255, 255, 255, 0.38)',
                      lineHeight: 1.55,
                      margin: 0
                    }}
                  >
                    {item.focusQuestion}
                  </p>
                </div>

                {/* Topic-Specific 3-Node Micro-Pipeline */}
                <div className="sts-micro-pipeline">
                  <div className="sts-micro-track">
                    {isPublished && <div className="sts-micro-track-fill" />}
                  </div>

                  <div className="sts-micro-nodes">
                    {item.microNodes.map((node, nIdx) => {
                      const NodeIcon = node.icon;
                      return (
                        <div key={nIdx} className="sts-micro-node">
                          <div className="sts-micro-node-dot">
                            <NodeIcon size={11} />
                          </div>
                          <span className="sts-micro-node-lbl">{node.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Status / CTA line */}
                <div
                  style={{
                    paddingTop: '12px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  {isPublished ? (
                    <span className="sts-pillar-cta">
                      <span>Read article</span>
                      <ArrowRight size={13} />
                    </span>
                  ) : (
                    <span
                      style={{
                        fontFamily: 'var(--sts-font-mono, monospace)',
                        fontSize: '11px',
                        color: 'rgba(255, 255, 255, 0.4)',
                        letterSpacing: '0.04em',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <Lock size={11} />
                      <span>In production queue</span>
                    </span>
                  )}
                </div>
              </div>
            );

            return isPublished ? (
              <Link
                key={item.slug}
                to={`/articles/${item.slug}`}
                style={{ textDecoration: 'none', color: 'inherit', display: 'flex' }}
                aria-label={`Read article: ${item.title}`}
              >
                {cardContent}
              </Link>
            ) : (
              <div key={item.slug} style={{ display: 'flex' }} aria-label={`${item.title} (In production queue)`}>
                {cardContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
