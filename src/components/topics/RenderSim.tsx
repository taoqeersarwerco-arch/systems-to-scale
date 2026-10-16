import React, { useState } from 'react';
import { Play, RotateCcw, AlertTriangle, Layers, Eye } from 'lucide-react';

export const RenderSim: React.FC = () => {
  const [hasLayoutThrash, setHasLayoutThrash] = useState(false);
  const [activeStage, setActiveStage] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);

  const stages = [
    { name: '1. HTML Stream Parsing', ms: 14, desc: 'Byte stream tokenization into DOM node tree.' },
    { name: '2. CSSOM Compilation', ms: 22, desc: 'Parsing CSS selectors and calculating cascade rules.' },
    { name: '3. Render Tree Synthesis', ms: 18, desc: 'Filtering visible nodes (display: none pruned).' },
    { name: '4. Layout Box Geometry', ms: hasLayoutThrash ? 112 : 28, desc: hasLayoutThrash ? '⚠️ FORCED REFLOW: Synchronous style calculation read.' : 'Calculating exact geometry coordinates (x, y, w, h).' },
    { name: '5. Raster Paint & Composite', ms: 16, desc: 'GPU texture allocation and layer compositing.' }
  ];

  const totalTime = stages.reduce((acc, s) => acc + s.ms, 0);

  const runPipeline = () => {
    setIsRunning(true);
    setActiveStage(1);
    let current = 1;
    const interval = setInterval(() => {
      current++;
      if (current <= 5) {
        setActiveStage(current);
      } else {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 400);
  };

  const reset = () => {
    setActiveStage(0);
    setIsRunning(false);
  };

  return (
    <div
      style={{
        background: 'var(--sts-raised)',
        border: '1px solid var(--sts-border)',
        borderRadius: 'var(--sts-card-radius)',
        padding: '2rem',
        color: 'var(--sts-bone)'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '2rem',
          borderBottom: '1px solid var(--sts-border-subtle)',
          paddingBottom: '1.25rem'
        }}
      >
        <div>
          <span className="sts-badge sts-badge-steel" style={{ marginBottom: '0.4rem' }}>
            Browser Internal Profiler
          </span>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--sts-bone)', margin: 0 }}>
            Critical Rendering Path & Layout Reflow Pipeline
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={hasLayoutThrash}
              onChange={(e) => setHasLayoutThrash(e.target.checked)}
              disabled={isRunning}
            />
            <span>Simulate Layout Thrashing</span>
          </label>
          <button
            onClick={runPipeline}
            disabled={isRunning}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 1rem',
              borderRadius: 'var(--sts-pill-radius)',
              background: 'var(--sts-steel)',
              color: '#0E1112',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            <Play size={13} fill="#0E1112" />
            <span>Profile Frame</span>
          </button>
          <button
            onClick={reset}
            style={{
              padding: '0.45rem 0.75rem',
              borderRadius: 'var(--sts-pill-radius)',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--sts-border)',
              color: 'var(--sts-muted)'
            }}
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Frame Stages Progress Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
        {stages.map((stage, idx) => {
          const isPassed = activeStage > idx + 1 || (!isRunning && activeStage === 5);
          const isCurrent = activeStage === idx + 1;
          const isThrash = idx === 3 && hasLayoutThrash;

          return (
            <div
              key={idx}
              style={{
                padding: '1rem 1.25rem',
                borderRadius: '8px',
                background: isCurrent ? 'rgba(127, 168, 184, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${isThrash && isCurrent ? 'var(--sts-danger)' : isCurrent ? 'var(--sts-steel)' : isPassed ? 'rgba(78, 173, 123, 0.3)' : 'var(--sts-border)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.92rem', color: isThrash && isCurrent ? 'var(--sts-danger)' : 'var(--sts-bone)' }}>
                  {stage.name}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--sts-muted)', marginTop: '0.2rem' }}>
                  {stage.desc}
                </div>
              </div>

              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <span className="sts-mono" style={{ fontSize: '0.9rem', color: isThrash ? 'var(--sts-danger)' : 'var(--sts-steel)', fontWeight: 600 }}>
                  {stage.ms} ms
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Telemetry Summary */}
      <div
        style={{
          padding: '1.25rem',
          borderRadius: '8px',
          background: '#07090A',
          border: `1px solid ${hasLayoutThrash ? 'rgba(217, 83, 79, 0.4)' : 'var(--sts-border)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--sts-font-mono)', color: 'var(--sts-dim)', textTransform: 'uppercase' }}>
            Frame Budget Calculation
          </span>
          <div style={{ fontSize: '1rem', color: 'var(--sts-bone)', marginTop: '0.2rem' }}>
            Total Critical Path: <strong style={{ color: hasLayoutThrash ? 'var(--sts-danger)' : 'var(--sts-success)' }}>{totalTime}ms</strong>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span
            className={`sts-badge ${hasLayoutThrash ? 'sts-badge-brass' : 'sts-badge-steel'}`}
            style={{ fontSize: '0.72rem' }}
          >
            {hasLayoutThrash ? 'Frame Dropped (INP > 50ms)' : '60 FPS Budget Maintained (< 16.6ms paint)'}
          </span>
        </div>
      </div>
    </div>
  );
};
