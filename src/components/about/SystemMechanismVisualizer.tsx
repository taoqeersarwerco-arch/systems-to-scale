import React, { useEffect, useRef } from 'react';

interface SystemMechanismVisualizerProps {
  topicSlug: string;
  isHovered?: boolean;
  className?: string;
}

export const SystemMechanismVisualizer: React.FC<SystemMechanismVisualizerProps> = ({
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
      { threshold: 0.01, rootMargin: '800px' }
    );
    observer.observe(canvas);

    let animationFrameId: number;
    let time = Math.random() * 100;
    let currentHover = isHoveredRef.current ? 1 : 0;
    let rippleRadius = 0;
    let rippleAlpha = 0;

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

    // Multi-depth cinematic stardust particles (3 parallax depth layers)
    const particleCount = 32;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseAlpha: number;
      depth: number;
      phase: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      const depth = Math.random() * 0.7 + 0.3; // 0.3 (far/slow) to 1.0 (near/fast)
      particles.push({
        x: Math.random() * (getW() || 380),
        y: Math.random() * (getH() || 150),
        vx: (Math.random() - 0.5) * 0.16 * depth,
        vy: (Math.random() - 0.5) * 0.16 * depth,
        radius: (Math.random() * 0.9 + 0.3) * depth,
        baseAlpha: (Math.random() * 0.22 + 0.08) * depth,
        depth,
        phase: Math.random() * Math.PI * 2
      });
    }

    // High-speed light packets with kinetic acceleration
    const streams = [
      { progress: 0.08, speed: 0.0055, size: 2.2, trailLen: 22 },
      { progress: 0.42, speed: 0.0075, size: 2.0, trailLen: 18 },
      { progress: 0.78, speed: 0.0065, size: 2.5, trailLen: 26 }
    ];

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

      // Smooth cinematic lerp for hover transitions
      const targetHover = isHoveredRef.current ? 1 : 0;
      currentHover += (targetHover - currentHover) * 0.09;

      time += dt * (1 + currentHover * 0.75);

      ctx.clearRect(0, 0, w, h);

      const midY = h * 0.5;
      const padX = Math.max(w * 0.07, 22);
      const lineStart = padX;
      const lineEnd = w - padX;
      const span = lineEnd - lineStart;

      // 1. Subtle Background Matrix Coordinates
      const gridSpacing = 26;
      ctx.fillStyle = `rgba(255, 255, 255, ${(0.018 + currentHover * 0.02).toFixed(3)})`;
      for (let gx = gridSpacing; gx < w; gx += gridSpacing) {
        for (let gy = gridSpacing; gy < h; gy += gridSpacing) {
          ctx.fillRect(gx, gy, 1, 1);
        }
      }

      // 2. Anamorphic Lens Flare Line (Cinematic Optical Streak on Hover)
      if (currentHover > 0.02) {
        const flareAlpha = (0.12 * currentHover).toFixed(3);
        const flareGrad = ctx.createLinearGradient(0, midY, w, midY);
        flareGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        flareGrad.addColorStop(0.3, `rgba(255, 255, 255, ${(0.02 * currentHover).toFixed(3)})`);
        flareGrad.addColorStop(0.5, `rgba(255, 255, 255, ${flareAlpha})`);
        flareGrad.addColorStop(0.7, `rgba(255, 255, 255, ${(0.02 * currentHover).toFixed(3)})`);
        flareGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = flareGrad;
        ctx.fillRect(0, midY - 0.75, w, 1.5);
      }

      // 3. Multi-Depth Floating Stardust
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += (p.vx * (1 + currentHover * 0.5) + Math.sin(time * 0.5 + p.phase) * 0.04);
        p.y += (p.vy * (1 + currentHover * 0.5) + Math.cos(time * 0.4 + p.phase) * 0.04);

        if (currentHover > 0.05) {
          const dy = midY - p.y;
          p.y += dy * 0.002 * currentHover * p.depth;
        }

        if (p.x < -8) p.x = w + 8;
        if (p.x > w + 8) p.x = -8;
        if (p.y < -8) p.y = h + 8;
        if (p.y > h + 8) p.y = -8;

        const twinkle = Math.sin(time * 2.2 + p.phase) * 0.25 + 0.75;
        const alpha = p.baseAlpha * twinkle * (1 + currentHover * 0.85);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * (1 + currentHover * 0.25), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(alpha, 0.8).toFixed(3)})`;
        ctx.fill();
      }

      // 4. Dynamic Constellation Filaments on Hover
      if (currentHover > 0.08) {
        const maxDist = 58;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < maxDist) {
              const filamentAlpha = (1 - dist / maxDist) * 0.08 * currentHover;
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

      // 5. THE EIGHT Bespoke Cinematic Mechanism Simulations
      if (topicSlug === 'ai-automation') {
        // AI & AUTOMATION: Cybernetic Neural Helix with Cross-Harmonics & Photon Packets
        const waveAmp = 11 + currentHover * 9;

        // Base Axis Conduit (Dotted Telemetry Guide)
        ctx.beginPath();
        ctx.setLineDash([3, 5]);
        ctx.moveTo(lineStart, midY);
        ctx.lineTo(lineEnd, midY);
        ctx.strokeStyle = `rgba(255, 255, 255, ${(0.1 + currentHover * 0.16).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);

        // Primary Harmonic Sine Wave
        ctx.beginPath();
        ctx.moveTo(lineStart, midY);
        for (let x = lineStart; x <= lineEnd; x += 3) {
          const norm = (x - lineStart) / span;
          const envelope = Math.sin(norm * Math.PI);
          const y = midY + Math.sin(norm * 10 + time * 2.2) * waveAmp * envelope;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(255, 255, 255, ${(0.3 + currentHover * 0.5).toFixed(3)})`;
        ctx.lineWidth = 1.4 + currentHover * 0.6;
        ctx.stroke();

        // Secondary Counter-Harmonic Wave (Delicate Gossamer)
        ctx.beginPath();
        ctx.moveTo(lineStart, midY);
        for (let x = lineStart; x <= lineEnd; x += 3) {
          const norm = (x - lineStart) / span;
          const envelope = Math.sin(norm * Math.PI);
          const y = midY - Math.sin(norm * 8 - time * 1.7) * (waveAmp * 0.7) * envelope;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(255, 255, 255, ${(0.1 + currentHover * 0.22).toFixed(3)})`;
        ctx.lineWidth = 0.9;
        ctx.stroke();

        // Vertical Entanglement Rungs connecting the two waves
        const rungStep = 24;
        for (let rx = lineStart + 20; rx < lineEnd - 20; rx += rungStep) {
          const norm = (rx - lineStart) / span;
          const env = Math.sin(norm * Math.PI);
          const y1 = midY + Math.sin(norm * 10 + time * 2.2) * waveAmp * env;
          const y2 = midY - Math.sin(norm * 8 - time * 1.7) * (waveAmp * 0.7) * env;

          ctx.beginPath();
          ctx.moveTo(rx, y1);
          ctx.lineTo(rx, y2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${(0.05 + currentHover * 0.12).toFixed(3)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }

        // Gateway Junction Nodes
        const gateRatios = [0.18, 0.40, 0.64, 0.86];
        gateRatios.forEach((ratio, idx) => {
          const nx = lineStart + span * ratio;
          const norm = ratio;
          const env = Math.sin(norm * Math.PI);
          const ny = midY + Math.sin(norm * 10 + time * 2.2) * waveAmp * env;

          const pulse = Math.sin(time * 3 + idx * 1.4) * 0.5 + 0.5;
          const outerR = 6 + (currentHover * 3.5 + 1) * pulse;

          // Breathing Outer Ring
          ctx.beginPath();
          ctx.arc(nx, ny, outerR, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${(0.03 + currentHover * 0.08 * pulse).toFixed(3)})`;
          ctx.fill();

          // Node Border & Center
          ctx.beginPath();
          ctx.arc(nx, ny, 3.4, 0, Math.PI * 2);
          ctx.fillStyle = '#060709';
          ctx.fill();
          ctx.strokeStyle = currentHover > 0.5 ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)';
          ctx.lineWidth = 1.4;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(nx, ny, 1.3, 0, Math.PI * 2);
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
          grad.addColorStop(1, `rgba(255, 255, 255, ${(0.65 + currentHover * 0.35).toFixed(2)})`);

          ctx.beginPath();
          ctx.moveTo(px - trailLen, py);
          ctx.lineTo(px, py);
          ctx.strokeStyle = grad;
          ctx.lineWidth = s.size;
          ctx.stroke();

          // Glowing Photon Head
          ctx.beginPath();
          ctx.arc(px, py, s.size * 0.9, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          if (currentHover > 0.1) {
            ctx.shadowColor = '#FFFFFF';
            ctx.shadowBlur = 8 * currentHover;
          }
          ctx.fill();
          ctx.shadowBlur = 0;
        });

      } else if (topicSlug === 'marketing-ads') {
        // MARKETING & ADS: Real-Time Bidding Auction Dynamics & Radar Clearing Sweeper
        const amp1 = 13 + currentHover * 8;
        const amp2 = 10 + currentHover * 6;

        // Wave 1: Ingestion Bid Flow
        ctx.beginPath();
        for (let x = lineStart; x <= lineEnd; x += 3) {
          const norm = (x - lineStart) / span;
          const y = midY + Math.sin(norm * 8 + time * 2.0) * amp1;
          if (x === lineStart) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(255, 255, 255, ${(0.32 + currentHover * 0.45).toFixed(3)})`;
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

        // High-Speed Clearing Radar Beam traversing horizontally
        const radarX = lineStart + ((time * 48) % span);
        const radarGrad = ctx.createLinearGradient(radarX - 32, midY, radarX, midY);
        radarGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        radarGrad.addColorStop(1, `rgba(255, 255, 255, ${(0.18 + currentHover * 0.24).toFixed(3)})`);

        ctx.fillStyle = radarGrad;
        ctx.fillRect(radarX - 32, midY - 28, 32, 56);

        ctx.beginPath();
        ctx.moveTo(radarX, midY - 28);
        ctx.lineTo(radarX, midY + 28);
        ctx.strokeStyle = `rgba(255, 255, 255, ${(0.5 + currentHover * 0.5).toFixed(3)})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Interference Peak Clearing Node
        const peakNorm = 0.72;
        const peakX = lineStart + span * peakNorm;
        const peakY = midY + Math.sin(peakNorm * 8 + time * 2.0) * amp1;

        ctx.beginPath();
        ctx.arc(peakX, peakY, 4.2 + currentHover * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        if (currentHover > 0.1) {
          ctx.shadowColor = '#FFFFFF';
          ctx.shadowBlur = 10 * currentHover;
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        // Radiating pulse ring from clearing node
        const pulseR = ((time * 30) % 26) + 4;
        const pulseA = Math.max(0, 1 - pulseR / 30) * (0.24 + currentHover * 0.4);
        ctx.beginPath();
        ctx.arc(peakX, peakY, pulseR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${pulseA.toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.stroke();

      } else if (topicSlug === 'web-design') {
        // WEB DESIGN: High-End Responsive Viewport Blueprint & Vertical Laser Scanner
        const frameW = Math.min(span * 0.85, 260);
        const frameH = Math.min(h * 0.56, 76);
        const fx = (w - frameW) / 2;
        const fy = (h - frameH) / 2;

        // Outer Viewport Wireframe Chassis
        ctx.strokeStyle = `rgba(255, 255, 255, ${(0.18 + currentHover * 0.28).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(fx, fy, frameW, frameH);

        // Header Tab Rule & Traffic Lights
        ctx.beginPath();
        ctx.moveTo(fx, fy + 14);
        ctx.lineTo(fx + frameW, fy + 14);
        ctx.strokeStyle = `rgba(255, 255, 255, ${(0.1 + currentHover * 0.14).toFixed(3)})`;
        ctx.stroke();

        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.arc(fx + 10 + i * 7, fy + 7, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${(0.32 + currentHover * 0.4).toFixed(3)})`;
          ctx.fill();
        }

        // Internal Layout Columns with Responsive Breathing
        const colCount = 4;
        const colW = (frameW - 24) / colCount;
        const breath = Math.sin(time * 1.8) * 1.5 * currentHover;

        for (let c = 0; c < colCount; c++) {
          const cx = fx + 12 + c * colW;
          ctx.beginPath();
          ctx.rect(cx, fy + 22, colW - 6 + (c === 0 ? breath : -breath * 0.3), frameH - 32);
          ctx.strokeStyle = `rgba(255, 255, 255, ${(0.06 + currentHover * 0.1).toFixed(3)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }

        // Smooth Vertical Laser Scanner Beam with Volumetric Wash
        const scanNorm = Math.sin(time * 2.0) * 0.5 + 0.5;
        const scanY = fy + 15 + scanNorm * (frameH - 22);

        const washGrad = ctx.createLinearGradient(fx, scanY - 10, fx, scanY + 10);
        washGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        washGrad.addColorStop(0.5, `rgba(255, 255, 255, ${(0.08 + currentHover * 0.12).toFixed(3)})`);
        washGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = washGrad;
        ctx.fillRect(fx, scanY - 10, frameW, 20);

        const scanGrad = ctx.createLinearGradient(fx, scanY, fx + frameW, scanY);
        scanGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        scanGrad.addColorStop(0.5, `rgba(255, 255, 255, ${(0.5 + currentHover * 0.5).toFixed(3)})`);
        scanGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.beginPath();
        ctx.moveTo(fx, scanY);
        ctx.lineTo(fx + frameW, scanY);
        ctx.strokeStyle = scanGrad;
        ctx.lineWidth = 1.6 + currentHover * 0.8;
        ctx.stroke();

      } else if (topicSlug === 'e-commerce') {
        // E-COMMERCE: Cryptographic Gyroscopic Vault with 3D Elliptical Orbits & Expanding Shockwaves
        const cx = w / 2;
        const cy = midY;
        const rx = Math.max(24, Math.min(span * 0.42, 110));
        const ry = Math.max(8, Math.min(h * 0.28, 30));

        // Expanding 3D Perspective Transaction Ripple
        rippleRadius = (rippleRadius + dt * 32) % (rx * 1.15);
        const safeRipple = Math.max(2, rippleRadius);
        rippleAlpha = Math.max(0, 1 - safeRipple / (rx * 1.15)) * (0.24 + currentHover * 0.35);

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(-0.16);
        ctx.scale(1, ry / rx);
        ctx.beginPath();
        ctx.arc(0, 0, safeRipple, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${rippleAlpha.toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();

        // 3D-Tilted Primary Elliptical Orbit
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(-0.18);
        ctx.scale(1, ry / rx);
        ctx.beginPath();
        ctx.arc(0, 0, rx, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${(0.24 + currentHover * 0.32).toFixed(3)})`;
        ctx.lineWidth = 1.3;
        ctx.stroke();
        ctx.restore();

        // Secondary Counter-Tilted Orbit Ring
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(0.24);
        ctx.scale(1, (ry * 0.85) / (rx * 0.75));
        ctx.beginPath();
        ctx.arc(0, 0, rx * 0.75, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${(0.13 + currentHover * 0.2).toFixed(3)})`;
        ctx.lineWidth = 1.0;
        ctx.stroke();
        ctx.restore();

        // Central Vault Core
        ctx.beginPath();
        ctx.arc(cx, cy, 9.5 + currentHover * 3, 0, Math.PI * 2);
        ctx.fillStyle = '#060709';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        // Orbiting Token Satellite 1 (Foreground with full glow)
        const orb1 = time * (1.2 + currentHover * 1.2);
        const ox1 = cx + Math.cos(orb1) * rx;
        const oy1 = cy + Math.sin(orb1) * ry - Math.cos(orb1) * 4;
        const depth1 = Math.sin(orb1); // 1 = closest, -1 = furthest

        ctx.beginPath();
        ctx.arc(ox1, oy1, 3.2 + depth1 * 0.6 + currentHover * 1.2, 0, Math.PI * 2);
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
        ctx.arc(ox2, oy2, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${(0.65 + currentHover * 0.35).toFixed(3)})`;
        ctx.fill();

      } else if (topicSlug === 'customer-service') {
        // CUSTOMER SERVICE: Intelligent Conversational Triage Matrix with Branching Conduits
        const intakeX = lineStart + 16;
        const outX = lineEnd - 12;
        const junctionX = lineStart + span * 0.32;
        const tiers = [-22, 0, 22];

        // Intake Portal Node
        ctx.beginPath();
        ctx.arc(intakeX, midY, 5.2 + currentHover * 2, 0, Math.PI * 2);
        ctx.fillStyle = '#060709';
        ctx.fill();
        ctx.strokeStyle = currentHover > 0.5 ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)';
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
            ? `rgba(255, 255, 255, ${(0.32 + currentHover * 0.45).toFixed(3)})`
            : `rgba(255, 255, 255, ${(0.13 + currentHover * 0.22).toFixed(3)})`;
          ctx.lineWidth = idx === 1 ? 1.5 : 1.1;
          ctx.stroke();

          // Terminal Resolution Node
          ctx.beginPath();
          ctx.arc(outX, midY + dy, 3.4, 0, Math.PI * 2);
          ctx.fillStyle = idx === 1 && currentHover > 0.5 ? '#FFFFFF' : 'rgba(255, 255, 255, 0.65)';
          ctx.fill();

          // Traveling Intent Signal Packet with ease-in-out curve
          const pNorm = ((time * 0.42 + idx * 0.33) % 1);
          const t = pNorm;
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
          ctx.arc(px, py, 2.6, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          if (currentHover > 0.1) {
            ctx.shadowColor = '#FFFFFF';
            ctx.shadowBlur = 6 * currentHover;
          }
          ctx.fill();
          ctx.shadowBlur = 0;
        });

      } else if (topicSlug === 'virtual-assistance') {
        // VIRTUAL ASSISTANCE: Dual-Hub Synchronous Context Bridge (Eastern & Western Timezones)
        const hub1X = lineStart + span * 0.22;
        const hub2X = lineEnd - span * 0.22;
        const hubR = 14 + currentHover * 4;

        // Left Hub (Timezone Alpha)
        ctx.beginPath();
        ctx.arc(hub1X, midY, hubR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${(0.22 + currentHover * 0.32).toFixed(3)})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(hub1X, midY, 3.6, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        // Right Hub (Timezone Beta)
        ctx.beginPath();
        ctx.arc(hub2X, midY, hubR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${(0.22 + currentHover * 0.32).toFixed(3)})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(hub2X, midY, 3.6, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        // Upper Infinity Bridge Ribbon
        ctx.beginPath();
        ctx.moveTo(hub1X, midY);
        ctx.bezierCurveTo(
          (hub1X + hub2X) / 2, midY - 24,
          (hub1X + hub2X) / 2, midY + 24,
          hub2X, midY
        );
        ctx.strokeStyle = `rgba(255, 255, 255, ${(0.32 + currentHover * 0.45).toFixed(3)})`;
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // Lower Returning Bridge Ribbon
        ctx.beginPath();
        ctx.moveTo(hub2X, midY);
        ctx.bezierCurveTo(
          (hub1X + hub2X) / 2, midY + 24,
          (hub1X + hub2X) / 2, midY - 24,
          hub1X, midY
        );
        ctx.strokeStyle = `rgba(255, 255, 255, ${(0.13 + currentHover * 0.22).toFixed(3)})`;
        ctx.lineWidth = 1.0;
        ctx.stroke();

        // Passing Context Token Satellite
        const tokenT = (time * 0.45) % 1;
        const p0x = hub1X, p0y = midY;
        const p1x = (hub1X + hub2X) / 2, p1y = midY - 24;
        const p2x = (hub1X + hub2X) / 2, p2y = midY + 24;
        const p3x = hub2X, p3y = midY;

        const cx3 = 3 * (p1x - p0x), cy3 = 3 * (p1y - p0y);
        const bx3 = 3 * (p2x - p1x) - cx3, by3 = 3 * (p2y - p1y) - cy3;
        const ax3 = p3x - p0x - cx3 - bx3, ay3 = p3y - p0y - cy3 - by3;

        const tx = ax3 * Math.pow(tokenT, 3) + bx3 * Math.pow(tokenT, 2) + cx3 * tokenT + p0x;
        const ty = ay3 * Math.pow(tokenT, 3) + by3 * Math.pow(tokenT, 2) + cy3 * tokenT + p0y;

        ctx.beginPath();
        ctx.arc(tx, ty, 3.4 + currentHover * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        if (currentHover > 0.1) {
          ctx.shadowColor = '#FFFFFF';
          ctx.shadowBlur = 8 * currentHover;
        }
        ctx.fill();
        ctx.shadowBlur = 0;

      } else if (topicSlug === 'pitch-decks') {
        // PITCH DECKS: Strategic Ascent Vector & Milestone Altitude Drop-Lines
        const startY = midY + 24;
        const endY = midY - 26;

        // Upward Ascending Trajectory Curve
        ctx.beginPath();
        ctx.moveTo(lineStart, startY);
        ctx.bezierCurveTo(
          lineStart + span * 0.4, startY,
          lineStart + span * 0.7, startY - 14,
          lineEnd, endY
        );
        ctx.strokeStyle = `rgba(255, 255, 255, ${(0.36 + currentHover * 0.5).toFixed(3)})`;
        ctx.lineWidth = 1.6;
        ctx.stroke();

        // 3 Milestone Elevation Reticles
        const milestones = [0.28, 0.62, 0.95];
        milestones.forEach((m, idx) => {
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
          ctx.strokeStyle = `rgba(255, 255, 255, ${(0.1 + currentHover * 0.16).toFixed(3)})`;
          ctx.stroke();
          ctx.setLineDash([]);

          // Milestone Checkpoint Ring
          ctx.beginPath();
          ctx.arc(px, py, 3.5 + (idx === 2 ? 1.5 : 0), 0, Math.PI * 2);
          ctx.fillStyle = idx === 2 ? '#FFFFFF' : '#060709';
          ctx.fill();
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1.4;
          ctx.stroke();
        });

      } else if (topicSlug === 'personal-assistance') {
        // PERSONAL ASSISTANCE: Concentric Sanctuary Core & Perimeter Deflection Shield
        const cx = w / 2;
        const cy = midY;
        const r1 = 12 + currentHover * 3;
        const r2 = 36 + currentHover * 8;
        const r3 = 64 + currentHover * 12;

        // Inner Focus Sanctuary
        ctx.beginPath();
        ctx.arc(cx, cy, r1, 0, Math.PI * 2);
        ctx.fillStyle = currentHover > 0.5 ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.05)';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy, 2.8, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        // Middle Shield Horizon
        ctx.beginPath();
        ctx.arc(cx, cy, r2, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${(0.15 + currentHover * 0.22).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Outer Radar Perimeter
        ctx.beginPath();
        ctx.arc(cx, cy, r3, 0, Math.PI * 2);
        ctx.setLineDash([3, 5]);
        ctx.strokeStyle = `rgba(255, 255, 255, ${(0.1 + currentHover * 0.15).toFixed(3)})`;
        ctx.lineWidth = 0.9;
        ctx.stroke();
        ctx.setLineDash([]);

        // Sweeping Radar Beam (Cinematic Optical Scanner)
        const beamAngle = time * (1.6 + currentHover * 1.2);
        const bx = cx + Math.cos(beamAngle) * r3;
        const by = cy + Math.sin(beamAngle) * r3;

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(bx, by);
        const beamGrad = ctx.createLinearGradient(cx, cy, bx, by);
        beamGrad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        beamGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.strokeStyle = beamGrad;
        ctx.lineWidth = 1.3;
        ctx.stroke();

      } else {
        // FALLBACK: Distributed Resilience Constellation Mesh
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

        clusterNodes.forEach((node, idx) => {
          const pulse = Math.sin(time * 3 + idx * 1.5) * 0.5 + 0.5;
          ctx.beginPath();
          ctx.arc(node.x, node.y, 3.2 + currentHover * 1.2 * pulse, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
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
