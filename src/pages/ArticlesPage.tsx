import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ALL_ARTICLES, ArticleEntry } from '../data/slug-registry';
import { TOPICS } from '../data/topics';
import { Search, ArrowRight, Layers, Terminal } from 'lucide-react';
import { PerlinFlowField } from '../components/articles/PerlinFlowField';
import styles from '../styles/articles.module.css';

export const ArticlesPage: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'planned'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Aerodynamic Perlin Flow Field Physics Modes
  const [trailMode, setTrailMode] = useState<boolean>(true);
  const [warpMode, setWarpMode] = useState<boolean>(false);
  const [pulseMode, setPulseMode] = useState<boolean>(false);

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

  // Cursor spotlight tracking per card to prevent unnecessary React renders
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

  return (
    <div className={styles.articlesPage}>
      {/* =========================================================================
          CONTINUOUS 3D PERLIN FLOW FIELD (Spans Hero through Command Deck)
          ========================================================================= */}
      <div className={styles.continuousCanvasWrapper}>
        <PerlinFlowField trailMode={trailMode} warpMode={warpMode} pulseMode={pulseMode} />
      </div>

      {/* =========================================================================
          HERO SECTION: Aerodynamic Perlin Flow Field & Implementor Telemetry
          ========================================================================= */}
      <section className={styles.heroSection}>
        {/* Typographic Readability Pocket */}
        <div className={styles.readingPocket} />

        {/* Implementor Telemetry HUD Top Strip */}
        <div className={styles.hudTop}>
          <span>PRODUCTION TELEMETRY // FIELD BENCHMARKS</span>
          <span className={styles.hudDivider}>•</span>
          <span>FLOW FIELD: PERLIN 4-OCTAVE FBM</span>
          <span className={styles.hudDivider}>•</span>
          <span>1,280 STREAMLINES</span>
        </div>

        {/* Physics Mode Toggles (Trails, Warp, Pulse) */}
        <div className={styles.physicsControls}>
          <button
            type="button"
            onClick={() => setTrailMode(!trailMode)}
            className={`${styles.ctrlBtn} ${trailMode ? styles.ctrlBtnActive : ''}`}
            title="Toggle Aerodynamic Streamline Trails"
          >
            Trails
          </button>
          <button
            type="button"
            onClick={() => setWarpMode(!warpMode)}
            className={`${styles.ctrlBtn} ${warpMode ? styles.ctrlBtnActive : ''}`}
            title="Toggle High-Frequency Turbulence"
          >
            Warp
          </button>
          <button
            type="button"
            onClick={() => setPulseMode(!pulseMode)}
            className={`${styles.ctrlBtn} ${pulseMode ? styles.ctrlBtnActive : ''}`}
            title="Trigger Gravitational Pulse Shockwave"
          >
            Pulse
          </button>
        </div>

        {/* Hero Typographic Content */}
        <div className={styles.heroContent}>
          <div className={styles.heroEyebrow}>
            <Terminal size={12} />
            <span>PRODUCTION ARCHIVES & FIELD BENCHMARKS</span>
          </div>

          <h1 className={styles.heroHeading}>The Archive.</h1>
          <div className={styles.heroHeadingSub}>40 Production Systems.</div>

          <p className={styles.heroSublead}>
            We implement these architectures in production, stress-test their breaking points, and aggregate the
            operational averages. Every system documented at the level where you could rebuild and scale it.
          </p>

          {/* Connected 4-Segment Monolithic Telemetry Chassis */}
          <div className={styles.statChassis}>
            <div className={styles.statBox}>
              <span className={styles.statNumber}>40</span>
              <span className={styles.statLabel}>SYSTEMS IMPLEMENTED</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statNumber}>8</span>
              <span className={styles.statLabel}>CORE DOMAINS</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statNumber}>99.99%</span>
              <span className={styles.statLabel}>TARGET SLA</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statNumber}>100%</span>
              <span className={styles.statLabel}>BENCHMARKED</span>
            </div>
          </div>

          {/* Minimalist 1px Animated Vertical Pulse Scroll Hint */}
          <div className={styles.scrollHint}>
            <span className={styles.scrollHintText}>Scroll</span>
            <div className={styles.scrollLine} />
          </div>
        </div>
      </section>

      {/* =========================================================================
          COMMAND DECK: Double-Bezel Search & Filter Console
          ========================================================================= */}
      <section className={styles.commandDeckSection}>
        <div className={styles.commandChassis}>
          {/* Top Row: Search Input + Status Segments */}
          <div className={styles.commandRowTop}>
            <div className={styles.searchContainer}>
              <Search size={15} className={styles.searchIcon} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search blueprints, keywords, or primary questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              <span className={styles.searchKbd}>/</span>
            </div>

            {/* Status Segmented Controller */}
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
                DEPLOYED ({publishedCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('planned')}
                className={`${styles.statusToggleBtn} ${statusFilter === 'planned' ? styles.statusToggleBtnActive : ''}`}
              >
                BENCHMARK QUEUE ({plannedCount})
              </button>
            </div>
          </div>

          {/* Bottom Row: 8 Domain Filter Pills */}
          <div className={styles.domainPillRow}>
            <button
              type="button"
              onClick={() => setSelectedTopic('all')}
              className={`${styles.domainPill} ${selectedTopic === 'all' ? styles.domainPillActive : ''}`}
            >
              <span>ALL DOMAINS</span>
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
          </div>

          {/* Live Readout & Counter */}
          <div className={styles.readoutBar}>
            <span>
              SHOWING {filteredArticles.length} OF {ALL_ARTICLES.length} PRODUCTION BLUEPRINTS
            </span>
            <span>VERIFIED FIELD TELEMETRY // PRODUCTION SPECIFICATION</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          BLUEPRINT GRID: 3-Column Machined Double-Bezel Cards
          ========================================================================= */}
      <section className={styles.articlesGridSection}>
        <div className={styles.articlesGrid}>
          {filteredArticles.map((article) => {
            const isLive = article.status === 'published';
            const isPillar = article.type === 'Pillar';

            if (isLive) {
              return (
                <Link
                  key={article.slug}
                  to={`/articles/${article.slug}`}
                  className={styles.articleCard}
                  onMouseMove={handleCardMouseMove}
                >
                  <div className={styles.cardSpotlight} />
                  <div className={styles.cardContent}>
                    <div className={styles.cardHeader}>
                      <span className={styles.topicBadge}>{article.topic}</span>
                      <span className={isPillar ? styles.typeBadgePillar : styles.typeBadgeCluster}>
                        {isPillar ? 'CORE ARCHITECTURE' : 'SYSTEM MODULE'}
                      </span>
                    </div>

                    <h3 className={styles.cardTitle}>{article.title}</h3>
                    <p className={styles.cardStandfirst}>{article.standfirst}</p>

                    {article.focusQuestion && (
                      <div className={styles.focusQuestionBox}>
                        <span className={styles.focusQuestionLabel}>CORE MECHANISM</span>
                        <span>{article.focusQuestion}</span>
                      </div>
                    )}

                    {article.focusKeyword && (
                      <div className={styles.keywordPill}>
                        <span>KEYWORD // {article.focusKeyword}</span>
                      </div>
                    )}

                    <div className={styles.cardFooter}>
                      <span className={styles.liveBeacon}>
                        <span className={styles.liveDot} />
                        <span>DEPLOYED // READ NOW</span>
                      </span>
                      <span className={styles.cardArrowBtn}>
                        <ArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            }

            return (
              <div
                key={article.slug}
                className={styles.articleCard}
                onMouseMove={handleCardMouseMove}
              >
                <div className={styles.cardSpotlight} />
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <span className={styles.topicBadge}>{article.topic}</span>
                    <span className={isPillar ? styles.typeBadgePillar : styles.typeBadgeCluster}>
                      {isPillar ? 'CORE ARCHITECTURE' : 'SYSTEM MODULE'}
                    </span>
                  </div>

                  <h3 className={styles.cardTitle}>{article.title}</h3>
                  <p className={styles.cardStandfirst}>{article.standfirst}</p>

                  {article.focusQuestion && (
                    <div className={styles.focusQuestionBox}>
                      <span className={styles.focusQuestionLabel}>BENCHMARK TARGET</span>
                      <span>{article.focusQuestion}</span>
                    </div>
                  )}

                  {article.focusKeyword && (
                    <div className={styles.keywordPill}>
                      <span>KEYWORD // {article.focusKeyword}</span>
                    </div>
                  )}

                  <div className={styles.cardFooter}>
                    <span className={styles.plannedBadge}>
                      • FIELD BENCHMARK IN PROGRESS // LIVE VERIFICATION
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          CROSS-SILO NAVIGATION STRIP
          ========================================================================= */}
      <section className={styles.topicsStripSection}>
        <div className={styles.topicsStripBox}>
          <div className={styles.topicsStripLeft}>
            <Layers size={22} color="#FFFFFF" />
            <div>
              <div className={styles.topicsStripTitle}>Looking for High-Level Architecture Domains?</div>
              <div className={styles.topicsStripDesc}>
                Explore our 8 core architectural disciplines spanning AI Agents, Event Streams, High-Throughput APIs, and Security.
              </div>
            </div>
          </div>
          <Link to="/topics" className={styles.topicsStripBtn}>
            <span>Explore 8 Architecture Domains</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
};
