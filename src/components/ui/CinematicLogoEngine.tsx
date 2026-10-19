import React, { useState, useRef, useCallback } from 'react';
import './CinematicLogoEngine.css';

interface CinematicLogoEngineProps {
  size?: number;
  className?: string;
  showRings?: boolean;
  interactive?: boolean;
}

export const CinematicLogoEngine: React.FC<CinematicLogoEngineProps> = ({
  size = 84,
  className = '',
  showRings = true,
  interactive = true
}) => {
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -14, y: x * 14 });
  }, [interactive]);

  const handleMouseEnter = useCallback(() => {
    if (!interactive) return;
    setIsHovered(true);
  }, [interactive]);

  const handleMouseLeave = useCallback(() => {
    if (!interactive) return;
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  }, [interactive]);

  return (
    <div
      ref={containerRef}
      className={`sts-cinematic-logo-stage ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        width: `${size + 24}px`,
        height: `${size + 24}px`
      }}
      aria-label="Systems to Scale Living Mechanism Mark"
      role="img"
    >
      <div
        className="sts-logo-bezel-outer"
        style={{
          transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(${isHovered ? 1.03 : 1}, ${isHovered ? 1.03 : 1}, 1)`
        }}
      >
        <div
          className="sts-logo-bezel-inner"
          style={{
            width: `${size}px`,
            height: `${size}px`
          }}
        >
          {/* Luminous Atmospheric Radial Halo */}
          <div className="sts-logo-ambient-halo" />

          {/* Precision 64x64 SVG Canvas */}
          <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ position: 'relative', zIndex: 2 }}
          >
            <defs>
              {/* Radial gradient for photon glow */}
              <radialGradient id="stsPhotonGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </radialGradient>

              {/* Linear gradient for ascension flare */}
              <linearGradient id="stsAscentFlare" x1="44" y1="14" x2="44" y2="2" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* 1. Celestial Orbital Reticle Guides */}
            {showRings && (
              <g className="sts-reticle-guides">
                {/* Outer orbital compass */}
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth="0.8"
                  strokeDasharray="2 6"
                  className="sts-reticle-ring-outer"
                />
                {/* Inner target reticle */}
                <circle
                  cx="32"
                  cy="32"
                  r="20"
                  stroke="rgba(255, 255, 255, 0.09)"
                  strokeWidth="0.75"
                  strokeDasharray="1 8"
                  className="sts-reticle-ring-inner"
                />
                {/* Subtle Cardinal Ticks */}
                <line x1="32" y1="2" x2="32" y2="5" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="0.8" />
                <line x1="32" y1="59" x2="32" y2="62" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="0.8" />
                <line x1="2" y1="32" x2="5" y2="32" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="0.8" />
                <line x1="59" y1="32" x2="62" y2="32" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="0.8" />
              </g>
            )}

            {/* 2. Auxiliary Dotted Telemetry Bus */}
            <line
              x1="24.5"
              y1="44"
              x2="32"
              y2="44"
              className="sts-telemetry-bus"
            />
            <circle
              cx="34"
              cy="44"
              r="2"
              className="sts-telemetry-node"
            />

            {/* 3. Base Conduit Physical Tracks */}
            <path
              d="M 20 44 L 20 32 L 32 32"
              className="sts-pipe-base"
            />
            <path
              d="M 32 32 L 44 32 L 44 19"
              className="sts-pipe-base"
            />

            {/* 4. Active Living Conduit Current (Energy Pulses) */}
            <path
              d="M 20 44 L 20 32 L 32 32 M 32 32 L 44 32 L 44 19"
              className="sts-pipe-current"
            />
            <path
              d="M 20 44 L 20 32 L 32 32 M 32 32 L 44 32 L 44 19"
              className="sts-pipe-current-secondary"
            />

            {/* 5. Traveling Photon Stream (Synchronized Dual SVG AnimateMotion) */}
            <circle r="3" fill="url(#stsPhotonGlow)">
              <animateMotion
                path="M 20 44 L 20 32 L 44 32 L 44 17"
                dur={isHovered ? "1.3s" : "2.6s"}
                repeatCount="indefinite"
                keyPoints="0; 0.25; 0.75; 1"
                keyTimes="0; 0.25; 0.75; 1"
                calcMode="spline"
                keySplines="0.22 1 0.32 1; 0.22 1 0.32 1; 0.22 1 0.32 1"
              />
            </circle>

            <circle r="2.2" fill="url(#stsPhotonGlow)" opacity="0.8">
              <animateMotion
                path="M 20 44 L 20 32 L 44 32 L 44 17"
                dur={isHovered ? "1.3s" : "2.6s"}
                begin={isHovered ? "-0.65s" : "-1.3s"}
                repeatCount="indefinite"
                keyPoints="0; 0.25; 0.75; 1"
                keyTimes="0; 0.25; 0.75; 1"
                calcMode="spline"
                keySplines="0.22 1 0.32 1; 0.22 1 0.32 1; 0.22 1 0.32 1"
              />
            </circle>

            {/* 6. Node 1: Origin Foundation Circle & Heartbeat Ripple */}
            <circle
              cx="20"
              cy="44"
              r="4.5"
              className="sts-node-origin-ripple"
            />
            <circle
              cx="20"
              cy="44"
              r="4.5"
              className="sts-node-origin"
            />

            {/* 7. Node 2: Center Intermediate Core */}
            {/* Concentric Energy Shockwave */}
            <rect
              x="27"
              y="27"
              width="10"
              height="10"
              rx="2.5"
              className="sts-node-core-pulse"
            />
            {/* Core Box Housing */}
            <rect
              x="27"
              y="27"
              width="10"
              height="10"
              rx="2.5"
              className="sts-node-core-outer"
            />
            {/* Dynamic Rotating Core Diamond */}
            <polygon
              points="32,29.5 34.5,32 32,34.5 29.5,32"
              className="sts-node-core-inner"
            />

            {/* 8. Node 3: Apex High-Scale Arrow & Flare */}
            {/* Vertical Ascension Flare Beam */}
            <line
              x1="44"
              y1="12"
              x2="44"
              y2="2"
              className="sts-apex-flare-beam"
            />
            {/* Apex Arrow Head */}
            <polygon
              points="44,8 51,18 37,18"
              className="sts-node-apex"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
