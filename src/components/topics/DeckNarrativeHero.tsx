import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { TopicData } from '../../data/topics';
import { ArrowLeft, Play, RotateCcw, Presentation, ChevronDown, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import styles from '../../styles/deckNarrativeHero.module.css';

interface DeckNarrativeHeroProps {
  topic: TopicData;
}

type FidelityFormat = 'vector' | 'raster' | 'fallback';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
  phase: number;
}

export const DeckNarrativeHero: React.FC<DeckNarrativeHeroProps> = ({ topic }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Simulation State
  const [format, setFormat] = useState<FidelityFormat>('vector');
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(3); // Default to Slide 4: Traction
  const [isSweeping, setIsSweeping] = useState<boolean>(false);
  const [activeStageToken, setActiveStageToken] = useState<string>('NATIVE VECTOR');
  const [tickerMessage, setTickerMessage] = useState<string>(
    'Native Keynote Vector Math: Lossless PostScript curves · Anti-aliased at 4K retina resolution.'
  );

  // Animation Refs
  const formatRef = useRef<FidelityFormat>('vector');
  const slideIndexRef = useRef<number>(3);
  const animTimeRef = useRef<number>(0);

  useEffect(() => {
    formatRef.current = format;
    if (format === 'vector') {
      setActiveStageToken('4K RETINA VECTOR');
      setTickerMessage('Lossless PostScript bezier curves · Mathematical sub-pixel font hinting · 100% projection fidelity.');
    } else if (format === 'raster') {
      setActiveStageToken('⚠️ 72 DPI RASTER');
      setTickerMessage('Bilinear downsampling compression · Blurry edges and ringing artifacts on retina conference displays.');
    } else if (format === 'fallback') {
      setActiveStageToken('⚠️ PPTX FONT CLASH');
      setTickerMessage('Custom display font stripped by host OS · Fallback serif substituted · Baseline metrics misaligned.');
    }
  }, [format]);

  useEffect(() => {
    slideIndexRef.current = activeSlideIndex;
  }, [activeSlideIndex]);

  // Reset Engine
  const handleReset = () => {
    setFormat('vector');
    setActiveSlideIndex(3);
    setIsSweeping(false);
    setActiveStageToken('4K RETINA VECTOR');
    setTickerMessage('Fidelity inspector reset. Native vector math restored.');
  };

  // Narrative Arc Sweep Loop
  const handleNarrativeSweep = () => {
    if (isSweeping) return;
    setIsSweeping(true);
    let currentIdx = 0;
    setActiveSlideIndex(0);

    const interval = setInterval(() => {
      currentIdx++;
      if (currentIdx > 4) {
        clearInterval(interval);
        setIsSweeping(false);
        setActiveSlideIndex(3); // Return to Traction
        return;
      }
      setActiveSlideIndex(currentIdx);
    }, 800);
  };

  // Main Canvas Rendering Loop
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

      const curFmt = formatRef.current;
      const curSlide = slideIndexRef.current;

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
      // 2. NARRATIVE ARC TRACK (Upper Horizon)
      // -------------------------------------------------------------
      const narrativeNodes = [
        { label: '01 // PROBLEM', desc: 'Market Friction' },
        { label: '02 // SOLUTION', desc: 'Breakthrough Paradigm' },
        { label: '03 // TAM GEOMETRY', desc: '$42B Market' },
        { label: '04 // TRACTION', desc: 'Exponential Cohort' },
        { label: '05 // THE ASK', desc: 'Capital Allocation' }
      ];

      const arcY = H * 0.20;
      const startX = W * 0.12;
      const endX = W * 0.88;
      const stepX = (endX - startX) / (narrativeNodes.length - 1);

      // Arc Connecting Line
      ctx.beginPath();
      ctx.moveTo(startX, arcY);
      ctx.lineTo(endX, arcY);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();

      narrativeNodes.forEach((node, idx) => {
        const nx = startX + idx * stepX;
        const isActive = curSlide === idx;

        // Pulse ring
        if (isActive) {
          ctx.beginPath();
          ctx.arc(nx, arcY, 12 + Math.sin(t * 4) * 2, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(nx, arcY, isActive ? 5 : 3.5, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.3)';
        ctx.fill();

        ctx.font = isActive ? '600 9px -apple-system, sans-serif' : '8.5px "JetBrains Mono", monospace';
        ctx.fillStyle = isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.45)';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, nx, arcY - 12);
      });

      // -------------------------------------------------------------
      // 3. LIVING SLIDE VIEWPORT (Center Stage)
      // -------------------------------------------------------------
      const slideW = Math.min(W * 0.64, 520);
      const slideH = 150;
      const slideX = (W - slideW) / 2;
      const slideY = H * 0.38;

      // Slide Outer Frame
      ctx.fillStyle = 'rgba(10, 12, 14, 0.75)';
      ctx.fillRect(slideX, slideY, slideW, slideH);
      ctx.strokeStyle = curFmt === 'vector' ? 'rgba(255, 255, 255, 0.16)' : curFmt === 'raster' ? 'rgba(229, 169, 60, 0.35)' : 'rgba(229, 169, 60, 0.45)';
      ctx.lineWidth = 1;
      ctx.strokeRect(slideX, slideY, slideW, slideH);

      // Slide Corner Crosshairs
      const chLen = 6;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1;
      // Top-left
      ctx.beginPath(); ctx.moveTo(slideX, slideY + chLen); ctx.lineTo(slideX, slideY); ctx.lineTo(slideX + chLen, slideY); ctx.stroke();
      // Top-right
      ctx.beginPath(); ctx.moveTo(slideX + slideW - chLen, slideY); ctx.lineTo(slideX + slideW, slideY); ctx.lineTo(slideX + slideW, slideY + chLen); ctx.stroke();
      // Bottom-left
      ctx.beginPath(); ctx.moveTo(slideX, slideY + slideH - chLen); ctx.lineTo(slideX, slideY + slideH); ctx.lineTo(slideX + chLen, slideY + slideH); ctx.stroke();
      // Bottom-right
      ctx.beginPath(); ctx.moveTo(slideX + slideW - chLen, slideY + slideH); ctx.lineTo(slideX + slideW, slideY + slideH); ctx.lineTo(slideX + slideW, slideY + slideH - chLen); ctx.stroke();

      // Raster Scanlines simulation if 72 DPI
      if (curFmt === 'raster') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
        for (let sl = 0; sl < slideH; sl += 4) {
          ctx.fillRect(slideX, slideY + sl, slideW, 2);
        }
      }

      // Slide Content Rendering
      // Dynamic Cohort ARR Curve inside slide
      const chartX = slideX + 30;
      const chartY = slideY + slideH - 30;
      const chartW = slideW - 60;
      const chartH = 65;

      // Draw Grid Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let g = 0; g < 4; g++) {
        const gy = chartY - (chartH / 3) * g;
        ctx.beginPath(); ctx.moveTo(chartX, gy); ctx.lineTo(chartX + chartW, gy); ctx.stroke();
      }

      // Cohort Growth Curve
      ctx.beginPath();
      ctx.moveTo(chartX, chartY);
      ctx.bezierCurveTo(
        chartX + chartW * 0.35, chartY - 5,
        chartX + chartW * 0.65, chartY - chartH * 0.45,
        chartX + chartW, chartY - chartH
      );

      if (curFmt === 'raster') {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 3;
        ctx.stroke(); // Blurry thick stroke
      } else {
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.8;
        ctx.stroke();
      }

      // Endpoint Dot
      ctx.beginPath();
      ctx.arc(chartX + chartW, chartY - chartH, curFmt === 'raster' ? 6 : 4, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();

      // Slide Metric Typography
      const fontFace = curFmt === 'fallback' ? 'Times New Roman, serif' : '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      const letterSpace = curFmt === 'fallback' ? 2 : 0;

      ctx.save();
      if (curFmt === 'raster') {
        ctx.filter = 'blur(1.1px)';
      }

      // Headline
      ctx.font = `700 ${curFmt === 'fallback' ? '22px' : '20px'} ${fontFace}`;
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'left';
      const textBaselineShift = curFmt === 'fallback' ? 8 : 0;
      ctx.fillText('$12.4M ARR Cohort Retention', slideX + 30, slideY + 36 + textBaselineShift);

      // Sub-label
      ctx.font = `9px "JetBrains Mono", monospace`;
      ctx.fillStyle = curFmt === 'vector' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(229, 169, 60, 0.9)';
      const subText = curFmt === 'vector'
        ? '100% Vector Math · Anti-aliased 4K PostScript'
        : curFmt === 'raster'
        ? '⚠️ 72 DPI Subsampling · Edge Ringing on Retina'
        : '⚠️ System Font Stripped: Injected Serif · Baseline Shift';
      ctx.fillText(subText, slideX + 30, slideY + 54 + textBaselineShift);

      // Key Metrics Badges
      ctx.font = '8px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.textAlign = 'right';
      ctx.fillText('138% NRR // 0.8x CAC', slideX + slideW - 30, slideY + 36);

      ctx.restore();

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

        {/* Central Living Narrative & Fidelity Stage */}
        <div className={styles.stageWrapper}>
          <div className={styles.canvasViewport}>
            <canvas ref={canvasRef} className={styles.deckCanvas} />
          </div>

          {/* Integrated Modern Instrument Ribbon */}
          <div className={styles.instrumentRibbon}>
            {/* Left: Telemetry Capsule */}
            <div className={styles.telemetryArea}>
              <div
                className={`${styles.telemetryDot} ${
                  format !== 'vector'
                    ? styles.telemetryDotDegraded
                    : styles.telemetryDotActive
                }`}
              />
              <span className={styles.telemetryToken}>{activeStageToken}</span>
              <span className={styles.telemetryDivider}>—</span>
              <span className={styles.telemetryText}>{tickerMessage}</span>
            </div>

            {/* Right: Direct Precision Controls */}
            <div className={styles.controlsArea}>
              {/* 3 Fidelity Mode Toggle Pills */}
              <div className={styles.fidelityPillsGroup}>
                <button
                  type="button"
                  className={`${styles.formatBtn} ${format === 'vector' ? styles.formatBtnActive : ''}`}
                  onClick={() => setFormat('vector')}
                  title="Native Keynote vector math (lossless 4K)"
                >
                  Native Vector (4K)
                </button>
                <button
                  type="button"
                  className={`${styles.formatBtn} ${format === 'raster' ? styles.formatBtnActive : ''}`}
                  onClick={() => setFormat('raster')}
                  title="Simulate 72 DPI PDF rasterization artifacts"
                >
                  Raster (72 DPI)
                </button>
                <button
                  type="button"
                  className={`${styles.formatBtn} ${format === 'fallback' ? styles.formatBtnActive : ''}`}
                  onClick={() => setFormat('fallback')}
                  title="Simulate PPTX font fallback substitution and baseline clipping"
                >
                  Font Clash (PPTX)
                </button>
              </div>

              {/* Narrative Arc Sweep Button */}
              <button
                type="button"
                className={styles.narrativeSweepBtn}
                onClick={handleNarrativeSweep}
                disabled={isSweeping}
                title="Sweep through the 10-slide persuasion arc"
              >
                <Play size={11} fill="currentColor" />
                <span>Narrative Sweep</span>
              </button>

              {/* Reset Button */}
              <button
                type="button"
                className={styles.resetButton}
                onClick={handleReset}
                title="Reset simulation and restore native vector fidelity"
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

