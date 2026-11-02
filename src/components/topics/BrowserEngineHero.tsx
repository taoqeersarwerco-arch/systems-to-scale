import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { TopicData } from '../../data/topics';
import { ArrowLeft, Play, RotateCcw, Activity, ChevronDown } from 'lucide-react';
import styles from '../../styles/browserEngineHero.module.css';

interface BrowserEngineHeroProps {
  topic: TopicData;
}

type FrameState =
  | 'idle'
  | 's1_parse'
  | 's2_render_tree'
  | 's3_layout'
  | 's3_thrash_loop'
  | 's4_paint'
  | 's5_composite'
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
  targetX: number;
  targetY: number;
  speed: number;
  r: number;
  a: number;
  trail: Array<{ x: number; y: number; a: number }>;
}

export const BrowserEngineHero: React.FC<BrowserEngineHeroProps> = ({ topic }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Simulation State
  const [frameState, setFrameState] = useState<FrameState>('idle');
  const [isThrashingSimulated, setIsThrashingSimulated] = useState<boolean>(false);
  const [thrashCountdown, setThrashCountdown] = useState<number>(0);
  const [activeStageToken, setActiveStageToken] = useState<string>('STANDBY');
  const [tickerMessage, setTickerMessage] = useState<string>(
    'Critical rendering path profiler on standby. Target: 16.6ms for 60 FPS.'
  );

  // Animation Refs
  const stateRef = useRef<FrameState>('idle');
  const stateStartTimeRef = useRef<number>(0);
  const thrashRef = useRef<boolean>(false);
  const animTimeRef = useRef<number>(0);
  const ripplesRef = useRef<Ripple[]>([]);
  const sparksRef = useRef<Spark[]>([]);

  useEffect(() => {
    stateRef.current = frameState;
    stateStartTimeRef.current = performance.now();
  }, [frameState]);

  useEffect(() => {
    thrashRef.current = isThrashingSimulated;
  }, [isThrashingSimulated]);

  // Reset Engine State
  const handleReset = () => {
    setFrameState('idle');
    stateRef.current = 'idle';
    setActiveStageToken('STANDBY');
    setThrashCountdown(0);
    setTickerMessage('Frame profiler reset. GPU pipeline purged. Ready for trigger.');
    ripplesRef.current = [];
    sparksRef.current = [];
  };

  // Trigger Execution
  const handleInitiate = () => {
    if (frameState !== 'idle' && frameState !== 'completed') return;

    setFrameState('s1_parse');
    stateRef.current = 's1_parse';
    setActiveStageToken('01 // PARSE');
    setTickerMessage('HTML & CSS streams arriving over TCP. Tokenizing DOM & CSSOM trees in parallel.');
  };

  // State Machine Timers & Sequence Orchestrator
  useEffect(() => {
    if (frameState === 'idle' || frameState === 'completed') return;

    let timeoutId: ReturnType<typeof setTimeout>;

    if (frameState === 's1_parse') {
      timeoutId = setTimeout(() => {
        setFrameState('s2_render_tree');
        setActiveStageToken('02 // ATTACHMENT');
        setTickerMessage('Merging DOM + CSSOM into Render Tree. Pruning display: none subtrees.');
      }, 600);
    } else if (frameState === 's2_render_tree') {
      timeoutId = setTimeout(() => {
        if (thrashRef.current) {
          setFrameState('s3_thrash_loop');
          setActiveStageToken('⚠️ LAYOUT THRASH');
          setTickerMessage('JavaScript read offsetHeight immediately after write. FORCED SYNCHRONOUS REFLOW!');
          setThrashCountdown(1.4);

          const interval = setInterval(() => {
            setThrashCountdown((prev) => {
              if (prev <= 0.2) {
                clearInterval(interval);
                return 0;
              }
              return Number((prev - 0.2).toFixed(1));
            });
          }, 200);

          setTimeout(() => {
            clearInterval(interval);
            setFrameState('s4_paint');
            setActiveStageToken('04 // PAINT');
            setTickerMessage('Reflow queue drained. Recording display list vector draw calls.');
          }, 1400);
        } else {
          setFrameState('s3_layout');
          setActiveStageToken('03 // LAYOUT');
          setTickerMessage('Calculating box geometry (x, y, w, h). Single-pass clean reflow.');
        }
      }, 600);
    } else if (frameState === 's3_layout') {
      timeoutId = setTimeout(() => {
        setFrameState('s4_paint');
        setActiveStageToken('04 // PAINT');
        setTickerMessage('Geometry resolved. Recording display list vector draw commands.');
      }, 650);
    } else if (frameState === 's4_paint') {
      timeoutId = setTimeout(() => {
        setFrameState('s5_composite');
        setActiveStageToken('05 // COMPOSITE');
        setTickerMessage('Tiled textures uploaded to GPU memory. Compositor thread rendering pixels.');
      }, 650);
    } else if (frameState === 's5_composite') {
      timeoutId = setTimeout(() => {
        setFrameState('completed');
        setActiveStageToken(thrashRef.current ? 'FRAME JANK' : '60 FPS PASS');
        if (thrashRef.current) {
          setTickerMessage('Frame dropped: 42.8ms total (23 FPS) · INP violation: 112ms · Avoid layout thrashing.');
        } else {
          setTickerMessage('Frame completed in 11.4ms (60 FPS pass) · INP: 18ms · Zero layout shift (CLS: 0.00).');
        }
      }, 700);
    }

    return () => clearTimeout(timeoutId);
  }, [frameState]);

  // Main Canvas Rendering Loop: Browser Engine Architecture
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

      // Node Coordinates for Two-Stream Convergence Architecture
      const domX = W * 0.14;
      const domY = H * 0.32;

      const cssomX = W * 0.14;
      const cssomY = H * 0.70;

      const renderTreeX = W * 0.40;
      const renderTreeY = H * 0.51;

      const layoutX = W * 0.65;
      const layoutY = H * 0.51;

      const gpuX = W * 0.88;
      const gpuY = H * 0.51;

      const curState = stateRef.current;
      const elapsedInState = now - stateStartTimeRef.current;

      // -------------------------------------------------------------
      // 1. UPDATE & DRAW AMBIENT STARDUST PARTICLES & ATTRACTORS
      // -------------------------------------------------------------
      for (let pIdx = 0; pIdx < particles.length; pIdx++) {
        const p = particles[pIdx];

        p.x += p.vx + Math.sin(t * 0.5 + p.phase) * 0.05;
        p.y += p.vy + Math.cos(t * 0.4 + p.phase) * 0.05;

        // Attractor to layout engine
        const dx = layoutX - p.x;
        const dy = layoutY - p.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 120 && d > 20) {
          p.vx += (dx / d) * 0.0025;
          p.vy += (dy / d) * 0.0025;
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
      // 2. LIVE 16.6ms FRAME BUDGET METER (Across the top)
      // -------------------------------------------------------------
      const meterW = Math.min(420, W * 0.7);
      const meterX = (W - meterW) / 2;
      const meterY = 22;

      ctx.beginPath();
      ctx.moveTo(meterX, meterY);
      ctx.lineTo(meterX + meterW, meterY);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 16.6ms 60 FPS Target Tick
      const targetTickX = meterX + meterW * 0.55;
      ctx.beginPath();
      ctx.moveTo(targetTickX, meterY - 6);
      ctx.lineTo(targetTickX, meterY + 6);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(237, 233, 227, 0.5)';
      ctx.fillText('16.6ms (60 FPS)', targetTickX, meterY - 9);

      // Active Frame Fill
      let frameFillPct = 0.2;
      let frameColor = '#FFFFFF';

      if (curState === 's1_parse') frameFillPct = 0.3;
      else if (curState === 's2_render_tree') frameFillPct = 0.45;
      else if (curState === 's3_layout') frameFillPct = 0.52;
      else if (curState === 's3_thrash_loop') {
        frameFillPct = 0.92;
        frameColor = '#FFFFFF';
      } else if (curState === 's4_paint') frameFillPct = thrashRef.current ? 0.94 : 0.62;
      else if (curState === 's5_composite' || curState === 'completed') {
        frameFillPct = thrashRef.current ? 0.98 : 0.68;
      }

      ctx.beginPath();
      ctx.moveTo(meterX, meterY);
      ctx.lineTo(meterX + meterW * frameFillPct, meterY);
      ctx.strokeStyle = frameColor;
      ctx.lineWidth = 3;
      ctx.shadowColor = '#FFFFFF';
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Status text next to meter
      ctx.font = '600 9.5px monospace';
      ctx.textAlign = 'left';
      ctx.fillStyle = curState === 's3_thrash_loop' || (curState === 'completed' && thrashRef.current)
        ? '#FFFFFF'
        : 'rgba(237, 233, 227, 0.65)';
      ctx.fillText(
        curState === 's3_thrash_loop' || (curState === 'completed' && thrashRef.current)
          ? '42.8ms (JANK: 23 FPS)'
          : curState === 'completed'
          ? '11.4ms (PASS: 60 FPS)'
          : 'FRAME BUDGET',
        meterX + meterW + 12,
        meterY + 3
      );

      // -------------------------------------------------------------
      // 3. ARCHITECTURAL CONDUIT BUS PIPELINES
      // -------------------------------------------------------------
      // DOM -> Render Tree curve
      ctx.beginPath();
      ctx.moveTo(domX, domY);
      ctx.bezierCurveTo(domX + 90, domY, renderTreeX - 90, renderTreeY, renderTreeX, renderTreeY);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // CSSOM -> Render Tree curve
      ctx.beginPath();
      ctx.moveTo(cssomX, cssomY);
      ctx.bezierCurveTo(cssomX + 90, cssomY, renderTreeX - 90, renderTreeY, renderTreeX, renderTreeY);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // Render Tree -> Layout Box Geometry
      ctx.beginPath();
      ctx.moveTo(renderTreeX, renderTreeY);
      ctx.lineTo(layoutX, layoutY);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // Layout Box Geometry -> GPU Compositor
      ctx.beginPath();
      ctx.moveTo(layoutX, layoutY);
      ctx.lineTo(gpuX, gpuY);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // Forced Synchronous Reflow Loop (when layout thrashing)
      const isThrashing = curState === 's3_thrash_loop';
      const loopY = layoutY + 54;
      const loopXStart = layoutX;
      const loopXEnd = layoutX - 100;

      ctx.beginPath();
      ctx.moveTo(loopXStart, layoutY + 16);
      ctx.bezierCurveTo(loopXStart, loopY, loopXEnd, loopY, loopXEnd, layoutY + 16);

      if (isThrashing) {
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2.4;
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.font = '600 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`⚡ FORCED REFLOW RE-READ (${thrashCountdown}s)`, (loopXStart + loopXEnd) / 2, loopY + 15);

        // Spawn warning sparks
        if (Math.random() < 0.3) {
          sparksRef.current.push({
            x: (loopXStart + loopXEnd) / 2 + (Math.random() - 0.5) * 50,
            y: loopY + (Math.random() - 0.5) * 8,
            vx: (Math.random() - 0.5) * 1.8,
            vy: (Math.random() - 0.5) * 1.8,
            alpha: 1,
            r: Math.random() * 1.5 + 0.6
          });
        }
      } else {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.font = '9px monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(237, 233, 227, 0.25)';
        ctx.fillText('LAYOUT REFLOW LOOP', (loopXStart + loopXEnd) / 2, loopY + 14);
      }

      // -------------------------------------------------------------
      // 4. CONTINUOUS STREAM PACKETS ALONG STREAMS
      // -------------------------------------------------------------
      if (Math.random() < 0.12 && streamPackets.length < 8) {
        const fromDOM = Math.random() > 0.5;
        streamPackets.push({
          x: fromDOM ? domX : cssomX,
          y: fromDOM ? domY : cssomY,
          targetX: renderTreeX,
          targetY: renderTreeY,
          speed: Math.random() * 1.8 + 1.2,
          a: 0.35 + Math.random() * 0.4,
          r: Math.random() * 1.4 + 0.6,
          trail: []
        });
      }

      for (let sIdx = 0; sIdx < streamPackets.length; sIdx++) {
        const s = streamPackets[sIdx];
        s.x += s.speed;
        const progress = Math.min(1, (s.x - domX) / (renderTreeX - domX));
        s.y = s.y + (renderTreeY - s.y) * 0.08;
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
      streamPackets = streamPackets.filter((s) => s.x < renderTreeX);

      // -------------------------------------------------------------
      // 5. INTERACTIVE SURGE PACKET TRANSIT
      // -------------------------------------------------------------
      const smoothstep = (min: number, max: number, value: number) => {
        const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
        return x * x * (3 - 2 * x);
      };

      let surgePos: { x: number; y: number } | null = null;

      if (curState === 's1_parse') {
        const p = smoothstep(0, 600, elapsedInState);
        surgePos = { x: domX + (renderTreeX - domX) * p, y: domY + (renderTreeY - domY) * p };
      } else if (curState === 's2_render_tree') {
        const p = smoothstep(0, 600, elapsedInState);
        surgePos = { x: renderTreeX + (layoutX - renderTreeX) * p, y: renderTreeY };
      } else if (curState === 's3_layout') {
        const p = smoothstep(0, 650, elapsedInState);
        surgePos = { x: layoutX + (gpuX - layoutX) * p, y: layoutY };
      } else if (curState === 's4_paint') {
        const p = smoothstep(0, 650, elapsedInState);
        surgePos = { x: layoutX + (gpuX - layoutX) * p, y: layoutY };
      }

      if (surgePos) {
        ctx.save();
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 16;
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(surgePos.x, surgePos.y, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // -------------------------------------------------------------
      // 6. RIPPLE SHOCKWAVES & SPARK BURSTS
      // -------------------------------------------------------------
      if (curState === 's2_render_tree' && Math.random() < 0.08) {
        ripplesRef.current.push({ x: renderTreeX, y: renderTreeY, r: 16, maxR: 38, alpha: 0.8 });
      } else if (curState === 's5_composite' && Math.random() < 0.08) {
        ripplesRef.current.push({ x: gpuX, y: gpuY, r: 18, maxR: 44, alpha: 0.9 });
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
      // 7. DRAW NODES WITH REFINED MONOCHROMATIC GLYPHS
      // -------------------------------------------------------------
      const nodes = [
        { x: domX, y: domY, title: 'DOM TREE', sub: 'HTML Tokenizer', id: 'dom', isDone: curState !== 'idle' },
        { x: cssomX, y: cssomY, title: 'CSSOM TREE', sub: 'Style Cascade', id: 'cssom', isDone: curState !== 'idle' },
        { x: renderTreeX, y: renderTreeY, title: 'RENDER TREE', sub: 'DOM + CSSOM Attachment', id: 'render', isDone: ['s3_layout', 's3_thrash_loop', 's4_paint', 's5_composite', 'completed'].includes(curState) },
        { x: layoutX, y: layoutY, title: 'LAYOUT BOXES', sub: isThrashing ? '42ms Forced Reflow' : 'Bounding Rect Geometry', id: 'layout', isDone: ['s4_paint', 's5_composite', 'completed'].includes(curState) },
        { x: gpuX, y: gpuY, title: 'GPU COMPOSITOR', sub: '60 FPS Layer Raster', id: 'gpu', isDone: curState === 'completed' }
      ];

      nodes.forEach((n) => {
        const isActive =
          (n.id === 'dom' && curState === 's1_parse') ||
          (n.id === 'cssom' && curState === 's1_parse') ||
          (n.id === 'render' && curState === 's2_render_tree') ||
          (n.id === 'layout' && (curState === 's3_layout' || isThrashing)) ||
          (n.id === 'gpu' && curState === 's5_composite');

        const nodeR = 16;

        if (isActive) {
          const pulseR = nodeR + 6 + Math.sin(t * 8) * 3;
          ctx.beginPath();
          ctx.arc(n.x, n.y, pulseR, 0, Math.PI * 2);
          ctx.strokeStyle = isThrashing && n.id === 'layout' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, nodeR, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? '#14171A' : n.isDone ? '#101214' : '#0B0D0E';
        ctx.fill();

        ctx.strokeStyle = isActive ? '#FFFFFF' : n.isDone ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.22)';
        ctx.lineWidth = isActive ? 2 : 1.2;
        if (isActive) {
          ctx.shadowColor = '#FFFFFF';
          ctx.shadowBlur = 8;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Label above
        ctx.font = '600 10.5px monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = isActive || n.isDone ? '#FFFFFF' : 'rgba(237, 233, 227, 0.65)';
        ctx.fillText(n.title, n.x, n.y - nodeR - 11);

        // Subtitle below
        ctx.font = '10px -apple-system, sans-serif';
        let subText = n.sub;
        let subColor = 'rgba(237, 233, 227, 0.4)';

        if (isActive) {
          subText = 'RESOLVING...';
          subColor = '#FFFFFF';
        } else if (n.isDone) {
          subText = n.id === 'layout' && thrashRef.current ? '⚠️ REFLOW (42.8ms)' : 'SETTLED [OK]';
          subColor = 'rgba(255, 255, 255, 0.85)';
        }

        ctx.fillStyle = subColor;
        ctx.fillText(subText, n.x, n.y + nodeR + 14);
      });

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, []);

  const isExecuting = frameState !== 'idle' && frameState !== 'completed';

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
          <span className={styles.breadcrumbTag}>WEB-03: WEB DESIGN</span>
        </div>

        {/* Clean, Spacious Editorial Hero Title & Hook */}
        <div className={styles.headerArea}>
          <h1 className={styles.headline}>{topic.name}</h1>
          <p className={styles.hookText}>{topic.hook}</p>
        </div>

        {/* The Ethereal Living Browser Engine Stage */}
        <div className={styles.engineStageWrapper}>
          {/* Canvas Viewport */}
          <div className={styles.canvasViewport}>
            <canvas ref={canvasRef} className={styles.engineCanvas} />
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
              {/* Layout Thrashing Simulation Toggle */}
              <button
                type="button"
                className={`${styles.thrashToggleBtn} ${isThrashingSimulated ? styles.thrashToggleActive : ''}`}
                onClick={() => !isExecuting && setIsThrashingSimulated(!isThrashingSimulated)}
                disabled={isExecuting}
                title="Toggle forced synchronous layout thrashing"
              >
                <span className={styles.toggleDot} />
                <span>Reflow: <strong>{isThrashingSimulated ? 'FORCED THRASH' : 'CLEAN'}</strong></span>
              </button>

              {/* Initiate Profile Frame Execution Button */}
              <button
                type="button"
                className={styles.executeButton}
                onClick={handleInitiate}
                disabled={isExecuting}
                title="Profile a single 60 FPS browser frame render"
              >
                {isExecuting ? (
                  <>
                    <Activity size={13} className="animate-spin" />
                    <span>Profiling Frame...</span>
                  </>
                ) : (
                  <>
                    <Play size={12} fill="#080808" />
                    <span>Profile Frame (16.6ms)</span>
                  </>
                )}
              </button>

              {/* Reset Button */}
              <button
                type="button"
                className={styles.resetButton}
                onClick={handleReset}
                title="Reset browser engine profiler"
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
