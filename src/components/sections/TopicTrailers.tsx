import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Database,
  ShieldCheck,
  Cpu,
  Zap,
  CheckCircle2,
  Radio,
  Layers,
  TrendingUp,
  Scale,
  Eye,
  FileCode2,
  GitBranch,
  Layout,
  Maximize2,
  Sparkles,
  CreditCard,
  Activity,
  Lock,
  CheckCheck,
  Inbox,
  BrainCircuit,
  Bot,
  ClockAlert,
  Smile,
  ListTodo,
  FileCheck2,
  Globe,
  Users,
  Award,
  Compass,
  Flame,
  BarChart3,
  Target,
  Mail,
  Sliders,
  Calendar,
  ShieldAlert
} from 'lucide-react';
import { TopicCinematicCard, TopicCinematicData } from '../ui/TopicCinematicCard';

gsap.registerPlugin(ScrollTrigger);

const TOPIC_CINEMATIC_LIST: TopicCinematicData[] = [
  {
    slug: 'ai-automation',
    name: 'AI & Automation',
    hook: 'How automation pipelines execute, fault, retry, and recover without human intervention.',
    articlesCount: 5,
    readTime: '48 min read',
    statusStandby: 'STANDBY',
    statusActive: 'PIPELINE ACTIVE',
    nodes: [
      { label: 'Ingest', tooltip: 'Collect & validate webhook UUID', icon: Database },
      { label: 'Validate', tooltip: 'Payload schema & hash check', icon: ShieldCheck },
      { label: 'Lock', tooltip: 'Distributed worker mutex acquisition', icon: Cpu },
      { label: 'Execute', tooltip: 'Idempotent worker task dispatch', icon: Zap },
      { label: 'Commit', tooltip: 'WAL state settlement & release', icon: CheckCircle2 }
    ],
    metrics: [
      { label: 'Throughput', value: 12400, unit: 'req/s', barPct: 82 },
      { label: 'P99 Latency', value: 18, unit: 'ms', barPct: 38 },
      { label: 'Recovery', value: 99, formattedValue: '99.98', unit: '%', barPct: 98 }
    ]
  },
  {
    slug: 'marketing-ads',
    name: 'Marketing & Ads',
    hook: 'How ad auctions settle in milliseconds — bidding, attribution, and consent-mode tracking.',
    articlesCount: 5,
    readTime: '42 min read',
    statusStandby: 'STANDBY',
    statusActive: 'RTB ACTIVE',
    nodes: [
      { label: 'SSP Bid', tooltip: 'Sub-15ms ingress bid request', icon: Radio },
      { label: 'Enrich', tooltip: 'Consent & device graph lookup', icon: Layers },
      { label: 'Auction', tooltip: 'Real-time multi-DSP auction', icon: TrendingUp },
      { label: 'Vickrey', tooltip: 'Second-price clearing settlement', icon: Scale },
      { label: 'Render', tooltip: '60fps frame inject & telemetry', icon: Eye }
    ],
    metrics: [
      { label: 'Auction Time', value: 88, unit: 'ms', barPct: 44 },
      { label: 'Bid Volume', value: 42800, unit: '/s', barPct: 88 },
      { label: 'Clear Rate', value: 99, formattedValue: '99.4', unit: '%', barPct: 96 }
    ]
  },
  {
    slug: 'web-design',
    name: 'Web Design',
    hook: 'How a browser turns your HTML into pixels — the rendering path from parse to paint.',
    articlesCount: 5,
    readTime: '50 min read',
    statusStandby: 'STANDBY',
    statusActive: 'RENDER ACTIVE',
    nodes: [
      { label: 'Parse', tooltip: 'Byte stream tokenization & lexical parsing', icon: FileCode2 },
      { label: 'DOM Tree', tooltip: 'CSSOM & DOM tree graph compile', icon: GitBranch },
      { label: 'Layout', tooltip: 'Geometry & reflow bounding box', icon: Layout },
      { label: 'Composite', tooltip: 'GPU texture layering & stacking', icon: Maximize2 },
      { label: 'Paint', tooltip: '60 FPS display frame rasterization', icon: Sparkles }
    ],
    metrics: [
      { label: 'First Paint', value: 240, unit: 'ms', barPct: 40 },
      { label: 'Frame Budget', value: 16, formattedValue: '16.6', unit: 'ms', barPct: 28 },
      { label: 'Layout Shift', value: 0, formattedValue: '0.00', unit: 'CLS', barPct: 10 }
    ]
  },
  {
    slug: 'e-commerce',
    name: 'E-commerce',
    hook: 'How a checkout processes a payment — authorization, capture, 3-D Secure, and cart recovery.',
    articlesCount: 5,
    readTime: '45 min read',
    statusStandby: 'STANDBY',
    statusActive: 'SETTLE ACTIVE',
    nodes: [
      { label: 'Tokenize', tooltip: 'Zero-knowledge card tokenization', icon: CreditCard },
      { label: '3DS Vault', tooltip: 'Biometric cryptographic vault check', icon: ShieldCheck },
      { label: 'Risk Score', tooltip: 'ML anomaly & velocity filter', icon: Activity },
      { label: 'Auth Hold', tooltip: 'Issuing bank capital reservation', icon: Lock },
      { label: 'Capture', tooltip: 'Two-phase asynchronous settlement', icon: CheckCheck }
    ],
    metrics: [
      { label: 'Auth Time', value: 1, formattedValue: '1.2', unit: 's', barPct: 45 },
      { label: 'Fraud Catch', value: 99, formattedValue: '99.7', unit: '%', barPct: 99 },
      { label: 'Deflection', value: 84, formattedValue: '84.2', unit: '%', barPct: 84 }
    ]
  },
  {
    slug: 'customer-service',
    name: 'Customer Service',
    hook: 'How support tickets route through queues, escalate by SLA, and get deflected by bots.',
    articlesCount: 5,
    readTime: '38 min read',
    statusStandby: 'STANDBY',
    statusActive: 'DISPATCH ACTIVE',
    nodes: [
      { label: 'Ticket', tooltip: 'Omnichannel stream intake & triage', icon: Inbox },
      { label: 'NLP Intent', tooltip: 'Vector intent & sentiment scoring', icon: BrainCircuit },
      { label: 'Deflect', tooltip: 'Self-service deflection boundary', icon: Bot },
      { label: 'SLA Route', tooltip: 'Tier-2 priority escalation dispatch', icon: ClockAlert },
      { label: 'Resolve', tooltip: 'Verified customer satisfaction closure', icon: Smile }
    ],
    metrics: [
      { label: 'Deflection', value: 74, formattedValue: '74.2', unit: '%', barPct: 74 },
      { label: 'First Touch', value: 42, unit: 's', barPct: 35 },
      { label: 'CSAT Index', value: 96, formattedValue: '96.8', unit: '%', barPct: 96 }
    ]
  },
  {
    slug: 'virtual-assistance',
    name: 'Virtual Assistance',
    hook: 'How tasks hand off cleanly between people across time zones without losing context.',
    articlesCount: 5,
    readTime: '40 min read',
    statusStandby: 'STANDBY',
    statusActive: 'ORBIT ACTIVE',
    nodes: [
      { label: 'Queue', tooltip: 'Asynchronous task intake buffer', icon: ListTodo },
      { label: 'SOP Match', tooltip: 'Standard operating procedure match', icon: FileCheck2 },
      { label: 'Timezone', tooltip: 'Follow-the-sun timezone orbit', icon: Globe },
      { label: 'Delegate', tooltip: 'Human-in-the-loop task dispatch', icon: Users },
      { label: 'QA Verify', tooltip: 'Rubric verification against spec', icon: Award }
    ],
    metrics: [
      { label: 'Turnaround', value: 3, formattedValue: '3.4', unit: 'hrs', barPct: 40 },
      { label: 'SOP Match', value: 99, formattedValue: '99.2', unit: '%', barPct: 98 },
      { label: 'Context Loss', value: 0, formattedValue: '0.0', unit: '%', barPct: 5 }
    ]
  },
  {
    slug: 'pitch-decks',
    name: 'Pitch Decks',
    hook: "How a deck's narrative structure persuades — and why format conversion destroys fidelity.",
    articlesCount: 5,
    readTime: '35 min read',
    statusStandby: 'STANDBY',
    statusActive: 'CONVICTION ACTIVE',
    nodes: [
      { label: 'Status Quo', tooltip: '0:00 - Establish anchor reality', icon: Compass },
      { label: 'Paradox', tooltip: '0:30 - The structural market paradox', icon: Flame },
      { label: 'Mechanism', tooltip: '1:00 - Proprietary unfair advantage', icon: Cpu },
      { label: 'Proof', tooltip: '1:30 - Unassailable unit economics', icon: BarChart3 },
      { label: 'Conviction', tooltip: '2:00 - Irreversible investment close', icon: Target }
    ],
    metrics: [
      { label: 'Retention', value: 88, formattedValue: '88.5', unit: '%', barPct: 88 },
      { label: 'Slide Pacing', value: 24, unit: 's/slide', barPct: 42 },
      { label: 'Conviction', value: 9, formattedValue: '9.4', unit: '/10', barPct: 94 }
    ]
  },
  {
    slug: 'personal-assistance',
    name: 'Personal Assistance',
    hook: 'How calendar scheduling resolves conflicts and how email triage reaches inbox zero.',
    articlesCount: 5,
    readTime: '36 min read',
    statusStandby: 'STANDBY',
    statusActive: 'SOLVER ACTIVE',
    nodes: [
      { label: 'Intake', tooltip: 'Calendar & inbox stream polling', icon: Mail },
      { label: 'Triage', tooltip: 'Executive cognitive load filter', icon: Sliders },
      { label: 'Arbiter', tooltip: 'Constraint-solver conflict resolver', icon: Calendar },
      { label: 'Freeze', tooltip: 'Protected deep work calendar lock', icon: ShieldAlert },
      { label: 'Zero State', tooltip: 'Zero cognitive residue handoff', icon: CheckCheck }
    ],
    metrics: [
      { label: 'Focus Saved', value: 4, formattedValue: '4.5', unit: 'hrs/day', barPct: 75 },
      { label: 'Conflicts', value: 100, formattedValue: '100', unit: '% res', barPct: 100 },
      { label: 'Zero Inbox', value: 100, formattedValue: 'Daily', unit: 'streak', barPct: 95 }
    ]
  }
];

export const TopicTrailers: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeTopicSlug, setActiveTopicSlug] = useState<string | null>(null);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced || !gridRef.current || !sectionRef.current) return;

    // Use gsap.context for clean React lifecycle garbage collection
    const ctx = gsap.context(() => {
      const cards = gridRef.current?.children;
      if (!cards) return;

      gsap.fromTo(
        cards,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.07,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 82%'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="topics"
      ref={sectionRef}
      className="sts-section"
      style={{
        position: 'relative',
        zIndex: 10,
        backgroundColor: 'var(--sts-ground, #0E1112)',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        paddingTop: '80px',
        paddingBottom: '80px',
        scrollMarginTop: '80px'
      }}
    >
      <div className="sts-container" style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 24px' }}>
        {/* Section Header: Clean & Cinematic */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 56px auto' }}>
          <div className="sts-eyebrow" style={{ marginBottom: '12px', justifyContent: 'center' }}>
            <span>CORE DISCIPLINES</span>
          </div>

          <h2
            style={{
              fontFamily: 'var(--sts-font-display, sans-serif)',
              fontSize: 'clamp(32px, 4.5vw, 46px)',
              fontWeight: 600,
              letterSpacing: '-0.035em',
              lineHeight: 1.12,
              marginBottom: '14px',
              background: 'linear-gradient(180deg, #FFFFFF 0%, #A8A8A8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            What we cover.
          </h2>

          <p
            style={{
              fontFamily: 'var(--sts-font-body, sans-serif)',
              fontSize: '15.5px',
              color: 'var(--sts-muted, #9CA3AF)',
              lineHeight: 1.6
            }}
          >
            Eight engineering disciplines deconstructed down to their physical execution mechanisms.
          </p>
        </div>

        {/* 2-Column Responsive Blueprint Grid */}
        <div
          ref={gridRef}
          onMouseLeave={() => setActiveTopicSlug(null)}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '24px',
            maxWidth: '1140px',
            margin: '0 auto'
          }}
          className="sts-topics-grid"
        >
          {TOPIC_CINEMATIC_LIST.map((topicData) => (
            <TopicCinematicCard
              key={topicData.slug}
              data={topicData}
              isRevealed={activeTopicSlug === topicData.slug}
              onActivate={() => setActiveTopicSlug(topicData.slug)}
              onDeactivate={() => {
                setActiveTopicSlug((current) => (current === topicData.slug ? null : current));
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .sts-topics-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
