import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, Cpu, ChevronRight } from 'lucide-react';
import { TOPICS } from '../data/topics';
import { TOPIC_CINEMATIC_LIST } from '../data/topicCinematicList';
import { ConstellationMesh } from '../components/topics/ConstellationMesh';
import { TopicCinematicCard } from '../components/ui/TopicCinematicCard';
import { MethodCard } from '../components/topics/MethodCard';
import { TopicsNewsletter } from '../components/topics/TopicsNewsletter';
import styles from '../styles/topics.module.css';

gsap.registerPlugin(ScrollTrigger);

export const TopicsHubPage: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const methodRef = useRef<HTMLDivElement>(null);
  const [activeTopicSlug, setActiveTopicSlug] = useState<string | null>(null);

  // Set SEO metadata and JSON-LD structured data
  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'Core Engineering Disciplines — Systems to Scale';

    // Set meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    const originalDesc = metaDesc ? metaDesc.getAttribute('content') : '';
    const targetDesc =
      'Eight foundational areas of modern business systems, explained from the mechanism up. AI, marketing, web design, e-commerce, customer service and more.';

    if (metaDesc) {
      metaDesc.setAttribute('content', targetDesc);
    } else {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      metaDesc.setAttribute('content', targetDesc);
      document.head.appendChild(metaDesc);
    }

    // Set canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', 'https://systemstoscale.tech/topics');
      document.head.appendChild(canonical);
    } else {
      canonical.setAttribute('href', 'https://systemstoscale.tech/topics');
    }

    // Inject JSON-LD Schema
    const scriptId = 'topics-hub-jsonld';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const schemas = [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Core Engineering Disciplines',
        description:
          "Systems to Scale structures its research across eight foundational areas. Each topic features an interactive simulation demonstrating the system's underlying mechanics, followed by in-depth technical breakdowns and guides.",
        url: 'https://systemstoscale.tech/topics',
        isPartOf: {
          '@type': 'WebSite',
          name: 'Systems to Scale',
          url: 'https://systemstoscale.tech'
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: TOPICS.map((topic, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `https://systemstoscale.tech/topics/${topic.slug}`,
          name: topic.name
        }))
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://systemstoscale.tech/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Topics',
            item: 'https://systemstoscale.tech/topics'
          }
        ]
      }
    ];

    scriptTag.textContent = JSON.stringify(schemas);

    return () => {
      document.title = originalTitle;
      if (metaDesc && originalDesc) {
        metaDesc.setAttribute('content', originalDesc);
      }
      if (scriptTag && scriptTag.parentNode) {
        scriptTag.parentNode.removeChild(scriptTag);
      }
    };
  }, []);

  // GSAP ScrollTrigger Animations
  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      // Section 3: Topic Cards Stagger
      if (gridRef.current) {
        const cards = gridRef.current.children;
        gsap.fromTo(
          cards,
          {
            opacity: 0,
            y: isReduced ? 0 : 24
          },
          {
            opacity: 1,
            y: 0,
            duration: isReduced ? 0.3 : 0.6,
            stagger: isReduced ? 0 : 0.08,
            ease: 'cubic-bezier(0.22, 1, 0.32, 1)',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 80%'
            }
          }
        );
      }

      // Section 4: Method Card Reveal
      if (methodRef.current) {
        gsap.fromTo(
          methodRef.current,
          {
            opacity: 0,
            scale: isReduced ? 1 : 0.97
          },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: 'cubic-bezier(0.22, 1, 0.32, 1)',
            scrollTrigger: {
              trigger: methodRef.current,
              start: 'top 82%'
            }
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const handleScrollToGrid = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById('topics-grid');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.topicsHubPage}>
      {/* SECTION 1: Constellation Mesh Hero */}
      <section className={styles.heroSection}>
        <div className={styles.canvasWrapper}>
          <ConstellationMesh />
        </div>

        {/* Soft atmospheric reading sanctuary for text legibility */}
        <div className={styles.readingPocket} />

        {/* Observatory Reticle Corner Brackets */}
        <div className={styles.observatoryReticleTl} aria-hidden="true" />
        <div className={styles.observatoryReticleTr} aria-hidden="true" />
        <div className={styles.observatoryReticleBl} aria-hidden="true" />
        <div className={styles.observatoryReticleBr} aria-hidden="true" />


        {/* Content Overlay Centred Vertically Over Mesh */}
        <div className={styles.heroContentOverlay}>
          <div className={styles.heroEyebrow}>
            <Cpu size={15} />
            <span>RESEARCH DISCIPLINES</span>
          </div>

          <h1 className={styles.heroHeading}>
            Core Engineering Disciplines.
          </h1>

          <p className={styles.heroSublead}>
            Systems to Scale structures its research across eight foundational areas. Each topic features an interactive simulation demonstrating the system's underlying mechanics, followed by in-depth technical breakdowns and guides.
          </p>
        </div>

        {/* Scroll Indicator at bottom */}
        <a
          href="#topics-grid"
          onClick={handleScrollToGrid}
          className={styles.scrollIndicator}
          aria-label="Scroll to topics grid"
        >
          <span>EXPLORE DISCIPLINES</span>
          <ChevronDown size={16} />
        </a>
      </section>

      {/* Breadcrumb Navigation Bar */}
      <nav aria-label="Breadcrumb" className={styles.breadcrumbBar}>
        <Link to="/">Home</Link>
        <ChevronRight size={13} />
        <span className={styles.breadcrumbCurrent}>Topics</span>
      </nav>

      {/* SECTION 3: The 8 Topic Panels */}
      <section className={styles.panelsSection} id="topics-grid">
        <div
          ref={gridRef}
          className={styles.topicsGrid}
          onMouseLeave={() => setActiveTopicSlug(null)}
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
      </section>

      {/* SECTION 4: The Standard Method Card */}
      <section className={styles.methodSection}>
        <div ref={methodRef}>
          <MethodCard />
        </div>
      </section>

      {/* SECTION 5: Newsletter CTA */}
      <TopicsNewsletter />
    </div>
  );
};
