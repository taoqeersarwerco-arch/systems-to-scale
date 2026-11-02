import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { TopicData } from '../../data/topics';
import { ArrowLeft, Play, RotateCcw, ShieldCheck, Zap, ChevronDown, CheckCircle2, Lock } from 'lucide-react';
import styles from '../../styles/paymentSettlementHero.module.css';

interface PaymentSettlementHeroProps {
  topic: TopicData;
}

type ClearingStage =
  | 'idle'
  | 's1_ingress'
  | 's2_idemp_lock'
  | 's3_3ds_verify'
  | 's4_scheme_route'
  | 's5_auth_hold'
  | 's6_settle_webhook'
  | 'completed';

interface Ripple {
  x: number;
  y: number;
  r: number;
  maxR: number;
  alpha: number;
  color?: string;
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

interface TransitPacket {
  id: string;
  isDuplicate: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  targetX: number;
  targetY: number;
  progress: number; // 0 to 1
  speed: number;
  stageIndex: number;
  deflected: boolean;
  deflectionProgress?: number;
  trail: Array<{ x: number; y: number; a: number }>;
}

export const PaymentSettlementHero: React.FC<PaymentSettlementHeroProps> = ({ topic }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Clearinghouse Simulation State
  const [clearingStage, setClearingStage] = useState<ClearingStage>('idle');
  const [idempotencyKey, setIdempotencyKey] = useState<string>(
    () => `idemp_${Math.random().toString(36).substring(2, 10)}`
  );
  const [isChallengeMode, setIsChallengeMode] = useState<boolean>(false);
  const [activeStageToken, setActiveStageToken] = useState<string>('STANDBY');
  const [tickerMessage, setTickerMessage] = useState<string>(
    'Payment clearinghouse on standby. Idempotent double-charge guard armed.'
  );
  const [clickCount, setClickCount] = useState<number>(0);
  const [duplicateDeflected, setDuplicateDeflected] = useState<boolean>(false);
  const [authTxId, setAuthTxId] = useState<string>('tx_auth_pending');

  // Animation Refs
  const stageRef = useRef<ClearingStage>('idle');
  const stageStartTimeRef = useRef<number>(0);
  const challengeRef = useRef<boolean>(false);
  const animTimeRef = useRef<number>(0);
  const ripplesRef = useRef<Ripple[]>([]);
  const sparksRef = useRef<Spark[]>([]);
  const packetsRef = useRef<TransitPacket[]>([]);
  const lockActiveRef = useRef<boolean>(false);

  useEffect(() => {
    stageRef.current = clearingStage;
    stageStartTimeRef.current = performance.now();
  }, [clearingStage]);

  useEffect(() => {
    challengeRef.current = isChallengeMode;
  }, [isChallengeMode]);

  // Reset Engine
  const handleReset = () => {
    setClearingStage('idle');
    stageRef.current = 'idle';
    const newKey = `idemp_${Math.random().toString(36).substring(2, 10)}`;
    setIdempotencyKey(newKey);
    setClickCount(0);
    setDuplicateDeflected(false);
    lockActiveRef.current = false;
    setActiveStageToken('STANDBY');
    setTickerMessage('Simulation reset. Fresh UUID idempotency key generated. Ledger clean.');
    ripplesRef.current = [];
    sparksRef.current = [];
    packetsRef.current = [];
  };

  // Launch a Payment Packet along the Corridor
  const dispatchPacket = (isDup: boolean, delayMs = 0) => {
    setTimeout(() => {
      const newPacket: TransitPacket = {
        id: `pkt_${Math.random().toString(36).substring(2, 8)}`,
        isDuplicate: isDup,
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        targetX: 0,
        targetY: 0,
        progress: 0,
        speed: 0.024,
        stageIndex: 0,
        deflected: false,
        trail: []
      };
      packetsRef.current.push(newPacket);
    }, delayMs);
  };

  // Submit Payment Action (Supports live user double-clicking!)
  const handleSubmitPayment = () => {
    const nextCount = clickCount + 1;
    setClickCount(nextCount);

    if (stageRef.current === 'idle' || stageRef.current === 'completed') {
      // First fresh execution
      setClearingStage('s1_ingress');
      stageRef.current = 's1_ingress';
      setActiveStageToken('01 // INGRESS');
      setTickerMessage(`POST /v1/charges ($149.00) dispatched with Idempotency-Key: ${idempotencyKey}`);
      lockActiveRef.current = true;
      setDuplicateDeflected(false);
      dispatchPacket(false);
    } else {
      // User clicked while a transaction is in-flight!
      setDuplicateDeflected(true);
      setActiveStageToken('⚠️ DUP DEFLECTED');
      setTickerMessage(
        `Rapid duplicate click #${nextCount} detected! Idempotency key already locked in Redis (120s TTL). Bypassing bank.`
      );
      dispatchPacket(true);
    }
  };

  // Stress-test Double-Click trigger
  const handleDoubleClickTest = () => {
    if (stageRef.current !== 'idle' && stageRef.current !== 'completed') return;

    setClickCount(2);
    setClearingStage('s1_ingress');
    stageRef.current = 's1_ingress';
    setActiveStageToken('01 // INGRESS');
    setTickerMessage(`Double-Click Stress Test: Firing 2 simultaneous packets with Idempotency-Key: ${idempotencyKey}`);
    lockActiveRef.current = true;
    setDuplicateDeflected(true);

    // Primary packet
    dispatchPacket(false, 0);
    // Duplicate packet spaced 160ms behind
    dispatchPacket(true, 160);
  };

  // Automated Sequential State Progression
  useEffect(() => {
    if (clearingStage === 'idle' || clearingStage === 'completed') return;

    let timer: ReturnType<typeof setTimeout>;

    if (clearingStage === 's1_ingress') {
      timer = setTimeout(() => {
        setClearingStage('s2_idemp_lock');
        setActiveStageToken('02 // IDEMP LOCK');
        setTickerMessage(`Idempotency key ${idempotencyKey} locked in Redis with 120s atomic SETNX lock.`);
      }, 550);
    } else if (clearingStage === 's2_idemp_lock') {
      timer = setTimeout(() => {
        setClearingStage('s3_3ds_verify');
        setActiveStageToken(challengeRef.current ? '03 // 3DS STEP-UP' : '03 // 3DS FRICTIONLESS');
        if (challengeRef.current) {
          setTickerMessage('3DS 2.2 Risk Engine: Biometric challenge step-up required. SCA cryptographic OTP verified.');
        } else {
          setTickerMessage('3DS 2.2 Risk Engine: Trusted device fingerprint recognized. Frictionless exemption granted.');
        }
      }, challengeRef.current ? 950 : 600);
    } else if (clearingStage === 's3_3ds_verify') {
      timer = setTimeout(() => {
        setClearingStage('s4_scheme_route');
        setActiveStageToken('04 // SCHEME ROUTE');
        setTickerMessage('Switching payload to ISO 8583 0100 Authorization Request over Visa / Mastercard rails.');
      }, 650);
    } else if (clearingStage === 's4_scheme_route') {
      timer = setTimeout(() => {
        setClearingStage('s5_auth_hold');
        setActiveStageToken('05 // AUTH HOLD');
        const tx = `auth_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        setAuthTxId(tx);
        setTickerMessage(`Issuing bank approved $149.00 authorization hold. Funds escrowed. Ref: ${tx}.`);
      }, 700);
    } else if (clearingStage === 's5_auth_hold') {
      timer = setTimeout(() => {
        setClearingStage('s6_settle_webhook');
        setActiveStageToken('06 // CAPTURE');
        setTickerMessage('Webhook payment_intent.succeeded dispatched. Asynchronous settlement committed.');
      }, 650);
    } else if (clearingStage === 's6_settle_webhook') {
      timer = setTimeout(() => {
        setClearingStage('completed');
        setActiveStageToken('SETTLED [200 OK]');
        if (duplicateDeflected) {
          setTickerMessage(
            `Settlement complete in 184ms · Exactly $149.00 billed · Duplicate attempts safely deflected by idempotency guard.`
          );
        } else {
          setTickerMessage('Settlement complete in 138ms · $149.00 authorization hold active · 0 duplicate charges.');
        }
        lockActiveRef.current = false;
      }, 600);
    }

    return () => clearTimeout(timer);
  }, [clearingStage, idempotencyKey, duplicateDeflected]);

  // Main Canvas Rendering Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    // 45 Ambient Stardust Particles matching Topic Hub Contrast
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      a: number;
      phase: number;
    }> = [];

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
      const now = performance.now();

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

      // Node Geometry across the Payment Clearing Corridor
      const nodes = [
        { id: 'n0_cart', x: W * 0.11, y: H * 0.48, label: 'CHECKOUT', sub: 'POST /v1/charges', stage: 's1_ingress' },
        { id: 'n1_guard', x: W * 0.30, y: H * 0.48, label: 'IDEMP GUARD', sub: 'Redis Lock (120s)', stage: 's2_idemp_lock' },
        { id: 'n2_3ds', x: W * 0.50, y: H * 0.48, label: '3-D SECURE 2.2', sub: 'EMV Risk & SCA', stage: 's3_3ds_verify' },
        { id: 'n3_scheme', x: W * 0.70, y: H * 0.48, label: 'CARD SCHEME', sub: 'ISO 8583 Rail', stage: 's4_scheme_route' },
        { id: 'n4_issuer', x: W * 0.89, y: H * 0.48, label: 'ISSUING BANK', sub: 'Auth Hold Ledger', stage: 's5_auth_hold' }
      ];

      const curStage = stageRef.current;

      // -------------------------------------------------------------
      // 1. AMBIENT PARTICLES
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
      // 2. CONNECTING FINANCIAL CONDUIT RAILS
      // -------------------------------------------------------------
      // Main Authorization Rail (Forward)
      ctx.beginPath();
      ctx.moveTo(nodes[0].x, nodes[0].y);
      ctx.lineTo(nodes[4].x, nodes[4].y);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([]);
      ctx.stroke();

      // Subtle Active Glow along Main Rail if transaction active
      if (curStage !== 'idle') {
        ctx.beginPath();
        ctx.moveTo(nodes[0].x, nodes[0].y);
        ctx.lineTo(nodes[4].x, nodes[4].y);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      // Return Settlement Webhook Conduit (Curved lower return path)
      ctx.beginPath();
      ctx.moveTo(nodes[4].x, nodes[4].y + 16);
      ctx.bezierCurveTo(
        nodes[3].x, nodes[4].y + 54,
        nodes[1].x, nodes[0].y + 54,
        nodes[0].x, nodes[0].y + 16
      );
      ctx.strokeStyle = curStage === 's6_settle_webhook' || curStage === 'completed'
        ? 'rgba(255, 255, 255, 0.35)'
        : 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Label on the return conduit
      ctx.font = '8.5px "JetBrains Mono", monospace';
      ctx.fillStyle = curStage === 's6_settle_webhook' || curStage === 'completed'
        ? 'rgba(255, 255, 255, 0.65)'
        : 'rgba(255, 255, 255, 0.22)';
      ctx.textAlign = 'center';
      ctx.fillText('WEBHOOK SETTLEMENT RAIL // payment_intent.succeeded (HTTP 200)', W * 0.50, H * 0.72);

      // Deflection Conduit for Idempotent Duplicates (Upper arch from Node 1)
      ctx.beginPath();
      ctx.moveTo(nodes[1].x, nodes[1].y - 14);
      ctx.bezierCurveTo(
        nodes[1].x - 15, H * 0.22,
        nodes[1].x + 45, H * 0.18,
        nodes[1].x + 75, H * 0.20
      );
      ctx.strokeStyle = lockActiveRef.current ? 'rgba(229, 169, 60, 0.35)' : 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = lockActiveRef.current ? 'rgba(229, 169, 60, 0.75)' : 'rgba(255, 255, 255, 0.2)';
      ctx.font = '8px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText('REPLAY DEFLECTION // CACHED 200 OK', nodes[1].x + 20, H * 0.17);

      // -------------------------------------------------------------
      // 3. DRAW DUAL-PACKET TRANSIT
      // -------------------------------------------------------------
      const activePackets = packetsRef.current;
      for (let i = activePackets.length - 1; i >= 0; i--) {
        const pkt = activePackets[i];

        if (!pkt.deflected) {
          // Normal Transit along nodes
          const startNode = nodes[pkt.stageIndex];
          const nextNode = nodes[Math.min(pkt.stageIndex + 1, nodes.length - 1)];

          pkt.progress += pkt.speed;

          if (pkt.progress >= 1) {
            pkt.progress = 0;
            pkt.stageIndex++;

            // Create ripple on node hit
            ripplesRef.current.push({
              x: nextNode.x,
              y: nextNode.y,
              r: 12,
              maxR: 32,
              alpha: 0.8,
              color: pkt.isDuplicate ? '#E5A93C' : '#FFFFFF'
            });

            // Check if duplicate hits Node 1 (Idempotency Guard)
            if (pkt.isDuplicate && pkt.stageIndex === 1) {
              pkt.deflected = true;
              pkt.deflectionProgress = 0;

              // Spawn shield deflection sparks!
              for (let s = 0; s < 12; s++) {
                const angle = -Math.PI * 0.5 + (Math.random() - 0.5) * 1.5;
                const spd = Math.random() * 2.5 + 1.2;
                sparksRef.current.push({
                  x: nextNode.x,
                  y: nextNode.y - 8,
                  vx: Math.cos(angle) * spd,
                  vy: Math.sin(angle) * spd,
                  r: Math.random() * 1.6 + 0.8,
                  alpha: 1,
                  color: '#E5A93C'
                });
              }
            }

            if (pkt.stageIndex >= nodes.length - 1) {
              // Reached issuer, remove packet
              activePackets.splice(i, 1);
              continue;
            }
          }

          pkt.currentX = startNode.x + (nextNode.x - startNode.x) * pkt.progress;
          pkt.currentY = startNode.y + (nextNode.y - startNode.y) * pkt.progress;
        } else {
          // Deflected Duplicate Packet Animation
          if (pkt.deflectionProgress !== undefined) {
            pkt.deflectionProgress += 0.035;
            const defT = pkt.deflectionProgress;
            pkt.currentX = nodes[1].x + defT * 70;
            pkt.currentY = nodes[1].y - Math.sin(defT * Math.PI) * 55;

            if (defT >= 1) {
              activePackets.splice(i, 1);
              continue;
            }
          }
        }

        // Record Trail
        pkt.trail.unshift({ x: pkt.currentX, y: pkt.currentY, a: 1 });
        if (pkt.trail.length > 12) pkt.trail.pop();

        // Draw Trail
        for (let tr = 0; tr < pkt.trail.length; tr++) {
          const pt = pkt.trail[tr];
          const factor = (1 - tr / pkt.trail.length);
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, (pkt.isDuplicate ? 3 : 3.5) * factor, 0, Math.PI * 2);
          ctx.fillStyle = pkt.isDuplicate
            ? `rgba(229, 169, 60, ${(factor * 0.7).toFixed(2)})`
            : `rgba(255, 255, 255, ${(factor * 0.85).toFixed(2)})`;
          ctx.fill();
        }

        // Draw Packet Head
        ctx.beginPath();
        ctx.arc(pkt.currentX, pkt.currentY, pkt.isDuplicate ? 4.5 : 5, 0, Math.PI * 2);
        ctx.fillStyle = pkt.isDuplicate ? '#E5A93C' : '#FFFFFF';
        ctx.shadowColor = pkt.isDuplicate ? '#E5A93C' : '#FFFFFF';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // -------------------------------------------------------------
      // 4. DRAW RIPPLES & DEFLECTION SPARKS
      // -------------------------------------------------------------
      for (let rIdx = ripplesRef.current.length - 1; rIdx >= 0; rIdx--) {
        const rp = ripplesRef.current[rIdx];
        rp.r += 0.8;
        rp.alpha *= 0.94;
        if (rp.alpha <= 0.02) {
          ripplesRef.current.splice(rIdx, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.strokeStyle = rp.color
          ? `rgba(229, 169, 60, ${rp.alpha.toFixed(2)})`
          : `rgba(255, 255, 255, ${rp.alpha.toFixed(2)})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      for (let sIdx = sparksRef.current.length - 1; sIdx >= 0; sIdx--) {
        const spk = sparksRef.current[sIdx];
        spk.x += spk.vx;
        spk.y += spk.vy;
        spk.vy += 0.05; // gravity
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

      // -------------------------------------------------------------
      // 5. DRAW THE 5 PRINCIPAL NODES
      // -------------------------------------------------------------
      nodes.forEach((n, idx) => {
        const isCurrentActive =
          (curStage === 's1_ingress' && idx === 0) ||
          (curStage === 's2_idemp_lock' && idx === 1) ||
          (curStage === 's3_3ds_verify' && idx === 2) ||
          (curStage === 's4_scheme_route' && idx === 3) ||
          (curStage === 's5_auth_hold' && idx === 4);

        const isPassed =
          (curStage === 'completed') ||
          (curStage === 's6_settle_webhook' && idx < 5) ||
          (curStage === 's5_auth_hold' && idx < 4) ||
          (curStage === 's4_scheme_route' && idx < 3) ||
          (curStage === 's3_3ds_verify' && idx < 2) ||
          (curStage === 's2_idemp_lock' && idx < 1);

        // Outer Glow Ring for active node
        if (isCurrentActive) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, 22 + Math.sin(t * 4) * 2.5, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Idempotency Shield Dome if lock is active & duplicate deflected
        if (idx === 1 && duplicateDeflected) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, 24, -Math.PI * 0.9, -Math.PI * 0.1);
          ctx.strokeStyle = '#E5A93C';
          ctx.lineWidth = 2;
          ctx.shadowColor = '#E5A93C';
          ctx.shadowBlur = 10;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }

        // Base Circle
        ctx.beginPath();
        ctx.arc(n.x, n.y, 16, 0, Math.PI * 2);
        ctx.fillStyle = '#080808';
        ctx.fill();

        ctx.strokeStyle = isPassed
          ? '#FFFFFF'
          : isCurrentActive
          ? '#FFFFFF'
          : 'rgba(255, 255, 255, 0.22)';
        ctx.lineWidth = isPassed || isCurrentActive ? 1.5 : 1;
        ctx.stroke();

        // Inner Indicator
        ctx.beginPath();
        ctx.arc(n.x, n.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = isPassed
          ? '#FFFFFF'
          : isCurrentActive
          ? '#FFFFFF'
          : 'rgba(255, 255, 255, 0.25)';
        ctx.fill();

        // Stage Index number
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.textAlign = 'center';
        ctx.fillText(`0${idx + 1}`, n.x, n.y - 25);

        // Node Title
        ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = isPassed || isCurrentActive ? '#FFFFFF' : 'rgba(237, 233, 227, 0.7)';
        ctx.fillText(n.label, n.x, n.y + 32);

        // Subtitle / Protocol detail
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(237, 233, 227, 0.45)';
        ctx.fillText(n.sub, n.x, n.y + 45);
      });

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

        {/* Central Living Financial Clearinghouse Stage */}
        <div className={styles.stageWrapper}>
          <div className={styles.canvasViewport}>
            <canvas ref={canvasRef} className={styles.paymentCanvas} />
          </div>

          {/* Integrated Modern Instrument Ribbon */}
          <div className={styles.instrumentRibbon}>
            {/* Left: Telemetry Capsule */}
            <div className={styles.telemetryArea}>
              <div
                className={`${styles.telemetryDot} ${
                  duplicateDeflected
                    ? styles.telemetryDotBlocked
                    : clearingStage !== 'idle'
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
              {/* Active Idempotency Key Badge */}
              <div className={styles.idempPill} title="Unique client nonce idempotency key">
                <Lock size={10} />
                <span>KEY:</span>
                <span className={styles.idempVal}>{idempotencyKey.slice(0, 14)}…</span>
              </div>

              {/* 3DS Challenge Toggle */}
              <button
                type="button"
                className={`${styles.challengeToggleBtn} ${isChallengeMode ? styles.challengeToggleActive : ''}`}
                onClick={() => setIsChallengeMode(!isChallengeMode)}
                disabled={clearingStage !== 'idle' && clearingStage !== 'completed'}
                title="Toggle between Frictionless SCA and Challenge Step-Up"
              >
                <div className={styles.toggleDot} />
                <span>{isChallengeMode ? '3DS: Challenge (Step-up)' : '3DS: Frictionless'}</span>
              </button>

              {/* Rapid Double-Click Test Button */}
              <button
                type="button"
                className={styles.doubleClickTestBtn}
                onClick={handleDoubleClickTest}
                disabled={clearingStage !== 'idle' && clearingStage !== 'completed'}
                title="Stress-test double-charge prevention by firing 2 rapid concurrent requests"
              >
                <Zap size={11} />
                <span>Double-Click Test</span>
              </button>

              {/* Pay Action Button */}
              <button
                type="button"
                className={styles.payButton}
                onClick={handleSubmitPayment}
                title="Submit Payment ($149.00) — try double-clicking while active"
              >
                <Play size={11} fill="currentColor" />
                <span>Pay $149.00</span>
              </button>

              {/* Reset Engine Button */}
              <button
                type="button"
                className={styles.resetButton}
                onClick={handleReset}
                title="Reset simulation and generate fresh UUID idempotency key"
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

