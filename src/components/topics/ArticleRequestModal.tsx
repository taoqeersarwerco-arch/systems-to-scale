import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

interface ArticleRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTopic?: string;
  initialQuery?: string;
}

export const ArticleRequestModal: React.FC<ArticleRequestModalProps> = ({
  isOpen,
  onClose,
  defaultTopic = 'General Architecture',
  initialQuery = ''
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [requestText, setRequestText] = useState(initialQuery);
  const [honeypot, setHoneypot] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      setRequestText(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      setSubmitted(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) {
      setSubmitted(true);
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 250,
        background: 'rgba(14, 17, 18, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          background: 'var(--sts-raised)',
          border: '1px solid var(--sts-border)',
          borderRadius: 'var(--sts-card-radius)',
          padding: '2.5rem',
          boxShadow: '0 32px 72px -12px rgba(0, 0, 0, 0.7)',
          position: 'relative'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            color: 'var(--sts-dim)',
            padding: '0.25rem'
          }}
        >
          <X size={20} />
        </button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#FFFFFF',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}
            >
              <CheckCircle2 size={32} />
            </div>
            <h3 style={{ fontSize: '1.35rem', color: 'var(--sts-bone)', marginBottom: '0.5rem' }}>
              Request Received
            </h3>
            <p style={{ color: 'var(--sts-muted)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Got it—our editorial board reviews incoming architectural requests every Monday. We will notify you at <strong style={{ color: 'var(--sts-bone)' }}>{email}</strong> when the breakdown goes live.
            </p>
            <Button variant="brass" onClick={onClose} fullWidth>
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="sts-badge sts-badge-steel" style={{ marginBottom: '1rem' }}>
              <Sparkles size={13} />
              <span>Suggest a Topic</span>
            </div>

            <h3 style={{ fontSize: '1.45rem', color: 'var(--sts-bone)', marginBottom: '0.5rem' }}>
              Request an Architectural Explanation
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--sts-muted)', lineHeight: 1.55, marginBottom: '1.75rem' }}>
              Tell us the technical mechanism or production system you would like us to explain.
            </p>

            {/* Honeypot */}
            <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
              <input
                type="text"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--sts-bone)', marginBottom: '0.35rem' }}>
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Connor"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    background: 'rgba(0, 0, 0, 0.35)',
                    border: '1px solid var(--sts-border)',
                    color: 'var(--sts-bone)',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--sts-bone)', marginBottom: '0.35rem' }}>
                  Work / Notification Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    background: 'rgba(0, 0, 0, 0.35)',
                    border: '1px solid var(--sts-border)',
                    color: 'var(--sts-bone)',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--sts-bone)', marginBottom: '0.35rem' }}>
                  The Mechanism or Bottleneck to Explain
                </label>
                <textarea
                  required
                  rows={3}
                  value={requestText}
                  onChange={(e) => setRequestText(e.target.value)}
                  placeholder="e.g. How does Stripe manage webhook retry backpressure when an endpoint drops offline for 48 hours?"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    background: 'rgba(0, 0, 0, 0.35)',
                    border: '1px solid var(--sts-border)',
                    color: 'var(--sts-bone)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="brass"
              size="lg"
              fullWidth
              disabled={isSubmitting}
              icon={<Send size={16} />}
            >
              {isSubmitting ? 'Routing to Board...' : 'Submit Request'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
