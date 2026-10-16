import React, { useState } from 'react';
import { Play, RotateCcw, AlertCircle, Headphones, Clock, ArrowRight } from 'lucide-react';

interface Ticket {
  id: string;
  customer: string;
  tier: 'Enterprise' | 'Pro' | 'Standard';
  slaMinutesRemaining: number;
  assignedAgent?: string;
}

export const TicketQueueSim: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([
    { id: 'TCK-801', customer: 'Acme Global (VIP)', tier: 'Enterprise', slaMinutesRemaining: 18 },
    { id: 'TCK-802', customer: 'Starlight Retail', tier: 'Standard', slaMinutesRemaining: 140 },
    { id: 'TCK-803', customer: 'Vanguard FinTech', tier: 'Enterprise', slaMinutesRemaining: 4 },
    { id: 'TCK-804', customer: 'Nexus Cloud', tier: 'Pro', slaMinutesRemaining: 55 }
  ]);
  const [isSorted, setIsSorted] = useState(false);

  // Dynamic SLA Priority Queue calculation: Enterprise first, then lowest SLA remaining
  const prioritizedTickets = [...tickets].sort((a, b) => {
    if (a.tier === 'Enterprise' && b.tier !== 'Enterprise') return -1;
    if (b.tier === 'Enterprise' && a.tier !== 'Enterprise') return 1;
    return a.slaMinutesRemaining - b.slaMinutesRemaining;
  });

  const displayList = isSorted ? prioritizedTickets : tickets;

  const handleRoute = () => {
    setIsSorted(true);
  };

  const reset = () => {
    setIsSorted(false);
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
            Queue Scheduler
          </span>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--sts-bone)', margin: 0 }}>
            Dynamic SLA Priority Ticket Queue & Routing Engine
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={handleRoute}
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
            <span>Apply SLA Routing Algorithm</span>
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {displayList.map((t, idx) => {
          const isUrgent = t.slaMinutesRemaining < 30;
          return (
            <div
              key={t.id}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                borderRadius: '8px',
                background: isUrgent && isSorted ? 'rgba(217, 83, 79, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${isUrgent && isSorted ? 'rgba(217, 83, 79, 0.35)' : 'var(--sts-border)'}`,
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span className="sts-mono" style={{ fontSize: '0.8rem', color: isSorted ? 'var(--sts-steel)' : 'var(--sts-dim)' }}>
                  Queue #{idx + 1}
                </span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--sts-bone)' }}>
                    {t.customer}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--sts-dim)' }}>
                    ID: {t.id} · Tier: <span style={{ color: t.tier === 'Enterprise' ? 'var(--sts-brass)' : 'var(--sts-bone)' }}>{t.tier}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--sts-font-mono)', fontSize: '0.85rem', color: isUrgent ? 'var(--sts-danger)' : 'var(--sts-muted)' }}>
                  <Clock size={14} />
                  <span>{t.slaMinutesRemaining}m SLA window</span>
                </div>
                {isSorted && (
                  <span className={`sts-badge ${t.tier === 'Enterprise' ? 'sts-badge-brass' : 'sts-badge-steel'}`} style={{ fontSize: '0.68rem' }}>
                    {idx === 0 ? 'Assigned: Tier-3 Lead' : 'Assigned: Standard Pool'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
