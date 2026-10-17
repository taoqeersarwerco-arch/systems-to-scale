import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ALL_ARTICLES, ArticleEntry } from '../data/slug-registry';
import { TOPICS, TopicData } from '../data/topics';
import { Search, ArrowRight, ArrowUpRight } from 'lucide-react';
import { PerlinFlowField } from '../components/articles/PerlinFlowField';
import { NewsletterCta } from '../components/sections/NewsletterCta';
import styles from '../styles/articles.module.css';

// Cross-topic relationships for clean bridge connectors
const RELATED_TOPICS: Record<string, string[]> = {
  'ai-automation': ['Customer Service', 'E-commerce'],
  'marketing-ads': ['E-commerce', 'Web Design'],
  'web-design': ['Marketing & Ads', 'E-commerce'],
  'e-commerce': ['AI & Automation', 'Customer Service'],
  'customer-service': ['AI & Automation', 'Virtual Assistance'],
  'virtual-assistance': ['Personal Assistance', 'Customer Service'],
  'pitch-decks': ['Marketing & Ads', 'Web Design'],
  'personal-assistance': ['Virtual Assistance', 'AI & Automation'],
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

  // Filtered articles list
  const q = searchQuery.toLowerCase().trim();
  const filteredArticles = ALL_ARTICLES.filter((article: ArticleEntry) => {
    const matchesTopic = selectedTopic === 'all' || article.topicSlug === selectedTopic;
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
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

  const getTopicCount = (slug: string) => {
    if (slug === 'all') return ALL_ARTICLES.length;
    return ALL_ARTICLES.filter((a) => a.topicSlug === slug).length;
  };

  // Group filtered articles by topic
  const activeTopics = TOPICS.filter((t) => {
    if (selectedTopic !== 'all' && t.slug !== selectedTopic) return false;
    return filteredArticles.some((a) => a.topicSlug === t.slug);
  });

  return (
    <div className={styles.articlesPage}>
      {/* =========================================================================
          SECTION 1 — HERO: Living Perlin Noise Flow Field & Minimal Overlay
          ========================================================================= */}
      <div className={styles.continuousCanvasWrapper}>
        <PerlinFlowField />
      </div>

      <section className={styles.heroSection}>
        <div className={styles.heroOverlay}>
          <div className={styles.heroEyebrow}>technical archive</div>

          <h1 className={styles.heroTitle}>The archive.</h1>
          <div className={styles.heroTitleSub}>40 production systems.</div>

          <p className={styles.heroDesc}>
            Every mechanism explained at the level where you could rebuild it. What it is, how it works, why it matters.
          </p>

          {/* Fused 4-Cell Stats Bar in DM Mono */}
          <div className={styles.statsBar}>
            <div className={styles.statCell}>
              <span className={styles.statNumber}>40</span>
              <span className={styles.statLabel}>articles</span>
            </div>
            <div className={styles.statCell}>
              <span className={styles.statNumber}>8</span>
              <span className={styles.statLabel}>topics</span>
            </div>
            <div className={styles.statCell}>
              <span className={styles.statNumber}>{publishedCount}</span>
              <span className={styles.statLabel}>published</span>
            </div>
            <div className={styles.statCell}>
              <span className={styles.statNumber}>{plannedCount}</span>
              <span className={styles.statLabel}>coming soon</span>
            </div>
          </div>

          {/* Minimal Animated Scroll Hint */}
          <div className={styles.scrollHint}>
            <span className={styles.scrollHintText}>Scroll</span>
            <div className={styles.scrollLine} />
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2 — FILTER BAR: Thin Transitional Control Surface
          ========================================================================= */}
      <section className={styles.filterBarSection}>
        <div className={styles.filterChassis}>
          {/* Top Row: Search Input + Status Tabs */}
          <div className={styles.filterRowTop}>
            <div className={styles.searchBox}>
              <Search size={14} className={styles.searchIcon} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search articles, keywords, or mechanisms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              <span className={styles.searchKbd}>/</span>
            </div>

            {/* Status Tabs: All / Published / Coming soon */}
            <div className={styles.statusTabs}>
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`${styles.statusTabBtn} ${statusFilter === 'all' ? styles.statusTabBtnActive : ''}`}
              >
                All ({ALL_ARTICLES.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('published')}
                className={`${styles.statusTabBtn} ${statusFilter === 'published' ? styles.statusTabBtnActive : ''}`}
              >
                Published ({publishedCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('planned')}
                className={`${styles.statusTabBtn} ${statusFilter === 'planned' ? styles.statusTabBtnActive : ''}`}
              >
                Coming soon ({plannedCount})
              </button>
            </div>
          </div>

          {/* Bottom Row: Topic Filter Pills */}
          <div className={styles.topicPillRow}>
            <button
              type="button"
              onClick={() => setSelectedTopic('all')}
              className={`${styles.topicPill} ${selectedTopic === 'all' ? styles.topicPillActive : ''}`}
            >
              <span>All</span>
              <span className={styles.topicCountBadge}>({getTopicCount('all')})</span>
            </button>
            {TOPICS.map((t) => {
              const count = getTopicCount(t.slug);
              const isActive = selectedTopic === t.slug;
              return (
                <button
                  key={t.slug}
                  type="button"
                  onClick={() => setSelectedTopic(t.slug)}
                  className={`${styles.topicPill} ${isActive ? styles.topicPillActive : ''}`}
                >
                  <span>{t.name}</span>
                  <span className={styles.topicCountBadge}>({count})</span>
                </button>
              );
            })}
          </div>

          {/* Honest Article Count Line */}
          <div className={styles.countLine}>
            <span>
              Showing {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'}
            </span>
            <span>All systems verified against production loads</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3 — ARTICLE LIST: Grouped by Topic (Field Guide + Deep Dives)
          ========================================================================= */}
      <section className={styles.articlesGroupSection}>
        {activeTopics.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 20px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--sts-font-mono)', fontSize: '13px' }}>
            No articles match your search or filter criteria.
          </div>
        ) : (
          activeTopics.map((topic: TopicData, topicIdx: number) => {
            const topicArticles = filteredArticles.filter((a) => a.topicSlug === topic.slug);
            const fieldGuide = topicArticles.find((a) => a.type === 'Pillar') ||
              (q === '' && statusFilter === 'all' ? ALL_ARTICLES.find((a) => a.topicSlug === topic.slug && a.type === 'Pillar') : undefined);
            const deepDives = topicArticles.filter((a) => a.type === 'Cluster');
            const totalDeepDives = ALL_ARTICLES.filter((a) => a.topicSlug === topic.slug && a.type === 'Cluster').length;
            const related = RELATED_TOPICS[topic.slug];

            return (
              <div key={topic.slug} className={styles.topicGroup}>
                {/* Visual Left Rail */}
                <div className={styles.topicRail}>
                  <div className={styles.topicRailDot} />
                </div>

                {/* (a) Group Header */}
                <div className={styles.groupHeader}>
                  <span className={styles.groupTitle}>{topic.name.toLowerCase()}</span>
                  <div className={styles.groupRule} />
                  <span className={styles.groupCount}>
                    {topicArticles.length} {topicArticles.length === 1 ? 'article' : 'articles'}
                  </span>
                </div>

                {/* (b) Field Guide Card (Full Width) */}
                {fieldGuide && (
                  (() => {
                    const isLive = fieldGuide.status === 'published';

                    const cardInner = (
                      <>
                        <div className={styles.cardScanline} />
                        <div className={styles.fieldGuideAccent} />

                        <div className={styles.fieldGuideTop}>
                          <div className={styles.badgeGroup}>
                            <span className={styles.typeBadgeFieldGuide}>Field guide</span>
                            <span className={styles.topicTagMono}>{fieldGuide.topic}</span>
                          </div>
                          <span className={styles.deepDivesCountBadge}>
                            {totalDeepDives} deep dives in this topic
                          </span>
                        </div>

                        <h3 className={styles.fieldGuideTitle}>{fieldGuide.title}</h3>
                        <p className={styles.fieldGuideDesc}>{fieldGuide.standfirst}</p>

                        <div className={styles.cardMetaRow}>
                          <span className={styles.metaKeyword}>keyword // {fieldGuide.focusKeyword}</span>

                          <div className={styles.metaRight}>
                            {/* Three-Question Spine Indicator */}
                            <div className={styles.spineIndicator} title={isLive ? 'Three-question spine: Complete' : 'Three-question spine: Planned'}>
                              <span className={`${styles.spineBar} ${isLive ? styles.spineBarFilled : ''}`} />
                              <span className={`${styles.spineBar} ${isLive ? styles.spineBarFilled : ''}`} />
                              <span className={`${styles.spineBar} ${isLive ? styles.spineBarFilled : ''}`} />
                            </div>

                            {isLive ? (
                              <span className={styles.cardArrowIcon}>
                                <ArrowRight size={14} />
                              </span>
                            ) : (
                              <span className={styles.statusDotComingSoon}>
                                <span className={styles.statusDot} />
                                <span>Coming soon</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </>
                    );

                    if (isLive) {
                      return (
                        <Link
                          key={fieldGuide.slug}
                          to={`/articles/${fieldGuide.slug}`}
                          className={`${styles.cardBase} ${styles.cardInteractive} ${styles.fieldGuideCard}`}
                        >
                          {cardInner}
                        </Link>
                      );
                    }

                    return (
                      <div
                        key={fieldGuide.slug}
                        className={`${styles.cardBase} ${styles.cardComingSoon} ${styles.fieldGuideCard}`}
                      >
                        {cardInner}
                      </div>
                    );
                  })()
                )}

                {/* (c) Deep Dive Cards (2-Column Grid beneath the Field Guide) */}
                {deepDives.length > 0 && (
                  <div className={styles.deepDiveGrid}>
                    {deepDives.map((article) => {
                      const isLive = article.status === 'published';

                      const cardInner = (
                        <>
                          <div className={styles.cardScanline} />

                          <div>
                            <div className={styles.deepDiveTop}>
                              <span className={styles.typeBadgeDeepDive}>Deep dive</span>
                              <span className={styles.deepDiveUplink}>
                                <ArrowUpRight size={11} />
                                <span>field guide</span>
                              </span>
                            </div>

                            <h4 className={styles.deepDiveTitle}>{article.title}</h4>
                            <p className={styles.deepDiveDesc}>{article.standfirst}</p>
                          </div>

                          <div className={styles.cardMetaRow}>
                            <span className={styles.metaKeyword}>{article.focusKeyword}</span>

                            <div className={styles.metaRight}>
                              {/* Three-Question Spine Indicator */}
                              <div className={styles.spineIndicator} title={isLive ? 'Three-question spine: Complete' : 'Three-question spine: Planned'}>
                                <span className={`${styles.spineBar} ${isLive ? styles.spineBarFilled : ''}`} />
                                <span className={`${styles.spineBar} ${isLive ? styles.spineBarFilled : ''}`} />
                                <span className={`${styles.spineBar} ${isLive ? styles.spineBarFilled : ''}`} />
                              </div>

                              {isLive ? (
                                <span className={styles.cardArrowIcon}>
                                  <ArrowRight size={13} />
                                </span>
                              ) : (
                                <span className={styles.statusDotComingSoon}>
                                  <span className={styles.statusDot} />
                                  <span>Coming soon</span>
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
                            className={`${styles.cardBase} ${styles.cardInteractive} ${styles.deepDiveCard}`}
                          >
                            {cardInner}
                          </Link>
                        );
                      }

                      return (
                        <div
                          key={article.slug}
                          className={`${styles.cardBase} ${styles.cardComingSoon} ${styles.deepDiveCard}`}
                        >
                          {cardInner}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Cross-Topic Bridge Connector (Between groups) */}
                {related && topicIdx < activeTopics.length - 1 && selectedTopic === 'all' && (
                  <div className={styles.bridgeConnector}>
                    <div className={styles.bridgeDashedLine} />
                    <span className={styles.bridgeLabel}>Related topics: {related.join(', ')}</span>
                    <div className={styles.bridgeDashedLine} />
                  </div>
                )}
              </div>
            );
          })
        )}
      </section>

      {/* =========================================================================
          SECTION 4 — THE METHOD CARD: The Three-Question Standard
          ========================================================================= */}
      <section className={styles.methodSection}>
        <div className={styles.methodCard}>
          <div className={styles.methodContent}>
            <div className={styles.methodEyebrow}>the standard method</div>
            <h2 className={styles.methodHeading}>
              What it is. How it works. Why it matters.
            </h2>
            <p className={styles.methodDesc}>
              Every article answers the exact same three questions down to the physical mechanism. No high-level summaries,
              no promotional hand-waving. Built for engineers and founders who need to understand how things actually work.
            </p>
          </div>
          <Link to="/about#method" className={styles.methodBtn}>
            <span>Understand our method</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5 — NEWSLETTER CTA: Standard Reusable Component
          ========================================================================= */}
      <NewsletterCta topicTag="articles" />
    </div>
  );
};
