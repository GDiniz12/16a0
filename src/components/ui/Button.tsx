'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}

const variantClasses: Record<string, string> = {
  primary:
    'bg-plum text-white hover:bg-plum-dark shadow-md hover:shadow-lg',
  secondary:
    'bg-rose text-gray-800 hover:bg-[#d4a39b] shadow-md hover:shadow-lg',
  outline:
    'bg-transparent border-2 border-plum text-plum hover:bg-plum hover:text-white',
};

const sizeClasses: Record<string, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        rounded-full font-semibold
        transition-colors duration-200
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabled ? 'opacity-40 cursor-not-allowed !shadow-none' : 'cursor-pointer'}
        ${className}
      `}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
    >
      {children}
    </motion.button>
  );
}
