import React, { useState, useEffect, useRef } from 'react';
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

  // Main Canvas Rendering Loop with Topics Hub Particle Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    // 45 Ambient Stardust Particles (Inspired by TopicCinematicCard)
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      a: number;
      ta: number;
      phase: number;
    }> = [];

    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * 900,
        y: Math.random() * 260,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.3 + 0.35,
        a: 0.15 + Math.random() * 0.25,
        ta: 0.2 + Math.random() * 0.25,
        phase: Math.random() * Math.PI * 2
      });
    }

    // Continuous Traveling Energy Stream Packets along the pipeline track
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

      // Node coordinates
      const x1 = W * 0.12;
      const x2 = W * 0.37;
      const x3 = W * 0.63;
      const x4 = W * 0.88;
      const baseY = 86;
      const nodeR = 20;

      const nodes = [
        { id: 1, x: x1, y: baseY, label: '01', title: 'INGRESS', sub: 'Webhook Gate' },
        { id: 2, x: x2, y: baseY, label: '02', title: 'DEDUPE', sub: 'SHA-256 Lock' },
        { id: 3, x: x3, y: baseY, label: '03', title: 'DISPATCH', sub: 'Upstream API' },
        { id: 4, x: x4, y: baseY, label: '04', title: 'SETTLE', sub: 'State Commit' }
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
          if (d < 100 && d > 14) {
            p.vx += (dx / d) * 0.0025;
            p.vy += (dy / d) * 0.0025;
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
      const isStage2Done = [
        's2_to_s3',
        's3_dispatch',
        's3_fault_loop',
        's3_retry_burst',
        's3_to_s4',
        's4_settle',
        'completed'
      ].includes(curState);
      const isStage3Done = ['s3_to_s4', 's4_settle', 'completed'].includes(curState);
      const isStage4Done = curState === 'completed';

      // -------------------------------------------------------------
      // 2. MAIN CIRCUIT CONDUIT BUS TRACK
      // -------------------------------------------------------------
      // Base inactive conduit track
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x1, baseY);
      ctx.lineTo(x4, baseY);
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

      streamPackets = streamPackets.filter((s) => s.x < x4);

      // -------------------------------------------------------------
      // 4. EXPONENTIAL BACKOFF RETURN LOOP (Node 03)
      // -------------------------------------------------------------
      const loopY = baseY + 66;
      const loopXStart = x3;
      const loopXEnd = x3 - 130;
      const isLoopActive = curState === 's3_fault_loop';

      ctx.beginPath();
      ctx.moveTo(loopXStart, baseY + nodeR);
      ctx.bezierCurveTo(loopXStart, loopY, loopXEnd, loopY, loopXEnd, baseY + nodeR);

      if (isLoopActive) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.lineWidth = 2.4;
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Label below the loop
      ctx.font = '9.5px monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = isLoopActive ? '#FFFFFF' : 'rgba(237, 233, 227, 0.45)';
      ctx.fillText(
        isLoopActive ? '⚡ ACTIVE EXPONENTIAL BACKPRESSURE QUEUE' : 'RETRY CONDUIT // t = 2^k × 1000ms + JITTER',
        (loopXStart + loopXEnd) / 2,
        loopY + 16
      );

      // -------------------------------------------------------------
      // 5. SMOOTH PHYSICAL TRANSIT PACKET ON "INITIATE PIPELINE"
      // -------------------------------------------------------------
      let packetPos: { x: number; y: number } | null = null;
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
        const loopDuration = 2240;
        const p = (elapsedInState % loopDuration) / loopDuration;

        const p0 = { x: loopXStart, y: baseY + nodeR };
        const p1 = { x: loopXStart, y: loopY };
        const p2 = { x: loopXEnd, y: loopY };
        const p3 = { x: loopXEnd, y: baseY + nodeR };

        const tP = p;
        const oneMinusT = 1 - tP;
        const bX =
          Math.pow(oneMinusT, 3) * p0.x +
          3 * Math.pow(oneMinusT, 2) * tP * p1.x +
          3 * oneMinusT * Math.pow(tP, 2) * p2.x +
          Math.pow(tP, 3) * p3.x;
        const bY =
          Math.pow(oneMinusT, 3) * p0.y +
          3 * Math.pow(oneMinusT, 2) * tP * p1.y +
          3 * oneMinusT * Math.pow(tP, 2) * p2.y +
          Math.pow(tP, 3) * p3.y;

        packetPos = { x: bX, y: bY };

        // Spawn electrical spark embers during backpressure
        if (Math.random() < 0.3) {
          sparksRef.current.push({
            x: bX,
            y: bY,
            vx: (Math.random() - 0.5) * 1.8,
            vy: (Math.random() - 0.5) * 1.8,
            alpha: 1,
            r: Math.random() * 1.5 + 0.6
          });
        }
      } else if (curState === 's3_retry_burst') {
        packetPos = { x: x3, y: baseY };
      } else if (curState === 's3_to_s4') {
        const p = smoothstep(0, 650, elapsedInState);
        packetPos = { x: x3 + (x4 - x3) * p, y: baseY };
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
      // Periodic ripples on active node
      if (curState === 's1_ingress' && Math.random() < 0.08) {
        ripplesRef.current.push({ x: x1, y: baseY, r: 18, maxR: 38, alpha: 0.8 });
      } else if (curState === 's2_dedupe' && Math.random() < 0.08) {
        ripplesRef.current.push({ x: x2, y: baseY, r: 18, maxR: 38, alpha: 0.8 });
      } else if (curState === 's4_settle' && Math.random() < 0.08) {
        ripplesRef.current.push({ x: x4, y: baseY, r: 18, maxR: 44, alpha: 0.9 });
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
      // 7. DRAW STAGE NODES & MONOCHROMATIC GLYPHS
      // -------------------------------------------------------------
      nodes.forEach((n) => {
        const isActive =
          (n.id === 1 && curState === 's1_ingress') ||
          (n.id === 2 && curState === 's2_dedupe') ||
          (n.id === 3 && (curState === 's3_dispatch' || curState === 's3_fault_loop')) ||
          (n.id === 4 && curState === 's4_settle');

        const isDone =
          (n.id === 1 && isStage1Done) ||
          (n.id === 2 && isStage2Done) ||
          (n.id === 3 && isStage3Done) ||
          (n.id === 4 && isStage4Done);

        const isFault = n.id === 3 && curState === 's3_fault_loop';

        // Outer halo ring if active
        if (isActive) {
          const pulseR = nodeR + 6 + Math.sin(t * 8) * 3;
          ctx.beginPath();
          ctx.arc(n.x, n.y, pulseR, 0, Math.PI * 2);
          ctx.strokeStyle = isFault ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.65)';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        // Main Node Circle Body
        ctx.beginPath();
        ctx.arc(n.x, n.y, nodeR, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? '#14171A' : isDone ? '#101214' : '#0B0D0E';
        ctx.fill();

        ctx.strokeStyle = isFault
          ? '#FFFFFF'
          : isActive
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
        ctx.font = '600 11.5px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = isActive || isDone ? '#FFFFFF' : 'rgba(237, 233, 227, 0.45)';
        ctx.fillText(n.label, n.x, n.y);

        // Header Stage Title above
        ctx.font = '10px monospace';
        ctx.fillStyle = 'rgba(237, 233, 227, 0.45)';
        ctx.fillText(`STAGE ${n.label}`, n.x, baseY - nodeR - 22);

        ctx.font = '600 12px sans-serif';
        ctx.fillStyle = isActive || isDone ? '#FFFFFF' : 'rgba(237, 233, 227, 0.75)';
        ctx.fillText(n.title, n.x, baseY - nodeR - 8);

        // Description / Subtitle below
        ctx.font = '10px sans-serif';
        ctx.fillStyle = 'rgba(237, 233, 227, 0.4)';
        ctx.fillText(n.sub, n.x, baseY + nodeR + 14);

        // Live Status Text underneath
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
        ctx.fillText(statusText, n.x, baseY + nodeR + 27);
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
        {/* Minimal Navigation Breadcrumb */}
        <div className={styles.breadcrumbRow}>
          <Link to="/topics" className={styles.breadcrumbLink} title="Return to All Domains">
            <ArrowLeft size={13} />
            <span>All Domains</span>
          </Link>
          <span className={styles.breadcrumbDivider}>//</span>
          <span className={styles.breadcrumbTag}>SYS-01: AI & AUTOMATION</span>
        </div>

        {/* Minimal, High-End Editorial Hero Header */}
        <div className={styles.headerArea}>
          <h1 className={styles.headline}>{topic.name}</h1>
          <p className={styles.hookText}>{topic.hook}</p>
        </div>

        {/* =====================================================================
            CINEMATIC VECTOR CIRCUIT REACTOR SIMULATION STAGE
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
