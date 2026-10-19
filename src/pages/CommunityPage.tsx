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
import { ConstellationMesh } from '../components/community/ConstellationMesh';
import { ArticleRequestModal } from '../components/topics/ArticleRequestModal';
import styles from '../styles/community.module.css';

interface RequestItem {
  id: string;
  topic: string;
  topicSlug: string;
  query: string;
  scope: string;
  votes: number;
  maxTarget: number;
  status: 'In Active Research' | 'Specification Outline' | 'Reviewing Draft' | 'Scheduled for November';
}

const INITIAL_REQUESTS: RequestItem[] = [
  {
    id: 'req-1',
    topic: 'AI & Automation',
    topicSlug: 'ai-automation',
    query: 'Webhook Delivery Retries Under 48h Upstream Outage',
    scope: 'Examining idempotency key retention, exponential backoff with full jitter, and dead-letter queue overflow handling when upstream third-party endpoints experience extended outages.',
    votes: 42,
    maxTarget: 50,
    status: 'In Active Research'
  },
  {
    id: 'req-2',
    topic: 'E-commerce',
    topicSlug: 'e-commerce',
    query: 'Preventing Two-Phase Commit Locks on Sharded Inventory',
    scope: 'How distributed checkout clusters handle high-velocity flash sales across multi-region databases without table deadlocks or overselling reservations.',
    votes: 38,
    maxTarget: 50,
    status: 'Specification Outline'
  },
  {
    id: 'req-3',
    topic: 'Marketing & Ads',
    topicSlug: 'marketing-ads',
    query: 'Consent Mode v2 Cookieless Pings: Mathematical Probabilities',
    scope: 'Dissecting how conversion modeling recovers attribution gaps through statistical Bayesian regression when users decline third-party cookies.',
    votes: 31,
    maxTarget: 50,
    status: 'Scheduled for November'
  },
  {
    id: 'req-4',
    topic: 'Web Design',
    topicSlug: 'web-design',
    query: 'INP Layout Thrashing from Complex Canvas Animations',
    scope: 'Auditing main-thread blocking time during high-frame-rate canvas renders, compositor offloading via OffscreenCanvas, and requestAnimationFrame queue hygiene.',
    votes: 27,
    maxTarget: 50,
    status: 'Reviewing Draft'
  },
  {
    id: 'req-5',
    topic: 'Customer Service',
    topicSlug: 'customer-service',
    query: 'Vector Deflection Routing Under High-Velocity Ticket Bursts',
    scope: 'How automated triage arbiters score semantic intent, isolate cascade escalations, and protect human tiers from denial-of-service surges.',
    votes: 23,
    maxTarget: 50,
    status: 'Specification Outline'
  },
  {
    id: 'req-6',
    topic: 'AI & Automation',
    topicSlug: 'ai-automation',
    query: 'Write-Ahead Log (WAL) Settlement in Distributed Runners',
    scope: 'Analyzing crash resilience, state replication protocols, and zero-data-loss reconciliation when workflow worker pods terminate mid-execution.',
    votes: 19,
    maxTarget: 50,
    status: 'In Active Research'
  }
];

export const CommunityPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [requests, setRequests] = useState<RequestItem[]>(INITIAL_REQUESTS);
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());

  const filterTabs = [
    'All',
    'AI & Automation',
    'E-commerce',
    'Marketing & Ads',
    'Web Design',
    'Customer Service'
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

  const getStatusClass = (status: RequestItem['status']) => {
    switch (status) {
      case 'In Active Research': return styles.statusActive;
      case 'Specification Outline': return styles.statusOutline;
      case 'Reviewing Draft': return styles.statusReview;
      case 'Scheduled for November': return styles.statusScheduled;
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* =====================================================================
          SECTION 1: HERO & LIVING CONSTELLATION NODE MESH
          ===================================================================== */}
      <section className={styles.heroSection}>
        {/* Living Constellation Mesh Canvas */}
        <ConstellationMesh />

        {/* 4-Corner Reticle Crosshairs */}
        <span className={`${styles.cornerReticle} ${styles.reticleTL}`}>+</span>
        <span className={`${styles.cornerReticle} ${styles.reticleTR}`}>+</span>
        <span className={`${styles.cornerReticle} ${styles.reticleBL}`}>+</span>
        <span className={`${styles.cornerReticle} ${styles.reticleBR}`}>+</span>

        <div className={styles.heroContent}>
          <div className={styles.heroEyebrow}>
            <span className={styles.beaconDot} />
            Observatory Collective • Demand Radar
          </div>

          <h1 className={styles.heroTitle}>
            The Systems Community.
          </h1>

          <p className={styles.heroSubhead}>
            A gathering of engineers, ops architects, and technical operators shaping the editorial backlog. Vote on upcoming mechanism breakdowns, track research milestones, or submit production architectures for analysis.
          </p>

          <div className={styles.heroCtaRow}>
            <button
              onClick={() => setModalOpen(true)}
              className={styles.primaryCta}
            >
              <PlusCircle size={15} />
              <span>Submit Architecture Teardown</span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('pipeline-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={styles.secondaryCta}
            >
              <span>Explore Research Pipeline ↓</span>
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 2: EDITORIAL PRODUCTION PIPELINE TIMELINE
          ===================================================================== */}
      <section id="pipeline-section" className={styles.pipelineSection}>
        <div className={styles.sectionHeaderCenter}>
          <div className={styles.sectionEyebrow}>
            <Microscope size={12} />
            <span>The Editorial Protocol</span>
          </div>

          <h2 className={styles.sectionTitle}>
            How community requests become verified specs.
          </h2>

          <p className={styles.sectionSubhead}>
            Every breakdown undergoes rigorous primary-source investigation and physical stress-testing before publication.
          </p>
        </div>

        <div className={styles.timelineGrid}>
          {/* Stage 1 */}
          <div className={styles.timelineCard}>
            <span className={styles.stageNumberBadge}>Stage 01</span>
            <h3 className={styles.stageTitle}>Community Demand Signal</h3>
            <p className={styles.stageDescription}>
              Subscribers vote and register demand for mission-critical architectures, failure edge cases, and distributed bottlenecks.
            </p>
          </div>

          {/* Stage 2 */}
          <div className={styles.timelineCard}>
            <span className={styles.stageNumberBadge}>Stage 02</span>
            <h3 className={styles.stageTitle}>Primary Source Audit</h3>
            <p className={styles.stageDescription}>
              Direct examination of open RFCs, official specifications, vendor API documentation, and engine source code. Zero synthetic fluff.
            </p>
          </div>

          {/* Stage 3 */}
          <div className={styles.timelineCard}>
            <span className={styles.stageNumberBadge}>Stage 03</span>
            <h3 className={styles.stageTitle}>Failure Reproduction</h3>
            <p className={styles.stageDescription}>
              Simulating production limits, testing recovery mechanisms under fault conditions, and compiling physical benchmark logs.
            </p>
          </div>

          {/* Stage 4 */}
          <div className={styles.timelineCard}>
            <span className={styles.stageNumberBadge}>Stage 04</span>
            <h3 className={styles.stageTitle}>Published Spec</h3>
            <p className={styles.stageDescription}>
              Releasing the long-form mechanical teardown complete with living interactive canvas simulators and failure mode playbooks.
            </p>
          </div>
        </div>
      </section>

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
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`${styles.filterPill} ${activeFilter === tab ? styles.filterPillActive : ''}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* 2-Column Bento Matrix */}
          <div className={styles.matrixGrid}>
            {filteredRequests.map((item) => {
              const hasVoted = votedIds.has(item.id);
              const progressPct = Math.min(100, Math.round((item.votes / item.maxTarget) * 100));

              return (
                <div key={item.id} className={styles.requestCard}>
                  <div>
                    {/* Top row: Topic badge + status */}
                    <div className={styles.requestTopRow}>
                      <span className={styles.requestTopicBadge}>
                        {item.topic}
                      </span>

                      <span className={`${styles.statusIndicator} ${getStatusClass(item.status)}`}>
                        {item.status === 'In Active Research' && <span className={styles.beaconDot} />}
                        {item.status}
                      </span>
                    </div>

                    <h3 className={styles.requestTitle}>
                      "{item.query}"
                    </h3>

                    <p className={styles.requestScope}>
                      {item.scope}
                    </p>
                  </div>

                  {/* Bottom row: Upvote button & demand bar */}
                  <div className={styles.requestBottomRow}>
                    <button
                      onClick={() => handleUpvote(item.id)}
                      className={`${styles.upvoteButton} ${hasVoted ? styles.upvoteButtonVoted : ''}`}
                      aria-label={`Upvote request: ${item.query}`}
                    >
                      {hasVoted ? <Check size={14} /> : <ChevronUp size={14} />}
                      <span>{item.votes} votes</span>
                    </button>

                    <div className={styles.demandProgressCol}>
                      <span className={styles.demandLabel}>
                        {progressPct}% to editorial lock
                      </span>
                      <div className={styles.demandBarTrack}>
                        <div
                          className={styles.demandBarFill}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
