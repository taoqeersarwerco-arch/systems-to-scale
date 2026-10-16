import React from 'react';
import { Mail, Clock, ShieldCheck, MessageSquare, AlertCircle } from 'lucide-react';
import { NewsletterCta } from '../components/sections/NewsletterCta';

export const ContactPage: React.FC = () => {
  const inboxes = [
    {
      address: 'corrections@systemstoscale.tech',
      title: 'Technical Corrections Desk',
      sla: 'Acknowledged within 48 hours',
      description: 'Spotted specification drift, an outdated RFC reference, or an inaccurate state machine diagram? Our technical editor handles corrections directly with top priority.'
    },
    {
      address: 'editorial@systemstoscale.tech',
      title: 'Editorial & System Pitches',
      sla: 'Reviewed on weekly cadence',
      description: 'Have you engineered a high-scale production system or solved a severe concurrency bottleneck at your company? Submit architectural post-mortems for peer review.'
    },
    {
      address: 'general@systemstoscale.tech',
      title: 'General & Syndication Desk',
      sla: 'Response within 3–5 business days',
      description: 'Publisher inquiries, academic course syndication, and institutional newsletter subscriptions.'
    }
  ];

  return (
    <div style={{ paddingTop: 'calc(var(--sts-header-height) + 3rem)', paddingBottom: '6rem' }}>
      <div className="sts-container" style={{ maxWidth: '820px' }}>
        {/* Header */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div className="sts-badge sts-badge-brass" style={{ marginBottom: '1.25rem' }}>
            <Mail size={14} />
            <span>Direct Inboxes</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.4rem, 4vw, 3.8rem)', lineHeight: 1.15, marginBottom: '1.25rem' }}>
            Editorial Communications.
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--sts-muted)', lineHeight: 1.6 }}>
            We maintain three dedicated, authenticated inboxes. No automated phone trees, no generic ticket forms—every email is read and routed to a technical editor.
          </p>
        </div>

        {/* 3 Dedicated Inboxes Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', marginBottom: '5rem' }}>
          {inboxes.map((inbox, idx) => (
            <div
              key={inbox.address}
              className="sts-card"
              style={{
                padding: '2.25rem',
                background: 'var(--sts-raised)',
                border: idx === 0 ? '1px solid rgba(201, 151, 74, 0.3)' : '1px solid var(--sts-border)'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}
              >
                <div>
                  <span className="sts-mono" style={{ fontSize: '0.75rem', color: idx === 0 ? 'var(--sts-brass)' : 'var(--sts-dim)' }}>
                    INBOX 0{idx + 1}
                  </span>
                  <h2 style={{ fontSize: '1.35rem', color: 'var(--sts-bone)', marginTop: '0.2rem' }}>
                    {inbox.title}
                  </h2>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--sts-font-mono)',
                    color: 'var(--sts-success)',
                    background: 'rgba(78, 173, 123, 0.08)',
                    padding: '0.3rem 0.65rem',
                    borderRadius: 'var(--sts-pill-radius)',
                    border: '1px solid rgba(78, 173, 123, 0.2)'
                  }}
                >
                  <Clock size={13} />
                  <span>SLA: {inbox.sla}</span>
                </div>
              </div>

              <p style={{ fontSize: '0.92rem', color: 'var(--sts-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {inbox.description}
              </p>

              <div>
                <a
                  href={`mailto:${inbox.address}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.65rem 1.25rem',
                    borderRadius: 'var(--sts-pill-radius)',
                    background: idx === 0 ? 'var(--sts-brass)' : 'rgba(255, 255, 255, 0.05)',
                    color: idx === 0 ? '#0E1112' : 'var(--sts-bone)',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    fontFamily: 'var(--sts-font-mono)'
                  }}
                >
                  <Mail size={15} />
                  <span>{inbox.address}</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter Hook */}
        <NewsletterCta />
      </div>
    </div>
  );
};
