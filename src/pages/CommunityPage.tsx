import React, { useState } from 'react';
import { Users, Sparkles, MessageSquare, PlusCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { ArticleRequestModal } from '../components/topics/ArticleRequestModal';
import { NewsletterCta } from '../components/sections/NewsletterCta';

export const CommunityPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const readerRequests = [
    {
      topic: 'AI & Automation',
      query: 'Webhook Delivery Retries Under 48h Upstream Outage',
      count: 24,
      status: 'Research In Progress'
    },
    {
      topic: 'E-commerce',
      query: 'Preventing Two-Phase Commit Locks on Sharded Inventory',
      count: 19,
      status: 'Editorial Outline'
    },
    {
      topic: 'Marketing & Ads',
      query: 'Consent Mode v2 Cookieless Pings: Mathematical Probabilities',
      count: 16,
      status: 'Scheduled for November'
    },
    {
      topic: 'Web Design',
      query: 'INP Layout Thrashing from Complex Canvas Animations',
      count: 12,
      status: 'Reviewing Draft'
    }
  ];

  return (
    <div style={{ paddingTop: 'calc(var(--sts-header-height) + 3rem)', paddingBottom: '6rem' }}>
      <div className="sts-container" style={{ maxWidth: '840px' }}>
        {/* Header */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div className="sts-badge sts-badge-brass" style={{ marginBottom: '1.25rem' }}>
            <Users size={14} />
            <span>Subscriber Collective</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.4rem, 4vw, 3.8rem)', lineHeight: 1.15, marginBottom: '1.25rem' }}>
            The Systems Community.
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--sts-muted)', lineHeight: 1.6 }}>
            A gathering of engineers, ops architects, and technical operators who prioritize mechanical truth over promotional fluff. Here is what readers are asking us to dissect next.
          </p>
        </div>

        {/* Reader Demand Leaderboard */}
        <div style={{ marginBottom: '4rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              borderBottom: '1px solid var(--sts-border-subtle)',
              paddingBottom: '1rem'
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--sts-bone)', margin: 0 }}>
                Reader Request Leaderboard
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--sts-muted)', marginTop: '0.2rem' }}>
                Active architectural requests voted on by weekly dispatch subscribers.
              </p>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.55rem 1rem',
                borderRadius: 'var(--sts-pill-radius)',
                background: 'var(--sts-brass)',
                color: '#0E1112',
                fontWeight: 600,
                fontSize: '0.82rem'
              }}
            >
              <PlusCircle size={14} />
              <span>Submit Topic Request</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {readerRequests.map((item, idx) => (
              <div
                key={idx}
                className="sts-card"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  background: 'var(--sts-raised)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                    <span className="sts-mono" style={{ fontSize: '0.72rem', color: 'var(--sts-brass)' }}>
                      {item.topic}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--sts-dim)' }}>·</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--sts-dim)', fontFamily: 'var(--sts-font-mono)' }}>
                      {item.count} subscribers requested
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--sts-bone)', margin: 0 }}>
                    "{item.query}"
                  </h3>
                </div>

                <span className="sts-badge sts-badge-steel" style={{ fontSize: '0.7rem' }}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Community Roadmap */}
        <div
          style={{
            padding: '2.5rem',
            borderRadius: 'var(--sts-card-radius)',
            background: 'var(--sts-raised)',
            border: '1px solid var(--sts-border)',
            marginBottom: '4rem'
          }}
        >
          <div className="sts-badge sts-badge-steel" style={{ marginBottom: '1rem' }}>
            <span>Roadmap</span>
          </div>
          <h3 style={{ fontSize: '1.35rem', color: 'var(--sts-bone)', marginBottom: '0.75rem' }}>
            Open Discussion Channels & Architecture Reviews
          </h3>
          <p style={{ color: 'var(--sts-muted)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            As subscriber density compounds across our core disciplines, we will open peer-reviewed technical teardowns where community members can submit production architecture diagrams for public analysis.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--sts-brass)' }}>
            <CheckCircle2 size={15} />
            <span>Targeting rollout as our core technical series is published.</span>
          </div>
        </div>

        {/* Newsletter CTA */}
        <NewsletterCta />
      </div>

      <ArticleRequestModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultTopic="Community Suggestion"
      />
    </div>
  );
};
