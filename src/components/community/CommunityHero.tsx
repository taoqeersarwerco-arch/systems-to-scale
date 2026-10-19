import React, { useEffect, useRef, useState, useCallback } from 'react';
import { StsLogo } from '../ui/StsLogo';
import { ChevronDown, PlusCircle, Radar, Radio, Activity, ArrowRight } from 'lucide-react';
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

  // Interactive controls state
  const [sweepMode, setSweepMode] = useState<boolean>(true);
  const [packetMode, setPacketMode] = useState<boolean>(true);
  const [pulseMode, setPulseMode] = useState<boolean>(false);

  // Refs to avoid re-creating animation frames
  const sweepModeRef = useRef<boolean>(true);
  const packetModeRef = useRef<boolean>(true);
  const pulseModeRef = useRef<boolean>(false);
  const pulseTimeRef = useRef<number>(0);
  const pulseCenterRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    sweepModeRef.current = sweepMode;
  }, [sweepMode]);

  useEffect(() => {
    packetModeRef.current = packetMode;
  }, [packetMode]);

  useEffect(() => {
    pulseModeRef.current = pulseMode;
    if (pulseMode) pulseTimeRef.current = 0;
  }, [pulseMode]);

  const handleScrollToPipeline = () => {
    if (onExploreClick) {
      onExploreClick();
      return;
    }
    const el = document.getElementById('pipeline-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
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

  // Main Radar & Lattice Simulation Loop
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

    // Node & Network setup
    let nodes: Node[] = [];
    let packets: Packet[] = [];
    let sweepAngle = 0;
    let mx = -9999;
    let my = -9999;

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
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          radius: 4.5,
          alpha: 0.9,
          isSupernode: true,
          label: s.label,
          pulsePhase: Math.random() * Math.PI * 2
        });
      });

      // 2. Ambient Ingestion Signals
      const ambientCount = isMobile ? 35 : 75;
      for (let i = 0; i < ambientCount; i++) {
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 1.5 + 1.2,
          alpha: Math.random() * 0.4 + 0.25,
          pulsePhase: Math.random() * Math.PI * 2
        });
      }

      // 3. Packets
      packets = [];
      for (let i = 0; i < 16; i++) {
        packets.push({
          fromNode: Math.floor(Math.random() * nodes.length),
          toNode: Math.floor(Math.random() * nodes.length),
          progress: Math.random(),
          speed: 0.006 + Math.random() * 0.008
        });
      }
    };

    const draw = () => {
      ctx.fillStyle = '#080808';
      ctx.fillRect(0, 0, W, H);

      const cx = W / 2;
      const cy = H / 2;
      const maxRadius = Math.max(W, H) * 0.65;

      // ---------------------------------------------------------------------
      // 1. Concentric Polar Radar Range Rings & Azimuth Crosshairs
      // ---------------------------------------------------------------------
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;

      const ringInterval = isMobile ? 120 : 160;
      for (let r = ringInterval; r < maxRadius; r += ringInterval) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();

        // Small degree tick marks
        for (let d = 0; d < 8; d++) {
          const a = (d * Math.PI) / 4;
          const tx = cx + Math.cos(a) * r;
          const ty = cy + Math.sin(a) * r;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
          ctx.fillRect(tx - 1, ty - 1, 2, 2);
        }
      }

      // Radial Azimuth Axes (0, 45, 90, 135 deg)
      ctx.beginPath();
      ctx.moveTo(cx - maxRadius, cy);
      ctx.lineTo(cx + maxRadius, cy);
      ctx.moveTo(cx, cy - maxRadius);
      ctx.lineTo(cx, cy + maxRadius);
      ctx.stroke();

      // ---------------------------------------------------------------------
      // 2. Rotating Phosphorescent Radar Sweep
      // ---------------------------------------------------------------------
      if (sweepModeRef.current) {
        sweepAngle += 0.008;

        const sweepRadius = maxRadius * 0.95;
        const sweepGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, sweepRadius);
        sweepGrad.addColorStop(0, 'rgba(255, 255, 255, 0.14)');
        sweepGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, sweepRadius, sweepAngle - 0.45, sweepAngle);
        ctx.fillStyle = sweepGrad;
        ctx.fill();

        // Leading edge line
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(sweepAngle) * sweepRadius, cy + Math.sin(sweepAngle) * sweepRadius);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // ---------------------------------------------------------------------
      // 3. Shockwave Pulse Ripple
      // ---------------------------------------------------------------------
      if (pulseModeRef.current) {
        pulseTimeRef.current += 0.02;
        const pulseR = pulseTimeRef.current * 320;
        const pulseAlpha = Math.max(0, 1 - pulseR / (maxRadius * 1.2));

        const pcx = pulseCenterRef.current.x || cx;
        const pcy = pulseCenterRef.current.y || cy;

        ctx.beginPath();
        ctx.arc(pcx, pcy, pulseR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${pulseAlpha * 0.8})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        if (pulseAlpha <= 0.01) {
          pulseModeRef.current = false;
          setPulseMode(false);
        }
      }

      // ---------------------------------------------------------------------
      // 4. Update & Draw Nodes
      // ---------------------------------------------------------------------
      const maxConnectDist = isMobile ? 110 : 155;

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        // Drift motion
        n.x += n.vx;
        n.y += n.vy;

        // Screen boundary bounce
        if (n.x < 20 || n.x > W - 20) n.vx *= -1;
        if (n.y < 20 || n.y > H - 20) n.vy *= -1;

        // Mouse gravitational attraction
        const dx = mx - n.x;
        const dy = my - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180 && dist > 1) {
          const pull = (1 - dist / 180) * 0.45;
          n.x += (dx / dist) * pull;
          n.y += (dy / dist) * pull;
        }

        // Draw connections between nearby nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const ndx = m.x - n.x;
          const ndy = m.y - n.y;
          const nDist = Math.sqrt(ndx * ndx + ndy * ndy);

          if (nDist < maxConnectDist) {
            const filamentAlpha = (1 - nDist / maxConnectDist) * 0.22;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${filamentAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${n.alpha})`;
        ctx.fill();

        // Supernode outer ring and label
        if (n.isSupernode) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius + 4, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 1;
          ctx.stroke();

          if (!isMobile && n.label) {
            ctx.font = '9px monospace';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
            ctx.fillText(n.label, n.x + 8, n.y + 3);
          }
        }
      }

      // ---------------------------------------------------------------------
      // 5. Travelling Photon Packets
      // ---------------------------------------------------------------------
      if (packetModeRef.current) {
        for (let i = 0; i < packets.length; i++) {
          const pk = packets[i];
          const from = nodes[pk.fromNode];
          const to = nodes[pk.toNode];

          if (!from || !to) continue;

          pk.progress += pk.speed;
          if (pk.progress >= 1) {
            pk.progress = 0;
            pk.fromNode = Math.floor(Math.random() * nodes.length);
            pk.toNode = Math.floor(Math.random() * nodes.length);
            continue;
          }

          const px = from.x + (to.x - from.x) * pk.progress;
          const py = from.y + (to.y - from.y) * pk.progress;

          ctx.beginPath();
          ctx.arc(px, py, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = '#FFFFFF';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
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
      triggerPulseAt(e.clientX - rect.left, e.clientY - rect.top);
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
  }, [triggerPulseAt]);

  return (
    <section className={styles.heroContainer} ref={containerRef}>
      {/* Background Interactive Radar Canvas */}
      <canvas ref={canvasRef} className={styles.canvas} title="Click to trigger global telemetry pulse" />

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
          {/* Breathing Logo Mark */}
          <div className={styles.logoWrap}>
            <StsLogo size={106} color="#FFFFFF" />
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

          {/* 4-Stat Community Proof Ribbon */}
          <div className={styles.statsRibbon}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>1,280+</span>
              <span className={styles.statLabel}>Verified Engineers</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>42</span>
              <span className={styles.statLabel}>Open Inquiries</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>1,000</span>
              <span className={styles.statLabel}>Quorum Threshold</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>0%</span>
              <span className={styles.statLabel}>Vendor Promotion</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Controls Dock (Sweep / Packets / Pulse) */}
      <div className={styles.controlsDock}>
        <button
          className={`${styles.ctrlBtn} ${sweepMode ? styles.ctrlBtnActive : ''}`}
          onClick={() => setSweepMode(!sweepMode)}
          title="Toggle radar sweep beam"
        >
          <Radar size={11} style={{ display: 'inline', marginRight: 4, verticalAlign: -1 }} />
          Sweep
        </button>
        <button
          className={`${styles.ctrlBtn} ${packetMode ? styles.ctrlBtnActive : ''}`}
          onClick={() => setPacketMode(!packetMode)}
          title="Toggle consensus packet transfers"
        >
          <Radio size={11} style={{ display: 'inline', marginRight: 4, verticalAlign: -1 }} />
          Packets
        </button>
        <button
          className={`${styles.ctrlBtn} ${pulseMode ? styles.ctrlBtnActive : ''}`}
          onClick={() => triggerPulseAt()}
          title="Trigger a full-field telemetry shockwave pulse"
        >
          <Activity size={11} style={{ display: 'inline', marginRight: 4, verticalAlign: -1 }} />
          Pulse
        </button>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator} onClick={handleScrollToPipeline}>
        <span className={styles.scrollText}>Scroll to Pipeline</span>
        <ChevronDown size={14} className={styles.scrollBounce} />
      </div>
    </section>
  );
};
