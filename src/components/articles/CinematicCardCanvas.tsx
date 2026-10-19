import React, { useEffect, useRef } from 'react';

interface CinematicCardCanvasProps {
  topicSlug: string;
  isHovered?: boolean;
  className?: string;
}

export const CinematicCardCanvas: React.FC<CinematicCardCanvasProps> = ({
  topicSlug,
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

    // Reduced motion accessibility check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Visibility Observer to pause off-screen rendering for locked 60+ FPS
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    let animationFrameId: number;
    let time = Math.random() * 100;
    let currentHover = isHoveredRef.current ? 1 : 0;
    let rippleRadius = 0;
    let rippleAlpha = 0;

    // Resize canvas with high-DPI awareness
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

    // Stardust background particles inspired by TopicCinematicCard
    const particleCount = 32;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseAlpha: number;
      phase: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * (getW() || 380),
        y: Math.random() * (getH() || 160),
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        radius: Math.random() * 1.1 + 0.4,
        baseAlpha: Math.random() * 0.28 + 0.08,
        phase: Math.random() * Math.PI * 2
      });
    }

    // Packet streams for linear data flow
    const streams = [
      { progress: 0.08, speed: 0.0055, size: 2.4, trailLen: 18 },
      { progress: 0.42, speed: 0.0072, size: 2.0, trailLen: 14 },
      { progress: 0.78, speed: 0.0062, size: 2.8, trailLen: 22 }
    ];

    let lastTime = performance.now();

    const render = (now: number) => {
      if (!isVisibleRef.current) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const w = getW();
      const h = getH();
      if (w === 0 || h === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // Silky-smooth lerp for hover transitions (no abrupt jumps)
      const targetHover = isHoveredRef.current ? 1 : 0;
      currentHover += (targetHover - currentHover) * 0.08;

      time += dt * (1 + currentHover * 0.75);

      ctx.clearRect(0, 0, w, h);

      // 1. Subtle Precision Background Coordinates / Grid
      const gridSpacing = 28;
      ctx.fillStyle = `rgba(255, 255, 255, ${(0.02 + currentHover * 0.02).toFixed(3)})`;
      for (let gx = gridSpacing; gx < w; gx += gridSpacing) {
        for (let gy = gridSpacing; gy < h; gy += gridSpacing) {
          ctx.fillRect(gx, gy, 1, 1);
        }
      }

      // 2. Ambient Floating Stardust with Gravitational Drift
      const midY = h * 0.5;
      const padX = Math.max(w * 0.08, 24);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Harmonic sinusoidal drift
        p.x += (p.vx * (1 + currentHover * 0.6) + Math.sin(time * 0.5 + p.phase) * 0.06);
        p.y += (p.vy * (1 + currentHover * 0.6) + Math.cos(time * 0.4 + p.phase) * 0.06);

        // Soft attraction toward horizontal system axis on hover
        if (currentHover > 0.05) {
          const dy = midY - p.y;
          p.y += dy * 0.003 * currentHover;
        }

        // Screen wrap
        if (p.x < -8) p.x = w + 8;
        if (p.x > w + 8) p.x = -8;
        if (p.y < -8) p.y = h + 8;
        if (p.y > h + 8) p.y = -8;

        const alpha = p.baseAlpha * (1 + currentHover * 0.85);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * (1 + currentHover * 0.2), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(alpha, 0.75).toFixed(3)})`;
        ctx.fill();
      }

      // 3. Dynamic Constellation Filaments (Faint gossamer threads between close particles on hover)
      if (currentHover > 0.08) {
        const maxDist = 58;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < maxDist) {
              const filamentAlpha = (1 - dist / maxDist) * 0.075 * currentHover;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `rgba(255, 255, 255, ${filamentAlpha.toFixed(4)})`;
              ctx.lineWidth = 0.6;
              ctx.stroke();
            }
          }
        }
      }

      // 4. Topic-Specific Dramatic Cinematic Visual Systems
      const lineStart = padX;
      const lineEnd = w - padX;
      const span = lineEnd - lineStart;

      if (topicSlug === 'ai-automation') {
        // AI & AUTOMATION: Cybernetic Pipeline Spine with Undulating Sine Waves & Light Packets
        const waveAmp = 10 + currentHover * 8;

        // Base Axis Conduit (Dotted Guide)
        ctx.beginPath();
        ctx.setLineDash([3, 5]);
        ctx.moveTo(lineStart, midY);
        ctx.lineTo(lineEnd, midY);
        ctx.strokeStyle = `rgba(255, 255, 255, ${(0.1 + currentHover * 0.16).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);

        // Primary Harmonic Bezier Wave
        ctx.beginPath();
        ctx.moveTo(lineStart, midY);
        for (let x = lineStart; x <= lineEnd; x += 3) {
          const norm = (x - lineStart) / span;
          const envelope = Math.sin(norm * Math.PI);
          const y = midY + Math.sin(norm * 10 + time * 2.2) * waveAmp * envelope;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(255, 255, 255, ${(0.26 + currentHover * 0.44).toFixed(3)})`;
        ctx.lineWidth = 1.3 + currentHover * 0.5;
        ctx.stroke();

        // Secondary Counter-Harmonic Wave (Delicate Gossamer)
        ctx.beginPath();
        ctx.moveTo(lineStart, midY);
        for (let x = lineStart; x <= lineEnd; x += 3) {
          const norm = (x - lineStart) / span;
          const envelope = Math.sin(norm * Math.PI);
          const y = midY - Math.sin(norm * 8 - time * 1.6) * (waveAmp * 0.65) * envelope;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(255, 255, 255, ${(0.08 + currentHover * 0.18).toFixed(3)})`;
        ctx.lineWidth = 0.9;
        ctx.stroke();

        // Gateway Junction Nodes
        const gateRatios = [0.18, 0.40, 0.64, 0.86];
        gateRatios.forEach((ratio, idx) => {
          const nx = lineStart + span * ratio;
          const norm = ratio;
          const env = Math.sin(norm * Math.PI);
          const ny = midY + Math.sin(norm * 10 + time * 2.2) * waveAmp * env;

          const pulse = Math.sin(time * 3 + idx * 1.4) * 0.5 + 0.5;
          const outerR = 6 + (currentHover * 3 + 1) * pulse;

          // Breathing Outer Ring
          ctx.beginPath();
          ctx.arc(nx, ny, outerR, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${(0.03 + currentHover * 0.08 * pulse).toFixed(3)})`;
          ctx.fill();

          // Node Border & Center
          ctx.beginPath();
          ctx.arc(nx, ny, 3.2, 0, Math.PI * 2);
          ctx.fillStyle = '#060709';
          ctx.fill();
          ctx.strokeStyle = currentHover > 0.5 ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)';
          ctx.lineWidth = 1.4;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(nx, ny, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
        });

        // Fast Traveling Light Packets with Comet Trails
        streams.forEach((s) => {
          s.progress += s.speed * (1 + currentHover * 1.4);
          if (s.progress > 1) s.progress = 0;

          const px = lineStart + span * s.progress;
          const norm = s.progress;
          const env = Math.sin(norm * Math.PI);
          const py = midY + Math.sin(norm * 10 + time * 2.2) * waveAmp * env;

          const trailLen = s.trailLen * (1 + currentHover * 0.7);
          const grad = ctx.createLinearGradient(px - trailLen, py, px, py);
          grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
          grad.addColorStop(1, `rgba(255, 255, 255, ${(0.6 + currentHover * 0.4).toFixed(2)})`);

          ctx.beginPath();
          ctx.moveTo(px - trailLen, py);
          ctx.lineTo(px, py);
          ctx.strokeStyle = grad;
          ctx.lineWidth = s.size;
          ctx.stroke();

          // Glowing Head
          ctx.beginPath();
          ctx.arc(px, py, s.size * 0.9, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          if (currentHover > 0.1) {
            ctx.shadowColor = '#FFFFFF';
            ctx.shadowBlur = 6 * currentHover;
          }
          ctx.fill();
          ctx.shadowBlur = 0;
        });

      } else if (topicSlug === 'marketing-ads') {
        // MARKETING & ADS: Real-Time Auction Harmonics & Interference Crests
        const amp1 = 12 + currentHover * 8;
        const amp2 = 10 + currentHover * 6;

        // Wave 1: Ingestion Bid Flow
        ctx.beginPath();
        for (let x = lineStart; x <= lineEnd; x += 3) {
          const norm = (x - lineStart) / span;
          const y = midY + Math.sin(norm * 8 + time * 2.0) * amp1;
          if (x === lineStart) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(255, 255, 255, ${(0.3 + currentHover * 0.45).toFixed(3)})`;
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // Wave 2: Clearing Settlement Frequency
        ctx.beginPath();
        for (let x = lineStart; x <= lineEnd; x += 3) {
          const norm = (x - lineStart) / span;
          const y = midY + Math.cos(norm * 6 - time * 1.5) * amp2;
          if (x === lineStart) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(255, 255, 255, ${(0.14 + currentHover * 0.28).toFixed(3)})`;
        ctx.lineWidth = 1.1;
        ctx.stroke();

        // Interference Peak Clearing Node
        const peakNorm = 0.72;
        const peakX = lineStart + span * peakNorm;
        const peakY = midY + Math.sin(peakNorm * 8 + time * 2.0) * amp1;

        ctx.beginPath();
        ctx.arc(peakX, peakY, 4 + currentHover * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        if (currentHover > 0.1) {
          ctx.shadowColor = '#FFFFFF';
          ctx.shadowBlur = 10 * currentHover;
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        // Radiating pulse ring from clearing node
        const pulseR = ((time * 30) % 24) + 4;
        const pulseA = Math.max(0, 1 - pulseR / 28) * (0.2 + currentHover * 0.4);
        ctx.beginPath();
        ctx.arc(peakX, peakY, pulseR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${pulseA.toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.stroke();

      } else if (topicSlug === 'web-design') {
        // WEB DESIGN: Perspective Viewport Grid & Sweeping Laser Surface
        const frameW = Math.min(span * 0.85, 260);
        const frameH = Math.min(h * 0.55, 74);
        const fx = (w - frameW) / 2;
        const fy = (h - frameH) / 2;

        // Viewport Wireframe Chassis
        ctx.strokeStyle = `rgba(255, 255, 255, ${(0.16 + currentHover * 0.25).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(fx, fy, frameW, frameH);

        // Header Tab Rule & Traffic Lights
        ctx.beginPath();
        ctx.moveTo(fx, fy + 14);
        ctx.lineTo(fx + frameW, fy + 14);
        ctx.strokeStyle = `rgba(255, 255, 255, ${(0.09 + currentHover * 0.12).toFixed(3)})`;
        ctx.stroke();

        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.arc(fx + 10 + i * 7, fy + 7, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${(0.3 + currentHover * 0.4).toFixed(3)})`;
          ctx.fill();
        }

        // Layout Grid Columns Inside Viewport
        const colCount = 4;
        const colW = (frameW - 24) / colCount;
        for (let c = 0; c < colCount; c++) {
          const cx = fx + 12 + c * colW;
          ctx.beginPath();
          ctx.rect(cx, fy + 22, colW - 6, frameH - 32);
          ctx.strokeStyle = `rgba(255, 255, 255, ${(0.05 + currentHover * 0.08).toFixed(3)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }

        // Smooth Sweeping Laser Scanner
        const scanY = fy + 15 + ((Math.sin(time * 2.0) * 0.5 + 0.5) * (frameH - 20));
        const scanGrad = ctx.createLinearGradient(fx, scanY, fx + frameW, scanY);
        scanGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        scanGrad.addColorStop(0.5, `rgba(255, 255, 255, ${(0.45 + currentHover * 0.5).toFixed(3)})`);
        scanGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.beginPath();
        ctx.moveTo(fx, scanY);
        ctx.lineTo(fx + frameW, scanY);
        ctx.strokeStyle = scanGrad;
        ctx.lineWidth = 1.5 + currentHover * 0.8;
        ctx.stroke();

      } else if (topicSlug === 'e-commerce') {
        // E-COMMERCE: Cryptographic Token Vault Orbit & Expanding Ripple
        const cx = w / 2;
        const cy = midY;
        const rx = Math.min(span * 0.42, 110);
        const ry = Math.min(h * 0.28, 30);

        // Expanding Transaction Ripple
        rippleRadius += dt * 32;
        rippleAlpha = Math.max(0, 1 - rippleRadius / (rx * 1.1)) * (0.18 + currentHover * 0.35);
        if (rippleRadius > rx * 1.1) {
          rippleRadius = 8;
        }
        ctx.beginPath();
        ctx.ellipse(cx, cy, rippleRadius, rippleRadius * (ry / rx), -0.15, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${rippleAlpha.toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // 3D-Tilted Elliptical Orbit Path
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, -0.18, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${(0.15 + currentHover * 0.25).toFixed(3)})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Secondary Counter-Tilted Orbit Ring
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx * 0.75, ry * 0.85, 0.25, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${(0.07 + currentHover * 0.12).toFixed(3)})`;
        ctx.lineWidth = 0.9;
        ctx.stroke();

        // Central Vault Core
        ctx.beginPath();
        ctx.arc(cx, cy, 9 + currentHover * 3, 0, Math.PI * 2);
        ctx.fillStyle = '#060709';
        ctx.fill();
        ctx.strokeStyle = currentHover > 0.5 ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        // Orbiting Token Satellite 1
        const orb1 = time * (1.2 + currentHover * 1.2);
        const ox1 = cx + Math.cos(orb1) * rx;
        const oy1 = cy + Math.sin(orb1) * ry - Math.cos(orb1) * 4;

        ctx.beginPath();
        ctx.arc(ox1, oy1, 3.4 + currentHover * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        if (currentHover > 0.1) {
          ctx.shadowColor = '#FFFFFF';
          ctx.shadowBlur = 8 * currentHover;
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        // Orbiting Token Satellite 2 (Counter-Rotating)
        const orb2 = -time * (0.9 + currentHover * 0.9) + Math.PI;
        const ox2 = cx + Math.cos(orb2) * (rx * 0.75);
        const oy2 = cy + Math.sin(orb2) * (ry * 0.85) + Math.cos(orb2) * 5;

        ctx.beginPath();
        ctx.arc(ox2, oy2, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${(0.5 + currentHover * 0.4).toFixed(3)})`;
        ctx.fill();

      } else if (topicSlug === 'customer-service') {
        // CUSTOMER SERVICE: Multi-Tier Conversational Routing Channels
        const intakeX = lineStart + 16;
        const outX = lineEnd - 12;
        const junctionX = lineStart + span * 0.32;

        const tiers = [-22, 0, 22];

        // Intake Portal Node
        ctx.beginPath();
        ctx.arc(intakeX, midY, 5 + currentHover * 2, 0, Math.PI * 2);
        ctx.fillStyle = '#060709';
        ctx.fill();
        ctx.strokeStyle = currentHover > 0.5 ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // Branching Bezier Streams to 3 Resolution Tiers
        tiers.forEach((dy, idx) => {
          ctx.beginPath();
          ctx.moveTo(intakeX, midY);
          ctx.bezierCurveTo(
            junctionX, midY,
            junctionX + 24, midY + dy,
            outX, midY + dy
          );
          ctx.strokeStyle = idx === 1 
            ? `rgba(255, 255, 255, ${(0.3 + currentHover * 0.45).toFixed(3)})`
            : `rgba(255, 255, 255, ${(0.12 + currentHover * 0.22).toFixed(3)})`;
          ctx.lineWidth = idx === 1 ? 1.5 : 1.1;
          ctx.stroke();

          // Terminal Resolution Node
          ctx.beginPath();
          ctx.arc(outX, midY + dy, 3.2, 0, Math.PI * 2);
          ctx.fillStyle = idx === 1 && currentHover > 0.5 ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)';
          ctx.fill();

          // Traveling Intent Signal Packet
          const pNorm = ((time * 0.4 + idx * 0.33) % 1);
          const t = pNorm;
          // Cubic Bezier interpolation
          const p0x = intakeX, p0y = midY;
          const p1x = junctionX, p1y = midY;
          const p2x = junctionX + 24, p2y = midY + dy;
          const p3x = outX, p3y = midY + dy;

          const cx3 = 3 * (p1x - p0x), cy3 = 3 * (p1y - p0y);
          const bx3 = 3 * (p2x - p1x) - cx3, by3 = 3 * (p2y - p1y) - cy3;
          const ax3 = p3x - p0x - cx3 - bx3, ay3 = p3y - p0y - cy3 - by3;

          const px = ax3 * Math.pow(t, 3) + bx3 * Math.pow(t, 2) + cx3 * t + p0x;
          const py = ay3 * Math.pow(t, 3) + by3 * Math.pow(t, 2) + cy3 * t + p0y;

          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
        });

      } else if (topicSlug === 'analytics-data') {
        // ANALYTICS & DATA: Telemetry Frequency Spectrum & Fourier Waveform
        const barCount = 18;
        const barW = (span - barCount * 3) / barCount;

        // Ambient Frequency Spectrum Bars
        for (let b = 0; b < barCount; b++) {
          const bx = lineStart + b * (barW + 3);
          const bNorm = b / barCount;
          const barHeight = (Math.sin(bNorm * Math.PI) * 24 + Math.sin(time * 2.5 + b * 0.6) * 10) * (0.6 + currentHover * 0.5);
          const by = midY + 18 - Math.max(4, barHeight);

          ctx.fillStyle = `rgba(255, 255, 255, ${(0.08 + currentHover * 0.15).toFixed(3)})`;
          ctx.fillRect(bx, by, barW, Math.max(4, barHeight));
        }

        // Continuous High-Fidelity Signal Curve
        ctx.beginPath();
        for (let x = lineStart; x <= lineEnd; x += 3) {
          const norm = (x - lineStart) / span;
          const y = midY - 6 + Math.sin(norm * 14 + time * 2.4) * (8 + currentHover * 6) + Math.cos(norm * 4 - time) * 6;
          if (x === lineStart) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(255, 255, 255, ${(0.35 + currentHover * 0.5).toFixed(3)})`;
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // Moving Telemetry Peak Reticle
        const peakNorm = (Math.sin(time * 0.8) * 0.35 + 0.5);
        const px = lineStart + span * peakNorm;
        const py = midY - 6 + Math.sin(peakNorm * 14 + time * 2.4) * (8 + currentHover * 6) + Math.cos(peakNorm * 4 - time) * 6;

        ctx.beginPath();
        ctx.arc(px, py, 4 + currentHover * 2, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        if (currentHover > 0.1) {
          ctx.shadowColor = '#FFFFFF';
          ctx.shadowBlur = 8 * currentHover;
        }
        ctx.fill();
        ctx.shadowBlur = 0;

      } else if (topicSlug === 'pitch-decks') {
        // PITCH DECKS: Strategic Ascent Vector & Milestone Altitude Drop-Lines
        const startY = midY + 22;
        const endY = midY - 26;

        // Upward Ascending Curve
        ctx.beginPath();
        ctx.moveTo(lineStart, startY);
        ctx.bezierCurveTo(
          lineStart + span * 0.4, startY,
          lineStart + span * 0.7, startY - 14,
          lineEnd, endY
        );
        ctx.strokeStyle = `rgba(255, 255, 255, ${(0.35 + currentHover * 0.5).toFixed(3)})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // 3 Milestone Elevation Reticles
        const milestones = [0.28, 0.62, 0.95];
        milestones.forEach((m, idx) => {
          const mx = lineStart + span * m;
          // Bezier calculation
          const t = m;
          const p0x = lineStart, p0y = startY;
          const p1x = lineStart + span * 0.4, p1y = startY;
          const p2x = lineStart + span * 0.7, p2y = startY - 14;
          const p3x = lineEnd, p3y = endY;

          const cx3 = 3 * (p1x - p0x), cy3 = 3 * (p1y - p0y);
          const bx3 = 3 * (p2x - p1x) - cx3, by3 = 3 * (p2y - p1y) - cy3;
          const ax3 = p3x - p0x - cx3 - bx3, ay3 = p3y - p0y - cy3 - by3;

          const px = ax3 * Math.pow(t, 3) + bx3 * Math.pow(t, 2) + cx3 * t + p0x;
          const py = ay3 * Math.pow(t, 3) + by3 * Math.pow(t, 2) + cy3 * t + p0y;

          // Altitude Drop-Line to Floor
          ctx.beginPath();
          ctx.setLineDash([2, 3]);
          ctx.moveTo(px, py);
          ctx.lineTo(px, startY + 6);
          ctx.strokeStyle = `rgba(255, 255, 255, ${(0.09 + currentHover * 0.15).toFixed(3)})`;
          ctx.stroke();
          ctx.setLineDash([]);

          // Milestone Checkpoint Ring
          ctx.beginPath();
          ctx.arc(px, py, 3.4 + (idx === 2 ? 1.5 : 0), 0, Math.PI * 2);
          ctx.fillStyle = idx === 2 ? '#FFFFFF' : '#060709';
          ctx.fill();
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1.3;
          ctx.stroke();
        });

      } else {
        // CLOUD INFRASTRUCTURE & DEFAULT: Distributed Resilience Constellation Mesh
        const nodeCount = 5;
        const radius = Math.min(span * 0.38, 70);
        const cx = w / 2;
        const cy = midY;
        const clusterNodes: Array<{ x: number; y: number }> = [];

        for (let i = 0; i < nodeCount; i++) {
          const angle = (i / nodeCount) * Math.PI * 2 + time * 0.25;
          const nx = cx + Math.cos(angle) * radius;
          const ny = cy + Math.sin(angle) * (radius * 0.45);
          clusterNodes.push({ x: nx, y: ny });
        }

        // Interconnected Conduit Mesh
        for (let i = 0; i < clusterNodes.length; i++) {
          for (let j = i + 1; j < clusterNodes.length; j++) {
            ctx.beginPath();
            ctx.moveTo(clusterNodes[i].x, clusterNodes[i].y);
            ctx.lineTo(clusterNodes[j].x, clusterNodes[j].y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${(0.08 + currentHover * 0.16).toFixed(3)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Node Cores
        clusterNodes.forEach((node, idx) => {
          const pulse = Math.sin(time * 3 + idx * 1.5) * 0.5 + 0.5;
          ctx.beginPath();
          ctx.arc(node.x, node.y, 3.2 + currentHover * 1.2 * pulse, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          if (currentHover > 0.1) {
            ctx.shadowColor = '#FFFFFF';
            ctx.shadowBlur = 6 * currentHover;
          }
          ctx.fill();
          ctx.shadowBlur = 0;
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
  }, [topicSlug]);

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
