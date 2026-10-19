import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { TopicData } from '../../data/topics';
import {
  ArrowLeft,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Cpu,
  Zap,
  Repeat,
  Radio,
  Activity
} from 'lucide-react';
import styles from '../../styles/circuitPipelineHero.module.css';

interface CircuitPipelineHeroProps {
  topic: TopicData;
}

interface LogEntry {
  time: string;
  stage: string;
  text: string;
  type: 'info' | 'alert' | 'success';
}

const STAGES = [
  {
    id: 1,
    badge: 'STAGE 01 // INGRESS',
    title: 'Ingestion Webhook',
    desc: 'Validates HMAC signature, buffers raw payload, generates SHA-256 idempotency key.',
    nominalLatency: '12ms'
  },
  {
    id: 2,
    badge: 'STAGE 02 // DEDUPE',
    title: 'Payload Hash & Lock',
    desc: 'Atomic SETNX lock acquisition in Redis cluster to discard duplicate parallel deliveries.',
    nominalLatency: '34ms'
  },
  {
    id: 3,
    badge: 'STAGE 03 // DISPATCH',
    title: 'Upstream API Dispatch',
    desc: 'Dispatches payload to upstream cluster. Evaluates circuit breaker and backoff rules.',
    nominalLatency: '1,180ms'
  },
  {
    id: 4,
    badge: 'STAGE 04 // SETTLE',
    title: 'Idempotent Settlement',
    desc: 'Commits state transition to primary replica, publishes completion event, releases lock.',
    nominalLatency: '45ms'
  }
];

export const CircuitPipelineHero: React.FC<CircuitPipelineHeroProps> = ({ topic }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const logsContainerRef = useRef<HTMLDivElement>(null);

  // Simulation State
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isFaultActive, setIsFaultActive] = useState<boolean>(true);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [inBackoffLoop, setInBackoffLoop] = useState<boolean>(false);
  const [backoffCountdown, setBackoffCountdown] = useState<number>(0);

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      time: '[+0.00s]',
      stage: 'SYS-INIT',
      text: 'Circuit state machine loaded. Pipeline idling on standby.',
      type: 'info'
    }
  ]);

  const addLog = useCallback((time: string, stage: string, text: string, type: 'info' | 'alert' | 'success' = 'info') => {
    setLogs((prev) => [...prev, { time, stage, text, type }]);
  }, []);

  // Auto-scroll logs
  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Reset Pipeline
  const handleReset = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setRetryCount(0);
    setInBackoffLoop(false);
    setBackoffCountdown(0);
    setLogs([
      {
        time: '[+0.00s]',
        stage: 'RESET',
        text: 'Pipeline state reset to STANDBY. Conduits discharged.',
        type: 'info'
      }
    ]);
  };

  // Trigger Pipeline Execution
  const handleTrigger = () => {
    if (isRunning) return;
    setIsRunning(true);
    setCurrentStep(1);
    setRetryCount(0);
    setInBackoffLoop(false);
    setBackoffCountdown(0);
    setLogs([
      {
        time: '[+0.00s]',
        stage: 'INGRESS',
        text: 'Webhook received. Raw payload signature verified. SHA-256 hash: 7f8a9e4d0b...',
        type: 'info'
      }
    ]);
  };

  // State Machine Step Progression
  useEffect(() => {
    if (!isRunning) return;

    // STAGE 1: Ingestion
    if (currentStep === 1) {
      const timer = setTimeout(() => {
        addLog('[+1.00s]', 'SCHEMA', 'Payload validated against schema v2. Passing to deduplication engine.', 'info');
        setCurrentStep(2);
      }, 1000);
      return () => clearTimeout(timer);
    }

    // STAGE 2: Hash & Idempotency Lock
    if (currentStep === 2) {
      const timer = setTimeout(() => {
        addLog('[+2.10s]', 'LOCK_ACQUIRED', 'Redis key idempotency:7f8a9e locked (TTL=60s). Zero deduplication collisions.', 'info');
        setCurrentStep(3);
      }, 1100);
      return () => clearTimeout(timer);
    }

    // STAGE 3: Upstream Dispatch with Potential Fault
    if (currentStep === 3) {
      if (isFaultActive && retryCount === 0) {
        // Trigger Fault Injection
        const timer = setTimeout(() => {
          addLog('[+3.30s]', 'FAULT_503', 'Upstream gateway returned HTTP 503 Service Unavailable (Overloaded).', 'alert');
          addLog('[+3.35s]', 'BACKOFF_CALC', 'Calculating backoff: t = 2^1 * 1000ms + uniform_jitter(240ms) = 2,240ms.', 'alert');
          setRetryCount(1);
          setInBackoffLoop(true);
          setBackoffCountdown(2.2);

          // Interval to count down backoff
          const countdownInterval = setInterval(() => {
            setBackoffCountdown((prev) => {
              if (prev <= 0.2) {
                clearInterval(countdownInterval);
                return 0;
              }
              return Number((prev - 0.2).toFixed(1));
            });
          }, 200);

          // After backoff duration, retry
          setTimeout(() => {
            clearInterval(countdownInterval);
            setInBackoffLoop(false);
            addLog('[+5.60s]', 'RETRY_DISPATCH', 'Retry #1 dispatched. Upstream API acknowledged HTTP 200 OK.', 'success');
            setCurrentStep(4);
          }, 2240);
        }, 1200);
        return () => clearTimeout(timer);
      } else {
        // Normal dispatch without fault
        const timer = setTimeout(() => {
          addLog('[+3.40s]', 'DISPATCH_OK', 'Upstream third-party API acknowledged HTTP 200 OK (Latency: 180ms).', 'success');
          setCurrentStep(4);
        }, 1200);
        return () => clearTimeout(timer);
      }
    }

    // STAGE 4: Idempotent Settlement
    if (currentStep === 4) {
      const timer = setTimeout(() => {
        addLog('[+6.60s]', 'STATE_SETTLED', 'State transition committed to primary DB. Redis lock released cleanly.', 'success');
        addLog('[+6.65s]', 'RUN_COMPLETE', 'Pipeline run settled successfully without cascade failure. Total duration: 6.65s.', 'success');
        setIsRunning(false);
      }, 1100);
      return () => clearTimeout(timer);
    }
  }, [isRunning, currentStep, isFaultActive, retryCount, addLog]);

  // Background PCB Circuit Canvas Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let W = (canvas.width = container.offsetWidth);
    let H = (canvas.height = container.offsetHeight);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Track points for PCB circuit traces
    interface CircuitTrace {
      startX: number;
      startY: number;
      midX: number;
      midY: number;
      endX: number;
      endY: number;
      pulseProgress: number;
      pulseSpeed: number;
    }

    const traces: CircuitTrace[] = [];
    const numTraces = Math.min(24, Math.floor(W / 60));

    for (let i = 0; i < numTraces; i++) {
      const startX = (i / numTraces) * W + Math.random() * 40;
      const startY = Math.random() * H * 0.4;
      const midX = startX + (Math.random() > 0.5 ? 40 : -40);
      const midY = startY + 50 + Math.random() * 60;
      const endX = midX;
      const endY = midY + 80 + Math.random() * 120;

      traces.push({
        startX,
        startY,
        midX,
        midY,
        endX,
        endY,
        pulseProgress: Math.random(),
        pulseSpeed: 0.003 + Math.random() * 0.005
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';

      for (let i = 0; i < traces.length; i++) {
        const tr = traces[i];

        // Draw track
        ctx.beginPath();
        ctx.moveTo(tr.startX, tr.startY);
        ctx.lineTo(tr.midX, tr.midY);
        ctx.lineTo(tr.endX, tr.endY);
        ctx.stroke();

        // Trace terminal via pads
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.fillRect(tr.startX - 1.5, tr.startY - 1.5, 3, 3);
        ctx.fillRect(tr.endX - 1.5, tr.endY - 1.5, 3, 3);

        // Travelling electron current pulse
        tr.pulseProgress += tr.pulseSpeed;
        if (tr.pulseProgress > 1) tr.pulseProgress = 0;

        let px: number, py: number;
        if (tr.pulseProgress < 0.5) {
          const t = tr.pulseProgress * 2;
          px = tr.startX + (tr.midX - tr.startX) * t;
          py = tr.startY + (tr.midY - tr.startY) * t;
        } else {
          const t = (tr.pulseProgress - 0.5) * 2;
          px = tr.midX + (tr.endX - tr.midX) * t;
          py = tr.midY + (tr.endY - tr.midY) * t;
        }

        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 4;
        ctx.fillRect(px - 1, py - 1, 2, 2);
        ctx.shadowBlur = 0;
      }

      if (!prefersReducedMotion) {
        animId = requestAnimationFrame(draw);
      }
    };

    const onResize = () => {
      W = canvas.width = container.offsetWidth;
      H = canvas.height = container.offsetHeight;
    };

    window.addEventListener('resize', onResize);
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <section className={styles.heroContainer} ref={containerRef}>
      {/* Background Circuit Trace Canvas */}
      <canvas ref={canvasRef} className={styles.circuitCanvas} />

      {/* Atmospheric Contrast Reading Vignette */}
      <div className={styles.vignetteOverlay} />

      <div className={styles.contentWrapper}>
        {/* Breadcrumb Navigation */}
        <div className={styles.breadcrumbRow}>
          <Link to="/topics" className={styles.breadcrumbLink} title="Return to All Domains">
            <ArrowLeft size={13} />
            <span>All Domains</span>
          </Link>
          <span className={styles.breadcrumbDivider}>//</span>
          <span className={styles.breadcrumbTag}>{topic.badge || 'SYS-01'}</span>
          <span className={styles.breadcrumbDivider}>//</span>
          <span className={styles.breadcrumbTag}>STATE MACHINE SIMULATOR</span>
        </div>

        {/* Header Grid: Left Headline & Scope, Right Verified Fact */}
        <div className={styles.headerGrid}>
          <div className={styles.titleArea}>
            <div className={styles.eyebrowBadge}>
              <span className={styles.beaconDot} />
              <span className={styles.eyebrowText}>TOPIC OVERVIEW // ARCHIVE ARCHITECTURE</span>
            </div>

            <h1 className={styles.headline}>{topic.name}</h1>
            <p className={styles.hookText}>{topic.hook}</p>
            <p className={styles.scopeText}>{topic.scopeParagraph}</p>

            {/* Mechanism Tags */}
            <div className={styles.tagsRow}>
              {topic.mechanismPills.map((pill, idx) => (
                <span key={idx} className={styles.tagPill}>
                  {pill}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Verified Research Fact Box */}
          <div className={styles.factCard}>
            <span className={styles.factCornerTL}>+</span>
            <span className={styles.factCornerBR}>+</span>

            <div className={styles.factHeader}>
              <span className={styles.factPulseDot} />
              <span>Verified Benchmark</span>
            </div>

            <div className={styles.factMetric}>41.2%</div>
            <div className={styles.factMetricLabel}>Median Deflection vs. 70% Potential</div>

            <p className={styles.factBody}>
              {topic.verifiedFact ||
                'Enterprise deflection sits at just 41.2% across business automations. The gap between headline claims and actual production resilience is the mechanism.'}
            </p>
          </div>
        </div>

        {/* =====================================================================
            THE CIRCUIT PIPELINE REACTOR CONSOLE
            ===================================================================== */}
        <div className={styles.reactorConsole}>
          {/* Console Toolbar */}
          <div className={styles.consoleToolbar}>
            <div className={styles.consoleTitleArea}>
              <span className={styles.consoleBadge}>REACTOR</span>
              <span className={styles.consoleTitle}>Fault Injection & Exponential Backoff Loop</span>
            </div>

            <div className={styles.consoleControls}>
              {/* Mechanical Toggle for 503 Fault Injection */}
              <div
                className={styles.mechanicalToggle}
                onClick={() => !isRunning && setIsFaultActive(!isFaultActive)}
                title="Toggle upstream HTTP 503 Service Unavailable fault simulation"
                style={{ opacity: isRunning ? 0.6 : 1, cursor: isRunning ? 'not-allowed' : 'pointer' }}
              >
                <div className={`${styles.toggleSwitchTrack} ${isFaultActive ? styles.toggleTrackActive : ''}`}>
                  <div className={`${styles.toggleThumb} ${isFaultActive ? styles.toggleThumbActive : ''}`} />
                </div>
                <span className={styles.toggleLabel}>
                  <span className={`${styles.toggleDiode} ${isFaultActive ? styles.toggleDiodeActive : ''}`} />
                  Inject 503 Fault: {isFaultActive ? 'ARMED' : 'BYPASS'}
                </span>
              </div>

              {/* Initiate Pipeline Execution Button */}
              <button
                className={styles.triggerBtn}
                onClick={handleTrigger}
                disabled={isRunning}
                title="Execute the live circuit state machine"
              >
                {isRunning ? (
                  <>
                    <Activity size={14} className="animate-spin" />
                    <span>Executing Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Play size={13} fill="#080808" />
                    <span>Initiate Pipeline</span>
                  </>
                )}
              </button>

              {/* Reset Button */}
              <button
                className={styles.resetBtn}
                onClick={handleReset}
                title="Reset state machine to standby"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          {/* Circuit Diagram & Stage Nodes */}
          <div className={styles.circuitStageContainer}>
            <div className={styles.stageCardsGrid}>
              {STAGES.map((stg) => {
                const isCurrent = currentStep === stg.id;
                const isDone = currentStep > stg.id || (!isRunning && currentStep === 4);
                const isFaulting = stg.id === 3 && inBackoffLoop;

                let cardClass = styles.stageCard;
                if (isFaulting) cardClass += ` ${styles.stageCardFault}`;
                else if (isCurrent) cardClass += ` ${styles.stageCardActive}`;
                else if (isDone) cardClass += ` ${styles.stageCardSettled}`;

                return (
                  <div key={stg.id} className={cardClass}>
                    <div className={styles.stageTopRow}>
                      <span className={styles.stageNumberBadge}>{stg.badge}</span>
                      <div className={styles.stageIconWrap}>
                        {isDone ? (
                          <CheckCircle2 size={15} color="#FFFFFF" />
                        ) : isFaulting ? (
                          <AlertTriangle size={15} color="#FFFFFF" />
                        ) : isCurrent ? (
                          <Clock size={15} color="#FFFFFF" className="animate-spin" />
                        ) : (
                          <Radio size={14} style={{ opacity: 0.35 }} />
                        )}
                      </div>
                    </div>

                    <h4 className={styles.stageTitle}>{stg.title}</h4>
                    <p className={styles.stageDesc}>{stg.desc}</p>

                    <div className={styles.stageMetaRow}>
                      <span
                        className={`${styles.stageStatusPill} ${
                          isFaulting
                            ? styles.statusPillFault
                            : isCurrent
                            ? styles.statusPillActive
                            : isDone
                            ? styles.statusPillSettled
                            : ''
                        }`}
                      >
                        {isFaulting
                          ? `503 RETRY (${backoffCountdown}s)`
                          : isCurrent
                          ? 'ACTIVE [RUN]'
                          : isDone
                          ? 'SETTLED [OK]'
                          : 'STANDBY'}
                      </span>
                      <span className={styles.stageLatency}>{stg.nominalLatency}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Physical Exponential Backoff Loop Banner / Conduit */}
            <div className={`${styles.backoffLoopBanner} ${inBackoffLoop ? styles.backoffBannerActive : ''}`}>
              <div className={styles.backoffLoopLeft}>
                <Repeat size={14} className={styles.backoffIcon} />
                <span className={styles.backoffLabel}>
                  {inBackoffLoop
                    ? `⚠ FAULT DETECTED: EXPONENTIAL BACKPRESSURE LOOP ACTIVE`
                    : `CIRCUIT CONDUIT: EXPONENTIAL BACKOFF RECOVERY MECHANISM`}
                </span>
              </div>
              <div className={styles.backoffFormula}>
                {inBackoffLoop ? (
                  <span>
                    SLEEPING WORKER: <strong>{backoffCountdown}s REMAINING</strong>
                  </span>
                ) : (
                  <span>t = 2^k × 1000ms + uniform_jitter(240ms)</span>
                )}
              </div>
            </div>
          </div>

          {/* Stream Telemetry Terminal */}
          <div className={styles.terminalConsole}>
            <div className={styles.terminalHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: isRunning ? '#FFFFFF' : 'rgba(255, 255, 255, 0.4)',
                    boxShadow: isRunning ? '0 0 6px #FFFFFF' : 'none'
                  }}
                />
                <span className={styles.terminalTitle}>Runner Dispatch Telemetry</span>
              </div>
              <span className={styles.terminalStatusBadge}>
                {isRunning ? (inBackoffLoop ? 'STATUS: IN_BACKOFF_DELAY' : 'STATUS: DISPATCHING') : 'STATUS: IDLE'}
              </span>
            </div>

            <div className={styles.terminalLogs} ref={logsContainerRef}>
              {logs.map((lg, idx) => (
                <div key={idx} className={styles.logEntry}>
                  <span className={styles.logTimestamp}>{lg.time}</span>
                  <span
                    className={`${styles.logMessage} ${
                      lg.type === 'alert'
                        ? styles.logMessageAlert
                        : lg.type === 'success'
                        ? styles.logMessageSuccess
                        : ''
                    }`}
                  >
                    [{lg.stage}] {lg.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
