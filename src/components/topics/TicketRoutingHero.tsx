import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { TopicData } from '../../data/topics';
import { ArrowLeft, Play, RotateCcw, AlertTriangle, Plus, ChevronDown, CheckCircle2, Bot } from 'lucide-react';
import styles from '../../styles/ticketRoutingHero.module.css';

interface TicketRoutingHeroProps {
  topic: TopicData;
}

type RoutingStage =
  | 'idle'
  | 's1_triage'
  | 's2_ai_deflect'
  | 's3_heap_sort'
  | 's4_skill_dispatch'
  | 's5_resolved'
  | 'completed';

interface SimTicket {
  id: string;
  customer: string;
  tier: 'Enterprise' | 'Pro' | 'Standard' | 'Critical';
  slaMinutesRemaining: number;
  initialOrder: number;
  targetOrder: number;
  currentYOffset: number;
  isDeflected?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
  phase: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  r: number;
  color?: string;
}

export const TicketRoutingHero: React.FC<TicketRoutingHeroProps> = ({ topic }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initial Ticket Roster
  const initialTickets: SimTicket[] = [
    { id: 'TCK-801', customer: 'Acme Global (VIP)', tier: 'Enterprise', slaMinutesRemaining: 18, initialOrder: 0, targetOrder: 1, currentYOffset: 0 },
    { id: 'TCK-802', customer: 'Starlight Retail', tier: 'Standard', slaMinutesRemaining: 140, initialOrder: 1, targetOrder: 3, currentYOffset: 0 },
    { id: 'TCK-803', customer: 'Vanguard FinTech', tier: 'Enterprise', slaMinutesRemaining: 4, initialOrder: 2, targetOrder: 0, currentYOffset: 0 },
    { id: 'TCK-804', customer: 'Nexus Cloud', tier: 'Pro', slaMinutesRemaining: 55, initialOrder: 3, targetOrder: 2, currentYOffset: 0 }
  ];

  // Routing State
  const [routingStage, setRoutingStage] = useState<RoutingStage>('idle');
  const [isSorted, setIsSorted] = useState<boolean>(false);
  const [aiDeflectionEnabled, setAiDeflectionEnabled] = useState<boolean>(true);
  const [activeStageToken, setActiveStageToken] = useState<string>('STANDBY');
  const [tickerMessage, setTickerMessage] = useState<string>(
    'Priority queue on standby. 4 omnichannel tickets awaiting SLA heap sort.'
  );
  const [ticketList, setTicketList] = useState<SimTicket[]>(initialTickets);
  const [hasInjectedUrgent, setHasInjectedUrgent] = useState<boolean>(false);

  // Animation Refs
  const stageRef = useRef<RoutingStage>('idle');
  const sortedRef = useRef<boolean>(false);
  const animTimeRef = useRef<number>(0);
  const sparksRef = useRef<Spark[]>([]);

  useEffect(() => {
    stageRef.current = routingStage;
  }, [routingStage]);

  useEffect(() => {
    sortedRef.current = isSorted;
  }, [isSorted]);

  // Reset Engine
  const handleReset = () => {
    setRoutingStage('idle');
    stageRef.current = 'idle';
    setIsSorted(false);
    sortedRef.current = false;
    setHasInjectedUrgent(false);
    setTicketList(initialTickets);
    setActiveStageToken('STANDBY');
    setTickerMessage('Queue scheduler reset. Omnichannel tickets restored to arrival order.');
    sparksRef.current = [];
  };

  // Trigger SLA Routing Run
  const handleApplyRouting = () => {
    if (routingStage !== 'idle' && routingStage !== 'completed') return;

    setRoutingStage('s1_triage');
    stageRef.current = 's1_triage';
    setActiveStageToken('01 // TRIAGE');
    setTickerMessage('Omnichannel ingress: Parsing ticket payloads across Email, Chat, and API webhooks.');
  };

  // Inject Urgent 2m Ticket Live
  const handleInjectUrgent = () => {
    if (hasInjectedUrgent) return;

    const urgentTicket: SimTicket = {
      id: 'TCK-999',
      customer: 'Apex Capital (Critical)',
      tier: 'Critical',
      slaMinutesRemaining: 2,
      initialOrder: ticketList.length,
      targetOrder: 0,
      currentYOffset: 0
    };

    setHasInjectedUrgent(true);
    setTicketList((prev) => [urgentTicket, ...prev]);
    setActiveStageToken('⚠️ URGENT INJECT');
    setTickerMessage(
      'Contractual SLA Alert: Apex Capital (2m SLA remaining) injected! Preempts queue to position #0.'
    );

    // Spawn warning sparks
    for (let i = 0; i < 15; i++) {
      const angle = (Math.random() - 0.5) * Math.PI;
      const spd = Math.random() * 3 + 1;
      sparksRef.current.push({
        x: 350,
        y: 120,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        r: Math.random() * 2 + 1,
        alpha: 1,
        color: '#E5A93C'
      });
    }
  };

  // State Transition Sequence
  useEffect(() => {
    if (routingStage === 'idle' || routingStage === 'completed') return;

    let timer: ReturnType<typeof setTimeout>;

    if (routingStage === 's1_triage') {
      timer = setTimeout(() => {
        setRoutingStage('s2_ai_deflect');
        setActiveStageToken('02 // AI DEFLECTION');
        if (aiDeflectionEnabled) {
          setTickerMessage('Conversational AI Layer: Deflecting 41.2% standard FAQ & password queries autonomously.');
        } else {
          setTickerMessage('Conversational AI Bypassed: All raw tickets escalated directly to human tier queues.');
        }
      }, 650);
    } else if (routingStage === 's2_ai_deflect') {
      timer = setTimeout(() => {
        setRoutingStage('s3_heap_sort');
        setIsSorted(true);
        sortedRef.current = true;
        setActiveStageToken('03 // HEAP REORDER');
        setTickerMessage('Dynamic Priority Queue: Evaluating (Contract Weight ÷ SLA Minutes). Vanguard FinTech (4m) surges to #1.');
      }, 700);
    } else if (routingStage === 's3_heap_sort') {
      timer = setTimeout(() => {
        setRoutingStage('s4_skill_dispatch');
        setActiveStageToken('04 // SKILL DISPATCH');
        setTickerMessage('Matching engineer skill tags: TCK-803 dispatched to L3 Senior Escalations Engineer.');
      }, 750);
    } else if (routingStage === 's4_skill_dispatch') {
      timer = setTimeout(() => {
        setRoutingStage('completed');
        setActiveStageToken('SLA 100% PRESERVED');
        setTickerMessage('All queues cleared within contractual windows. Zero breach penalties. First contact resolution: 94.2%.');
      }, 800);
    }

    return () => clearTimeout(timer);
  }, [routingStage, aiDeflectionEnabled]);

  // Main Canvas Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    // 45 Ambient Stardust Particles matching Topic Hub contrast
    const particles: Particle[] = [];
    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * 1100,
        y: Math.random() * 320,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.2 + 0.35,
        a: 0.15 + Math.random() * 0.25,
        phase: Math.random() * Math.PI * 2
      });
    }

    const render = () => {
      animTimeRef.current += 0.016;
      const t = animTimeRef.current;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayW = canvas.clientWidth;
      const displayH = canvas.clientHeight;

      if (canvas.width !== displayW * dpr || canvas.height !== displayH * dpr) {
        canvas.width = displayW * dpr;
        canvas.height = displayH * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      const W = displayW;
      const H = displayH;

      ctx.clearRect(0, 0, W, H);

      // Node Geometry across the Service Switchboard
      const nIngress = { x: W * 0.12, y: H * 0.50, label: 'OMNICHANNEL', sub: 'Email / Chat / API' };
      const nBot = { x: W * 0.32, y: H * 0.50, label: 'AI DEFLECTION', sub: 'Triage Gate (41.2%)' };
      const nQueue = { x: W * 0.55, y: H * 0.50, label: 'SLA MIN-HEAP', sub: 'Priority Reorder' };
      const nDispatch = { x: W * 0.76, y: H * 0.50, label: 'SKILL ROUTING', sub: 'L1/L2/VIP Desks' };
      const nResolved = { x: W * 0.91, y: H * 0.50, label: 'SLA RESOLUTION', sub: 'Zero Breach Settle' };

      const curStage = stageRef.current;
      const sorted = sortedRef.current;

      // -------------------------------------------------------------
      // 1. PARTICLES
      // -------------------------------------------------------------
      for (let pIdx = 0; pIdx < particles.length; pIdx++) {
        const p = particles[pIdx];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        const pulse = 0.5 + 0.5 * Math.sin(t * 1.5 + p.phase);
        ctx.fillStyle = `rgba(255, 255, 255, ${(p.a * (0.6 + 0.4 * pulse)).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // -------------------------------------------------------------
      // 2. CONNECTING CHANNELS & PIPELINES
      // -------------------------------------------------------------
      // Main Forward Rail
      ctx.beginPath();
      ctx.moveTo(nIngress.x, nIngress.y);
      ctx.lineTo(nResolved.x, nResolved.y);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      if (curStage !== 'idle') {
        ctx.beginPath();
        ctx.moveTo(nIngress.x, nIngress.y);
        ctx.lineTo(nResolved.x, nResolved.y);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      // Upper Autonomous AI Deflection Conduit
      ctx.beginPath();
      ctx.moveTo(nBot.x, nBot.y - 15);
      ctx.bezierCurveTo(
        nBot.x, H * 0.18,
        nQueue.x - 30, H * 0.18,
        nQueue.x + 40, H * 0.20
      );
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = '8.5px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.textAlign = 'left';
      ctx.fillText('AUTONOMOUS AI RESOLUTION // 41.2% DEFLECTION', nBot.x + 10, H * 0.16);

      // -------------------------------------------------------------
      // 3. PRIORITY QUEUE LADDER VISUALIZATION (at nQueue)
      // -------------------------------------------------------------
      const queueYStart = H * 0.28;
      const rowHeight = 24;
      const queueBoxW = 140;

      // Draw Queue Stack Container
      ctx.fillStyle = 'rgba(14, 16, 18, 0.6)';
      ctx.fillRect(nQueue.x - queueBoxW / 2, queueYStart - 14, queueBoxW, 4 * rowHeight + 20);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.strokeRect(nQueue.x - queueBoxW / 2, queueYStart - 14, queueBoxW, 4 * rowHeight + 20);

      // Queue Header
      ctx.font = '8px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.textAlign = 'center';
      ctx.fillText(sorted ? 'PRIORITY HEAP [SORTED]' : 'ARRIVAL FIFO [UNSORTED]', nQueue.x, queueYStart - 4);

      // Display Tickets in Queue
      const displayQueue = sorted
        ? [
            { id: 'TCK-803', name: 'Vanguard', sla: '4m', tier: 'Ent', urgent: true },
            { id: 'TCK-801', name: 'Acme VIP', sla: '18m', tier: 'Ent', urgent: false },
            { id: 'TCK-804', name: 'Nexus', sla: '55m', tier: 'Pro', urgent: false },
            { id: 'TCK-802', name: 'Starlight', sla: '140m', tier: 'Std', urgent: false }
          ]
        : [
            { id: 'TCK-801', name: 'Acme VIP', sla: '18m', tier: 'Ent', urgent: false },
            { id: 'TCK-802', name: 'Starlight', sla: '140m', tier: 'Std', urgent: false },
            { id: 'TCK-803', name: 'Vanguard', sla: '4m', tier: 'Ent', urgent: true },
            { id: 'TCK-804', name: 'Nexus', sla: '55m', tier: 'Pro', urgent: false }
          ];

      displayQueue.forEach((item, rIdx) => {
        const itemY = queueYStart + 10 + rIdx * rowHeight;

        // Row background
        ctx.fillStyle = item.urgent
          ? 'rgba(229, 169, 60, 0.12)'
          : rIdx % 2 === 0
          ? 'rgba(255, 255, 255, 0.03)'
          : 'rgba(255, 255, 255, 0.01)';
        ctx.fillRect(nQueue.x - queueBoxW / 2 + 4, itemY - 9, queueBoxW - 8, rowHeight - 4);

        if (item.urgent) {
          ctx.strokeStyle = 'rgba(229, 169, 60, 0.5)';
          ctx.strokeRect(nQueue.x - queueBoxW / 2 + 4, itemY - 9, queueBoxW - 8, rowHeight - 4);
        }

        // Rank
        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.fillStyle = item.urgent ? '#E5A93C' : 'rgba(255, 255, 255, 0.5)';
        ctx.textAlign = 'left';
        ctx.fillText(`#${rIdx + 1}`, nQueue.x - queueBoxW / 2 + 8, itemY + 3);

        // Name
        ctx.font = '600 9px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = item.urgent ? '#FFFFFF' : 'rgba(237, 233, 227, 0.85)';
        ctx.fillText(item.name, nQueue.x - queueBoxW / 2 + 26, itemY + 3);

        // SLA remaining badge
        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.fillStyle = item.urgent ? '#E5A93C' : 'rgba(255, 255, 255, 0.6)';
        ctx.textAlign = 'right';
        ctx.fillText(item.sla, nQueue.x + queueBoxW / 2 - 8, itemY + 3);
      });

      // -------------------------------------------------------------
      // 4. DRAW NODES
      // -------------------------------------------------------------
      const nodes = [nIngress, nBot, nQueue, nDispatch, nResolved];

      nodes.forEach((n, idx) => {
        const isCurrentActive =
          (curStage === 's1_triage' && idx === 0) ||
          (curStage === 's2_ai_deflect' && idx === 1) ||
          (curStage === 's3_heap_sort' && idx === 2) ||
          (curStage === 's4_skill_dispatch' && idx === 3) ||
          (curStage === 'completed' && idx === 4);

        const isPassed =
          (curStage === 'completed') ||
          (curStage === 's4_skill_dispatch' && idx < 4) ||
          (curStage === 's3_heap_sort' && idx < 3) ||
          (curStage === 's2_ai_deflect' && idx < 2) ||
          (curStage === 's1_triage' && idx < 1);

        if (isCurrentActive) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, 22 + Math.sin(t * 4) * 2.5, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, 16, 0, Math.PI * 2);
        ctx.fillStyle = '#080808';
        ctx.fill();

        ctx.strokeStyle = isPassed || isCurrentActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.22)';
        ctx.lineWidth = isPassed || isCurrentActive ? 1.5 : 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(n.x, n.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = isPassed || isCurrentActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.25)';
        ctx.fill();

        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.textAlign = 'center';
        ctx.fillText(`0${idx + 1}`, n.x, n.y - 25);

        ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = isPassed || isCurrentActive ? '#FFFFFF' : 'rgba(237, 233, 227, 0.7)';
        ctx.fillText(n.label, n.x, n.y + 32);

        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(237, 233, 227, 0.45)';
        ctx.fillText(n.sub, n.x, n.y + 45);
      });

      // -------------------------------------------------------------
      // 5. SPARKS
      // -------------------------------------------------------------
      for (let sIdx = sparksRef.current.length - 1; sIdx >= 0; sIdx--) {
        const spk = sparksRef.current[sIdx];
        spk.x += spk.vx;
        spk.y += spk.vy;
        spk.vy += 0.05;
        spk.alpha *= 0.93;
        if (spk.alpha <= 0.02) {
          sparksRef.current.splice(sIdx, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(spk.x, spk.y, spk.r, 0, Math.PI * 2);
        ctx.fillStyle = spk.color || `rgba(255, 255, 255, ${spk.alpha.toFixed(2)})`;
        ctx.fill();
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <section className={styles.heroContainer} ref={containerRef}>
      <div className={styles.vignetteOverlay} />

      <div className={styles.contentWrapper}>
        {/* Navigation Breadcrumb */}
        <div className={styles.breadcrumbRow}>
          <Link to="/topics" className={styles.breadcrumbLink} title="Return to Topic Index">
            <ArrowLeft size={12} />
            <span>All Domains</span>
          </Link>
          <span className={styles.breadcrumbDivider}>//</span>
          <span className={styles.breadcrumbTag}>{topic.badge}: {topic.name.toUpperCase()}</span>
        </div>

        {/* Minimal Editorial Header */}
        <div className={styles.headerArea}>
          <h1 className={styles.headline}>{topic.name}</h1>
          <p className={styles.hookText}>{topic.hook}</p>
        </div>

        {/* Central Living Ticket Routing Stage */}
        <div className={styles.stageWrapper}>
          <div className={styles.canvasViewport}>
            <canvas ref={canvasRef} className={styles.routingCanvas} />
          </div>

          {/* Integrated Modern Instrument Ribbon */}
          <div className={styles.instrumentRibbon}>
            {/* Left: Telemetry Capsule */}
            <div className={styles.telemetryArea}>
              <div
                className={`${styles.telemetryDot} ${
                  hasInjectedUrgent
                    ? styles.telemetryDotEscalated
                    : routingStage !== 'idle'
                    ? styles.telemetryDotActive
                    : ''
                }`}
              />
              <span className={styles.telemetryToken}>{activeStageToken}</span>
              <span className={styles.telemetryDivider}>—</span>
              <span className={styles.telemetryText}>{tickerMessage}</span>
            </div>

            {/* Right: Direct Precision Controls */}
            <div className={styles.controlsArea}>
              {/* Deflection Rate Capsule */}
              <div className={styles.deflectPill} title="Industry median conversational AI deflection benchmark">
                <Bot size={11} />
                <span>DEFLECTION:</span>
                <span className={styles.deflectVal}>41.2%</span>
              </div>

              {/* AI Deflection Toggle */}
              <button
                type="button"
                className={`${styles.toggleBtn} ${aiDeflectionEnabled ? styles.toggleBtnActive : ''}`}
                onClick={() => setAiDeflectionEnabled(!aiDeflectionEnabled)}
                disabled={routingStage !== 'idle' && routingStage !== 'completed'}
                title="Toggle conversational AI autonomous deflection layer"
              >
                <div className={styles.toggleDot} />
                <span>{aiDeflectionEnabled ? 'AI Deflection: ON' : 'AI Deflection: OFF'}</span>
              </button>

              {/* Inject Urgent Ticket Button */}
              <button
                type="button"
                className={styles.injectButton}
                onClick={handleInjectUrgent}
                disabled={hasInjectedUrgent}
                title="Simulate sudden arrival of a 2m contractual SLA breach ticket"
              >
                <Plus size={11} />
                <span>+ Urgent 2m SLA</span>
              </button>

              {/* Route Action Button */}
              <button
                type="button"
                className={styles.routeButton}
                onClick={handleApplyRouting}
                title="Dispatch SLA Priority Routing Algorithm"
              >
                <Play size={11} fill="currentColor" />
                <span>Dispatch Routing</span>
              </button>

              {/* Reset Button */}
              <button
                type="button"
                className={styles.resetButton}
                onClick={handleReset}
                title="Reset ticket queue and restore FIFO arrival order"
              >
                <RotateCcw size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Minimal Scroll Cue at base */}
        <div className={styles.scrollCueWrapper}>
          <button
            type="button"
            className={styles.scrollCueBtn}
            onClick={() => {
              const el = document.getElementById('topic-articles');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            title="Scroll to articles"
          >
            <span>Explore 5 Articles</span>
            <ChevronDown size={13} className={styles.scrollChevron} />
          </button>
        </div>
      </div>
    </section>
  );
};
