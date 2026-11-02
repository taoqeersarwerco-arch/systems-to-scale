import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { SLUG_REGISTRY } from '../data/slug-registry';
import { ARTICLE_CONTENTS } from '../data/article-contents';
import { GhostLink } from '../components/ui/GhostLink';
import { NewsletterCta } from '../components/sections/NewsletterCta';
import { ArticleHeroChassis } from '../components/articles/ArticleHeroChassis';
import { ArticleExecutiveCockpit } from '../components/articles/ArticleExecutiveCockpit';
import { CrmInteractiveWorkbench } from '../components/articles/CrmInteractiveWorkbench';
import { CrmArchitectureTopology } from '../components/articles/CrmArchitectureTopology';
import { CrmFailureModesExplorer } from '../components/articles/CrmFailureModesExplorer';
import { ArticleReadingHud } from '../components/articles/ArticleReadingHud';
import { ArrowLeft, Clock, Calendar, CheckCircle2, Shield, AlertCircle, AlertTriangle, ExternalLink, HelpCircle, Layers, Info, Activity } from 'lucide-react';

export const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  // Seamless alias for legacy routing link
  const resolvedSlug = slug === 'how-ticket-routing-works' ? 'how-enterprise-crm-works' : slug;
  const article = resolvedSlug ? SLUG_REGISTRY[resolvedSlug] : undefined;
  const detailed = resolvedSlug ? ARTICLE_CONTENTS[resolvedSlug] : undefined;

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
    <article style={{ paddingBottom: '6rem' }}>
      {/* Floating Reading Progress Telemetry Bar (Docked only when scrolled past hero) */}
      <ArticleReadingHud />

      {/* Hero Section (Canonical Observatory Framing matching Topic Detail) */}
      <ArticleHeroChassis
        topic={article.topic}
        topicSlug={article.topicSlug}
        type={article.type}
        title={article.title}
        standfirst={article.standfirst}
        leadParagraph="Enterprise CRM is a distributed operational transaction engine coordinating identity resolution, event streams, and reverse ETL activation across frontline sales, service, and data warehouse meshes."
        publishDate={article.publishDate || 'Nov 02, 2026'}
        readingTime={article.readingTime || '12 min read'}
        rfcSpec="RFC-CRM-2026"
      />

      <div className="sts-container">
        {detailed ? (
          <div>
            {/* First Section: Executive Cockpit (Answer Island & Architectural Spec Sheet) */}
            <div id="cockpit" style={{ scrollMarginTop: '100px' }}>
              <ArticleExecutiveCockpit
                answerIsland={detailed.answerIsland}
                keyTakeaways={detailed.keyTakeaways}
                rfcCode="RFC-CRM-2026"
              />
            </div>

            {/* Second Section: Centerpiece Interactive Simulator */}
            <div id="workbench" style={{ scrollMarginTop: '100px' }}>
              <CrmInteractiveWorkbench />
            </div>

            {/* Third Section: Long-Form Technical Architecture Deep Dive */}
            <div
              style={{
                maxWidth: '840px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '3.5rem',
                fontSize: '1.08rem',
                lineHeight: 1.75,
                color: '#E0E0E0'
              }}
            >

            {/* Sections */}
            {detailed.sections.map((sec, secIdx) => (
              <section
                key={secIdx}
                id={`mechanism-0${secIdx + 1}`}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', scrollMarginTop: '100px' }}
              >
                {sec.badge && (
                  <div
                    style={{
                      alignSelf: 'flex-start',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      fontFamily: 'var(--sts-font-mono)',
                      fontSize: '0.7rem',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      padding: '3px 8px',
                      borderRadius: '3px',
                      fontWeight: 600
                    }}
                  >
                    <span>{sec.badge}</span>
                  </div>
                )}

                <h2 style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.1rem)', color: '#FFFFFF', margin: '0 0 0.5rem 0', lineHeight: 1.2, letterSpacing: '-0.025em' }}>
                  {sec.title}
                </h2>

                {sec.content.map((p, pIdx) => (
                  <p key={pIdx} style={{ margin: 0, lineHeight: 1.75, color: 'rgba(255, 255, 255, 0.85)' }}>
                    {p}
                  </p>
                ))}

                {/* Subsections */}
                {sec.subsections && sec.subsections.map((sub, subIdx) => (
                  <div key={subIdx} style={{ marginTop: '0.75rem', paddingLeft: '1.25rem', borderLeft: '2px solid rgba(255, 255, 255, 0.12)' }}>
                    <h3 style={{ fontSize: '1.18rem', color: '#FFFFFF', margin: '0 0 0.5rem 0', fontWeight: 600 }}>
                      {sub.title}
                    </h3>
                    {sub.content.map((subP, subPIdx) => (
                      <p key={subPIdx} style={{ margin: '0 0 0.75rem 0', lineHeight: 1.7, fontSize: '1rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                        {subP}
                      </p>
                    ))}
                  </div>
                ))}

                {/* Architecture Topology / ASCII Diagram */}
                {sec.diagramAscii && (
                  sec.diagramTitle?.includes('Reference Topology') ? (
                    <CrmArchitectureTopology rawAscii={sec.diagramAscii} />
                  ) : (
                    <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                      {sec.diagramTitle && (
                        <div style={{ fontSize: '0.75rem', fontFamily: 'var(--sts-font-mono)', color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
                          // {sec.diagramTitle}
                        </div>
                      )}
                      <pre
                        style={{
                          background: '#040404',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '6px',
                          padding: '1.25rem',
                          fontFamily: 'var(--sts-font-mono)',
                          fontSize: '0.8rem',
                          lineHeight: 1.45,
                          color: 'rgba(255, 255, 255, 0.85)',
                          overflowX: 'auto',
                          margin: 0
                        }}
                      >
                        {sec.diagramAscii}
                      </pre>
                    </div>
                  )
                )}

                {/* Code Block */}
                {sec.codeBlock && (
                  <div style={{ marginTop: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.75rem', fontFamily: 'var(--sts-font-mono)', color: '#FFFFFF', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
                      // {sec.codeBlock.title}
                    </div>
                    <pre
                      style={{
                        background: '#030303',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '6px',
                        padding: '1.25rem',
                        fontFamily: 'var(--sts-font-mono)',
                        fontSize: '0.82rem',
                        lineHeight: 1.5,
                        color: '#FFFFFF',
                        overflowX: 'auto',
                        margin: 0
                      }}
                    >
                      {sec.codeBlock.code}
                    </pre>
                  </div>
                )}

                {/* Formula */}
                {sec.formula && (
                  <div
                    style={{
                      background: '#090909',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '6px',
                      padding: '1.25rem 1.5rem',
                      fontFamily: 'var(--sts-font-mono)',
                      fontSize: '0.92rem',
                      lineHeight: 1.6,
                      color: '#FFFFFF',
                      marginTop: '0.5rem',
                      marginBottom: '0.5rem'
                    }}
                  >
                    <div style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                      {sec.formula.expression}
                    </div>
                    <div style={{ fontSize: '0.84rem', color: 'rgba(255, 255, 255, 0.65)' }}>
                      {sec.formula.explanation}
                    </div>
                  </div>
                )}

                {/* Failure Modes Interactive Explorer or Standard Data Table */}
                {sec.table && (
                  sec.badge === 'Mechanism 05' ? (
                    <CrmFailureModesExplorer />
                  ) : (
                    <div style={{ marginTop: '1rem', marginBottom: '1rem', overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.16)' }}>
                            {sec.table.headers.map((h, hIdx) => (
                              <th key={hIdx} style={{ padding: '0.75rem 1rem', color: '#FFFFFF', fontFamily: 'var(--sts-font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {sec.table.rows.map((row, rIdx) => (
                            <tr key={rIdx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)', background: rIdx % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent' }}>
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} style={{ padding: '0.85rem 1rem', color: cIdx === 0 ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)', fontWeight: cIdx === 0 ? 600 : 400, verticalAlign: 'top', lineHeight: 1.5 }}>
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                )}

                {/* Callout */}
                {sec.callout && (
                  <div
                    style={{
                      marginTop: '0.75rem',
                      padding: '1.25rem 1.5rem',
                      borderRadius: '6px',
                      background: '#090909',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderLeft: '3px solid #FFFFFF',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#FFFFFF', fontWeight: 600, fontSize: '0.9rem' }}>
                      {sec.callout.type === 'warning' ? <AlertTriangle size={15} color="#FFFFFF" /> : <Info size={15} color="#FFFFFF" />}
                      <span>{sec.callout.title}</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.6 }}>
                      {sec.callout.text}
                    </div>
                  </div>
                )}
              </section>
            ))}
            </div>
          </div>
        ) : (
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
        )}

        {/* Ghost Links & Sibling Cluster Index */}
        <div
          style={{
            marginTop: '4rem',
            padding: '2.25rem',
            borderRadius: '8px',
            background: '#080808',
            border: '1px solid rgba(255, 255, 255, 0.12)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontFamily: 'var(--sts-font-mono)', fontSize: '0.7rem', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.08em', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.1)' }}>
              Spider-Web Architecture Mesh
            </span>
          </div>
          <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '0.5rem', fontWeight: 600 }}>
            Related Articles in {article.topic}
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.55)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            Explore related guides in this field. Published articles are live; others reflect active research.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {article.ghostLinks.map((targetSlug) => (
              <div
                key={targetSlug}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1.15rem',
                  borderRadius: '6px',
                  background: '#0E0E0E',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  transition: 'border-color 0.2s ease'
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
            marginTop: '2.5rem',
            padding: '1.5rem 1.75rem',
            borderRadius: '6px',
            background: '#080808',
            border: '1px solid rgba(255, 255, 255, 0.09)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem'
          }}
        >
          <Shield size={18} color="#FFFFFF" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
          <div>
            <h4 style={{ fontSize: '0.9rem', color: '#FFFFFF', margin: '0 0 0.35rem 0', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: 'var(--sts-font-mono)' }}>
              Editorial Protocol & RFC Verification
            </h4>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.55)', lineHeight: 1.6 }}>
              All architectural topologies, dynamic priority equations, and state machine transitions published on Systems to Scale are audited against real-world production RFC specifications and high-concurrency enterprise benchmarks. Systems to Scale is published by Uniqentic. We do not use fabricated personas or accept sponsored placements.
            </p>
          </div>
        </div>

        {/* Corrections Commitment Block */}
        <div
          style={{
            marginTop: '1.5rem',
            fontSize: '0.82rem',
            color: 'rgba(255, 255, 255, 0.4)',
            textAlign: 'center'
          }}
        >
          Noticed an inaccurate technical detail or specification drift? Email our technical editor at{' '}
          <a href="mailto:corrections@systemstoscale.tech" style={{ color: '#FFFFFF', textDecoration: 'underline' }}>
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
