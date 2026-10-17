import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { TopicData } from '../../data/topics';
import styles from '../../styles/topics.module.css';

interface TopicCardProps {
  topic: TopicData;
}

export const TopicCard: React.FC<TopicCardProps> = ({ topic }) => {
  return (
    <Link
      to={`/topics/${topic.slug}`}
      className={styles.topicCard}
      aria-label={`Explore topic: ${topic.name}`}
    >
      <div>
        {/* Topic Name */}
        <h2 className={styles.topicCardName}>
          <span>{topic.name}</span>
        </h2>

        {/* Scope Paragraph */}
        <p className={styles.topicScope}>
          {topic.scopeParagraph}
        </p>

        {/* Verified Fact Callout */}
        {topic.verifiedFact && (
          <div className={styles.verifiedFactCallout}>
            <strong>VERIFIED BENCHMARK</strong>
            {topic.verifiedFact}
          </div>
        )}

        {/* Mechanism Pills */}
        <div className={styles.mechanismPillsWrap}>
          {topic.mechanismPills.map((pill, idx) => (
            <span key={idx} className={styles.mechanismPill}>
              {pill}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer: Article Count & CTA */}
      <div className={styles.cardFooter}>
        <span className={styles.articleCount}>
          {topic.articleCount} articles
        </span>

        <span className={styles.ctaLink}>
          <span>Explore Topic</span>
          <ArrowRight size={14} className={styles.ctaArrow} />
        </span>
      </div>
    </Link>
  );
};
