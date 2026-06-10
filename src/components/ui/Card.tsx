'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({
  children,
  className = '',
  hover = false,
}: CardProps) {
  return (
    <motion.div
      className={`
        bg-white/90 backdrop-blur-sm rounded-2xl
        shadow-sm border border-gray-100
        p-6
        ${hover ? 'cursor-pointer' : ''}
        ${className}
      `}
      whileHover={
        hover
          ? {
              scale: 1.02,
              boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
            }
          : {}
      }
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
