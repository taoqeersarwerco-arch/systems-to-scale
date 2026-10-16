import React from 'react';
import { Link } from 'react-router-dom';
import { TOPICS } from '../data/topics';
import { StsLogo } from '../components/ui/StsLogo';
import { Shield, BookOpen, Compass, CheckCircle2, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div style={{ paddingTop: 'calc(var(--sts-header-height) + 3rem)', paddingBottom: '6rem' }}>
      <div className="sts-container" style={{ maxWidth: '820px' }}>
        {/* Header */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div className="sts-badge sts-badge-brass" style={{ marginBottom: '1.25rem' }}>
            <span>Editorial Thesis & Mission</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.4rem, 4vw, 3.8rem)', lineHeight: 1.15, marginBottom: '1.5rem' }}>
            About Systems to Scale.
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--sts-bone)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Most modern tech publications publish superficial "how-to" tutorials or vendor-sponsored listicles. We built Systems to Scale for software engineers, systems architects, and technical operators who want to understand the physical mechanism—not just copy 5 steps.
          </p>
        </div>

        {/* Section: The Three-Question Standard (#method) */}
        <section id="method" style={{ marginBottom: '4rem', padding: '2.5rem', background: 'var(--sts-raised)', border: '1px solid var(--sts-border)', borderRadius: 'var(--sts-card-radius)' }}>
          <div className="sts-badge sts-badge-steel" style={{ marginBottom: '1rem' }}>
            <Shield size={13} />
            <span>The Editorial Protocol (#method)</span>
          </div>

          <h2 style={{ fontSize: '1.75rem', color: 'var(--sts-bone)', marginBottom: '1rem' }}>
            The Three-Question Standard
          </h2>

          <p style={{ color: 'var(--sts-muted)', fontSize: '0.95rem', lineHeight: 1.65, marginBottom: '1.75rem' }}>
            Before any article or case study is scheduled for publication, it must withstand three exact questions. If a draft cannot answer all three with primary specifications, it is rejected back to research:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ padding: '1.25rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', borderLeft: '3px solid var(--sts-brass)' }}>
              <strong style={{ color: 'var(--sts-bone)', display: 'block', marginBottom: '0.3rem' }}>
                1. What is the mechanism?
              </strong>
              <span style={{ fontSize: '0.9rem', color: 'var(--sts-muted)' }}>
                Define the technical contract without marketing jargon. What state is being transformed, synchronized, or preserved across process boundaries?
              </span>
            </div>

            <div style={{ padding: '1.25rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', borderLeft: '3px solid var(--sts-steel)' }}>
              <strong style={{ color: 'var(--sts-bone)', display: 'block', marginBottom: '0.3rem' }}>
                2. How does it physically execute?
              </strong>
              <span style={{ fontSize: '0.9rem', color: 'var(--sts-muted)' }}>
                Deconstruct the state machine step-by-step: packet headers, mutex locks, database commit logs, and memory buffers.
              </span>
            </div>

            <div style={{ padding: '1.25rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', borderLeft: '3px solid var(--sts-bone)' }}>
              <strong style={{ color: 'var(--sts-bone)', display: 'block', marginBottom: '0.3rem' }}>
                3. Why does conventional intuition break under load?
              </strong>
              <span style={{ fontSize: '0.9rem', color: 'var(--sts-muted)' }}>
                Demonstrate the failure mode: thundering herds, race conditions, layout thrashing, or double billing. Why did the naive implementation fail in production?
              </span>
            </div>
          </div>
        </section>

        {/* Section: Core Engineering Disciplines */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--sts-bone)', marginBottom: '1.25rem' }}>
            Eight Scoped Domains
          </h2>
          <p style={{ color: 'var(--sts-muted)', fontSize: '0.95rem', lineHeight: 1.65, marginBottom: '2rem' }}>
            We publish comprehensive research across eight core engineering disciplines:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {TOPICS.map((t) => (
              <Link
                key={t.slug}
                to={`/topics/${t.slug}`}
                style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--sts-border)',
                  color: 'var(--sts-bone)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textDecoration: 'none'
                }}
              >
                <span style={{ fontSize: '0.92rem', fontWeight: 500 }}>{t.name}</span>
                <ArrowRight size={14} color="var(--sts-dim)" />
              </Link>
            ))}
          </div>
        </section>

        {/* Section: Byline & Publisher Disclosure */}
        <section style={{ marginBottom: '4rem', padding: '2rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--sts-border)', borderRadius: 'var(--sts-card-radius)' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--sts-bone)', marginBottom: '0.75rem' }}>
            Publisher Disclosure & Contributor Policy
          </h3>
          <p style={{ color: 'var(--sts-muted)', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: '1.25rem' }}>
            Systems to Scale is an independent engineering publication published by Uniqentic. We do not accept sponsored content, paid product placements, or affiliate links that skew editorial integrity.
          </p>
          <p style={{ color: 'var(--sts-muted)', fontSize: '0.9rem', lineHeight: 1.65, margin: 0 }}>
            In accordance with our strict anti-slop guidelines, we reject fabricated author personas. Articles are authored by the Systems to Scale editorial collective and vetted against primary RFCs, W3C specifications, and production engineering case studies.
          </p>
        </section>

        {/* Section: Corrections Link */}
        <div style={{ textAlign: 'center', padding: '1.5rem', borderTop: '1px solid var(--sts-border-subtle)' }}>
          <p style={{ fontSize: '0.88rem', color: 'var(--sts-dim)', margin: 0 }}>
            Technical feedback or corrections? Reach our editorial desk at{' '}
            <Link to="/contact" style={{ color: 'var(--sts-brass)', textDecoration: 'underline' }}>
              editorial inboxes
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};
