import React from 'react';

interface LogoProps {
  size?: number;
  color?: string;
  className?: string;
}

// Stripe S Wordmark / Monogram in pure crisp vector
export const StripeLogo: React.FC<LogoProps> = ({ size = 24, color = '#FFFFFF', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <rect width="24" height="24" rx="6" fill="rgba(255, 255, 255, 0.06)" stroke="rgba(255, 255, 255, 0.14)" />
    <path
      d="M13.6 9.4c-1.3-.5-2-.9-2-1.5 0-.5.4-.8 1.2-.8 1.4 0 2.8.5 3.7 1V5.7c-.9-.4-2-.6-3.2-.6-2.6 0-4.3 1.4-4.3 3.6 0 3.5 4.8 2.9 4.8 4.4 0 .6-.5.9-1.3.9-1.2 0-2.8-.5-3.9-1.2v2.5c1.1.5 2.4.7 3.6.7 2.7 0 4.5-1.3 4.5-3.6 0-3.8-4.9-3-4.9-4.5z"
      fill={color}
    />
  </svg>
);

// Shopify Shopping Bag with 'S' Emblem
export const ShopifyLogo: React.FC<LogoProps> = ({ size = 24, color = '#FFFFFF', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <rect width="24" height="24" rx="6" fill="rgba(255, 255, 255, 0.06)" stroke="rgba(255, 255, 255, 0.14)" />
    <path
      d="M16.5 7.2h-1.6c-.1-.8-.4-2-1.6-2.5-.5-.2-1-.3-1.6-.2-1.1.3-1.7 1.4-1.9 2.7H8c-.2 0-.4.2-.4.4l-1.1 9.8c0 .2.1.4.3.5.1.1.2.1.3.1h10.4c.2 0 .3-.1.4-.2.1-.1.2-.3.2-.5L17 7.6c0-.2-.2-.4-.5-.4zm-4.1-1.9c.7.2 1 1 1.1 1.9h-2.7c.2-1 .7-1.7 1.6-1.9zm-.7 9.2c-1 0-1.7-.4-2.1-.8l.6-.7c.3.3.9.6 1.5.6.7 0 1.1-.3 1.1-.7 0-1.1-2.5-.6-2.5-2.4 0-1 .8-1.8 2-1.8.8 0 1.4.2 1.8.6l-.6.7c-.3-.3-.7-.5-1.2-.5-.6 0-.9.3-.9.7 0 .9 2.5.5 2.5 2.4 0 1.1-.9 1.9-2.2 1.9z"
      fill={color}
    />
  </svg>
);

// Slack Octothorpe Emblem
export const SlackLogo: React.FC<LogoProps> = ({ size = 24, color = '#FFFFFF', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <rect width="24" height="24" rx="6" fill="rgba(255, 255, 255, 0.06)" stroke="rgba(255, 255, 255, 0.14)" />
    <g fill={color}>
      <path d="M7.2 11.5a1.4 1.4 0 1 1 0-2.8h1.4v2.8H7.2z" />
      <path d="M10 11.5a1.4 1.4 0 0 1 2.8 0v3.4a1.4 1.4 0 1 1-2.8 0v-3.4z" />
      <path d="M12.2 7.2a1.4 1.4 0 1 1 2.8 0v1.4h-2.8V7.2z" />
      <path d="M12.2 10a1.4 1.4 0 0 1 0 2.8H8.8a1.4 1.4 0 1 1 0-2.8h3.4z" />
      <path d="M16.5 12.2a1.4 1.4 0 1 1 0 2.8h-1.4v-2.8h1.4z" />
      <path d="M13.7 12.2a1.4 1.4 0 0 1-2.8 0V8.8a1.4 1.4 0 1 1 2.8 0v3.4z" />
      <path d="M11.5 16.5a1.4 1.4 0 1 1-2.8 0v-1.4h2.8v1.4z" />
      <path d="M11.5 13.7a1.4 1.4 0 0 1 0-2.8h3.4a1.4 1.4 0 1 1 0 2.8h-3.4z" />
    </g>
  </svg>
);

// HubSpot Sprocket Emblem
export const HubSpotLogo: React.FC<LogoProps> = ({ size = 24, color = '#FFFFFF', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <rect width="24" height="24" rx="6" fill="rgba(255, 255, 255, 0.06)" stroke="rgba(255, 255, 255, 0.14)" />
    <g stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <circle cx="12" cy="12" r="2.8" fill={color} />
      <line x1="12" y1="5.5" x2="12" y2="9.2" />
      <circle cx="12" cy="5.5" r="1.3" fill={color} />
      <line x1="16.5" y1="15.8" x2="13.9" y2="13.9" />
      <circle cx="17.2" cy="16.5" r="1.3" fill={color} />
      <line x1="7.5" y1="15.8" x2="10.1" y2="13.9" />
      <circle cx="6.8" cy="16.5" r="1.3" fill={color} />
    </g>
  </svg>
);

// Netflix N Ribbon Emblem
export const NetflixLogo: React.FC<LogoProps> = ({ size = 24, color = '#FFFFFF', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <rect width="24" height="24" rx="6" fill="rgba(255, 255, 255, 0.06)" stroke="rgba(255, 255, 255, 0.14)" />
    <path
      d="M7.5 5.5h2.4v13H7.5V5.5zm6.6 0h2.4v13h-2.4V5.5zm-5 0l5.8 13.2h2.2L11.3 5.5H9.1z"
      fill={color}
    />
  </svg>
);

// Cloudflare Cloud Emblem
export const CloudflareLogo: React.FC<LogoProps> = ({ size = 24, color = '#FFFFFF', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <rect width="24" height="24" rx="6" fill="rgba(255, 255, 255, 0.06)" stroke="rgba(255, 255, 255, 0.14)" />
    <path
      d="M17.4 11.2c-.2-.9-.8-1.6-1.6-2-.6-.3-1.3-.4-2-.2-.5-1.2-1.7-2-3-2-1.5 0-2.8 1-3.2 2.4-.4-.1-.8-.1-1.2 0-1.4.3-2.4 1.5-2.4 3 0 .2 0 .4.1.6-.9.4-1.5 1.3-1.5 2.3 0 1.5 1.2 2.7 2.7 2.7h11.8c1.3 0 2.4-1.1 2.4-2.4 0-1.1-.8-2.1-1.9-2.3-.1-.7-.3-1.4-.7-2.1z"
      fill={color}
    />
  </svg>
);
