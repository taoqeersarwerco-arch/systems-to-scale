export interface TopicData {
  slug: string;
  name: string;
  badge: string;
  hook: string;
  pillarSlug: string;
  scopeParagraph: string;
  accent: 'brass' | 'steel';
  simType: 'pipeline' | 'auction' | 'render' | 'transaction' | 'tickets' | 'handoff' | 'deck' | 'calendar';
}

export const TOPICS: TopicData[] = [
  {
    slug: 'ai-automation',
    name: 'AI & Automation',
    badge: 'SYS-01',
    hook: 'How automation pipelines actually work',
    pillarSlug: 'automation-pipelines-explained',
    scopeParagraph: 'Automation pipelines are distributed state machines executing across untrusted networks. We dissect worker pools, idempotency keys, dead-letter queues, and how retry loops prevent cascade failures without flooding upstream APIs.',
    accent: 'brass',
    simType: 'pipeline'
  },
  {
    slug: 'marketing-ads',
    name: 'Marketing & Ads',
    badge: 'MKT-02',
    hook: 'How a real-time ad auction works',
    pillarSlug: 'how-ad-auctions-work',
    scopeParagraph: 'Real-time programmatic ad auctions settle within a strict 100ms budget between supply-side platforms, demand-side algorithms, and ad exchanges. We analyze Vickrey second-price auctions, Consent Mode v2, and server-side tracking pipelines.',
    accent: 'steel',
    simType: 'auction'
  },
  {
    slug: 'web-design',
    name: 'Web Design',
    badge: 'WEB-03',
    hook: 'How a browser renders a page',
    pillarSlug: 'how-browsers-render-pages',
    scopeParagraph: 'Modern web rendering bridges raw bytes to GPU rasterization. We break down the critical rendering path, layout thrashing, DOM and CSSOM compilation, and how Core Web Vitals (LCP, INP, CLS) map directly to rendering physics.',
    accent: 'steel',
    simType: 'render'
  },
  {
    slug: 'e-commerce',
    name: 'E-commerce',
    badge: 'ECM-04',
    hook: 'How an online checkout and payment flow works',
    pillarSlug: 'how-online-checkout-works',
    scopeParagraph: 'Online payments coordinate merchants, gateways, acquiring banks, card networks, and issuing banks. We dissect the separation of authorization and capture, PSD2 3-D Secure risk engines, and idempotent distributed state machines.',
    accent: 'brass',
    simType: 'transaction'
  },
  {
    slug: 'customer-service',
    name: 'Customer Service',
    badge: 'CRM-05',
    hook: 'How ticket routing works in support',
    pillarSlug: 'how-ticket-routing-works',
    scopeParagraph: 'Enterprise support helpdesks are real-time priority queues balancing contract SLAs, agent skill matrices, and load shedding. We explore escalation triggers, omnichannel identity reconciliation, and chatbot deflection boundaries.',
    accent: 'steel',
    simType: 'tickets'
  },
  {
    slug: 'virtual-assistance',
    name: 'Virtual Assistance',
    badge: 'OPS-06',
    hook: 'How task delegation works',
    pillarSlug: 'how-task-delegation-works',
    scopeParagraph: 'High-leverage delegation is an information transfer protocol. We examine context preservation across time zones, standard operating procedures as executable state machines, and graduated permission models for operations teams.',
    accent: 'brass',
    simType: 'handoff'
  },
  {
    slug: 'pitch-decks',
    name: 'Pitch Decks',
    badge: 'COM-07',
    hook: 'How a pitch deck communicates',
    pillarSlug: 'how-pitch-decks-work',
    scopeParagraph: 'Pitch decks are cognitive instruments engineered to survive 2-minute executive skim passes. We deconstruct narrative pacing, visual cognitive load, honest data visualization architectures, and vector-to-raster slide format fidelity.',
    accent: 'brass',
    simType: 'deck'
  },
  {
    slug: 'personal-assistance',
    name: 'Personal Assistance',
    badge: 'EXE-08',
    hook: 'How calendar scheduling and conflict resolution works',
    pillarSlug: 'how-calendar-scheduling-works',
    scopeParagraph: 'Executive scheduling is a multi-variable constraint satisfaction problem. We explore precedence weighting, cognitive rhythm allocation, automated conflict resolution protocols, and zero-inbox triage algorithms.',
    accent: 'steel',
    simType: 'calendar'
  }
];

export const TOPIC_MAP = TOPICS.reduce((acc, topic) => {
  acc[topic.slug] = topic;
  return acc;
}, {} as Record<string, TopicData>);
