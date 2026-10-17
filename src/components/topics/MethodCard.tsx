import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import styles from '../../styles/topics.module.css';

export const MethodCard: React.FC = () => {
  return (
    <div className={styles.methodCard}>
      {/* Eyebrow */}
      <div className={styles.methodEyebrow}>THE STANDARD</div>

      {/* Heading */}
      <h2 className={styles.methodHeading}>
        Every explanation answers three questions.
      </h2>

      {/* Three Questions List */}
      <div className={styles.methodQuestionsList}>
        {/* Row 1 */}
        <div className={styles.methodQuestionRow}>
          <div className={styles.methodNumber}>01</div>
          <div>
            <div className={styles.methodQuestionTitle}>What it is</div>
            <div className={styles.methodQuestionDesc}>
              The mechanism named, scoped, and placed in context.
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className={styles.methodQuestionRow}>
          <div className={styles.methodNumber}>02</div>
          <div>
            <div className={styles.methodQuestionTitle}>How it works</div>
            <div className={styles.methodQuestionDesc}>
              The internal logic traced step by step, with one visual that teaches.
            </div>
          </div>
        </div>

        {/* Row 3 */}
        <div className={styles.methodQuestionRow}>
          <div className={styles.methodNumber}>03</div>
          <div>
            <div className={styles.methodQuestionTitle}>Why it matters</div>
            <div className={styles.methodQuestionDesc}>
              The consequence for the reader's own system or decision.
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <Link to="/about#method" className={styles.methodCta}>
        <span>Read about our method</span>
        <ArrowRight size={14} className={styles.ctaArrow} />
      </Link>
    </div>
  );
};
