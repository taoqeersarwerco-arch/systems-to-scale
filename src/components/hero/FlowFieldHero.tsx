import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { StsLogo } from '../ui/StsLogo';
import { ChevronDown, ArrowRight, Waves, Flame, Activity } from 'lucide-react';
import styles from '../../styles/flowHero.module.css';

interface FlowFieldHeroProps {
  onExploreClick?: () => void;
}

interface Particle {
  x: number;
  y: number;
  px: number;
  py: number;
  hasPrev: boolean;
  speed: number;
  size: number;
  alpha: number;
  layer: number;
  life: number;
  maxLife: number;
}

export const FlowFieldHero: React.FC<FlowFieldHeroProps> = ({ onExploreClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Interactive mode states
  const [trailMode, setTrailMode] = useState<boolean>(true);
  const [warpMode, setWarpMode] = useState<boolean>(false);
  const [pulseMode, setPulseMode] = useState<boolean>(false);

  // Refs for animation loop state to avoid React render churn
  const trailModeRef = useRef<boolean>(true);
  const warpModeRef = useRef<boolean>(false);
  const pulseModeRef = useRef<boolean>(false);
  const pulseTimeRef = useRef<number>(0);
  const pulseCenterRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Sync state with refs
  useEffect(() => {
    trailModeRef.current = trailMode;
  }, [trailMode]);

  useEffect(() => {
    warpModeRef.current = warpMode;
  }, [warpMode]);

  useEffect(() => {
    pulseModeRef.current = pulseMode;
    if (pulseMode) {
      pulseTimeRef.current = 0;
    }
  }, [pulseMode]);

  const handleCtaClick = () => {
    if (onExploreClick) {
      onExploreClick();
      return;
    }
    const target = document.getElementById('topic-trailers') || document.querySelector('section:nth-of-type(2)');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const triggerPulseAt = useCallback((x?: number, y?: number) => {
    pulseModeRef.current = true;
    setPulseMode(true);
    pulseTimeRef.current = 0;
    if (canvasRef.current) {
      pulseCenterRef.current = {
        x: x !== undefined ? x : canvasRef.current.width / 2,
        y: y !== undefined ? y : canvasRef.current.height / 2
      };
    }
  }, []);

  // Main Canvas & Particle Simulation Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animId: number;
    let W = (canvas.width = container.offsetWidth);
    let H = (canvas.height = container.offsetHeight);

    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Perlin noise permutation table setup
    const perm = new Uint8Array(512);
    const grad = [
      [1, 1], [-1, 1], [1, -1], [-1, -1],
      [1, 0], [-1, 0], [0, 1], [0, -1]
    ];

    const initPerm = () => {
      const p = new Uint8Array(256);
      for (let i = 0; i < 256; i++) p[i] = i;
      for (let i = 255; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const t = p[i];
        p[i] = p[j];
        p[j] = t;
      }
      for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
    };

    const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
    const lerp = (a: number, b: number, t: number) => a + t * (b - a);
    const dot = (g: number[], x: number, y: number) => g[0] * x + g[1] * y;

    const perlin = (x: number, y: number) => {
      const xi = Math.floor(x) & 255;
      const yi = Math.floor(y) & 255;
      const xf = x - Math.floor(x);
      const yf = y - Math.floor(y);
      const u = fade(xf);
      const v = fade(yf);
      const aa = perm[perm[xi] + yi];
      const ab = perm[perm[xi] + yi + 1];
      const ba = perm[perm[xi + 1] + yi];
      const bb = perm[perm[xi + 1] + yi + 1];
      const g0 = grad[aa % 8];
      const g1 = grad[ba % 8];
      const g2 = grad[ab % 8];
      const g3 = grad[bb % 8];
      const n0 = dot(g0, xf, yf);
      const n1 = dot(g1, xf - 1, yf);
      const n2 = dot(g2, xf, yf - 1);
      const n3 = dot(g3, xf - 1, yf - 1);
      return lerp(lerp(n0, n1, u), lerp(n2, n3, u), v);
    };

    const fbm = (x: number, y: number, octaves: number) => {
      let val = 0;
      let amp = 1;
      let freq = 1;
      let max = 0;
      for (let i = 0; i < octaves; i++) {
        val += perlin(x * freq, y * freq) * amp;
        max += amp;
        amp *= 0.5;
        freq *= 2;
      }
      return val / max;
    };

    // 4 Layers of Flow Streamlines
    const LAYER_COUNT = 4;
    const COUNTS = isMobile ? [240, 160, 80, 30] : [550, 380, 180, 75];
    const SPEEDS = [0.45, 0.75, 1.25, 2.1];
    const SIZES = [0.85, 1.25, 1.9, 2.8];
    const ALPHAS = [0.12, 0.22, 0.38, 0.65];
    const TRAIL_FADE = [0.03, 0.04, 0.05, 0.06];

    let particles: Particle[] = [];
    let mx = -9999;
    let my = -9999;
    let time = 0;

    const spawnParticles = () => {
      particles = [];
      for (let layer = 0; layer < LAYER_COUNT; layer++) {
        const count = COUNTS[layer];
        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * W,
            y: Math.random() * H,
            px: 0,
            py: 0,
            hasPrev: false,
            speed: SPEEDS[layer] * (0.75 + Math.random() * 0.5),
            size: SIZES[layer] * (0.8 + Math.random() * 0.4),
            alpha: ALPHAS[layer] * (0.7 + Math.random() * 0.6),
            layer,
            life: 0.5 + Math.random() * 0.5,
            maxLife: 0.5 + Math.random() * 0.5
          });
        }
      }
    };

    const getAngle = (px: number, py: number, t: number) => {
      const nx = px * 0.0028;
      const ny = py * 0.0028;
      const n1 = fbm(nx + t * 0.14, ny + t * 0.11, 4);
      const n2 = fbm(nx + 100 + t * 0.08, ny + 100 + t * 0.1, 3);
      let angle = n1 * Math.PI * 3.2;

      // Warp turbulent mode
      if (warpModeRef.current) {
        const n3 = fbm(nx * 2 + t * 0.3, ny * 2 - t * 0.2, 2);
        angle += n3 * Math.PI * 2.2;
      }

      // Pulse shockwave ripple mode
      if (pulseModeRef.current) {
        const cx = pulseCenterRef.current.x || W / 2;
        const cy = pulseCenterRef.current.y || H / 2;
        const dx = px - cx;
        const dy = py - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const wave = Math.sin(dist * 0.018 - pulseTimeRef.current * 3.2) * 0.85;
        angle += wave;
      }

      // Mouse deflection & laminar vortex curl
      const dx = px - mx;
      const dy = py - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 170) {
        let force = 1 - dist / 170;
        force = force * force * force;
        const repelAngle = Math.atan2(dy, dx);
        const curl = repelAngle + Math.PI * 0.5 + n2 * Math.PI;
        angle = angle * (1 - force) + curl * force;
      }

      return angle;
    };

    // Draw frame
    const draw = () => {
      const isTrail = trailModeRef.current;

      if (isTrail) {
        ctx.fillStyle = 'rgba(8, 8, 8, 0.046)';
        ctx.fillRect(0, 0, W, H);
      } else {
        ctx.fillStyle = '#080808';
        ctx.fillRect(0, 0, W, H);
      }

      time += 0.0035;
      if (pulseModeRef.current) {
        pulseTimeRef.current += 0.018;
        // Auto-dissipate single pulse after ~3.5 seconds
        if (pulseTimeRef.current > 3.5) {
          pulseModeRef.current = false;
          setPulseMode(false);
        }
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const angle = getAngle(p.x, p.y, time);

        let vx = Math.cos(angle) * p.speed;
        let vy = Math.sin(angle) * p.speed;

        // Push away from cursor
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 135) {
          const push = (1 - dist / 135) * 2.4;
          vx += (dx / dist) * push;
          vy += (dy / dist) * push;
        }

        p.px = p.x;
        p.py = p.y;
        p.x += vx;
        p.y += vy;
        p.life -= 0.001 + TRAIL_FADE[p.layer] * 0.018;

        // Offscreen or death wrap
        if (p.x < -20 || p.x > W + 20 || p.y < -20 || p.y > H + 20 || p.life <= 0) {
          const edge = Math.floor(Math.random() * 4);
          if (edge === 0) {
            p.x = Math.random() * W;
            p.y = -5;
          } else if (edge === 1) {
            p.x = W + 5;
            p.y = Math.random() * H;
          } else if (edge === 2) {
            p.x = Math.random() * W;
            p.y = H + 5;
          } else {
            p.x = -5;
            p.y = Math.random() * H;
          }
          p.life = p.maxLife;
          p.hasPrev = false;
          continue;
        }

        let a = p.alpha * Math.min((p.life / p.maxLife) * 3, 1);
        a = Math.min(a, p.alpha);

        if (isTrail && p.hasPrev) {
          ctx.beginPath();
          ctx.moveTo(p.px, p.py);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = `rgba(237, 233, 227, ${a})`;
          ctx.lineWidth = p.size * 0.72;
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(237, 233, 227, ${a})`;
          ctx.fill();
        }

        p.hasPrev = true;
      }

      // Center subtle vignette gradient to lock contrast
      const grd = ctx.createRadialGradient(W / 2, H / 2, H * 0.22, W / 2, H / 2, H * 0.88);
      grd.addColorStop(0, 'rgba(8, 8, 8, 0)');
      grd.addColorStop(1, 'rgba(8, 8, 8, 0.65)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);

      if (!prefersReducedMotion) {
        animId = requestAnimationFrame(draw);
      }
    };

    // Mouse movement
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
    };

    const onMouseLeave = () => {
      mx = -9999;
      my = -9999;
    };

    // Click on canvas triggers a shockwave pulse at click location
    const onCanvasClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      triggerPulseAt(clickX, clickY);
    };

    // Resize handler
    const onResize = () => {
      W = canvas.width = container.offsetWidth;
      H = canvas.height = container.offsetHeight;
      ctx.fillStyle = '#080808';
      ctx.fillRect(0, 0, W, H);
      spawnParticles();
    };

    initPerm();
    onResize();
    spawnParticles();
    draw();

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('click', onCanvasClick);
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseleave', onMouseLeave);
      canvas.removeEventListener('click', onCanvasClick);
      window.removeEventListener('resize', onResize);
    };
  }, [triggerPulseAt]);

  return (
    <section className={styles.heroContainer} ref={containerRef}>
      {/* Background Perlin Streamline Canvas */}
      <canvas ref={canvasRef} className={styles.canvas} title="Click to trigger shockwave pulse" />

      {/* Atmospheric Contrast Vignette */}
      <div className={styles.vignetteOverlay} />

      {/* Technical Reticles */}
      <div className={styles.reticleTL}>+</div>
      <div className={styles.reticleTR}>+</div>
      <div className={styles.reticleBL}>+</div>
      <div className={styles.reticleBR}>+</div>

      {/* Main Content */}
      <div className={styles.contentWrapper}>
        <div className={styles.interactiveLayer}>
          {/* Breathing Logo Mark */}
          <div className={styles.logoWrap}>
            <StsLogo size={110} color="#FFFFFF" />
          </div>

          {/* Eyebrow Observatory Protocol Badge */}
          <div className={styles.eyebrowBadge}>
            <span className={styles.eyebrowDot} />
            <span className={styles.eyebrowText}>OBSERVATORY // SYSTEMS PROTOCOL</span>
          </div>

          {/* Primary H1 Headline */}
          <h1 className={styles.headline}>
            Understand the mechanism, not just the steps.
          </h1>

          {/* Sub-lead */}
          <p className={styles.sublead}>
            In-depth explanations of the tools and systems modern businesses run on — because knowing why something works is what lets you build the next thing yourself.
          </p>

          {/* CTA Row */}
          <div className={styles.ctaRow}>
            <button onClick={handleCtaClick} className={styles.primaryCta}>
              <span>Explore Topics</span>
              <ChevronDown size={15} />
            </button>
            <Link to="/articles" className={styles.secondaryCta}>
              <span>Browse 40 Systems</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* 4-Stat Metrics Ribbon */}
          <div className={styles.statsRibbon}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>8</span>
              <span className={styles.statLabel}>Engineering Pillars</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>32</span>
              <span className={styles.statLabel}>Mechanical Clusters</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>40</span>
              <span className={styles.statLabel}>Published Specs</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>100%</span>
              <span className={styles.statLabel}>Primary Source Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Controls Dock (Trails / Warp / Pulse) */}
      <div className={styles.controlsDock}>
        <button
          className={`${styles.ctrlBtn} ${trailMode ? styles.ctrlBtnActive : ''}`}
          onClick={() => {
            setTrailMode(!trailMode);
            if (canvasRef.current) {
              const ctx = canvasRef.current.getContext('2d');
              if (ctx) {
                ctx.fillStyle = '#080808';
                ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
              }
            }
          }}
          title="Toggle vector streamline trails vs discrete particles"
        >
          <Waves size={11} style={{ display: 'inline', marginRight: 4, verticalAlign: -1 }} />
          Trails
        </button>
        <button
          className={`${styles.ctrlBtn} ${warpMode ? styles.ctrlBtnActive : ''}`}
          onClick={() => setWarpMode(!warpMode)}
          title="Toggle high-frequency turbulent warp currents"
        >
          <Flame size={11} style={{ display: 'inline', marginRight: 4, verticalAlign: -1 }} />
          Warp
        </button>
        <button
          className={`${styles.ctrlBtn} ${pulseMode ? styles.ctrlBtnActive : ''}`}
          onClick={() => triggerPulseAt()}
          title="Trigger a concentric shockwave packet ripple"
        >
          <Activity size={11} style={{ display: 'inline', marginRight: 4, verticalAlign: -1 }} />
          Pulse
        </button>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator} onClick={handleCtaClick}>
        <span className={styles.scrollText}>Scroll</span>
        <ChevronDown size={14} className={styles.scrollBounce} />
      </div>
    </section>
  );
};
