import React, { useState } from 'react';
import { Calendar, CheckCircle2, RotateCcw, Play, Clock } from 'lucide-react';

interface Meeting {
  id: string;
  title: string;
  slot: string;
  priorityWeight: number; // 1-10
  status: 'clashing' | 'resolved' | 'locked';
}

export const CalendarSim: React.FC = () => {
  const [resolved, setResolved] = useState(false);

  const initialMeetings: Meeting[] = [
    { id: 'm1', title: 'Q4 Board Review (Executive)', slot: '2:00 PM - 3:30 PM', priorityWeight: 10, status: 'locked' },
    { id: 'm2', title: 'Vendor API Integration Sync', slot: resolved ? '4:00 PM - 4:30 PM' : '2:30 PM - 3:00 PM', priorityWeight: 4, status: resolved ? 'resolved' : 'clashing' }
  ];

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
            Constraint Solver
          </span>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--sts-bone)', margin: 0 }}>
            Multi-Calendar Constraint-Satisfaction Conflict Resolver
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setResolved(true)}
            disabled={resolved}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: 'var(--sts-pill-radius)',
              background: 'var(--sts-steel)',
              color: '#0E1112',
              fontWeight: 600,
              fontSize: '0.85rem',
              opacity: resolved ? 0.6 : 1
            }}
          >
            Solve Conflict
          </button>
          <button
            onClick={() => setResolved(false)}
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {initialMeetings.map((m) => (
          <div
            key={m.id}
            style={{
              padding: '1.25rem 1.5rem',
              borderRadius: '8px',
              background: m.status === 'clashing' ? 'rgba(217, 83, 79, 0.08)' : m.status === 'resolved' ? 'rgba(78, 173, 123, 0.08)' : 'rgba(255, 255, 255, 0.02)',
              border: `1px solid ${m.status === 'clashing' ? 'rgba(217, 83, 79, 0.35)' : m.status === 'resolved' ? 'rgba(78, 173, 123, 0.35)' : 'var(--sts-border)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--sts-bone)' }}>
                {m.title}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--sts-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                <Clock size={13} />
                <span>{m.slot}</span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className={`sts-badge ${m.status === 'clashing' ? 'sts-badge-brass' : 'sts-badge-steel'}`} style={{ fontSize: '0.7rem' }}>
                {m.status === 'clashing' ? '⚠️ Conflict: Overlaps 30m' : m.status === 'resolved' ? '✅ Shifted to 4:00 PM Buffer' : 'Priority 10: Locked'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
