import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ALL_ARTICLES, ArticleEntry } from '../data/slug-registry';
import { TOPICS } from '../data/topics';
import { Search, ArrowRight, Layers, Radio, X } from 'lucide-react';
import { PerlinFlowField } from '../components/articles/PerlinFlowField';
import styles from '../styles/articles.module.css';

export const ArticlesPage: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'planned'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' to immediately focus the search console
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Cursor spotlight tracking per card to animate localized illumination
  const handleCardMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--spotlight-x', `${x}px`);
    e.currentTarget.style.setProperty('--spotlight-y', `${y}px`);
  };

  const filteredArticles = ALL_ARTICLES.filter((article: ArticleEntry) => {
    const matchesTopic = selectedTopic === 'all' || article.topicSlug === selectedTopic;
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      q === '' ||
      article.title.toLowerCase().includes(q) ||
      article.focusKeyword.toLowerCase().includes(q) ||
      article.standfirst.toLowerCase().includes(q) ||
      (article.focusQuestion && article.focusQuestion.toLowerCase().includes(q));
    return matchesTopic && matchesStatus && matchesSearch;
  });

  const publishedCount = ALL_ARTICLES.filter((a) => a.status === 'published').length;
  const plannedCount = ALL_ARTICLES.filter((a) => a.status === 'planned').length;

  const getDomainCount = (slug: string) => {
    if (slug === 'all') return ALL_ARTICLES.length;
    return ALL_ARTICLES.filter((a) => a.topicSlug === slug).length;
  };

  const isFiltered = searchQuery !== '' || selectedTopic !== 'all' || statusFilter !== 'all';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedTopic('all');
    setStatusFilter('all');
  };

  return (
    <div className={styles.articlesPage}>
      {/* =========================================================================
          CONTINUOUS 3D PERLIN FLOW FIELD (Spans Hero through Command Deck)
          ========================================================================= */}
      <div className={styles.continuousCanvasWrapper}>
        <PerlinFlowField />
      </div>

      {/* =========================================================================
          HERO SECTION: Perlin Noise Vector Flow Field Observatory
          ========================================================================= */}
      <section className={styles.heroSection}>
        {/* Typographic Readability Pocket */}
        <div className={styles.readingPocket} />

        {/* Telemetry HUD */}
        <div className={styles.observatoryHudTop}>
          <span className={styles.observatoryHudItem}>ARTICLES & EXPLANATIONS // SYSTEMS TO SCALE</span>
          <span className={styles.observatoryHudDivider}>•</span>
          <span className={styles.observatoryHudItem}>FLOW FIELD: PERLIN 3D</span>
          <span className={`${styles.observatoryHudItem} ${styles.observatoryHudExtra}`}>
            <span className={styles.observatoryHudDivider}>•</span> 16,000 PARTICLES
          </span>
          <span className={`${styles.observatoryHudItem} ${styles.observatoryHudExtra}`}>
            <span className={styles.observatoryHudDivider}>•</span> 60 FPS
          </span>
        </div>

        {/* Top Reticle Accents */}
        <div className={styles.heroReticleTl} />
        <div className={styles.heroReticleTr} />

        {/* Hero Typographic Content */}
        <div className={styles.heroContent}>
          <div className={styles.heroEyebrow}>
            <Radio size={12} />
            <span>ARTICLES & SYSTEM BLUEPRINTS</span>
          </div>

          <h1 className={styles.heroHeading}>
            All 40 Production Systems.
          </h1>

          <p className={styles.heroSublead}>
            Every article is built on the three-question standard: What it is, How it physically works,
            and Why it matters under extreme production load. Designed for systems engineers and engineering leaders.
          </p>

          {/* 4 Telemetry Metric Chips (Cleaned Vocabulary) */}
          <div className={styles.kpiStrip}>
            <div className={styles.kpiChip}>
              <span>TOTAL ARTICLES:</span>
              <span className={styles.kpiNumber}>40 EXPLANATIONS</span>
            </div>
            <div className={styles.kpiChip}>
              <span>FIELD GUIDES:</span>
              <span className={styles.kpiNumber}>8 OVERVIEWS</span>
            </div>
            <div className={styles.kpiChip}>
              <span>DEEP DIVES:</span>
              <span className={styles.kpiNumber}>32 MECHANISMS</span>
            </div>
            <div className={styles.kpiChip}>
              <span>STATUS:</span>
              <span className={styles.kpiNumber}>{publishedCount} PUBLISHED // {plannedCount} COMING SOON</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          COMMAND DECK: Double-Bezel Search & Filter Console (CINEMATIC & PRODUCTIVE)
          ========================================================================= */}
      <section className={styles.commandDeckSection}>
        <div className={styles.commandChassis}>
          {/* Subtle Corner Reticle Accents */}
          <div className={styles.chassisReticleTl} />
          <div className={styles.chassisReticleTr} />

          {/* Top Row: Search Input + Status Segments */}
          <div className={styles.commandRowTop}>
            <div className={styles.searchContainer}>
              <Search size={15} className={styles.searchIcon} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search articles, topics, or the questions they answer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              <div className={styles.searchActions}>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className={styles.searchClearBtn}
                    title="Clear search"
                  >
                    <X size={13} />
                  </button>
                )}
                <span className={styles.searchKbd}>/</span>
              </div>
            </div>

            {/* Status Segmented Controller (Cleaned Vocabulary) */}
            <div className={styles.statusSegment}>
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`${styles.statusToggleBtn} ${statusFilter === 'all' ? styles.statusToggleBtnActive : ''}`}
              >
                ALL ({ALL_ARTICLES.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('published')}
                className={`${styles.statusToggleBtn} ${statusFilter === 'published' ? styles.statusToggleBtnActive : ''}`}
              >
                PUBLISHED ({publishedCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('planned')}
                className={`${styles.statusToggleBtn} ${statusFilter === 'planned' ? styles.statusToggleBtnActive : ''}`}
              >
                COMING SOON ({plannedCount})
              </button>
            </div>
          </div>

          {/* Bottom Row: Topic Filter Pills + Reset Quick Action */}
          <div className={styles.domainPillRow}>
            <button
              type="button"
              onClick={() => setSelectedTopic('all')}
              className={`${styles.domainPill} ${selectedTopic === 'all' ? styles.domainPillActive : ''}`}
            >
              <span>ALL</span>
              <span className={styles.domainCountBadge}>({getDomainCount('all')})</span>
            </button>
            {TOPICS.map((t) => {
              const count = getDomainCount(t.slug);
              const isActive = selectedTopic === t.slug;
              return (
                <button
                  key={t.slug}
                  type="button"
                  onClick={() => setSelectedTopic(t.slug)}
                  className={`${styles.domainPill} ${isActive ? styles.domainPillActive : ''}`}
                >
                  <span>{t.name.toUpperCase()}</span>
                  <span className={styles.domainCountBadge}>({count})</span>
                </button>
              );
            })}

            {/* Instant Filter Reset (Productivity Feature) */}
            {isFiltered && (
              <button
                type="button"
                onClick={handleResetFilters}
                className={styles.resetFiltersBtn}
                title="Reset all active filters"
              >
                <span>RESET</span>
                <X size={11} />
              </button>
            )}
          </div>

          {/* Live Readout & Counter (Cleaned Vocabulary) */}
          <div className={styles.readoutBar}>
            <span>
              SHOWING {filteredArticles.length} OF {ALL_ARTICLES.length} ARTICLES
            </span>
            <span>VERIFIED PRODUCTION MECHANISMS // THREE-QUESTION STANDARD</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          BLUEPRINT GRID: 3-Column Machined Double-Bezel Cards (ALIVE & DYNAMIC)
          ========================================================================= */}
      <section className={styles.articlesGridSection}>
        <div className={styles.articlesGrid}>
          {filteredArticles.map((article) => {
            const isLive = article.status === 'published';
            const isFieldGuide = article.type === 'Pillar';

            const cardContent = (
              <>
                {/* Luminous top-edge 1px scanline */}
                <div className={styles.cardTopScanline} />
                {/* Interactive cursor spotlight */}
                <div className={styles.cardSpotlight} />

                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <span className={styles.topicBadge}>{article.topic}</span>
                    <span className={isFieldGuide ? styles.typeBadgeFieldGuide : styles.typeBadgeDeepDive}>
                      {isFieldGuide ? 'FIELD GUIDE' : 'DEEP DIVE'}
                    </span>
                  </div>

                  <h3 className={styles.cardTitle}>{article.title}</h3>
                  <p className={styles.cardStandfirst}>{article.standfirst}</p>

                  {article.focusQuestion && (
                    <div className={styles.focusQuestionBox}>
                      <span className={styles.focusQuestionLabel}>THE QUESTION THIS ANSWERS</span>
                      <p className={styles.focusQuestionText}>{article.focusQuestion}</p>
                    </div>
                  )}

                  <div className={styles.keywordRow}>
                    <span className={styles.keywordPill}>KEYWORD // {article.focusKeyword}</span>

                    {/* Three-Question Spine Indicator (3 small bars) */}
                    <div
                      className={styles.spineIndicator}
                      title={isLive ? 'Three-question spine: Complete (What, How, Why)' : 'Three-question spine: In progress'}
                    >
                      <span className={`${styles.spineBar} ${isLive ? styles.spineBarFilled : ''}`} />
                      <span className={`${styles.spineBar} ${isLive ? styles.spineBarFilled : ''}`} />
                      <span className={`${styles.spineBar} ${isLive ? styles.spineBarFilled : ''}`} />
                    </div>
                  </div>

                  <div className={styles.cardFooter}>
                    {isLive ? (
                      <>
                        <span className={styles.liveBeacon}>
                          <span className={styles.liveDot} />
                          <span>PUBLISHED // READ NOW</span>
                        </span>
                        <span className={styles.cardArrowBtn}>
                          <ArrowRight size={13} />
                        </span>
                      </>
                    ) : (
                      <span className={styles.comingSoonBeacon}>
                        <span className={styles.comingSoonDot} />
                        <span>COMING SOON // IN QUEUE</span>
                      </span>
                    )}
                  </div>
                </div>
              </>
            );

            if (isLive) {
              return (
                <Link
                  key={article.slug}
                  to={`/articles/${article.slug}`}
                  className={`${styles.articleCard} ${styles.articleCardLive}`}
                  onMouseMove={handleCardMouseMove}
                >
                  {cardContent}
                </Link>
              );
            }

            return (
              <div
                key={article.slug}
                className={`${styles.articleCard} ${styles.articleCardPlanned}`}
                onMouseMove={handleCardMouseMove}
              >
                {cardContent}
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          CROSS-TOPIC NAVIGATION STRIP (Cleaned Vocabulary)
          ========================================================================= */}
      <section className={styles.topicsStripSection}>
        <div className={styles.topicsStripBox}>
          <div className={styles.topicsStripLeft}>
            <Layers size={22} color="#FFFFFF" />
            <div>
              <div className={styles.topicsStripTitle}>Looking for Comprehensive Overviews?</div>
              <div className={styles.topicsStripDesc}>
                Explore our 8 field guides spanning AI & Automation, Marketing & Ads, Web Design, and E-commerce.
              </div>
            </div>
          </div>
          <Link to="/topics" className={styles.topicsStripBtn}>
            <span>Explore 8 Field Guides</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
};
