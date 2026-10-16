import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface NewsletterCtaProps {
  topicTag?: string;
}

export const NewsletterCta: React.FC<NewsletterCtaProps> = ({ topicTag = 'homepage' }) => {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [mountTime, setMountTime] = useState<number>(Date.now());

  useEffect(() => {
    setMountTime(Date.now());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Dwell-trap check: 3 seconds
    if (Date.now() - mountTime < 3000) {
      console.warn('Bot detected via dwell-trap');
      setStatus('success');
      return;
    }

    // Honeypot check
    if (honeypot) {
      console.warn('Bot detected via honeypot');
      setStatus('success');
      return;
    }

    if (!email || !email.includes('@')) {
      setStatus('error');
      return;
    }

    setStatus('loading');

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section
      id="newsletter-section"
      style={{
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.015) 0%, rgba(255, 255, 255, 0.035) 100%)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        backgroundColor: 'var(--sts-ground)',
        position: 'relative',
        zIndex: 10
      }}
    >
      <div
        style={{
          textAlign: 'center',
          maxWidth: '560px',
          margin: '0 auto',
          padding: 'clamp(64px, 8vw, 96px) 24px'
        }}
      >
        <div className="sts-eyebrow" style={{ marginBottom: '14px', justifyContent: 'center' }}>
          <span>WEEKLY NEWSLETTER</span>
        </div>

        {/* Heading: Get the weekly mechanism. */}
        <h2
          style={{
            fontFamily: 'var(--sts-font-display)',
            fontSize: 'clamp(30px, 4vw, 40px)',
            fontWeight: 600,
            letterSpacing: '-0.035em',
            lineHeight: 1.15,
            marginBottom: '14px',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #A8A8A8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Get the weekly mechanism.
        </h2>

        {/* Sub-copy */}
        <p
          style={{
            fontFamily: 'var(--sts-font-body)',
            fontSize: '15px',
            color: 'var(--sts-muted)',
            lineHeight: 1.6,
            marginBottom: '32px'
          }}
        >
          One email, one system explained. No marketing fluff, no upsells. Unsubscribe anytime.
        </p>

        {status === 'success' ? (
          <div style={{ textAlign: 'center', animation: 'fadeIn 0.3s ease-out' }}>
            <div
              style={{
                fontFamily: 'var(--sts-font-display)',
                fontSize: '18px',
                fontWeight: 600,
                color: '#FFFFFF',
                marginBottom: '4px'
              }}
            >
              You're in.
            </div>
            <div style={{ fontFamily: 'var(--sts-font-body)', fontSize: '14px', color: 'var(--sts-muted)' }}>
              Check your inbox to confirm.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            {/* Honeypot field */}
            <input
              type="text"
              name="company"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              style={{ display: 'none' }}
              aria-hidden="true"
            />

            <div
              style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
                justifyContent: 'center',
                width: '100%'
              }}
            >
              <input
                type="email"
                required
                placeholder="Enter your work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  fontFamily: 'var(--sts-font-body)',
                  fontSize: '14.5px',
                  padding: '12px 20px',
                  minHeight: '48px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '999px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  color: '#FFFFFF',
                  width: '280px',
                  outline: 'none',
                  transition: 'border-color var(--sts-dur-in) var(--sts-ease)'
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
              />

              <button
                type="submit"
                disabled={status === 'loading'}
                className="sts-btn-primary"
                style={{
                  background: '#FFFFFF',
                  color: '#000000',
                  fontFamily: 'var(--sts-font-body)',
                  fontSize: '14.5px',
                  fontWeight: 600,
                  padding: '12px 28px',
                  minHeight: '48px',
                  border: 'none',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease, transform 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#EDEDED';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#FFFFFF';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>

            {status === 'error' && (
              <div style={{ color: '#FFFFFF', fontSize: '13px' }}>
                Something went wrong — try again.
              </div>
            )}

            {/* Privacy note */}
            <div style={{ fontSize: '12px', color: 'var(--sts-dim)', marginTop: '8px' }}>
              We use Kit for email. Unsubscribe in one click.{' '}
              <Link to="/privacy" style={{ color: '#A3A3A3', textDecoration: 'underline' }}>
                Read our privacy policy.
              </Link>
            </div>
          </form>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};
