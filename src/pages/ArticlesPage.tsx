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
  Compass
} from 'lucide-react';
import { CosmicWeb } from '../components/articles/CosmicWeb';
import { ArticleCard } from '../components/articles/ArticleCard';
import { CinematicCardCanvas } from '../components/articles/CinematicCardCanvas';
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
  const [spotlightHovered, setSpotlightHovered] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
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

  // 3D Tilt & Cursor Spotlight tracking for Spotlight Slab
  const handleSpotlightMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -3;
    const rotateY = ((x / rect.width) - 0.5) * 3;
    e.currentTarget.style.setProperty('--card-rotate-x', `${rotateX.toFixed(2)}deg`);
    e.currentTarget.style.setProperty('--card-rotate-y', `${rotateY.toFixed(2)}deg`);
    e.currentTarget.style.setProperty('--spotlight-x', `${x}px`);
    e.currentTarget.style.setProperty('--spotlight-y', `${y}px`);
  };

  const handleSpotlightMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    setSpotlightHovered(false);
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

  // Separate featured article from the grid
  const featuredArticle = filteredArticles.find((a) => a.type === 'Pillar');
  const gridArticles = featuredArticle
    ? filteredArticles.filter((a) => a.slug !== featuredArticle.slug)
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
      // Spotlight entrance
      if (spotlightRef.current) {
        gsap.fromTo(
          spotlightRef.current,
          { opacity: 0, y: isReduced ? 0 : 20 },
          {
            opacity: 1,
            y: 0,
            duration: isReduced ? 0.2 : 0.65,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
            scrollTrigger: {
              trigger: spotlightRef.current,
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
            stagger: isReduced ? 0 : 0.05,
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

  // Set SEO metadata and JSON-LD structured data
  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'Articles — Systems to Scale';

    let metaDesc = document.querySelector('meta[name="description"]');
    const originalDesc = metaDesc ? metaDesc.getAttribute('content') : '';
    const targetDesc =
      'Explore clear, visual explanations of how modern software and business systems work. Simple language, interactive schematics, and zero buzzwords.';

    if (metaDesc) {
      metaDesc.setAttribute('content', targetDesc);
    } else {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      metaDesc.setAttribute('content', targetDesc);
      document.head.appendChild(metaDesc);
    }

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', 'https://systemstoscale.tech/articles');
      document.head.appendChild(canonical);
    } else {
      canonical.setAttribute('href', 'https://systemstoscale.tech/articles');
    }

    const scriptId = 'articles-hub-jsonld';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const schemas = [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Systems to Scale Articles',
        description: targetDesc,
        url: 'https://systemstoscale.tech/articles',
        isPartOf: {
          '@type': 'WebSite',
          name: 'Systems to Scale',
          url: 'https://systemstoscale.tech'
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://systemstoscale.tech/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Articles',
            item: 'https://systemstoscale.tech/articles'
          }
        ]
      }
    ];

    scriptTag.textContent = JSON.stringify(schemas);

    return () => {
      document.title = originalTitle;
      if (metaDesc && originalDesc) {
        metaDesc.setAttribute('content', originalDesc);
      }
      if (scriptTag && scriptTag.parentNode) {
        scriptTag.parentNode.removeChild(scriptTag);
      }
    };
  }, []);

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
          SECTION B: FEATURED SPOTLIGHT (Clean Cinematic Showcase)
          ========================================================================= */}
      {featuredArticle && !isFiltered && (
        <section className={styles.spotlightSection} ref={spotlightRef}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionEyebrow}>
              <Sparkles size={13} />
              <span>FEATURED SPOTLIGHT</span>
            </div>
            <h2 className={styles.sectionHeading}>
              Spotlight.
            </h2>
            <p className={styles.sectionSub}>
              A great place to start: see how core systems connect and operate in real life.
            </p>
          </div>

          <div
            className={styles.spotlightSlab}
            onMouseEnter={() => setSpotlightHovered(true)}
            onMouseMove={handleSpotlightMouseMove}
            onMouseLeave={handleSpotlightMouseLeave}
          >
            <div className={styles.cardTopScanline} />
            <div className={styles.cardSpotlight} />

            <div className={styles.spotlightGrid}>
              {/* Left Column: Clear Text */}
              <div className={styles.spotlightLeft}>
                <div className={styles.spotlightBadges}>
                  <span className={styles.spotlightBadgePill}>
                    <Sparkles size={11} />
                    <span>FEATURED</span>
                  </span>
                  <span className={styles.topicBadge}>{featuredArticle.topic}</span>
                  <span className={styles.spotlightTimePill}>
                    <Clock size={10} />
                    <span>{featuredArticle.readingTime || '9 min read'}</span>
                  </span>
                </div>

                <h3 className={styles.spotlightTitle}>
                  {featuredArticle.title}
                </h3>

                <p className={styles.spotlightStandfirst}>
                  {featuredArticle.beginnerStandfirst || featuredArticle.standfirst}
                </p>

                <div className={styles.spotlightFooter}>
                  <Link
                    to={`/articles/${featuredArticle.slug}`}
                    className={styles.spotlightActionBtn}
                  >
                    <span>Read article</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Right Column: Animated Topic Schematic */}
              <div className={styles.spotlightRight}>
                <div className={styles.spotlightVisualStage}>
                  <div className={styles.visualGridPattern} />
                  <div className={styles.visualVignette} />
                  <div className={styles.spotlightSchematicWrapper}>
                    <CinematicCardCanvas
                      topicSlug={featuredArticle.topicSlug}
                      isHovered={spotlightHovered}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION C: ARTICLES LIBRARY GRID (Clean Cinematic Cards)
          ========================================================================= */}
      <section className={styles.articlesGridSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionEyebrow}>
            <Radio size={13} />
            <span>ARTICLES COLLECTION</span>
          </div>
          <h2 className={styles.sectionHeading}>
            Explore Articles.
          </h2>
          <p className={styles.sectionSub}>
            Visual, easy-to-understand explanations of modern software and business systems.
          </p>
        </div>

        {gridArticles.length === 0 ? (
          <div className={styles.emptyStateChassis}>
            <Search size={28} className={styles.emptyIcon} />
            <h3 className={styles.emptyHeading}>No Articles Found</h3>
            <p className={styles.emptyDesc}>
              No articles match your current search. Try resetting your search query or selecting another topic.
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
            {gridArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </section>

      {/* =========================================================================
          SECTION D: BUILT FOR CLARITY (Our Approach)
          ========================================================================= */}
      <section className={styles.protocolSection} ref={protocolRef}>
        <div className={styles.protocolChassis}>
          <div className={styles.protocolHeader}>
            <div className={styles.protocolEyebrow}>
              <Radio size={13} />
              <span>HOW WE EXPLAIN SYSTEMS</span>
            </div>
            <h2 className={styles.protocolTitle}>
              Built for clarity.
            </h2>
            <p className={styles.protocolSub}>
              Every article is written to make complex concepts intuitive and practical, without overwhelming you with buzzwords.
            </p>
          </div>

          <div className={styles.protocolGrid}>
            {/* Card 01 */}
            <div className={styles.protocolCard}>
              <div className={styles.protocolCardTop}>
                <span className={styles.protocolNum}>01</span>
                <span className={styles.protocolTag}>PLAIN LANGUAGE</span>
              </div>
              <h3 className={styles.protocolCardHeading}>No confusing buzzwords</h3>
              <p className={styles.protocolCardBody}>
                Every concept is explained step by step in clear, everyday language so anyone can understand the core mechanism.
              </p>
              <div className={styles.protocolPills}>
                <span>Simple Terms</span>
                <span>Zero Fluff</span>
              </div>
            </div>

            {/* Card 02 */}
            <div className={styles.protocolCard}>
              <div className={styles.protocolCardTop}>
                <span className={styles.protocolNum}>02</span>
                <span className={styles.protocolTag}>VISUAL MECHANICS</span>
              </div>
              <h3 className={styles.protocolCardHeading}>See how it works</h3>
              <p className={styles.protocolCardBody}>
                Interactive diagrams and moving schematics show you exactly what is happening under the surface as data flows through the system.
              </p>
              <div className={styles.protocolPills}>
                <span>Animated Flows</span>
                <span>Visual Clarity</span>
              </div>
            </div>

            {/* Card 03 */}
            <div className={styles.protocolCard}>
              <div className={styles.protocolCardTop}>
                <span className={styles.protocolNum}>03</span>
                <span className={styles.protocolTag}>PRACTICAL VALUE</span>
              </div>
              <h3 className={styles.protocolCardHeading}>Real-world principles</h3>
              <p className={styles.protocolCardBody}>
                Understand what breaks when traffic surges, why certain designs matter, and practical rules you can actually apply.
              </p>
              <div className={styles.protocolPills}>
                <span>Practical Insight</span>
                <span>Reliable Systems</span>
              </div>
            </div>
          </div>

          <div className={styles.protocolFooter}>
            <span className={styles.protocolFootprint}>
              CLEAR EXPLANATIONS // VISUAL SCHEMATICS // REAL-WORLD EXAMPLES
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION E: CROSS-TOPIC HORIZON PORTAL (Explore Topics Navigation)
          ========================================================================= */}
      <section className={styles.horizonSection}>
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
                <h3 className={styles.horizonTitle}>Explore by topic</h3>
                <p className={styles.horizonDesc}>
                  Browse interactive simulations and articles across our eight core areas.
                </p>
              </div>
            </div>

            <Link to="/topics" className={styles.horizonBtn}>
              <span>Explore all topics</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
