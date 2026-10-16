import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Fuse from 'fuse.js';
import { ALL_ARTICLES, ArticleEntry } from '../data/slug-registry';
import { TOPICS, TopicData } from '../data/topics';
import { Search, Compass, FileText, ArrowRight } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  const articleFuse = new Fuse(ALL_ARTICLES, {
    keys: ['title', 'focusKeyword', 'topic', 'standfirst', 'focusQuestion'],
    threshold: 0.35
  });

  const topicFuse = new Fuse(TOPICS, {
    keys: ['name', 'scopeParagraph', 'badge', 'hook'],
    threshold: 0.35
  });

  const [articleResults, setArticleResults] = useState<ArticleEntry[]>([]);
  const [topicResults, setTopicResults] = useState<TopicData[]>([]);

  useEffect(() => {
    if (query.trim()) {
      setSearchParams({ q: query });
      setArticleResults(articleFuse.search(query).map(r => r.item));
      setTopicResults(topicFuse.search(query).map(r => r.item));
    } else {
      setArticleResults(ALL_ARTICLES.slice(0, 8));
      setTopicResults(TOPICS);
    }
  }, [query]);

  return (
    <div style={{ paddingTop: 'calc(var(--sts-header-height) + 3rem)', paddingBottom: '6rem' }}>
      <div className="sts-container" style={{ maxWidth: '820px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Search Architectural Index</h1>

        {/* Large Search Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem 1.5rem',
            borderRadius: 'var(--sts-pill-radius)',
            background: 'var(--sts-raised)',
            border: '1px solid var(--sts-border)',
            marginBottom: '3rem',
            boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.4)'
          }}
        >
          <Search size={22} color="var(--sts-brass)" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search mechanisms, RFC protocols, idempotency, or rendering..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--sts-bone)',
              fontSize: '1.1rem',
              fontFamily: 'inherit'
            }}
          />
        </div>

        {/* Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {topicResults.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1rem', color: 'var(--sts-dim)', textTransform: 'uppercase', marginBottom: '1rem' }}>
                Matching Topics
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                {topicResults.map((t) => (
                  <Link
                    key={t.slug}
                    to={`/topics/${t.slug}`}
                    style={{
                      padding: '1rem',
                      borderRadius: '8px',
                      background: 'var(--sts-raised)',
                      border: '1px solid var(--sts-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textDecoration: 'none',
                      color: 'var(--sts-bone)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <Compass size={16} color="var(--sts-brass)" />
                      <span style={{ fontWeight: 600 }}>{t.name}</span>
                    </div>
                    <ArrowRight size={14} color="var(--sts-dim)" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--sts-dim)', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Matching Articles ({articleResults.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {articleResults.map((a) => {
                const isLive = a.status === 'published';
                return (
                  <div
                    key={a.slug}
                    style={{
                      padding: '1.25rem 1.5rem',
                      borderRadius: '8px',
                      background: 'var(--sts-raised)',
                      border: '1px solid var(--sts-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span className="sts-mono" style={{ fontSize: '0.72rem', color: 'var(--sts-dim)' }}>
                          {a.topic}
                        </span>
                        {isLive && (
                          <span className="sts-badge sts-badge-brass" style={{ fontSize: '0.62rem', padding: '0.05rem 0.35rem' }}>
                            Live
                          </span>
                        )}
                      </div>
                      <h4 style={{ fontSize: '1.05rem', color: 'var(--sts-bone)', margin: 0 }}>
                        {isLive ? (
                          <Link to={`/articles/${a.slug}`} style={{ color: 'inherit' }}>
                            {a.title}
                          </Link>
                        ) : (
                          a.title
                        )}
                      </h4>
                    </div>

                    {isLive ? (
                      <Link
                        to={`/articles/${a.slug}`}
                        style={{ color: 'var(--sts-brass)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}
                      >
                        <span>Read</span>
                        <ArrowRight size={13} />
                      </Link>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--sts-dim)' }}>
                        Coming Soon
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
