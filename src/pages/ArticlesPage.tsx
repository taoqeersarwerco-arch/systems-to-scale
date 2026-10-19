import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ALL_ARTICLES, ArticleEntry } from '../data/slug-registry';
import { TOPICS } from '../data/topics';
import {
  Search,
  ArrowRight,
  Layers,
  Radio,
  X,
  Clock,
  Sparkles,
  ChevronDown,
  Zap,
  TrendingUp,
  Layout,
  ShoppingBag,
  MessageSquare,
  Bot,
  BarChart3,
  Compass,
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';
import { CosmicWeb } from '../components/articles/CosmicWeb';
import styles from '../styles/articles.module.css';

gsap.registerPlugin(ScrollTrigger);

// Pure monochrome topic vector icon mapping
const renderTopicIcon = (slug: string) => {
  switch (slug) {
    case 'all':
      return <Sparkles size={12} className={styles.pillVectorIcon} />;
    case 'ai-automation':
      return <Zap size={12} className={styles.pillVectorIcon} />;
    case 'marketing-ads':
      return <TrendingUp size={12} className={styles.pillVectorIcon} />;
    case 'web-design':
      return <Layout size={12} className={styles.pillVectorIcon} />;
    case 'e-commerce':
      return <ShoppingBag size={12} className={styles.pillVectorIcon} />;
    case 'customer-service':
      return <MessageSquare size={12} className={styles.pillVectorIcon} />;
    case 'virtual-assistance':
      return <Bot size={12} className={styles.pillVectorIcon} />;
    case 'pitch-decks':
      return <BarChart3 size={12} className={styles.pillVectorIcon} />;
    case 'personal-assistance':
      return <Compass size={12} className={styles.pillVectorIcon} />;
    default:
      return <Layers size={12} className={styles.pillVectorIcon} />;
  }
};

export const ArticlesPage: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const protocolRef = useRef<HTMLDivElement>(null);

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
    const rotateX = ((y / rect.height) - 0.5) * -4;
    const rotateY = ((x / rect.width) - 0.5) * 4;
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
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      q === '' ||
      article.title.toLowerCase().includes(q) ||
      article.focusKeyword.toLowerCase().includes(q) ||
      (article.beginnerStandfirst && article.beginnerStandfirst.toLowerCase().includes(q)) ||
      article.standfirst.toLowerCase().includes(q) ||
      (article.focusQuestion && article.focusQuestion.toLowerCase().includes(q));
    return matchesTopic && matchesSearch;
  });

  // Separate the foundational Field Guide (Pillar) from component deep dives
  const featuredFieldGuide = filteredArticles.find((a) => a.type === 'Pillar');
  const deepDiveArticles = featuredFieldGuide
    ? filteredArticles.filter((a) => a.slug !== featuredFieldGuide.slug)
    : filteredArticles;

  const isFiltered = searchQuery !== '' || selectedTopic !== 'all';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedTopic('all');
  };

  const handleScrollToDeck = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById('command-deck');
    if (target) {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
    }
  };

  // GSAP ScrollTrigger reveals
  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      // Marquee entrance
      if (marqueeRef.current) {
        gsap.fromTo(
          marqueeRef.current,
          { opacity: 0, y: isReduced ? 0 : 20 },
          {
            opacity: 1,
            y: 0,
            duration: isReduced ? 0.2 : 0.65,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
            scrollTrigger: {
              trigger: marqueeRef.current,
              start: 'top 85%',
              once: true
            }
          }
        );
      }

      // Grid cards entrance
      if (gridRef.current) {
        const cards = gridRef.current.children;
        gsap.fromTo(
          cards,
          { opacity: 0, y: isReduced ? 0 : 22 },
          {
            opacity: 1,
            y: 0,
            duration: isReduced ? 0.2 : 0.6,
            stagger: isReduced ? 0 : 0.06,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 82%',
              once: true
            }
          }
        );
      }

      // Protocol section entrance
      if (protocolRef.current) {
        gsap.fromTo(
          protocolRef.current,
          { opacity: 0, y: isReduced ? 0 : 20 },
          {
            opacity: 1,
            y: 0,
            duration: isReduced ? 0.2 : 0.6,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
            scrollTrigger: {
              trigger: protocolRef.current,
              start: 'top 85%',
              once: true
            }
          }
        );
      }
    });

    return () => ctx.revert();
  }, [selectedTopic, searchQuery]);

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
          SECTION A: OBSERVATORY COMMAND DECK (Search & Topics Console)
          ========================================================================= */}
      <section className={styles.commandDeckSection} id="command-deck">
        <div className={styles.commandChassis}>
          {/* Subtle 4-Corner Reticle Hardware Accents */}
          <div className={styles.chassisReticleTl} aria-hidden="true" />
          <div className={styles.chassisReticleTr} aria-hidden="true" />
          <div className={styles.chassisReticleBl} aria-hidden="true" />
          <div className={styles.chassisReticleBr} aria-hidden="true" />

          {/* Full-Width Cinematic Search Bar */}
          <div className={styles.searchRow}>
            <div className={styles.searchContainer}>
              <Search size={15} className={styles.searchIcon} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search articles, topics, or key production questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              <div className={styles.searchActions}>
                {searchQuery && (
                  <span className={styles.searchMatchPill}>
                    {filteredArticles.length} MATCHING
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
          </div>

          {/* Horizontal Topics Rail (Zero Wrap, Pure Fluid Track with Monochrome Vector Icons) */}
          <div className={styles.domainRailWrapper}>
            <div className={styles.domainRailTrack}>
              <button
                type="button"
                onClick={() => setSelectedTopic('all')}
                className={`${styles.domainPill} ${selectedTopic === 'all' ? styles.domainPillActive : ''}`}
              >
                <span className={styles.pillIcon}>{renderTopicIcon('all')}</span>
                <span>ALL</span>
              </button>

              {TOPICS.map((t) => {
                const isActive = selectedTopic === t.slug;
                return (
                  <button
                    key={t.slug}
                    type="button"
                    onClick={() => setSelectedTopic(t.slug)}
                    className={`${styles.domainPill} ${isActive ? styles.domainPillActive : ''}`}
                  >
                    <span className={styles.pillIcon}>{renderTopicIcon(t.slug)}</span>
                    <span>{t.name.toUpperCase()}</span>
                  </button>
                );
              })}

              {/* Instant Filter Reset */}
              {isFiltered && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className={styles.resetFiltersBtn}
                  title="Reset active filters"
                >
                  <span>RESET FILTERS</span>
                  <X size={11} />
                </button>
              )}
            </div>
          </div>

          {/* Live System Telemetry Status Bar */}
          <div className={styles.telemetryStatusBar}>
            <div className={styles.telemetryLeft}>
              <span className={styles.telemetryDot} />
              <span className={styles.telemetryText}>
                {filteredArticles.length} PRODUCTION {filteredArticles.length === 1 ? 'SYSTEM' : 'SYSTEMS'} AVAILABLE
              </span>
              <span className={styles.telemetryDivider}>//</span>
              <span className={styles.telemetryScope}>
                {selectedTopic === 'all' ? 'ALL DISCIPLINES' : selectedTopic.toUpperCase().replace('-', ' ')}
              </span>
            </div>
            <div className={styles.telemetryRight}>
              <span className={styles.telemetryTag}>100% SPEC VERIFIED</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION B: FEATURED FIELD GUIDE MARQUEE SLAB (Foundational Pillar)
          ========================================================================= */}
      {featuredFieldGuide && (
        <section className={styles.marqueeSection} ref={marqueeRef}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionEyebrow}>
              <Sparkles size={13} />
              <span>FOUNDATIONAL ARCHITECTURE // FIELD GUIDE</span>
            </div>
            <h2 className={styles.sectionHeading}>
              System Anchor Guide.
            </h2>
            <p className={styles.sectionSub}>
              Foundational mental models and primary execution contracts before diving into individual mechanism edge cases.
            </p>
          </div>

          <div
            className={styles.marqueeSlab}
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
          >
            {/* Specular scanline & 4-corner reticles */}
            <div className={styles.cardTopScanline} />
            <div className={styles.cardCornerReticleTl} aria-hidden="true" />
            <div className={styles.cardCornerReticleBr} aria-hidden="true" />
            <div className={styles.cardSpotlight} />

            <div className={styles.marqueeGrid}>
              {/* Left Column: Editorial Primacy */}
              <div className={styles.marqueeLeft}>
                <div className={styles.marqueeBadges}>
                  <span className={styles.topicBadge}>{featuredFieldGuide.topic}</span>
                  <span className={styles.fieldGuideHeroBadge}>
                    <Sparkles size={11} />
                    <span>FIELD GUIDE · START HERE</span>
                  </span>
                  <span className={styles.readingTimePill}>
                    <Clock size={11} />
                    <span>{featuredFieldGuide.readingTime || '10 min read'}</span>
                  </span>
                </div>

                <h3 className={styles.marqueeTitle}>
                  {featuredFieldGuide.title}
                </h3>

                <p className={styles.marqueeStandfirst}>
                  {featuredFieldGuide.beginnerStandfirst || featuredFieldGuide.standfirst}
                </p>

                <div className={styles.marqueeFooter}>
                  <div className={styles.liveBeacon}>
                    <span className={styles.liveDot} />
                    <span>PRIMARY BLUEPRINT READY</span>
                  </div>

                  <Link
                    to={`/articles/${featuredFieldGuide.slug}`}
                    className={styles.marqueeActionBtn}
                  >
                    <span>Read Foundational Guide</span>
                    <span className={styles.marqueeActionIcon}>
                      <ArrowRight size={13} />
                    </span>
                  </Link>
                </div>
              </div>

              {/* Right Column: System Blueprint Telemetry */}
              <div className={styles.marqueeRight}>
                <div className={styles.blueprintChassis}>
                  <div className={styles.blueprintHeader}>
                    <SlidersHorizontal size={13} />
                    <span>THREE-STAGE EXECUTION CONTRACT</span>
                  </div>

                  {featuredFieldGuide.focusQuestion && (
                    <div className={styles.blueprintQuestionBox}>
                      <span className={styles.blueprintQuestionLabel}>✦ THE CORE SYSTEM QUESTION</span>
                      <p className={styles.blueprintQuestionText}>
                        "{featuredFieldGuide.focusQuestion}"
                      </p>
                    </div>
                  )}

                  <div className={styles.blueprintStages}>
                    <div className={styles.blueprintStageItem}>
                      <span className={styles.stageNum}>01</span>
                      <div className={styles.stageText}>
                        <div className={styles.stageTitle}>Boundary Conditions</div>
                        <div className={styles.stageDesc}>Inputs, outputs, and network trust assumptions</div>
                      </div>
                    </div>
                    <div className={styles.blueprintStageItem}>
                      <span className={styles.stageNum}>02</span>
                      <div className={styles.stageText}>
                        <div className={styles.stageTitle}>State Machine Execution</div>
                        <div className={styles.stageDesc}>Worker pools, retries, idempotency & backoff physics</div>
                      </div>
                    </div>
                    <div className={styles.blueprintStageItem}>
                      <span className={styles.stageNum}>03</span>
                      <div className={styles.stageText}>
                        <div className={styles.stageTitle}>Extreme Load Verification</div>
                        <div className={styles.stageDesc}>Cascade failure prevention under high concurrency</div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.blueprintFooter}>
                    <span className={styles.blueprintCheck}>
                      <CheckCircle2 size={12} />
                      <span>PRIMARY SOURCE VERIFIED</span>
                    </span>
                    <span className={styles.blueprintScope}>FOUNDATIONAL OVERVIEW</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION C: SYSTEMS ARCHIVE GRID (Technical Mechanism Deep Dives)
          ========================================================================= */}
      <section className={styles.articlesGridSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionEyebrow}>
            <Radio size={13} />
            <span>TECHNICAL SPECIFICATIONS // MECHANISMS</span>
          </div>
          <h2 className={styles.sectionHeading}>
            Component Specifications.
          </h2>
          <p className={styles.sectionSub}>
            Deep dive breakdowns dissecting the mechanics of individual pipelines, bidding engines, render trees, and queues.
          </p>
        </div>

        {deepDiveArticles.length === 0 ? (
          <div className={styles.emptyStateChassis}>
            <Search size={28} className={styles.emptyIcon} />
            <h3 className={styles.emptyHeading}>No Production Systems Found</h3>
            <p className={styles.emptyDesc}>
              No articles match the current filter criteria. Reset your search query or topic filter to browse the entire archive.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className={styles.emptyResetBtn}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className={styles.articlesGrid} ref={gridRef}>
            {deepDiveArticles.map((article) => {
              const isLive = article.status === 'published';
              const isFieldGuide = article.type === 'Pillar';
              const readingTime = article.readingTime || (isFieldGuide ? '10 min read' : '6 min read');
              const standfirstText = article.beginnerStandfirst || article.standfirst;

              const cardContent = (
                <>
                  {/* Luminous top-edge scanline */}
                  <div className={styles.cardTopScanline} />
                  {/* 4-corner micro hardware reticles */}
                  <div className={styles.cardCornerReticleTl} aria-hidden="true" />
                  <div className={styles.cardCornerReticleBr} aria-hidden="true" />
                  {/* Interactive cursor spotlight */}
                  <div className={styles.cardSpotlight} />

                  <div className={styles.cardContent}>
                    {/* Card Header: Topic Badge + Type Distinction + Reading Time */}
                    <div className={styles.cardHeader}>
                      <span className={styles.topicBadge}>{article.topic}</span>
                      <div className={styles.cardHeaderMeta}>
                        <span className={styles.typeBadgeDeepDive}>
                          {isFieldGuide ? 'FIELD GUIDE' : 'DEEP DIVE · MECHANISM'}
                        </span>
                        <span className={styles.readingTimePillSmall}>
                          <Clock size={10} />
                          <span>{readingTime}</span>
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className={styles.cardTitle}>{article.title}</h3>

                    {/* Beginner-Friendly Standfirst */}
                    <p className={styles.cardStandfirst}>{standfirstText}</p>

                    {/* Elevated Big Question Callout */}
                    {article.focusQuestion && (
                      <div className={styles.questionCallout}>
                        <span className={styles.questionPrefix}>✦ THE BIG QUESTION</span>
                        <p className={styles.questionQuote}>{article.focusQuestion}</p>
                      </div>
                    )}

                    {/* Reading Circuit Stepper */}
                    <div className={styles.metaRow}>
                      <span className={styles.levelPill}>
                        {isFieldGuide ? 'Overview' : 'Focused'}
                      </span>

                      <div
                        className={styles.readingStepper}
                        title={isLive ? '3-step mechanism: What it is, How it works, Why it matters' : 'Drafting roadmap'}
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
                          <div className={styles.liveBeacon}>
                            <span className={styles.liveDot} />
                            <span>AVAILABLE NOW</span>
                          </div>
                          <div className={styles.buttonInButton}>
                            <span>Read Guide</span>
                            <span className={styles.buttonIconCircle}>
                              <ArrowRight size={12} />
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className={styles.comingSoonBeacon}>
                            <span className={styles.comingSoonDot} />
                            <span>DRAFT IN PROGRESS</span>
                          </div>
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
                    className={`${styles.articleCard} ${styles.articleCardLive}`}
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
                  className={`${styles.articleCard} ${styles.articleCardPlanned}`}
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                >
                  {cardContent}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* =========================================================================
          SECTION D: THE THREE-QUESTION EDITORIAL PROTOCOL BAND
          ========================================================================= */}
      <section className={styles.protocolSection} ref={protocolRef}>
        <div className={styles.protocolChassis}>
          {/* Subtle reticles */}
          <div className={styles.chassisReticleTl} aria-hidden="true" />
          <div className={styles.chassisReticleTr} aria-hidden="true" />
          <div className={styles.chassisReticleBl} aria-hidden="true" />
          <div className={styles.chassisReticleBr} aria-hidden="true" />

          <div className={styles.protocolHeader}>
            <div className={styles.protocolEyebrow}>
              <Radio size={13} />
              <span>EDITORIAL PROTOCOL // ZERO MARKETING JARGON</span>
            </div>
            <h2 className={styles.protocolTitle}>
              The Three-Question Standard.
            </h2>
            <p className={styles.protocolSub}>
              Every system documented in this archive is held to a strict engineering standard.
              Before anything publishes, it must pass primary source verification across all three dimensions.
            </p>
          </div>

          <div className={styles.protocolGrid}>
            {/* Card 01 */}
            <div className={styles.protocolCard}>
              <div className={styles.protocolCardTop}>
                <span className={styles.protocolNum}>01</span>
                <span className={styles.protocolTag}>BOUNDARY CONDITIONS</span>
              </div>
              <h3 className={styles.protocolCardHeading}>What is the mechanism?</h3>
              <p className={styles.protocolCardBody}>
                Define the system's exact inputs, outputs, and constraints without marketing metaphors or hand-waving assumptions.
              </p>
              <div className={styles.protocolPills}>
                <span>Zero Jargon</span>
                <span>Primary Specs</span>
              </div>
            </div>

            {/* Card 02 */}
            <div className={styles.protocolCard}>
              <div className={styles.protocolCardTop}>
                <span className={styles.protocolNum}>02</span>
                <span className={styles.protocolTag}>PHYSICAL EXECUTION</span>
              </div>
              <h3 className={styles.protocolCardHeading}>How does it physically work?</h3>
              <p className={styles.protocolCardBody}>
                Deconstruct the execution path down to the wire: worker pools, network timeouts, idempotency keys, and state transitions.
              </p>
              <div className={styles.protocolPills}>
                <span>State Machines</span>
                <span>Failure Mode Analysis</span>
              </div>
            </div>

            {/* Card 03 */}
            <div className={styles.protocolCard}>
              <div className={styles.protocolCardTop}>
                <span className={styles.protocolNum}>03</span>
                <span className={styles.protocolTag}>PRODUCTION IMPACT</span>
              </div>
              <h3 className={styles.protocolCardHeading}>Why does it matter under load?</h3>
              <p className={styles.protocolCardBody}>
                Quantify what cascades when traffic surges or upstream APIs fail. What breaks if you engineer this improperly?
              </p>
              <div className={styles.protocolPills}>
                <span>High Concurrency</span>
                <span>Architectural Tradeoffs</span>
              </div>
            </div>
          </div>

          <div className={styles.protocolFooter}>
            <span className={styles.protocolFootprint}>
              PRIMARY SOURCES ONLY // SPEC VERIFIED // ZERO PSEUDONYMS // PRODUCTION TESTED
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION E: CROSS-TOPIC HORIZON PORTAL (Next Horizon Navigation)
          ========================================================================= */}
      <section className={styles.horizonSection}>
        {/* Curvature seam matching AboutPage */}
        <div className={styles.seamCurveContainer}>
          <svg viewBox="0 0 1440 44" fill="none" preserveAspectRatio="none" className={styles.seamSvg}>
            <path d="M0,0 C480,44 960,44 1440,0 L1440,44 L0,44 Z" fill="#0C0E10" />
          </svg>
        </div>

        <div className={styles.horizonChassis}>
          <div className={styles.horizonContent}>
            <div className={styles.horizonLeft}>
              <div className={styles.horizonIconBadge}>
                <Layers size={22} />
              </div>
              <div>
                <h3 className={styles.horizonTitle}>Explore Core Engineering Disciplines</h3>
                <p className={styles.horizonDesc}>
                  Systems to Scale structures its research across eight foundational areas, each featuring an interactive browser simulation of the underlying mechanism.
                </p>
              </div>
            </div>

            <Link to="/topics" className={styles.horizonBtn}>
              <span>Explore Topics Hub</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

