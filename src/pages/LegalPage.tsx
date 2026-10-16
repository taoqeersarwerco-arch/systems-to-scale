import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Shield, Lock, FileCheck } from 'lucide-react';

export const LegalPage: React.FC = () => {
  const location = useLocation();
  const currentTab = location.pathname.replace('/', '') || 'privacy';

  return (
    <div style={{ paddingTop: 'calc(var(--sts-header-height) + 3rem)', paddingBottom: '6rem' }}>
      <div className="sts-container" style={{ maxWidth: '820px' }}>
        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            marginBottom: '3rem',
            borderBottom: '1px solid var(--sts-border)',
            paddingBottom: '0.75rem'
          }}
        >
          <Link
            to="/privacy"
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--sts-pill-radius)',
              background: currentTab === 'privacy' ? 'var(--sts-brass)' : 'rgba(255, 255, 255, 0.04)',
              color: currentTab === 'privacy' ? '#0E1112' : 'var(--sts-bone)',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms"
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--sts-pill-radius)',
              background: currentTab === 'terms' ? 'var(--sts-brass)' : 'rgba(255, 255, 255, 0.04)',
              color: currentTab === 'terms' ? '#0E1112' : 'var(--sts-bone)',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            Terms of Reference
          </Link>
          <Link
            to="/cookies"
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--sts-pill-radius)',
              background: currentTab === 'cookies' ? 'var(--sts-brass)' : 'rgba(255, 255, 255, 0.04)',
              color: currentTab === 'cookies' ? '#0E1112' : 'var(--sts-bone)',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            Consent Architecture
          </Link>
        </div>

        {/* Policy Content */}
        <div style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--sts-muted)' }}>
          {currentTab === 'privacy' && (
            <div>
              <h1 style={{ fontSize: '2.4rem', color: 'var(--sts-bone)', marginBottom: '1.5rem' }}>
                Privacy Policy
              </h1>
              <p style={{ marginBottom: '1.5rem' }}>
                Systems to Scale operates on a strict minimal-data philosophy. We do not run invasive surveillance trackers, behavioral ad pixels, or third-party fingerprinting scripts.
              </p>
              <h3 style={{ color: 'var(--sts-bone)', marginTop: '2rem', marginBottom: '0.75rem' }}>
                1. Newsletter Data Storage
              </h3>
              <p style={{ marginBottom: '1.5rem' }}>
                When you subscribe to the Weekly Mechanism Dispatch, your email and name are securely processed via Kit (formerly ConvertKit) using double opt-in verification. Your email is used exclusively to deliver the weekly dispatch. We do not sell or monetize subscriber data.
              </p>
              <h3 style={{ color: 'var(--sts-bone)', marginTop: '2rem', marginBottom: '0.75rem' }}>
                2. Article Request Data
              </h3>
              <p style={{ marginBottom: '1.5rem' }}>
                When you submit an article request through our topic forms, your inquiry and contact email are routed directly to our editorial queue to notify you when the requested breakdown publishes.
              </p>
            </div>
          )}

          {currentTab === 'terms' && (
            <div>
              <h1 style={{ fontSize: '2.4rem', color: 'var(--sts-bone)', marginBottom: '1.5rem' }}>
                Terms of Reference
              </h1>
              <p style={{ marginBottom: '1.5rem' }}>
                All technical analyses, state diagrams, and architectural breakdowns published on Systems to Scale are created for educational and professional engineering reference.
              </p>
              <h3 style={{ color: 'var(--sts-bone)', marginTop: '2rem', marginBottom: '0.75rem' }}>
                1. Citations & Attribution
              </h3>
              <p style={{ marginBottom: '1.5rem' }}>
                You may cite short passages and diagrams with clear attribution linking to the canonical Systems to Scale URL. Automated scraping, wholesale reproduction, or feeding our research into LLM training corpora without explicit attribution is prohibited.
              </p>
              <h3 style={{ color: 'var(--sts-bone)', marginTop: '2rem', marginBottom: '0.75rem' }}>
                2. Engineering Liability
              </h3>
              <p style={{ marginBottom: '1.5rem' }}>
                Production software architectures must always be tested against your specific infrastructure limits. While our analyses reflect verified RFC and vendor standards, Systems to Scale and Uniqentic accept no liability for outages incurred from production implementations.
              </p>
            </div>
          )}

          {currentTab === 'cookies' && (
            <div>
              <h1 style={{ fontSize: '2.4rem', color: 'var(--sts-bone)', marginBottom: '1.5rem' }}>
                Cookie & Consent Architecture
              </h1>
              <p style={{ marginBottom: '1.5rem' }}>
                Systems to Scale utilizes cookie-free measurement. Our analytics do not place persistent tracking cookies on your device.
              </p>
              <h3 style={{ color: 'var(--sts-bone)', marginTop: '2rem', marginBottom: '0.75rem' }}>
                1. Zero Third-Party Advertising Cookies
              </h3>
              <p style={{ marginBottom: '1.5rem' }}>
                Because we do not run third-party programmatic banner ads on our publication, your browser is never subjected to cross-site tracking or third-party cookie synchronization.
              </p>
              <h3 style={{ color: 'var(--sts-bone)', marginTop: '2rem', marginBottom: '0.75rem' }}>
                2. Local Storage
              </h3>
              <p style={{ marginBottom: '1.5rem' }}>
                We use browser localStorage solely for functional preferences (such as remembering your reduced-motion display preference).
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
