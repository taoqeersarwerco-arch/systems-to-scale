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
import { TopicCinematicData } from '../components/ui/TopicCinematicCard';

export const TOPIC_CINEMATIC_LIST: TopicCinematicData[] = [
  {
    slug: 'ai-automation',
    name: 'AI & Automation',
    badge: 'SYS-01',
    hook: 'How automation pipelines execute, fault, retry, and recover without human intervention.',
    scopeParagraph: 'Automation pipelines are distributed state machines executing across untrusted networks. We dissect worker pools, idempotency keys, dead-letter queues, and how retry loops prevent cascade failures without flooding upstream APIs.',
    verifiedFact: 'McKinsey estimates AI and automation can handle 60–70% of current work activities across business functions, yet the median enterprise deflection rate sits at just 41.2% — the gap is the mechanism.',
    mechanismPills: ['Pipelines', 'Retry & backoff', 'Idempotency', 'Webhooks', 'Dead-letter queues'],
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
    badge: 'MKT-02',
    hook: 'How ad auctions settle in milliseconds — bidding, attribution, and consent-mode tracking.',
    scopeParagraph: 'Real-time programmatic ad auctions settle within a strict 80–120ms budget between supply-side platforms, demand-side algorithms, and ad exchanges. We analyse Vickrey second-price auctions, Consent Mode v2, and server-side tracking pipelines.',
    verifiedFact: "The OpenRTB spec's tmax field defines the exchange timeout per-auction. Google's Authorized Buyers imposes 100ms. DSP bid calculation alone consumes roughly 50ms of that budget.",
    mechanismPills: ['RTB auctions', 'Programmatic', 'Attribution', 'Consent Mode', 'Server-side tracking'],
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
    badge: 'WEB-03',
    hook: 'How a browser turns your HTML into pixels — the rendering path from parse to paint.',
    scopeParagraph: 'Modern web rendering bridges raw bytes to GPU rasterisation. We break down the critical rendering path, layout thrashing, DOM and CSSOM compilation, and how Core Web Vitals (LCP, INP, CLS) map directly to rendering physics.',
    verifiedFact: '2026 CWV thresholds remain LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 at the 75th percentile. As of January 2026, 55.7% of web origins globally pass all three. INP replaced FID in March 2024.',
    mechanismPills: ['Rendering path', 'Core Web Vitals', 'Layout & paint', 'Responsive', 'Accessibility'],
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
    badge: 'ECM-04',
    hook: 'How a checkout processes a payment — authorization, capture, 3-D Secure, and cart recovery.',
    scopeParagraph: 'Online payments coordinate merchants, gateways, acquiring banks, card networks, and issuers in a single transaction. We trace authorization holds, 3-D Secure challenges, idempotent capture, and why carts abandon at the payment step.',
    verifiedFact: 'Standard card authorization holds last 5–7 days for Visa and 7 days for Mastercard on online payments. Extended pre-authorization can stretch to 30 days but incurs higher scheme fees.',
    mechanismPills: ['Checkout flow', 'Auth & capture', '3-D Secure', 'Idempotency', 'Cart abandonment'],
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
    badge: 'CRM-05',
    hook: 'How support tickets route through queues, escalate by SLA, and get deflected by bots.',
    scopeParagraph: 'Enterprise support helpdesks are real-time priority queues balancing contract SLAs, agent skill routing, and escalation paths. We examine omnichannel thread merging, chatbot deflection mechanics, and why the median AI deflection rate is lower than vendors claim.',
    verifiedFact: 'The median AI chatbot deflection rate sits at 41.2% in 2026, with true self-service resolution at only 14%. The gap between headline deflection and genuine resolution is the mechanism most teams misunderstand.',
    mechanismPills: ['Ticket routing', 'SLA queues', 'Escalation', 'Omnichannel', 'Chatbot deflection'],
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
    badge: 'OPS-06',
    hook: 'How tasks hand off cleanly between people across time zones without losing context.',
    scopeParagraph: 'High-leverage delegation is an information transfer protocol. We examine context packaging, SOP design, async handoff patterns across time zones, and the onboarding sequence that determines whether a VA relationship compounds or collapses.',
    verifiedFact: 'Task failure in distributed teams is 82% attributable to missing input schemas rather than agent incompetence. Explicit handoff contracts eliminate cognitive context loss.',
    mechanismPills: ['Task delegation', 'SOPs', 'Async handoff', 'Onboarding', 'Context transfer'],
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
    badge: 'COM-07',
    hook: "How a deck's narrative structure persuades — and why format conversion destroys fidelity.",
    scopeParagraph: 'A pitch deck is a structured persuasion machine. We dissect the 10-slide narrative arc, how format conversion between PowerPoint, PDF, and Slides loses fidelity, data visualisation that survives projection, and the structural differences between investor and sales decks.',
    verifiedFact: 'Format conversion between PowerPoint, PDF, and Google Slides alters typography metrics and aspect ratios in 94% of exported slide decks, breaking visual hierarchies.',
    mechanismPills: ['Narrative structure', 'Slide framework', 'Data viz', 'Format conversion', 'Investor vs sales'],
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
    badge: 'SEC-08',
    hook: 'How calendar scheduling resolves conflicts and how email triage reaches inbox zero.',
    scopeParagraph: 'Executive assistance operates as an asynchronous constraint solver. We analyse calendar collision matrices, timezone arbitration, priority heuristics, and the deterministic triage filters that keep cognitive overhead at absolute zero.',
    verifiedFact: 'Context switching costs an average of 23 minutes and 15 seconds to return to deep focus. Constraint-based calendar freezing saves an average of 4.5 focus hours per executive daily.',
    mechanismPills: ['Calendar triage', 'Constraint solver', 'Timezone sync', 'Inbox zero', 'Deep work freeze'],
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
