export interface Misconception {
  id: string;
  field: string;
  myth: string;
  reality: string;
  mechanism: string;
  articleSlug: string;
}

export const MISCONCEPTIONS: Misconception[] = [
  {
    id: 'misc-01',
    field: 'AI & Automation',
    myth: 'Retrying a failed API call means firing it again immediately.',
    reality: 'Immediate retries trigger catastrophic thundering herd meltdowns against recovering servers.',
    mechanism: 'Production pipelines enforce truncated exponential backoff with randomized full jitter: t = min(M, B * 2^attempt) * random(0, 1). This decorrelates incoming retry spikes and gives the upstream service breathing room to recover.',
    articleSlug: 'retry-and-backoff'
  },
  {
    id: 'misc-02',
    field: 'Marketing & Ads',
    myth: 'The highest bidder always wins the ad slot.',
    reality: 'Ad exchanges run generalized second-price (Vickrey) auctions weighted by Ad Quality Score.',
    mechanism: 'Ad Rank = Bid × Quality Score. A $3 bid with high CTR and low page bounce routinely beats an $8 bid with low engagement. The winner pays only $0.01 above the minimum price needed to maintain their rank.',
    articleSlug: 'how-ad-auctions-work'
  },
  {
    id: 'misc-03',
    field: 'Web Design',
    myth: 'A site is fast because it uses modern client-side JavaScript hydration.',
    reality: 'Hydration often starves the main thread, spiking Interaction to Next Paint (INP) into the red.',
    mechanism: 'Browsers render via a strict pipeline: HTML parsing → DOM tree → CSSOM calculation → Layout geometry → Raster paint → GPU compositing. Heavy JS bundles block the parser and force layout thrashing.',
    articleSlug: 'how-browsers-render-pages'
  },
  {
    id: 'misc-04',
    field: 'E-commerce',
    myth: 'Payment gateways immediately transfer money when you click "Place Order".',
    reality: 'Immediate charges are a myth; online checkouts separate Authorization from Capture.',
    mechanism: 'Authorization reserves credit against the customer’s issuing bank limit. Capture occurs asynchronously when the warehouse scans and dispatches the item. Idempotency keys prevent double authorizations if network packets drop.',
    articleSlug: 'how-online-checkout-works'
  }
];
