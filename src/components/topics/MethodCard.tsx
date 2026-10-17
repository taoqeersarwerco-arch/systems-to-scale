import React, { useRef, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Crosshair, Cpu, Gauge, ShieldCheck } from 'lucide-react';
import styles from '../../styles/topics.module.css';

export const MethodCard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePhase, setActivePhase] = useState<number | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = containerRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--spotlight-x', `${x}px`);
    card.style.setProperty('--spotlight-y', `${y}px`);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={styles.methodChassis}
    >
      {/* Reticle Corner Brackets */}
      <div className={styles.methodReticleTl} aria-hidden="true" />
      <div className={styles.methodReticleTr} aria-hidden="true" />
      <div className={styles.methodReticleBl} aria-hidden="true" />
      <div className={styles.methodReticleBr} aria-hidden="true" />

      {/* Ambient Technical Grid Background */}
      <div className={styles.methodGridBg} aria-hidden="true" />

      {/* Cursor Radial Spotlight */}
      <div className={styles.methodSpotlight} aria-hidden="true" />

      {/* Header Telemetry Bar */}
      <div className={styles.methodHeaderBar}>
        <div className={styles.methodStatusBadge}>
          <div className={styles.methodStatusDot} />
          <span>EDITORIAL PROTOCOL ACTIVE</span>
        </div>
        <span className={styles.methodSpecTag}>SPEC: RFC-01 // THE STS STANDARD</span>
      </div>

      {/* Main Title & Sublead Block */}
      <div className={styles.methodTitleBlock}>
        <h2 className={styles.methodHeading}>
          Every explanation answers three questions.
        </h2>
        <p className={styles.methodSublead}>
          Systems to Scale rejects speculative vendor marketing. Every breakdown enforces three non-negotiable verification gates from the underlying mechanism up.
        </p>
      </div>

      {/* 3-Phase Interactive Tile Triad */}
      <div className={styles.methodPhaseGrid}>
        {/* Phase 01 */}
        <div
          className={`${styles.methodPhaseTile} ${activePhase === 1 ? styles.methodTileActive : ''}`}
          onMouseEnter={() => setActivePhase(1)}
          onMouseLeave={() => setActivePhase(null)}
        >
          <div className={styles.methodPhaseHead}>
            <span className={styles.methodPhaseToken}>PHASE 01 // SCOPE</span>
            <div className={styles.methodPhaseIconWrapper} aria-hidden="true">
              <Crosshair size={15} />
            </div>
          </div>

          <h3 className={styles.methodPhaseTitle}>01. What It Is</h3>
          <div className={styles.methodPhaseSubtitle}>The Mechanism Named</div>
          <p className={styles.methodPhaseDesc}>
            The mechanism named, scoped, and placed in context. We isolate the distributed state machine, lock acquisition, or network bottleneck without hand-waving abstractions.
          </p>

          {/* Interactive Micro-Visual: Locking Focus Reticle */}
          <div className={styles.methodWidgetBox}>
            <div className={styles.methodReticleWidget} aria-hidden="true">
              <div className={styles.methodReticleCenter} />
              <div className={styles.methodReticleRing} />
              <div className={styles.methodReticleCrossH} />
              <div className={styles.methodReticleCrossV} />
            </div>
            <div className={styles.methodWidgetStatus}>
              <span className={styles.methodWidgetKey}>TARGET</span>
              <span className={styles.methodWidgetVal}>INVARIANT ISOLATED</span>
            </div>
          </div>
        </div>

        {/* Phase 02 */}
        <div
          className={`${styles.methodPhaseTile} ${activePhase === 2 ? styles.methodTileActive : ''}`}
          onMouseEnter={() => setActivePhase(2)}
          onMouseLeave={() => setActivePhase(null)}
        >
          <div className={styles.methodPhaseHead}>
            <span className={styles.methodPhaseToken}>PHASE 02 // LOGIC</span>
            <div className={styles.methodPhaseIconWrapper} aria-hidden="true">
              <Cpu size={15} />
            </div>
          </div>

          <h3 className={styles.methodPhaseTitle}>02. How It Works</h3>
          <div className={styles.methodPhaseSubtitle}>Traced Step-by-Step</div>
          <p className={styles.methodPhaseDesc}>
            The internal logic traced deterministically, with exactly one visual that teaches. Interactive simulations let you step through execution and inspect failure modes in real time.
          </p>

          {/* Interactive Micro-Visual: 3-Node Circuit with Traveling Photon */}
          <div className={styles.methodWidgetBox}>
            <div className={styles.methodCircuitWidget} aria-hidden="true">
              <div className={styles.methodCircuitTrack}>
                <div className={styles.methodCircuitPhoton} />
              </div>
              <div className={styles.methodCircuitNode}>A</div>
              <div className={styles.methodCircuitNode}>B</div>
              <div className={styles.methodCircuitNode}>C</div>
            </div>
            <div className={styles.methodWidgetStatus}>
              <span className={styles.methodWidgetKey}>EXECUTION</span>
              <span className={styles.methodWidgetVal}>DETERMINISTIC TRACE</span>
            </div>
          </div>
        </div>

        {/* Phase 03 */}
        <div
          className={`${styles.methodPhaseTile} ${activePhase === 3 ? styles.methodTileActive : ''}`}
          onMouseEnter={() => setActivePhase(3)}
          onMouseLeave={() => setActivePhase(null)}
        >
          <div className={styles.methodPhaseHead}>
            <span className={styles.methodPhaseToken}>PHASE 03 // PAYOFF</span>
            <div className={styles.methodPhaseIconWrapper} aria-hidden="true">
              <Gauge size={15} />
            </div>
          </div>

          <h3 className={styles.methodPhaseTitle}>03. Why It Matters</h3>
          <div className={styles.methodPhaseSubtitle}>The Consequence</div>
          <p className={styles.methodPhaseDesc}>
            The consequence for your production architecture, operational budget, or engineering tradeoffs. No filler theory — pure, verifiable decision leverage.
          </p>

          {/* Interactive Micro-Visual: Dual Threshold Telemetry Gauge */}
          <div className={styles.methodWidgetBox}>
            <div className={styles.methodGaugeWidget} aria-hidden="true">
              <div className={styles.methodGaugeBar}>
                <div className={styles.methodGaugeFill} />
              </div>
              <div className={styles.methodGaugeMarkers}>
                <span>SLO TARGET</span>
                <span>P99 &lt; 20ms</span>
              </div>
            </div>
            <div className={styles.methodWidgetStatus}>
              <span className={styles.methodWidgetKey}>OUTCOME</span>
              <span className={styles.methodWidgetVal}>DECISION LEVERAGE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bar & Button-in-Button CTA */}
      <div className={styles.methodFooterBar}>
        <div className={styles.methodIntegrityNote}>
          <ShieldCheck size={14} />
          <span>AUDIT INTEGRITY: ZERO SPONSORED CONTENT // 100% FIRST-PARTY TRUTHS</span>
        </div>

        <Link to="/about#method" className={styles.methodCtaButton}>
          <span>Read about our method</span>
          <div className={styles.methodCtaArrow} aria-hidden="true">
            <ArrowRight size={14} />
          </div>
        </Link>
      </div>
    </div>
  );
};
