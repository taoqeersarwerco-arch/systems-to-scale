import React from 'react';
import { Link } from 'react-router-dom';
import { StsLogo } from '../ui/StsLogo';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const topicsList = [
    { name: 'AI & Automation', path: '/topics/ai-automation' },
    { name: 'Marketing & Ads', path: '/topics/marketing-ads' },
    { name: 'Web Design', path: '/topics/web-design' },
    { name: 'E-commerce', path: '/topics/e-commerce' },
    { name: 'Customer Service', path: '/topics/customer-service' },
    { name: 'Virtual Assistance', path: '/topics/virtual-assistance' },
    { name: 'Pitch Decks', path: '/topics/pitch-decks' },
    { name: 'Personal Assistance', path: '/topics/personal-assistance' }
  ];

  const publicationList = [
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Community', path: '/community' },
    { name: 'Subscribe', path: '/subscribe' },
    { name: 'Articles', path: '/articles' }
  ];

  const legalList = [
    { name: 'Privacy', path: '/privacy' },
    { name: 'Terms', path: '/terms' },
    { name: 'Cookies', path: '/cookies' }
  ];

  return (
    <footer
      style={{
        background: 'var(--sts-ground)',
        borderTop: '1px solid var(--sts-rule-dark)',
        position: 'relative',
        zIndex: 10
      }}
    >
      <div
        style={{
          maxWidth: 'var(--sts-max-width)',
          margin: '0 auto',
          padding: '64px clamp(16px, 4vw, 32px) 32px'
        }}
      >
        {/* 4-Column Grid: 1.5fr 1fr 1fr 1fr */}
        <div
          className="sts-footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
            gap: '48px'
          }}
        >
          {/* Column 1 — Brand */}
          <div>
            <div style={{ marginBottom: '16px' }}>
              <StsLogo size={40} color="var(--sts-bone)" />
            </div>
            <p
              style={{
                fontFamily: 'var(--sts-font-body)',
                fontSize: '14px',
                color: 'var(--sts-muted)',
                lineHeight: 1.5,
                maxWidth: '240px',
                margin: 0
              }}
            >
              Understand the mechanism, not just the steps.
            </p>
          </div>

          {/* Column 2 — Topics */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--sts-font-body)',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--sts-bone)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '16px'
              }}
            >
              Topics
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {topicsList.map((t) => (
                <Link
                  key={t.path}
                  to={t.path}
                  style={{
                    fontSize: '14px',
                    color: 'var(--sts-muted)',
                    textDecoration: 'none',
                    lineHeight: '2.0',
                    transition: 'color var(--sts-dur-in) var(--sts-ease)'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--sts-bone)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--sts-muted)')}
                >
                  {t.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3 — Publication */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--sts-font-body)',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--sts-bone)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '16px'
              }}
            >
              Publication
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {publicationList.map((p) => (
                <Link
                  key={p.path}
                  to={p.path}
                  style={{
                    fontSize: '14px',
                    color: 'var(--sts-muted)',
                    textDecoration: 'none',
                    lineHeight: '2.0',
                    transition: 'color var(--sts-dur-in) var(--sts-ease)'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--sts-bone)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--sts-muted)')}
                >
                  {p.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 4 — Legal */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--sts-font-body)',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--sts-bone)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '16px'
              }}
            >
              Legal
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {legalList.map((l) => (
                <Link
                  key={l.path}
                  to={l.path}
                  style={{
                    fontSize: '14px',
                    color: 'var(--sts-muted)',
                    textDecoration: 'none',
                    lineHeight: '2.0',
                    transition: 'color var(--sts-dur-in) var(--sts-ease)'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--sts-bone)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--sts-muted)')}
                >
                  {l.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Uniqentic Disclosure & Back to Top Line */}
        <div
          style={{
            borderTop: '1px solid var(--sts-rule-dark)',
            paddingTop: '24px',
            marginTop: '32px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}
        >
          <div style={{ flex: 1, minWidth: '240px' }} />

          <div
            style={{
              fontFamily: 'var(--sts-font-body)',
              fontSize: '13px',
              color: 'var(--sts-muted)',
              textAlign: 'center'
            }}
          >
            Systems to Scale is published by Uniqentic.
            <div style={{ fontSize: '12px', color: 'var(--sts-muted)', marginTop: '8px' }}>
              © 2026 Systems to Scale. All rights reserved.
            </div>
          </div>

          <div style={{ flex: 1, minWidth: '240px', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={scrollToTop}
              style={{
                fontFamily: 'var(--sts-font-mono)',
                fontSize: '12px',
                color: 'var(--sts-muted)',
                cursor: 'pointer',
                border: 'none',
                background: 'none',
                transition: 'color var(--sts-dur-in) var(--sts-ease)'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--sts-bone)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--sts-muted)')}
            >
              ↑ Back to top
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 760px) {
          .sts-footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 32px !important;
          }
        }
        @media (max-width: 460px) {
          .sts-footer-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </footer>
  );
};
