import React, { useState } from 'react';
import { CreditCard, ShieldCheck, AlertCircle, RotateCcw, Check, ArrowRight } from 'lucide-react';

export const TransactionSim: React.FC = () => {
  const [clickCount, setClickCount] = useState<number>(0);
  const [idempotencyKey, setIdempotencyKey] = useState<string>('idemp_9f81a7b2-3c8e');
  const [chargesProcessed, setChargesProcessed] = useState<number>(0);
  const [statusLog, setStatusLog] = useState<string[]>(['Ready for customer payment submission.']);

  const handlePayClick = () => {
    const nextCount = clickCount + 1;
    setClickCount(nextCount);

    if (nextCount === 1) {
      setChargesProcessed(1);
      setStatusLog((prev) => [
        ...prev,
        `[Request #1] POST /v1/charges with Header: Idempotency-Key: ${idempotencyKey}`,
        `[Server Lock] Key ${idempotencyKey} locked in Redis with 120s TTL.`,
        `[Acquiring Bank] Authorization hold of $149.00 approved. TxID: ch_3N8gLp2eZv.`
      ]);
    } else {
      setStatusLog((prev) => [
        ...prev,
        `⚠️ [Duplicate Detected] Rapid double-click registered (Attempt #${nextCount}).`,
        `[Idempotency Guard] Key ${idempotencyKey} already locked in-flight.`,
        `[Bypassed] Card network NOT charged again. Cached original response returned safely.`
      ]);
    }
  };

  const reset = () => {
    setClickCount(0);
    setChargesProcessed(0);
    setIdempotencyKey(`idemp_${Math.random().toString(36).substring(2, 10)}`);
    setStatusLog(['Simulation reset with fresh UUID idempotency key.']);
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
          <span className="sts-badge sts-badge-brass" style={{ marginBottom: '0.4rem' }}>
            Distributed State Machine
          </span>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--sts-bone)', margin: 0 }}>
            Idempotent Payment Settlement & Double-Charge Guard
          </h3>
        </div>

        <button
          onClick={reset}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.45rem 0.85rem',
            borderRadius: 'var(--sts-pill-radius)',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--sts-border)',
            color: 'var(--sts-muted)',
            fontSize: '0.8rem'
          }}
        >
          <RotateCcw size={14} />
          <span>New Session</span>
        </button>
      </div>

      {/* Checkout Card Action */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}
      >
        <div
          style={{
            padding: '1.5rem',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--sts-border)'
          }}
        >
          <div style={{ fontSize: '0.75rem', fontFamily: 'var(--sts-font-mono)', color: 'var(--sts-dim)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Checkout Action
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--sts-bone)', marginBottom: '1rem' }}>
            Total Order: $149.00
          </div>
          <button
            onClick={handlePayClick}
            style={{
              width: '100%',
              padding: '0.85rem',
              borderRadius: 'var(--sts-pill-radius)',
              background: 'var(--sts-brass)',
              color: '#0E1112',
              fontWeight: 700,
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 16px -2px var(--sts-brass-glow)'
            }}
          >
            <CreditCard size={18} />
            <span>Click to Pay (Try Double-Clicking)</span>
          </button>
          <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--sts-dim)', marginTop: '0.75rem' }}>
            Clicks registered: <strong style={{ color: 'var(--sts-bone)' }}>{clickCount}</strong>
          </div>
        </div>

        {/* Ledger State */}
        <div
          style={{
            padding: '1.5rem',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--sts-border)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--sts-font-mono)', color: 'var(--sts-dim)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Ledger State
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
              <ShieldCheck size={28} color={chargesProcessed === 1 ? 'var(--sts-success)' : 'var(--sts-dim)'} />
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--sts-bone)' }}>
                  Bank Authorizations: {chargesProcessed}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--sts-muted)' }}>
                  {chargesProcessed === 1 ? 'Zero duplicate charges incurred.' : 'Awaiting payment request.'}
                </div>
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.75rem', fontFamily: 'var(--sts-font-mono)', color: 'var(--sts-dim)', marginTop: '1rem' }}>
            Active Key: <span style={{ color: 'var(--sts-brass)' }}>{idempotencyKey}</span>
          </div>
        </div>
      </div>

      {/* Transaction Log */}
      <div
        style={{
          background: '#07090A',
          border: '1px solid var(--sts-border)',
          borderRadius: '8px',
          padding: '1rem',
          fontFamily: 'var(--sts-font-mono)',
          fontSize: '0.78rem',
          lineHeight: 1.6,
          maxHeight: '150px',
          overflowY: 'auto'
        }}
      >
        <div style={{ color: 'var(--sts-dim)', marginBottom: '0.4rem', fontSize: '0.68rem' }}>
          -- PAYMENT GATEWAY PROTOCOL DUMP --
        </div>
        {statusLog.map((log, i) => (
          <div key={i} style={{ color: log.includes('⚠️') ? 'var(--sts-warning)' : log.includes('approved') ? 'var(--sts-success)' : 'var(--sts-bone)' }}>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};
