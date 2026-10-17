import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Database,
  ShieldCheck,
  Cpu,
  Zap,
  CheckCircle2,
  Radio,
  Layers,
  TrendingUp,
  Scale,
  Eye,
  FileCode2,
  GitBranch,
  Layout,
  Maximize2,
  Sparkles,
  CreditCard,
  Activity,
  Lock,
  CheckCheck,
  Inbox,
  BrainCircuit,
  Bot,
  ClockAlert,
  Smile,
  ListTodo,
  FileCheck2,
  Globe,
  Users,
  Award,
  Compass,
  Flame,
  BarChart3,
  Target,
  Mail,
  Sliders,
  Calendar,
  ShieldAlert
} from 'lucide-react';
import { TopicCinematicCard } from '../ui/TopicCinematicCard';
import { TOPIC_CINEMATIC_LIST } from '../../data/topicCinematicList';

gsap.registerPlugin(ScrollTrigger);

export const TopicTrailers: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeTopicSlug, setActiveTopicSlug] = useState<string | null>(null);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced || !gridRef.current || !sectionRef.current) return;

    // Use gsap.context for clean React lifecycle garbage collection
    const ctx = gsap.context(() => {
      const cards = gridRef.current?.children;
      if (!cards) return;

      gsap.fromTo(
        cards,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.07,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 82%'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="topics"
      ref={sectionRef}
      className="sts-section"
      style={{
        position: 'relative',
        zIndex: 10,
        backgroundColor: 'var(--sts-ground, #0E1112)',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        paddingTop: '80px',
        paddingBottom: '80px',
        scrollMarginTop: '80px'
      }}
    >
      <div className="sts-container" style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 24px' }}>
        {/* Section Header: Clean & Cinematic */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 56px auto' }}>
          <div className="sts-eyebrow" style={{ marginBottom: '12px', justifyContent: 'center' }}>
            <span>CORE DISCIPLINES</span>
          </div>

          <h2
            style={{
              fontFamily: 'var(--sts-font-display, sans-serif)',
              fontSize: 'clamp(32px, 4.5vw, 46px)',
              fontWeight: 600,
              letterSpacing: '-0.035em',
              lineHeight: 1.12,
              marginBottom: '14px',
              background: 'linear-gradient(180deg, #FFFFFF 0%, #A8A8A8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            What we cover.
          </h2>

          <p
            style={{
              fontFamily: 'var(--sts-font-body, sans-serif)',
              fontSize: '15.5px',
              color: 'var(--sts-muted, #9CA3AF)',
              lineHeight: 1.6
            }}
          >
            Eight engineering disciplines deconstructed down to their physical execution mechanisms.
          </p>
        </div>

        {/* 2-Column Responsive Blueprint Grid */}
        <div
          ref={gridRef}
          onMouseLeave={() => setActiveTopicSlug(null)}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '24px',
            maxWidth: '1140px',
            margin: '0 auto'
          }}
          className="sts-topics-grid"
        >
          {TOPIC_CINEMATIC_LIST.map((topicData) => (
            <TopicCinematicCard
              key={topicData.slug}
              data={topicData}
              isRevealed={activeTopicSlug === topicData.slug}
              onActivate={() => setActiveTopicSlug(topicData.slug)}
              onDeactivate={() => {
                setActiveTopicSlug((current) => (current === topicData.slug ? null : current));
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .sts-topics-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
