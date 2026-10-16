import React, { useState } from 'react';
import { Presentation, AlertTriangle, CheckCircle, FileCode } from 'lucide-react';

export const DeckFormatSim: React.FC = () => {
  const [format, setFormat] = useState<'vector' | 'raster' | 'fallback'>('vector');

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
            Fidelity Inspector
          </span>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--sts-bone)', margin: 0 }}>
            Slide Export Vector vs. Raster Fidelity Degradation
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['vector', 'raster', 'fallback'] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => setFormat(fmt)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--sts-pill-radius)',
                background: format === fmt ? 'var(--sts-brass)' : 'rgba(255, 255, 255, 0.05)',
                color: format === fmt ? '#0E1112' : 'var(--sts-bone)',
                fontSize: '0.8rem',
                fontWeight: 600,
                textTransform: 'capitalize'
              }}
            >
              {fmt === 'vector' ? 'Native Vector (Keynote)' : fmt === 'raster' ? 'Rasterized (72dpi PDF)' : 'Font Clashing (PPTX)'}
            </button>
          ))}
        </div>
      </div>

      {/* Slide Preview Window */}
      <div
        style={{
          height: '220px',
          borderRadius: '8px',
          background: '#07090A',
          border: '1px solid var(--sts-border)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          filter: format === 'raster' ? 'blur(1.2px)' : 'none',
          padding: '2rem'
        }}
      >
        <div
          style={{
            fontFamily: format === 'fallback' ? 'Times New Roman, serif' : 'var(--sts-font-display)',
            fontSize: '2rem',
            fontWeight: 700,
            color: 'var(--sts-bone)',
            letterSpacing: format === 'fallback' ? '0.15em' : '-0.03em',
            marginBottom: '0.5rem'
          }}
        >
          $12.4M ARR Cohort Retention
        </div>
        <div style={{ fontSize: '0.9rem', color: 'var(--sts-brass)', fontFamily: 'var(--sts-font-mono)' }}>
          {format === 'vector'
            ? '100% Vector Math · Anti-aliased at 4K resolution'
            : format === 'raster'
            ? '⚠️ 72 DPI Compression Artifacts · Edge ringing visible on retina'
            : '⚠️ Custom font stripped: Fallback serif injected with misaligned baseline'}
        </div>
      </div>
    </div>
  );
};
