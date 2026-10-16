import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export const PipelineSim: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [hasFault, setHasFault] = useState<boolean>(true);
  const [log, setLog] = useState<string[]>(['Pipeline idle. Ready for trigger.']);

  const steps = [
    { id: 1, name: '01. Ingestion Webhook', duration: 1000 },
    { id: 2, name: '02. Payload Validation & Hash', duration: 1200 },
    { id: 3, name: '03. Upstream API Call', duration: 1800 },
    { id: 4, name: '04. Idempotent State Settlement', duration: 1000 }
  ];

  const runSimulation = () => {
    setIsRunning(true);
    setCurrentStep(1);
    setRetryCount(0);
    setLog(['[0.0s] Trigger received: Payload hash sha256:7f8a9e... verified']);
  };

  const reset = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setRetryCount(0);
    setLog(['Pipeline reset to idle state.']);
  };

  useEffect(() => {
    if (!isRunning) return;

    if (currentStep === 1) {
      const timer = setTimeout(() => {
        setLog((prev) => [...prev, '[1.0s] Schema validated. Idempotency lock acquired in Redis.']);
        setCurrentStep(2);
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (currentStep === 2) {
      const timer = setTimeout(() => {
        setLog((prev) => [...prev, '[2.2s] Dispatching to upstream third-party API endpoint...']);
        setCurrentStep(3);
      }, 1200);
      return () => clearTimeout(timer);
    }

    if (currentStep === 3) {
      if (hasFault && retryCount === 0) {
        const timer = setTimeout(() => {
          setLog((prev) => [
            ...prev,
            '[3.4s] ⚠️ Upstream returned HTTP 503 Service Unavailable.',
            '[3.5s] Calculating backoff: t = 2^1 * 1000ms + random_jitter(240ms) = 2240ms.',
            '[3.6s] Worker sleeping in backpressure queue...'
          ]);
          setRetryCount(1);
          setTimeout(() => {
            setLog((prev) => [
              ...prev,
              '[5.8s] 🔄 Retry #1 fired. Upstream API acknowledged HTTP 200 OK.'
            ]);
            setCurrentStep(4);
          }, 2200);
        }, 1200);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setLog((prev) => [...prev, '[3.5s] Upstream API acknowledged HTTP 200 OK.']);
          setCurrentStep(4);
        }, 1200);
        return () => clearTimeout(timer);
      }
    }

    if (currentStep === 4) {
      const timer = setTimeout(() => {
        setLog((prev) => [
          ...prev,
          '[6.8s] ✅ Execution complete. Idempotency lock committed. Run duration: 6.8s.'
        ]);
        setIsRunning(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isRunning, currentStep, retryCount, hasFault]);

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
      {/* Simulation Control Toolbar */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span className="sts-badge sts-badge-brass">Interactive Simulation</span>
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
            Fault Injection & Exponential Backoff Loop
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={hasFault}
              onChange={(e) => setHasFault(e.target.checked)}
              disabled={isRunning}
            />
            <span>Inject 503 Fault</span>
          </label>
          <button
            onClick={runSimulation}
            disabled={isRunning}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.95rem',
              borderRadius: 'var(--sts-pill-radius)',
              background: 'var(--sts-brass)',
              color: '#0E1112',
              fontSize: '0.85rem',
              fontWeight: 600,
              opacity: isRunning ? 0.6 : 1
            }}
          >
            <Play size={13} fill="#0E1112" />
            <span>{isRunning ? 'Executing...' : 'Trigger Pipeline'}</span>
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

      {/* Visual Pipeline Nodes */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        {steps.map((step) => {
          const isDone = currentStep > step.id || (!isRunning && currentStep === 4);
          const isCurrent = currentStep === step.id;
          const isFaultNode = step.id === 3 && retryCount === 1 && isCurrent;

          return (
            <div
              key={step.id}
              style={{
                padding: '1.25rem',
                borderRadius: '10px',
                background: isCurrent ? 'rgba(201, 151, 74, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${
                  isFaultNode
                    ? 'var(--sts-warning)'
                    : isCurrent
                    ? 'var(--sts-brass)'
                    : isDone
                    ? 'rgba(78, 173, 123, 0.4)'
                    : 'var(--sts-border)'
                }`,
                transition: 'all 0.3s ease'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.65rem'
                }}
              >
                <span className="sts-mono" style={{ fontSize: '0.72rem', color: 'var(--sts-dim)' }}>
                  STAGE 0{step.id}
                </span>
                {isDone ? (
                  <CheckCircle size={15} color="var(--sts-success)" />
                ) : isFaultNode ? (
                  <AlertTriangle size={15} color="var(--sts-warning)" />
                ) : isCurrent ? (
                  <Clock size={15} color="var(--sts-brass)" className="animate-spin" />
                ) : null}
              </div>
              <h4 style={{ fontSize: '0.92rem', color: 'var(--sts-bone)', lineHeight: 1.3 }}>
                {step.name}
              </h4>
              <div
                style={{
                  fontSize: '0.75rem',
                  fontFamily: 'var(--sts-font-mono)',
                  color: isFaultNode ? 'var(--sts-warning)' : isCurrent ? 'var(--sts-brass)' : isDone ? 'var(--sts-success)' : 'var(--sts-dim)',
                  marginTop: '0.5rem'
                }}
              >
                {isDone ? 'COMPLETED' : isFaultNode ? '503 BACKOFF...' : isCurrent ? 'EXECUTING...' : 'PENDING'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Execution Telemetry Log */}
      <div
        style={{
          background: '#07090A',
          border: '1px solid var(--sts-border)',
          borderRadius: '8px',
          padding: '1rem',
          fontFamily: 'var(--sts-font-mono)',
          fontSize: '0.8rem',
          lineHeight: 1.6,
          maxHeight: '160px',
          overflowY: 'auto'
        }}
      >
        <div style={{ color: 'var(--sts-dim)', marginBottom: '0.4rem', fontSize: '0.7rem' }}>
          -- RUNNER STATE DISPATCH TELEMETRY --
        </div>
        {log.map((entry, idx) => (
          <div key={idx} style={{ color: entry.includes('⚠️') ? 'var(--sts-warning)' : entry.includes('✅') ? 'var(--sts-success)' : 'var(--sts-bone)' }}>
            {entry}
          </div>
        ))}
      </div>
    </div>
  );
};
