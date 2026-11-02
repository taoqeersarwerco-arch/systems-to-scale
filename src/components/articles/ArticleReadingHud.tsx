import React, { useState, useEffect } from 'react';
import { Compass, BookOpen, Clock, ChevronRight } from 'lucide-react';
import styles from '../../styles/articleReadingHud.module.css';

interface SectionLink {
  id: string;
  label: string;
}

const SECTIONS: SectionLink[] = [
  { id: 'workbench', label: 'Interactive Lab' },
  { id: 'mechanism-01', label: '01. SoR vs SoA' },
  { id: 'mechanism-02', label: '02. 6-Layer Topology' },
  { id: 'mechanism-03', label: '03. Identity Graph' },
  { id: 'mechanism-04', label: '04. Reverse ETL' },
  { id: 'mechanism-05', label: '05. Failure Modes' }
];

export const ArticleReadingHud: React.FC = () => {
  const [scrollPercent, setScrollPercent] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<string>('01. Dual Nature');

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
      setScrollPercent(Math.round(progress));

      // Quick scroll spy on sections
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(SECTIONS[i].label);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={styles.hudWrapper}>
      <div className={styles.hudContent}>
        <div className={styles.hudLeft}>
          <div className={styles.progressRingTrack}>
            <Compass size={13} />
            <span>{scrollPercent}%</span>
          </div>

          <div className={styles.hudDivider} />

          <span className={styles.currentSecLabel}>
            {activeSection}
          </span>
        </div>

        <div className={styles.jumpPills}>
          {SECTIONS.map((sec) => (
            <button
              key={sec.id}
              type="button"
              className={styles.jumpBtn}
              onClick={() => scrollToId(sec.id)}
            >
              {sec.label}
            </button>
          ))}
        </div>
      </div>

      {/* Thin Gold Progress Bar at Base */}
      <div className={styles.progressBar} style={{ width: `${scrollPercent}%` }} />
    </div>
  );
};

