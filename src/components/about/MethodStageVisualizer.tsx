import React, { useEffect, useRef } from 'react';

interface MethodStageVisualizerProps {
  stage: 'mechanism' | 'execution' | 'impact';
  isHovered?: boolean;
  className?: string;
}

export const MethodStageVisualizer: React.FC<MethodStageVisualizerProps> = ({
  stage,
  isHovered = false,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isHoveredRef = useRef(isHovered);
  isHoveredRef.current = isHovered;
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Respect user reduced-motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let hasRenderedInitial = false;

    // Pause animation when scrolled off-screen for locked 60+ FPS
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.01, rootMargin: '600px' }
    );
    observer.observe(canvas);

    let animationFrameId: number;
    let time = Math.random() * 50;
    let currentHover = isHoveredRef.current ? 1 : 0;
    let ripple1 = 0;
    let ripple2 = 25;

    // High-DPI canvas setup
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const handleResize = () => resize();
    window.addEventListener('resize', handleResize);

    const getW = () => canvas.width / Math.min(window.devicePixelRatio || 1, 2);
    const getH = () => canvas.height / Math.min(window.devicePixelRatio || 1, 2);

    // Subtle background dust motes
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
    }> = [];

    for (let i = 0; i < 18; i++) {
      particles.push({
        x: Math.random() * (getW() || 280),
        y: Math.random() * (getH() || 110),
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        radius: Math.random() * 0.8 + 0.3,
        alpha: Math.random() * 0.2 + 0.06
      });
    }

    let lastTime = performance.now();

    const render = (now: number) => {
      if (!isVisibleRef.current && hasRenderedInitial) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }
      hasRenderedInitial = true;

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const w = getW();
      const h = getH();
      if (w === 0 || h === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // Smooth hover lerp
      const targetHover = isHoveredRef.current ? 1 : 0;
      currentHover += (targetHover - currentHover) * 0.09;
      time += dt * (1 + currentHover * 0.8);

      ctx.clearRect(0, 0, w, h);

      const cx = w * 0.5;
      const cy = h * 0.5;

      // 1. Blueprint Matrix Grid Dots
      const grid = 22;
      ctx.fillStyle = `rgba(255, 255, 255, ${(0.02 + currentHover * 0.02).toFixed(3)})`;
      for (let x = grid; x < w; x += grid) {
        for (let y = grid; y < h; y += grid) {
          ctx.fillRect(x, y, 1, 1);
        }
      }

      // 2. Ambient Dust Motes
      particles.forEach((p) => {
        p.x += p.vx * (1 + currentHover * 0.5);
        p.y += p.vy * (1 + currentHover * 0.5);
        if (p.x < -4) p.x = w + 4;
        if (p.x > w + 4) p.x = -4;
        if (p.y < -4) p.y = h + 4;
        if (p.y > h + 4) p.y = -4;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${(p.alpha * (1 + currentHover * 0.8)).toFixed(3)})`;
        ctx.fill();
      });

      // 3. Stage-Specific Kinetic Mechanism
      if (stage === 'mechanism') {
        // STAGE 1: CORE MECHANISM (Concentric Optical Calibration Reticle & Blueprint Core)
        const maxR = Math.min(w * 0.34, 46);
        const r1 = maxR * 0.32;
        const r2 = maxR * 0.68;
        const r3 = maxR;

        // Blueprint Crosshairs
        ctx.beginPath();
        ctx.setLineDash([2, 3]);
        ctx.moveTo(cx - maxR * 1.3, cy);
        ctx.lineTo(cx + maxR * 1.3, cy);
        ctx.moveTo(cx, cy - maxR * 1.2);
        ctx.lineTo(cx, cy + maxR * 1.2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${(0.08 + currentHover * 0.12).toFixed(3)})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.setLineDash([]);

        // Outer Rotating Aperture Ring
        const rot1 = time * (0.4 + currentHover * 0.5);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot1);
        ctx.beginPath();
        ctx.arc(0, 0, r3, 0, Math.PI * 2);
        ctx.setLineDash([6, 8]);
        ctx.strokeStyle = `rgba(255, 255, 255, ${(0.18 + currentHover * 0.28).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();

        // Middle Counter-Rotating Calibration Ring with Ticks
        const rot2 = -time * (0.6 + currentHover * 0.6);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot2);
        ctx.beginPath();
        ctx.arc(0, 0, r2, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${(0.22 + currentHover * 0.3).toFixed(3)})`;
        ctx.lineWidth = 1.1;
        ctx.stroke();

        // 4 Calibration Tick Marks
        for (let i = 0; i < 4; i++) {
          const angle = (i / 4) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(Math.cos(angle) * (r2 - 3), Math.sin(angle) * (r2 - 3));
          ctx.lineTo(Math.cos(angle) * (r2 + 3), Math.sin(angle) * (r2 + 3));
          ctx.strokeStyle = `rgba(255, 255, 255, ${(0.4 + currentHover * 0.4).toFixed(3)})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
        ctx.restore();

        // Inner Core Chamber
        ctx.beginPath();
        ctx.arc(cx, cy, r1 + currentHover * 2, 0, Math.PI * 2);
        ctx.fillStyle = '#060709';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // Glowing Center Core Spec Beacon
        ctx.beginPath();
        ctx.arc(cx, cy, 2.5 + currentHover * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        if (currentHover > 0.1) {
          ctx.shadowColor = '#FFFFFF';
          ctx.shadowBlur = 8 * currentHover;
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        // Expanding Focus Ring
        const pulseR = ((time * 26) % r3) + r1;
        const pulseA = Math.max(0, 1 - (pulseR - r1) / (r3 - r1)) * (0.2 + currentHover * 0.35);
        ctx.beginPath();
        ctx.arc(cx, cy, pulseR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${pulseA.toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.stroke();

      } else if (stage === 'execution') {
        // STAGE 2: PHYSICAL REALITY (Active State Machine Circuit with Traveling Light Packets)
        const circuitW = Math.min(w * 0.62, 100);
        const circuitH = Math.min(h * 0.52, 44);
        const leftX = cx - circuitW * 0.5;
        const rightX = cx + circuitW * 0.5;
        const topY = cy - circuitH * 0.5;
        const botY = cy + circuitH * 0.5;

        // Circuit Pathway Conduits
        ctx.beginPath();
        ctx.rect(leftX, topY, circuitW, circuitH);
        ctx.strokeStyle = `rgba(255, 255, 255, ${(0.16 + currentHover * 0.22).toFixed(3)})`;
        ctx.lineWidth = 1.1;
        ctx.stroke();

        // Internal Cross Bridge
        ctx.beginPath();
        ctx.setLineDash([2, 3]);
        ctx.moveTo(leftX, cy);
        ctx.lineTo(rightX, cy);
        ctx.strokeStyle = `rgba(255, 255, 255, ${(0.09 + currentHover * 0.12).toFixed(3)})`;
        ctx.lineWidth = 0.9;
        ctx.stroke();
        ctx.setLineDash([]);

        // Dynamic State Machine Waveform through the center
        ctx.beginPath();
        ctx.moveTo(leftX, cy);
        const segments = 16;
        for (let i = 0; i <= segments; i++) {
          const px = leftX + (circuitW / segments) * i;
          const py = cy + Math.sin(i * 0.9 + time * 3.5) * (5 + currentHover * 4);
          ctx.lineTo(px, py);
        }
        ctx.strokeStyle = `rgba(255, 255, 255, ${(0.35 + currentHover * 0.45).toFixed(3)})`;
        ctx.lineWidth = 1.3;
        ctx.stroke();

        // 4 Corner State Machine Nodes
        const nodes = [
          { x: leftX, y: topY },
          { x: rightX, y: topY },
          { x: rightX, y: botY },
          { x: leftX, y: botY },
        ];

        nodes.forEach((node) => {
          ctx.beginPath();
          ctx.arc(node.x, node.y, 3.4, 0, Math.PI * 2);
          ctx.fillStyle = '#060709';
          ctx.fill();
          ctx.strokeStyle = currentHover > 0.5 ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)';
          ctx.lineWidth = 1.3;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(node.x, node.y, 1.4, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
        });

        // Traveling Light Packet circulating the perimeter
        const perim = 2 * (circuitW + circuitH);
        const dist = ((time * (42 + currentHover * 35)) % perim);
        let px = leftX, py = topY;

        if (dist < circuitW) {
          px = leftX + dist;
          py = topY;
        } else if (dist < circuitW + circuitH) {
          px = rightX;
          py = topY + (dist - circuitW);
        } else if (dist < 2 * circuitW + circuitH) {
          px = rightX - (dist - (circuitW + circuitH));
          py = botY;
        } else {
          px = leftX;
          py = botY - (dist - (2 * circuitW + circuitH));
        }

        ctx.beginPath();
        ctx.arc(px, py, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        if (currentHover > 0.1) {
          ctx.shadowColor = '#FFFFFF';
          ctx.shadowBlur = 8 * currentHover;
        }
        ctx.fill();
        ctx.shadowBlur = 0;

      } else if (stage === 'impact') {
        // STAGE 3: PROVEN OUTCOME (Expanding Harmonic Shockwave Ripples & Horizon Flare)
        const maxImpactR = Math.min(w * 0.38, 52);

        // Expanding Shockwave 1
        ripple1 = (ripple1 + dt * 28) % maxImpactR;
        const a1 = Math.max(0, 1 - ripple1 / maxImpactR) * (0.32 + currentHover * 0.4);
        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(2, ripple1), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${a1.toFixed(3)})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Expanding Shockwave 2 (Phase Offset)
        ripple2 = (ripple2 + dt * 28) % maxImpactR;
        const a2 = Math.max(0, 1 - ripple2 / maxImpactR) * (0.24 + currentHover * 0.35);
        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(2, ripple2), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${a2.toFixed(3)})`;
        ctx.lineWidth = 1.0;
        ctx.stroke();

        // Anamorphic Horizon Flare Beam
        const flareAlpha = (0.2 + currentHover * 0.4).toFixed(3);
        const flareGrad = ctx.createLinearGradient(cx - maxImpactR * 1.2, cy, cx + maxImpactR * 1.2, cy);
        flareGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        flareGrad.addColorStop(0.5, `rgba(255, 255, 255, ${flareAlpha})`);
        flareGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.beginPath();
        ctx.moveTo(cx - maxImpactR * 1.2, cy);
        ctx.lineTo(cx + maxImpactR * 1.2, cy);
        ctx.strokeStyle = flareGrad;
        ctx.lineWidth = 1.5 + currentHover * 0.8;
        ctx.stroke();

        // Center Epicenter Core
        ctx.beginPath();
        ctx.arc(cx, cy, 5.5 + currentHover * 2, 0, Math.PI * 2);
        ctx.fillStyle = '#060709';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy, 2.4, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        if (currentHover > 0.1) {
          ctx.shadowColor = '#FFFFFF';
          ctx.shadowBlur = 8 * currentHover;
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        // Peripheral Outcome Milestone Checkpoints
        const milestoneAngles = [0, Math.PI * 0.66, Math.PI * 1.33];
        milestoneAngles.forEach((angle) => {
          const mx = cx + Math.cos(angle + time * 0.3) * (maxImpactR * 0.85);
          const my = cy + Math.sin(angle + time * 0.3) * (maxImpactR * 0.85);

          ctx.beginPath();
          ctx.arc(mx, my, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = currentHover > 0.4 ? '#FFFFFF' : 'rgba(255, 255, 255, 0.65)';
          ctx.fill();
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, [stage]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        pointerEvents: 'none'
      }}
    />
  );
};
