import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { SearchOverlay } from './components/layout/SearchOverlay';
import { ArticleRequestModal } from './components/topics/ArticleRequestModal';

import { HomePage } from './pages/HomePage';
import { TopicsHubPage } from './pages/TopicsHubPage';
import { TopicDetailPage } from './pages/TopicDetailPage';
import { ArticlesPage } from './pages/ArticlesPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { CommunityPage } from './pages/CommunityPage';
import { SubscribePage } from './pages/SubscribePage';
import { SearchPage } from './pages/SearchPage';
import { LegalPage } from './pages/LegalPage';

// Scroll to top helper on route transitions
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestQuery, setRequestQuery] = useState('');

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const handleOpenRequest = (query?: string) => {
    setRequestQuery(query || '');
    setRequestModalOpen(true);
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
        {/* Floating Glass Pill Header */}
        <Header
          onOpenSearch={() => setSearchOpen(true)}
          onOpenSubscribe={() => {
            const el = document.getElementById('newsletter-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Core Viewport Content */}
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/topics" element={<TopicsHubPage />} />
            <Route path="/topics/:slug" element={<TopicDetailPage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/articles/:slug" element={<ArticleDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/subscribe" element={<SubscribePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/privacy" element={<LegalPage />} />
            <Route path="/terms" element={<LegalPage />} />
            <Route path="/cookies" element={<LegalPage />} />
          </Routes>
        </div>

        {/* 4-Column Compact Dark Footer */}
        <Footer />

        {/* Instant Fuse.js Search Overlay */}
        <SearchOverlay
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
          onRequestArticle={handleOpenRequest}
        />

        {/* Article Demand Capture Modal */}
        <ArticleRequestModal
          isOpen={requestModalOpen}
          onClose={() => setRequestModalOpen(false)}
          initialQuery={requestQuery}
        />
      </div>
    </BrowserRouter>
  );
};

export default App;
