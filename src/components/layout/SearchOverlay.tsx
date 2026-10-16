import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { Search, X, ArrowRight, Clock, FileText, Compass, Send } from 'lucide-react';
import { ALL_ARTICLES, ArticleEntry } from '../../data/slug-registry';
import { TOPICS, TopicData } from '../../data/topics';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestArticle?: (query?: string) => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({
  isOpen,
  onClose,
  onRequestArticle
}) => {
  const [query, setQuery] = useState('');
  const [articleResults, setArticleResults] = useState<ArticleEntry[]>([]);
  const [topicResults, setTopicResults] = useState<TopicData[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Initialize Fuse.js index for articles
  const articleFuse = useRef(
    new Fuse(ALL_ARTICLES, {
      keys: ['title', 'focusKeyword', 'topic', 'standfirst', 'focusQuestion'],
      threshold: 0.35,
      includeScore: true
    })
  );

  // Initialize Fuse.js index for topics
  const topicFuse = useRef(
    new Fuse(TOPICS, {
      keys: ['name', 'scopeParagraph', 'badge', 'hook'],
      threshold: 0.35
    })
  );

  // Focus input and lock scroll on open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = 'auto';
      setQuery('');
      setArticleResults([]);
      setTopicResults([]);
    }
  }, [isOpen]);

  // Global Cmd+K / Ctrl+K and Escape listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Execute search queries
  useEffect(() => {
    if (!query.trim()) {
      // Default: show featured published articles + topics
      setArticleResults(ALL_ARTICLES.slice(0, 6));
      setTopicResults(TOPICS.slice(0, 4));
      return;
    }

    const aRes = articleFuse.current.search(query).map(r => r.item);
    const tRes = topicFuse.current.search(query).map(r => r.item);

    setArticleResults(aRes);
    setTopicResults(tRes);
  }, [query]);

  if (!isOpen) return null;

  const handleSelectArticle = (article: ArticleEntry) => {
    onClose();
    if (article.status === 'published') {
      navigate(`/articles/${article.slug}`);
    } else {
      navigate(`/topics/${article.topicSlug}`);
    }
  };

  const handleSelectTopic = (topic: TopicData) => {
    onClose();
    navigate(`/topics/${topic.slug}`);
  };

  const totalResults = articleResults.length + topicResults.length;

  return (
    <div
      className="sts-search-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(14, 17, 18, 0.88)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '5vh 1.5rem 2rem 1.5rem',
        animation: 'searchFadeIn 0.2s var(--sts-ease)'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '720px',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '85vh',
          background: 'var(--sts-raised)',
          border: '1px solid var(--sts-border)',
          borderRadius: 'var(--sts-card-radius)',
          boxShadow: '0 32px 72px -12px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(255, 255, 255, 0.08)',
          overflow: 'hidden'
        }}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--sts-border)',
            background: 'rgba(255, 255, 255, 0.02)'
          }}
        >
          <Search size={22} color="var(--sts-brass)" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search mechanisms, topics, or engineering protocols..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--sts-bone)',
              fontSize: '1.2rem',
              fontFamily: 'var(--sts-font-body)'
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ color: 'var(--sts-dim)', padding: '0.2rem' }}
            >
              <X size={18} />
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              padding: '0.3rem 0.6rem',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.06)',
              color: 'var(--sts-muted)',
              fontSize: '0.75rem',
              fontFamily: 'var(--sts-font-mono)'
            }}
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div
          style={{
            overflowY: 'auto',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}
        >
          {/* Matching Topics Group */}
          {topicResults.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: '0.72rem',
                  fontFamily: 'var(--sts-font-mono)',
                  color: 'var(--sts-dim)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '0.75rem'
                }}
              >
                Topic Disciplines
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
                {topicResults.map((topic) => (
                  <div
                    key={topic.slug}
                    onClick={() => handleSelectTopic(topic)}
                    style={{
                      padding: '0.85rem 1rem',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--sts-border)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--sts-border-hover)';
                      e.currentTarget.style.background = 'rgba(201, 151, 74, 0.06)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--sts-border)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <Compass size={16} color="var(--sts-brass)" />
                      <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--sts-bone)' }}>{topic.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matching Articles Group */}
          {articleResults.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: '0.72rem',
                  fontFamily: 'var(--sts-font-mono)',
                  color: 'var(--sts-dim)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '0.75rem'
                }}
              >
                Articles ({articleResults.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {articleResults.map((article) => {
                  const isPublished = article.status === 'published';
                  return (
                    <div
                      key={article.slug}
                      onClick={() => handleSelectArticle(article)}
                      style={{
                        padding: '0.9rem 1.1rem',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--sts-border)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--sts-border-hover)';
                        e.currentTarget.style.transform = 'translateX(3px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--sts-border)';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                        <FileText size={17} color={isPublished ? 'var(--sts-brass)' : 'var(--sts-dim)'} style={{ flexShrink: 0 }} />
                        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                          <span
                            style={{
                              fontSize: '0.92rem',
                              fontWeight: 500,
                              color: isPublished ? 'var(--sts-bone)' : 'var(--sts-muted)',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {article.title}
                          </span>
                          <span style={{ fontSize: '0.76rem', color: 'var(--sts-dim)' }}>
                            {article.topic}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
                        {isPublished ? (
                          <span
                            className="sts-badge sts-badge-brass"
                            style={{ fontSize: '0.65rem', padding: '0.1rem 0.45rem' }}
                          >
                            Published
                          </span>
                        ) : (
                          <span
                            style={{
                              fontSize: '0.65rem',
                              fontFamily: 'var(--sts-font-mono)',
                              padding: '0.1rem 0.45rem',
                              borderRadius: '999px',
                              background: 'rgba(255, 255, 255, 0.04)',
                              color: 'var(--sts-dim)',
                              border: '1px solid rgba(255, 255, 255, 0.08)'
                            }}
                          >
                            Coming Soon
                          </span>
                        )}
                        <ArrowRight size={14} color="var(--sts-dim)" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Zero Results / Demand Capture */}
          {query.trim() && totalResults === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '2.5rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <Clock size={36} color="var(--sts-dim)" />
              <div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--sts-bone)', marginBottom: '0.35rem' }}>
                  We haven't covered "{query}" yet
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--sts-muted)', maxWidth: '440px' }}>
                  Our editorial queue prioritizes reader requests for architectural and engineering breakdowns.
                </p>
              </div>

              <button
                onClick={() => {
                  onClose();
                  if (onRequestArticle) onRequestArticle(query);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 1.25rem',
                  borderRadius: 'var(--sts-pill-radius)',
                  background: 'var(--sts-brass)',
                  color: '#0E1112',
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }}
              >
                <Send size={14} />
                <span>Request an Explanation</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes searchFadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};
