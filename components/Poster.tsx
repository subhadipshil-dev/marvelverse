"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Simple, clean portrait poster component.
 * Used for drawer large view and other non-card contexts.
 * Uses object-cover to fill the frame properly.
 * Subtle scale + fade on entry for premium poster reveal (respects reduced motion).
 */
interface PosterProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export function Poster({ src, alt, className = "", priority = false }: PosterProps) {
  const [hasError, setHasError] = React.useState(false);
  const shouldReduceMotion = useReducedMotion();

  if (hasError) {
    return (
      <div className={`relative w-full aspect-[2/3] overflow-hidden rounded-2xl bg-[#111] border border-white/10 flex items-center justify-center ${className}`}>
        <div className="text-center px-4">
          <div className="text-[#c8102e] text-sm font-medium tracking-widest">POSTER</div>
          <div className="mt-1 text-white/70 text-sm">{alt}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full overflow-hidden rounded-2xl bg-black border border-white/10 ${className}`}>
      <div className="relative aspect-[2/3] w-full">
        <motion.img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
          loading={priority ? "eager" : "lazy"}
          onError={() => setHasError(true)}
          initial={shouldReduceMotion ? false : { opacity: 0.6, scale: 1.03 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        />
      </div>
    </div>
  );
}
