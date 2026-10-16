import React from 'react';
import { NewsletterCta } from '../components/sections/NewsletterCta';
import { Mail, CheckCircle2, Shield, Sparkles } from 'lucide-react';

export const SubscribePage: React.FC = () => {
  return (
    <div style={{ paddingTop: 'calc(var(--sts-header-height) + 3rem)', paddingBottom: '6rem' }}>
      <div className="sts-container" style={{ maxWidth: '820px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="sts-badge sts-badge-brass" style={{ marginBottom: '1.25rem' }}>
            <Sparkles size={14} />
            <span>Weekly Mechanism Dispatch</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', lineHeight: 1.15, marginBottom: '1.25rem' }}>
            One System Explained. Every Thursday.
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--sts-muted)', lineHeight: 1.6, maxWidth: '640px', margin: '0 auto' }}>
            Join software engineers, technical founders, and systems architects who receive our weekly mechanism breakdown.
          </p>
        </div>

        {/* Benefits Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
            marginBottom: '4rem'
          }}
        >
          <div style={{ padding: '1.75rem', borderRadius: '10px', background: 'var(--sts-raised)', border: '1px solid var(--sts-border)' }}>
            <CheckCircle2 size={22} color="var(--sts-brass)" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--sts-bone)', marginBottom: '0.4rem' }}>
              Zero Marketing Listicles
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--sts-muted)', lineHeight: 1.5, margin: 0 }}>
              No "top 10 AI tools" roundup posts. Only physical architectures, RFC protocols, and production post-mortems.
            </p>
          </div>

          <div style={{ padding: '1.75rem', borderRadius: '10px', background: 'var(--sts-raised)', border: '1px solid var(--sts-border)' }}>
            <CheckCircle2 size={22} color="var(--sts-steel)" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--sts-bone)', marginBottom: '0.4rem' }}>
              Double-Opt-In Privacy
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--sts-muted)', lineHeight: 1.5, margin: 0 }}>
              Hosted via Kit API with strict GDPR double opt-in. We never sell, track, or share subscriber data.
            </p>
          </div>

          <div style={{ padding: '1.75rem', borderRadius: '10px', background: 'var(--sts-raised)', border: '1px solid var(--sts-border)' }}>
            <CheckCircle2 size={22} color="var(--sts-success)" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--sts-bone)', marginBottom: '0.4rem' }}>
              One-Click Unsubscribe
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--sts-muted)', lineHeight: 1.5, margin: 0 }}>
              Every single email contains a clear, instant one-click unsubscribe link. Zero retention games.
            </p>
          </div>
        </div>

        {/* Newsletter Form Panel */}
        <NewsletterCta />
      </div>
    </div>
  );
};
