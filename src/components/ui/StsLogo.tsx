import React from 'react';

interface StsLogoProps {
  size?: number;
  className?: string;
  color?: string;
  variant?: 'mark' | 'lockup';
}

export const StsLogo: React.FC<StsLogoProps> = ({
  size = 32,
  className = '',
  color = 'var(--sts-brass)',
  variant = 'mark'
}) => {
  return (
    <div
      className={`sts-logo-container ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.65rem',
        textDecoration: 'none',
        color: 'inherit'
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.32, 1)' }}
        aria-label="Systems to Scale Logo Mark"
      >
        {/* Node 1: Origin Foundation Node (Lower Left) */}
        <circle cx="12" cy="36" r="4.5" fill={color} />
        
        {/* Pipeline segment: Node 1 -> Node 2 */}
        <path
          d="M12 36 L12 24 L24 24"
          stroke={color}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Node 2: Intermediate Scaling Node (Center) */}
        <rect
          x="20"
          y="20"
          width="8"
          height="8"
          rx="2"
          fill="var(--sts-ground)"
          stroke={color}
          strokeWidth="3.2"
        />

        {/* Pipeline segment: Node 2 -> Node 3 */}
        <path
          d="M28 24 L36 24 L36 12"
          stroke={color}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Node 3: Apex High-Scale Node (Upper Right, Ascending) */}
        <polygon
          points="36,6 42,14 30,14"
          fill={color}
        />

        {/* Subtle Circuit Interconnect Accent (Steel) */}
        <circle cx="24" cy="36" r="2" fill="var(--sts-steel)" opacity="0.8" />
        <line
          x1="16.5"
          y1="36"
          x2="22"
          y2="36"
          stroke="var(--sts-steel)"
          strokeWidth="1.8"
          strokeDasharray="2 2"
          opacity="0.8"
        />
      </svg>

      {variant === 'lockup' && (
        <span
          style={{
            fontFamily: 'var(--sts-font-display)',
            fontWeight: 700,
            fontSize: `${size * 0.55}px`,
            letterSpacing: '-0.03em',
            color: 'var(--sts-bone)'
          }}
        >
          Systems to Scale
        </span>
      )}
    </div>
  );
};
