import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Microscope, Play, CheckCircle2, Cpu, Activity, ShieldCheck, FileCode2 } from 'lucide-react';
import styles from '../../styles/protocolReactor.module.css';

interface StageData {
  id: number;
  stageLabel: string;
  badge: string;
  title: string;
  desc: string;
  telemetryKey: string;
  telemetryVal: string;
  icon: React.ReactNode;
}

const STAGES: StageData[] = [
  {
    id: 1,
    stageLabel: 'Stage 01',
    badge: 'Ingestion Radar',
    title: 'Community Demand Signal',
    desc: 'Subscribers vote and register demand for mission-critical architectures, failure edge cases, and distributed bottlenecks.',
    telemetryKey: 'QUORUM THRESHOLD',
    telemetryVal: '1,000 / 1,000 VOTES',
    icon: <Activity size={12} />
  },
  {
    id: 2,
    stageLabel: 'Stage 02',
    badge: 'Source Dissector',
    title: 'Primary Source Audit',
    desc: 'Direct examination of open RFCs, vendor specifications, and engine source code. Zero synthetic summaries.',
    telemetryKey: 'RFC REVISION TREE',
    telemetryVal: 'VERIFIED (PASS)',
    icon: <FileCode2 size={12} />
  },
  {
    id: 3,
    stageLabel: 'Stage 03',
    badge: 'Chaos Lab',
    title: 'Failure Reproduction',
    desc: 'Simulating production limits, testing recovery mechanisms under fault conditions, and compiling physical benchmark logs.',
    telemetryKey: 'FAULT INJECTION',
    telemetryVal: 'PARTITION RECOVERED',
    icon: <Cpu size={12} />
  },
  {
    id: 4,
    stageLabel: 'Stage 04',
    badge: 'Published Spec',
    title: 'Living Technical Spec',
    desc: 'Releasing the long-form mechanical teardown complete with living interactive canvas simulators and failure mode playbooks.',
    telemetryKey: 'SPEC STATUS',
    telemetryVal: 'PRODUCTION READY',
    icon: <ShieldCheck size={12} />
  }
];

export const ProtocolReactor: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const simTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Canvas Refs for each stage
  const canvas1Ref = useRef<HTMLCanvasElement>(null);
  const canvas2Ref = useRef<HTMLCanvasElement>(null);
  const canvas3Ref = useRef<HTMLCanvasElement>(null);
  const canvas4Ref = useRef<HTMLCanvasElement>(null);

  // Pipeline simulation runner
  const runSimulation = useCallback(() => {
    if (isSimulating) return;
    setIsSimulating(true);
    setActiveStage(1);

    const stepDuration = 1200; // ms per stage
    let current = 1;

    const advance = () => {
      if (current < 4) {
        current += 1;
        setActiveStage(current);
        simTimerRef.current = setTimeout(advance, stepDuration);
      } else {
        setTimeout(() => {
          setIsSimulating(false);
        }, 1200);
      }
    };

    simTimerRef.current = setTimeout(advance, stepDuration);
  }, [isSimulating]);

  useEffect(() => {
    return () => {
      if (simTimerRef.current) clearTimeout(simTimerRef.current);
    };
  }, []);

  // =========================================================================
  // Canvas 1: Ingestion Radar Sweep & Blips
  // =========================================================================
  useEffect(() => {
    const canvas = canvas1Ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;
    const blips = [
      { r: 28, a: 0.8, baseAngle: 0.7, pulse: 0 },
      { r: 48, a: 0.6, baseAngle: 2.1, pulse: 0 },
      { r: 40, a: 0.7, baseAngle: 4.2, pulse: 0 },
      { r: 18, a: 0.9, baseAngle: 5.4, pulse: 0 }
    ];

    const draw = () => {
      const w = (canvas.width = canvas.parentElement?.offsetWidth || 260);
      const h = (canvas.height = canvas.parentElement?.offsetHeight || 140);
      const cx = w / 2;
      const cy = h / 2;

      ctx.fillStyle = '#080808';
      ctx.fillRect(0, 0, w, h);

      // Radar concentric rings
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      [20, 38, 56].forEach(radius => {
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Axis crosshairs
      ctx.beginPath();
      ctx.moveTo(cx - 60, cy);
      ctx.lineTo(cx + 60, cy);
      ctx.moveTo(cx, cy - 60);
      ctx.lineTo(cx, cy + 60);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.stroke();

      // Sweep line
      angle += 0.035;
      const sweepX = cx + Math.cos(angle) * 58;
      const sweepY = cy + Math.sin(angle) * 58;

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 60);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, 58, angle - 0.4, angle);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(sweepX, sweepY);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Blips
      blips.forEach(b => {
        const bx = cx + Math.cos(b.baseAngle) * b.r;
        const by = cy + Math.sin(b.baseAngle) * b.r;

        // Check if sweep is near
        const diff = Math.abs((angle % (Math.PI * 2)) - (b.baseAngle % (Math.PI * 2)));
        if (diff < 0.1) b.pulse = 1;

        if (b.pulse > 0.02) {
          ctx.beginPath();
          ctx.arc(bx, by, 3 + (1 - b.pulse) * 8, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${b.pulse * 0.7})`;
          ctx.stroke();
          b.pulse *= 0.94;
        }

        ctx.beginPath();
        ctx.arc(bx, by, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${b.a})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  // =========================================================================
  // Canvas 2: Source AST & RFC Dissector Laser Scanner
  // =========================================================================
  useEffect(() => {
    const canvas = canvas2Ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let scanY = 10;
    let scanDir = 1;

    const mockNodes = [
      { x: 30, y: 35, label: 'RFC-7540', verified: true },
      { x: 120, y: 35, label: '0x4F9B', verified: true },
      { x: 200, y: 35, label: 'AST-LOG', verified: true },
      { x: 60, y: 70, label: 'MEM-EPOCH', verified: false },
      { x: 160, y: 70, label: 'VERIFIED', verified: true },
      { x: 90, y: 105, label: 'ZERO-FLUFF', verified: true }
    ];

    const draw = () => {
      const w = (canvas.width = canvas.parentElement?.offsetWidth || 260);
      const h = (canvas.height = canvas.parentElement?.offsetHeight || 140);

      ctx.fillStyle = '#080808';
      ctx.fillRect(0, 0, w, h);

      // Code structure background lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let y = 15; y < h; y += 18) {
        ctx.beginPath();
        ctx.moveTo(15, y);
        ctx.lineTo(w - 15, y);
        ctx.stroke();
      }

      // Connecting trees
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.beginPath();
      ctx.moveTo(w * 0.2, 35);
      ctx.lineTo(w * 0.5, 70);
      ctx.lineTo(w * 0.8, 35);
      ctx.moveTo(w * 0.5, 70);
      ctx.lineTo(w * 0.5, 105);
      ctx.stroke();

      // Nodes
      mockNodes.forEach((node, idx) => {
        const nx = (node.x / 260) * w;
        const ny = (node.y / 140) * h;
        const isHit = Math.abs(ny - scanY) < 14;

        ctx.fillStyle = isHit ? '#FFFFFF' : 'rgba(255, 255, 255, 0.2)';
        ctx.beginPath();
        ctx.arc(nx, ny, isHit ? 4 : 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '8px monospace';
        ctx.fillStyle = isHit ? '#FFFFFF' : 'rgba(255, 255, 255, 0.4)';
        ctx.fillText(node.label, nx + 6, ny + 3);
      });

      // Scanner laser beam
      scanY += 1.2 * scanDir;
      if (scanY > h - 15 || scanY < 15) scanDir *= -1;

      const beamGrad = ctx.createLinearGradient(0, scanY - 6, 0, scanY + 6);
      beamGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      beamGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.85)');
      beamGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = beamGrad;
      ctx.fillRect(10, scanY - 4, w - 20, 8);

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  // =========================================================================
  // Canvas 3: Chaos & Fault Injection Oscilloscope
  // =========================================================================
  useEffect(() => {
    const canvas = canvas3Ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;
    let partitionTimer = 0;

    const draw = () => {
      const w = (canvas.width = canvas.parentElement?.offsetWidth || 260);
      const h = (canvas.height = canvas.parentElement?.offsetHeight || 140);
      const cy = h / 2;

      ctx.fillStyle = '#080808';
      ctx.fillRect(0, 0, w, h);

      // Grid mesh
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 24) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      t += 0.06;
      partitionTimer += 0.02;

      // Occasional fault partition glitch
      const isFault = Math.sin(partitionTimer) > 0.82;

      // Draw Waveform
      ctx.beginPath();
      ctx.moveTo(0, cy);

      for (let x = 0; x < w; x++) {
        const progress = x / w;
        let wave = Math.sin(progress * 14 - t) * 18;
        wave += Math.sin(progress * 28 + t * 1.5) * 6;

        if (isFault && progress > 0.4 && progress < 0.7) {
          // Chaos latency partition drop
          wave = (Math.random() - 0.5) * 44;
        }

        ctx.lineTo(x, cy + wave);
      }

      ctx.strokeStyle = isFault ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = isFault ? 2 : 1.5;
      ctx.stroke();

      // Heartbeat pulse dot
      const pulseX = (t * 22) % w;
      let pulseY = cy + Math.sin((pulseX / w) * 14 - t) * 18;
      ctx.beginPath();
      ctx.arc(pulseX, pulseY, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#FFFFFF';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Telemetry badge
      ctx.font = '8px monospace';
      ctx.fillStyle = isFault ? '#FFFFFF' : 'rgba(255, 255, 255, 0.4)';
      ctx.fillText(isFault ? '● FAULT INJECTED (FAILOVER ACTIVE)' : '● 99.99% CONSENSUS STEADY', 12, 20);

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  // =========================================================================
  // Canvas 4: Verified Production Spec Wireframe
  // =========================================================================
  useEffect(() => {
    const canvas = canvas4Ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const draw = () => {
      const w = (canvas.width = canvas.parentElement?.offsetWidth || 260);
      const h = (canvas.height = canvas.parentElement?.offsetHeight || 140);
      const cx = w / 2;
      const cy = h / 2;

      ctx.fillStyle = '#080808';
      ctx.fillRect(0, 0, w, h);

      angle += 0.015;

      // 3D Isometric cube / blueprint rotation
      const size = 32;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      const vertices = [
        [-size, -size * 0.6, -size * 0.6],
        [size, -size * 0.6, -size * 0.6],
        [size, size * 0.6, -size * 0.6],
        [-size, size * 0.6, -size * 0.6],
        [-size, -size * 0.6, size * 0.6],
        [size, -size * 0.6, size * 0.6],
        [size, size * 0.6, size * 0.6],
        [-size, size * 0.6, size * 0.6]
      ];

      const projected = vertices.map(([x, y, z]) => {
        const rx = x * cosA - z * sinA;
        const rz = x * sinA + z * cosA;
        return [cx + rx, cy + y + rz * 0.25];
      });

      const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7]
      ];

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1.2;

      edges.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(projected[a][0], projected[a][1]);
        ctx.lineTo(projected[b][0], projected[b][1]);
        ctx.stroke();
      });

      // Vertices nodes
      projected.forEach(([px, py]) => {
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
      });

      // Emitting verification rings
      const ringR = (angle * 28) % 64;
      const ringAlpha = 1 - ringR / 64;
      ctx.beginPath();
      ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${ringAlpha * 0.4})`;
      ctx.stroke();

      ctx.font = '8px monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText('LIVE INTERACTIVE SPEC', 12, 20);

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <section id="pipeline-section" className={styles.pipelineSection}>
      {/* Background Atmospheric Glow */}
      <div className={styles.sectionBackdropGlow} />

      {/* Section Header */}
      <div className={styles.sectionHeaderCenter}>
        <div className={styles.sectionEyebrow}>
          <span className={styles.pulsingDot} />
          <span>Observatory Editorial Reactor</span>
        </div>

        <h2 className={styles.sectionTitle}>
          How community requests become verified specs.
        </h2>

        <p className={styles.sectionSubhead}>
          Every breakdown undergoes rigorous primary-source investigation, source tree inspection, and simulated chaos testing before entering the permanent architecture library.
        </p>
      </div>

      {/* Simulation Controls & Status Strip */}
      <div className={styles.pipelineControlsBar}>
        <div className={styles.pipelineStatus}>
          <span className={styles.statusIndicator}>
            <span className={styles.statusDot} />
            <span>Active Station: Stage 0{activeStage} — {STAGES[activeStage - 1].badge}</span>
          </span>
        </div>

        <button
          onClick={runSimulation}
          className={`${styles.simulateBtn} ${isSimulating ? styles.simulateBtnActive : ''}`}
          title="Simulate a community request traversing all 4 stages"
        >
          <Play size={12} fill="currentColor" />
          <span>{isSimulating ? 'Simulating Pipeline...' : 'Simulate Pipeline Run'}</span>
        </button>
      </div>

      {/* 4 Pods Grid Container */}
      <div className={styles.reactorGrid}>
        {/* Connecting Rail Line */}
        <div className={styles.flowTrackLine}>
          <div className={styles.travelingPulse} />
        </div>

        {/* 4 Stage Pods */}
        {STAGES.map((stage) => {
          const isActive = activeStage === stage.id;
          return (
            <div
              key={stage.id}
              className={`${styles.reactorPod} ${isActive ? styles.reactorPodActive : ''}`}
              onClick={() => setActiveStage(stage.id)}
            >
              {/* Header */}
              <div className={styles.podHeader}>
                <span className={styles.stagePill}>{stage.stageLabel}</span>
                <span className={styles.modeBadge}>{stage.badge}</span>
              </div>

              {/* Living Canvas Viewport */}
              <div className={styles.canvasContainer}>
                <span className={styles.cornerPlusTL}>+</span>
                <span className={styles.cornerPlusBR}>+</span>
                {stage.id === 1 && <canvas ref={canvas1Ref} className={styles.stageCanvas} />}
                {stage.id === 2 && <canvas ref={canvas2Ref} className={styles.stageCanvas} />}
                {stage.id === 3 && <canvas ref={canvas3Ref} className={styles.stageCanvas} />}
                {stage.id === 4 && <canvas ref={canvas4Ref} className={styles.stageCanvas} />}
              </div>

              {/* Text Body */}
              <div className={styles.podBody}>
                <h3 className={styles.podTitle}>{stage.title}</h3>
                <p className={styles.podDescription}>{stage.desc}</p>
              </div>

              {/* Telemetry Footer */}
              <div className={styles.podTelemetry}>
                <span>{stage.telemetryKey}</span>
                <span className={styles.telemetryVal}>{stage.telemetryVal}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
