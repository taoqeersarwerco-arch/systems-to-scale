import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'brass' | 'steel' | 'ghost' | 'ink';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'ghost',
  size = 'md',
  icon,
  iconPosition = 'right',
  fullWidth = false,
  className = '',
  style,
  ...props
}) => {
  const getPadding = () => {
    switch (size) {
      case 'sm':
        return '0.45rem 0.9rem';
      case 'lg':
        return '0.85rem 1.8rem';
      default:
        return '0.65rem 1.35rem';
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'sm':
        return '0.8rem';
      case 'lg':
        return '1rem';
      default:
        return '0.9rem';
    }
  };

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'brass':
        return {
          background: '#FFFFFF',
          color: '#000000',
          border: '1px solid #FFFFFF',
          fontWeight: 600,
          boxShadow: '0 4px 18px rgba(255, 255, 255, 0.15)'
        };
      case 'steel':
        return {
          background: '#1F1F1F',
          color: '#FFFFFF',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          fontWeight: 600,
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)'
        };
      case 'ink':
        return {
          background: '#000000',
          color: '#FFFFFF',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          fontWeight: 500
        };
      case 'ghost':
      default:
        return {
          background: 'rgba(255, 255, 255, 0.04)',
          color: 'var(--sts-bone)',
          border: '1px solid var(--sts-border)',
          fontWeight: 500
        };
    }
  };

  return (
    <button
      className={`sts-button sts-button-${variant} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        padding: getPadding(),
        fontSize: getFontSize(),
        fontFamily: 'var(--sts-font-body)',
        borderRadius: 'var(--sts-pill-radius)',
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        opacity: props.disabled ? 0.5 : 1,
        transition: 'transform 0.15s cubic-bezier(0.22, 1, 0.32, 1), box-shadow 0.2s ease, border-color 0.2s ease, background-color 0.2s ease',
        width: fullWidth ? '100%' : 'auto',
        ...getVariantStyles(),
        ...style
      }}
      onMouseEnter={(e) => {
        if (!props.disabled) {
          e.currentTarget.style.transform = 'translateY(-1.5px)';
          if (variant === 'ghost') {
            e.currentTarget.style.borderColor = 'var(--sts-border-hover)';
            e.currentTarget.style.boxShadow = '0 0 16px -2px var(--sts-brass-glow)';
          }
        }
      }}
      onMouseLeave={(e) => {
        if (!props.disabled) {
          e.currentTarget.style.transform = 'translateY(0)';
          if (variant === 'ghost') {
            e.currentTarget.style.borderColor = 'var(--sts-border)';
            e.currentTarget.style.boxShadow = 'none';
          }
        }
      }}
      onMouseDown={(e) => {
        if (!props.disabled) {
          e.currentTarget.style.transform = 'translateY(0.5px) scale(0.99)';
        }
      }}
      onMouseUp={(e) => {
        if (!props.disabled) {
          e.currentTarget.style.transform = 'translateY(-1.5px)';
        }
      }}
      {...props}
    >
      {icon && iconPosition === 'left' && <span style={{ display: 'inline-flex' }}>{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span style={{ display: 'inline-flex' }}>{icon}</span>}
    </button>
  );
};
