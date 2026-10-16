import React, { useState } from 'react';
import { Play, RotateCcw, Zap } from 'lucide-react';

interface Bidder {
  id: string;
  name: string;
  bid: number;
  qualityScore: number;
}

export const AuctionSim: React.FC = () => {
  const [bidders, setBidders] = useState<Bidder[]>([
    { id: 'dsp-a', name: 'DSP Alpha (Brand)', bid: 6.50, qualityScore: 9.2 },
    { id: 'dsp-b', name: 'DSP Beta (Direct)', bid: 8.20, qualityScore: 5.4 },
    { id: 'dsp-c', name: 'DSP Gamma (Retargeting)', bid: 4.80, qualityScore: 8.8 },
    { id: 'dsp-d', name: 'DSP Delta (Affiliate)', bid: 3.10, qualityScore: 6.0 }
  ]);
  const [hasSettled, setHasSettled] = useState(false);

  // Calculate Ad Rank = Bid * Quality Score
  const ranked = [...bidders].map((b) => ({
    ...b,
    adRank: parseFloat((b.bid * b.qualityScore).toFixed(2))
  })).sort((a, b) => b.adRank - a.adRank);

  const winner = ranked[0];
  const runnerUp = ranked[1];

  // Second-price settlement: Price = (RunnerUp AdRank / Winner QualityScore) + 0.01
  const clearingPrice = parseFloat(((runnerUp.adRank / winner.qualityScore) + 0.01).toFixed(2));

  const runAuction = () => {
    setHasSettled(true);
  };

  const reset = () => {
    setHasSettled(false);
  };

  const updateBid = (id: string, newBid: number) => {
    setBidders(bidders.map(b => b.id === id ? { ...b, bid: Math.max(0.5, newBid) } : b));
    setHasSettled(false);
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
          marginBottom: '1.75rem',
          borderBottom: '1px solid var(--sts-border-subtle)',
          paddingBottom: '1.25rem'
        }}
      >
        <div>
          <span className="sts-badge sts-badge-steel" style={{ marginBottom: '0.4rem' }}>
            OpenRTB 3.0 Simulator
          </span>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--sts-bone)', margin: 0 }}>
            Vickrey Generalized Second-Price (GSP) Auction Engine
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={runAuction}
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
            <span>Settle Auction (100ms)</span>
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

      {/* Bidders Table */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
        {ranked.map((b, idx) => {
          const isWinner = hasSettled && idx === 0;
          return (
            <div
              key={b.id}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                borderRadius: '8px',
                background: isWinner ? 'rgba(127, 168, 184, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${isWinner ? 'var(--sts-steel)' : 'var(--sts-border)'}`,
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <span className="sts-mono" style={{ fontSize: '0.8rem', color: isWinner ? 'var(--sts-steel)' : 'var(--sts-dim)' }}>
                  #{idx + 1}
                </span>
                <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>{b.name}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--sts-dim)' }}>Bid: $</span>
                  <input
                    type="number"
                    step="0.10"
                    value={b.bid}
                    onChange={(e) => updateBid(b.id, parseFloat(e.target.value) || 0)}
                    style={{
                      width: '65px',
                      padding: '0.2rem 0.4rem',
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid var(--sts-border)',
                      borderRadius: '4px',
                      color: 'var(--sts-bone)',
                      fontFamily: 'var(--sts-font-mono)',
                      fontSize: '0.82rem'
                    }}
                  />
                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--sts-muted)' }}>
                  QS: <span style={{ color: 'var(--sts-bone)', fontFamily: 'var(--sts-font-mono)' }}>{b.qualityScore}</span>
                </div>

                <div style={{ fontSize: '0.85rem', fontFamily: 'var(--sts-font-mono)', minWidth: '95px', textAlign: 'right' }}>
                  AdRank: <span style={{ color: isWinner ? 'var(--sts-steel)' : 'var(--sts-bone)', fontWeight: 600 }}>{b.adRank}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Settlement Box */}
      {hasSettled ? (
        <div
          style={{
            padding: '1.5rem',
            borderRadius: '8px',
            background: '#07090A',
            border: '1px solid var(--sts-steel)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            animation: 'fadeIn 0.3s ease'
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--sts-font-mono)', color: 'var(--sts-steel)', textTransform: 'uppercase' }}>
              Auction Settled in 68ms
            </div>
            <div style={{ fontSize: '1.05rem', color: 'var(--sts-bone)', marginTop: '0.2rem' }}>
              Winner: <strong style={{ color: 'var(--sts-steel)' }}>{winner.name}</strong> (AdRank {winner.adRank})
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--sts-muted)', marginTop: '0.25rem' }}>
              Original Bid: ${winner.bid.toFixed(2)} CPM · Runner-up AdRank: {runnerUp.adRank}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--sts-font-mono)', color: 'var(--sts-dim)', textTransform: 'uppercase' }}>
              Clearing Price Paid
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--sts-bone)', fontFamily: 'var(--sts-font-mono)' }}>
              ${clearingPrice.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--sts-success)' }}>
              Saved ${(winner.bid - clearingPrice).toFixed(2)} via Vickrey GSP
            </div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--sts-dim)', fontSize: '0.82rem' }}>
          Adjust bids above and click "Settle Auction" to simulate Vickrey second-price resolution.
        </div>
      )}
    </div>
  );
};
