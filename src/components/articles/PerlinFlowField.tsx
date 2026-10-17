import React, { useEffect, useRef } from 'react';

interface PerlinFlowFieldProps {
  trailMode?: boolean;
  warpMode?: boolean;
  pulseMode?: boolean;
}

export const PerlinFlowField: React.FC<PerlinFlowFieldProps> = ({
  trailMode = true,
  warpMode = false,
  pulseMode = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Store modes in refs to avoid recreating animation loop on toggle
  const trailModeRef = useRef(trailMode);
  const warpModeRef = useRef(warpMode);
  const pulseModeRef = useRef(pulseMode);

  useEffect(() => {
    trailModeRef.current = trailMode;
  }, [trailMode]);

  useEffect(() => {
    warpModeRef.current = warpMode;
  }, [warpMode]);

  useEffect(() => {
    pulseModeRef.current = pulseMode;
  }, [pulseMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let W = container.clientWidth || window.innerWidth;
    let H = container.clientHeight || 1450;

    let mx = -9999;
    let my = -9999;
    let time = 0;
    let pulseTime = 0;
    let scrollY = 0;
    let scrollVelocity = 0;
    let lastScrollY = window.scrollY;

    // -------------------------------------------------------------------------
    // 4 Layer Multi-Tier Aerodynamic Configuration
    // -------------------------------------------------------------------------
    const LAYER_COUNT = 4;
    const COUNTS = [600, 400, 200, 80]; // 1,280 particles total
    const SPEEDS = [0.45, 0.75, 1.25, 2.1];
    const SIZES = [0.9, 1.3, 1.9, 2.9];
    const ALPHAS = [0.12, 0.22, 0.38, 0.65];
    const TRAIL_FADE = [0.03, 0.04, 0.05, 0.06];

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

    let particles: Particle[] = [];

    // -------------------------------------------------------------------------
    // True 2D Perlin Noise & 4-Octave Fractional Brownian Motion (fBm)
    // -------------------------------------------------------------------------
    const perm = new Uint8Array(512);
    const grad = [
      [1, 1],
      [-1, 1],
      [1, -1],
      [-1, -1],
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];

    function initPerm() {
      const p = new Uint8Array(256);
      for (let i = 0; i < 256; i++) p[i] = i;
      for (let i = 255; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const t = p[i];
        p[i] = p[j];
        p[j] = t;
      }
      for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
    }

    function fade(t: number) {
      return t * t * t * (t * (t * 6 - 15) + 10);
    }
    function lerp(a: number, b: number, t: number) {
      return a + t * (b - a);
    }
    function dot(g: number[], x: number, y: number) {
      return g[0] * x + g[1] * y;
    }

    function perlin(x: number, y: number) {
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
    }

    function fbm(x: number, y: number, oct: number) {
      let val = 0;
      let amp = 1;
      let freq = 1;
      let max = 0;
      for (let i = 0; i < oct; i++) {
        val += perlin(x * freq, y * freq) * amp;
        max += amp;
        amp *= 0.5;
        freq *= 2;
      }
      return val / max;
    }

    function resize() {
      if (!container || !canvas || !ctx) return;
      W = container.clientWidth || window.innerWidth;
      H = container.clientHeight || 1450;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.scale(dpr, dpr);

      ctx.fillStyle = '#080808';
      ctx.fillRect(0, 0, W, H);
    }

    function spawnParticles() {
      particles = [];
      for (let layer = 0; layer < LAYER_COUNT; layer++) {
        for (let i = 0; i < COUNTS[layer]; i++) {
          particles.push({
            x: Math.random() * W,
            y: Math.random() * H,
            px: 0,
            py: 0,
            hasPrev: false,
            speed: SPEEDS[layer] * (0.7 + Math.random() * 0.6),
            size: SIZES[layer] * (0.8 + Math.random() * 0.4),
            alpha: ALPHAS[layer] * (0.6 + Math.random() * 0.8),
            layer: layer,
            life: 0.5 + Math.random() * 0.5,
            maxLife: 0.5 + Math.random() * 0.5,
          });
        }
      }
    }

    function getAngle(px: number, py: number, t: number) {
      const nx = px * 0.0028;
      const ny = py * 0.0028;
      const n1 = fbm(nx + t * 0.15, ny + t * 0.12, 4);
      const n2 = fbm(nx + 100 + t * 0.08, ny + 100 + t * 0.1, 3);
      let angle = n1 * Math.PI * 3;

      if (warpModeRef.current) {
        const n3 = fbm(nx * 2 + t * 0.3, ny * 2 - t * 0.2, 2);
        angle += n3 * Math.PI * 2;
      }

      if (pulseModeRef.current) {
        const cx = W / 2;
        const cy = 400; // Centered near the hero focal point
        const dx = px - cx;
        const dy = py - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const wave = Math.sin(dist * 0.02 - pulseTime * 3) * 0.8;
        angle += wave;
      }

      // Cursor vortex and repulsion
      const dx = px - mx;
      const dy = py - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 190 && dist > 0.001) {
        let force = 1 - dist / 190;
        force = force * force * force;
        const repelAngle = Math.atan2(dy, dx);
        const curl = repelAngle + Math.PI * 0.5 + n2 * Math.PI;
        angle = angle * (1 - force) + curl * force;
      }

      return angle;
    }

    // -------------------------------------------------------------------------
    // Animation Loop: Aerodynamic Streamlines + Fading History
    // -------------------------------------------------------------------------
    function draw() {
      animationId = requestAnimationFrame(draw);

      if (trailModeRef.current) {
        // Physical ghost trail sweep matching #080808 ground
        ctx!.fillStyle = 'rgba(8, 8, 8, 0.048)';
        ctx!.fillRect(0, 0, W, H);
      } else {
        ctx!.fillStyle = '#080808';
        ctx!.fillRect(0, 0, W, H);
      }

      time += 0.0038;
      if (pulseModeRef.current) pulseTime += 0.016;

      // Scroll momentum decay
      scrollVelocity *= 0.92;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const angle = getAngle(p.x, p.y, time);

        let vx = Math.cos(angle) * p.speed;
        let vy = Math.sin(angle) * p.speed + scrollVelocity * 0.08;

        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140 && dist > 0.001) {
          const push = (1 - dist / 140) * 2.8;
          vx += (dx / dist) * push;
          vy += (dy / dist) * push;
        }

        p.px = p.x;
        p.py = p.y;
        p.x += vx;
        p.y += vy;
        p.life -= 0.001 + TRAIL_FADE[p.layer] * 0.018;

        if (p.x < -30 || p.x > W + 30 || p.y < -30 || p.y > H + 30 || p.life <= 0) {
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

        // Draw aerodynamic filament streamline
        if (trailModeRef.current && p.hasPrev) {
          ctx!.beginPath();
          ctx!.moveTo(p.px, p.py);
          ctx!.lineTo(p.x, p.y);
          ctx!.strokeStyle = `rgba(240, 238, 233, ${a})`;
          ctx!.lineWidth = p.size * 0.72;
          ctx!.stroke();
        }

        // Glowing particle head
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size * 0.48, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(255, 255, 255, ${Math.min(1.0, a * 1.3)})`;
        ctx!.fill();
        p.hasPrev = true;
      }

      // Soft center-focused depth spotlight (ensures text readability in the hero)
      const grd = ctx!.createRadialGradient(W / 2, 380, 160, W / 2, 380, W * 0.65);
      grd.addColorStop(0, 'rgba(8, 8, 8, 0)');
      grd.addColorStop(1, 'rgba(8, 8, 8, 0.45)');
      ctx!.fillStyle = grd;
      ctx!.fillRect(0, 0, W, H);
    }

    // -------------------------------------------------------------------------
    // Event Listeners: Crosshair Cursor & Scroll Momentum
    // -------------------------------------------------------------------------
    const handleMouseMove = (e: MouseEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mx = -9999;
      my = -9999;
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      scrollVelocity = Math.max(-15, Math.min(15, currentScrollY - lastScrollY));
      lastScrollY = currentScrollY;
      scrollY = currentScrollY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', resize);

    initPerm();
    resize();
    spawnParticles();
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};
