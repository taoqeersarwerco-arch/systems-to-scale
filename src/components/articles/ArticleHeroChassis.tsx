import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { HeroDistortionCanvas } from './HeroDistortionCanvas';
import styles from '../../styles/articleHeroChassis.module.css';

export interface ArticleHeroChassisProps {
  topic: string;
  topicSlug: string;
  type?: 'Pillar' | 'Cluster';
  title: string;
  standfirst: string;
  leadParagraph?: string;
  publishDate?: string;
  readingTime?: string;
  rfcSpec?: string;
}

export const ArticleHeroChassis: React.FC<ArticleHeroChassisProps> = ({
  topic,
  topicSlug,
  type = 'Pillar',
  title,
  standfirst,
  leadParagraph,
  publishDate = 'Nov 02, 2026',
  readingTime = '12 min read',
  rfcSpec = 'RFC-CRM-2026'
}) => {
  return (
    <section className={styles.heroChassis} aria-label={`${title} Header`}>
      {/* 1. Living Atmospheric Distortion Canvas in Deep Background (z-index: 1) */}
      <HeroDistortionCanvas />

      {/* 2. Atmospheric Reading Sanctuary Pocket (z-index: 2 · 100% Crisp Text Contrast) */}
      <div className={styles.readingPocket} aria-hidden="true" />

      {/* 3. 4-Corner Observatory Reticles (Exact match to Topics & Articles Hubs) */}
      <div className={styles.reticleTl} aria-hidden="true" />
      <div className={styles.reticleTr} aria-hidden="true" />
      <div className={styles.reticleBl} aria-hidden="true" />
      <div className={styles.reticleBr} aria-hidden="true" />

      {/* 4. Anchored, Authoritative Foreground Content (z-index: 5 · Rock-Solid Typography) */}
      <div className={styles.innerContainer}>
        {/* Navigation Breadcrumb Row */}
        <div className={styles.breadcrumbRow}>
          <Link to={`/topics/${topicSlug}`} className={styles.backLink}>
            <ArrowLeft size={14} />
            <span>{topic} Domain</span>
          </Link>

          <div className={styles.breadcrumbRight}>
            <span>SPEC: {rfcSpec}</span>
            <span>//</span>
            <span className={styles.pillarTag}>{type}</span>
          </div>
        </div>

        {/* Hero Content Column (Static, Anchored, Sharp) */}
        <div className={styles.heroContent}>
          <div className={styles.badgeWrapper}>
            <div className="sts-badge sts-badge-steel">
              <span>{topic} // Architecture</span>
            </div>
          </div>

          <h1 className={styles.headline}>
            {title}
          </h1>

          <p className={styles.standfirst}>
            {standfirst}
          </p>

          {leadParagraph && (
            <p className={styles.leadParagraph}>
              {leadParagraph}
            </p>
          )}

          {/* Clean Hairline Metadata Bar */}
          <div className={styles.metadataBar}>
            <div className={styles.metaLeft}>
              <div className={styles.metaItem}>
                <Calendar size={14} color="#FFFFFF" />
                <span>{publishDate}</span>
              </div>
              <div className={styles.metaItem}>
                <Clock size={14} color="#FFFFFF" />
                <span>{readingTime}</span>
              </div>
            </div>

            <div className={styles.verificationStamp}>
              <CheckCircle2 size={13} color="#FFFFFF" />
              <span>Verified against production RFC specs</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
