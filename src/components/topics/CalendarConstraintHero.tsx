import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { TopicData } from '../../data/topics';
import { ArrowLeft, Play, RotateCcw, Calendar, Clock, ChevronDown, CheckCircle2, Lock, AlertTriangle } from 'lucide-react';
import styles from '../../styles/calendarConstraintHero.module.css';

interface CalendarConstraintHeroProps {
  topic: TopicData;
}

type SolverStage =
  | 'clashing'
  | 's1_scan'
  | 's2_propagate'
  | 's3_displace'
  | 's4_lock_buffer'
  | 'resolved';

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

export const CalendarConstraintHero: React.FC<CalendarConstraintHeroProps> = ({ topic }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Simulation State
  const [solverStage, setSolverStage] = useState<SolverStage>('clashing');
  const [activeStageToken, setActiveStageToken] = useState<string>('⚠️ 30M COLLISION');
  const [tickerMessage, setTickerMessage] = useState<string>(
    'Temporal collision detected: Vendor API Sync overlaps Q4 Board Review by 30 minutes.'
  );

  // Animation Refs
  const stageRef = useRef<SolverStage>('clashing');
  const animTimeRef = useRef<number>(0);
  const sparksRef = useRef<Spark[]>([]);
  const displacementProgressRef = useRef<number>(0); // 0 (14:30) to 1 (16:00)

  useEffect(() => {
    stageRef.current = solverStage;
  }, [solverStage]);

  // Reset Engine
  const handleReset = () => {
    setSolverStage('clashing');
    stageRef.current = 'clashing';
    displacementProgressRef.current = 0;
    setActiveStageToken('⚠️ 30M COLLISION');
    setTickerMessage('Simulation reset. Overlapping meeting schedule restored to clashing state.');
    sparksRef.current = [];
  };

  // Launch CSP Solver
  const handleSolve = () => {
    if (solverStage !== 'clashing') return;

    setSolverStage('s1_scan');
    stageRef.current = 's1_scan';
    setActiveStageToken('01 // CSP SCAN');
    setTickerMessage('Evaluating Allen Interval Algebra: [14:00, 15:30] overlaps [14:30, 15:00]. Hard anchor locked.');
  };

  // Automated Sequential State Progression
  useEffect(() => {
    if (solverStage === 'clashing' || solverStage === 'resolved') return;

    let timer: ReturnType<typeof setTimeout>;

    if (solverStage === 's1_scan') {
      timer = setTimeout(() => {
        setSolverStage('s2_propagate');
        setActiveStageToken('02 // PROPAGATE');
        setTickerMessage('Constraint Propagation: Board Review is Priority 10 (Immovable). Target flexible meeting.');

        // Spawn collision sparks
        for (let i = 0; i < 15; i++) {
          const angle = (Math.random() - 0.5) * Math.PI;
          const spd = Math.random() * 2.5 + 1;
          sparksRef.current.push({
            x: 520,
            y: 155,
            vx: Math.cos(angle) * spd,
            vy: Math.sin(angle) * spd,
            r: Math.random() * 2 + 1,
            alpha: 1,
            color: '#E5A93C'
          });
        }
      }, 700);
    } else if (solverStage === 's2_propagate') {
      timer = setTimeout(() => {
        setSolverStage('s3_displace');
        setActiveStageToken('03 // DISPLACE');
        setTickerMessage('Displacing Vendor API Sync to next available Pareto-optimal slot: 16:00 - 16:30.');
      }, 750);
    } else if (solverStage === 's3_displace') {
      timer = setTimeout(() => {
        setSolverStage('s4_lock_buffer');
        setActiveStageToken('04 // BUFFER LOCK');
        setTickerMessage('15m Focus Buffer preserved (15:30 - 15:45). Meeting boundary constraints satisfied.');
      }, 850);
    } else if (solverStage === 's4_lock_buffer') {
      timer = setTimeout(() => {
        setSolverStage('resolved');
        setActiveStageToken('CONFLICT FREE');
        setTickerMessage('Calendar constraints satisfied: 0 overlapping minutes · 100% attendee availability · CalDAV sync committed.');
      }, 700);
    }

    return () => clearTimeout(timer);
  }, [solverStage]);

  // Main Canvas Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    // 45 Ambient Stardust Particles matching Topic Hub contrast
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

      const curStage = stageRef.current;

      // Smooth displacement easing
      if (curStage === 's3_displace' || curStage === 's4_lock_buffer' || curStage === 'resolved') {
        if (displacementProgressRef.current < 1) {
          displacementProgressRef.current = Math.min(1, displacementProgressRef.current + 0.035);
        }
      } else if (curStage === 'clashing') {
        displacementProgressRef.current = 0;
      }

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
      // 2. TIMELINE AXIS & HOURS (13:00 to 17:00)
      // -------------------------------------------------------------
      const timelineX = W * 0.10;
      const timelineW = W * 0.80;
      const timelineY = H * 0.28;

      // Base Rail
      ctx.beginPath();
      ctx.moveTo(timelineX, timelineY);
      ctx.lineTo(timelineX + timelineW, timelineY);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();

      const hours = ['13:00', '14:00', '15:00', '16:00', '17:00'];
      const totalMinutes = 240; // 4 hours

      hours.forEach((hr, idx) => {
        const hx = timelineX + (idx / (hours.length - 1)) * timelineW;

        // Hour Tick
        ctx.beginPath();
        ctx.moveTo(hx, timelineY - 6);
        ctx.lineTo(hx, timelineY + 6);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // 15-min sub-ticks
        if (idx < hours.length - 1) {
          for (let m = 1; m <= 3; m++) {
            const mx = hx + (m / 4) * (timelineW / 4);
            ctx.beginPath();
            ctx.moveTo(mx, timelineY - 3);
            ctx.lineTo(mx, timelineY + 3);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Hour Label
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.textAlign = 'center';
        ctx.fillText(hr, hx, timelineY - 12);
      });

      // Helper function: minute offset from 13:00 to X coordinate
      const minToX = (mins: number) => timelineX + (mins / totalMinutes) * timelineW;

      // -------------------------------------------------------------
      // 3. MEETING BLOCKS ON TIMELINE
      // -------------------------------------------------------------
      // Event 1: Q4 Board Review (Executive) -> 14:00 to 15:30 (mins 60 to 150)
      const e1Start = 60;
      const e1End = 150;
      const e1X = minToX(e1Start);
      const e1W = minToX(e1End) - e1X;
      const blockH = 54;
      const blockY = timelineY + 28;

      // Meeting 1 Box (Anchor Locked)
      ctx.fillStyle = 'rgba(16, 18, 20, 0.8)';
      ctx.fillRect(e1X, blockY, e1W, blockH);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.lineWidth = 1;
      ctx.strokeRect(e1X, blockY, e1W, blockH);

      // Meeting 1 Header
      ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'left';
      ctx.fillText('Q4 Board Review (Executive)', e1X + 12, blockY + 22);

      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(237, 233, 227, 0.6)';
      ctx.fillText('14:00 - 15:30 · PRIORITY 10: LOCKED', e1X + 12, blockY + 38);

      // Lock icon anchor
      ctx.beginPath();
      ctx.arc(e1X + e1W - 16, blockY + 16, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fill();

      // Event 2: Vendor API Sync
      // Clashing start: 14:30 (min 90) -> Resolved start: 16:00 (min 180)
      // Duration: 30m
      const e2Duration = 30;
      const clashStartMin = 90;
      const resolvedStartMin = 180;
      const currentStartMin = clashStartMin + (resolvedStartMin - clashStartMin) * displacementProgressRef.current;

      const e2X = minToX(currentStartMin);
      const e2W = minToX(currentStartMin + e2Duration) - e2X;
      const isClashingState = curStage === 'clashing' || curStage === 's1_scan';
      const isDisplacing = curStage === 's3_displace';

      // Meeting 2 Box (Flexible / Displacing)
      ctx.save();
      if (isClashingState) {
        ctx.fillStyle = 'rgba(229, 169, 60, 0.12)';
        ctx.strokeStyle = '#E5A93C';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 4]);
      } else {
        ctx.fillStyle = 'rgba(14, 16, 18, 0.85)';
        ctx.strokeStyle = curStage === 'resolved' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1;
        ctx.setLineDash([]);
      }

      ctx.fillRect(e2X, blockY + 68, e2W, blockH);
      ctx.strokeRect(e2X, blockY + 68, e2W, blockH);
      ctx.restore();

      ctx.font = '600 10.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = isClashingState ? '#E5A93C' : '#FFFFFF';
      ctx.textAlign = 'left';
      ctx.fillText('Vendor API Sync', e2X + 10, blockY + 90);

      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = isClashingState ? '#E5A93C' : 'rgba(237, 233, 227, 0.6)';
      const e2TimeStr = displacementProgressRef.current > 0.8 ? '16:00 - 16:30' : '14:30 - 15:00';
      ctx.fillText(`${e2TimeStr} · PRIORITY 4`, e2X + 10, blockY + 106);

      // Overlap Collision Indicator (between 14:30 and 15:00) when clashing
      if (isClashingState) {
        const overlapX = minToX(90);
        const overlapW = minToX(120) - overlapX;

        ctx.fillStyle = 'rgba(229, 169, 60, 0.18)';
        ctx.fillRect(overlapX, blockY, overlapW, blockH + 68);

        ctx.strokeStyle = '#E5A93C';
        ctx.lineWidth = 1;
        ctx.strokeRect(overlapX, blockY, overlapW, blockH + 68);

        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.fillStyle = '#E5A93C';
        ctx.textAlign = 'center';
        ctx.fillText('⚠️ 30M COLLISION', overlapX + overlapW / 2, blockY - 6);
      }

      // Buffer Zone indicator (15:30 to 15:45) when resolved
      if (curStage === 's4_lock_buffer' || curStage === 'resolved') {
        const bufX = minToX(150);
        const bufW = minToX(165) - bufX;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.fillRect(bufX, blockY, bufW, blockH);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.setLineDash([2, 2]);
        ctx.strokeRect(bufX, blockY, bufW, blockH);
        ctx.setLineDash([]);

        ctx.font = '7.5px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.textAlign = 'center';
        ctx.fillText('15M BUFFER', bufX + bufW / 2, blockY + 30);
      }

      // -------------------------------------------------------------
      // 4. SCANNING BEAM & SPARKS
      // -------------------------------------------------------------
      if (curStage === 's1_scan') {
        const scanX = timelineX + (Math.sin(t * 3) * 0.5 + 0.5) * timelineW;
        ctx.beginPath();
        ctx.moveTo(scanX, timelineY - 10);
        ctx.lineTo(scanX, blockY + 130);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

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

        {/* Central Living Calendar Constraint Stage */}
        <div className={styles.stageWrapper}>
          <div className={styles.canvasViewport}>
            <canvas ref={canvasRef} className={styles.calendarCanvas} />
          </div>

          {/* Integrated Modern Instrument Ribbon */}
          <div className={styles.instrumentRibbon}>
            {/* Left: Telemetry Capsule */}
            <div className={styles.telemetryArea}>
              <div
                className={`${styles.telemetryDot} ${
                  solverStage === 'clashing'
                    ? styles.telemetryDotConflict
                    : solverStage !== 'resolved'
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
              {/* Buffer Preservation Capsule */}
              <div className={styles.bufferPill} title="Constraint: Automatic 15-minute buffer between meetings">
                <Clock size={11} />
                <span>BUFFER:</span>
                <span className={styles.bufferVal}>15m Preserved</span>
              </div>

              {/* Solve Constraint Button */}
              <button
                type="button"
                className={styles.solveButton}
                onClick={handleSolve}
                disabled={solverStage !== 'clashing'}
                title="Execute multi-calendar constraint-satisfaction conflict solver"
              >
                <Play size={11} fill="currentColor" />
                <span>Solve Constraint (CSP)</span>
              </button>

              {/* Reset Button */}
              <button
                type="button"
                className={styles.resetButton}
                onClick={handleReset}
                title="Restore overlapping conflict state"
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
