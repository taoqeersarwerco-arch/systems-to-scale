import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  phase: number;
}

interface WaveRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

interface HeroDistortionCanvasProps {
  className?: string;
}

export const HeroDistortionCanvas: React.FC<HeroDistortionCanvasProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    // Mouse tracking with lerp easing
    const mouse = {
      x: -9999,
      y: -9999,
      targetX: -9999,
      targetY: -9999,
      isActive: false,
      speed: 0,
      prevX: 0,
      prevY: 0
    };

    const ripples: WaveRipple[] = [];
    let rippleCooldown = 0;

    // Particle field
    const particles: Particle[] = [];
    const PARTICLE_COUNT = 75;

    const initParticles = (w: number, h: number) => {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        particles.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          size: Math.random() * 1.6 + 0.6,
          baseAlpha: 0.12 + Math.random() * 0.28,
          alpha: 0.2,
          phase: Math.random() * Math.PI * 2
        });
      }
    };

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || 480;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
      initParticles(width, height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Parent mouse move
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.isActive = true;

      // Spawn subtle shockwave ripple on brisk mouse motion
      const dx = mouse.targetX - mouse.prevX;
      const dy = mouse.targetY - mouse.prevY;
      mouse.speed = Math.sqrt(dx * dx + dy * dy);
      mouse.prevX = mouse.targetX;
      mouse.prevY = mouse.targetY;

      if (mouse.speed > 14 && rippleCooldown <= 0) {
        ripples.push({
          x: mouse.targetX,
          y: mouse.targetY,
          radius: 12,
          maxRadius: 180,
          alpha: 0.4
        });
        rippleCooldown = 15;
      }
    };

    const handleMouseLeave = () => {
      mouse.isActive = false;
      mouse.targetX = -9999;
      mouse.targetY = -9999;
    };

    const parentElem = canvas.parentElement;
    if (parentElem) {
      parentElem.addEventListener('mousemove', handleMouseMove);
      parentElem.addEventListener('mouseleave', handleMouseLeave);
    }

    let time = 0;

    const render = () => {
      time += 0.016;
      if (rippleCooldown > 0) rippleCooldown--;

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.09;
      mouse.y += (mouse.targetY - mouse.y) * 0.09;

      ctx.clearRect(0, 0, width, height);

      // -----------------------------------------------------------------
      // 1. SUBTLE AMBIENT MATHEMATICAL GRAVITATIONAL GRID (DISTORTION BACKDROP)
      // -----------------------------------------------------------------
      const gridSize = 42;
      ctx.lineWidth = 0.5;

      // Subtle horizontal curves with wave undulation
      for (let y = gridSize; y < height; y += gridSize) {
        ctx.beginPath();
        for (let x = 0; x <= width; x += 18) {
          // Ambient undulation wave
          const wave = Math.sin(x * 0.008 + time * 1.2) * Math.cos(y * 0.007 + time * 0.8) * 4.5;

          // Mouse distortion displacement
          let warpY = 0;
          if (mouse.isActive) {
            const dx = x - mouse.x;
            const dy = y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const radius = 220;
            if (dist < radius) {
              const force = (1 - dist / radius);
              warpY = Math.sin(force * Math.PI) * -16;
            }
          }

          const plotY = y + wave + warpY;
          if (x === 0) ctx.moveTo(x, plotY);
          else ctx.lineTo(x, plotY);
        }
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.022)';
        ctx.stroke();
      }

      // -----------------------------------------------------------------
      // 2. INTERACTIVE EXPANDING RIPPLES
      // -----------------------------------------------------------------
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 3.5;
        r.alpha *= 0.94;

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${(r.alpha * 0.35).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        if (r.alpha < 0.01 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
        }
      }

      // -----------------------------------------------------------------
      // 3. STARDUST PARTICLES WITH GRAVITATIONAL WARP & IONIZATION
      // -----------------------------------------------------------------
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Natural Brownian drift
        p.baseX += p.vx;
        p.baseY += p.vy;
        if (p.baseX < 0) p.baseX = width;
        if (p.baseX > width) p.baseX = 0;
        if (p.baseY < 0) p.baseY = height;
        if (p.baseY > height) p.baseY = 0;

        // Ambient breathing pulse
        const pulse = 0.7 + 0.3 * Math.sin(time * 2 + p.phase);
        let targetX = p.baseX;
        let targetY = p.baseY;
        let ionizedAlpha = p.baseAlpha * pulse;

        // Interactive mouse gravitational warp
        if (mouse.isActive) {
          const dx = p.baseX - mouse.x;
          const dy = p.baseY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const warpRadius = 240;

          if (dist < warpRadius && dist > 1) {
            const factor = 1 - dist / warpRadius;
            const smoothFactor = factor * factor;

            // Fluid warp: radial displacement + tangential vortex swirl
            const normX = dx / dist;
            const normY = dy / dist;
            const tangX = -normY;
            const tangY = normX;

            targetX += (normX * 38 + tangX * 24) * smoothFactor;
            targetY += (normY * 38 + tangY * 24) * smoothFactor;

            // Ionize / illuminate near cursor
            ionizedAlpha = Math.min(0.85, ionizedAlpha + smoothFactor * 0.65);
          }
        }

        // Smooth particle displacement
        p.x += (targetX - p.x) * 0.12;
        p.y += (targetY - p.y) * 0.12;
        p.alpha = ionizedAlpha;

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha.toFixed(3)})`;
        ctx.fill();

        // Connect nearby particles with delicate constellation filaments
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const cdx = p.x - p2.x;
          const cdy = p.y - p2.y;
          const dist = Math.sqrt(cdx * cdx + cdy * cdy);
          const maxDist = 88;

          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.14 * (p.alpha + p2.alpha) * 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha.toFixed(3)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (parentElem) {
        parentElem.removeEventListener('mousemove', handleMouseMove);
        parentElem.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 1
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  );
};
