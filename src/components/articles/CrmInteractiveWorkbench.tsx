import React, { useState, useEffect, useRef } from 'react';
import {
  Share2,
  Sliders,
  RefreshCw,
  GitMerge,
  ShieldCheck,
  AlertTriangle,
  Database,
  ArrowRight,
  Layers,
  Sparkles,
  Zap,
  Play,
  RotateCcw
} from 'lucide-react';
import styles from '../../styles/crmInteractiveWorkbench.module.css';

interface NodeItem {
  id: string;
  label: string;
  detail: string;
  type: 'cookie' | 'email' | 'payment' | 'ticket';
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  color: string;
}

export const CrmInteractiveWorkbench: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'identity' | 'sla' | 'reverse_etl'>('identity');

  // --------------------------------------------------------------------------
  // Tab 1: Identity Graph Resolution State & Canvas
  // --------------------------------------------------------------------------
  const [identityStep, setIdentityStep] = useState<1 | 2 | 3 | 4>(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  const initialNodes: NodeItem[] = [
    { id: 'n1', label: 'Web Session', detail: '_ga_8912 (Pricing Page)', type: 'cookie', x: 80, y: 80, targetX: 80, targetY: 80, vx: 0, vy: 0, color: '#38bdf8' },
    { id: 'n2', label: 'Ebook Lead', detail: 'alex@enterprise.io', type: 'email', x: 340, y: 60, targetX: 340, targetY: 60, vx: 0, vy: 0, color: '#f59e0b' },
    { id: 'n3', label: 'Stripe Account', detail: 'cust_8829 ($64k/yr)', type: 'payment', x: 100, y: 220, targetX: 100, targetY: 220, vx: 0, vy: 0, color: '#10b981' },
    { id: 'n4', label: 'Support Case', detail: 'TCK-902 (P1 SLA)', type: 'ticket', x: 360, y: 210, targetX: 360, targetY: 210, vx: 0, vy: 0, color: '#f43f5e' }
  ];

  const nodesRef = useRef<NodeItem[]>(JSON.parse(JSON.stringify(initialNodes)));
  const shockwaveRef = useRef<{ radius: number; maxRadius: number; alpha: number } | null>(null);

  // Update target positions according to resolution step
  useEffect(() => {
    const nodes = nodesRef.current;
    if (identityStep === 1) {
      nodes[0].targetX = 80;  nodes[0].targetY = 80;
      nodes[1].targetX = 340; nodes[1].targetY = 60;
      nodes[2].targetX = 100; nodes[2].targetY = 220;
      nodes[3].targetX = 360; nodes[3].targetY = 210;
    } else if (identityStep === 2) {
      // n2 and n3 move closer together (deterministic match)
      nodes[0].targetX = 70;  nodes[0].targetY = 80;
      nodes[1].targetX = 260; nodes[1].targetY = 110;
      nodes[2].targetX = 210; nodes[2].targetY = 170;
      nodes[3].targetX = 370; nodes[3].targetY = 220;
    } else if (identityStep === 3) {
      // n1 links to the cluster (probabilistic Jaro-Winkler)
      nodes[0].targetX = 130; nodes[0].targetY = 110;
      nodes[1].targetX = 250; nodes[1].targetY = 100;
      nodes[2].targetX = 220; nodes[2].targetY = 180;
      nodes[3].targetX = 330; nodes[3].targetY = 180;
    } else if (identityStep === 4) {
      // Golden Record Consolidation: all converge into center (220, 140)
      nodes.forEach((n) => {
        n.targetX = 220;
        n.targetY = 140;
      });
      shockwaveRef.current = { radius: 10, maxRadius: 180, alpha: 1.0 };
    }
  }, [identityStep]);

  // Canvas Render Loop for Identity Graph
  useEffect(() => {
    if (activeTab !== 'identity') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Subtle grid background
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 32;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      const nodes = nodesRef.current;

      // Spring physics towards target
      nodes.forEach((n) => {
        const dx = n.targetX - n.x;
        const dy = n.targetY - n.y;
        n.vx = (n.vx + dx * 0.08) * 0.78;
        n.vy = (n.vy + dy * 0.08) * 0.78;
        n.x += n.vx;
        n.y += n.vy;
      });

      // Draw Connector lines based on step
      if (identityStep >= 2) {
        // Deterministic link n2 <-> n3
        ctx.beginPath();
        ctx.moveTo(nodes[1].x, nodes[1].y);
        ctx.lineTo(nodes[2].x, nodes[2].y);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Label on link
        const midX = (nodes[1].x + nodes[2].x) / 2;
        const midY = (nodes[1].y + nodes[2].y) / 2;
        ctx.fillStyle = '#10b981';
        ctx.font = '10px monospace';
        ctx.fillText('MATCH: email_hash [1.00]', midX - 50, midY - 6);
      }

      if (identityStep >= 3) {
        // Probabilistic link n0 <-> n1
        ctx.beginPath();
        ctx.moveTo(nodes[0].x, nodes[0].y);
        ctx.lineTo(nodes[1].x, nodes[1].y);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 6;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.setLineDash([]);

        ctx.fillStyle = '#f59e0b';
        ctx.font = '9px monospace';
        ctx.fillText('Jaro-Winkler: 0.94', (nodes[0].x + nodes[1].x) / 2 - 40, (nodes[0].y + nodes[1].y) / 2 - 8);

        // Support ticket link
        ctx.beginPath();
        ctx.moveTo(nodes[3].x, nodes[3].y);
        ctx.lineTo(nodes[2].x, nodes[2].y);
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw Shockwave if Step 4 active
      if (shockwaveRef.current) {
        const sw = shockwaveRef.current;
        ctx.beginPath();
        ctx.arc(220, 140, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(229, 169, 60, ${sw.alpha})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();
        sw.radius += 4;
        sw.alpha -= 0.025;
        if (sw.alpha <= 0) {
          shockwaveRef.current = null;
        }
      }

      // Draw Nodes
      if (identityStep === 4) {
        // Consolidated Golden Record Node
        ctx.beginPath();
        ctx.arc(220, 140, 32, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(229, 169, 60, 0.2)';
        ctx.fill();
        ctx.strokeStyle = '#E5A93C';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#E5A93C';
        ctx.shadowBlur = 18;
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GOLDEN RECORD', 220, 137);
        ctx.fillStyle = '#E5A93C';
        ctx.font = '9px monospace';
        ctx.fillText('ID: CUST_7741', 220, 150);
        ctx.textAlign = 'start';
      } else {
        nodes.forEach((n) => {
          ctx.beginPath();
          ctx.arc(n.x, n.y, 16, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(10, 14, 18, 0.9)';
          ctx.fill();
          ctx.strokeStyle = n.color;
          ctx.lineWidth = 2;
          ctx.shadowColor = n.color;
          ctx.shadowBlur = 8;
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Inner dot
          ctx.beginPath();
          ctx.arc(n.x, n.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = n.color;
          ctx.fill();

          // Labels
          ctx.fillStyle = '#EDE9E3';
          ctx.font = '10px monospace';
          ctx.fillText(n.label, n.x + 22, n.y - 2);
          ctx.fillStyle = 'rgba(237, 233, 227, 0.45)';
          ctx.font = '9px monospace';
          ctx.fillText(n.detail, n.x + 22, n.y + 10);
        });
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [activeTab, identityStep]);

  // --------------------------------------------------------------------------
  // Tab 2: Dynamic SLA Priority Queue Simulator
  // --------------------------------------------------------------------------
  const [severity, setSeverity] = useState<number>(3); // 1 = Low, 4 = Critical
  const [waitTimeMinutes, setWaitTimeMinutes] = useState<number>(35); // 0-120
  const [contractLtv, setContractLtv] = useState<number>(140000); // 10k - 500k

  // Calculate dynamic SLA Priority equation:
  // P = 0.40 * S + 0.35 * (T / 15) + 0.25 * (LTV / 50000)
  const calculatedScore = (
    0.4 * severity +
    0.35 * (waitTimeMinutes / 15) +
    0.25 * (contractLtv / 50000)
  ).toFixed(2);

  const baselineTickets = [
    { rank: '#1', client: 'Acme Corp (Global)', tier: 'P1 Enterprise', ltv: '$420,000', score: 3.85 },
    { rank: '#2', client: 'Starlight Tech', tier: 'P2 Pro', ltv: '$95,000', score: 2.45 },
    { rank: '#3', client: 'Vertex Dynamics', tier: 'P3 Growth', ltv: '$45,000', score: 1.6 }
  ];

  // Merge the active ticket into the priority heap
  const userScoreNum = parseFloat(calculatedScore);
  const queueWithUser = [
    ...baselineTickets.map((t) => ({ ...t, isTarget: false })),
    { rank: '#?', client: 'Active Client (Interactive Test)', tier: `P${severity} Severity`, ltv: `$${(contractLtv / 1000).toFixed(0)}k`, score: userScoreNum, isTarget: true }
  ].sort((a, b) => b.score - a.score);

  // --------------------------------------------------------------------------
  // Tab 3: Reverse ETL & Concurrency Guard
  // --------------------------------------------------------------------------
  const [hasConflict, setHasConflict] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'conflict_caught' | 'committed'>('idle');
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([
    '[INIT] Reverse ETL pipeline connected to Snowflake & Salesforce SoR',
    '[READY] Mutex concurrency guard listening on field level: Account_Health_Score__c'
  ]);

  const handleRunSync = () => {
    setSyncStatus('syncing');
    setTelemetryLogs((prev) => [
      `[T+0ms] Ingesting Snowflake ML churn hazard payload (Score: 87.4%)`,
      ...prev
    ]);

    setTimeout(() => {
      if (hasConflict) {
        setSyncStatus('conflict_caught');
        setTelemetryLogs((prev) => [
          `[FAIL-SAFE] Version Vector Mismatch! Sales Rep concurrent edit detected (Row v3 vs Incoming v2). Write quarantined to audit review. Infinite write-loop prevented!`,
          `[T+180ms] Optimistic Lock Guard tripped: HTTP 409 Conflict`,
          ...prev
        ]);
      } else {
        setSyncStatus('committed');
        setTelemetryLogs((prev) => [
          `[SUCCESS] Account_Health_Score__c updated to 87.4% (Version Vector v3 -> v4 committed with WAL). Zero race condition.`,
          `[T+140ms] Idempotency Key verified: idemp_crm_snow_99182`,
          ...prev
        ]);
      }
    }, 1100);
  };

  return (
    <div className={styles.workbenchContainer}>
      {/* Top Header / Mode Switcher */}
      <div className={styles.topBar}>
        <div className={styles.topBarTitle}>
          <span className={styles.pulseDot} />
          <span>CRM ENGINE LAB // PRODUCTION RFC SPEC</span>
        </div>

        <div className={styles.tabPills}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'identity' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('identity')}
          >
            <GitMerge size={13} />
            <span>1. Identity Resolution</span>
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'sla' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('sla')}
          >
            <Sliders size={13} />
            <span>2. Dynamic SLA Heap</span>
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'reverse_etl' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('reverse_etl')}
          >
            <RefreshCw size={13} />
            <span>3. Reverse ETL Guard</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className={styles.stageArea}>
        {/* ================================================================== */}
        {/* TAB 1: IDENTITY RESOLUTION GRAPH                                   */}
        {/* ================================================================== */}
        {activeTab === 'identity' && (
          <div>
            <div className={styles.graphHeader}>
              <div className={styles.graphSubtitle}>
                Observe how disconnected customer touchpoints resolve deterministically and probabilistically into a single canonical Golden Record.
              </div>

              <div className={styles.stepButtonGroup}>
                <button
                  type="button"
                  className={`${styles.stepButton} ${identityStep === 1 ? styles.stepButtonActive : ''}`}
                  onClick={() => setIdentityStep(1)}
                >
                  Step 1: Ingest
                </button>
                <button
                  type="button"
                  className={`${styles.stepButton} ${identityStep === 2 ? styles.stepButtonActive : ''}`}
                  onClick={() => setIdentityStep(2)}
                >
                  Step 2: Deterministic
                </button>
                <button
                  type="button"
                  className={`${styles.stepButton} ${identityStep === 3 ? styles.stepButtonActive : ''}`}
                  onClick={() => setIdentityStep(3)}
                >
                  Step 3: Probabilistic
                </button>
                <button
                  type="button"
                  className={`${styles.stepButton} ${identityStep === 4 ? styles.stepButtonActive : ''}`}
                  onClick={() => setIdentityStep(4)}
                >
                  Step 4: Golden Record
                </button>
              </div>
            </div>

            {/* Canvas Interactive Visualizer */}
            <div className={styles.canvasWrapper}>
              <div className={styles.canvasOverlayBadge}>
                {identityStep === 1 && 'STATUS: 4 Fragmented Signals Detected'}
                {identityStep === 2 && 'STATUS: Email Hash Exact Match [Confidence: 1.00]'}
                {identityStep === 3 && 'STATUS: Jaro-Winkler IP Cluster [Confidence: 0.94]'}
                {identityStep === 4 && 'STATUS: Consolidated Master Profile [CUST_7741]'}
              </div>
              <canvas ref={canvasRef} width={640} height={280} style={{ width: '100%', height: '100%' }} />
            </div>

            {/* Metric Readouts */}
            <div className={styles.canvasFooterMetrics}>
              <div className={styles.metricCard}>
                <span className={styles.metricLabel}>Match Confidence</span>
                <span className={`${styles.metricValue} ${identityStep >= 3 ? styles.metricValueSuccess : ''}`}>
                  {identityStep === 1 ? '0.00 (Unlinked)' : identityStep === 2 ? '1.00 (Deterministic)' : '0.94 (Probabilistic)'}
                </span>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricLabel}>Survivorship Rule</span>
                <span className={styles.metricValue}>
                  {identityStep === 4 ? 'Billing > ERP, Role > Sales' : 'Pending Resolution'}
                </span>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricLabel}>False Merge Risk</span>
                <span className={`${styles.metricValue} ${identityStep === 4 ? styles.metricValueSuccess : styles.metricValueWarning}`}>
                  {identityStep === 4 ? '< 0.02% (Quarantine Safe)' : 'Elevated (Pre-gate)'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 2: DYNAMIC SLA PRIORITY QUEUE CALCULATOR                       */}
        {/* ================================================================== */}
        {activeTab === 'sla' && (
          <div>
            <div className={styles.slaGrid}>
              {/* Sliders Control Panel */}
              <div className={styles.sliderGroup}>
                <div className={styles.sliderItem}>
                  <div className={styles.sliderHeader}>
                    <span className={styles.sliderLabel}>Ticket Severity (S)</span>
                    <span className={styles.sliderVal}>P{severity} {severity === 4 ? 'Critical' : severity === 3 ? 'High' : severity === 2 ? 'Medium' : 'Low'}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="4"
                    step="1"
                    value={severity}
                    onChange={(e) => setSeverity(parseInt(e.target.value))}
                    className={styles.rangeInput}
                  />
                </div>

                <div className={styles.sliderItem}>
                  <div className={styles.sliderHeader}>
                    <span className={styles.sliderLabel}>Time in Queue (T_wait)</span>
                    <span className={styles.sliderVal}>{waitTimeMinutes} mins</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="120"
                    step="5"
                    value={waitTimeMinutes}
                    onChange={(e) => setWaitTimeMinutes(parseInt(e.target.value))}
                    className={styles.rangeInput}
                  />
                </div>

                <div className={styles.sliderItem}>
                  <div className={styles.sliderHeader}>
                    <span className={styles.sliderLabel}>Account LTV</span>
                    <span className={styles.sliderVal}>${(contractLtv / 1000).toFixed(0)},000</span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="500000"
                    step="10000"
                    value={contractLtv}
                    onChange={(e) => setContractLtv(parseInt(e.target.value))}
                    className={styles.rangeInput}
                  />
                </div>

                <div className={styles.formulaBox}>
                  <strong>Dynamic Heap Weight:</strong>
                  <div>P = 0.40(S) + 0.35(T/15) + 0.25(LTV/50k) = <span style={{ color: '#E5A93C', fontWeight: 700 }}>{calculatedScore}</span></div>
                </div>
              </div>

              {/* Live Min-Heap Queue Display */}
              <div className={styles.queueDisplay}>
                <div className={styles.queueTitle}>
                  <span>Real-Time Min-Heap Priority Queue</span>
                  <span>Calculated Score</span>
                </div>

                {queueWithUser.map((t, idx) => (
                  <div
                    key={idx}
                    className={`${styles.queueItem} ${t.isTarget ? styles.queueItemTarget : ''}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span className={styles.queueRank}>#{idx + 1}</span>
                      <div className={styles.queueClient}>
                        <span>{t.client}</span>
                        <span className={styles.queueClientSub}>{t.tier} • LTV: {t.ltv}</span>
                      </div>
                    </div>
                    <span className={styles.queueScore}>{t.score.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 3: REVERSE ETL & CONCURRENCY GUARD                             */}
        {/* ================================================================== */}
        {activeTab === 'reverse_etl' && (
          <div>
            <div className={styles.pipelineFlow}>
              {/* Node 1 */}
              <div className={styles.pipeNode}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', fontSize: '0.78rem', fontFamily: 'monospace' }}>
                  <Database size={13} />
                  <span>Snowflake / DWH</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#EDE9E3', fontWeight: 600 }}>Churn ML Model</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(237,233,227,0.5)' }}>Payload: Hazard 87.4%</div>
              </div>

              {/* Connector 1 */}
              <div className={styles.pipeConnector}>
                <ArrowRight size={18} />
                {syncStatus === 'syncing' && <span className={styles.pipePacket} />}
              </div>

              {/* Node 2 */}
              <div className={`${styles.pipeNode} ${syncStatus === 'syncing' ? styles.pipeNodeActive : ''}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#E5A93C', fontSize: '0.78rem', fontFamily: 'monospace' }}>
                  <RefreshCw size={13} />
                  <span>Reverse ETL Worker</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#EDE9E3', fontWeight: 600 }}>Idempotency Check</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(237,233,227,0.5)' }}>Version Vector: v3</div>
              </div>

              {/* Connector 2 */}
              <div className={styles.pipeConnector}>
                <ArrowRight size={18} />
                {syncStatus === 'syncing' && <span className={styles.pipePacket} style={{ animationDelay: '0.5s' }} />}
              </div>

              {/* Node 3 */}
              <div className={`${styles.pipeNode} ${syncStatus === 'conflict_caught' ? styles.pipeNodeConflict : syncStatus === 'committed' ? styles.pipeNodeActive : ''}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: syncStatus === 'conflict_caught' ? '#f43f5e' : '#10b981', fontSize: '0.78rem', fontFamily: 'monospace' }}>
                  <ShieldCheck size={13} />
                  <span>Frontline CRM (SoR)</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#EDE9E3', fontWeight: 600 }}>Account Record</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(237,233,227,0.5)' }}>
                  {hasConflict ? 'Concurrent Rep Edit: ACTIVE' : 'State: Nominal'}
                </div>
              </div>
            </div>

            {/* Conflict Toggle & Trigger */}
            <div className={styles.conflictToggleBar}>
              <label className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={hasConflict}
                  onChange={(e) => setHasConflict(e.target.checked)}
                  style={{ accentColor: '#E5A93C', width: 16, height: 16, cursor: 'pointer' }}
                />
                <span>Simulate Concurrent Sales Rep Update (Race Condition Trap)</span>
              </label>

              <button
                type="button"
                className={styles.actionBtn}
                onClick={handleRunSync}
                disabled={syncStatus === 'syncing'}
              >
                <Play size={12} fill="currentColor" />
                <span>{syncStatus === 'syncing' ? 'Syncing...' : 'Trigger Reverse ETL Sync'}</span>
              </button>
            </div>

            {/* Live Telemetry Console */}
            <div className={styles.telemetryConsole}>
              {telemetryLogs.map((log, idx) => (
                <div key={idx} style={{ color: log.includes('FAIL-SAFE') ? '#f87171' : log.includes('SUCCESS') ? '#4ade80' : 'rgba(237,233,227,0.7)' }}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
