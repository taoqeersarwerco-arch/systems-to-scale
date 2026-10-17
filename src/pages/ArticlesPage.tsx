import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ALL_ARTICLES, ArticleEntry } from '../data/slug-registry';
import { TOPICS } from '../data/topics';
import { Search, ArrowRight, Layers, Radio, X, Clock, Sparkles, ChevronDown } from 'lucide-react';
import { CosmicWeb } from '../components/articles/CosmicWeb';
import styles from '../styles/articles.module.css';

// Topic icon mapping for the horizontal category rail
const TOPIC_ICONS: Record<string, string> = {
  'all': '✦',
  'ai-automation': '⚡',
  'marketing-ads': '📈',
  'web-design': '🎨',
  'e-commerce': '🛒',
  'customer-service': '💬',
  'virtual-assistance': '🤖',
  'pitch-decks': '📊',
  'personal-assistance': '🧭',
};

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

  // 3D Tilt & Cursor Spotlight tracking per card
  const handleCardMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -5;
    const rotateY = ((x / rect.width) - 0.5) * 5;
    e.currentTarget.style.setProperty('--card-rotate-x', `${rotateX.toFixed(2)}deg`);
    e.currentTarget.style.setProperty('--card-rotate-y', `${rotateY.toFixed(2)}deg`);
    e.currentTarget.style.setProperty('--spotlight-x', `${x}px`);
    e.currentTarget.style.setProperty('--spotlight-y', `${y}px`);
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty('--card-rotate-x', '0deg');
    e.currentTarget.style.setProperty('--card-rotate-y', '0deg');
  };

  const filteredArticles = ALL_ARTICLES.filter((article: ArticleEntry) => {
    const matchesTopic = selectedTopic === 'all' || article.topicSlug === selectedTopic;
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      q === '' ||
      article.title.toLowerCase().includes(q) ||
      article.focusKeyword.toLowerCase().includes(q) ||
      (article.beginnerStandfirst && article.beginnerStandfirst.toLowerCase().includes(q)) ||
      article.standfirst.toLowerCase().includes(q) ||
      (article.focusQuestion && article.focusQuestion.toLowerCase().includes(q));
    return matchesTopic && matchesStatus && matchesSearch;
  });

  const isFiltered = searchQuery !== '' || selectedTopic !== 'all' || statusFilter !== 'all';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedTopic('all');
    setStatusFilter('all');
  };

  const handleScrollToDeck = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById('command-deck');
    if (target) {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
    }
  };

  return (
    <div className={styles.articlesPage}>
      {/* =========================================================================
          HERO SECTION: 3D Cosmic Web Macro-Structure (Exact Match to Topics Hub)
          ========================================================================= */}
      <section className={styles.heroSection}>
        {/* Living 3D Cosmic Web: Macro-structure of all production systems */}
        <div className={styles.canvasWrapper}>
          <CosmicWeb />
        </div>

        {/* Typographic Readability Pocket */}
        <div className={styles.readingPocket} />

        {/* Observatory Reticle Corner Brackets (Exact 4-Corner Topics Hub Layout) */}
        <div className={styles.observatoryReticleTl} aria-hidden="true" />
        <div className={styles.observatoryReticleTr} aria-hidden="true" />
        <div className={styles.observatoryReticleBl} aria-hidden="true" />
        <div className={styles.observatoryReticleBr} aria-hidden="true" />


        {/* Content Overlay Centred Vertically Over Flow Field (Exact Topics Hub Specs) */}
        <div className={styles.heroContentOverlay}>
          <div className={styles.heroEyebrow}>
            <Radio size={14} />
            <span>PRODUCTION ARTICLES & EXPLANATIONS</span>
          </div>

          <h1 className={styles.heroHeading}>
            All Production Systems.
          </h1>

          <p className={styles.heroSublead}>
            Every article is built on the three-question standard: What it is, How it physically works,
            and Why it matters under extreme production load. Designed for founders, operators, and systems engineers.
          </p>

        </div>

        {/* Scroll Indicator matching Topics Hub */}
        <a
          href="#command-deck"
          onClick={handleScrollToDeck}
          className={styles.scrollIndicator}
          aria-label="Scroll to articles archive"
        >
          <span>EXPLORE ARCHIVE</span>
          <ChevronDown size={16} />
        </a>
      </section>

      {/* =========================================================================
          COMMAND DECK: Cinematic Double-Bezel Floating HUD (PRODUCTIVE & ZERO-WRAP)
          ========================================================================= */}
      <section className={styles.commandDeckSection} id="command-deck">
        <div className={styles.commandChassis}>
          {/* Subtle 4-Corner Reticle Hardware Accents */}
          <div className={styles.chassisReticleTl} />
          <div className={styles.chassisReticleTr} />
          <div className={styles.chassisReticleBl} />
          <div className={styles.chassisReticleBr} />

          {/* Top Row: Search Input + Floating Status Segment */}
          <div className={styles.commandRowTop}>
            <div className={styles.searchContainer}>
              <Search size={15} className={styles.searchIcon} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search articles, topics, or key questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              <div className={styles.searchActions}>
                {searchQuery && (
                  <span className={styles.searchMatchPill}>
                    Matching Articles
                  </span>
                )}
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
                <span className={styles.searchKbd} title="Press / to search">/</span>
              </div>
            </div>

            {/* Engineered Status Toggle Switcher */}
            <div className={styles.statusSegment}>
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`${styles.statusToggleBtn} ${statusFilter === 'all' ? styles.statusToggleBtnActive : ''}`}
              >
                All Articles
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('published')}
                className={`${styles.statusToggleBtn} ${statusFilter === 'published' ? styles.statusToggleBtnActive : ''}`}
              >
                Ready to Read
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('planned')}
                className={`${styles.statusToggleBtn} ${statusFilter === 'planned' ? styles.statusToggleBtnActive : ''}`}
              >
                Roadmap
              </button>
            </div>
          </div>

          {/* Middle: Horizontal Category Rail (Zero Wrap, Pure Fluid Track) */}
          <div className={styles.domainRailWrapper}>
            <div className={styles.domainRailTrack}>
              <button
                type="button"
                onClick={() => setSelectedTopic('all')}
                className={`${styles.domainPill} ${selectedTopic === 'all' ? styles.domainPillActive : ''}`}
              >
                <span className={styles.pillIcon}>{TOPIC_ICONS['all']}</span>
                <span>ALL</span>
              </button>

              {TOPICS.map((t) => {
                const isActive = selectedTopic === t.slug;
                const icon = TOPIC_ICONS[t.slug] || '✦';
                return (
                  <button
                    key={t.slug}
                    type="button"
                    onClick={() => setSelectedTopic(t.slug)}
                    className={`${styles.domainPill} ${isActive ? styles.domainPillActive : ''}`}
                  >
                    <span className={styles.pillIcon}>{icon}</span>
                    <span>{t.name.toUpperCase()}</span>
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
                  <span>RESET FILTERS</span>
                  <X size={11} />
                </button>
              )}
            </div>
          </div>

          {/* Bottom Context Rail: Reader-Centric Promise */}
          <div className={styles.readoutBar}>
            <span className={styles.readoutCount}>
              {isFiltered ? 'FILTERED ARCHIVE' : 'PRODUCTION SYSTEMS ARCHIVE'}
            </span>
            <span className={styles.readoutTagline}>
              CLEAR EXPLANATIONS OF REAL PRODUCTION SYSTEMS · ZERO UNEXPLAINED JARGON
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          ARTICLE CARDS GRID: 3-Column Machined Double-Bezel Architecture
          ========================================================================= */}
      <section className={styles.articlesGridSection}>
        <div className={styles.articlesGrid}>
          {filteredArticles.map((article) => {
            const isLive = article.status === 'published';
            const isFieldGuide = article.type === 'Pillar';
            const readingTime = article.readingTime || (isFieldGuide ? '10 min read' : '6 min read');
            const standfirstText = article.beginnerStandfirst || article.standfirst;

            const cardContent = (
              <>
                {/* Luminous top-edge scanline */}
                <div className={styles.cardTopScanline} />
                {/* 4-corner micro hardware reticles */}
                <div className={styles.cardCornerReticleTl} />
                <div className={styles.cardCornerReticleBr} />
                {/* Interactive cursor spotlight */}
                <div className={styles.cardSpotlight} />

                {/* Field Guide Ambient Rim Accent */}
                {isFieldGuide && <div className={styles.fieldGuideGlow} />}

                <div className={styles.cardContent}>
                  {/* Card Header: Topic Badge + Type Distinction */}
                  <div className={styles.cardHeader}>
                    <span className={styles.topicBadge}>{article.topic}</span>
                    {isFieldGuide ? (
                      <div className={styles.fieldGuideBadgeGroup}>
                        <span className={styles.typeBadgeFieldGuide}>
                          <Sparkles size={9} />
                          <span>FIELD GUIDE</span>
                        </span>
                        <span className={styles.startHereChip}>START HERE</span>
                      </div>
                    ) : (
                      <span className={styles.typeBadgeDeepDive}>
                        DEEP DIVE · MECHANISM
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className={styles.cardTitle}>{article.title}</h3>

                  {/* Beginner-Friendly Standfirst */}
                  <p className={styles.cardStandfirst}>{standfirstText}</p>

                  {/* The Big Question Box */}
                  {article.focusQuestion && (
                    <div className={styles.focusQuestionBox}>
                      <span className={styles.focusQuestionLabel}>✦ THE BIG QUESTION</span>
                      <p className={styles.focusQuestionText}>{article.focusQuestion}</p>
                    </div>
                  )}

                  {/* Reading Metadata & 3-Step Reading Stepper (Replaces SEO Keywords & Dashes) */}
                  <div className={styles.metaRow}>
                    <div className={styles.metaPillsLeft}>
                      <span className={styles.readingTimePill}>
                        <Clock size={11} />
                        <span>{readingTime}</span>
                      </span>
                      <span className={styles.levelPill}>
                        {isFieldGuide ? 'Overview' : 'Focused'}
                      </span>
                    </div>

                    {/* 3-Step Mechanism Stepper */}
                    <div
                      className={styles.readingStepper}
                      title={isLive ? 'Full 3-step mechanism: What it is, How it works, Why it matters' : 'Drafting roadmap'}
                    >
                      <span className={`${styles.stepDot} ${isLive ? styles.stepDotActive : ''}`} />
                      <span className={`${styles.stepConnector} ${isLive ? styles.stepConnectorActive : ''}`} />
                      <span className={`${styles.stepDot} ${isLive ? styles.stepDotActive : ''}`} />
                      <span className={`${styles.stepConnector} ${isLive ? styles.stepConnectorActive : ''}`} />
                      <span className={`${styles.stepDot} ${isLive ? styles.stepDotActive : ''}`} />
                    </div>
                  </div>

                  {/* Card Footer: Living Action vs Roadmap Preview */}
                  <div className={styles.cardFooter}>
                    {isLive ? (
                      <>
                        <span className={styles.liveBeacon}>
                          <span className={styles.liveDot} />
                          <span>AVAILABLE NOW</span>
                        </span>
                        <div className={styles.buttonInButton}>
                          <span>Read Guide</span>
                          <span className={styles.buttonIconCircle}>
                            <ArrowRight size={12} />
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className={styles.comingSoonBeacon}>
                          <span className={styles.comingSoonDot} />
                          <span>DRAFT IN PROGRESS</span>
                        </span>
                        <span className={styles.roadmapTag}>ROADMAP</span>
                      </>
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
                  className={`${styles.articleCard} ${styles.articleCardLive} ${isFieldGuide ? styles.articleCardFieldGuide : ''}`}
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                >
                  {cardContent}
                </Link>
              );
            }

            return (
              <div
                key={article.slug}
                className={`${styles.articleCard} ${styles.articleCardPlanned} ${isFieldGuide ? styles.articleCardFieldGuide : ''}`}
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
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
                Explore our field guides spanning AI & Automation, Marketing & Ads, Web Design, and E-commerce.
              </div>
            </div>
          </div>
          <Link to="/topics" className={styles.topicsStripBtn}>
            <span>Explore Field Guides</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
};
