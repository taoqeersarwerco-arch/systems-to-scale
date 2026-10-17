export interface TopicData {
  slug: string;
  name: string;
  badge: string;
  hook: string;
  pillarSlug: string;
  scopeParagraph: string;
  mechanismPills: string[];
  articleCount: number;
  verifiedFact?: string;
  accent: 'brass' | 'steel';
  simType: 'pipeline' | 'auction' | 'render' | 'transaction' | 'tickets' | 'handoff' | 'deck' | 'calendar';
}

export const TOPICS: TopicData[] = [
  {
    slug: 'ai-automation',
    name: 'AI & Automation',
    badge: 'SYS-01',
    hook: 'How automation pipelines execute, fault, retry, and recover without human intervention.',
    pillarSlug: 'automation-pipelines-explained',
    scopeParagraph: 'Automation pipelines are distributed state machines executing across untrusted networks. We dissect worker pools, idempotency keys, dead-letter queues, and how retry loops prevent cascade failures without flooding upstream APIs.',
    mechanismPills: ['Pipelines', 'Retry & backoff', 'Idempotency', 'Webhooks', 'Dead-letter queues'],
    articleCount: 0,
    verifiedFact: 'McKinsey estimates AI and automation can handle 60–70% of current work activities across business functions, yet the median enterprise deflection rate sits at just 41.2% — the gap is the mechanism.',
    accent: 'brass',
    simType: 'pipeline'
  },
  {
    slug: 'marketing-ads',
    name: 'Marketing & Ads',
    badge: 'MKT-02',
    hook: 'How ad auctions settle in milliseconds — bidding, attribution, and consent-mode tracking.',
    pillarSlug: 'how-ad-auctions-work',
    scopeParagraph: 'Real-time programmatic ad auctions settle within a strict 80–120ms budget between supply-side platforms, demand-side algorithms, and ad exchanges. We analyse first-price clearing mechanics, Consent Mode v2, and server-side tracking pipelines.',
    mechanismPills: ['RTB auctions', 'Programmatic', 'Attribution', 'Consent Mode', 'Server-side tracking'],
    articleCount: 0,
    verifiedFact: "The OpenRTB spec's tmax field sets the exchange timeout per auction — Google's Authorized Buyers dynamically specifies deadlines typically between 80ms and 1,000ms (standard display auctions resolve around 80–120ms).",
    accent: 'steel',
    simType: 'auction'
  },
  {
    slug: 'web-design',
    name: 'Web Design',
    badge: 'WEB-03',
    hook: 'How a browser turns your HTML into pixels — the rendering path from parse to paint.',
    pillarSlug: 'how-browsers-render-pages',
    scopeParagraph: 'Modern web rendering bridges raw bytes to GPU rasterisation. We break down the critical rendering path, layout thrashing, DOM and CSSOM compilation, and how Core Web Vitals (LCP, INP, CLS) map directly to rendering physics.',
    mechanismPills: ['Rendering path', 'Core Web Vitals', 'Layout & paint', 'Responsive', 'Accessibility'],
    articleCount: 0,
    verifiedFact: '2026 CWV thresholds remain LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 at the 75th percentile. As of January 2026, 55.7% of web origins globally pass all three. INP replaced FID in March 2024.',
    accent: 'steel',
    simType: 'render'
  },
  {
    slug: 'e-commerce',
    name: 'E-commerce',
    badge: 'ECM-04',
    hook: 'How a checkout processes a payment — authorization, capture, 3-D Secure, and cart recovery.',
    pillarSlug: 'how-online-checkout-works',
    scopeParagraph: 'Online payments coordinate merchants, gateways, acquiring banks, card networks, and issuers in a single transaction. We trace authorization holds, 3-D Secure challenges, idempotent capture, and why carts abandon at the payment step.',
    mechanismPills: ['Checkout flow', 'Auth & capture', '3-D Secure', 'Idempotency', 'Cart abandonment'],
    articleCount: 0,
    verifiedFact: 'Standard card authorization holds last 5–7 days for Visa and 7 days for Mastercard on online payments. Extended pre-authorization can stretch to 30 days but incurs higher scheme fees.',
    accent: 'brass',
    simType: 'transaction'
  },
  {
    slug: 'customer-service',
    name: 'Customer Service',
    badge: 'CRM-05',
    hook: 'How support tickets route through queues, escalate by SLA, and get deflected by bots.',
    pillarSlug: 'how-ticket-routing-works',
    scopeParagraph: 'Enterprise support helpdesks are real-time priority queues balancing contract SLAs, agent skill routing, and escalation paths. We examine omnichannel thread merging, chatbot deflection mechanics, and why the median AI deflection rate is lower than vendors claim.',
    mechanismPills: ['Ticket routing', 'SLA queues', 'Escalation', 'Omnichannel', 'Chatbot deflection'],
    articleCount: 0,
    verifiedFact: 'The median AI chatbot deflection rate sits at 41.2% in 2026, with true self-service resolution at only 14%. The gap between headline deflection and genuine resolution is the mechanism most teams misunderstand.',
    accent: 'steel',
    simType: 'tickets'
  },
  {
    slug: 'virtual-assistance',
    name: 'Virtual Assistance',
    badge: 'OPS-06',
    hook: 'How tasks hand off cleanly between people across time zones without losing context.',
    pillarSlug: 'how-task-delegation-works',
    scopeParagraph: 'High-leverage delegation is an information transfer protocol. We examine context packaging, SOP design, async handoff patterns across time zones, and the onboarding sequence that determines whether a VA relationship compounds or collapses.',
    mechanismPills: ['Task delegation', 'SOPs', 'Async handoff', 'Onboarding', 'Context transfer'],
    articleCount: 0,
    accent: 'brass',
    simType: 'handoff'
  },
  {
    slug: 'pitch-decks',
    name: 'Pitch Decks',
    badge: 'COM-07',
    hook: "How a deck's narrative structure persuades — and why format conversion destroys fidelity.",
    pillarSlug: 'how-pitch-decks-work',
    scopeParagraph: 'A pitch deck is a structured persuasion machine. We dissect the 10-slide narrative arc, how format conversion between PowerPoint, PDF, and Slides loses fidelity, data visualisation that survives projection, and the structural differences between investor and sales decks.',
    mechanismPills: ['Narrative structure', 'Slide framework', 'Data viz', 'Format conversion', 'Investor vs sales'],
    articleCount: 0,
    accent: 'brass',
    simType: 'deck'
  },
  {
    slug: 'personal-assistance',
    name: 'Personal Assistance',
    badge: 'EXE-08',
    hook: 'How calendar scheduling resolves conflicts and how email triage reaches inbox zero.',
    pillarSlug: 'how-calendar-scheduling-works',
    scopeParagraph: 'Calendar scheduling is a constraint-satisfaction problem. We trace conflict resolution algorithms, email triage workflows, task prioritisation frameworks, and the coordination mechanics of multi-leg travel planning.',
    mechanismPills: ['Scheduling', 'Conflict resolution', 'Email triage', 'Travel coordination', 'Prioritisation'],
    articleCount: 0,
    accent: 'steel',
    simType: 'calendar'
  }
];

export const TOPIC_MAP = TOPICS.reduce((acc, topic) => {
  acc[topic.slug] = topic;
  return acc;
}, {} as Record<string, TopicData>);
