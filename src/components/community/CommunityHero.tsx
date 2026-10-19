import React, { useEffect, useRef, useCallback } from 'react';
import { CinematicLogoEngine } from '../ui/CinematicLogoEngine';
import { ChevronDown, PlusCircle } from 'lucide-react';
import styles from '../../styles/communityHero.module.css';

interface CommunityHeroProps {
  onSubmitClick: () => void;
  onExploreClick?: () => void;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  isSupernode?: boolean;
  label?: string;
  pulsePhase: number;
}

interface Packet {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
}

interface Shockwave {
  x: number;
  y: number;
  r: number;
  maxR: number;
  alpha: number;
  speed: number;
}

const SUPERNODES_DATA = [
  { label: 'AI & AUTOMATION', angle: 0.2 },
  { label: 'E-COMMERCE', angle: 0.9 },
  { label: 'MARKETING & ADS', angle: 1.8 },
  { label: 'WEB DESIGN', angle: 2.7 },
  { label: 'CUSTOMER SERVICE', angle: 3.5 },
  { label: 'DISTRIBUTED STATE', angle: 4.3 },
  { label: 'KERNEL BYPASS', angle: 5.1 },
  { label: 'STORAGE ENGINES', angle: 5.9 }
];

export const CommunityHero: React.FC<CommunityHeroProps> = ({
  onSubmitClick,
  onExploreClick
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Autonomous gravitational shockwaves list
  const shockwavesRef = useRef<Shockwave[]>([]);
  const lastAutoWaveTimeRef = useRef<number>(0);

  const handleScrollToPipeline = () => {
    if (onExploreClick) {
      onExploreClick();
      return;
    }
    const el = document.getElementById('pipeline-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const triggerGravitationalPulse = useCallback((x: number, y: number, maxR: number = 800) => {
    shockwavesRef.current.push({
      x,
      y,
      r: 10,
      maxR,
      alpha: 1.0,
      speed: 4.5
    });
  }, []);

  // Main Simulation Loop with Inherent Potential Well Distortion Field
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let W = (canvas.width = container.offsetWidth);
    let H = (canvas.height = container.offsetHeight);

    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Simulation entities
    let nodes: Node[] = [];
    let packets: Packet[] = [];
    let sweepAngle = 0;
    let mx = -9999;
    let my = -9999;
    let time = 0;

    const initNetwork = () => {
      nodes = [];
      const cx = W / 2;
      const cy = H / 2;

      // 1. Eight Core Discipline Supernodes
      const supernodeR = isMobile ? Math.min(W, H) * 0.38 : Math.min(W, H) * 0.35;
      SUPERNODES_DATA.forEach((s) => {
        nodes.push({
          x: cx + Math.cos(s.angle) * supernodeR + (Math.random() - 0.5) * 40,
          y: cy + Math.sin(s.angle) * supernodeR + (Math.random() - 0.5) * 40,
          vx: (Math.random() - 0.5) * 0.16,
          vy: (Math.random() - 0.5) * 0.16,
          radius: 4.5,
          alpha: 0.92,
          isSupernode: true,
          label: s.label,
          pulsePhase: Math.random() * Math.PI * 2
        });
      });

      // 2. Ambient Ingestion Signals
      const ambientCount = isMobile ? 36 : 72;
      for (let i = 0; i < ambientCount; i++) {
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
          radius: Math.random() * 1.5 + 1.2,
          alpha: Math.random() * 0.4 + 0.25,
          pulsePhase: Math.random() * Math.PI * 2
        });
      }

      // 3. Inherent Continuous Packets
      packets = [];
      for (let i = 0; i < 20; i++) {
        packets.push({
          fromNode: Math.floor(Math.random() * nodes.length),
          toNode: Math.floor(Math.random() * nodes.length),
          progress: Math.random(),
          speed: 0.005 + Math.random() * 0.009
        });
      }
    };

    /**
     * Inherent Spacetime Gravitational Potential Well Distortion Metric
     * Distorts nominal Euclidean coordinate (px, py) into curved spacetime.
     */
    const distortPoint = (
      px: number,
      py: number,
      cx: number,
      cy: number,
      t: number
    ): { x: number; y: number; factor: number } => {
      let dx = px - cx;
      let dy = py - cy;
      const dc = Math.sqrt(dx * dx + dy * dy);

      // 1. Central Gravitational Potential Well (Inverse falloff + subtle breathing wave)
      const wellDepth = 32 / (1 + dc * 0.0045);
      const breath = Math.sin(t * 1.8 - dc * 0.014) * 6;
      const centralPull = (wellDepth + breath) / (dc + 24);

      let outX = px - dx * centralPull * 0.5;
      let outY = py - dy * centralPull * 0.5;

      // Kerr Frame-Dragging Vortex (subtle rotational twist near event horizon)
      if (dc > 25 && dc < 520) {
        const swirl = Math.sin(t * 0.8) * 0.032 * (1 - dc / 520);
        const cosS = Math.cos(swirl);
        const sinS = Math.sin(swirl);
        const rx = outX - cx;
        const ry = outY - cy;
        outX = cx + rx * cosS - ry * sinS;
        outY = cy + rx * sinS + ry * cosS;
      }

      // 2. Mobile Cursor Gravitational Lens Well
      if (mx > -1000 && my > -1000) {
        const mdx = outX - mx;
        const mdy = outY - my;
        const dm = Math.sqrt(mdx * mdx + mdy * mdy);
        const lensRadius = 260;
        if (dm < lensRadius && dm > 1) {
          const lensNorm = 1 - dm / lensRadius;
          const lensFactor = (lensNorm * lensNorm * 44) / (dm + 20);
          outX -= mdx * lensFactor;
          outY -= mdy * lensFactor;
        }
      }

      // 3. Gravitational Metric Shockwaves
      const waves = shockwavesRef.current;
      for (let k = 0; k < waves.length; k++) {
        const wave = waves[k];
        const wdx = outX - wave.x;
        const wdy = outY - wave.y;
        const dw = Math.sqrt(wdx * wdx + wdy * wdy);
        const distFromFront = Math.abs(dw - wave.r);
        if (distFromFront < 85 && dw > 1) {
          const rippleAmp = Math.cos((distFromFront / 85) * Math.PI * 0.5) * 15 * wave.alpha;
          outX += (wdx / dw) * rippleAmp;
          outY += (wdy / dw) * rippleAmp;
        }
      }

      return { x: outX, y: outY, factor: centralPull };
    };

    const draw = () => {
      time += 0.016;

      ctx.fillStyle = '#080808';
      ctx.fillRect(0, 0, W, H);

      const cx = W / 2;
      const cy = H / 2;
      const maxRadius = Math.max(W, H) * 0.68;

      // ---------------------------------------------------------------------
      // 0. Update Autonomous Shockwaves
      // ---------------------------------------------------------------------
      if (time - lastAutoWaveTimeRef.current > 4.2) {
        lastAutoWaveTimeRef.current = time;
        triggerGravitationalPulse(cx, cy, maxRadius * 1.15);
      }

      for (let i = shockwavesRef.current.length - 1; i >= 0; i--) {
        const wave = shockwavesRef.current[i];
        wave.r += wave.speed;
        wave.alpha = Math.max(0, 1 - wave.r / wave.maxR);
        if (wave.alpha <= 0.01) {
          shockwavesRef.current.splice(i, 1);
        }
      }

      // ---------------------------------------------------------------------
      // 1. Inherent Gravitational Equipotential Radar Range Rings
      // ---------------------------------------------------------------------
      const ringInterval = isMobile ? 110 : 150;
      const numRings = Math.floor(maxRadius / ringInterval);
      const ringSteps = isMobile ? 64 : 96;

      for (let ringIdx = 1; ringIdx <= numRings; ringIdx++) {
        const nominalR = ringIdx * ringInterval;
        const ringAlpha = Math.max(0.02, 0.065 - (ringIdx / numRings) * 0.035);

        ctx.beginPath();
        for (let s = 0; s <= ringSteps; s++) {
          const theta = (s / ringSteps) * Math.PI * 2;
          const px = cx + Math.cos(theta) * nominalR;
          const py = cy + Math.sin(theta) * nominalR;
          const pt = distortPoint(px, py, cx, cy, time);

          if (s === 0) {
            ctx.moveTo(pt.x, pt.y);
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(255, 255, 255, ${ringAlpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Equipotential Azimuth Tick Marks (8 primary axes)
        for (let d = 0; d < 8; d++) {
          const a = (d * Math.PI) / 4;
          const px = cx + Math.cos(a) * nominalR;
          const py = cy + Math.sin(a) * nominalR;
          const pt = distortPoint(px, py, cx, cy, time);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
          ctx.fillRect(pt.x - 1, pt.y - 1, 2, 2);
        }
      }

      // Subtle Minor Metric Resonance Sub-rings
      for (let ringIdx = 1; ringIdx <= numRings; ringIdx++) {
        const nominalSubR = (ringIdx - 0.5) * ringInterval;
        ctx.beginPath();
        for (let s = 0; s <= 48; s++) {
          const theta = (s / 48) * Math.PI * 2;
          const px = cx + Math.cos(theta) * nominalSubR;
          const py = cy + Math.sin(theta) * nominalSubR;
          const pt = distortPoint(px, py, cx, cy, time);
          if (s === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.closePath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.018)';
        ctx.lineWidth = 0.75;
        ctx.stroke();
      }

      // ---------------------------------------------------------------------
      // 2. Distorted Spacetime Geodesic Axes (Azimuth Filaments)
      // ---------------------------------------------------------------------
      const numRays = 8;
      const raySteps = 30;
      ctx.lineWidth = 0.85;

      for (let r = 0; r < numRays; r++) {
        const rayAngle = (r * Math.PI) / 4;
        ctx.beginPath();
        for (let step = 0; step <= raySteps; step++) {
          const rad = 45 + (step / raySteps) * (maxRadius - 45);
          const px = cx + Math.cos(rayAngle) * rad;
          const py = cy + Math.sin(rayAngle) * rad;
          const pt = distortPoint(px, py, cx, cy, time);

          if (step === 0) {
            ctx.moveTo(pt.x, pt.y);
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        }
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
        ctx.stroke();
      }

      // ---------------------------------------------------------------------
      // 3. Inherent Rotating Phosphorescent Radar Sweep
      // ---------------------------------------------------------------------
      sweepAngle += 0.0085;
      const sweepRadius = maxRadius * 0.95;
      const sweepGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, sweepRadius);
      sweepGrad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
      sweepGrad.addColorStop(0.65, 'rgba(255, 255, 255, 0.035)');
      sweepGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, sweepRadius, sweepAngle - 0.42, sweepAngle);
      ctx.fillStyle = sweepGrad;
      ctx.fill();

      // Leading edge ray with metric distortion
      ctx.beginPath();
      for (let step = 0; step <= 24; step++) {
        const rad = (step / 24) * sweepRadius;
        const px = cx + Math.cos(sweepAngle) * rad;
        const py = cy + Math.sin(sweepAngle) * rad;
        const pt = distortPoint(px, py, cx, cy, time);
        if (step === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1.1;
      ctx.stroke();

      // ---------------------------------------------------------------------
      // 4. Inherent Gravitational Metric Shockwave Rings
      // ---------------------------------------------------------------------
      for (let k = 0; k < shockwavesRef.current.length; k++) {
        const wave = shockwavesRef.current[k];
        ctx.beginPath();
        for (let s = 0; s <= 64; s++) {
          const theta = (s / 64) * Math.PI * 2;
          const px = wave.x + Math.cos(theta) * wave.r;
          const py = wave.y + Math.sin(theta) * wave.r;
          const pt = distortPoint(px, py, cx, cy, time);
          if (s === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(255, 255, 255, ${wave.alpha * 0.45})`;
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }

      // ---------------------------------------------------------------------
      // 5. Update & Draw Nodes with Potential Well Warping
      // ---------------------------------------------------------------------
      const maxConnectDist = isMobile ? 115 : 160;

      // Calculate distorted coordinates for all nodes
      const distortedNodes = nodes.map((n) => {
        // Drift motion
        n.x += n.vx;
        n.y += n.vy;

        // Boundary bounce
        if (n.x < 20 || n.x > W - 20) n.vx *= -1;
        if (n.y < 20 || n.y > H - 20) n.vy *= -1;

        // Metric well distortion
        const distorted = distortPoint(n.x, n.y, cx, cy, time);
        return {
          original: n,
          dx: distorted.x,
          dy: distorted.y
        };
      });

      // Draw Connections between distorted nodes
      for (let i = 0; i < distortedNodes.length; i++) {
        const ni = distortedNodes[i];

        for (let j = i + 1; j < distortedNodes.length; j++) {
          const nj = distortedNodes[j];
          const ndx = nj.dx - ni.dx;
          const ndy = nj.dy - ni.dy;
          const dist = Math.sqrt(ndx * ndx + ndy * ndy);

          if (dist < maxConnectDist) {
            const filamentAlpha = (1 - dist / maxConnectDist) * 0.22;
            ctx.beginPath();
            ctx.moveTo(ni.dx, ni.dy);
            ctx.lineTo(nj.dx, nj.dy);
            ctx.strokeStyle = `rgba(255, 255, 255, ${filamentAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Draw node at distorted position
        const node = ni.original;
        ctx.beginPath();
        ctx.arc(ni.dx, ni.dy, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${node.alpha})`;
        ctx.fill();

        // Supernode Outer Ring & Label
        if (node.isSupernode) {
          ctx.beginPath();
          ctx.arc(ni.dx, ni.dy, node.radius + 4.5, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.42)';
          ctx.lineWidth = 1;
          ctx.stroke();

          if (!isMobile && node.label) {
            ctx.font = '9px monospace';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.fillText(node.label, ni.dx + 8, ni.dy + 3);
          }
        }
      }

      // ---------------------------------------------------------------------
      // 6. Inherent Travelling Photon Packets
      // ---------------------------------------------------------------------
      for (let i = 0; i < packets.length; i++) {
        const pk = packets[i];
        const from = distortedNodes[pk.fromNode];
        const to = distortedNodes[pk.toNode];

        if (!from || !to) continue;

        pk.progress += pk.speed;
        if (pk.progress >= 1) {
          pk.progress = 0;
          pk.fromNode = Math.floor(Math.random() * nodes.length);
          pk.toNode = Math.floor(Math.random() * nodes.length);
          continue;
        }

        const px = from.dx + (to.dx - from.dx) * pk.progress;
        const py = from.dy + (to.dy - from.dy) * pk.progress;

        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 9;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      if (!prefersReducedMotion) {
        animId = requestAnimationFrame(draw);
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
    };

    const onMouseLeave = () => {
      mx = -9999;
      my = -9999;
    };

    const onCanvasClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      triggerGravitationalPulse(e.clientX - rect.left, e.clientY - rect.top, Math.max(W, H) * 0.9);
    };

    const onResize = () => {
      W = canvas.width = container.offsetWidth;
      H = canvas.height = container.offsetHeight;
      initNetwork();
    };

    onResize();
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
  }, [triggerGravitationalPulse]);

  return (
    <section className={styles.heroContainer} ref={containerRef}>
      {/* Background Interactive Gravitational Potential Well Radar Canvas */}
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        title="Inherent Spacetime Gravitational Potential Well — Click to emit metric wave"
      />

      {/* Atmospheric Contrast Reading Vignette */}
      <div className={styles.vignetteOverlay} />

      {/* Technical Reticle Crosshairs */}
      <div className={styles.reticleTL}>+</div>
      <div className={styles.reticleTR}>+</div>
      <div className={styles.reticleBL}>+</div>
      <div className={styles.reticleBR}>+</div>

      {/* Main Content */}
      <div className={styles.contentWrapper}>
        <div className={styles.interactiveLayer}>
          {/* Living Cinematic Logo Mark */}
          <div className={styles.logoWrap}>
            <CinematicLogoEngine size={92} showRings={true} interactive={true} />
          </div>

          {/* Eyebrow Protocol Badge */}
          <div className={styles.eyebrowBadge}>
            <span className={styles.beaconDot} />
            <span className={styles.eyebrowText}>OBSERVATORY TELEMETRY // GLOBAL DEMAND RADAR</span>
          </div>

          {/* Primary H1 Headline */}
          <h1 className={styles.headline}>
            The Systems Community.
          </h1>

          {/* Sub-lead */}
          <p className={styles.sublead}>
            Where infrastructure leads, distributed systems architects, and technical operators steer the editorial backlog. Vote on high-contention failure modes, audit in-flight specifications, or submit unreleased production topologies for mechanical teardown.
          </p>

          {/* CTA Row */}
          <div className={styles.ctaRow}>
            <button onClick={onSubmitClick} className={styles.primaryCta}>
              <PlusCircle size={15} />
              <span>Submit Production Teardown</span>
            </button>
            <button onClick={handleScrollToPipeline} className={styles.secondaryCta}>
              <span>Explore Research Pipeline</span>
              <ChevronDown size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator} onClick={handleScrollToPipeline}>
        <span className={styles.scrollText}>Scroll to Pipeline</span>
        <ChevronDown size={14} className={styles.scrollBounce} />
      </div>
    </section>
  );
};
