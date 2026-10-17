import React, { useState, useEffect } from 'react';
import styles from '../../styles/topics.module.css';

export const TopicsNewsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [mountTime, setMountTime] = useState<number>(Date.now());

  useEffect(() => {
    setMountTime(Date.now());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Dwell-trap anti-spam: 3 seconds required
    if (Date.now() - mountTime < 3000) {
      console.warn('Bot detected via dwell-trap');
      setStatus('success');
      return;
    }

    // Honeypot anti-spam check
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
      // Emulate Kit API integration
      await new Promise((resolve) => setTimeout(resolve, 600));
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className={styles.newsletterSection} id="topics-newsletter">
      <div className={styles.newsletterContent}>
        {/* Heading */}
        <h2 className={styles.newsletterHeading}>Stay in the mechanism.</h2>

        {/* Sub-text */}
        <p className={styles.newsletterSubtext}>
          One email when a new explanation publishes. No spam, no pitch, no tracking beyond the open rate.
        </p>

        {status === 'success' ? (
          <div style={{ padding: '16px 0', animation: 'fadeIn 0.3s ease-out' }}>
            <div
              style={{
                fontFamily: 'var(--sts-font-display)',
                fontSize: '18px',
                fontWeight: 600,
                color: '#FFFFFF',
                marginBottom: '6px'
              }}
            >
              Subscription confirmed.
            </div>
            <div
              style={{
                fontFamily: 'var(--sts-font-body)',
                fontSize: '14.5px',
                color: 'var(--sts-muted)'
              }}
            >
              Check your inbox to finalize your dispatch preferences.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.newsletterForm}>
            {/* Hidden honeypot field */}
            <input
              type="text"
              name="website_profile"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              style={{ display: 'none' }}
              aria-hidden="true"
            />

            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.newsletterInput}
              aria-label="Your email address"
            />

            <button
              type="submit"
              disabled={status === 'loading'}
              className={styles.newsletterButton}
            >
              {status === 'loading' ? 'Joining...' : 'Subscribe'}
            </button>
          </form>
        )}

        {status === 'error' && (
          <div
            style={{
              color: '#FFFFFF',
              fontSize: '13px',
              fontFamily: 'var(--sts-font-mono)',
              marginBottom: '12px',
              letterSpacing: '0.02em'
            }}
          >
            Please enter a valid email address.
          </div>
        )}

        <div className={styles.newsletterFooterNote}>
          Powered by Kit. Unsubscribe in one click.
        </div>
      </div>
    </section>
  );
};
