import React, { useState, useEffect, useRef } from 'react';
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
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  // Parallax state refs for 60fps raf loop
  const mouseCoords = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollOffset = useRef(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
    const motionHandler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', motionHandler);
    return () => motionQuery.removeEventListener('change', motionHandler);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const hero = heroRef.current;
    if (!hero) return;

    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      mouseCoords.current.targetX = normX;
      mouseCoords.current.targetY = normY;
    };

    const handleMouseLeave = () => {
      mouseCoords.current.targetX = 0;
      mouseCoords.current.targetY = 0;
    };

    const handleScroll = () => {
      scrollOffset.current = window.scrollY;
    };

    hero.addEventListener('mousemove', handleMouseMove);
    hero.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Smooth RAF animation loop for physical parallax damping
    const animate = () => {
      const { targetX, targetY } = mouseCoords.current;
      mouseCoords.current.x += (targetX - mouseCoords.current.x) * 0.08;
      mouseCoords.current.y += (targetY - mouseCoords.current.y) * 0.08;

      const curX = mouseCoords.current.x;
      const curY = mouseCoords.current.y;
      const sY = Math.min(scrollOffset.current, 600);

      // Subtle multi-layer depth offsets
      if (contentRef.current) {
        contentRef.current.style.transform = `translate3d(${(curX * -6).toFixed(2)}px, ${(curY * -5 + sY * 0.12).toFixed(2)}px, 0)`;
      }
      if (headlineRef.current) {
        headlineRef.current.style.transform = `translate3d(${(curX * -3).toFixed(2)}px, ${(curY * -2).toFixed(2)}px, 0)`;
      }
      if (badgeRef.current) {
        badgeRef.current.style.transform = `translate3d(${(curX * -2).toFixed(2)}px, ${(curY * -1.5).toFixed(2)}px, 0)`;
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      hero.removeEventListener('mousemove', handleMouseMove);
      hero.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prefersReducedMotion]);

  return (
    <section ref={heroRef} className={styles.heroChassis} aria-label={`${title} Header`}>
      {/* 1. Dynamic Interactive Distortion & Gravitational Wave Canvas */}
      {!prefersReducedMotion && <HeroDistortionCanvas />}

      {/* 2. Atmospheric Reading Sanctuary Pocket for 100% Crisp Text Contrast */}
      <div className={styles.readingPocket} aria-hidden="true" />

      {/* 3. 4-Corner Observatory Reticles (Exact match to Topics & Articles Hubs) */}
      <div className={styles.reticleTl} aria-hidden="true" />
      <div className={styles.reticleTr} aria-hidden="true" />
      <div className={styles.reticleBl} aria-hidden="true" />
      <div className={styles.reticleBr} aria-hidden="true" />

      {/* 4. Main Foreground Content with Interactive Parallax Tracking */}
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

        {/* Hero Content Column */}
        <div ref={contentRef} className={styles.heroContent}>
          <div ref={badgeRef} className={styles.badgeWrapper}>
            <div className="sts-badge sts-badge-steel">
              <span>{topic} // Architecture</span>
            </div>
          </div>

          <h1 ref={headlineRef} className={styles.headline}>
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
