export interface CaseStudy {
  id: string;
  company: string;
  topic: string;
  headline: string;
  context: string;
  bottleneck: string;
  mechanism: string;
  outcome: string;
  citation: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'stripe-idempotency',
    company: 'Stripe',
    topic: 'Payment Systems',
    headline: 'Guaranteeing Exactly-Once Execution Over At-Least-Once Networks',
    context: 'In distributed billing infrastructure, network timeouts are ambiguous: the client has no way to tell whether an HTTP request failed before reaching the server or while transmitting the response.',
    bottleneck: 'Blind retries from merchant servers frequently triggered catastrophic double-billing on high-value credit card transactions.',
    mechanism: 'Stripe engineered an Idempotency-Key layer in their API reverse proxies. Incoming requests hash the key into a distributed transactional datastore (Redis + MySQL). Concurrent requests with the exact same key block until the first finishes, caching and replaying the exact original response without touching card networks twice.',
    outcome: 'Eliminated billions of dollars in double-charge chargeback disputes while maintaining sub-100ms API response overhead.',
    citation: 'Stripe Engineering Blog: "Designing robust and predictable APIs with idempotency"'
  },
  {
    id: 'shopify-flash-sales',
    company: 'Shopify',
    topic: 'E-commerce Concurrency',
    headline: 'High-Concurrency Checkout Queues During 100k Req/Sec Flash Sales',
    context: 'During Black Friday Cyber Monday (BFCM) flash sales, celebrity store drops produce sudden traffic surges with 100,000 shoppers competing for 500 units of physical inventory.',
    bottleneck: 'Direct relational database write locks on inventory rows exhausted database connection pools, crashing storefronts in seconds.',
    mechanism: 'Shopify dismantled synchronous checkout checkout paths into an asynchronous state machine. Checkout sessions enter an in-memory ticket queue backed by Kafka. State transitions (Reserve Inventory → Authorize 3DS → Capture Settlement) are orchestrated via background worker daemons with strict lease expiration timers.',
    outcome: 'Processed over $9.3B in peak BFCM sales with 99.999% platform availability and zero inventory overselling.',
    citation: 'Shopify Engineering Architecture: "How Shopify handles peak flash-sale loads"'
  },
  {
    id: 'slack-realtime-queues',
    company: 'Slack',
    topic: 'Real-time Message Broker',
    headline: 'Fair-Share Queue Scheduling Across Millions of Active Webhooks',
    context: 'Slack enterprise channels receive millions of incoming webhooks, bot notifications, and automated workflow triggers every minute.',
    bottleneck: 'A single misconfigured customer script could unleash an infinite loop of webhook payloads, starving legitimate workspace messages and exhausting message broker buffers.',
    mechanism: 'Slack deployed a distributed fair-share rate-limiting scheduler. Message ingress uses token bucket algorithms partitioned by workspace ID and integration token. High-volume bursts are throttled into tiered backpressure queues, while normal conversational traffic bypasses the queue on high-priority lanes.',
    outcome: 'Maintained 50ms average message delivery latency across 65M+ daily messages without global queue starvation.',
    citation: 'Slack Engineering: "Flannel: An application-level edge cache to scale real-time collaboration"'
  },
  {
    id: 'hubspot-sla-routing',
    company: 'HubSpot',
    topic: 'Customer Service Routing',
    headline: 'Dynamic SLA Routing and Intelligent Ticket Load Shedding',
    context: 'Enterprise support operations handle hundreds of thousands of tickets across multiple product lines, tier agreements, and international time zones.',
    bottleneck: 'Static round-robin ticket assignment consistently broke enterprise 1-hour SLA guarantees when complex tier-3 tickets clogged senior reps.',
    mechanism: 'HubSpot implemented dynamic SLA weight scoring. Each ticket receives a dynamic priority vector: P(t) = Base_Weight × (elapsed_time / SLA_target)^2 + Affinity_Bonus. Routing engines continuously recalculate queue positions and reassign tickets based on real-time agent skill availability and active queue depth.',
    outcome: 'Reduced SLA breach rates by 42% and improved first-contact resolution by 28% across 100k+ enterprise accounts.',
    citation: 'HubSpot Customer Operations: "Engineering SLA-driven routing at enterprise scale"'
  }
];
