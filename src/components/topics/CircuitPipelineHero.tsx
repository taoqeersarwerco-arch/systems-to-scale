import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { TopicData } from '../../data/topics';
import { ArrowLeft, Play, RotateCcw, Activity } from 'lucide-react';
import styles from '../../styles/circuitPipelineHero.module.css';

interface CircuitPipelineHeroProps {
  topic: TopicData;
}

type SimStageState =
  | 'idle'
  | 's1_ingress'
  | 's1_to_s2'
  | 's2_dedupe'
  | 's2_to_s3'
  | 's3_dispatch'
  | 's3_fault_loop'
  | 's3_retry_burst'
  | 's3_to_s4'
  | 's4_settle'
  | 'completed';

interface Ripple {
  x: number;
  y: number;
  r: number;
  maxR: number;
  alpha: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
}

export const CircuitPipelineHero: React.FC<CircuitPipelineHeroProps> = ({ topic }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Simulation State
  const [stageState, setStageState] = useState<SimStageState>('idle');
  const [isFaultArmed, setIsFaultArmed] = useState<boolean>(true);
  const [backoffRemaining, setBackoffRemaining] = useState<number>(0);
  const [tickerMessage, setTickerMessage] = useState<string>(
    'Circuit state machine on standby. Ready for execution trigger.'
  );
  const [activeStageToken, setActiveStageToken] = useState<string>('STANDBY');
  const [stepLatency, setStepLatency] = useState<string>('0ms');

  // Animation Refs
  const stateRef = useRef<SimStageState>('idle');
  const stateStartTimeRef = useRef<number>(0);
  const faultArmedRef = useRef<boolean>(true);
  const animTimeRef = useRef<number>(0);
  const ripplesRef = useRef<Ripple[]>([]);
  const sparksRef = useRef<Spark[]>([]);

  useEffect(() => {
    stateRef.current = stageState;
    stateStartTimeRef.current = performance.now();
  }, [stageState]);

  useEffect(() => {
    faultArmedRef.current = isFaultArmed;
  }, [isFaultArmed]);

  // Reset Pipeline
  const handleReset = () => {
    setStageState('idle');
    stateRef.current = 'idle';
    setBackoffRemaining(0);
    setActiveStageToken('STANDBY');
    setStepLatency('0ms');
    setTickerMessage('Pipeline state reset. Conduits discharged. Ready for trigger.');
    ripplesRef.current = [];
    sparksRef.current = [];
  };

  // Trigger Execution
  const handleInitiate = () => {
    if (stageState !== 'idle' && stageState !== 'completed') return;

    setStageState('s1_ingress');
    stateRef.current = 's1_ingress';
    setActiveStageToken('01 // INGRESS');
    setStepLatency('12ms');
    setTickerMessage('Webhook payload received. Signature HMAC verified against secret key.');
  };

  // State Machine Timers & Sequence Orchestrator
  useEffect(() => {
    if (stageState === 'idle' || stageState === 'completed') return;

    let timeoutId: ReturnType<typeof setTimeout>;

    if (stageState === 's1_ingress') {
      timeoutId = setTimeout(() => {
        setStageState('s1_to_s2');
        setActiveStageToken('TRANSIT 1→2');
        setTickerMessage('Payload schema verified. Streaming encrypted packet to deduplication bus.');
      }, 700);
    } else if (stageState === 's1_to_s2') {
      timeoutId = setTimeout(() => {
        setStageState('s2_dedupe');
        setActiveStageToken('02 // DEDUPE');
        setStepLatency('34ms');
        setTickerMessage('SHA-256 hash generated. Acquiring atomic SETNX lock in Redis cluster.');
      }, 650);
    } else if (stageState === 's2_dedupe') {
      timeoutId = setTimeout(() => {
        setStageState('s2_to_s3');
        setActiveStageToken('TRANSIT 2→3');
        setTickerMessage('Idempotency lock granted (TTL=60s). Zero collision detected. Routing to upstream.');
      }, 750);
    } else if (stageState === 's2_to_s3') {
      timeoutId = setTimeout(() => {
        setStageState('s3_dispatch');
        setActiveStageToken('03 // DISPATCH');
        setStepLatency('1,180ms');

        if (faultArmedRef.current) {
          setTickerMessage('Upstream gateway returned HTTP 503 Service Unavailable (Capacity saturated).');
        } else {
          setTickerMessage('Upstream gateway acknowledged HTTP 200 OK (Latency: 180ms).');
        }
      }, 650);
    } else if (stageState === 's3_dispatch') {
      if (faultArmedRef.current) {
        timeoutId = setTimeout(() => {
          setStageState('s3_fault_loop');
          setActiveStageToken('503 // BACKOFF');
          setStepLatency('BACKPRESSURE: 2.24s');
          setTickerMessage('Diverting packet to exponential backoff loop: t = 2^1 * 1000ms + uniform_jitter(240ms).');
          setBackoffRemaining(2.2);

          const interval = setInterval(() => {
            setBackoffRemaining((prev) => {
              if (prev <= 0.2) {
                clearInterval(interval);
                return 0;
              }
              return Number((prev - 0.2).toFixed(1));
            });
          }, 200);

          setTimeout(() => {
            clearInterval(interval);
            setStageState('s3_retry_burst');
            setActiveStageToken('RETRY 01 // OK');
            setTickerMessage('Worker awakened. Retry #1 fired. Upstream acknowledged HTTP 200 OK.');
          }, 2240);
        }, 800);
      } else {
        timeoutId = setTimeout(() => {
          setStageState('s3_to_s4');
          setActiveStageToken('TRANSIT 3→4');
          setTickerMessage('Dispatch successful. Forwarding transaction token to settlement ledger.');
        }, 800);
      }
    } else if (stageState === 's3_retry_burst') {
      timeoutId = setTimeout(() => {
        setStageState('s3_to_s4');
        setActiveStageToken('TRANSIT 3→4');
        setTickerMessage('Retry successful. Routing transaction token to settlement ledger.');
      }, 600);
    } else if (stageState === 's3_to_s4') {
      timeoutId = setTimeout(() => {
        setStageState('s4_settle');
        setActiveStageToken('04 // SETTLE');
        setStepLatency('45ms');
        setTickerMessage('Writing immutable transition to primary DB replica. Releasing Redis lock.');
      }, 650);
    } else if (stageState === 's4_settle') {
      timeoutId = setTimeout(() => {
        setStageState('completed');
        setActiveStageToken('COMPLETED');
        setStepLatency('TOTAL: 6.65s');
        setTickerMessage('Execution complete. All stages committed idempotently without cascade failure.');
      }, 900);
    }

    return () => clearTimeout(timeoutId);
  }, [stageState]);

  // Main Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      animTimeRef.current += 0.02;
      const t = animTimeRef.current;
      const now = performance.now();

      const dpr = window.devicePixelRatio || 1;
      const displayW = canvas.clientWidth;
      const displayH = canvas.clientHeight;

      if (canvas.width !== displayW * dpr || canvas.height !== displayH * dpr) {
        canvas.width = displayW * dpr;
        canvas.height = displayH * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      const W = displayW;
      const H = displayH;

      // Clear Canvas
      ctx.clearRect(0, 0, W, H);

      // Node coordinates
      const x1 = W * 0.12;
      const x2 = W * 0.37;
      const x3 = W * 0.63;
      const x4 = W * 0.88;
      const baseY = 86;
      const nodeR = 21;

      const nodes = [
        { id: 1, x: x1, y: baseY, label: '01', title: 'INGRESS', sub: 'Webhook Gate' },
        { id: 2, x: x2, y: baseY, label: '02', title: 'DEDUPE', sub: 'SHA-256 Lock' },
        { id: 3, x: x3, y: baseY, label: '03', title: 'DISPATCH', sub: 'Upstream API' },
        { id: 4, x: x4, y: baseY, label: '04', title: 'SETTLE', sub: 'State Commit' }
      ];

      const curState = stateRef.current;
      const elapsedInState = now - stateStartTimeRef.current;

      // Stage completion flags
      const isStage1Done = curState !== 'idle' && curState !== 's1_ingress';
      const isStage2Done = ['s2_to_s3', 's3_dispatch', 's3_fault_loop', 's3_retry_burst', 's3_to_s4', 's4_settle', 'completed'].includes(curState);
      const isStage3Done = ['s3_to_s4', 's4_settle', 'completed'].includes(curState);
      const isStage4Done = curState === 'completed';

      // -----------------------------------------------------------------------
      // 1. Draw Circuit Bus Track Lines with Progressive Illumination
      // -----------------------------------------------------------------------
      // Base inactive track
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x1, baseY);
      ctx.lineTo(x4, baseY);
      ctx.stroke();

      // Segment 1→2 active glow line
      if (isStage1Done) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.moveTo(x1, baseY);
        ctx.lineTo(x2, baseY);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Segment 2→3 active glow line
      if (isStage2Done) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.moveTo(x2, baseY);
        ctx.lineTo(x3, baseY);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Segment 3→4 active glow line
      if (isStage3Done) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.moveTo(x3, baseY);
        ctx.lineTo(x4, baseY);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Ambient directional pulse blips when idle
      if (curState === 'idle') {
        const blipProg = (t * 0.35) % 1;
        const blipX = x1 + (x4 - x1) * blipProg;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 4;
        ctx.fillRect(blipX - 5, baseY - 1, 10, 2);
        ctx.shadowBlur = 0;
      }

      // -----------------------------------------------------------------------
      // 2. Draw Exponential Backoff Return Conduit Underneath Node 3
      // -----------------------------------------------------------------------
      const loopY = baseY + 66;
      const loopXStart = x3;
      const loopXEnd = x3 - 130;
      const isLoopActive = curState === 's3_fault_loop';

      ctx.beginPath();
      ctx.moveTo(loopXStart, baseY + nodeR);
      ctx.bezierCurveTo(loopXStart, loopY, loopXEnd, loopY, loopXEnd, baseY + nodeR);

      if (isLoopActive) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 2.2;
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Label below the loop
      ctx.font = '9.5px monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = isLoopActive ? '#FFFFFF' : 'rgba(237, 233, 227, 0.4)';
      ctx.fillText(
        isLoopActive ? '⚡ ACTIVE EXPONENTIAL BACKPRESSURE QUEUE' : 'RETRY CONDUIT // t = 2^k × 1000ms + JITTER',
        (loopXStart + loopXEnd) / 2,
        loopY + 16
      );

      // -----------------------------------------------------------------------
      // 3. Smooth Physical Transit for Laser Photon Packet
      // -----------------------------------------------------------------------
      let packetPos: { x: number; y: number } | null = null;
      let packetHalo = 12;

      // Smoothstep easing helper
      const smoothstep = (min: number, max: number, value: number) => {
        const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
        return x * x * (3 - 2 * x);
      };

      if (curState === 's1_to_s2') {
        const p = smoothstep(0, 650, elapsedInState);
        packetPos = { x: x1 + (x2 - x1) * p, y: baseY };
      } else if (curState === 's2_to_s3') {
        const p = smoothstep(0, 650, elapsedInState);
        packetPos = { x: x2 + (x3 - x2) * p, y: baseY };
      } else if (curState === 's3_fault_loop') {
        // Parametric Bezier transit along loop
        const loopDuration = 2240;
        const p = (elapsedInState % loopDuration) / loopDuration;

        const p0 = { x: loopXStart, y: baseY + nodeR };
        const p1 = { x: loopXStart, y: loopY };
        const p2 = { x: loopXEnd, y: loopY };
        const p3 = { x: loopXEnd, y: baseY + nodeR };

        const inv = 1 - p;
        const bx = inv * inv * inv * p0.x + 3 * inv * inv * p * p1.x + 3 * inv * p * p * p2.x + p * p * p * p3.x;
        const by = inv * inv * inv * p0.y + 3 * inv * inv * p * p1.y + 3 * inv * p * p * p2.y + p * p * p * p3.y;
        packetPos = { x: bx, y: by };
        packetHalo = 16;
      } else if (curState === 's3_to_s4') {
        const p = smoothstep(0, 650, elapsedInState);
        packetPos = { x: x3 + (x4 - x3) * p, y: baseY };
      }

      // Draw Laser Photon with Spark Tail
      if (packetPos) {
        // Spawn sparks
        if (Math.random() < 0.6) {
          sparksRef.current.push({
            x: packetPos.x + (Math.random() - 0.5) * 4,
            y: packetPos.y + (Math.random() - 0.5) * 4,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
            alpha: 0.8
          });
        }

        // Photon Outer Glow
        const radGrad = ctx.createRadialGradient(packetPos.x, packetPos.y, 0, packetPos.x, packetPos.y, packetHalo);
        radGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        radGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0.45)');
        radGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(packetPos.x, packetPos.y, packetHalo, 0, Math.PI * 2);
        ctx.fill();

        // Photon Core
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(packetPos.x, packetPos.y, 3.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // -----------------------------------------------------------------------
      // 4. Update & Render Sparks
      // -----------------------------------------------------------------------
      for (let i = sparksRef.current.length - 1; i >= 0; i--) {
        const spk = sparksRef.current[i];
        spk.x += spk.vx;
        spk.y += spk.vy;
        spk.alpha -= 0.04;

        ctx.fillStyle = `rgba(255, 255, 255, ${spk.alpha})`;
        ctx.fillRect(spk.x - 1, spk.y - 1, 2, 2);

        if (spk.alpha <= 0.02) {
          sparksRef.current.splice(i, 1);
        }
      }

      // -----------------------------------------------------------------------
      // 5. Update & Render Ripples
      // -----------------------------------------------------------------------
      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const rip = ripplesRef.current[i];
        rip.r += 1.6;
        rip.alpha = Math.max(0, 1 - rip.r / rip.maxR);

        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${rip.alpha * 0.45})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        if (rip.alpha <= 0.01) {
          ripplesRef.current.splice(i, 1);
        }
      }

      // -----------------------------------------------------------------------
      // 6. Draw 4 Stage Circuit Nodes with Rich Cinematic Styling
      // -----------------------------------------------------------------------
      nodes.forEach((n) => {
        let isActive = false;
        let isDone = false;
        let isFault = false;

        if (n.id === 1) {
          isActive = curState === 's1_ingress';
          isDone = isStage1Done;
        } else if (n.id === 2) {
          isActive = curState === 's2_dedupe';
          isDone = isStage2Done;
        } else if (n.id === 3) {
          isActive = curState === 's3_dispatch' || curState === 's3_retry_burst';
          isFault = curState === 's3_fault_loop';
          isDone = isStage3Done;
        } else if (n.id === 4) {
          isActive = curState === 's4_settle';
          isDone = isStage4Done;
        }

        // Spawn periodic ripple on active or faulting node
        if ((isActive || isFault) && Math.random() < 0.08) {
          ripplesRef.current.push({
            x: n.x,
            y: n.y,
            r: nodeR,
            maxR: nodeR + 28,
            alpha: 0.85
          });
        }

        // Outer Rotating Reticle Ring
        ctx.save();
        ctx.translate(n.x, n.y);
        if (isActive || isFault) ctx.rotate(t * 2.2);

        ctx.beginPath();
        ctx.arc(0, 0, nodeR + 6, 0, Math.PI * 2);
        ctx.strokeStyle = isFault
          ? 'rgba(255, 255, 255, 0.85)'
          : isActive
          ? 'rgba(255, 255, 255, 0.95)'
          : isDone
          ? 'rgba(255, 255, 255, 0.4)'
          : 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = isActive || isFault ? 1.4 : 1;
        ctx.setLineDash(isActive || isFault ? [4, 4] : [1, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        // Node Solid Disc Background
        ctx.beginPath();
        ctx.arc(n.x, n.y, nodeR, 0, Math.PI * 2);
        ctx.fillStyle = isFault
          ? 'rgba(255, 255, 255, 0.16)'
          : isActive
          ? 'rgba(255, 255, 255, 0.22)'
          : isDone
          ? 'rgba(255, 255, 255, 0.08)'
          : '#0E1012';
        ctx.fill();

        // Node Bezel Rim
        ctx.strokeStyle = isFault
          ? '#FFFFFF'
          : isActive
          ? '#FFFFFF'
          : isDone
          ? 'rgba(255, 255, 255, 0.7)'
          : 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = isActive || isFault ? 1.8 : 1;
        ctx.stroke();

        // Node Inner Core (Checkmark or Step ID)
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = isDone || isActive || isFault ? '#FFFFFF' : 'rgba(237, 233, 227, 0.5)';
        ctx.fillText(isDone ? '✓' : n.label, n.x, n.y);

        // Titles Above Node
        ctx.textBaseline = 'bottom';
        ctx.font = '9.5px monospace';
        ctx.fillStyle = 'rgba(237, 233, 227, 0.45)';
        ctx.fillText(`STAGE 0${n.id}`, n.x, baseY - nodeR - 16);

        ctx.font = 'bold 12.5px sans-serif';
        ctx.fillStyle = isActive || isFault ? '#FFFFFF' : 'rgba(237, 233, 227, 0.85)';
        ctx.fillText(n.title, n.x, baseY - nodeR - 3);

        // Subtitle & Status Below Node
        ctx.textBaseline = 'top';
        ctx.font = '11px sans-serif';
        ctx.fillStyle = 'rgba(237, 233, 227, 0.5)';
        ctx.fillText(n.sub, n.x, baseY + nodeR + 6);

        ctx.font = '9.5px monospace';
        let statusText = 'STANDBY';
        let statusColor = 'rgba(237, 233, 227, 0.35)';

        if (isFault) {
          statusText = `503 RETRY (${backoffRemaining}s)`;
          statusColor = '#FFFFFF';
        } else if (isActive) {
          statusText = 'PROCESSING...';
          statusColor = '#FFFFFF';
        } else if (isDone) {
          statusText = 'SETTLED [OK]';
          statusColor = 'rgba(255, 255, 255, 0.85)';
        }

        ctx.fillStyle = statusColor;
        ctx.fillText(statusText, n.x, baseY + nodeR + 20);
      });

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [backoffRemaining]);

  const isExecuting = stageState !== 'idle' && stageState !== 'completed';

  return (
    <section className={styles.heroContainer} ref={containerRef}>
      {/* Contrast Vignette */}
      <div className={styles.vignetteOverlay} />

      <div className={styles.contentWrapper}>
        {/* Navigation Breadcrumb */}
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

        {/* Clean, Non-Congested Editorial Header */}
        <div className={styles.headerArea}>
          <div className={styles.eyebrowBadge}>
            <span className={styles.beaconDot} />
            <span className={styles.eyebrowText}>TOPIC OVERVIEW // AUTOMATION ARCHITECTURE</span>
          </div>

          <h1 className={styles.headline}>{topic.name}</h1>
          <p className={styles.hookText}>{topic.hook}</p>
          <p className={styles.scopeText}>{topic.scopeParagraph}</p>

          {/* Minimalist Inline Verified Benchmark Strip */}
          <div className={styles.factStrip}>
            <span className={styles.factTag}>BENCHMARK</span>
            <span className={styles.factText}>
              McKinsey estimates 60–70% potential automation deflection, yet enterprise median sits at{' '}
              <span className={styles.factMetricHighlight}>41.2%</span> — the gap is the mechanism.
            </span>
          </div>

          {/* Mechanism Tags Row */}
          <div className={styles.tagsRow}>
            {topic.mechanismPills.map((pill, idx) => (
              <span key={idx} className={styles.tagPill}>
                {pill}
              </span>
            ))}
          </div>
        </div>

        {/* =====================================================================
            THE LIVING VECTOR CIRCUIT SIMULATOR STAGE
            ===================================================================== */}
        <div className={styles.circuitStageFrame}>
          {/* Stage Header Controls */}
          <div className={styles.stageHeader}>
            <div className={styles.stageTitleArea}>
              <span className={styles.statusIndicatorDot} />
              <div>
                <div className={styles.stageConsoleTitle}>Circuit Pipeline Reactor</div>
                <div className={styles.stageConsoleSubtitle}>Fault Injection & Exponential Backoff State Machine</div>
              </div>
            </div>

            <div className={styles.stageControlsRow}>
              {/* Hardware Switch for 503 Fault Injection */}
              <div
                className={styles.faultToggle}
                onClick={() => !isExecuting && setIsFaultArmed(!isFaultArmed)}
                title="Toggle upstream HTTP 503 Service Unavailable fault simulation"
                style={{ opacity: isExecuting ? 0.6 : 1, cursor: isExecuting ? 'not-allowed' : 'pointer' }}
              >
                <div className={`${styles.toggleTrack} ${isFaultArmed ? styles.toggleTrackActive : ''}`}>
                  <div className={`${styles.toggleThumb} ${isFaultArmed ? styles.toggleThumbActive : ''}`} />
                </div>
                <span className={styles.toggleText}>
                  503 Fault: <strong>{isFaultArmed ? 'ARMED' : 'BYPASS'}</strong>
                </span>
              </div>

              {/* Initiate Pipeline Execution Button */}
              <button
                className={styles.executeBtn}
                onClick={handleInitiate}
                disabled={isExecuting}
                title="Execute the living circuit state machine"
              >
                {isExecuting ? (
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
              <button className={styles.resetBtn} onClick={handleReset} title="Reset pipeline to standby">
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          {/* Vector Simulation Canvas Viewport */}
          <div className={styles.canvasViewport}>
            <canvas ref={canvasRef} className={styles.pipelineCanvas} />
          </div>

          {/* Compact Telemetry Ticker Strip */}
          <div className={styles.tickerStrip}>
            <div className={styles.tickerLeft}>
              <span className={styles.tickerStageToken}>{activeStageToken}</span>
              <span
                className={`${styles.tickerMessage} ${
                  stageState === 's3_fault_loop' ? styles.tickerMessageAlert : ''
                }`}
              >
                {tickerMessage}
              </span>
            </div>

            <div className={styles.tickerMetricsRight}>
              <div className={styles.tickerMetricItem}>
                <span>LATENCY:</span>
                <span className={styles.tickerMetricVal}>{stepLatency}</span>
              </div>
              <div className={styles.tickerMetricItem}>
                <span>CASCADE:</span>
                <span className={styles.tickerMetricVal}>0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
