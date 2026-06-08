"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Film } from 'lucide-react';

interface PosterProps {
  src: string;
  alt: string;
  className?: string;
  phase?: string;
  year?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  priority?: boolean;
}

export function Poster({ 
  src, 
  alt, 
  className = "", 
  phase, 
  year,
  size = 'md',
  priority = false 
}: PosterProps) {
  const [hasError, setHasError] = React.useState(false);

  const sizeClasses = {
    sm: 'aspect-[2/3] w-full',
    md: 'aspect-[2/3] w-full',
    lg: 'aspect-[2/3] w-full',
    xl: 'aspect-[2/3] w-full max-w-[420px]',
  };

  // Stunning cinematic fallback poster
  const FallbackPoster = () => (
    <div 
      className={`relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] ${className}`}
    >
      {/* Deep cinematic gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(#1f1f23_0.8px,transparent_1px)] bg-[length:3px_3px]" />
      
      {/* Red energy gradient wash */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#c8102e]/20 via-[#050505] to-black" />
      
      {/* Subtle gold rim light */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c5a46e]/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#c5a46e]/30 to-transparent" />
      
      {/* Central emblem area */}
      <div className="relative z-10 flex flex-col items-center px-4 text-center">
        {/* Elegant MCU emblem */}
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-black/40">
          <Film className="h-7 w-7 text-[#c8102e]" />
        </div>

        {/* Movie title treatment */}
        <div className="max-w-[85%]">
          <div className="mb-1 text-[13px] font-medium tracking-[4px] text-[#c5a46e]/70">
            MARVEL CINEMATIC UNIVERSE
          </div>
          <div className="font-serif text-xl font-semibold leading-none tracking-[-0.02em] text-white/95 md:text-2xl">
            {alt}
          </div>
        </div>

        {/* Meta row */}
        {(phase || year) && (
          <div className="mt-5 flex items-center gap-2 text-[11px] uppercase tracking-[2px] text-white/50">
            {phase && (
              <span className="rounded-full border border-white/10 px-3 py-px text-[#c8102e]">
                {phase}
              </span>
            )}
            {year && <span>{year}</span>}
          </div>
        )}
      </div>

      {/* Bottom accent bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#c8102e] via-[#e11d48] to-[#c8102e] opacity-70" />
      
      {/* Corner details */}
      <div className="absolute left-3 top-3 h-4 w-px bg-white/20" />
      <div className="absolute left-3 top-3 h-px w-4 bg-white/20" />
      <div className="absolute right-3 bottom-3 h-4 w-px bg-white/20" />
      <div className="absolute right-3 bottom-3 h-px w-4 bg-white/20" />
    </div>
  );

  if (hasError) {
    return (
      <div className={`${sizeClasses[size]} ${className}`}>
        <FallbackPoster />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${sizeClasses[size]} ${className}`}>
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        onError={() => setHasError(true)}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
      
      {/* Subtle top & bottom vignette for cinematic feel */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[38%] bg-gradient-to-b from-black/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-black/85 to-transparent" />
    </div>
  );
}
