import React from 'react';
import { Link } from 'react-router-dom';
import { SLUG_REGISTRY } from '../../data/slug-registry';

interface GhostLinkProps {
  slug: string;
  children?: React.ReactNode;
  className?: string;
  showBadge?: boolean;
}

export const GhostLink: React.FC<GhostLinkProps> = ({
  slug,
  children,
  className = '',
  showBadge = false
}) => {
  const article = SLUG_REGISTRY[slug];

  if (!article) {
    return <span className={`sts-ghost-missing ${className}`}>{children || slug}</span>;
  }

  const displayText = children || article.title;

  if (article.status === 'published') {
    return (
      <Link
        to={`/articles/${slug}`}
        className={`sts-ghost-link sts-ghost-published ${className}`}
        style={{
          color: 'var(--sts-bone)',
          borderBottom: '1px solid rgba(201, 151, 74, 0.4)',
          transition: 'border-color 0.2s ease, color 0.2s ease',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem'
        }}
      >
        <span>{displayText}</span>
        {showBadge && (
          <span
            style={{
              fontSize: '0.65rem',
              fontFamily: 'var(--sts-font-mono)',
              padding: '0.1rem 0.4rem',
              borderRadius: '999px',
              background: 'var(--sts-brass-dim)',
              color: 'var(--sts-brass)',
              border: '1px solid rgba(201, 151, 74, 0.3)'
            }}
          >
            Live
          </span>
        )}
      </Link>
    );
  }

  // Planned / Unpublished: Render as honest ghost indicator, NEVER a broken 404
  return (
    <span
      className={`sts-ghost-link sts-ghost-planned ${className}`}
      data-ghost-target={slug}
      title="Article in active research and synthesis — coming soon"
      style={{
        color: 'var(--sts-muted)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        cursor: 'default'
      }}
    >
      <span>{displayText}</span>
      <span
        style={{
          fontSize: '0.62rem',
          fontFamily: 'var(--sts-font-mono)',
          padding: '0.12rem 0.45rem',
          borderRadius: '999px',
          background: 'rgba(255, 255, 255, 0.05)',
          color: 'var(--sts-dim)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          letterSpacing: '0.02em',
          textTransform: 'uppercase'
        }}
      >
        Planned
      </span>
    </span>
  );
};
