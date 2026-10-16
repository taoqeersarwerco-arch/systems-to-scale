import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Zap, RotateCcw, X } from 'lucide-react';
import {
  StripeLogo,
  ShopifyLogo,
  SlackLogo,
  HubSpotLogo,
  NetflixLogo,
  CloudflareLogo
} from '../ui/BrandLogos';
import './CaseStudies.css';

gsap.registerPlugin(ScrollTrigger);

export interface SimulationStep {
  label: string;
  detail: string;
  status: 'input' | 'process' | 'shield' | 'success';
}

export interface CaseStudyItem {
  id: string;
  company: string;
  category: string;
  logo: React.ReactNode;
  context: string;
  bottleneck: string;
  mechanism: string;
  metric: string;
  simulation: {
    steps: SimulationStep[];
    latencyValue: number;
    latencyUnit: string;
    decimals: number;
    outputSummary: string;
  };
}

const CASE_STUDIES_DATA: CaseStudyItem[] = [
  {
    id: 'stripe',
    company: 'Stripe',
    category: 'FINANCIAL TRANSACTIONS',
    logo: <StripeLogo size={30} />,
    context: 'Processing billions in payments with zero double-charges.',
    bottleneck: 'Network timeouts caused merchants to retry payment requests, risking charging the customer twice for the same purchase.',
    mechanism: 'Idempotency keys. Every mutation carries a unique client-generated UUID. The server acquires an atomic lock in Redis, caches the first execution result, and short-circuits any retried request with the cached 200 OK without re-executing.',
    metric: 'Zero duplicate charges across billions in volume on Black Friday & Cyber Monday.',
    simulation: {
      steps: [
        { label: 'Client Mutation Header', detail: 'POST /v1/charges [Idempotency-Key: idemp_9f81a7d4]', status: 'input' },
        { label: 'Atomic Lock Acquisition', detail: 'Redis SET idemp_9f81a7d4 "started" NX EX 86400', status: 'process' },
        { label: 'Subsequent Retry Intercept', detail: 'Client retried on timeout; Gateway detects key state: "finished"', status: 'shield' },
        { label: 'Short-Circuit Response', detail: 'Bypassed Visa/MC payment rails → Replayed cached 200 OK [ch_3N2p...]', status: 'success' }
      ],
      latencyValue: 1.4,
      latencyUnit: 'ms',
      decimals: 1,
      outputSummary: 'Zero double-charges committed across millions of concurrent payments in 1.4ms. Idempotency store short-circuited duplicate payment rails.'
    }
  },
  {
    id: 'shopify',
    company: 'Shopify',
    category: 'HIGH-CONTENTION FLASH SALES',
    logo: <ShopifyLogo size={30} />,
    context: 'Handling flash sales where millions of buyers hit checkout in seconds.',
    bottleneck: 'Database row contention when tens of thousands of buyers tried to decrement the exact same inventory counter row at the same millisecond.',
    mechanism: 'In-memory checkout queue with Lua scripts in Redis. Requests are serialized and executed atomically in single-threaded memory before touching MySQL, completely eliminating relational row-level locking.',
    metric: 'Handled over $11.5 billion in Gross Merchandise Volume with zero database lockouts.',
    simulation: {
      steps: [
        { label: '100k Flash Influx', detail: 'Simultaneous buyers hitting 1 product inventory counter', status: 'input' },
        { label: 'Atomic Redis Lua Script', detail: 'redis.call("DECR", key) executes atomically in RAM (<0.2ms)', status: 'process' },
        { label: 'Relational Lock Bypass', detail: 'Zero MySQL row-level locks acquired during peak surge', status: 'shield' },
        { label: 'Kafka Async Batch Write', detail: 'Decoupled persistent background sync writes in bulk to MySQL', status: 'success' }
      ],
      latencyValue: 0.2,
      latencyUnit: 'ms',
      decimals: 1,
      outputSummary: '100,000 checkout requests serialized in memory across $11.5B+ BFCM volume in 0.2ms. Relational database CPU stayed flat at 4%.'
    }
  },
  {
    id: 'slack',
    company: 'Slack',
    category: 'REAL-TIME CONNECTION MESH',
    logo: <SlackLogo size={30} />,
    context: 'Delivering messages to millions of connected clients in real time.',
    bottleneck: 'Maintaining persistent WebSockets across millions of enterprise users exhausted server file descriptors, memory buffers, and caused socket churn.',
    mechanism: 'Edge connection terminators with pub/sub fanout ring. WebSockets terminate at edge proxies; internal service uses decoupled message queues, isolating frontend sockets from core app.',
    metric: 'Maintains tens of millions of concurrent connections with sub-100ms global message delivery.',
    simulation: {
      steps: [
        { label: 'Global Client Influx', detail: 'Tens of millions of persistent TLS WebSockets active', status: 'input' },
        { label: 'Envoy Edge Terminators', detail: 'Edge proxies hold socket state; core web tier remains stateless', status: 'process' },
        { label: 'Decoupled Pub/Sub Ring', detail: 'Channel message dispatched once to internal Kafka/Redis bus', status: 'shield' },
        { label: 'Sub-100ms Parallel Fanout', detail: 'Edge proxies push frame to connected client sockets in parallel', status: 'success' }
      ],
      latencyValue: 68,
      latencyUnit: 'ms',
      decimals: 0,
      outputSummary: 'Core application unburdened across tens of millions of concurrent WebSockets in 68ms. Global message latency settled under sub-100ms threshold.'
    }
  },
  {
    id: 'hubspot',
    company: 'HubSpot',
    category: 'DISTRIBUTED ASYNC QUEUES',
    logo: <HubSpotLogo size={30} />,
    context: 'Running email workflows for hundreds of thousands of companies.',
    bottleneck: 'Slow workflows (like complex database lookups) blocked fast workflows (like sending an instant verification email) on shared queues.',
    mechanism: 'Multi-tiered priority queues with fair-share scheduling and isolated Dead-Letter Queues (DLQs). Time-sensitive triggers bypass batch workflows; failing actions isolate to DLQs without blocking healthy queues.',
    metric: 'Processes over 1 billion events daily with predictable SLA delivery.',
    simulation: {
      steps: [
        { label: 'Heterogeneous Queue Traffic', detail: '5M contact batch import coincides with urgent 2FA triggers', status: 'input' },
        { label: 'Multi-Tier Fair-Share Routing', detail: 'Transactional express queue bypasses batch tenant quota', status: 'process' },
        { label: 'DLQ Circuit Breaker', detail: 'Failing third-party webhooks pushed to retry DLQ after 3 attempts', status: 'shield' },
        { label: 'Guaranteed SLA Dispatch', detail: '2FA code delivered in <280ms; bulk sync completes steadily', status: 'success' }
      ],
      latencyValue: 280,
      latencyUnit: 'ms',
      decimals: 0,
      outputSummary: 'Head-of-line queue starvation eradicated across 1B+ daily events in 280ms. Express 2FA code dispatched with zero SLA degradation.'
    }
  },
  {
    id: 'netflix',
    company: 'Netflix',
    category: 'CHAOS & MULTI-REGION FAILOVER',
    logo: <NetflixLogo size={30} />,
    context: 'Evacuating entire AWS regions in under 7 minutes during cloud outages.',
    bottleneck: 'Cloud provider regional outages (datacenter fires, fiber cuts) could bring down video streaming for an entire continent.',
    mechanism: 'Multi-region active-active architecture with automated DNS traffic evacuation. Zuul routing proxies shift 100% of continental traffic to another AWS region in under 7 minutes.',
    metric: 'Zero streaming downtime during major AWS East outages; evacuated in < 7 mins.',
    simulation: {
      steps: [
        { label: 'AWS Regional Outage', detail: 'Catastrophic network partition & packet loss in AWS us-east-1', status: 'input' },
        { label: 'Automated Health Trigger', detail: 'Project Nimble initiates automated continental evacuation', status: 'process' },
        { label: 'Zuul & Route53 Reroute', detail: '100% of traffic diverted to us-west-2 (Oregon) & eu-west-1 (Dublin)', status: 'shield' },
        { label: 'Cassandra Multi-Master Parity', detail: 'Active-active data replication preserves user sessions and bookmarks', status: 'success' }
      ],
      latencyValue: 6.4,
      latencyUnit: 'mins',
      decimals: 1,
      outputSummary: 'Continental traffic evacuated across 300M+ streaming subscribers in 6.4 mins. Zero video playback stream errors reported.'
    }
  },
  {
    id: 'cloudflare',
    company: 'Cloudflare',
    category: 'EDGE DEFENSE & ANYCAST ROUTING',
    logo: <CloudflareLogo size={30} />,
    context: 'Absorbing 2.4 Tbps volumetric DDoS attacks at line rate.',
    bottleneck: 'Volumetric Mirai botnet UDP floods overwhelm origin firewalls and ISP uplinks within milliseconds.',
    mechanism: 'BGP Anycast routing paired with eBPF/XDP kernel packet drops. Anycast distributes attack traffic across 330+ global data centers; kernel-level eBPF discards malicious packets in nanoseconds.',
    metric: 'Mitigated record 2.4 Tbps attack with zero latency spike to legitimate traffic.',
    simulation: {
      steps: [
        { label: '2.4 Tbps Volumetric Attack', detail: 'Botnet deluge of spoofed UDP/SYN packets targeting customer IP', status: 'input' },
        { label: 'BGP Anycast Dilution', detail: 'Attack scattered across 330+ global PoPs in nearest metro areas', status: 'process' },
        { label: 'eBPF / XDP Line-Rate Drop', detail: 'Network card driver discards packets via XDP_DROP in <10ns', status: 'shield' },
        { label: 'Origin Server Intact', detail: 'Zero malicious bytes reach OS network stack; origin CPU at 4%', status: 'success' }
      ],
      latencyValue: 10,
      latencyUnit: 'ns',
      decimals: 0,
      outputSummary: 'Record 2.4 Tbps flood mitigated at wire speed across 330+ global PoPs in 10ns. Origin server CPU remained untouched at 4%.'
    }
  }
];

/* --------------------------------------------------------------------------
   Individual Case Study Card Component (Self-Contained Simulation Engine)
   -------------------------------------------------------------------------- */
const CaseStudyCard: React.FC<{
  cs: CaseStudyItem;
  isCurrentCard: boolean;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
}> = ({ cs, isCurrentCard, onMouseMove }) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStatus, setSimStatus] = useState<'idle' | 'running' | 'completed'>('idle');
  const [currentExecutingStep, setCurrentExecutingStep] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [justCompletedStep, setJustCompletedStep] = useState<number | null>(null);
  const [displayLatency, setDisplayLatency] = useState<string>('0');
  const [progressPercent, setProgressPercent] = useState<number>(0);

  const timersRef = useRef<number[]>([]);
  const rafRef = useRef<number | null>(null);

  const clearAllTimers = () => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearAllTimers();
  }, []);

  const animateLatency = () => {
    const target = cs.simulation.latencyValue;
    const decimals = cs.simulation.decimals;
    const duration = 650;
    const startTime = performance.now();

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = ease * target;

      setDisplayLatency(decimals > 0 ? current.toFixed(decimals) : Math.round(current).toString());

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        setDisplayLatency(decimals > 0 ? target.toFixed(decimals) : target.toString());
      }
    };

    rafRef.current = requestAnimationFrame(frame);
  };

  const runSimulation = () => {
    clearAllTimers();
    setIsSimulating(true);
    setSimStatus('running');
    setCurrentExecutingStep(0);
    setCompletedSteps([]);
    setJustCompletedStep(null);
    setProgressPercent(10);
    setDisplayLatency('0');

    // Step 0: 0ms to 450ms
    const t1 = window.setTimeout(() => {
      setCompletedSteps([0]);
      setJustCompletedStep(0);
      setCurrentExecutingStep(1);
      setProgressPercent(35);
    }, 450);

    // Step 1: 450ms to 950ms
    const t2 = window.setTimeout(() => {
      setCompletedSteps([0, 1]);
      setJustCompletedStep(1);
      setCurrentExecutingStep(2);
      setProgressPercent(60);
    }, 950);

    // Step 2: 950ms to 1450ms
    const t3 = window.setTimeout(() => {
      setCompletedSteps([0, 1, 2]);
      setJustCompletedStep(2);
      setCurrentExecutingStep(3);
      setProgressPercent(85);
    }, 1450);

    // Step 3: 1450ms to 1950ms
    const t4 = window.setTimeout(() => {
      setCompletedSteps([0, 1, 2, 3]);
      setJustCompletedStep(3);
      setSimStatus('completed');
      setProgressPercent(100);
      animateLatency();
    }, 1950);

    timersRef.current = [t1, t2, t3, t4];
  };

  const exitSimulation = () => {
    clearAllTimers();
    setIsSimulating(false);
    setSimStatus('idle');
    setCompletedSteps([]);
    setJustCompletedStep(null);
    setCurrentExecutingStep(0);
    setProgressPercent(0);
  };

  return (
    <div
      onMouseMove={onMouseMove}
      className={`sts-case-card sts-spotlight-card ${isCurrentCard ? 'sts-card-active' : ''} ${
        isSimulating && simStatus === 'running' ? 'simulating' : ''
      }`}
      style={{
        scrollSnapAlign: 'start',
        flexShrink: 0,
        width: 'clamp(340px, 40vw, 440px)',
        background: isCurrentCard ? 'rgba(255, 255, 255, 0.035)' : 'rgba(255, 255, 255, 0.018)',
        backdropFilter: 'blur(16px)',
        border: isCurrentCard ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '28px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        if (!(isSimulating && simStatus === 'running')) {
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.045)';
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow =
            '0 20px 40px -12px rgba(0, 0, 0, 0.8), 0 0 24px -4px rgba(255, 255, 255, 0.08)';
        }
      }}
      onMouseLeave={(e) => {
        if (!(isSimulating && simStatus === 'running')) {
          e.currentTarget.style.borderColor = isCurrentCard
            ? 'rgba(255, 255, 255, 0.2)'
            : 'rgba(255, 255, 255, 0.08)';
          e.currentTarget.style.background = isCurrentCard
            ? 'rgba(255, 255, 255, 0.035)'
            : 'rgba(255, 255, 255, 0.018)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      {/* Specular Spotlight Gradient Overlay */}
      <div
        className="sts-card-spotlight"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0,
          transition: 'opacity 0.3s ease',
          background:
            'radial-gradient(400px circle at var(--mouse-x, 150px) var(--mouse-y, 100px), rgba(255, 255, 255, 0.07), transparent 70%)'
        }}
      />

      {/* Top Row: Company Logo + Brand Name + Category Chip */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {cs.logo}
          <h3
            style={{
              fontFamily: 'var(--sts-font-display, sans-serif)',
              fontSize: '22px',
              fontWeight: 700,
              color: '#FFFFFF',
              margin: 0,
              letterSpacing: '-0.025em',
              lineHeight: 1.15
            }}
          >
            {cs.company}
          </h3>
        </div>

        <span
          style={{
            fontFamily: 'var(--sts-font-mono, monospace)',
            fontSize: '10px',
            color: '#A3A3A3',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '3px 8px',
            borderRadius: '4px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            letterSpacing: '0.06em'
          }}
        >
          {cs.category}
        </span>
      </div>

      {/* Context Description */}
      <p
        style={{
          fontFamily: 'var(--sts-font-body, sans-serif)',
          fontSize: '14.5px',
          color: '#E5E5E5',
          lineHeight: 1.5,
          margin: 0,
          fontWeight: 450
        }}
      >
        {cs.context}
      </p>

      {/* Hairline Divider */}
      <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.06)', margin: '0' }} />

      {/* Narrative Section vs. Live Telemetry Simulator */}
      {!isSimulating ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* The Bottleneck */}
          <div>
            <div
              style={{
                fontFamily: 'var(--sts-font-mono, monospace)',
                fontSize: '10.5px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#737373',
                marginBottom: '5px'
              }}
            >
              THE BOTTLENECK
            </div>
            <p
              style={{
                fontFamily: 'var(--sts-font-body, sans-serif)',
                fontSize: '13.5px',
                color: '#A3A3A3',
                lineHeight: 1.55,
                margin: 0
              }}
            >
              {cs.bottleneck}
            </p>
          </div>

          {/* The Mechanism */}
          <div>
            <div
              style={{
                fontFamily: 'var(--sts-font-mono, monospace)',
                fontSize: '10.5px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#FFFFFF',
                marginBottom: '5px'
              }}
            >
              THE MECHANISM
            </div>
            <p
              style={{
                fontFamily: 'var(--sts-font-body, sans-serif)',
                fontSize: '13.5px',
                color: '#D4D4D4',
                lineHeight: 1.55,
                margin: 0
              }}
            >
              {cs.mechanism}
            </p>
          </div>
        </div>
      ) : (
        /* Live Sequential Telemetry Terminal */
        <div className="sts-sim-terminal">
          <div className="sts-sim-terminal-bar">
            <div className="sts-sim-terminal-title">
              <span className={`sts-sim-status-dot ${simStatus === 'running' ? 'pulsing' : ''}`} />
              <span>LIVE TELEMETRY SIMULATOR</span>
            </div>
            <div>
              {simStatus === 'running' ? (
                <span className="sts-sim-live-badge">RUNNING STEP {currentExecutingStep + 1}/4</span>
              ) : (
                <span className="sts-sim-settled-badge">EXECUTION COMPLETE</span>
              )}
            </div>
          </div>

          {/* Sequential Execution Steps */}
          <div className="sts-sim-steps">
            {cs.simulation.steps.map((st, i) => {
              const isCompleted = completedSteps.includes(i);
              const isExecuting = simStatus === 'running' && currentExecutingStep === i;
              const isUpcoming = !isCompleted && !isExecuting;
              const isJustFinished = justCompletedStep === i;

              return (
                <div
                  key={i}
                  className={`sts-sim-step ${isCompleted ? 'completed' : ''} ${
                    isExecuting ? 'executing' : ''
                  } ${isUpcoming ? 'upcoming' : ''} ${isJustFinished ? 'just-completed' : ''}`}
                >
                  <div className="sts-sim-step-indicator">
                    {isExecuting ? (
                      <span className="sts-sim-spinner" />
                    ) : isCompleted ? (
                      <span className="sts-sim-check-dot">✓</span>
                    ) : (
                      <span className="sts-sim-idle-dot" />
                    )}
                    <span className="sts-sim-step-num">[0{i + 1}]</span>
                  </div>

                  <div className="sts-sim-step-content">
                    <div className="sts-sim-step-label">{st.label}</div>
                    <div className="sts-sim-step-detail">{st.detail}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Payoff Result Box (Lands Last with Counting Latency) */}
          {simStatus === 'completed' && (
            <div className="sts-sim-result-box">
              <div className="sts-sim-result-header">
                <span className="sts-sim-result-badge">VERIFIED EXECUTION RESULT</span>
                <div className="sts-sim-latency-badge">
                  <span className="sts-sim-latency-lbl">LATENCY</span>
                  <span className="sts-sim-latency-val">
                    {displayLatency}
                    <small>{cs.simulation.latencyUnit}</small>
                  </span>
                </div>
              </div>
              <p className="sts-sim-result-summary">{cs.simulation.outputSummary}</p>
            </div>
          )}
        </div>
      )}

      {/* Dynamic Action Controls: Morphing Button & Quiet Ghost Exit */}
      <div className="sts-sim-action-group">
        <button
          className={`sts-sim-action-btn ${simStatus === 'running' ? 'running' : simStatus === 'completed' ? 'completed' : 'idle'}`}
          onClick={runSimulation}
          disabled={simStatus === 'running'}
          aria-label={
            simStatus === 'running'
              ? 'Simulation in progress'
              : simStatus === 'completed'
              ? 'Simulate again'
              : 'Simulate mechanism'
          }
        >
          {simStatus === 'running' && (
            <div className="sts-sim-btn-progress-fill" style={{ width: `${progressPercent}%` }} />
          )}

          <span className="sts-sim-btn-content">
            {simStatus === 'running' ? (
              <>
                <span className="sts-sim-btn-spinner" />
                <span>
                  EXECUTING STEP {currentExecutingStep + 1}/4 ({Math.round(progressPercent)}%)
                </span>
              </>
            ) : simStatus === 'completed' ? (
              <>
                <RotateCcw size={12} />
                <span>SIMULATE AGAIN</span>
              </>
            ) : (
              <>
                <Zap size={12} />
                <span>SIMULATE MECHANISM</span>
              </>
            )}
          </span>
        </button>

        {isSimulating && (
          <button
            type="button"
            className="sts-sim-ghost-exit"
            onClick={exitSimulation}
            aria-label="Exit simulation"
          >
            <X size={11} />
            <span>Exit Simulation</span>
          </button>
        )}
      </div>

      {/* Production Metric Proof Line */}
      <div style={{ paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div
          style={{
            fontFamily: 'var(--sts-font-mono, monospace)',
            fontSize: '12px',
            color: '#FFFFFF',
            lineHeight: 1.5,
            fontWeight: 500
          }}
        >
          ✓ {cs.metric}
        </div>
      </div>
    </div>
  );
};

/* --------------------------------------------------------------------------
   CaseStudies Section Container
   -------------------------------------------------------------------------- */
export const CaseStudies: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  // Drag-to-scroll mouse state
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  // Spotlight mouse effect per card
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  // Scroll to a specific card index (0 to 5)
  const scrollToIndex = (index: number) => {
    if (!trackRef.current) return;
    const clampedIndex = Math.min(Math.max(index, 0), CASE_STUDIES_DATA.length - 1);
    const cards = trackRef.current.querySelectorAll('.sts-case-card');
    const targetCard = cards[clampedIndex] as HTMLElement;

    if (targetCard) {
      const targetLeft = targetCard.offsetLeft - trackRef.current.offsetLeft;
      trackRef.current.scrollTo({ left: targetLeft, behavior: 'smooth' });
      setActiveCardIndex(clampedIndex);
    }
  };

  const scrollPrev = () => scrollToIndex(activeCardIndex - 1);
  const scrollNext = () => scrollToIndex(activeCardIndex + 1);

  // Track scroll updates to keep counter and progress bar perfectly in sync
  const handleScroll = () => {
    if (!trackRef.current) return;
    const { scrollLeft } = trackRef.current;
    const cards = trackRef.current.querySelectorAll('.sts-case-card');
    if (!cards.length) return;

    let closestIndex = 0;
    let minDiff = Infinity;
    cards.forEach((card, i) => {
      const cardLeft = (card as HTMLElement).offsetLeft - trackRef.current!.offsetLeft;
      const diff = Math.abs(cardLeft - scrollLeft);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    });

    setActiveCardIndex(closestIndex);
  };

  // Mouse Drag to Scroll handlers
  const onMouseDown = (e: React.MouseEvent) => {
    if (!trackRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - trackRef.current.offsetLeft;
    scrollLeftStart.current = trackRef.current.scrollLeft;
    trackRef.current.style.cursor = 'grabbing';
    trackRef.current.style.userSelect = 'none';
  };

  const onMouseMoveDrag = (e: React.MouseEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    trackRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  const onMouseUpOrLeave = () => {
    if (!trackRef.current) return;
    isDragging.current = false;
    trackRef.current.style.cursor = 'grab';
    trackRef.current.style.removeProperty('user-select');
  };

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced || !trackRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        trackRef.current?.children || [],
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="case-studies"
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
      <div className="sts-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header with Navigation Controls */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '24px',
            marginBottom: '40px'
          }}
        >
          {/* Section Titles */}
          <div>
            <div className="sts-eyebrow" style={{ marginBottom: '10px' }}>
              <span>PRODUCTION CASE STUDIES</span>
            </div>

            <h2
              style={{
                fontFamily: 'var(--sts-font-display, sans-serif)',
                fontSize: 'clamp(32px, 4.5vw, 44px)',
                fontWeight: 600,
                letterSpacing: '-0.035em',
                lineHeight: 1.12,
                marginBottom: '10px',
                color: '#FFFFFF'
              }}
            >
              How real systems solved it.
            </h2>

            <p
              style={{
                fontFamily: 'var(--sts-font-body, sans-serif)',
                fontSize: '15px',
                color: 'var(--sts-muted, #9CA3AF)',
                lineHeight: 1.5,
                margin: 0
              }}
            >
              Battle-tested production mechanisms from engineering giants.
            </p>
          </div>

          {/* Interactive Navigation HUD: Counter & Controls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '6px 14px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            {/* Step Counter — 01 to 06 */}
            <span
              style={{
                fontFamily: 'var(--sts-font-mono, monospace)',
                fontSize: '12px',
                color: '#A3A3A3',
                letterSpacing: '0.08em'
              }}
            >
              <strong style={{ color: '#FFFFFF' }}>0{activeCardIndex + 1}</strong> / 0{CASE_STUDIES_DATA.length}
            </span>

            {/* Subtle Divider */}
            <div style={{ width: '1px', height: '14px', background: 'rgba(255, 255, 255, 0.12)' }} />

            {/* Left Button */}
            <button
              onClick={scrollPrev}
              disabled={activeCardIndex === 0}
              aria-label="Previous case study"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: activeCardIndex === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.08)',
                color: activeCardIndex === 0 ? '#404040' : '#FFFFFF',
                cursor: activeCardIndex === 0 ? 'not-allowed' : 'pointer',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (activeCardIndex !== 0) {
                  e.currentTarget.style.background = '#FFFFFF';
                  e.currentTarget.style.color = '#000000';
                }
              }}
              onMouseLeave={(e) => {
                if (activeCardIndex !== 0) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.color = '#FFFFFF';
                }
              }}
            >
              ←
            </button>

            {/* Right Button */}
            <button
              onClick={scrollNext}
              disabled={activeCardIndex >= CASE_STUDIES_DATA.length - 1}
              aria-label="Next case study"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background:
                  activeCardIndex >= CASE_STUDIES_DATA.length - 1 ? 'transparent' : 'rgba(255, 255, 255, 0.08)',
                color: activeCardIndex >= CASE_STUDIES_DATA.length - 1 ? '#404040' : '#FFFFFF',
                cursor: activeCardIndex >= CASE_STUDIES_DATA.length - 1 ? 'not-allowed' : 'pointer',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (activeCardIndex < CASE_STUDIES_DATA.length - 1) {
                  e.currentTarget.style.background = '#FFFFFF';
                  e.currentTarget.style.color = '#000000';
                }
              }}
              onMouseLeave={(e) => {
                if (activeCardIndex < CASE_STUDIES_DATA.length - 1) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.color = '#FFFFFF';
                }
              }}
            >
              →
            </button>
          </div>
        </div>

        {/* Sleek Horizontal Cards Track with End-Padding for full 01-06 navigation */}
        <div
          ref={trackRef}
          onScroll={handleScroll}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMoveDrag}
          onMouseUp={onMouseUpOrLeave}
          onMouseLeave={onMouseUpOrLeave}
          className="sts-hide-scrollbar sts-case-studies-track"
          style={{
            display: 'flex',
            gap: '24px',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            cursor: 'grab',
            paddingTop: '16px',
            marginTop: '-8px',
            paddingBottom: '20px',
            paddingRight: 'calc(100% - clamp(340px, 40vw, 440px) - 24px)',
            scrollBehavior: 'smooth'
          }}
        >
          {CASE_STUDIES_DATA.map((cs, cardIdx) => (
            <CaseStudyCard
              key={cs.id}
              cs={cs}
              isCurrentCard={activeCardIndex === cardIdx}
              onMouseMove={handleMouseMove}
            />
          ))}
        </div>

        {/* Segmented Monochrome Progress System */}
        <div
          style={{
            maxWidth: '380px',
            margin: '32px auto 0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          {/* Segmented Clickable Breadcrumb Pills (One for each case study) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              width: '100%'
            }}
          >
            {CASE_STUDIES_DATA.map((cs, idx) => {
              const isSelected = activeCardIndex === idx;

              return (
                <button
                  key={cs.id}
                  onClick={() => scrollToIndex(idx)}
                  title={`Jump to ${cs.company}`}
                  aria-label={`Jump to ${cs.company}`}
                  style={{
                    flex: isSelected ? '1.8' : '1',
                    height: '6px',
                    borderRadius: '9999px',
                    background: isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.15)',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 0 10px rgba(255, 255, 255, 0.7)' : 'none',
                    transition: 'all 0.25s cubic-bezier(0.22, 1, 0.32, 1)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                    }
                  }}
                />
              );
            })}
          </div>

          {/* Active Company Name & Action Tip */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              fontSize: '11px',
              fontFamily: 'var(--sts-font-mono, monospace)',
              color: '#737373',
              letterSpacing: '0.06em'
            }}
          >
            <span>
              ACTIVE: <strong style={{ color: '#FFFFFF' }}>{CASE_STUDIES_DATA[activeCardIndex].company}</strong>
            </span>
            <span>DRAG OR CLICK BARS TO NAVIGATE</span>
          </div>
        </div>
      </div>

      <style>{`
        .sts-spotlight-card:hover .sts-card-spotlight {
          opacity: 1 !important;
        }
        @media (max-width: 768px) {
          .sts-case-studies-track {
            gap: 16px !important;
            padding-right: 20px !important;
          }
          .sts-case-card {
            width: 86vw !important;
          }
        }
      `}</style>
    </section>
  );
};
