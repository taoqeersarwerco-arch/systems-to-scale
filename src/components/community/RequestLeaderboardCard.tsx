import React, { useState, useRef } from 'react';
import { 
  ChevronUp, 
  Check, 
  Zap, 
  ShoppingBag, 
  TrendingUp, 
  Layout, 
  MessageSquare, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { CinematicCardCanvas } from '../articles/CinematicCardCanvas';
import styles from '../../styles/community.module.css';

export interface RequestItem {
  id: string;
  topic: string;
  topicSlug: string;
  query: string;
  scope: string;
  votes: number;
  maxTarget: number;
  status: 'In Active Research' | 'Specification Outline' | 'Reviewing Draft' | 'Scheduled for November';
  mechanismNodes: string[];
}

interface RequestLeaderboardCardProps {
  item: RequestItem;
  hasVoted: boolean;
  onUpvote: (id: string) => void;
}

// Pure monochrome topic vector icon mapping
const renderTopicIcon = (slug: string) => {
  switch (slug) {
    case 'ai-automation':
      return <Zap size={11} className={styles.topicVectorIcon} />;
    case 'e-commerce':
      return <ShoppingBag size={11} className={styles.topicVectorIcon} />;
    case 'marketing-ads':
      return <TrendingUp size={11} className={styles.topicVectorIcon} />;
    case 'web-design':
      return <Layout size={11} className={styles.topicVectorIcon} />;
    case 'customer-service':
      return <MessageSquare size={11} className={styles.topicVectorIcon} />;
    default:
      return <Layers size={11} className={styles.topicVectorIcon} />;
  }
};

export const RequestLeaderboardCard: React.FC<RequestLeaderboardCardProps> = ({
  item,
  hasVoted,
  onUpvote
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isBursting, setIsBursting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const progressPct = Math.min(100, Math.round((item.votes / item.maxTarget) * 100));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = ((y / rect.height) - 0.5) * -3;
    const rotateY = ((x / rect.width) - 0.5) * 3;

    card.style.setProperty('--spotlight-x', `${x}px`);
    card.style.setProperty('--spotlight-y', `${y}px`);
    card.style.setProperty('--card-rotate-x', `${rotateX.toFixed(2)}deg`);
    card.style.setProperty('--card-rotate-y', `${rotateY.toFixed(2)}deg`);
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty('--card-rotate-x', '0deg');
    card.style.setProperty('--card-rotate-y', '0deg');
  };

  const handleUpvoteClick = () => {
    setIsBursting(true);
    setTimeout(() => setIsBursting(false), 600);
    onUpvote(item.id);
  };

  const getStatusClass = (status: RequestItem['status']) => {
    switch (status) {
      case 'In Active Research': return styles.statusActive;
      case 'Specification Outline': return styles.statusOutline;
      case 'Reviewing Draft': return styles.statusReview;
      case 'Scheduled for November': return styles.statusScheduled;
    }
  };

  return (
    <div
      ref={cardRef}
      className={`${styles.cinematicRequestCard} ${isHovered ? styles.cinematicRequestCardHover : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Top Hairline Scanline */}
      <div className={styles.cardScanline} />

      {/* Radial Cursor Spotlight */}
      <div className={styles.cardCursorSpotlight} />

      {/* Reticle Corner Crosses */}
      <span className={styles.cardReticleTL}>+</span>
      <span className={styles.cardReticleTR}>+</span>

      {/* Living Atmospheric Canvas Header Viewport */}
      <div className={styles.cardCanvasStage}>
        <div className={styles.cardGridTexture} />
        <div className={styles.cardCanvasVignette} />

        <div className={styles.cardCanvasWrap}>
          <CinematicCardCanvas
            topicSlug={item.topicSlug}
            isHovered={isHovered}
          />
        </div>

        {/* Top Floating Badge Strip */}
        <div className={styles.cardHeaderStrip}>
          <div className={styles.topicBadgeWrap}>
            {renderTopicIcon(item.topicSlug)}
            <span className={styles.topicBadgeText}>{item.topic}</span>
          </div>

          <span className={`${styles.statusIndicator} ${getStatusClass(item.status)}`}>
            {item.status === 'In Active Research' && <span className={styles.beaconDot} />}
            {item.status}
          </span>
        </div>
      </div>

      {/* Card Core Content */}
      <div className={styles.cardBodyContent}>
        <h3 className={styles.requestTitle}>
          "{item.query}"
        </h3>

        <p className={styles.requestScope}>
          {item.scope}
        </p>

        {/* Mechanism Pipeline Node Trace */}
        {item.mechanismNodes && item.mechanismNodes.length > 0 && (
          <div className={styles.mechanismPipelineRow}>
            {item.mechanismNodes.map((node, idx) => (
              <React.Fragment key={node}>
                <span className={styles.mechanismNodePill}>{node}</span>
                {idx < item.mechanismNodes.length - 1 && (
                  <span className={styles.mechanismArrow}>→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Action Row: Kinetic Upvote Button & Demand Bar */}
      <div className={styles.requestBottomRow}>
        <button
          onClick={handleUpvoteClick}
          className={`${styles.upvoteButton} ${hasVoted ? styles.upvoteButtonVoted : ''} ${isBursting ? styles.upvoteButtonBurst : ''}`}
          aria-label={`Upvote request: ${item.query}`}
        >
          {hasVoted ? <Check size={13} /> : <ChevronUp size={13} />}
          <span>{item.votes} votes</span>
          {isBursting && <span className={styles.burstRing} />}
        </button>

        <div className={styles.demandProgressCol}>
          <div className={styles.demandLabelRow}>
            <span className={styles.demandTargetLabel}>Demand Quorum</span>
            <span className={styles.demandLabel}>
              {progressPct}% to lock
            </span>
          </div>
          <div className={styles.demandBarTrack}>
            <div
              className={styles.demandBarFill}
              style={{ width: `${progressPct}%` }}
            >
              <div className={styles.demandGlowTip} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
