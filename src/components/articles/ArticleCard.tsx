import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { ArticleEntry } from '../../data/slug-registry';
import { CinematicCardCanvas } from './CinematicCardCanvas';
import styles from '../../styles/articles.module.css';

interface ArticleCardProps {
  article: ArticleEntry;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isLive = article.status === 'published';
  const readingTime = article.readingTime || '6 min read';
  const summaryText = article.beginnerStandfirst || article.standfirst;

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
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

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    setIsHovered(false);
    e.currentTarget.style.setProperty('--card-rotate-x', '0deg');
    e.currentTarget.style.setProperty('--card-rotate-y', '0deg');
  };

  const cardInner = (
    <>
      {/* Luminous top border accent */}
      <div className={styles.cardTopScanline} />
      {/* Interactive cursor spotlight */}
      <div className={styles.cardSpotlight} />

      {/* Visual Motion Stage */}
      <div className={styles.cardVisualStage}>
        <div className={styles.visualGridPattern} />
        <div className={styles.visualVignette} />

        {/* Dynamic Atmospheric Canvas Animation */}
        <div className={styles.schematicWrapper}>
          <CinematicCardCanvas
            topicSlug={article.topicSlug}
            isHovered={isHovered}
          />
        </div>

        {/* Minimal Badges Overlay */}
        <div className={styles.visualBadges}>
          <span className={styles.visualTopicBadge}>{article.topic}</span>
          <span className={styles.visualTimeBadge}>
            <Clock size={10} />
            <span>{readingTime}</span>
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{article.title}</h3>
        <p className={styles.cardSummary}>{summaryText}</p>
      </div>

      {/* Card Footer */}
      <div className={styles.cardFooter}>
        <div className={styles.statusIndicator}>
          <span className={isLive ? styles.statusDotLive : styles.statusDotDraft} />
          <span>{isLive ? 'Available' : 'Coming soon'}</span>
        </div>

        {isLive ? (
          <div className={styles.readAction}>
            <span>Read article</span>
            <ArrowRight size={13} className={styles.readArrow} />
          </div>
        ) : (
          <span className={styles.inProgressLabel}>In progress</span>
        )}
      </div>
    </>
  );

  if (isLive) {
    return (
      <Link
        to={`/articles/${article.slug}`}
        className={`${styles.articleCard} ${styles.articleCardLive}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {cardInner}
      </Link>
    );
  }

  return (
    <div
      className={`${styles.articleCard} ${styles.articleCardPlanned}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {cardInner}
    </div>
  );
};
