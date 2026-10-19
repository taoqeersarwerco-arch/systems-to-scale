import React, { useState } from 'react';
import { 
  Users, 
  ArrowRight, 
  ChevronUp, 
  Check, 
  PlusCircle, 
  FileCheck2, 
  Microscope, 
  Cpu, 
  Share2 
} from 'lucide-react';
import { CommunityHero } from '../components/community/CommunityHero';
import { ProtocolReactor } from '../components/community/ProtocolReactor';
import { RequestLeaderboardCard, RequestItem } from '../components/community/RequestLeaderboardCard';
import { ArticleRequestModal } from '../components/topics/ArticleRequestModal';
import styles from '../styles/community.module.css';

const INITIAL_REQUESTS: RequestItem[] = [
  {
    id: 'req-1',
    topic: 'AI & Automation',
    topicSlug: 'ai-automation',
    query: 'Webhook Delivery Retries Under 48h Upstream Outage',
    scope: 'Examining idempotency key retention, exponential backoff with full jitter, and dead-letter queue overflow handling when upstream third-party endpoints experience extended outages.',
    votes: 42,
    maxTarget: 50,
    status: 'In Active Research',
    mechanismNodes: ['Idempotency WAL', 'Exponential Jitter', 'DLQ Overflow']
  },
  {
    id: 'req-2',
    topic: 'E-commerce',
    topicSlug: 'e-commerce',
    query: 'Preventing Two-Phase Commit Locks on Sharded Inventory',
    scope: 'How distributed checkout clusters handle high-velocity flash sales across multi-region databases without table deadlocks or overselling reservations.',
    votes: 38,
    maxTarget: 50,
    status: 'Specification Outline',
    mechanismNodes: ['Checkout Arbiter', 'Saga Coordinator', 'Sharded State']
  },
  {
    id: 'req-3',
    topic: 'Marketing & Ads',
    topicSlug: 'marketing-ads',
    query: 'Consent Mode v2 Cookieless Pings: Mathematical Probabilities',
    scope: 'Dissecting how conversion modeling recovers attribution gaps through statistical Bayesian regression when users decline third-party cookies.',
    votes: 31,
    maxTarget: 50,
    status: 'Scheduled for November',
    mechanismNodes: ['Bayesian Prior', 'State Estimator', 'Attribution Gap']
  },
  {
    id: 'req-4',
    topic: 'Web Design',
    topicSlug: 'web-design',
    query: 'INP Layout Thrashing from Complex Canvas Animations',
    scope: 'Auditing main-thread blocking time during high-frame-rate canvas renders, compositor offloading via OffscreenCanvas, and requestAnimationFrame queue hygiene.',
    votes: 27,
    maxTarget: 50,
    status: 'Reviewing Draft',
    mechanismNodes: ['Compositor Thread', 'OffscreenCanvas', 'Frame Budget']
  },
  {
    id: 'req-5',
    topic: 'Customer Service',
    topicSlug: 'customer-service',
    query: 'Vector Deflection Routing Under High-Velocity Ticket Bursts',
    scope: 'How automated triage arbiters score semantic intent, isolate cascade escalations, and protect human tiers from denial-of-service surges.',
    votes: 23,
    maxTarget: 50,
    status: 'Specification Outline',
    mechanismNodes: ['Semantic Arbiter', 'Cascade Isolator', 'Tier Guard']
  },
  {
    id: 'req-6',
    topic: 'AI & Automation',
    topicSlug: 'ai-automation',
    query: 'Write-Ahead Log (WAL) Settlement in Distributed Runners',
    scope: 'Analyzing crash resilience, state replication protocols, and zero-data-loss reconciliation when workflow worker pods terminate mid-execution.',
    votes: 19,
    maxTarget: 50,
    status: 'In Active Research',
    mechanismNodes: ['Raft Log Sync', 'Snapshot Epoch', 'State Reconciliation']
  }
];

export const CommunityPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [requests, setRequests] = useState<RequestItem[]>(INITIAL_REQUESTS);
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());

  const filterTabs = [
    { label: 'All', count: requests.length },
    { label: 'AI & Automation', count: requests.filter(r => r.topic === 'AI & Automation').length },
    { label: 'E-commerce', count: requests.filter(r => r.topic === 'E-commerce').length },
    { label: 'Marketing & Ads', count: requests.filter(r => r.topic === 'Marketing & Ads').length },
    { label: 'Web Design', count: requests.filter(r => r.topic === 'Web Design').length },
    { label: 'Customer Service', count: requests.filter(r => r.topic === 'Customer Service').length }
  ];

  const handleUpvote = (id: string) => {
    if (votedIds.has(id)) {
      // Toggle off
      setRequests(prev => prev.map(r => r.id === id ? { ...r, votes: r.votes - 1 } : r));
      setVotedIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } else {
      // Vote up
      setRequests(prev => prev.map(r => r.id === id ? { ...r, votes: r.votes + 1 } : r));
      setVotedIds(prev => new Set(prev).add(id));
    }
  };

  const filteredRequests = activeFilter === 'All'
    ? requests
    : requests.filter(r => r.topic === activeFilter);

  return (
    <div className={styles.pageContainer}>
      {/* =====================================================================
          SECTION 1: CINEMATIC OBSERVATORY GLOBAL DEMAND RADAR HERO
          ===================================================================== */}
      <CommunityHero onSubmitClick={() => setModalOpen(true)} />

      {/* =====================================================================
          SECTION 2: EDITORIAL PROTOCOL REACTOR & VERIFICATION PIPELINE
          ===================================================================== */}
      <ProtocolReactor />

      {/* =====================================================================
          SECTION 3: LIVE MECHANISM REQUEST MATRIX
          ===================================================================== */}
      <section id="matrix-section" className={styles.matrixSection}>
        <div className={styles.matrixContainer}>
          <div className={styles.sectionHeaderCenter}>
            <div className={styles.sectionEyebrow}>
              <Cpu size={12} />
              <span>Public Demand Radar</span>
            </div>

            <h2 className={styles.sectionTitle}>
              Reader Request Leaderboard
            </h2>

            <p className={styles.sectionSubhead}>
              Active architectural teardowns requested and voted on by weekly dispatch subscribers.
            </p>
          </div>

          {/* Filter Tab Pills */}
          <div className={styles.filterRow}>
            {filterTabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveFilter(tab.label)}
                className={`${styles.filterPill} ${activeFilter === tab.label ? styles.filterPillActive : ''}`}
              >
                <span>{tab.label}</span>
                <span style={{ opacity: 0.5, fontSize: '10.5px', marginLeft: 4 }}>({tab.count})</span>
              </button>
            ))}
          </div>

          {/* 2-Column Bento Matrix with Living Canvases */}
          <div className={styles.matrixGrid}>
            {filteredRequests.map((item) => (
              <RequestLeaderboardCard
                key={item.id}
                item={item}
                hasVoted={votedIds.has(item.id)}
                onUpvote={handleUpvote}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 4: PRODUCTION TEARDOWN SUBMISSION CONSOLE
          ===================================================================== */}
      <section className={styles.submissionSection}>
        <div className={styles.submissionConsoleCard}>
          <div className={styles.submissionEyebrow}>
            <Share2 size={12} />
            <span>Architecture Submission</span>
          </div>

          <h2 className={styles.submissionHeading}>
            Have a complex production failure or architecture to deconstruct?
          </h2>

          <p className={styles.submissionBody}>
            Submit an architectural topology, retry outage incident, or distributed state bottleneck. We deconstruct the physical failure modes and publish a complete technical breakdown with zero vendor bias.
          </p>

          <button
            onClick={() => setModalOpen(true)}
            className={styles.primaryCta}
            style={{ marginTop: '8px' }}
          >
            <PlusCircle size={15} />
            <span>Submit Architecture Teardown</span>
          </button>

          <div className={styles.submissionTrustRow}>
            <span className={styles.submissionTrustPill}>
              <span className={styles.submissionTrustCheck}>✓</span> 100% Anonymized
            </span>
            <span className={styles.submissionTrustPill}>
              <span className={styles.submissionTrustCheck}>✓</span> Primary Specs Only
            </span>
            <span className={styles.submissionTrustPill}>
              <span className={styles.submissionTrustCheck}>✓</span> Zero Vendor Promotion
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Demand Capture Modal */}
      <ArticleRequestModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultTopic="Community Teardown Request"
      />
    </div>
  );
};
