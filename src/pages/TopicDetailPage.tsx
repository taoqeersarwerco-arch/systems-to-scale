import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TOPIC_MAP, TOPICS } from '../data/topics';
import { ALL_ARTICLES, ArticleEntry } from '../data/slug-registry';
import { PipelineSim } from '../components/topics/PipelineSim';
import { AuctionSim } from '../components/topics/AuctionSim';
import { RenderSim } from '../components/topics/RenderSim';
import { TransactionSim } from '../components/topics/TransactionSim';
import { TicketQueueSim } from '../components/topics/TicketQueueSim';
import { HandoffSim } from '../components/topics/HandoffSim';
import { DeckFormatSim } from '../components/topics/DeckFormatSim';
import { CalendarSim } from '../components/topics/CalendarSim';
import { ArticleRequestModal } from '../components/topics/ArticleRequestModal';
import { NewsletterCta } from '../components/sections/NewsletterCta';
import { ArrowLeft, Search, PlusCircle, ArrowRight, ShieldCheck, FileText } from 'lucide-react';

export const TopicDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const topic = slug ? TOPIC_MAP[slug] : undefined;

  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestQuery, setRequestQuery] = useState('');
  const [filterSearch, setFilterSearch] = useState('');

  if (!topic) {
    return (
      <div className="sts-container" style={{ padding: '10rem 0', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '1rem' }}>Topic Not Found</h1>
        <p style={{ marginBottom: '2rem' }}>The requested topic domain does not exist in our registry.</p>
        <Link to="/topics" style={{ color: 'var(--sts-brass)', textDecoration: 'underline' }}>
          Back to all topics
        </Link>
      </div>
    );
  }

  // Get all articles belonging to this topic
  const topicArticles = ALL_ARTICLES.filter((a) => a.topicSlug === topic.slug);
  const pillar = topicArticles.find((a) => a.type === 'Pillar');
  const clusters = topicArticles.filter((a) => a.type === 'Cluster');
  const sortedArticles = pillar ? [pillar, ...clusters] : topicArticles;

  const filteredArticles = sortedArticles.filter((a) =>
    a.title.toLowerCase().includes(filterSearch.toLowerCase()) ||
    a.focusKeyword.toLowerCase().includes(filterSearch.toLowerCase()) ||
    a.focusQuestion.toLowerCase().includes(filterSearch.toLowerCase())
  );

  const renderSimulation = () => {
    switch (topic.simType) {
      case 'pipeline':
        return <PipelineSim />;
      case 'auction':
        return <AuctionSim />;
      case 'render':
        return <RenderSim />;
      case 'transaction':
        return <TransactionSim />;
      case 'tickets':
        return <TicketQueueSim />;
      case 'handoff':
        return <HandoffSim />;
      case 'deck':
        return <DeckFormatSim />;
      case 'calendar':
        return <CalendarSim />;
      default:
        return <PipelineSim />;
    }
  };

  return (
    <div style={{ paddingTop: 'calc(var(--sts-header-height) + 2rem)', paddingBottom: '6rem' }}>
      <div className="sts-container">
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '2.5rem' }}>
          <Link
            to="/topics"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--sts-dim)',
              fontSize: '0.85rem',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--sts-brass)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--sts-dim)')}
          >
            <ArrowLeft size={14} />
            <span>All Domains</span>
          </Link>
        </div>

        {/* Section 1: Hero & Title */}
        <div style={{ maxWidth: '820px', marginBottom: '3.5rem' }}>
          <div className="sts-badge sts-badge-steel" style={{ marginBottom: '1rem' }}>
            <span>Topic Overview</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', lineHeight: 1.1, marginBottom: '1.25rem' }}>
            {topic.name}
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--sts-bone)', lineHeight: 1.6, marginBottom: '1.5rem', fontWeight: 500 }}>
            {topic.hook}
          </p>
          <p style={{ fontSize: '1rem', color: 'var(--sts-muted)', lineHeight: 1.65 }}>
            {topic.scopeParagraph}
          </p>
        </div>

        {/* Interactive Centerpiece Simulation */}
        <div style={{ marginBottom: '5rem' }}>
          {renderSimulation()}
        </div>

        {/* Section 3: Article Repository Grid */}
        <div style={{ marginBottom: '5rem' }}>
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
              <h2 style={{ fontSize: '1.8rem', color: 'var(--sts-bone)', margin: 0 }}>
                {topic.name} Articles ({topicArticles.length})
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--sts-muted)', marginTop: '0.25rem' }}>
                Foundational guide first, followed by specialized deep dives.
              </p>
            </div>

            {/* In-Page Article Search / Suggest */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--sts-pill-radius)',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--sts-border)',
                width: '100%',
                maxWidth: '280px'
              }}
            >
              <Search size={15} color="var(--sts-dim)" />
              <input
                type="text"
                placeholder="Filter articles..."
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--sts-bone)',
                  fontSize: '0.82rem',
                  fontFamily: 'inherit',
                  width: '100%'
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}
          >
            {filteredArticles.map((article) => {
              const isLive = article.status === 'published';
              const isPillar = article.type === 'Pillar';
              return (
                <div
                  key={article.slug}
                  className="sts-card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '2rem',
                    background: isPillar ? 'rgba(201, 151, 74, 0.04)' : 'var(--sts-raised)',
                    border: isPillar ? '1px solid rgba(201, 151, 74, 0.25)' : '1px solid var(--sts-border)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <span className={`sts-badge ${isPillar ? 'sts-badge-brass' : 'sts-badge-steel'}`} style={{ fontSize: '0.68rem' }}>
                        {isPillar ? 'Foundational Guide' : 'Deep Dive'}
                      </span>
                      {isLive ? (
                        <span className="sts-badge sts-badge-brass" style={{ fontSize: '0.65rem' }}>
                          Live
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.68rem', fontFamily: 'var(--sts-font-mono)', color: 'var(--sts-dim)' }}>
                          Coming Soon
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: '1.25rem', color: 'var(--sts-bone)', lineHeight: 1.3, marginBottom: '0.75rem' }}>
                      {isLive ? (
                        <Link to={`/articles/${article.slug}`} style={{ color: 'inherit' }}>
                          {article.title}
                        </Link>
                      ) : (
                        article.title
                      )}
                    </h3>

                    <p style={{ fontSize: '0.85rem', color: 'var(--sts-muted)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                      {article.standfirst}
                    </p>
                  </div>

                  <div
                    style={{
                      paddingTop: '1rem',
                      borderTop: '1px solid var(--sts-border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span className="sts-mono" style={{ fontSize: '0.72rem', color: 'var(--sts-dim)' }}>
                      {article.publishDate ? article.publishDate : 'Technical Guide'}
                    </span>
                    {isLive ? (
                      <Link
                        to={`/articles/${article.slug}`}
                        style={{ color: 'var(--sts-brass)', fontSize: '0.82rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                      >
                        <span>Read</span>
                        <ArrowRight size={13} />
                      </Link>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--sts-dim)' }}>
                        In Queue
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section 4: 2-Way Article Request Trigger */}
          <div
            style={{
              padding: '2rem',
              borderRadius: 'var(--sts-card-radius)',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px dashed var(--sts-border)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.25rem'
            }}
          >
            <div>
              <h4 style={{ fontSize: '1.1rem', color: 'var(--sts-bone)', marginBottom: '0.3rem' }}>
                Need a specific mechanism explained in {topic.name}?
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--sts-muted)', margin: 0 }}>
                Our research calendar is shaped directly by subscriber demand. Submit your technical inquiry.
              </p>
            </div>

            <button
              onClick={() => {
                setRequestQuery(filterSearch);
                setRequestModalOpen(true);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.65rem 1.25rem',
                borderRadius: 'var(--sts-pill-radius)',
                background: '#FFFFFF',
                color: '#000000',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}
            >
              <PlusCircle size={15} />
              <span>Request Article in {topic.name}</span>
            </button>
          </div>
        </div>

        {/* Section 5: The Standard Method Card */}
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
            gap: '1.5rem',
            marginBottom: '4rem'
          }}
        >
          <div style={{ maxWidth: '640px' }}>
            <div className="sts-badge sts-badge-steel" style={{ marginBottom: '0.75rem' }}>
              <ShieldCheck size={13} />
              <span>The Standard</span>
            </div>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--sts-bone)', marginBottom: '0.4rem' }}>
              How we test and cite claims in {topic.name}.
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--sts-muted)', margin: 0, lineHeight: 1.6 }}>
              Every analysis leans only on primary specifications (RFCs, W3C/WHATWG specs, processor documentation, and OpenRTB standards). No second-hand blog summaries.
            </p>
          </div>

          <Link
            to="/about#method"
            style={{
              padding: '0.6rem 1.2rem',
              borderRadius: 'var(--sts-pill-radius)',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--sts-border)',
              color: 'var(--sts-bone)',
              fontSize: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <span>Read Method</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Section 6: Topic-Scoped Newsletter CTA */}
        <NewsletterCta topicTag={topic.slug} />
      </div>

      {/* Article Request Modal */}
      <ArticleRequestModal
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        defaultTopic={topic.name}
        initialQuery={requestQuery}
      />
    </div>
  );
};
