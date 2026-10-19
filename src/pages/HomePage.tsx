import React from 'react';
import { FlowFieldHero } from '../components/hero/FlowFieldHero';
import { TopicTrailers } from '../components/sections/TopicTrailers';
import { FeaturedArticles } from '../components/sections/FeaturedArticles';
import { Misconceptions } from '../components/sections/Misconceptions';
import { CaseStudies } from '../components/sections/CaseStudies';
import { NewsletterCta } from '../components/sections/NewsletterCta';

export const HomePage: React.FC = () => {
  return (
    <main>
      {/* Section 01: Multi-Layer Perlin Vector Flow Field Hero */}
      <FlowFieldHero />

      {/* Section 02: Topic Trailers (8 Bento Cards) */}
      <TopicTrailers />

      {/* Section 03: Featured Articles & Ghost-Links */}
      <FeaturedArticles />

      {/* Section 04: Interactive Misconceptions */}
      <Misconceptions />

      {/* Section 05: Real-World Case Studies */}
      <CaseStudies />

      {/* Section 06: Weekly Mechanism Dispatch CTA */}
      <NewsletterCta />
    </main>
  );
};
