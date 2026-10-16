import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, User, FileText, CheckSquare, MessageSquare } from 'lucide-react';

export const HandoffSim: React.FC = () => {
  const [step, setStep] = useState<number>(1);

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
          <span className="sts-badge sts-badge-brass" style={{ marginBottom: '0.4rem' }}>
            Ops Delegation Protocol
          </span>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--sts-bone)', margin: 0 }}>
            Context-Preserving Async Task Handoff Protocol
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setStep(step === 3 ? 1 : step + 1)}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: 'var(--sts-pill-radius)',
              background: 'var(--sts-brass)',
              color: '#0E1112',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            {step === 3 ? 'Reset Handoff Flow' : 'Advance State →'}
          </button>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
          marginBottom: '1.5rem'
        }}
      >
        {/* Step 1: Definition of Done */}
        <div
          style={{
            padding: '1.5rem',
            borderRadius: '10px',
            background: step >= 1 ? 'rgba(201, 151, 74, 0.08)' : 'rgba(255, 255, 255, 0.02)',
            border: `1px solid ${step >= 1 ? 'var(--sts-brass)' : 'var(--sts-border)'}`
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <FileText size={18} color="var(--sts-brass)" />
            <h4 style={{ fontSize: '0.95rem', margin: 0, color: 'var(--sts-bone)' }}>1. Immutable Inputs & DoD</h4>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--sts-muted)', lineHeight: 1.5 }}>
            SOP reference linked, credential sandbox scoped, and measurable acceptance criteria strictly defined before handoff.
          </p>
        </div>

        {/* Step 2: In-Flight Context Freeze */}
        <div
          style={{
            padding: '1.5rem',
            borderRadius: '10px',
            background: step >= 2 ? 'rgba(201, 151, 74, 0.08)' : 'rgba(255, 255, 255, 0.02)',
            border: `1px solid ${step >= 2 ? 'var(--sts-brass)' : 'var(--sts-border)'}`
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <MessageSquare size={18} color={step >= 2 ? 'var(--sts-brass)' : 'var(--sts-dim)'} />
            <h4 style={{ fontSize: '0.95rem', margin: 0, color: 'var(--sts-bone)' }}>2. Context Snapshot</h4>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--sts-muted)', lineHeight: 1.5 }}>
            Loom video walkthrough timestamped, blockers flagged, and current state snapshot frozen to prevent 24h timezone ping-pong.
          </p>
        </div>

        {/* Step 3: Receiver Acknowledgment */}
        <div
          style={{
            padding: '1.5rem',
            borderRadius: '10px',
            background: step === 3 ? 'rgba(78, 173, 123, 0.08)' : 'rgba(255, 255, 255, 0.02)',
            border: `1px solid ${step === 3 ? 'var(--sts-success)' : 'var(--sts-border)'}`
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <CheckCircle2 size={18} color={step === 3 ? 'var(--sts-success)' : 'var(--sts-dim)'} />
            <h4 style={{ fontSize: '0.95rem', margin: 0, color: 'var(--sts-bone)' }}>3. Verification Handoff</h4>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--sts-muted)', lineHeight: 1.5 }}>
            Operator verifies sandbox access, tests one pilot sample, and formally signs off on receipt of execution ownership.
          </p>
        </div>
      </div>
    </div>
  );
};
