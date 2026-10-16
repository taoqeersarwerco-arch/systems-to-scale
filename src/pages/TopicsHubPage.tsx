import React from 'react';
import { Link } from 'react-router-dom';
import { TOPICS } from '../data/topics';
import { Compass, ArrowRight, ShieldCheck } from 'lucide-react';

export const TopicsHubPage: React.FC = () => {
  return (
    <div style={{ paddingTop: 'calc(var(--sts-header-height) + 3rem)', paddingBottom: '6rem' }}>
      <div className="sts-container">
        {/* Header */}
        <div style={{ maxWidth: '720px', marginBottom: '4rem' }}>
          <div className="sts-badge sts-badge-steel" style={{ marginBottom: '1rem' }}>
            <Compass size={14} />
            <span>Research Disciplines</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.4rem, 4vw, 3.6rem)', marginBottom: '1.25rem' }}>
            Core Engineering Disciplines.
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--sts-muted)', lineHeight: 1.6 }}>
            Systems to Scale structures its research across eight foundational areas. Each topic features an interactive simulation demonstrating the system's underlying mechanics, followed by in-depth technical breakdowns and guides.
          </p>
        </div>

        {/* 8 Topics Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem'
          }}
        >
          {TOPICS.map((topic) => (
            <Link
              key={topic.slug}
              to={`/topics/${topic.slug}`}
              className="sts-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '2.5rem',
                textDecoration: 'none'
              }}
            >
              <div>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--sts-bone)', marginBottom: '0.85rem' }}>
                  {topic.name}
                </h2>

                <p style={{ fontSize: '0.9rem', color: 'var(--sts-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  {topic.scopeParagraph}
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '1.25rem',
                  borderTop: '1px solid var(--sts-border-subtle)',
                  color: 'var(--sts-bone)',
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}
              >
                <span>Explore Topic</span>
                <ArrowRight size={15} color="var(--sts-bone)" />
              </div>
            </Link>
          ))}
        </div>

        {/* The Standard Method Card */}
        <div
          style={{
            background: 'var(--sts-raised)',
            border: '1px solid var(--sts-border)',
            borderRadius: 'var(--sts-card-radius)',
            padding: '2.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem'
          }}
        >
          <div style={{ maxWidth: '640px' }}>
            <div className="sts-badge sts-badge-steel" style={{ marginBottom: '0.75rem' }}>
              <ShieldCheck size={13} />
              <span>The Systems to Scale Standard</span>
            </div>
            <h3 style={{ fontSize: '1.35rem', color: 'var(--sts-bone)', marginBottom: '0.5rem' }}>
              Every article answers three exact questions.
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--sts-muted)', margin: 0, lineHeight: 1.6 }}>
              1. What is the mechanism? 2. How does it physically execute? 3. Why does conventional intuition break under load?
            </p>
          </div>

          <Link
            to="/about#method"
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: 'var(--sts-pill-radius)',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--sts-border)',
              color: 'var(--sts-bone)',
              fontSize: '0.88rem',
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <span>Read Method Protocol</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};
