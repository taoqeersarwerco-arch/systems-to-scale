import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { TopicData } from '../../data/topics';
import { ArrowLeft, Play, RotateCcw, Activity, ChevronDown } from 'lucide-react';
import styles from '../../styles/auctionExchangeHero.module.css';

interface AuctionExchangeHeroProps {
  topic: TopicData;
}

type RtbState =
  | 'idle'
  | 's1_ingress'
  | 's2_broadcast'
  | 's3_converge'
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
  const [rtbState, setRtbState] = useState<RtbState>('idle');
  const [isSecondPrice, setIsSecondPrice] = useState<boolean>(true);
  const [activeStageToken, setActiveStageToken] = useState<string>('STANDBY');
  const [tickerMessage, setTickerMessage] = useState<string>(
    'OpenRTB 3.0 auction clearinghouse ready. Sub-100ms programmatic settlement.'
  );

  // Animation Refs
  const stateRef = useRef<RtbState>('idle');
  const stateStartTimeRef = useRef<number>(0);
  const animTimeRef = useRef<number>(0);
  const ripplesRef = useRef<Ripple[]>([]);
  const sparksRef = useRef<Spark[]>([]);

  useEffect(() => {
    stateRef.current = rtbState;
    stateStartTimeRef.current = performance.now();
  }, [rtbState]);

  // Reset Auction State
  const handleReset = () => {
    setRtbState('idle');
    stateRef.current = 'idle';
    setActiveStageToken('STANDBY');
    setTickerMessage('Exchange conduits discharged. Cache cleared. Ready for trigger.');
    ripplesRef.current = [];
    sparksRef.current = [];
  };

  // Trigger Execution
  const handleInitiate = () => {
    if (rtbState !== 'idle' && rtbState !== 'completed') return;

    setRtbState('s1_ingress');
    stateRef.current = 's1_ingress';
    setActiveStageToken('01 // INGRESS');
    setTickerMessage('Ad slot impression requested. Verifying Consent Mode v2 cookieless ping.');
  };

  // State Machine Timers & Sequence Orchestrator
  useEffect(() => {
    if (rtbState === 'idle' || rtbState === 'completed') return;

    let timeoutId: ReturnType<typeof setTimeout>;

    if (rtbState === 's1_ingress') {
      timeoutId = setTimeout(() => {
        setRtbState('s2_broadcast');
        setActiveStageToken('02 // BROADCAST');
        setTickerMessage('Exchange broadcasting bid requests in parallel to 4 DSPs (tmax = 100ms)...');
      }, 550);
    } else if (rtbState === 's2_broadcast') {
      timeoutId = setTimeout(() => {
        setRtbState('s3_converge');
        setActiveStageToken('03 // CONVERGE');
        setTickerMessage('4 DSP bids streaming concurrently into central clearinghouse...');
      }, 500);
    } else if (rtbState === 's3_converge') {
      timeoutId = setTimeout(() => {
        setRtbState('s4_clear');
        setActiveStageToken('04 // CLEAR');
        if (isSecondPrice) {
          setTickerMessage('DSP Alpha won (AdRank: 59.8). Second-price cleared at $4.82 CPM (saved $1.68).');
        } else {
          setTickerMessage('DSP Alpha won (AdRank: 59.8). First-price cleared at $6.50 CPM.');
        }
      }, 850);
    } else if (rtbState === 's4_clear') {
      timeoutId = setTimeout(() => {
        setRtbState('s5_render');
        setActiveStageToken('05 // RENDER');
        setTickerMessage('Win notification acknowledged. Creative delivered to browser frame.');
      }, 750);
    } else if (rtbState === 's5_render') {
      timeoutId = setTimeout(() => {
        setRtbState('completed');
        setActiveStageToken('SETTLED');
        setTickerMessage('Auction settled in 88ms total. 0 fraud deflection. Viewport impression logged.');
      }, 700);
    }

    return () => clearTimeout(timeoutId);
  }, [rtbState, isSecondPrice]);

  // Main Canvas Rendering Loop: The Programmatic Auction Arena
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
        x: Math.random() * 1100,
        y: Math.random() * 320,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.2 + 0.35,
        a: 0.15 + Math.random() * 0.25,
        phase: Math.random() * Math.PI * 2
      });
    }

    // Continuous Traveling Energy Stream Packets
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

      // Coordinates for Hub-and-Spoke Auction Arena
      const pubX = W * 0.12;
      const pubY = H * 0.5;

      const consentX = W * 0.27;
      const consentY = H * 0.5;

      const exX = W * 0.50;
      const exY = H * 0.5;
      const exR = 30;

      // 4 Satellite DSP Nodes on Right Side
      const dspX = W * 0.84;
      const dsps = [
        { id: 1, name: 'Alpha (Brand)', bid: 6.50, qs: 9.2, adRank: 59.8, y: H * 0.18, isWinner: true },
        { id: 2, name: 'Beta (Direct)', bid: 8.20, qs: 5.4, adRank: 44.3, y: H * 0.38, isWinner: false },
        { id: 3, name: 'Gamma (Retarget)', bid: 4.80, qs: 8.8, adRank: 42.2, y: H * 0.62, isWinner: false },
        { id: 4, name: 'Delta (Affiliate)', bid: 3.10, qs: 6.0, adRank: 18.6, y: H * 0.82, isWinner: false }
      ];

      const curState = stateRef.current;
      const elapsedInState = now - stateStartTimeRef.current;

      // -------------------------------------------------------------
      // 1. UPDATE & DRAW AMBIENT STARDUST PARTICLES & ATTRACTORS
      // -------------------------------------------------------------
      for (let pIdx = 0; pIdx < particles.length; pIdx++) {
        const p = particles[pIdx];

        p.x += p.vx + Math.sin(t * 0.5 + p.phase) * 0.05;
        p.y += p.vy + Math.cos(t * 0.4 + p.phase) * 0.05;

        // Gravitational pull toward central exchange nexus
        const dx = exX - p.x;
        const dy = exY - p.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 160 && d > 20) {
          p.vx += (dx / d) * 0.0028;
          p.vy += (dy / d) * 0.0028;
        }

        p.vx *= 0.995;
        p.vy *= 0.995;

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
          if (d < 70) {
            const alpha = (1 - d / 70) * 0.07 * Math.min(particles[i].a, particles[j].a);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha.toFixed(4)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // -------------------------------------------------------------
      // 2. CONCENTRIC RADAR RINGS & EXCHANGE GRIDS
      // -------------------------------------------------------------
      const radarRadii = [45, 95, 155, 225];
      radarRadii.forEach((rad) => {
        ctx.beginPath();
        ctx.arc(exX, exY, rad, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Subtle ambient radar sweep
      const sweepAngle = (t * 0.7) % (Math.PI * 2);
      ctx.beginPath();
      ctx.moveTo(exX, exY);
      ctx.arc(exX, exY, 225, sweepAngle, sweepAngle + 0.35);
      ctx.lineTo(exX, exY);
      const sweepGrad = ctx.createRadialGradient(exX, exY, 10, exX, exY, 225);
      sweepGrad.addColorStop(0, 'rgba(255, 255, 255, 0.04)');
      sweepGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = sweepGrad;
      ctx.fill();

      // -------------------------------------------------------------
      // 3. ARCHITECTURAL BUS CONDUITS
      // -------------------------------------------------------------
      // Publisher to Consent Gate
      ctx.beginPath();
      ctx.moveTo(pubX, pubY);
      ctx.lineTo(consentX, consentY);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // Consent Gate to Central Exchange
      ctx.beginPath();
      ctx.moveTo(consentX, consentY);
      ctx.lineTo(exX, exY);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // Central Exchange to 4 DSP Satellites
      dsps.forEach((dsp) => {
        ctx.beginPath();
        ctx.moveTo(exX, exY);
        ctx.lineTo(dspX, dsp.y);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.09)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // -------------------------------------------------------------
      // 4. CONTINUOUS STREAM PACKETS ALONG CONDUITS (Living Machine)
      // -------------------------------------------------------------
      if (Math.random() < 0.1 && streamPackets.length < 8) {
        streamPackets.push({
          x: pubX,
          y: pubY,
          speed: Math.random() * 1.6 + 1.2,
          a: 0.35 + Math.random() * 0.4,
          r: Math.random() * 1.4 + 0.6,
          trail: []
        });
      }

      for (let sIdx = 0; sIdx < streamPackets.length; sIdx++) {
        const s = streamPackets[sIdx];
        s.x += s.speed;
        s.trail.push({ x: s.x, y: s.y, a: s.a });
        if (s.trail.length > 8) s.trail.shift();

        for (let trIdx = 0; trIdx < s.trail.length; trIdx++) {
          const tr = s.trail[trIdx];
          const fade = (trIdx / s.trail.length) * tr.a;
          ctx.beginPath();
          ctx.arc(tr.x, tr.y, s.r * (0.3 + (0.7 * trIdx) / s.trail.length), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${fade.toFixed(3)})`;
          ctx.fill();
        }
      }
      streamPackets = streamPackets.filter((s) => s.x < exX);

      // -------------------------------------------------------------
      // 5. INTERACTIVE AUCTION PHASES & BEAM CONVERGENCE
      // -------------------------------------------------------------
      const smoothstep = (min: number, max: number, value: number) => {
        const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
        return x * x * (3 - 2 * x);
      };

      // Step 1: Ingress packet (Publisher -> Consent -> Exchange)
      if (curState === 's1_ingress') {
        const p = smoothstep(0, 550, elapsedInState);
        const curX = pubX + (consentX - pubX) * p;
        ctx.save();
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 14;
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(curX, pubY, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Step 2: Broadcast radar wave (Exchange -> DSPs)
      if (curState === 's2_broadcast') {
        const p = Math.min(1, elapsedInState / 450);
        const waveR = 20 + p * 240;
        ctx.beginPath();
        ctx.arc(exX, exY, waveR, -Math.PI * 0.45, Math.PI * 0.45);
        ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - p).toFixed(2)})`;
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }

      // Step 3: Concurrent Multi-DSP Bid Beams Converging into Core
      if (curState === 's3_converge') {
        const p = Math.min(1, elapsedInState / 800);

        dsps.forEach((dsp) => {
          const curX = dspX + (exX - dspX) * p;
          const curY = dsp.y + (exY - dsp.y) * p;

          ctx.beginPath();
          ctx.moveTo(dspX, dsp.y);
          ctx.lineTo(curX, curY);
          ctx.strokeStyle = dsp.isWinner
            ? 'rgba(255, 255, 255, 0.95)'
            : 'rgba(255, 255, 255, 0.35)';
          ctx.lineWidth = dsp.isWinner ? 2.2 : 1.2;
          if (dsp.isWinner) {
            ctx.shadowColor = '#FFFFFF';
            ctx.shadowBlur = 10;
          }
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Traveling Bid Tag
          ctx.font = '600 9px monospace';
          ctx.fillStyle = dsp.isWinner ? '#FFFFFF' : 'rgba(237, 233, 227, 0.6)';
          ctx.fillText(`$${dsp.bid.toFixed(2)}`, curX, curY - 7);

          // Sparks at convergence point
          if (Math.random() < 0.25) {
            sparksRef.current.push({
              x: curX,
              y: curY,
              vx: (Math.random() - 0.5) * 1.8,
              vy: (Math.random() - 0.5) * 1.8,
              alpha: 1,
              r: Math.random() * 1.4 + 0.5
            });
          }
        });
      }

      // Step 4: Vickrey Clearing Settlement
      if (curState === 's4_clear' || curState === 's5_render' || curState === 'completed') {
        // High-intensity winner laser lock from DSP Alpha
        const winner = dsps[0];
        ctx.beginPath();
        ctx.moveTo(dspX, winner.y);
        ctx.lineTo(exX, exY);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 2.4;
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Step 5: Render Win Token transit back to Publisher
      if (curState === 's5_render') {
        const p = smoothstep(0, 700, elapsedInState);
        const curX = exX + (pubX - exX) * p;
        ctx.save();
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 16;
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(curX, pubY, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // -------------------------------------------------------------
      // 6. RIPPLE SHOCKWAVES & SPARK BURSTS
      // -------------------------------------------------------------
      if (curState === 's4_clear' && Math.random() < 0.1) {
        ripplesRef.current.push({ x: exX, y: exY, r: exR, maxR: exR + 32, alpha: 0.85 });
      } else if (curState === 's5_render' && Math.random() < 0.1) {
        ripplesRef.current.push({ x: pubX, y: pubY, r: 16, maxR: 40, alpha: 0.9 });
      }

      ripplesRef.current.forEach((rp) => {
        rp.r += 0.85;
        rp.alpha *= 0.93;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${rp.alpha.toFixed(3)})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });
      ripplesRef.current = ripplesRef.current.filter((rp) => rp.alpha > 0.05);

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
      // 7. DRAW NODES: PUBLISHER, CONSENT GATE, CORE, & DSPS
      // -------------------------------------------------------------
      // A. Publisher Ad Slot Node
      ctx.beginPath();
      ctx.arc(pubX, pubY, 16, 0, Math.PI * 2);
      ctx.fillStyle = '#101214';
      ctx.fill();
      ctx.strokeStyle = curState === 's5_render' || curState === 'completed'
        ? '#FFFFFF'
        : 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1.4;
      ctx.stroke();

      ctx.font = '600 10.5px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('AD', pubX, pubY);

      ctx.font = '600 10px monospace';
      ctx.fillStyle = 'rgba(237, 233, 227, 0.7)';
      ctx.fillText('PUBLISHER', pubX, pubY - 26);
      ctx.font = '9.5px -apple-system, sans-serif';
      ctx.fillStyle = 'rgba(237, 233, 227, 0.4)';
      ctx.fillText('300×250 MREC', pubX, pubY + 26);

      // B. Consent Mode v2 Gate
      ctx.beginPath();
      ctx.arc(consentX, consentY, 14, 0, Math.PI * 2);
      ctx.fillStyle = '#0E1012';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.font = '600 9.5px monospace';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('v2', consentX, consentY);

      ctx.font = '600 9.5px monospace';
      ctx.fillStyle = 'rgba(237, 233, 227, 0.65)';
      ctx.fillText('CONSENT GATE', consentX, consentY - 24);
      ctx.font = '9px -apple-system, sans-serif';
      ctx.fillStyle = 'rgba(237, 233, 227, 0.4)';
      ctx.fillText('Cookieless Ping', consentX, consentY + 24);

      // C. The Central OpenRTB 3.0 Clearing Arbiter (Exchange Nexus)
      const isExActive = curState === 's3_converge' || curState === 's4_clear';
      const isExSettled = curState === 's5_render' || curState === 'completed';

      ctx.beginPath();
      ctx.arc(exX, exY, exR, 0, Math.PI * 2);
      ctx.fillStyle = isExActive ? '#15181C' : '#0B0D0E';
      ctx.fill();

      ctx.strokeStyle = isExActive || isExSettled ? '#FFFFFF' : 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = isExActive ? 2.4 : 1.6;
      if (isExActive || isExSettled) {
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 14;
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Exchange Core Label Above
      ctx.font = '600 11px monospace';
      ctx.fillStyle = isExActive || isExSettled ? '#FFFFFF' : 'rgba(237, 233, 227, 0.7)';
      ctx.fillText('OPENRTB 3.0 EXCHANGE', exX, exY - exR - 14);

      // Center Core Readout
      ctx.font = '700 12px monospace';
      let coreReadout = 'STANDBY';
      if (curState === 's1_ingress') coreReadout = 'INGRESS';
      else if (curState === 's2_broadcast') coreReadout = 'BROADCAST';
      else if (curState === 's3_converge') coreReadout = 'BIDDING';
      else if (isExSettled || curState === 's4_clear') {
        coreReadout = isSecondPrice ? '$4.82 CPM' : '$6.50 CPM';
      }
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(coreReadout, exX, exY);

      // Core Subtitle Below
      ctx.font = '9.5px -apple-system, sans-serif';
      ctx.fillStyle = 'rgba(237, 233, 227, 0.45)';
      ctx.fillText(isSecondPrice ? 'Vickrey GSP Arbiter' : 'First-Price Arbiter', exX, exY + exR + 15);

      // D. 4 DSP Satellite Nodes on the Right
      dsps.forEach((dsp) => {
        const isDspWinner = dsp.isWinner && (curState === 's4_clear' || isExSettled);

        ctx.beginPath();
        ctx.arc(dspX, dsp.y, 11, 0, Math.PI * 2);
        ctx.fillStyle = isDspWinner ? '#181C20' : '#0E1012';
        ctx.fill();

        ctx.strokeStyle = isDspWinner
          ? '#FFFFFF'
          : 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = isDspWinner ? 2 : 1.2;
        if (isDspWinner) {
          ctx.shadowColor = '#FFFFFF';
          ctx.shadowBlur = 8;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // DSP Name and Metrics text
        ctx.font = isDspWinner ? '600 10.5px monospace' : '500 10px monospace';
        ctx.textAlign = 'left';
        ctx.fillStyle = isDspWinner ? '#FFFFFF' : 'rgba(237, 233, 227, 0.6)';
        ctx.fillText(`DSP ${dsp.name}`, dspX + 16, dsp.y - 4);

        ctx.font = '9px monospace';
        ctx.fillStyle = isDspWinner ? 'rgba(255, 255, 255, 0.85)' : 'rgba(237, 233, 227, 0.35)';
        ctx.fillText(`Bid: $${dsp.bid.toFixed(2)} · QS: ${dsp.qs} · AdRank: ${dsp.adRank}`, dspX + 16, dsp.y + 8);
      });

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [isSecondPrice]);

  const isExecuting = rtbState !== 'idle' && rtbState !== 'completed';

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

        {/* The Programmatic RTB Auction Arena Stage */}
        <div className={styles.auctionStageWrapper}>
          {/* Canvas Viewport */}
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
                <span>Model: <strong>{isSecondPrice ? 'VICKREY GSP (2ND-PRICE)' : 'FIRST-PRICE'}</strong></span>
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
