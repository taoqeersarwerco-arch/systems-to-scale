import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, Clock, LucideIcon } from 'lucide-react';
import './TopicCinematicCard.css';

export interface PipelineNode {
  label: string;
  tooltip: string;
  icon: LucideIcon;
}

export interface MetricItem {
  label: string;
  value: number;
  formattedValue?: string;
  unit: string;
  barPct: number;
}

export interface TopicCinematicData {
  slug: string;
  name: string;
  hook: string;
  articlesCount: number;
  readTime: string;
  statusStandby?: string;
  statusActive?: string;
  badge?: string;
  scopeParagraph?: string;
  verifiedFact?: string;
  mechanismPills?: string[];
  nodes: PipelineNode[];
  metrics: MetricItem[];
}

interface TopicCinematicCardProps {
  data: TopicCinematicData;
  isRevealed: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
}

export const TopicCinematicCard: React.FC<TopicCinematicCardProps> = ({
  data,
  isRevealed,
  onActivate,
  onDeactivate
}) => {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const cvsRef = useRef<HTMLCanvasElement>(null);
  const trkRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);

  // Active state ref to avoid stale closures in RAF
  const isLiveRef = useRef(false);
  isLiveRef.current = isRevealed;

  // Viewport visibility ref for pausing off-screen canvas loops
  const isInViewportRef = useRef(true);

  // Metric animated display values initialized with target values
  const [metricValues, setMetricValues] = useState<string[]>(() =>
    data.metrics.map((m) => m.formattedValue || m.value.toLocaleString())
  );

  // Timer & RAF tracking for garbage-collection
  const timeoutsRef = useRef<number[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const scrambleRafRef = useRef<number | null>(null);

  const clearAllTimers = useCallback(() => {
    timeoutsRef.current.forEach((id) => window.clearTimeout(id));
    timeoutsRef.current = [];
    if (scrambleRafRef.current) {
      cancelAnimationFrame(scrambleRafRef.current);
      scrambleRafRef.current = null;
    }
  }, []);

  // Resize canvas according to card dimensions and DPR
  const resizeCanvas = useCallback(() => {
    const cvs = cvsRef.current;
    const card = cardRef.current;
    if (!cvs || !card) return;

    const rect = card.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    cvs.width = rect.width * dpr;
    cvs.height = rect.height * dpr;
    cvs.style.width = `${rect.width}px`;
    cvs.style.height = `${rect.height}px`;

    const ctx = cvs.getContext('2d');
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }, []);

  // Scramble status decoder effect
  const scrambleStatus = useCallback((finalText: string, durationMs = 550) => {
    if (scrambleRafRef.current) {
      cancelAnimationFrame(scrambleRafRef.current);
      scrambleRafRef.current = null;
    }

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#';
    const start = performance.now();
    const len = finalText.length;

    const tick = (now: number) => {
      if (!statusRef.current) return;
      const progress = Math.min((now - start) / durationMs, 1);
      const solved = Math.floor(progress * len);
      let out = '';
      for (let i = 0; i < len; i++) {
        if (i < solved) {
          out += finalText[i];
        } else {
          out += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      statusRef.current.textContent = out;
      if (progress < 1 && isLiveRef.current) {
        scrambleRafRef.current = requestAnimationFrame(tick);
      } else if (statusRef.current) {
        statusRef.current.textContent = finalText;
        scrambleRafRef.current = null;
      }
    };
    scrambleRafRef.current = requestAnimationFrame(tick);
  }, []);

  // Numeric count-up easing
  const animateCounter = useCallback(
    (index: number, target: number, formattedTarget: string | undefined, durationMs: number, delayMs: number) => {
      const timerId = window.setTimeout(() => {
        if (!isLiveRef.current) return;
        const start = performance.now();
        const tick = (now: number) => {
          if (!isLiveRef.current) return;
          const p = Math.min((now - start) / durationMs, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const currentVal = Math.round(target * eased);

          setMetricValues((prev) => {
            const next = [...prev];
            if (p >= 1 && formattedTarget) {
              next[index] = formattedTarget;
            } else {
              next[index] = currentVal.toLocaleString();
            }
            return next;
          });

          if (p < 1) {
            requestAnimationFrame(tick);
          }
        };
        requestAnimationFrame(tick);
      }, delayMs);

      timeoutsRef.current.push(timerId);
    },
    []
  );

  // Trigger ignition sequence when isRevealed becomes true
  const triggerLive = useCallback(() => {
    clearAllTimers();

    // Scramble status
    scrambleStatus(data.statusActive || 'ACTIVE', 320);

    // Reset counters to 0, then animate count-up
    setMetricValues(data.metrics.map(() => '0'));
    data.metrics.forEach((m, idx) => {
      animateCounter(idx, m.value, m.formattedValue, 550 + idx * 80, 120 + idx * 50);
    });
  }, [data.statusActive, data.metrics, clearAllTimers, scrambleStatus, animateCounter]);

  // Reset to stealth standby when isRevealed becomes false
  const resetStandby = useCallback(() => {
    clearAllTimers();
    if (statusRef.current) {
      statusRef.current.textContent = data.statusStandby || 'STANDBY';
    }
    setMetricValues(data.metrics.map((m) => m.formattedValue || m.value.toLocaleString()));
  }, [clearAllTimers, data.statusStandby, data.metrics]);

  // Synchronize state with isRevealed prop
  useEffect(() => {
    if (isRevealed) {
      triggerLive();
    } else {
      resetStandby();
    }
  }, [isRevealed, triggerLive, resetStandby]);

  // Navigate to topic
  const handleNavigate = () => {
    navigate(`/topics/${data.slug}`);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleNavigate();
    }
  };

  // Canvas particle simulation with visibility & viewport pauses
  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    resizeCanvas();
    const handleResize = () => resizeCanvas();
    window.addEventListener('resize', handleResize);

    const cvs = cvsRef.current;
    if (!cvs || isReducedMotion) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;

    const getW = () => cvs.width / Math.min(window.devicePixelRatio || 1, 2);
    const getH = () => cvs.height / Math.min(window.devicePixelRatio || 1, 2);

    // 40 particles per card for smooth 60fps performance
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      a: number;
      ta: number;
      phase: number;
    }> = [];

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * (getW() || 560),
        y: Math.random() * (getH() || 500),
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.2 + 0.3,
        a: 0,
        ta: Math.random() * 0.2 + 0.04,
        phase: Math.random() * Math.PI * 2
      });
    }

    let streams: Array<{
      x: number;
      y: number;
      speed: number;
      a: number;
      r: number;
      trail: Array<{ x: number; y: number; a: number }>;
    }> = [];

    let time = 0;

    const render = () => {
      if (!isInViewportRef.current) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      time += 0.016;
      const w = getW();
      const h = getH();
      ctx.clearRect(0, 0, w, h);

      // Determine real DOM position of the track line relative to the canvas
      let pipeY = h * 0.46;
      let pipeLeft = 36;
      let pipeRight = w - 36;

      if (trkRef.current && cardRef.current) {
        const trkRect = trkRef.current.getBoundingClientRect();
        const cardRect = cardRef.current.getBoundingClientRect();
        pipeY = trkRect.top + trkRect.height / 2 - cardRect.top;
        pipeLeft = trkRect.left - cardRect.left;
        pipeRight = trkRect.right - cardRect.left;
      }

      const attractors = [
        { x: pipeLeft, y: pipeY },
        { x: pipeLeft + (pipeRight - pipeLeft) * 0.25, y: pipeY },
        { x: pipeLeft + (pipeRight - pipeLeft) * 0.5, y: pipeY },
        { x: pipeLeft + (pipeRight - pipeLeft) * 0.75, y: pipeY },
        { x: pipeRight, y: pipeY }
      ];

      const live = isLiveRef.current;

      // Update & render particles
      for (let pIdx = 0; pIdx < particles.length; pIdx++) {
        const p = particles[pIdx];
        if (live && p.a < p.ta) p.a += 0.008;
        if (!live && p.a < p.ta * 0.25) p.a += 0.001;
        if (!live && p.a > p.ta * 0.25) p.a -= 0.002;

        p.x += p.vx + Math.sin(time * 0.5 + p.phase) * 0.04;
        p.y += p.vy + Math.cos(time * 0.4 + p.phase) * 0.04;

        if (live) {
          for (let aIdx = 0; aIdx < attractors.length; aIdx++) {
            const att = attractors[aIdx];
            const dx = att.x - p.x;
            const dy = att.y - p.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < 110 && d > 18) {
              p.vx += (dx / d) * 0.003;
              p.vy += (dy / d) * 0.003;
            }
          }
          p.vx *= 0.998;
          p.vy *= 0.998;
        }

        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        if (p.a > 0.002) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.a.toFixed(3)})`;
          ctx.fill();
        }
      }

      if (live) {
        // Constellation lines within 80px (rendered ONLY for active card)
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < 80) {
              const alpha = (1 - d / 80) * 0.045 * Math.min(particles[i].a, particles[j].a) * 12;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(alpha, 0.07).toFixed(4)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }

        // Fast traveling stream packets along the pipeline track
        for (let sIdx = 0; sIdx < streams.length; sIdx++) {
          const s = streams[sIdx];
          s.x += s.speed;
          s.trail.push({ x: s.x, y: s.y, a: s.a });
          if (s.trail.length > 8) s.trail.shift();
          for (let t = 0; t < s.trail.length; t++) {
            const tr = s.trail[t];
            const fade = (t / s.trail.length) * tr.a;
            ctx.beginPath();
            ctx.arc(tr.x, tr.y, s.r * (0.4 + (0.6 * t) / s.trail.length), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${fade.toFixed(3)})`;
            ctx.fill();
          }
        }

        streams = streams.filter((s) => s.x < pipeRight);

        if (Math.random() < 0.16) {
          streams.push({
            x: pipeLeft,
            y: pipeY + (Math.random() - 0.5) * 4,
            speed: Math.random() * 2.2 + 1.8,
            a: 0.25 + Math.random() * 0.35,
            r: Math.random() * 1.4 + 0.5,
            trail: []
          });
        }
      } else {
        streams = [];
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [resizeCanvas]);

  // Clean all timers on component unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--spotlight-x', `${x}px`);
    card.style.setProperty('--spotlight-y', `${y}px`);
  }, []);

  return (
    <div
      ref={cardRef}
      role="article"
      tabIndex={0}
      aria-label={`Engineering topic: ${data.name}`}
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onMouseMove={handleMouseMove}
      className={`sts-cinematic-card ${isRevealed ? 'live' : 'breathing'}`}
    >
      {/* Background Canvas for Particle Physics */}
      <canvas ref={cvsRef} className="sts-card-cvs" />

      {/* Grid Pattern Overlay */}
      <div className="sts-grid-bg" />

      {/* Vignette Overlay */}
      <div className="sts-vignette" />

      {/* Inset Border Pulse & Flash */}
      <div className="sts-border-glow" />

      {/* Specular Sweep Scanline */}
      <div className="sts-scanline" />

      {/* Top Border Laser Streak */}
      <div className="sts-topline">
        <b />
      </div>

      {/* CARD CONTENT LAYER */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Top Status Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div className="sts-status" style={{ margin: 0 }}>
            <div className="sts-status-dot" />
            <span ref={statusRef} className="sts-status-text" aria-live="polite">
              {data.statusStandby || 'STANDBY'}
            </span>
          </div>
          {data.badge && (
            <span className="sts-card-badge">{data.badge}</span>
          )}
        </div>

        {/* Title Wrap: Word-Safe Kinetic Character Reveal */}
        <div className="sts-title-wrap">
          <h3 ref={titleRef} className="sts-title">
            {(() => {
              let charIndex = 0;
              return data.name.split(' ').map((word, wIdx, arr) => (
                <span key={wIdx} className="word">
                  {word.split('').map((char, cIdx) => {
                    const ci = charIndex++;
                    return (
                      <span key={cIdx} className="ch" style={{ '--ci': ci } as React.CSSProperties}>
                        {char}
                      </span>
                    );
                  })}
                  {wIdx < arr.length - 1 && (
                    <span
                      className="ch"
                      style={{ '--ci': charIndex++, width: '8px' } as React.CSSProperties}
                    >
                      &nbsp;
                    </span>
                  )}
                </span>
              ));
            })()}
          </h3>
        </div>

        {/* Subtitle Hook */}
        <p className="sts-sub">{data.scopeParagraph || data.hook}</p>

        {/* Verified Fact Callout */}
        {data.verifiedFact && (
          <div className="sts-card-fact">
            <strong>VERIFIED BENCHMARK</strong>
            {data.verifiedFact}
          </div>
        )}

        {/* 5-Node Kinetic Pipeline */}
        <div className="sts-pipeline">
          <div ref={trkRef} className="sts-trk">
            <div className="sts-trk-bg" />
            <div className="sts-trk-fill" />
            <div className="sts-trk-glow" />
          </div>

          <div className="sts-nodes">
            {data.nodes.map((node, nIdx) => {
              const NodeIcon = node.icon;
              return (
                <div key={nIdx} className="sts-nd">
                  <div className="sts-nd-ring">
                    <div className="sts-rng-o" />
                    <div className="sts-rng-i" />
                    <div className="sts-nd-pulse" />
                    <div className="sts-nd-dot">
                      <NodeIcon size={22} />
                    </div>
                  </div>
                  <div className="sts-nd-lbl">{node.label}</div>
                  <div className="sts-nd-tip">{node.tooltip}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="sts-mets">
          {data.metrics.map((m, mIdx) => (
            <div key={mIdx} className="sts-met">
              <div className="sts-met-l">{m.label}</div>
              <div className="sts-met-v">
                <span>{metricValues[mIdx]}</span>
                <span className="sts-met-u">{m.unit}</span>
              </div>
              <div className="sts-met-bar">
                <div
                  className="sts-met-bar-fill"
                  style={{ '--bar-target': `${m.barPct}%` } as React.CSSProperties}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Mechanism Pills */}
        {data.mechanismPills && data.mechanismPills.length > 0 && (
          <div className="sts-card-pills">
            {data.mechanismPills.map((pill, idx) => (
              <span key={idx} className="sts-card-pill">
                {pill}
              </span>
            ))}
          </div>
        )}

        {/* Footer Bar */}
        <div className="sts-foot">
          <div className="sts-stats-grp">
            <div className="sts-st">
              <FileText size={13} />
              <span>{data.articlesCount} articles</span>
            </div>
            <div className="sts-st">
              <Clock size={13} />
              <span>{data.readTime}</span>
            </div>
          </div>

          <div className="sts-arr-btn" aria-hidden="true">
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </div>
  );
};
