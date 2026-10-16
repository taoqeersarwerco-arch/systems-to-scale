import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ALL_ARTICLES, ArticleEntry } from '../data/slug-registry';
import { TOPICS } from '../data/topics';
import { Search, Filter, BookOpen, ArrowRight, Layers } from 'lucide-react';

export const ArticlesPage: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'planned'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = ALL_ARTICLES.filter((article) => {
    const matchesTopic = selectedTopic === 'all' || article.topicSlug === selectedTopic;
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.focusKeyword.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.standfirst.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTopic && matchesStatus && matchesSearch;
  });

  return (
    <div style={{ paddingTop: 'calc(var(--sts-header-height) + 3rem)', paddingBottom: '6rem' }}>
      <div className="sts-container">
        {/* Header */}
        <div style={{ maxWidth: '720px', marginBottom: '3.5rem' }}>
          <div className="sts-badge sts-badge-steel" style={{ marginBottom: '1rem' }}>
            <BookOpen size={14} />
            <span>All Research</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.4rem, 4vw, 3.6rem)', marginBottom: '1.25rem' }}>
            All 40 Technical Articles.
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--sts-muted)', lineHeight: 1.6 }}>
            Every article is built on the three-question standard: What it is, How it physically works, and Why it matters under production load.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            marginBottom: '2.5rem',
            padding: '1.25rem 1.5rem',
            background: 'var(--sts-raised)',
            border: '1px solid var(--sts-border)',
            borderRadius: 'var(--sts-card-radius)'
          }}
        >
          {/* Topic Select */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--sts-dim)', marginRight: '0.5rem' }}>Domain:</span>
            <button
              onClick={() => setSelectedTopic('all')}
              style={{
                padding: '0.35rem 0.8rem',
                borderRadius: 'var(--sts-pill-radius)',
                background: selectedTopic === 'all' ? 'var(--sts-brass)' : 'rgba(255, 255, 255, 0.04)',
                color: selectedTopic === 'all' ? '#0E1112' : 'var(--sts-bone)',
                fontSize: '0.78rem',
                fontWeight: 600
              }}
            >
              All (40)
            </button>
            {TOPICS.map((t) => (
              <button
                key={t.slug}
                onClick={() => setSelectedTopic(t.slug)}
                style={{
                  padding: '0.35rem 0.8rem',
                  borderRadius: 'var(--sts-pill-radius)',
                  background: selectedTopic === t.slug ? 'var(--sts-brass)' : 'rgba(255, 255, 255, 0.04)',
                  color: selectedTopic === t.slug ? '#0E1112' : 'var(--sts-bone)',
                  fontSize: '0.78rem',
                  fontWeight: selectedTopic === t.slug ? 600 : 400
                }}
              >
                {t.name}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--sts-pill-radius)',
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid var(--sts-border)',
              width: '100%',
              maxWidth: '300px'
            }}
          >
            <Search size={15} color="var(--sts-dim)" />
            <input
              type="text"
              placeholder="Search keyword or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--sts-bone)',
                fontSize: '0.85rem',
                fontFamily: 'inherit',
                width: '100%'
              }}
            />
          </div>
        </div>

        {/* Article Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {filtered.map((article) => {
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
                  background: 'var(--sts-raised)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span className="sts-badge" style={{ fontSize: '0.68rem' }}>
                      {article.topic}
                    </span>
                    {isLive ? (
                      <span className="sts-badge sts-badge-brass" style={{ fontSize: '0.65rem' }}>
                        Live
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.68rem', fontFamily: 'var(--sts-font-mono)', color: 'var(--sts-dim)' }}>
                        Planned
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
                    {isPillar ? 'Foundational Guide' : 'Deep Dive'}
                  </span>

                  {isLive ? (
                    <Link
                      to={`/articles/${article.slug}`}
                      style={{ color: 'var(--sts-brass)', fontSize: '0.82rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <span>Read Article</span>
                      <ArrowRight size={13} />
                    </Link>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--sts-dim)' }}>
                      In Research
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
