import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { Search, X, ArrowRight, ArrowUpRight, FileText, Compass, Sparkles, BookOpen } from 'lucide-react';
import { ALL_ARTICLES, SLUG_REGISTRY, ArticleEntry } from '../../data/slug-registry';
import styles from '../../styles/search.module.css';

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
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Initialize Fuse.js with weighted article keys & lenient threshold for relatable terms
  const articleFuse = useMemo(() => {
    return new Fuse(ALL_ARTICLES, {
      keys: [
        { name: 'title', weight: 0.5 },
        { name: 'focusKeyword', weight: 0.25 },
        { name: 'beginnerStandfirst', weight: 0.2 },
        { name: 'standfirst', weight: 0.15 },
        { name: 'focusQuestion', weight: 0.15 },
        { name: 'topic', weight: 0.1 }
      ],
      threshold: 0.45,
      ignoreLocation: true,
      minMatchCharLength: 2,
      includeScore: true
    });
  }, []);

  // Compute live search results
  const results = useMemo<ArticleEntry[]>(() => {
    if (!query.trim()) {
      // Default initial view: prioritized published mechanism articles
      return ALL_ARTICLES.filter(a => a.status === 'published').concat(
        ALL_ARTICLES.filter(a => a.status !== 'published')
      ).slice(0, 8);
    }
    const fuseMatches = articleFuse.search(query);
    return fuseMatches.map(m => m.item);
  }, [query, articleFuse]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus input and lock document scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 60);
    } else {
      document.body.style.overflow = 'auto';
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Active selected article for the right-side preview
  const selectedArticle: ArticleEntry | null = useMemo(() => {
    if (results.length === 0) return null;
    return results[Math.min(selectedIndex, results.length - 1)] || results[0];
  }, [results, selectedIndex]);

  // Compute related articles to explore based on active selection
  const relatedArticles: ArticleEntry[] = useMemo(() => {
    if (!selectedArticle) return [];

    // 1. First prioritize explicit ghostLinks from SLUG_REGISTRY
    const fromGhostLinks = (selectedArticle.ghostLinks || [])
      .map(slug => SLUG_REGISTRY[slug])
      .filter((a): a is ArticleEntry => !!a && a.slug !== selectedArticle.slug);

    if (fromGhostLinks.length >= 2) {
      return fromGhostLinks.slice(0, 3);
    }

    // 2. Supplement with other articles from the same topic
    const fromSameTopic = ALL_ARTICLES.filter(
      a => a.topicSlug === selectedArticle.topicSlug && a.slug !== selectedArticle.slug && !fromGhostLinks.some(g => g.slug === a.slug)
    );

    // 3. Combine and return up to 3 recommendations
    return [...fromGhostLinks, ...fromSameTopic].slice(0, 3);
  }, [selectedArticle]);

  // Keyboard navigation (Up, Down, Enter, Esc, Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (results.length > 0 ? (prev + 1) % results.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedArticle) {
          handleOpenArticle(selectedArticle);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedArticle, onClose]);

  if (!isOpen) return null;

  const handleOpenArticle = (article: ArticleEntry) => {
    onClose();
    if (article.status === 'published') {
      navigate(`/articles/${article.slug}`);
    } else {
      navigate(`/topics/${article.topicSlug}`);
    }
  };

  return (
    <div
      id="sts-search-overlay"
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Article mechanism search command console"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Top Rim Horizon Ambient Light */}
        <div className={styles.modalTopRay} />

        {/* 1. Search Bar Header */}
        <div className={styles.searchHeader}>
          <div className={styles.searchIconWrapper}>
            <Search size={20} />
            <div className={styles.searchIconPulseRing} />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type any mechanism, keyword, or architecture topic..."
            className={styles.searchInput}
            aria-label="Search articles"
          />

          {query && (
            <button
              onClick={() => setQuery('')}
              className={styles.clearBtn}
              aria-label="Clear search input"
            >
              <X size={16} />
            </button>
          )}

          <button
            onClick={onClose}
            className={styles.escKeyBadge}
            aria-label="Close search (Esc)"
          >
            ESC
          </button>
        </div>

        {/* 2. Dual-Pane Command Viewport */}
        <div className={styles.viewportBody}>
          {/* Left Pane: Real-time Matching Articles */}
          <div className={styles.leftPane} ref={listRef}>
            <div className={styles.paneEyebrow}>
              <span>{query.trim() ? 'Matching Mechanisms' : 'Suggested Mechanisms'}</span>
              <span className={styles.resultsCount}>{results.length} found</span>
            </div>

            {results.length > 0 ? (
              <div className={styles.articlesList}>
                {results.map((article, idx) => {
                  const isSelected = idx === selectedIndex;
                  const isPublished = article.status === 'published';

                  return (
                    <div
                      key={article.slug}
                      onClick={() => handleOpenArticle(article)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`${styles.articleCard} ${isSelected ? styles.articleCardSelected : ''}`}
                    >
                      <div className={styles.articleCardLeft}>
                        <div className={styles.articleIconBox}>
                          <FileText size={15} />
                        </div>
                        <div className={styles.articleMetaCol}>
                          <span className={styles.articleTitle}>
                            {article.title}
                          </span>
                          <div className={styles.articleSubMeta}>
                            <span>{article.topic}</span>
                            {article.readingTime && (
                              <>
                                <span>•</span>
                                <span className={styles.readTimeBadge}>{article.readingTime}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className={styles.articleCardRight}>
                        {isPublished ? (
                          <span className={`${styles.statusPill} ${styles.statusPillPublished}`}>
                            Published
                          </span>
                        ) : (
                          <span className={`${styles.statusPill} ${styles.statusPillPlanned}`}>
                            In Observatory
                          </span>
                        )}
                        <ArrowRight size={14} className={styles.cardArrow} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <BookOpen size={28} color="#737373" />
                <h4 className={styles.emptyTitle}>No matching mechanism articles</h4>
                <p className={styles.emptyText}>
                  Try keywords like "pipeline", "retry", "auction", "idempotency", or "queue".
                </p>
                {onRequestArticle && (
                  <button
                    onClick={() => {
                      onClose();
                      onRequestArticle(query);
                    }}
                    style={{
                      marginTop: '8px',
                      padding: '8px 16px',
                      borderRadius: '9999px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Request this mechanism breakdown →
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right Pane: Dynamic Mechanism Intel & Related Articles to Explore */}
          <div className={styles.rightPane}>
            {selectedArticle ? (
              <>
                {/* Active Mechanism Intel Card */}
                <div className={styles.previewTopCard}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className={styles.previewTopicPill}>
                      {selectedArticle.topic}
                    </span>
                    {selectedArticle.readingTime && (
                      <span className={styles.readTimeBadge}>
                        {selectedArticle.readingTime}
                      </span>
                    )}
                  </div>

                  <h3 className={styles.previewTitle}>
                    {selectedArticle.title}
                  </h3>

                  <p className={styles.previewExplanation}>
                    {selectedArticle.beginnerStandfirst || selectedArticle.standfirst}
                  </p>

                  {selectedArticle.focusQuestion && (
                    <div className={styles.previewQuestionBox}>
                      <Sparkles size={14} style={{ flexShrink: 0, marginTop: '2px', color: '#FFFFFF' }} />
                      <span>{selectedArticle.focusQuestion}</span>
                    </div>
                  )}

                  <button
                    onClick={() => handleOpenArticle(selectedArticle)}
                    className={styles.openArticleCta}
                  >
                    <span>{selectedArticle.status === 'published' ? 'Read Full Mechanism Breakdown' : 'View Topic Observatory'}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

                {/* Related Articles to Explore */}
                {relatedArticles.length > 0 && (
                  <div className={styles.relatedSection}>
                    <h5 className={styles.relatedHeader}>
                      Related Articles to Explore
                    </h5>

                    <div className={styles.relatedList}>
                      {relatedArticles.map((rel) => (
                        <div
                          key={rel.slug}
                          onClick={() => handleOpenArticle(rel)}
                          className={styles.relatedCard}
                        >
                          <div className={styles.relatedCardTop}>
                            <span className={styles.relatedCardTitle}>{rel.title}</span>
                            <ArrowUpRight size={13} className={styles.relatedCardArrow} />
                          </div>
                          <span className={styles.relatedCardHook}>
                            {rel.beginnerStandfirst || rel.standfirst}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className={styles.emptyState}>
                <p className={styles.emptyText}>Select an article to view mechanism details.</p>
              </div>
            )}
          </div>
        </div>

        {/* 3. Command Bar Keyboard Shortcuts Footer */}
        <div className={styles.commandFooter}>
          <div className={styles.keyboardShortcutsRow}>
            <span className={styles.shortcutItem}>
              <span className={styles.shortcutKey}>↑</span>
              <span className={styles.shortcutKey}>↓</span>
              <span>to navigate</span>
            </span>
            <span className={styles.shortcutItem}>
              <span className={styles.shortcutKey}>↵</span>
              <span>to open</span>
            </span>
            <span className={styles.shortcutItem}>
              <span className={styles.shortcutKey}>esc</span>
              <span>to dismiss</span>
            </span>
          </div>

          <span className={styles.engineSpecLabel}>
            Fuzzy Article Spec Matcher
          </span>
        </div>
      </div>
    </div>
  );
};
