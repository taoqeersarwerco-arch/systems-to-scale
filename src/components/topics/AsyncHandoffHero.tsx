import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { TopicData } from '../../data/topics';
import { ArrowLeft, Play, RotateCcw, Globe, Clock, ChevronDown, CheckCircle2, AlertTriangle } from 'lucide-react';
import styles from '../../styles/asyncHandoffHero.module.css';

interface AsyncHandoffHeroProps {
  topic: TopicData;
}

type HandoffStage =
  | 'idle'
  | 's1_spec_locked'
  | 's2_context_freeze'
  | 's3_timezone_relay'
  | 's4_pilot_verify'
  | 's4_pingpong_trap'
  | 's5_batch_commit'
  | 'completed';

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  r: number;
  color?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
  phase: number;
}

export const AsyncHandoffHero: React.FC<AsyncHandoffHeroProps> = ({ topic }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Simulation State
  const [stage, setStage] = useState<HandoffStage>('idle');
  const [isTrapSimulated, setIsTrapSimulated] = useState<boolean>(false);
  const [activeStageToken, setActiveStageToken] = useState<string>('STANDBY');
  const [tickerMessage, setTickerMessage] = useState<string>(
    'Async handoff relay on standby. Dual-clock geodesic bridge ready across SFO (UTC-8) and MNL (UTC+8).'
  );
  const [packetProgress, setPacketProgress] = useState<number>(0);

  // Animation Refs
  const stageRef = useRef<HandoffStage>('idle');
  const trapRef = useRef<boolean>(false);
  const animTimeRef = useRef<number>(0);
  const sparksRef = useRef<Spark[]>([]);

  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  useEffect(() => {
    trapRef.current = isTrapSimulated;
  }, [isTrapSimulated]);

  // Reset Engine
  const handleReset = () => {
    setStage('idle');
    stageRef.current = 'idle';
    setPacketProgress(0);
    setActiveStageToken('STANDBY');
    setTickerMessage('Simulation reset. Geodesic timezone conduit clear. Ready for handoff dispatch.');
    sparksRef.current = [];
  };

  // Launch Async Handoff
  const handleInitiate = () => {
    if (stage !== 'idle' && stage !== 'completed') return;

    setStage('s1_spec_locked');
    stageRef.current = 's1_spec_locked';
    setActiveStageToken('01 // SPEC & DoD');
    setTickerMessage('SFO Office (17:00 UTC-8): Inputs frozen. SOP checklist linked. Credential sandbox scoped.');
  };

  // Automated Sequential State Progression
  useEffect(() => {
    if (stage === 'idle' || stage === 'completed') return;

    let timer: ReturnType<typeof setTimeout>;

    if (stage === 's1_spec_locked') {
      timer = setTimeout(() => {
        setStage('s2_context_freeze');
        setActiveStageToken('02 // CONTEXT FREEZE');
        setTickerMessage('Artifact packaging: Loom walkthrough timestamped. Local environment state snapshot frozen.');
      }, 600);
    } else if (stage === 's2_context_freeze') {
      timer = setTimeout(() => {
        setStage('s3_timezone_relay');
        setActiveStageToken('03 // TIMEZONE RELAY');
        setTickerMessage('Crossing International Date Line: SFO enters night sleep cycle while MNL morning begins (+16h shift).');
      }, 700);
    } else if (stage === 's3_timezone_relay') {
      timer = setTimeout(() => {
        if (trapRef.current) {
          setStage('s4_pingpong_trap');
          setActiveStageToken('⚠️ 24H PING-PONG');
          setTickerMessage('AMBIGUITY TRAP: Missing 2FA token halts operator in Manila. Blocked 24h waiting for SFO to wake!');

          // Spawn alert sparks
          for (let i = 0; i < 18; i++) {
            const angle = (Math.random() - 0.5) * Math.PI * 2;
            const spd = Math.random() * 2.8 + 1;
            sparksRef.current.push({
              x: 650,
              y: 155,
              vx: Math.cos(angle) * spd,
              vy: Math.sin(angle) * spd,
              r: Math.random() * 2 + 1,
              alpha: 1,
              color: '#E5A93C'
            });
          }

          setTimeout(() => {
            setStage('completed');
            setActiveStageToken('HANDOFF STALLED');
            setTickerMessage('Execution delayed by 24h timezone ping-pong. Solution: Immutable credential sandbox pre-flight.');
          }, 1600);
        } else {
          setStage('s4_pilot_verify');
          setActiveStageToken('04 // PILOT VERIFY');
          setTickerMessage('Operator in Manila tests 1 pilot unit against acceptance criteria. Verification passed.');
        }
      }, 750);
    } else if (stage === 's4_pilot_verify') {
      timer = setTimeout(() => {
        setStage('s5_batch_commit');
        setActiveStageToken('05 // BATCH COMMIT');
        setTickerMessage('Full batch completed during SFO overnight window. QA signed off. Zero blocker interrupts.');
      }, 650);
    } else if (stage === 's5_batch_commit') {
      timer = setTimeout(() => {
        setStage('completed');
        setActiveStageToken('OVERNIGHT 100% PASS');
        setTickerMessage('Handoff settled: SFO wakes up to 100% completed deliverables. 0 ping-pong iterations · 8h turnaround.');
      }, 600);
    }

    return () => clearTimeout(timer);
  }, [stage]);

  // Main Canvas Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    // 45 Ambient Stardust Particles matching Topic Hub Contrast
    const particles: Particle[] = [];
    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * 1100,
        y: Math.random() * 320,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.2 + 0.35,
        a: 0.15 + Math.random() * 0.25,
        phase: Math.random() * Math.PI * 2
      });
    }

    const render = () => {
      animTimeRef.current += 0.016;
      const t = animTimeRef.current;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
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

      ctx.clearRect(0, 0, W, H);

      // Node Geometry across the Geodesic Timezone Bridge
      const nOrigin = { x: W * 0.12, y: H * 0.50, label: 'SFO DESK (UTC-8)', sub: '17:00 EOD Freeze' };
      const nFreeze = { x: W * 0.31, y: H * 0.50, label: 'CONTEXT SNAPSHOT', sub: 'Loom & State Seal' };
      const nRelay = { x: W * 0.50, y: H * 0.50, label: 'TIMEZONE RELAY', sub: 'Date Line Shift (+16h)' };
      const nVerify = { x: W * 0.69, y: H * 0.50, label: 'PILOT VERIFY', sub: 'Sample Gate (1 Unit)' };
      const nDest = { x: W * 0.88, y: H * 0.50, label: 'MNL DESK (UTC+8)', sub: '09:00 Morning Batch' };

      const nodes = [nOrigin, nFreeze, nRelay, nVerify, nDest];
      const curStage = stageRef.current;

      // -------------------------------------------------------------
      // 1. PARTICLES
      // -------------------------------------------------------------
      for (let pIdx = 0; pIdx < particles.length; pIdx++) {
        const p = particles[pIdx];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        const pulse = 0.5 + 0.5 * Math.sin(t * 1.5 + p.phase);
        ctx.fillStyle = `rgba(255, 255, 255, ${(p.a * (0.6 + 0.4 * pulse)).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // -------------------------------------------------------------
      // 2. GEODESIC TIMEZONE ARCH & RAIL
      // -------------------------------------------------------------
      // Main Forward Rail
      ctx.beginPath();
      ctx.moveTo(nOrigin.x, nOrigin.y);
      ctx.lineTo(nDest.x, nDest.y);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      if (curStage !== 'idle') {
        ctx.beginPath();
        ctx.moveTo(nOrigin.x, nOrigin.y);
        ctx.lineTo(nDest.x, nDest.y);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      // Geodesic Timezone Curve (Overhead trans-pacific arc)
      ctx.beginPath();
      ctx.moveTo(nOrigin.x, nOrigin.y - 15);
      ctx.bezierCurveTo(
        W * 0.28, H * 0.18,
        W * 0.72, H * 0.18,
        nDest.x, nDest.y - 15
      );
      ctx.strokeStyle = curStage !== 'idle' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = '8.5px "JetBrains Mono", monospace';
      ctx.fillStyle = curStage !== 'idle' ? 'rgba(255, 255, 255, 0.65)' : 'rgba(255, 255, 255, 0.3)';
      ctx.textAlign = 'center';
      ctx.fillText('TRANS-PACIFIC ASYNC CORRIDOR // Δt = +16 HOURS (OVERNIGHT VELOCITY)', W * 0.50, H * 0.23);

      // Ping-pong rebound arc if trap triggered
      if (curStage === 's4_pingpong_trap') {
        ctx.beginPath();
        ctx.moveTo(nVerify.x, nVerify.y + 15);
        ctx.bezierCurveTo(
          nVerify.x - 40, H * 0.72,
          nOrigin.x + 40, H * 0.72,
          nOrigin.x, nOrigin.y + 15
        );
        ctx.strokeStyle = 'rgba(229, 169, 60, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#E5A93C';
        ctx.font = '8.5px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('⚠️ BLOCKED 24H WAITING FOR SFO MORNING // PING-PONG REBOUND', W * 0.50, H * 0.72);
      }

      // -------------------------------------------------------------
      // 3. DRAW NODES
      // -------------------------------------------------------------
      nodes.forEach((n, idx) => {
        const isCurrentActive =
          (curStage === 's1_spec_locked' && idx === 0) ||
          (curStage === 's2_context_freeze' && idx === 1) ||
          (curStage === 's3_timezone_relay' && idx === 2) ||
          (curStage === 's4_pilot_verify' && idx === 3) ||
          (curStage === 's4_pingpong_trap' && idx === 3) ||
          (curStage === 's5_batch_commit' && idx === 4) ||
          (curStage === 'completed' && idx === 4);

        const isPassed =
          (curStage === 'completed') ||
          (curStage === 's5_batch_commit' && idx < 4) ||
          (curStage === 's4_pilot_verify' && idx < 3) ||
          (curStage === 's3_timezone_relay' && idx < 2) ||
          (curStage === 's2_context_freeze' && idx < 1);

        if (isCurrentActive) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, 22 + Math.sin(t * 4) * 2.5, 0, Math.PI * 2);
          ctx.strokeStyle = curStage === 's4_pingpong_trap' && idx === 3
            ? 'rgba(229, 169, 60, 0.7)'
            : 'rgba(255, 255, 255, 0.45)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, 16, 0, Math.PI * 2);
        ctx.fillStyle = '#080808';
        ctx.fill();

        ctx.strokeStyle = curStage === 's4_pingpong_trap' && idx === 3
          ? '#E5A93C'
          : isPassed || isCurrentActive
          ? '#FFFFFF'
          : 'rgba(255, 255, 255, 0.22)';
        ctx.lineWidth = isPassed || isCurrentActive ? 1.5 : 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(n.x, n.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = curStage === 's4_pingpong_trap' && idx === 3
          ? '#E5A93C'
          : isPassed || isCurrentActive
          ? '#FFFFFF'
          : 'rgba(255, 255, 255, 0.25)';
        ctx.fill();

        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.textAlign = 'center';
        ctx.fillText(`0${idx + 1}`, n.x, n.y - 25);

        ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = isPassed || isCurrentActive ? '#FFFFFF' : 'rgba(237, 233, 227, 0.7)';
        ctx.fillText(n.label, n.x, n.y + 32);

        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(237, 233, 227, 0.45)';
        ctx.fillText(n.sub, n.x, n.y + 45);
      });

      // -------------------------------------------------------------
      // 4. SPARKS
      // -------------------------------------------------------------
      for (let sIdx = sparksRef.current.length - 1; sIdx >= 0; sIdx--) {
        const spk = sparksRef.current[sIdx];
        spk.x += spk.vx;
        spk.y += spk.vy;
        spk.vy += 0.05;
        spk.alpha *= 0.93;
        if (spk.alpha <= 0.02) {
          sparksRef.current.splice(sIdx, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(spk.x, spk.y, spk.r, 0, Math.PI * 2);
        ctx.fillStyle = spk.color || `rgba(255, 255, 255, ${spk.alpha.toFixed(2)})`;
        ctx.fill();
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <section className={styles.heroContainer} ref={containerRef}>
      <div className={styles.vignetteOverlay} />

      <div className={styles.contentWrapper}>
        {/* Navigation Breadcrumb */}
        <div className={styles.breadcrumbRow}>
          <Link to="/topics" className={styles.breadcrumbLink} title="Return to Topic Index">
            <ArrowLeft size={12} />
            <span>All Domains</span>
          </Link>
          <span className={styles.breadcrumbDivider}>//</span>
          <span className={styles.breadcrumbTag}>{topic.badge}: {topic.name.toUpperCase()}</span>
        </div>

        {/* Minimal Editorial Header */}
        <div className={styles.headerArea}>
          <h1 className={styles.headline}>{topic.name}</h1>
          <p className={styles.hookText}>{topic.hook}</p>
        </div>

        {/* Central Living Timezone Geodesic Stage */}
        <div className={styles.stageWrapper}>
          <div className={styles.canvasViewport}>
            <canvas ref={canvasRef} className={styles.handoffCanvas} />
          </div>

          {/* Integrated Modern Instrument Ribbon */}
          <div className={styles.instrumentRibbon}>
            {/* Left: Telemetry Capsule */}
            <div className={styles.telemetryArea}>
              <div
                className={`${styles.telemetryDot} ${
                  stage === 's4_pingpong_trap'
                    ? styles.telemetryDotWarning
                    : stage !== 'idle'
                    ? styles.telemetryDotActive
                    : ''
                }`}
              />
              <span className={styles.telemetryToken}>{activeStageToken}</span>
              <span className={styles.telemetryDivider}>—</span>
              <span className={styles.telemetryText}>{tickerMessage}</span>
            </div>

            {/* Right: Direct Precision Controls */}
            <div className={styles.controlsArea}>
              {/* Timezone Delta Pill */}
              <div className={styles.deltaPill} title="Timezone differential between SFO and Manila">
                <Globe size={11} />
                <span>DELTA:</span>
                <span className={styles.deltaVal}>+16h Shift</span>
              </div>

              {/* Ambiguity Trap Simulation Toggle */}
              <button
                type="button"
                className={`${styles.toggleBtn} ${isTrapSimulated ? styles.toggleBtnActive : ''}`}
                onClick={() => setIsTrapSimulated(!isTrapSimulated)}
                disabled={stage !== 'idle' && stage !== 'completed'}
                title="Simulate un-scoped delegation causing a 24h timezone ping-pong blocker"
              >
                <div className={styles.toggleDot} />
                <span>{isTrapSimulated ? 'Trap: 24h Ping-Pong' : 'Context-Preserved Handoff'}</span>
              </button>

              {/* Execute Handoff Button */}
              <button
                type="button"
                className={styles.executeButton}
                onClick={handleInitiate}
                title="Dispatch asynchronous task handoff across the timezone relay"
              >
                <Play size={11} fill="currentColor" />
                <span>Dispatch Handoff</span>
              </button>

              {/* Reset Button */}
              <button
                type="button"
                className={styles.resetButton}
                onClick={handleReset}
                title="Reset simulation and clear timezone corridor"
              >
                <RotateCcw size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Minimal Scroll Cue at base */}
        <div className={styles.scrollCueWrapper}>
          <button
            type="button"
            className={styles.scrollCueBtn}
            onClick={() => {
              const el = document.getElementById('topic-articles');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            title="Scroll to articles"
          >
            <span>Explore 5 Articles</span>
            <ChevronDown size={13} className={styles.scrollChevron} />
          </button>
        </div>
      </div>
    </section>
  );
};
