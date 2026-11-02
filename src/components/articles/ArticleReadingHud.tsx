import React, { useState, useEffect } from 'react';
import { Compass, ChevronRight } from 'lucide-react';
import styles from '../../styles/articleReadingHud.module.css';

interface SectionLink {
  id: string;
  label: string;
}

const SECTIONS: SectionLink[] = [
  { id: 'cockpit', label: 'Executive Spec' },
  { id: 'workbench', label: 'Interactive Lab' },
  { id: 'mechanism-01', label: '01. SoR vs SoA' },
  { id: 'mechanism-02', label: '02. Topology' },
  { id: 'mechanism-03', label: '03. Identity' },
  { id: 'mechanism-04', label: '04. Reverse ETL' },
  { id: 'mechanism-05', label: '05. Failures' }
];

export const ArticleReadingHud: React.FC = () => {
  const [scrollPercent, setScrollPercent] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<string>('Executive Spec');
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
      setScrollPercent(Math.round(progress));

      // Only reveal floating HUD after scrolling past the hero (e.g. 520px)
      setIsVisible(scrollTop > 520);

      // Quick scroll spy on sections
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 240) {
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
    <aside
      className={`${styles.hudWrapper} ${isVisible ? styles.hudVisible : styles.hudHidden}`}
      aria-label="Reading telemetry navigation"
    >
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
              className={`${styles.jumpBtn} ${activeSection === sec.label ? styles.jumpBtnActive : ''}`}
              onClick={() => scrollToId(sec.id)}
            >
              {sec.label}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Line at Base */}
      <div className={styles.progressBar} style={{ width: `${scrollPercent}%` }} />
    </aside>
  );
};
