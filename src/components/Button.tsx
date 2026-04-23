import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'size' | 'children'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  shimmer?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children?: React.ReactNode;
}

const variants = {
  primary: 'bg-luxury-gold text-black hover:bg-luxury-gold/90',
  secondary: 'bg-luxury-pink text-white hover:bg-luxury-pink/90',
  outline: 'bg-transparent border-2 border-luxury-gold text-luxury-gold hover:bg-luxury-gold/10',
  ghost: 'bg-transparent text-luxury-gold hover:bg-luxury-gold/10',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  shimmer = false,
  icon,
  iconPosition = 'left',
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = `
    relative font-semibold rounded-xl transition-all duration-200
    flex items-center justify-center gap-2
    focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-95
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `;

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      className={baseClasses}
      disabled={disabled || loading}
      {...props}
    >
      {/* Shimmer effect */}
      {shimmer && !disabled && !loading && (
        <motion.div
          className="absolute inset-0 rounded-xl overflow-hidden"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: 'linear',
          }}
        >
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
        </motion.div>
      )}

      {loading && (
        <Loader2 className="w-5 h-5 animate-spin" />
      )}

      {!loading && icon && iconPosition === 'left' && (
        <span className="relative z-10">{icon}</span>
      )}

      <span className="relative z-10">{children}</span>

      {!loading && icon && iconPosition === 'right' && (
        <span className="relative z-10">{icon}</span>
      )}
    </motion.button>
  );
};

// Icon button variant
interface IconButtonProps extends Omit<HTMLMotionProps<'button'>, 'size' | 'children'> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost';
  loading?: boolean;
  children?: React.ReactNode;
}

export const IconButton: React.FC<IconButtonProps> = ({
  children,
  size = 'md',
  variant = 'default',
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4',
  };

  const variantClasses = {
    default: 'bg-white/10 hover:bg-white/20 text-current',
    ghost: 'bg-transparent hover:bg-white/10 text-current',
  };

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.1 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.9 } : {}}
      className={`
        rounded-xl transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-luxury-gold/50
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        children
      )}
    </motion.button>
  );
};
