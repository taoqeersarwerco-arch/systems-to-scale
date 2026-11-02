import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { TopicData } from '../../data/topics';
import { ArrowLeft, Play, RotateCcw, Activity, ChevronDown } from 'lucide-react';
import styles from '../../styles/auctionExchangeHero.module.css';

interface AuctionExchangeHeroProps {
  topic: TopicData;
}

type AuctionSimState =
  | 'idle'
  | 's1_ingress'
  | 's2_consent'
  | 's3_broadcast'
  | 's4_clear'
  | 's5_render'
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
  r: number;
}

interface StreamPacket {
  x: number;
  y: number;
  speed: number;
  r: number;
  a: number;
  trail: Array<{ x: number; y: number; a: number }>;
}

export const AuctionExchangeHero: React.FC<AuctionExchangeHeroProps> = ({ topic }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Simulation State
  const [auctionState, setAuctionState] = useState<AuctionSimState>('idle');
  const [isSecondPrice, setIsSecondPrice] = useState<boolean>(true);
  const [activeStageToken, setActiveStageToken] = useState<string>('STANDBY');
  const [tickerMessage, setTickerMessage] = useState<string>(
    'OpenRTB 3.0 auction engine on standby. Ready for 80–120ms settlement trigger.'
  );

  // Animation Refs
  const stateRef = useRef<AuctionSimState>('idle');
  const stateStartTimeRef = useRef<number>(0);
  const animTimeRef = useRef<number>(0);
  const ripplesRef = useRef<Ripple[]>([]);
  const sparksRef = useRef<Spark[]>([]);

  useEffect(() => {
    stateRef.current = auctionState;
    stateStartTimeRef.current = performance.now();
  }, [auctionState]);

  // Reset Auction
  const handleReset = () => {
    setAuctionState('idle');
    stateRef.current = 'idle';
    setActiveStageToken('STANDBY');
    setTickerMessage('Auction conduits reset. Exchange cache cleared. Ready for trigger.');
    ripplesRef.current = [];
    sparksRef.current = [];
  };

  // Trigger Execution
  const handleInitiate = () => {
    if (auctionState !== 'idle' && auctionState !== 'completed') return;

    setAuctionState('s1_ingress');
    stateRef.current = 's1_ingress';
    setActiveStageToken('01 // INGRESS');
    setTickerMessage('Publisher ad slot fired. OpenRTB 3.0 bid request generated (tmax = 100ms).');
  };

  // State Machine Timers & Sequence Orchestrator (Total budget: ~2.8s visual expansion for 100ms physical auction)
  useEffect(() => {
    if (auctionState === 'idle' || auctionState === 'completed') return;

    let timeoutId: ReturnType<typeof setTimeout>;

    if (auctionState === 's1_ingress') {
      timeoutId = setTimeout(() => {
        setAuctionState('s2_consent');
        setActiveStageToken('02 // CONSENT');
        setTickerMessage('Consent Mode v2 verified: Attribution ping allowed. Routing to exchange.');
      }, 600);
    } else if (auctionState === 's2_consent') {
      timeoutId = setTimeout(() => {
        setAuctionState('s3_broadcast');
        setActiveStageToken('03 // BROADCAST');
        setTickerMessage('Ad exchange broadcasting bid requests in parallel to 4 DSPs...');
      }, 650);
    } else if (auctionState === 's3_broadcast') {
      timeoutId = setTimeout(() => {
        setAuctionState('s4_clear');
        setActiveStageToken('04 // CLEARING');
        if (isSecondPrice) {
          setTickerMessage('DSP Alpha won (AdRank 59.8). Second-price clearing settled at $4.82 CPM.');
        } else {
          setTickerMessage('DSP Alpha won (AdRank 59.8). First-price clearing settled at $6.50 CPM.');
        }
      }, 950);
    } else if (auctionState === 's4_clear') {
      timeoutId = setTimeout(() => {
        setAuctionState('s5_render');
        setActiveStageToken('05 // RENDER');
        setTickerMessage('Winning creative delivered to browser. Win notification acknowledged in 88ms.');
      }, 700);
    } else if (auctionState === 's5_render') {
      timeoutId = setTimeout(() => {
        setAuctionState('completed');
        setActiveStageToken('COMPLETED');
        setTickerMessage('Auction settled in 88ms total. 0 fraud deflection. Viewport impression logged.');
      }, 800);
    }

    return () => clearTimeout(timeoutId);
  }, [auctionState, isSecondPrice]);

  // Main Canvas Rendering Loop with Living Particle Stream Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    // 45 Ambient Stardust Particles
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      a: number;
      phase: number;
    }> = [];

    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * 950,
        y: Math.random() * 260,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.3 + 0.35,
        a: 0.15 + Math.random() * 0.25,
        phase: Math.random() * Math.PI * 2
      });
    }

    // Continuous Traveling Energy Stream Packets along the RTB bus
    let streamPackets: StreamPacket[] = [];

    const render = () => {
      animTimeRef.current += 0.016;
      const t = animTimeRef.current;
      const now = performance.now();

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

      // 5 Programmatic Pipeline Nodes across the screen
      const x1 = W * 0.1;
      const x2 = W * 0.3;
      const x3 = W * 0.5;
      const x4 = W * 0.7;
      const x5 = W * 0.9;
      const baseY = 92;
      const nodeR = 17;

      const nodes = [
        { id: 1, x: x1, y: baseY, label: '01', title: 'INGRESS', sub: 'Ad Slot Ping' },
        { id: 2, x: x2, y: baseY, label: '02', title: 'CONSENT', sub: 'Consent Mode v2' },
        { id: 3, x: x3, y: baseY, label: '03', title: 'EXCHANGE', sub: 'DSP Broadcast' },
        { id: 4, x: x4, y: baseY, label: '04', title: 'CLEARING', sub: isSecondPrice ? 'Vickrey GSP' : 'First Price' },
        { id: 5, x: x5, y: baseY, label: '05', title: 'RENDER', sub: 'Win Telemetry' }
      ];

      const curState = stateRef.current;
      const elapsedInState = now - stateStartTimeRef.current;

      // -------------------------------------------------------------
      // 1. UPDATE & DRAW AMBIENT STARDUST PARTICLES & ATTRACTORS
      // -------------------------------------------------------------
      for (let pIdx = 0; pIdx < particles.length; pIdx++) {
        const p = particles[pIdx];

        p.x += p.vx + Math.sin(t * 0.5 + p.phase) * 0.06;
        p.y += p.vy + Math.cos(t * 0.4 + p.phase) * 0.06;

        // Attractor to pipeline nodes
        for (let nIdx = 0; nIdx < nodes.length; nIdx++) {
          const n = nodes[nIdx];
          const dx = n.x - p.x;
          const dy = n.y - p.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 95 && d > 14) {
            p.vx += (dx / d) * 0.0022;
            p.vy += (dy / d) * 0.0022;
          }
        }

        p.vx *= 0.996;
        p.vy *= 0.996;

        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.a.toFixed(3)})`;
        ctx.fill();
      }

      // Constellation filaments linking nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 75) {
            const alpha = (1 - d / 75) * 0.08 * Math.min(particles[i].a, particles[j].a);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha.toFixed(4)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Stage completion flags
      const isStage1Done = curState !== 'idle' && curState !== 's1_ingress';
      const isStage2Done = ['s3_broadcast', 's4_clear', 's5_render', 'completed'].includes(curState);
      const isStage3Done = ['s4_clear', 's5_render', 'completed'].includes(curState);
      const isStage4Done = ['s5_render', 'completed'].includes(curState);
      const isStage5Done = curState === 'completed';

      // -------------------------------------------------------------
      // 2. MAIN CIRCUIT CONDUIT BUS TRACK
      // -------------------------------------------------------------
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(x1, baseY);
      ctx.lineTo(x5, baseY);
      ctx.stroke();

      // Progressive Active Luminous Glow Lines
      if (isStage1Done) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(x1, baseY);
        ctx.lineTo(x2, baseY);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      if (isStage2Done) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(x2, baseY);
        ctx.lineTo(x3, baseY);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      if (isStage3Done) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(x3, baseY);
        ctx.lineTo(x4, baseY);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      if (isStage4Done) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(x4, baseY);
        ctx.lineTo(x5, baseY);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // -------------------------------------------------------------
      // 3. CONTINUOUS TRAVELING STREAM PACKETS (Living Machine Flow)
      // -------------------------------------------------------------
      if (Math.random() < 0.12 && streamPackets.length < 8) {
        streamPackets.push({
          x: x1,
          y: baseY,
          speed: Math.random() * 1.8 + 1.4,
          a: 0.35 + Math.random() * 0.45,
          r: Math.random() * 1.5 + 0.6,
          trail: []
        });
      }

      for (let sIdx = 0; sIdx < streamPackets.length; sIdx++) {
        const s = streamPackets[sIdx];
        s.x += s.speed;
        s.trail.push({ x: s.x, y: s.y, a: s.a });
        if (s.trail.length > 10) s.trail.shift();

        for (let trIdx = 0; trIdx < s.trail.length; trIdx++) {
          const tr = s.trail[trIdx];
          const fade = (trIdx / s.trail.length) * tr.a;
          ctx.beginPath();
          ctx.arc(tr.x, tr.y, s.r * (0.3 + (0.7 * trIdx) / s.trail.length), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${fade.toFixed(3)})`;
          ctx.fill();
        }
      }

      streamPackets = streamPackets.filter((s) => s.x < x5);

      // -------------------------------------------------------------
      // 4. PARALLEL DSP BID BROADCAST BEAMS (At Node 03)
      // -------------------------------------------------------------
      const dsps = [
        { name: 'Alpha', bid: '$6.50', qs: '9.2', adRank: '59.8', yOff: -54, isWinner: true },
        { name: 'Beta', bid: '$8.20', qs: '5.4', adRank: '44.3', yOff: -26, isWinner: false },
        { name: 'Gamma', bid: '$4.80', qs: '8.8', adRank: '42.2', yOff: 26, isWinner: false },
        { name: 'Delta', bid: '$3.10', qs: '6.0', adRank: '18.6', yOff: 54, isWinner: false }
      ];

      if (curState === 's3_broadcast') {
        const p = Math.min(1, elapsedInState / 900);

        dsps.forEach((dsp) => {
          const startX = x3 - 90;
          const startY = baseY + dsp.yOff;
          const curX = startX + (x3 - startX) * p;
          const curY = startY + (baseY - startY) * p;

          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(curX, curY);
          ctx.strokeStyle = dsp.isWinner
            ? 'rgba(255, 255, 255, 0.95)'
            : 'rgba(255, 255, 255, 0.25)';
          ctx.lineWidth = dsp.isWinner ? 2 : 1;
          if (dsp.isWinner) {
            ctx.shadowColor = '#FFFFFF';
            ctx.shadowBlur = 8;
          }
          ctx.stroke();
          ctx.shadowBlur = 0;

          // DSP Node Label
          ctx.font = '9px monospace';
          ctx.fillStyle = dsp.isWinner ? '#FFFFFF' : 'rgba(237, 233, 227, 0.45)';
          ctx.textAlign = 'right';
          ctx.fillText(`DSP ${dsp.name} (${dsp.bid})`, startX - 6, startY + 3);

          // Spawn electrical sparks on winner bid
          if (dsp.isWinner && Math.random() < 0.3) {
            sparksRef.current.push({
              x: curX,
              y: curY,
              vx: (Math.random() - 0.5) * 1.5,
              vy: (Math.random() - 0.5) * 1.5,
              alpha: 1,
              r: Math.random() * 1.4 + 0.5
            });
          }
        });
      }

      // -------------------------------------------------------------
      // 5. SMOOTH PHYSICAL TRANSIT PACKET ON "SETTLE AUCTION"
      // -------------------------------------------------------------
      let packetPos: { x: number; y: number } | null = null;
      const smoothstep = (min: number, max: number, value: number) => {
        const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
        return x * x * (3 - 2 * x);
      };

      if (curState === 's1_ingress') {
        const p = smoothstep(0, 600, elapsedInState);
        packetPos = { x: x1 + (x2 - x1) * p, y: baseY };
      } else if (curState === 's2_consent') {
        const p = smoothstep(0, 650, elapsedInState);
        packetPos = { x: x2 + (x3 - x2) * p, y: baseY };
      } else if (curState === 's4_clear') {
        const p = smoothstep(0, 700, elapsedInState);
        packetPos = { x: x3 + (x4 - x3) * p, y: baseY };
      } else if (curState === 's5_render') {
        const p = smoothstep(0, 800, elapsedInState);
        packetPos = { x: x4 + (x5 - x4) * p, y: baseY };
      }

      // Draw active surge photon packet
      if (packetPos) {
        ctx.save();
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 18;
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(packetPos.x, packetPos.y, 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(packetPos.x, packetPos.y, 8, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      }

      // -------------------------------------------------------------
      // 6. RIPPLE SHOCKWAVES & SPARK BURSTS
      // -------------------------------------------------------------
      if (curState === 's1_ingress' && Math.random() < 0.08) {
        ripplesRef.current.push({ x: x1, y: baseY, r: 16, maxR: 36, alpha: 0.8 });
      } else if (curState === 's4_clear' && Math.random() < 0.08) {
        ripplesRef.current.push({ x: x4, y: baseY, r: 18, maxR: 42, alpha: 0.9 });
      } else if (curState === 's5_render' && Math.random() < 0.08) {
        ripplesRef.current.push({ x: x5, y: baseY, r: 18, maxR: 44, alpha: 0.9 });
      }

      // Draw & update ripples
      ripplesRef.current.forEach((rp) => {
        rp.r += 0.9;
        rp.alpha *= 0.94;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${rp.alpha.toFixed(3)})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });
      ripplesRef.current = ripplesRef.current.filter((rp) => rp.alpha > 0.05);

      // Draw & update sparks
      sparksRef.current.forEach((sp) => {
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.alpha *= 0.92;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${sp.alpha.toFixed(3)})`;
        ctx.fill();
      });
      sparksRef.current = sparksRef.current.filter((sp) => sp.alpha > 0.06);

      // -------------------------------------------------------------
      // 7. DRAW STAGE NODES & SLEEK MINIMAL LABELS
      // -------------------------------------------------------------
      nodes.forEach((n) => {
        const isActive =
          (n.id === 1 && curState === 's1_ingress') ||
          (n.id === 2 && curState === 's2_consent') ||
          (n.id === 3 && curState === 's3_broadcast') ||
          (n.id === 4 && curState === 's4_clear') ||
          (n.id === 5 && curState === 's5_render');

        const isDone =
          (n.id === 1 && isStage1Done) ||
          (n.id === 2 && isStage2Done) ||
          (n.id === 3 && isStage3Done) ||
          (n.id === 4 && isStage4Done) ||
          (n.id === 5 && isStage5Done);

        // Outer halo ring if active
        if (isActive) {
          const pulseR = nodeR + 6 + Math.sin(t * 8) * 3;
          ctx.beginPath();
          ctx.arc(n.x, n.y, pulseR, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        // Main Node Circle Body
        ctx.beginPath();
        ctx.arc(n.x, n.y, nodeR, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? '#14171A' : isDone ? '#101214' : '#0B0D0E';
        ctx.fill();

        ctx.strokeStyle = isActive
          ? '#FFFFFF'
          : isDone
          ? 'rgba(255, 255, 255, 0.75)'
          : 'rgba(255, 255, 255, 0.22)';
        ctx.lineWidth = isActive ? 2.2 : 1.4;

        if (isActive) {
          ctx.shadowColor = '#FFFFFF';
          ctx.shadowBlur = 8;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Stage numerical label in center
        ctx.font = '600 11px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = isActive || isDone ? '#FFFFFF' : 'rgba(237, 233, 227, 0.45)';
        ctx.fillText(n.label, n.x, n.y);

        // Header Stage Title above (single clean label)
        ctx.font = '600 11px monospace';
        ctx.fillStyle = isActive || isDone ? '#FFFFFF' : 'rgba(237, 233, 227, 0.65)';
        ctx.fillText(n.title, n.x, baseY - nodeR - 12);

        // Live Contextual Subtitle / Status below (single dynamic label)
        ctx.font = '10.5px -apple-system, sans-serif';
        let statusText = n.sub;
        let statusColor = 'rgba(237, 233, 227, 0.4)';

        if (isActive) {
          statusText = 'RESOLVING...';
          statusColor = '#FFFFFF';
        } else if (isDone) {
          if (n.id === 4) {
            statusText = isSecondPrice ? 'CLEARED ($4.82)' : 'CLEARED ($6.50)';
          } else {
            statusText = 'SETTLED [OK]';
          }
          statusColor = 'rgba(255, 255, 255, 0.85)';
        }

        ctx.fillStyle = statusColor;
        ctx.fillText(statusText, n.x, baseY + nodeR + 15);
      });

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [isSecondPrice]);

  const isExecuting = auctionState !== 'idle' && auctionState !== 'completed';

  return (
    <section className={styles.heroContainer} ref={containerRef}>
      {/* Contrast Atmospheric Vignette */}
      <div className={styles.vignetteOverlay} />

      <div className={styles.contentWrapper}>
        {/* Top Breadcrumb & System Identity */}
        <div className={styles.breadcrumbRow}>
          <Link to="/topics" className={styles.breadcrumbLink} title="Return to All Domains">
            <ArrowLeft size={13} />
            <span>All Domains</span>
          </Link>
          <span className={styles.breadcrumbDivider}>//</span>
          <span className={styles.breadcrumbTag}>MKT-02: MARKETING & ADS</span>
        </div>

        {/* Clean, Spacious Editorial Hero Title & Hook */}
        <div className={styles.headerArea}>
          <h1 className={styles.headline}>{topic.name}</h1>
          <p className={styles.hookText}>{topic.hook}</p>
        </div>

        {/* Ethereal Living Vector RTB Auction Stage (Sleek & Unboxed) */}
        <div className={styles.auctionStageWrapper}>
          {/* Simulation Canvas Viewport */}
          <div className={styles.canvasViewport}>
            <canvas ref={canvasRef} className={styles.auctionCanvas} />
          </div>

          {/* Integrated Modern Instrument Ribbon (Telemetry + Sleek Controls) */}
          <div className={styles.instrumentRibbon}>
            <div className={styles.telemetryArea}>
              <span
                className={`${styles.telemetryDot} ${
                  isExecuting ? styles.telemetryDotActive : ''
                }`}
              />
              <span className={styles.telemetryToken}>{activeStageToken}</span>
              <span className={styles.telemetryDivider}>·</span>
              <span className={styles.telemetryText}>{tickerMessage}</span>
            </div>

            <div className={styles.controlsArea}>
              {/* Pricing Model Pill Toggle (Second-Price vs First-Price) */}
              <button
                type="button"
                className={`${styles.modelToggleBtn} ${isSecondPrice ? styles.modelToggleActive : ''}`}
                onClick={() => !isExecuting && setIsSecondPrice(!isSecondPrice)}
                disabled={isExecuting}
                title="Toggle between Vickrey Generalized Second-Price (GSP) and First-Price clearing"
              >
                <span className={styles.toggleDot} />
                <span>Model: <strong>{isSecondPrice ? 'GSP SECOND-PRICE' : 'FIRST-PRICE'}</strong></span>
              </button>

              {/* Initiate Auction Execution Button */}
              <button
                type="button"
                className={styles.executeButton}
                onClick={handleInitiate}
                disabled={isExecuting}
                title="Simulate 88ms programmatic RTB ad auction settlement"
              >
                {isExecuting ? (
                  <>
                    <Activity size={13} className="animate-spin" />
                    <span>Settling Auction...</span>
                  </>
                ) : (
                  <>
                    <Play size={12} fill="#080808" />
                    <span>Settle Auction (88ms)</span>
                  </>
                )}
              </button>

              {/* Reset Button */}
              <button
                type="button"
                className={styles.resetButton}
                onClick={handleReset}
                title="Reset auction state machine"
              >
                <RotateCcw size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Minimal Scroll Cue at the base of the Hero */}
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
