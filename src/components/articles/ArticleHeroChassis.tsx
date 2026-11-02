import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, CheckCircle2 } from 'lucide-react';
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
    <section className={styles.heroChassis}>
      <div className={styles.innerContainer}>
        {/* Navigation Breadcrumb Row (Matches Topic Detail) */}
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

        {/* Section 1: Hero & Title (Matches Topic Detail 820px layout) */}
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
