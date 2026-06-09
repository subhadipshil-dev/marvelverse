"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Play, Info, Star, Clock, Calendar, Users, 
  Award, ExternalLink 
} from 'lucide-react';
import { Movie } from '@/types/movie';
import { Poster } from './Poster';
import { PlatformLogo } from './PlatformLogo';
import { toast } from 'sonner';

interface MovieDrawerProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MovieDrawer({ movie, isOpen, onClose }: MovieDrawerProps) {
  // Lock body scroll when drawer open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!movie) return null;

  const handleWatch = () => {
    if (movie.watchUrl) {
      window.open(movie.watchUrl, '_blank', 'noopener,noreferrer');
    } else {
      toast("Watch link coming soon", {
        description: "We're working on adding official streaming links for this title.",
        action: { label: "Got it", onClick: () => {} },
      });
    }
  };

  const handleDownload = () => {
    if (movie.downloadUrl) {
      window.open(movie.downloadUrl, '_blank', 'noopener,noreferrer');
    } else {
      toast("More info coming soon", {
        description: "Additional details and links will be available shortly.",
        className: "premium-toast",
      });
    }
  };

  const handleTrailer = () => {
    if (movie.trailerUrl) {
      window.open(movie.trailerUrl, '_blank', 'noopener,noreferrer');
    } else {
      toast("Trailer coming soon", {
        description: "The official trailer will be embedded here shortly.",
      });
    }
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="drawer" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="drawer-backdrop"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={isMobile ? { y: "100%" } : { x: "100%", opacity: 0 }}
            animate={isMobile ? { y: 0 } : { x: 0, opacity: 1 }}
            exit={isMobile ? { y: "100%" } : { x: "100%", opacity: 0 }}
            transition={{ 
              type: "spring", 
              damping: 26, 
              stiffness: 280, 
              mass: 0.8 
            }}
            className="drawer-panel flex w-full flex-col overflow-hidden lg:w-[1080px]"
          >
            {/* Mobile top bar */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 lg:hidden">
              <div className="text-sm uppercase tracking-[3px] text-white/60">MCU • {movie.phase}</div>
              <button 
                onClick={onClose} 
                className="rounded-full p-2 text-white/70 hover:bg-white/5 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain">
              {/* Hero Backdrop + Poster Section */}
              <div className="relative h-[260px] bg-black lg:h-[380px]">
                {/* Backdrop simulation (deep cinematic) */}
                <div className="absolute inset-0 bg-[radial-gradient(#1a1a1f_0.6px,transparent_1px)] bg-[length:4px_4px]" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-[#050505]/90 to-[#050505]" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/70" />

                {/* Large poster + info - premium framed poster (matches card style) */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 lg:flex-row lg:items-end lg:justify-start lg:gap-8 lg:p-9">
                  <div className="relative z-10 w-[142px] flex-shrink-0 lg:w-[230px]">
                    <Poster 
                      src={movie.thumbnail} 
                      alt={movie.title} 
                      priority 
                      className="shadow-2xl" 
                    />
                  </div>

                  <div className="relative z-10 mt-4 max-w-2xl lg:mt-0">
                    <div className="mb-1 flex items-center gap-3 text-xs uppercase tracking-[3px] text-[#c5a46e]/70">
                      <span>{movie.phase}</span>
                      <span className="h-px w-5 bg-white/30" />
                      <span>TIMELINE {movie.timelineYear}</span>
                    </div>

                    <h1 className="heading-display mb-2 text-3xl font-semibold tracking-[-1.6px] text-white lg:text-5xl">
                      {movie.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-[#a1a1aa]">
                      <div className="flex items-center gap-1.5 text-[#c5a46e]">
                        <Star className="h-4 w-4 fill-current" /> {movie.imdbRating} IMDb
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" /> {movie.runtime}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" /> {movie.releaseYear}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Close on desktop */}
                <button 
                  onClick={onClose} 
                  className="absolute right-6 top-6 z-50 hidden rounded-full bg-black/60 p-3 text-white/80 backdrop-blur hover:bg-black/80 hover:text-white lg:block"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Content Body */}
              <div className="px-6 pb-10 pt-8 lg:px-10 lg:pb-12">
                <div className="grid gap-10 lg:grid-cols-12">
                  {/* Main Info */}
                  <div className="lg:col-span-7">
                    {/* Primary CTAs — Download ALWAYS visible */}
                    <div className="mb-8 flex flex-wrap gap-3">
                      <button 
                        onClick={handleWatch}
                        className="btn btn-primary flex-1 min-w-[148px] gap-2 py-3.5 text-base lg:flex-none"
                      >
                        <Play className="h-4 w-4" /> WATCH NOW
                      </button>
                      
                      <button 
                        onClick={handleDownload}
                        className="btn btn-download flex-1 min-w-[148px] gap-2 py-3.5 text-base lg:flex-none"
                      >
                        <Info className="h-4 w-4" /> MORE INFO
                      </button>

                      <button 
                        onClick={handleTrailer}
                        className="btn btn-secondary flex-1 min-w-[148px] gap-2 py-3.5 text-base lg:flex-none"
                      >
                        <ExternalLink className="h-4 w-4" /> TRAILER
                      </button>
                    </div>

                    {/* Synopsis */}
                    <div className="mb-9">
                      <div className="mb-3 text-xs uppercase tracking-[3px] text-white/50">SYNOPSIS</div>
                      <p className="text-[15px] leading-relaxed text-[#d1d1d6]">{movie.synopsis}</p>
                    </div>

                    {/* Cast */}
                    <div>
                      <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[3px] text-white/50">
                        <Users className="h-3.5 w-3.5" /> PRINCIPAL CAST
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {movie.cast.map((actor, idx) => (
                          <div 
                            key={idx} 
                            className="rounded-full border border-white/10 bg-white/[0.025] px-4 py-1.5 text-sm text-white/90"
                          >
                            {actor}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sidebar Meta */}
                  <div className="lg:col-span-5">
                    <div className="glass-strong rounded-2xl p-6 text-sm">
                      <div className="space-y-5">
                        <div>
                          <div className="text-[10px] uppercase tracking-[2.5px] text-white/50 mb-1.5">CHRONOLOGICAL POSITION</div>
                          <div className="text-2xl font-medium tabular-nums tracking-tight">{movie.timelineYear}</div>
                          <div className="text-[#c5a46e]">MCU Timeline Year</div>
                        </div>

                        <div className="h-px bg-white/10" />

                        <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                          <div>
                            <div className="text-[10px] uppercase tracking-[2.5px] text-white/50">PHASE</div>
                            <div className="mt-1 font-medium text-lg tracking-tight">{movie.phase}</div>
                          </div>
                          <div>
                            <div className="text-[10px] uppercase tracking-[2.5px] text-white/50">RELEASED</div>
                            <div className="mt-1 font-medium text-lg tabular-nums tracking-tight">{movie.releaseYear}</div>
                          </div>
                          <div>
                            <div className="text-[10px] uppercase tracking-[2.5px] text-white/50">RUNTIME</div>
                            <div className="mt-1 font-medium text-lg">{movie.runtime}</div>
                          </div>
                          <div>
                            <div className="text-[10px] uppercase tracking-[2.5px] text-white/50">RATING</div>
                            <div className="mt-1 flex items-baseline gap-1 font-medium text-lg text-[#c5a46e]">
                              {movie.imdbRating} <span className="text-xs text-white/50">/ 10</span>
                            </div>
                          </div>
                        </div>

                        <div className="h-px bg-white/10" />

                        {/* Platforms - Real logos */}
                        <div>
                          <div className="mb-2.5 text-[10px] uppercase tracking-[2.5px] text-white/50">STREAMING ON</div>
                          <div className="flex flex-wrap gap-2">
                            {movie.ottPlatforms.map((p, i) => (
                              <div key={i} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs">
                                <PlatformLogo name={p} className="h-3.5 w-3.5" />
                                <span className="font-medium text-white/80">{p}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 text-center text-[10px] text-white/40 tracking-widest">
                      MARVEL CINEMATIC UNIVERSE — OFFICIAL CHRONOLOGY
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky bottom action bar on mobile */}
            <div className="lg:hidden border-t border-white/10 bg-[#050505]/95 px-4 py-3 backdrop-blur-xl">
              <div className="flex gap-2">
                <button onClick={handleWatch} className="btn btn-primary flex-1 py-3 text-sm">WATCH</button>
                <button onClick={handleDownload} className="btn btn-download flex-1 py-3 text-sm">MORE INFO</button>
                <button onClick={handleTrailer} className="btn btn-secondary flex-1 py-3 text-sm">TRAILER</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
