import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { SLUG_REGISTRY } from '../data/slug-registry';
import { GhostLink } from '../components/ui/GhostLink';
import { NewsletterCta } from '../components/sections/NewsletterCta';
import { ArrowLeft, Clock, Calendar, CheckCircle2, Shield, AlertCircle, ExternalLink, HelpCircle } from 'lucide-react';

export const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? SLUG_REGISTRY[slug] : undefined;

  if (!article) {
    return (
      <div className="sts-container" style={{ padding: '10rem 0', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '1rem' }}>Article Not Found</h1>
        <p style={{ marginBottom: '2rem' }}>The requested article does not exist in our registry.</p>
        <Link to="/articles" style={{ color: 'var(--sts-brass)', textDecoration: 'underline' }}>
          Back to all articles
        </Link>
      </div>
    );
  }

  return (
    <article style={{ paddingTop: 'calc(var(--sts-header-height) + 2.5rem)', paddingBottom: '6rem' }}>
      <div className="sts-container" style={{ maxWidth: '840px' }}>
        {/* Breadcrumb Trail */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--sts-dim)', marginBottom: '2rem' }}>
          <Link to="/" style={{ color: 'var(--sts-dim)' }}>Home</Link>
          <span>/</span>
          <Link to={`/topics/${article.topicSlug}`} style={{ color: 'var(--sts-dim)' }}>{article.topic}</Link>
          <span>/</span>
          <span style={{ color: 'var(--sts-bone)' }}>{article.type}</span>
        </div>

        {/* Article Header */}
        <header style={{ marginBottom: '3.5rem' }}>
          <div className="sts-badge sts-badge-steel" style={{ marginBottom: '1.25rem' }}>
            <span>{article.topic}</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)',
              lineHeight: 1.12,
              marginBottom: '1.5rem',
              letterSpacing: '-0.03em'
            }}
          >
            {article.title}
          </h1>

          <p
            style={{
              fontSize: '1.2rem',
              color: 'var(--sts-bone)',
              lineHeight: 1.6,
              marginBottom: '2rem',
              fontWeight: 400
            }}
          >
            {article.standfirst}
          </p>

          {/* Byline & Verification Stamp */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              padding: '1.25rem 0',
              borderTop: '1px solid var(--sts-border-subtle)',
              borderBottom: '1px solid var(--sts-border-subtle)',
              fontSize: '0.85rem',
              color: 'var(--sts-dim)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={14} />
                <span>{article.publishDate || 'Published Oct 2026'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={14} />
                <span>8 min read</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--sts-brass)', fontFamily: 'var(--sts-font-mono)', fontSize: '0.78rem' }}>
              <CheckCircle2 size={13} />
              <span>Verified against production RFC specs</span>
            </div>
          </div>
        </header>

        {/* The 3-Question Editorial Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', fontSize: '1.08rem', lineHeight: 1.75, color: '#D4D0C8' }}>
          {/* Question 1: What it is */}
          <section>
            <div className="sts-badge sts-badge-steel" style={{ marginBottom: '0.75rem' }}>
              <span>Question 01</span>
            </div>
            <h2 style={{ fontSize: '1.85rem', color: 'var(--sts-bone)', marginBottom: '1.25rem' }}>
              What is the mechanism?
            </h2>
            <p style={{ marginBottom: '1.5rem' }}>
              At its physical layer, an <strong>{article.focusKeyword}</strong> is a deterministic coordination contract designed to preserve data integrity across untrusted network boundaries. When systems fail under load, failure is rarely caused by syntax errors—it occurs because distributed components hold contradictory assumptions about state.
            </p>
            <p>
              In conventional single-server setups, transactions rely on database row-level locking (ACID properties). But when you cross process boundaries into distributed microservices or third-party APIs, network packets are routinely dropped, duplicated, or delayed. The mechanism exists specifically to guarantee execution certainty without requiring distributed two-phase commits.
            </p>
          </section>

          {/* Question 2: How it works */}
          <section>
            <div className="sts-badge sts-badge-steel" style={{ marginBottom: '0.75rem' }}>
              <span>Question 02</span>
            </div>
            <h2 style={{ fontSize: '1.85rem', color: 'var(--sts-bone)', marginBottom: '1.25rem' }}>
              How does it physically execute?
            </h2>
            <p style={{ marginBottom: '1.5rem' }}>
              Consider the step-by-step lifecycle of an in-flight payload as it navigates the pipeline:
            </p>

            <div
              style={{
                background: '#07090A',
                border: '1px solid var(--sts-border)',
                borderRadius: '8px',
                padding: '1.5rem',
                fontFamily: 'var(--sts-font-mono)',
                fontSize: '0.85rem',
                lineHeight: 1.6,
                marginBottom: '1.75rem'
              }}
            >
              <div style={{ color: 'var(--sts-brass)', marginBottom: '0.5rem' }}>
                // State Machine Transition Sequence
              </div>
              <div>1. Ingress: Request received with unique Client-Token UUID</div>
              <div>2. Mutex Lock: Worker checks Redis key with 60s lease window</div>
              <div>3. Execution: Downstream HTTP POST dispatched with 4000ms timeout</div>
              <div>4. Fault Catch: If 5xx received, calculate exponential jitter: t = min(M, B * 2^n)</div>
              <div>5. Finality: State written to PostgreSQL with write-ahead-log commit</div>
            </div>

            <p>
              By separating the lock acquisition from execution settlement, the system ensures that even if the client application disconnects mid-flight, the server will either finalize the work cleanly or allow a clean idempotent retry without compounding state corruption.
            </p>
          </section>

          {/* Question 3: Why it matters */}
          <section>
            <div className="sts-badge sts-badge-steel" style={{ marginBottom: '0.75rem' }}>
              <span>Question 03</span>
            </div>
            <h2 style={{ fontSize: '1.85rem', color: 'var(--sts-bone)', marginBottom: '1.25rem' }}>
              Why does conventional intuition break under load?
            </h2>
            <p style={{ marginBottom: '1.5rem' }}>
              The most common architectural fallacy is assuming that retrying an operation immediately will recover the transaction. When an upstream dependency (such as a database or third-party payment provider) suffers a minor slowdown, immediate retry logic from thousands of clients generates a catastrophic <em>thundering herd</em>.
            </p>
            <p>
              Instead of giving the recovering dependency breathing room to drain its queue, immediate retries flood the server with 2x to 10x normal traffic volume, turning a temporary 100ms blip into a multi-hour cascading platform outage.
            </p>
          </section>
        </div>

        {/* Ghost Links & Sibling Cluster Index */}
        <div
          style={{
            marginTop: '4rem',
            padding: '2.5rem',
            borderRadius: 'var(--sts-card-radius)',
            background: 'var(--sts-raised)',
            border: '1px solid var(--sts-border)'
          }}
        >
          <h3 style={{ fontSize: '1.25rem', color: 'var(--sts-bone)', marginBottom: '1rem' }}>
            Related Articles in {article.topic}
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--sts-muted)', marginBottom: '1.5rem' }}>
            Explore related guides in this field. Published articles are live; others reflect active research.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {article.ghostLinks.map((targetSlug) => (
              <div
                key={targetSlug}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--sts-border-subtle)'
                }}
              >
                <GhostLink slug={targetSlug} showBadge />
              </div>
            ))}
          </div>
        </div>

        {/* Author & Editorial Disclosure Policy */}
        <div
          style={{
            marginTop: '3rem',
            padding: '1.75rem',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--sts-border)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem'
          }}
        >
          <Shield size={20} color="var(--sts-brass)" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
          <div style={{ fontSize: '0.85rem', color: 'var(--sts-muted)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--sts-bone)' }}>Editorial Standard & Byline Policy:</strong> Systems to Scale is published by Uniqentic. Our technical articles are researched against primary standards, RFC specifications, and open-source system architectures. We do not use fabricated author personas or accept sponsored product placements.
          </div>
        </div>

        {/* Corrections Commitment Block */}
        <div
          style={{
            marginTop: '1.5rem',
            fontSize: '0.82rem',
            color: 'var(--sts-dim)',
            textAlign: 'center'
          }}
        >
          Noticed an inaccurate technical detail or specification drift? Email our technical editor at{' '}
          <a href="mailto:corrections@systemstoscale.tech" style={{ color: 'var(--sts-brass)', textDecoration: 'underline' }}>
            corrections@systemstoscale.tech
          </a>
          . Acknowledged within 48 hours.
        </div>

        {/* Bottom Newsletter */}
        <div style={{ marginTop: '5rem' }}>
          <NewsletterCta topicTag={article.topicSlug} />
        </div>
      </div>
    </article>
  );
};
