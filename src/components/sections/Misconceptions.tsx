import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface MisconceptionItem {
  id: number;
  myth: string;
  realityParts: { text: string; highlight?: boolean }[];
}

const MISCONCEPTIONS_DATA: MisconceptionItem[] = [
  {
    id: 1,
    myth: '"If an API call fails, retry it immediately."',
    realityParts: [
      { text: 'Immediate retries amplify the failure. Production systems use ' },
      { text: 'exponential backoff', highlight: true },
      { text: ' — each retry waits longer than the last (1s, 2s, 4s, 8s), with ' },
      { text: 'random jitter', highlight: true },
      { text: " added so thousands of clients don't all retry at the same instant and overwhelm the server again. Stripe, AWS, and n8n all enforce this pattern." }
    ]
  },
  {
    id: 2,
    myth: '"The highest bid wins the ad auction."',
    realityParts: [
      { text: 'Most programmatic ad exchanges run a ' },
      { text: 'second-price auction', highlight: true },
      { text: ' — the winner pays one cent more than the second-highest bid, not their own bid. Google Ads goes further: your Ad Rank is your ' },
      { text: 'bid multiplied by your Quality Score', highlight: true },
      { text: ', so a lower bid with a better landing page and higher click-through rate can outrank a higher bid with a worse ad.' }
    ]
  },
  {
    id: 3,
    myth: '"A fast server means a fast website."',
    realityParts: [
      { text: 'Server response time (TTFB) is one small piece. What actually stalls a page is the ' },
      { text: 'critical rendering path', highlight: true },
      { text: ': render-blocking CSS and synchronous JavaScript in the head prevent the browser from painting anything until they finish downloading and executing. A 50ms server response means nothing if 2MB of undeferred JavaScript blocks the first paint for three seconds.' }
    ]
  },
  {
    id: 4,
    myth: '"When you click Pay, the money moves instantly."',
    realityParts: [
      { text: 'Clicking Pay triggers an ' },
      { text: 'authorization hold', highlight: true },
      { text: ' — the card network checks the card is valid and reserves the amount, but no money moves yet. The merchant ' },
      { text: 'captures the payment later', highlight: true },
      { text: ' (sometimes days later), which is when the actual settlement begins. That is why you sometimes see a charge appear and then disappear from your statement: the authorization expired before capture.' }
    ]
  }
];

export const Misconceptions: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isReduced, setIsReduced] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReduced(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsReduced(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (isReduced || !sectionRef.current || !pinContainerRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=300%',
      pin: pinContainerRef.current,
      scrub: 0.8,
      onUpdate: (self) => {
        const step = Math.min(
          MISCONCEPTIONS_DATA.length - 1,
          Math.floor(self.progress * MISCONCEPTIONS_DATA.length)
        );
        setActiveIndex(step);
      }
    });

    return () => {
      trigger.kill();
    };
  }, [isReduced]);

  const current = MISCONCEPTIONS_DATA[activeIndex];

  return (
    <section
      id="misconceptions"
      ref={sectionRef}
      className="sts-section"
      style={{
        position: 'relative',
        zIndex: 10,
        backgroundColor: 'var(--sts-ground)',
        minHeight: isReduced ? 'auto' : '100vh',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)'
      }}
    >
      <div ref={pinContainerRef} className="sts-container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        {/* Section Heading: Monochrome Architectural */}
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 48px auto' }}>
          <div className="sts-eyebrow" style={{ marginBottom: '12px', justifyContent: 'center' }}>
            <span>COMMON MISCONCEPTIONS</span>
          </div>

          <h2
            style={{
              fontFamily: 'var(--sts-font-display)',
              fontSize: 'clamp(32px, 4.5vw, 44px)',
              fontWeight: 600,
              letterSpacing: '-0.035em',
              lineHeight: 1.12,
              marginBottom: '14px',
              background: 'linear-gradient(180deg, #FFFFFF 0%, #A8A8A8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            What most people get wrong.
          </h2>

          <p
            style={{
              fontFamily: 'var(--sts-font-body)',
              fontSize: '15px',
              color: 'var(--sts-muted)',
              lineHeight: 1.6
            }}
          >
            Common assumptions that break when you look at the mechanism.
          </p>
        </div>

        {isReduced ? (
          /* Reduced motion: Static vertical stack of all 4 */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '680px', margin: '0 auto' }}>
            {MISCONCEPTIONS_DATA.map((item) => (
              <div
                key={item.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  backdropFilter: 'blur(16px)',
                  padding: '32px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--sts-font-display)',
                    fontSize: '20px',
                    fontWeight: 600,
                    color: '#737373',
                    textDecoration: 'line-through',
                    textDecorationColor: '#A3A3A3',
                    textDecorationThickness: '2px',
                    marginBottom: '14px'
                  }}
                >
                  {item.myth}
                </div>
                <p style={{ fontFamily: 'var(--sts-font-body)', fontSize: '15px', color: 'var(--sts-muted)', lineHeight: 1.65, margin: 0 }}>
                  {item.realityParts.map((part, pIdx) => (
                    <span
                      key={pIdx}
                      style={{
                        color: part.highlight ? '#FFFFFF' : 'inherit',
                        fontWeight: part.highlight ? 600 : 400
                      }}
                    >
                      {part.text}
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </div>
        ) : (
          /* GSAP Scroll-Pinned Scrub Display Area */
          <div
            style={{
              maxWidth: '720px',
              margin: '0 auto',
              textAlign: 'center',
              minHeight: '44vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.02)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '48px 40px',
              boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.8)'
            }}
          >
            {/* Myth (struck through in monochrome silver) */}
            <div
              key={`myth-${activeIndex}`}
              style={{
                fontFamily: 'var(--sts-font-display)',
                fontSize: 'clamp(22px, 3.2vw, 28px)',
                fontWeight: 600,
                color: '#737373',
                textDecoration: 'line-through',
                textDecorationColor: '#A3A3A3',
                textDecorationThickness: '2px',
                marginBottom: '22px',
                animation: 'fadeText 0.3s ease-out'
              }}
            >
              {current.myth}
            </div>

            {/* Reality text */}
            <p
              key={`reality-${activeIndex}`}
              style={{
                fontFamily: 'var(--sts-font-body)',
                fontSize: 'clamp(15px, 2vw, 17px)',
                color: 'var(--sts-muted)',
                lineHeight: 1.65,
                marginBottom: '36px',
                animation: 'fadeText 0.4s ease-out'
              }}
            >
              {current.realityParts.map((part, pIdx) => (
                <span
                  key={pIdx}
                  style={{
                    color: part.highlight ? '#FFFFFF' : 'inherit',
                    fontWeight: part.highlight ? 600 : 400,
                    textDecoration: part.highlight ? 'underline' : 'none',
                    textUnderlineOffset: '3px'
                  }}
                >
                  {part.text}
                </span>
              ))}
            </p>

            {/* 4 progress dots (pure white active, dark silver inactive) */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {MISCONCEPTIONS_DATA.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Go to misconception ${idx + 1}`}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: activeIndex === idx ? '#FFFFFF' : 'rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    padding: 0,
                    border: 'none',
                    transform: activeIndex === idx ? 'scale(1.25)' : 'scale(1)'
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeText {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};
