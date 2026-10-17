export type ArticleStatus = 'published' | 'planned';
export type ArticleType = 'Pillar' | 'Cluster';

export interface ArticleEntry {
  slug: string;
  title: string;
  topic: string;
  topicSlug: string;
  type: ArticleType;
  focusKeyword: string;
  status: ArticleStatus;
  standfirst: string;
  focusQuestion: string;
  publishDate?: string;
  ghostLinks: string[];
  readingTime?: string;
  beginnerStandfirst?: string;
}

export const SLUG_REGISTRY: Record<string, ArticleEntry> = {
  // --------------------------------------------------------------------------
  // AI & Automation (5 articles)
  // --------------------------------------------------------------------------
  'automation-pipelines-explained': {
    slug: 'automation-pipelines-explained',
    title: 'How automation pipelines actually work',
    topic: 'AI & Automation',
    topicSlug: 'ai-automation',
    type: 'Pillar',
    focusKeyword: 'automation pipeline',
    status: 'published',
    standfirst: 'The mechanical architecture of modern execution runners: DAG resolution, worker pools, and fault isolation.',
    beginnerStandfirst: 'How automated workflows trigger, execute tasks in exact sequence, handle sudden errors, and never lose your data.',
    focusQuestion: 'What happens inside an automation runner between the trigger firing and the final step completing?',
    publishDate: 'Oct 12, 2026',
    readingTime: '9 min read',
    ghostLinks: ['retry-and-backoff', 'idempotency-keys', 'webhooks-vs-polling', 'dead-letter-queues', 'how-ticket-routing-works', 'how-online-checkout-works']
  },
  'retry-and-backoff': {
    slug: 'retry-and-backoff',
    title: 'Retry and backoff: why automations wait',
    topic: 'AI & Automation',
    topicSlug: 'ai-automation',
    type: 'Cluster',
    focusKeyword: 'exponential backoff',
    status: 'published',
    standfirst: 'Why immediate retries cause thundering herds, and the math behind exponential backoff with full jitter.',
    beginnerStandfirst: 'Why retrying failed actions instantly crashes servers, and the smart delay algorithm that keeps automations running.',
    focusQuestion: 'Why does retrying immediately after an API failure make the outage worse?',
    publishDate: 'Oct 14, 2026',
    readingTime: '6 min read',
    ghostLinks: ['automation-pipelines-explained', 'idempotency-keys', 'dead-letter-queues']
  },
  'idempotency-keys': {
    slug: 'idempotency-keys',
    title: 'Idempotency keys: stopping double runs',
    topic: 'AI & Automation',
    topicSlug: 'ai-automation',
    type: 'Cluster',
    focusKeyword: 'idempotency key',
    status: 'planned',
    standfirst: 'Guaranteeing exactly-once execution semantics over at-least-once distributed networks.',
    beginnerStandfirst: 'How apps ensure clicking "Submit" or "Pay" multiple times on a slow connection will only ever process once.',
    focusQuestion: 'How does a payment API know not to charge a credit card twice when the network drops?',
    readingTime: '7 min read',
    ghostLinks: ['automation-pipelines-explained', 'retry-and-backoff', 'webhooks-vs-polling']
  },
  'webhooks-vs-polling': {
    slug: 'webhooks-vs-polling',
    title: 'Webhooks vs polling: how automations trigger',
    topic: 'AI & Automation',
    topicSlug: 'ai-automation',
    type: 'Cluster',
    focusKeyword: 'webhooks vs polling',
    status: 'planned',
    standfirst: 'The trade-off between real-time push events and fault-tolerant pull state synchronization.',
    beginnerStandfirst: 'How apps talk to each other in real-time: instantaneous push alerts vs constant scheduled checking.',
    focusQuestion: 'When is a polling loop actually more reliable than a webhook endpoint?',
    readingTime: '6 min read',
    ghostLinks: ['automation-pipelines-explained', 'idempotency-keys']
  },
  'dead-letter-queues': {
    slug: 'dead-letter-queues',
    title: 'Dead-letter queues and error handling',
    topic: 'AI & Automation',
    topicSlug: 'ai-automation',
    type: 'Cluster',
    focusKeyword: 'dead-letter queue',
    status: 'planned',
    standfirst: 'Quarantining poison-pill payloads without halting high-throughput pipeline execution.',
    beginnerStandfirst: 'What happens when bad data crashes a task: how systems isolate broken records without stopping the entire business.',
    focusQuestion: 'Where do failed automation payloads go when all retries are exhausted?',
    readingTime: '8 min read',
    ghostLinks: ['automation-pipelines-explained', 'retry-and-backoff']
  },

  // --------------------------------------------------------------------------
  // Marketing & Ads (5 articles)
  // --------------------------------------------------------------------------
  'how-ad-auctions-work': {
    slug: 'how-ad-auctions-work',
    title: 'How a real-time ad auction works',
    topic: 'Marketing & Ads',
    topicSlug: 'marketing-ads',
    type: 'Pillar',
    focusKeyword: 'real-time ad auction',
    status: 'published',
    standfirst: 'Inside the 100-millisecond window where DSPs, SSPs, and ad exchanges settle ad impressions.',
    beginnerStandfirst: 'Inside the split-second 100-millisecond window where advertisers automatically bid and display ads as a page loads.',
    focusQuestion: 'How does an ad server evaluate bids, calculate quality score, and render a banner in under 100ms?',
    publishDate: 'Oct 15, 2026',
    readingTime: '10 min read',
    ghostLinks: ['real-time-bidding-explained', 'attribution-models', 'consent-mode-conversion-tracking', 'server-side-tracking', 'how-online-checkout-works', 'how-browsers-render-pages']
  },
  'real-time-bidding-explained': {
    slug: 'real-time-bidding-explained',
    title: 'Real-time bidding and programmatic',
    topic: 'Marketing & Ads',
    topicSlug: 'marketing-ads',
    type: 'Cluster',
    focusKeyword: 'real-time bidding',
    status: 'planned',
    standfirst: 'The OpenRTB protocol: bid requests, floor pricing, and Vickrey second-price auction mechanics.',
    focusQuestion: 'Why do you pay 1 cent more than the second-highest bid rather than your max bid?',
    ghostLinks: ['how-ad-auctions-work', 'attribution-models']
  },
  'attribution-models': {
    slug: 'attribution-models',
    title: 'Attribution models: how conversions get credited',
    topic: 'Marketing & Ads',
    topicSlug: 'marketing-ads',
    type: 'Cluster',
    focusKeyword: 'attribution models',
    status: 'planned',
    standfirst: 'Comparing first-touch, last-touch, linear, and Shapley value algorithmic attribution.',
    focusQuestion: 'Which touchpoint actually caused the purchase when a user clicks five different ads?',
    ghostLinks: ['how-ad-auctions-work', 'consent-mode-conversion-tracking', 'server-side-tracking']
  },
  'consent-mode-conversion-tracking': {
    slug: 'consent-mode-conversion-tracking',
    title: 'Consent Mode v2 and conversion tracking',
    topic: 'Marketing & Ads',
    topicSlug: 'marketing-ads',
    type: 'Cluster',
    focusKeyword: 'Consent Mode v2',
    status: 'planned',
    standfirst: 'Cookieless behavioral pings and probabilistic conversion modeling under European privacy regulations.',
    focusQuestion: 'How does Google Analytics measure conversions when a visitor declines cookie consent?',
    ghostLinks: ['how-ad-auctions-work', 'server-side-tracking', 'how-browsers-render-pages']
  },
  'server-side-tracking': {
    slug: 'server-side-tracking',
    title: 'Server-side tracking: recovering lost conversions',
    topic: 'Marketing & Ads',
    topicSlug: 'marketing-ads',
    type: 'Cluster',
    focusKeyword: 'server-side tracking',
    status: 'planned',
    standfirst: 'Bypassing ad-blockers and browser ITP restrictions using first-party reverse proxy collectors.',
    focusQuestion: 'Why are client-side tracking pixels losing 30% of purchase data?',
    ghostLinks: ['how-ad-auctions-work', 'consent-mode-conversion-tracking']
  },

  // --------------------------------------------------------------------------
  // Web Design (5 articles)
  // --------------------------------------------------------------------------
  'how-browsers-render-pages': {
    slug: 'how-browsers-render-pages',
    title: 'How a browser renders a page',
    topic: 'Web Design',
    topicSlug: 'web-design',
    type: 'Pillar',
    focusKeyword: 'browser rendering',
    status: 'published',
    standfirst: 'From raw HTML bytes through tokenization, DOM/CSSOM tree construction, layout, paint, and GPU compositing.',
    beginnerStandfirst: 'The step-by-step journey of how a browser turns raw text and code into a fast, fluid visual page.',
    focusQuestion: 'What exact steps transform a raw string of HTML and CSS into pixels on a screen?',
    publishDate: 'Oct 10, 2026',
    readingTime: '11 min read',
    ghostLinks: ['core-web-vitals-explained', 'critical-rendering-path', 'responsive-layout-explained', 'web-accessibility-wcag', 'how-online-checkout-works', 'how-ad-auctions-work']
  },
  'core-web-vitals-explained': {
    slug: 'core-web-vitals-explained',
    title: 'Core Web Vitals: LCP, INP, CLS',
    topic: 'Web Design',
    topicSlug: 'web-design',
    type: 'Cluster',
    focusKeyword: 'Core Web Vitals',
    status: 'planned',
    standfirst: 'The physics of Largest Contentful Paint, Interaction to Next Paint, and Cumulative Layout Shift.',
    focusQuestion: 'Why does layout thrashing cause your INP metric to spike into the red?',
    ghostLinks: ['how-browsers-render-pages', 'critical-rendering-path']
  },
  'critical-rendering-path': {
    slug: 'critical-rendering-path',
    title: 'The critical rendering path',
    topic: 'Web Design',
    topicSlug: 'web-design',
    type: 'Cluster',
    focusKeyword: 'critical rendering path',
    status: 'planned',
    standfirst: 'Eliminating render-blocking CSS and parser-blocking JavaScript to achieve sub-second FCP.',
    focusQuestion: 'How does an unoptimized script tag in the HTML head halt page parsing entirely?',
    ghostLinks: ['how-browsers-render-pages', 'core-web-vitals-explained']
  },
  'responsive-layout-explained': {
    slug: 'responsive-layout-explained',
    title: 'Responsive layout: adapting to any screen',
    topic: 'Web Design',
    topicSlug: 'web-design',
    type: 'Cluster',
    focusKeyword: 'responsive layout',
    status: 'planned',
    standfirst: 'Fluid grids, intrinsic design with CSS clamp(), container queries, and subgrid mechanics.',
    focusQuestion: 'Why are container queries replacing traditional viewport media queries in design systems?',
    ghostLinks: ['how-browsers-render-pages', 'core-web-vitals-explained']
  },
  'web-accessibility-wcag': {
    slug: 'web-accessibility-wcag',
    title: 'Web accessibility (WCAG)',
    topic: 'Web Design',
    topicSlug: 'web-design',
    type: 'Cluster',
    focusKeyword: 'web accessibility',
    status: 'planned',
    standfirst: 'The accessibility tree, ARIA live regions, focus management, and WCAG 2.2 AA compliance standards.',
    focusQuestion: 'How does a screen reader interpret a custom modal dialog that lacks focus trapping?',
    ghostLinks: ['how-browsers-render-pages', 'responsive-layout-explained']
  },

  // --------------------------------------------------------------------------
  // E-commerce (5 articles)
  // --------------------------------------------------------------------------
  'how-online-checkout-works': {
    slug: 'how-online-checkout-works',
    title: 'How an online checkout and payment flow works',
    topic: 'E-commerce',
    topicSlug: 'e-commerce',
    type: 'Pillar',
    focusKeyword: 'online checkout flow',
    status: 'published',
    standfirst: 'The multi-party transaction dance between merchant, payment gateway, acquiring bank, card network, and issuing bank.',
    beginnerStandfirst: 'What happens in the seconds between clicking "Pay Now" and the confirmation screen: cards, banks, fraud checks, and money movement.',
    focusQuestion: 'What journey does your credit card number take between clicking Pay and receiving a confirmation receipt?',
    publishDate: 'Oct 08, 2026',
    readingTime: '9 min read',
    ghostLinks: ['authorization-vs-capture', '3d-secure-sca', 'payment-idempotency', 'cart-abandonment', 'how-ad-auctions-work', 'automation-pipelines-explained']
  },
  'authorization-vs-capture': {
    slug: 'authorization-vs-capture',
    title: 'Authorization vs capture: how payments settle',
    topic: 'E-commerce',
    topicSlug: 'e-commerce',
    type: 'Cluster',
    focusKeyword: 'authorization and capture',
    status: 'planned',
    standfirst: 'Why authorizing a credit card hold is separated from capturing funds upon order fulfillment.',
    focusQuestion: 'Why does an online store hold funds when you order, but only charges when the item ships?',
    ghostLinks: ['how-online-checkout-works', 'payment-idempotency', '3d-secure-sca']
  },
  '3d-secure-sca': {
    slug: '3d-secure-sca',
    title: '3-D Secure and SCA: payment verification',
    topic: 'E-commerce',
    topicSlug: 'e-commerce',
    type: 'Cluster',
    focusKeyword: '3-D Secure',
    status: 'planned',
    standfirst: 'Risk-based biometric challenges, frictionless flow exemptions, and the PSD2 Strong Customer Authentication mandate.',
    focusQuestion: 'How does an issuing bank decide whether to trigger a one-time passcode verification or let the payment pass friction-free?',
    ghostLinks: ['how-online-checkout-works', 'authorization-vs-capture']
  },
  'payment-idempotency': {
    slug: 'payment-idempotency',
    title: 'Idempotency in payments: preventing double charges',
    topic: 'E-commerce',
    topicSlug: 'e-commerce',
    type: 'Cluster',
    focusKeyword: 'payment idempotency',
    status: 'planned',
    standfirst: 'Distributed locking, UUID transaction headers, and database duplicate protection in payment gateways.',
    focusQuestion: 'What stops a customer from being charged twice if they rapidly double-click the Place Order button?',
    ghostLinks: ['how-online-checkout-works', 'authorization-vs-capture', 'idempotency-keys']
  },
  'cart-abandonment': {
    slug: 'cart-abandonment',
    title: 'Cart abandonment: why checkouts fail',
    topic: 'E-commerce',
    topicSlug: 'e-commerce',
    type: 'Cluster',
    focusKeyword: 'cart abandonment',
    status: 'planned',
    standfirst: 'Analyzing technical friction: field validation race conditions, slow gateway latency, and unexpected fee disclosure.',
    focusQuestion: 'Where do checkouts mechanically break down and trigger session abandonment?',
    ghostLinks: ['how-online-checkout-works', '3d-secure-sca']
  },

  // --------------------------------------------------------------------------
  // Customer Service (5 articles)
  // --------------------------------------------------------------------------
  'how-ticket-routing-works': {
    slug: 'how-ticket-routing-works',
    title: 'How ticket routing works in support',
    topic: 'Customer Service',
    topicSlug: 'customer-service',
    type: 'Pillar',
    focusKeyword: 'ticket routing',
    status: 'planned',
    standfirst: 'Priority queues, skill-based assignment algorithms, round-robin distribution, and SLA breach monitors.',
    focusQuestion: 'How does an enterprise helpdesk decide which agent receives a VIP ticket when 500 tickets arrive in 5 minutes?',
    ghostLinks: ['support-queues-slas', 'ticket-escalation', 'omnichannel-support', 'chatbot-deflection', 'automation-pipelines-explained', 'how-task-delegation-works']
  },
  'support-queues-slas': {
    slug: 'support-queues-slas',
    title: 'Queues and SLAs: how support prioritises',
    topic: 'Customer Service',
    topicSlug: 'customer-service',
    type: 'Cluster',
    focusKeyword: 'support SLA',
    status: 'planned',
    standfirst: 'Dynamic priority weight calculations, SLA countdown timers, and breach warning escalations.',
    focusQuestion: 'How do support engines calculate ticket priority scores dynamically based on contract terms?',
    ghostLinks: ['how-ticket-routing-works', 'ticket-escalation']
  },
  'ticket-escalation': {
    slug: 'ticket-escalation',
    title: 'Escalation paths: how hard tickets move up',
    topic: 'Customer Service',
    topicSlug: 'customer-service',
    type: 'Cluster',
    focusKeyword: 'ticket escalation',
    status: 'planned',
    standfirst: 'Tier 1 to Tier 3 engineering escalation triggers, context transfer, and post-incident tagging.',
    focusQuestion: 'What information must be preserved when an unresolved ticket escalates from front-line support to core engineering?',
    ghostLinks: ['how-ticket-routing-works', 'support-queues-slas']
  },
  'omnichannel-support': {
    slug: 'omnichannel-support',
    title: 'Omnichannel support: one conversation across channels',
    topic: 'Customer Service',
    topicSlug: 'customer-service',
    type: 'Cluster',
    focusKeyword: 'omnichannel support',
    status: 'planned',
    standfirst: 'Merging email threads, live chat, SMS, and voice calls into a unified customer identity graph.',
    focusQuestion: 'How does an agent see past chat logs when a customer suddenly calls in from a different phone number?',
    ghostLinks: ['how-ticket-routing-works', 'chatbot-deflection']
  },
  'chatbot-deflection': {
    slug: 'chatbot-deflection',
    title: 'Chatbot deflection: how bots resolve tickets',
    topic: 'Customer Service',
    topicSlug: 'customer-service',
    type: 'Cluster',
    focusKeyword: 'chatbot deflection',
    status: 'planned',
    standfirst: 'Semantic search retrieval, intent classification, and graceful human handoff mechanisms.',
    focusQuestion: 'When should an automated support bot surrender and hand off the chat to a live human operator?',
    ghostLinks: ['how-ticket-routing-works', 'omnichannel-support', 'automation-pipelines-explained']
  },

  // --------------------------------------------------------------------------
  // Virtual Assistance (5 articles)
  // --------------------------------------------------------------------------
  'how-task-delegation-works': {
    slug: 'how-task-delegation-works',
    title: 'How task delegation works',
    topic: 'Virtual Assistance',
    topicSlug: 'virtual-assistance',
    type: 'Pillar',
    focusKeyword: 'task delegation',
    status: 'planned',
    standfirst: 'Deconstructing knowledge transfer: boundary definition, autonomy levels, and verification feedback loops.',
    focusQuestion: 'Why do most delegation attempts collapse into micromanagement or missed deliverables?',
    ghostLinks: ['standard-operating-procedures', 'async-communication', 'task-handoff', 'onboarding-a-virtual-assistant', 'how-ticket-routing-works', 'how-calendar-scheduling-works']
  },
  'standard-operating-procedures': {
    slug: 'standard-operating-procedures',
    title: 'SOPs: documenting a task so anyone can run it',
    topic: 'Virtual Assistance',
    topicSlug: 'virtual-assistance',
    type: 'Cluster',
    focusKeyword: 'standard operating procedures',
    status: 'planned',
    standfirst: 'Step-by-step state diagrams, exception paths, and measurable definition of done.',
    focusQuestion: 'How do you write a standard operating procedure that survives software UI updates?',
    ghostLinks: ['how-task-delegation-works', 'task-handoff']
  },
  'async-communication': {
    slug: 'async-communication',
    title: 'Async communication: handing off across time zones',
    topic: 'Virtual Assistance',
    topicSlug: 'virtual-assistance',
    type: 'Cluster',
    focusKeyword: 'async communication',
    status: 'planned',
    standfirst: 'Context-rich handoff tickets, Loom video protocols, and asynchronous decision records.',
    focusQuestion: 'How do distributed teams eliminate 24-hour question-and-answer cycle delays?',
    ghostLinks: ['how-task-delegation-works', 'task-handoff']
  },
  'task-handoff': {
    slug: 'task-handoff',
    title: 'Task handoff: clean handoffs between people',
    topic: 'Virtual Assistance',
    topicSlug: 'virtual-assistance',
    type: 'Cluster',
    focusKeyword: 'task handoff',
    status: 'planned',
    standfirst: 'The protocol of passing state: assumptions, inputs, tools, and edge-case criteria.',
    focusQuestion: 'What exact checklist ensures a task receiver has 100% of the context required to execute without follow-up questions?',
    ghostLinks: ['how-task-delegation-works', 'standard-operating-procedures']
  },
  'onboarding-a-virtual-assistant': {
    slug: 'onboarding-a-virtual-assistant',
    title: 'Onboarding a virtual assistant: the first 30 days',
    topic: 'Virtual Assistance',
    topicSlug: 'virtual-assistance',
    type: 'Cluster',
    focusKeyword: 'onboarding a virtual assistant',
    status: 'planned',
    standfirst: 'Graduated permission models, sandbox tasks, and calibration review rhythms.',
    focusQuestion: 'How should access permissions ramp up safely during a new assistant’s first month?',
    ghostLinks: ['how-task-delegation-works', 'standard-operating-procedures']
  },

  // --------------------------------------------------------------------------
  // Pitch Decks (5 articles)
  // --------------------------------------------------------------------------
  'how-pitch-decks-work': {
    slug: 'how-pitch-decks-work',
    title: 'How a pitch deck communicates',
    topic: 'Pitch Decks',
    topicSlug: 'pitch-decks',
    type: 'Pillar',
    focusKeyword: 'pitch deck structure',
    status: 'planned',
    standfirst: 'Narrative pacing, cognitive load distribution, visual hierarchy, and investor mental models.',
    focusQuestion: 'How does an investor process 12 slides in under 2 minutes and decide whether to request a call?',
    ghostLinks: ['pitch-deck-slide-structure', 'deck-data-visualization', 'deck-format-conversion', 'investor-vs-sales-decks', 'how-ad-auctions-work']
  },
  'pitch-deck-slide-structure': {
    slug: 'pitch-deck-slide-structure',
    title: 'The 10-slide structure of a pitch deck',
    topic: 'Pitch Decks',
    topicSlug: 'pitch-decks',
    type: 'Cluster',
    focusKeyword: 'pitch deck slides',
    status: 'planned',
    standfirst: 'Dissecting the canonical 10-slide arc: Problem, Solution, Market, Product, Traction, Business Model, Team, Financials, Competition, The Ask.',
    focusQuestion: 'Why does disrupting the traditional problem-solution slide sequence increase investor drop-off?',
    ghostLinks: ['how-pitch-decks-work', 'deck-data-visualization']
  },
  'deck-data-visualization': {
    slug: 'deck-data-visualization',
    title: 'Data visualisation in decks: charts that persuade',
    topic: 'Pitch Decks',
    topicSlug: 'pitch-decks',
    type: 'Cluster',
    focusKeyword: 'data visualisation',
    status: 'planned',
    standfirst: 'Removing chart junk, honest Y-axis scaling, and highlighting the single takeaway per visualization.',
    focusQuestion: 'How do you design a cohort retention chart that communicates durability at a glance?',
    ghostLinks: ['how-pitch-decks-work', 'pitch-deck-slide-structure']
  },
  'deck-format-conversion': {
    slug: 'deck-format-conversion',
    title: 'Format conversion: why decks lose fidelity',
    topic: 'Pitch Decks',
    topicSlug: 'pitch-decks',
    type: 'Cluster',
    focusKeyword: 'deck format conversion',
    status: 'planned',
    standfirst: 'Font fallback degradation, vector rasterization artifacts, and aspect ratio clipping across Keynote, PowerPoint, and PDF.',
    focusQuestion: 'Why do beautiful typography and vector graphics distort when converting between slide formats?',
    ghostLinks: ['how-pitch-decks-work', 'pitch-deck-slide-structure']
  },
  'investor-vs-sales-decks': {
    slug: 'investor-vs-sales-decks',
    title: 'Investor vs sales decks: how they differ',
    topic: 'Pitch Decks',
    topicSlug: 'pitch-decks',
    type: 'Cluster',
    focusKeyword: 'investor vs sales deck',
    status: 'planned',
    standfirst: 'Why enterprise buyers demand risk mitigation and ROI proofs while venture capitalists hunt asymmetric upside and market expansion.',
    focusQuestion: 'Why does pitching enterprise customers with an investor deck result in stalled procurement cycles?',
    ghostLinks: ['how-pitch-decks-work', 'pitch-deck-slide-structure']
  },

  // --------------------------------------------------------------------------
  // Personal Assistance (5 articles)
  // --------------------------------------------------------------------------
  'how-calendar-scheduling-works': {
    slug: 'how-calendar-scheduling-works',
    title: 'How calendar scheduling and conflict resolution works',
    topic: 'Personal Assistance',
    topicSlug: 'personal-assistance',
    type: 'Pillar',
    focusKeyword: 'calendar scheduling',
    status: 'planned',
    standfirst: 'Constraint satisfaction algorithms, buffer time policies, time zone normalization, and cognitive energy rhythm allocation.',
    focusQuestion: 'How does an automated scheduling algorithm resolve double-bookings across 4 calendars in 3 time zones?',
    ghostLinks: ['calendar-conflict-resolution', 'email-triage', 'travel-coordination', 'task-prioritization', 'how-task-delegation-works']
  },
  'calendar-conflict-resolution': {
    slug: 'calendar-conflict-resolution',
    title: 'Calendar conflict resolution: solving double-bookings',
    topic: 'Personal Assistance',
    topicSlug: 'personal-assistance',
    type: 'Cluster',
    focusKeyword: 'calendar conflict resolution',
    status: 'planned',
    standfirst: 'Precedence rules, executive priority weighting, and automated courteous rescheduling protocols.',
    focusQuestion: 'What mechanical rules govern which meeting moves when a board meeting clashes with a client review?',
    ghostLinks: ['how-calendar-scheduling-works', 'task-prioritization']
  },
  'email-triage': {
    slug: 'email-triage',
    title: 'Email triage: processing an inbox to zero',
    topic: 'Personal Assistance',
    topicSlug: 'personal-assistance',
    type: 'Cluster',
    focusKeyword: 'email triage',
    status: 'planned',
    standfirst: 'The 4D framework (Do, Delegate, Defer, Delete) enforced via server-side filters and priority tags.',
    focusQuestion: 'How can an executive process 200 incoming emails per day in under 30 minutes without dropping balls?',
    ghostLinks: ['how-calendar-scheduling-works', 'task-prioritization']
  },
  'travel-coordination': {
    slug: 'travel-coordination',
    title: 'Travel coordination: planning a trip end to end',
    topic: 'Personal Assistance',
    topicSlug: 'personal-assistance',
    type: 'Cluster',
    focusKeyword: 'travel coordination',
    status: 'planned',
    standfirst: 'Flight layover risk buffers, ground transit handoffs, time-zone adaptation schedules, and contingency binders.',
    focusQuestion: 'What friction points break complex multi-city business itineraries, and how are fail-safes designed?',
    ghostLinks: ['how-calendar-scheduling-works', 'calendar-conflict-resolution']
  },
  'task-prioritization': {
    slug: 'task-prioritization',
    title: 'Task prioritisation: deciding what to do next',
    topic: 'Personal Assistance',
    topicSlug: 'personal-assistance',
    type: 'Cluster',
    focusKeyword: 'task prioritisation',
    status: 'planned',
    standfirst: 'Eisenhower matrices, weighted shortest job first (WSJF), and energy-matched scheduling.',
    focusQuestion: 'How do you algorithmically determine what task to tackle first when every project is flagged urgent?',
    ghostLinks: ['how-calendar-scheduling-works', 'email-triage', 'how-task-delegation-works']
  }
};

export const ALL_ARTICLES = Object.values(SLUG_REGISTRY);
export const PUBLISHED_ARTICLES = ALL_ARTICLES.filter(a => a.status === 'published');
export const PLANNED_ARTICLES = ALL_ARTICLES.filter(a => a.status === 'planned');
