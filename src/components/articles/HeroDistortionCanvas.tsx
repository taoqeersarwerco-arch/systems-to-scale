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
  isPrimary: boolean;
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

    // Mouse tracking with smooth lerp easing
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

    // Rich architectural particle network (190 nodes)
    const particles: Particle[] = [];
    const PARTICLE_COUNT = 190;

    const initParticles = (w: number, h: number) => {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const isPrimary = i < 28; // 28 primary luminous beacon nodes
        const isMid = i < 90;

        let size: number;
        let baseAlpha: number;

        if (isPrimary) {
          size = 2.4 + Math.random() * 1.2;
          baseAlpha = 0.75 + Math.random() * 0.22;
        } else if (isMid) {
          size = 1.4 + Math.random() * 0.7;
          baseAlpha = 0.45 + Math.random() * 0.25;
        } else {
          size = 0.8 + Math.random() * 0.5;
          baseAlpha = 0.28 + Math.random() * 0.22;
        }

        particles.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
          size,
          baseAlpha,
          alpha: baseAlpha,
          phase: Math.random() * Math.PI * 2,
          isPrimary
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

    // Capture mouse moves over the parent section
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.isActive = true;

      // Spawn distinct shockwave ripple on brisk mouse motion
      const dx = mouse.targetX - mouse.prevX;
      const dy = mouse.targetY - mouse.prevY;
      mouse.speed = Math.sqrt(dx * dx + dy * dy);
      mouse.prevX = mouse.targetX;
      mouse.prevY = mouse.targetY;

      if (mouse.speed > 12 && rippleCooldown <= 0) {
        ripples.push({
          x: mouse.targetX,
          y: mouse.targetY,
          radius: 14,
          maxRadius: 220,
          alpha: 0.6
        });
        rippleCooldown = 12;
      }
    };

    const handleMouseLeave = () => {
      mouse.isActive = false;
      mouse.targetX = -9999;
      mouse.targetY = -9999;
    };

    const heroSection = canvas.closest('section') || window;
    heroSection.addEventListener('mousemove', handleMouseMove as EventListener);
    heroSection.addEventListener('mouseleave', handleMouseLeave as EventListener);

    let time = 0;

    const render = () => {
      time += 0.016;
      if (rippleCooldown > 0) rippleCooldown--;

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      ctx.clearRect(0, 0, width, height);

      // -----------------------------------------------------------------
      // 1. VISIBLE ARCHITECTURAL TELEMETRY GRID & GRAVITATIONAL WAVE
      // -----------------------------------------------------------------
      const gridSize = 48;

      // Vertical hairline reference grid
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      for (let x = gridSize; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Horizontal undulating gravity waves
      ctx.lineWidth = 0.75;
      for (let y = gridSize; y < height; y += gridSize) {
        ctx.beginPath();
        for (let x = 0; x <= width; x += 16) {
          const wave = Math.sin(x * 0.009 + time * 1.3) * Math.cos(y * 0.008 + time * 0.9) * 5.5;

          let warpY = 0;
          if (mouse.isActive) {
            const dx = x - mouse.x;
            const dy = y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const radius = 240;
            if (dist < radius) {
              const force = 1 - dist / radius;
              warpY = Math.sin(force * Math.PI) * -20;
            }
          }

          const plotY = y + wave + warpY;
          if (x === 0) ctx.moveTo(x, plotY);
          else ctx.lineTo(x, plotY);
        }
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.065)';
        ctx.stroke();
      }

      // -----------------------------------------------------------------
      // 2. INTERACTIVE CAUSTIC RIPPLES (Clearly visible on cursor movement)
      // -----------------------------------------------------------------
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 4.0;
        r.alpha *= 0.93;

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${(r.alpha * 0.55).toFixed(3)})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        if (r.alpha < 0.015 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
        }
      }

      // -----------------------------------------------------------------
      // 3. INTERCONNECTED CONSTELLATION FILAMENTS (Visible Geometric Network)
      // -----------------------------------------------------------------
      const maxDist = 125;
      ctx.lineWidth = 0.65;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Brownian movement
        p.baseX += p.vx;
        p.baseY += p.vy;
        if (p.baseX < 0) p.baseX = width;
        if (p.baseX > width) p.baseX = 0;
        if (p.baseY < 0) p.baseY = height;
        if (p.baseY > height) p.baseY = 0;

        const pulse = 0.75 + 0.25 * Math.sin(time * 2.2 + p.phase);
        let targetX = p.baseX;
        let targetY = p.baseY;
        let ionizedAlpha = p.baseAlpha * pulse;

        // Interactive mouse gravitational lens & vortex warp
        if (mouse.isActive) {
          const dx = p.baseX - mouse.x;
          const dy = p.baseY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const warpRadius = 240;

          if (dist < warpRadius && dist > 1) {
            const factor = 1 - dist / warpRadius;
            const smoothFactor = factor * factor;

            const normX = dx / dist;
            const normY = dy / dist;
            const tangX = -normY;
            const tangY = normX;

            targetX += (normX * 42 + tangX * 26) * smoothFactor;
            targetY += (normY * 42 + tangY * 26) * smoothFactor;

            // Ionize / illuminate near cursor
            ionizedAlpha = Math.min(1.0, ionizedAlpha + smoothFactor * 0.7);
          }
        }

        p.x += (targetX - p.x) * 0.12;
        p.y += (targetY - p.y) * 0.12;
        p.alpha = ionizedAlpha;

        // Draw filaments to adjacent nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const cdx = p.x - p2.x;
          const cdy = p.y - p2.y;
          const dist = Math.sqrt(cdx * cdx + cdy * cdy);

          if (dist < maxDist) {
            const lineFactor = 1 - dist / maxDist;
            const lineAlpha = lineFactor * 0.28 * Math.min(1.0, (p.alpha + p2.alpha) * 0.7);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha.toFixed(3)})`;
            ctx.stroke();
          }
        }
      }

      // -----------------------------------------------------------------
      // 4. DRAW STARDUST NODES WITH HALOS
      // -----------------------------------------------------------------
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        if (p.isPrimary) {
          ctx.save();
          ctx.shadowBlur = 8;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.75)';
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha.toFixed(3)})`;
          ctx.fill();
          ctx.restore();
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha.toFixed(3)})`;
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      heroSection.removeEventListener('mousemove', handleMouseMove as EventListener);
      heroSection.removeEventListener('mouseleave', handleMouseLeave as EventListener);
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
