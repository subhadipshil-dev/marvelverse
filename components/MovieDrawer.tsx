"use client";

import React, { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Play, Info, Star, Clock, Calendar, Users, 
  Award, ExternalLink 
} from 'lucide-react';
import { Movie } from '@/types/movie';
import { Poster } from './Poster';
import { PlatformLogo } from './PlatformLogo';
import { toast } from 'sonner';

import moviesData from '@/data/movies.json';
const allMovies: Movie[] = moviesData as Movie[];

interface MovieDrawerProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
  onMovieChange?: (movie: Movie) => void;
}

export function MovieDrawer({ movie, isOpen, onClose, onMovieChange }: MovieDrawerProps) {
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

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  // Related movies for "continue the journey" - same phase or nearby in timeline
  const relatedMovies = useMemo(() => {
    if (!movie) return [];
    return allMovies
      .filter(m => 
        m.id !== movie.id && 
        (m.phase === movie.phase || Math.abs(m.timelineYear - movie.timelineYear) <= 4)
      )
      .sort((a, b) => {
        const distA = Math.abs(a.timelineYear - movie.timelineYear);
        const distB = Math.abs(b.timelineYear - movie.timelineYear);
        return distA - distB || a.timelineYear - b.timelineYear;
      })
      .slice(0, 6);
  }, [movie]);

  // Scroll content to top when movie changes (while drawer stays open)
  useEffect(() => {
    if (isOpen && movie) {
      const scroller = document.querySelector('.drawer-content');
      if (scroller) scroller.scrollTop = 0;
    }
  }, [movie?.id, isOpen]);

  if (!movie) return null;

  // Movie-specific cinematic theme for ambient lighting and glows
  const getMovieTheme = (m: Movie) => {
    const id = m.id.toLowerCase();
    const title = m.title.toLowerCase();

    if (id.includes('hulk')) {
      return { 
        glow: 'rgba(16, 185, 129, 0.32)', 
        secondary: 'rgba(52, 211, 153, 0.18)',
        name: 'emerald' 
      };
    }
    if (id.includes('iron-man') || id.includes('ironman')) {
      return { 
        glow: 'rgba(249, 115, 22, 0.35)', 
        secondary: 'rgba(59, 130, 246, 0.22)',
        name: 'arc-reactor' 
      };
    }
    if (id.includes('thor')) {
      return { 
        glow: 'rgba(59, 130, 246, 0.30)', 
        secondary: 'rgba(147, 197, 253, 0.15)',
        name: 'lightning' 
      };
    }
    if (id.includes('captain-marvel') || title.includes('captain marvel')) {
      return { 
        glow: 'rgba(245, 158, 11, 0.32)', 
        secondary: 'rgba(251, 191, 36, 0.18)',
        name: 'cosmic' 
      };
    }
    if (id.includes('strange') || title.includes('strange')) {
      return { 
        glow: 'rgba(249, 115, 22, 0.28)', 
        secondary: 'rgba(167, 139, 250, 0.20)',
        name: 'mystic' 
      };
    }
    // Default rich Marvel cinematic red/gold
    return { 
      glow: 'rgba(200, 16, 46, 0.22)', 
      secondary: 'rgba(197, 164, 110, 0.12)',
      name: 'marvel' 
    };
  };

  const theme = getMovieTheme(movie);

  // Pre-computed softer glow for poster shadow (more visible cinematic rim)
  const posterGlow = theme.glow.replace(/0\.\d+/, '0.38');

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
            <div className="flex-1 overflow-y-auto overscroll-contain drawer-content bg-[#050505]">
              {/* ============================================
                  CINEMATIC FULL-BLEED HERO
                  Full-bleed backdrop using the movie's key art + heavy cinematic overlays
                  Large integrated poster + title + actions
              ============================================ */}
              <div className="relative h-[48vh] sm:h-[52vh] lg:h-[58vh] overflow-hidden bg-black">
                {/* Dramatic full-bleed backdrop - poster as artistic key art */}
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${movie.thumbnail})` }}
                />

                {/* Stronger layered dark gradients for cinematic weight and depth (not flat wash) */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-[#050505]/55 to-[#050505]/92" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/25 to-black/45" />

                {/* Spotlight / movie key-light effect from upper center for premium stage feel */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(255,255,255,0.06)_0%,transparent_55%)]" />

                {/* Deeper bottom shadow under poster/title area for visual weight */}
                <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/75 via-black/45 to-transparent" />

                {/* Edge vignette for cinematic framing and depth */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.65)_95%)]" />

                {/* Movie-specific ambient lighting glow (thematic color wash) */}
                <div 
                  className="absolute inset-0"
                  style={{ 
                    background: `radial-gradient(circle at 28% 22%, ${theme.glow}, transparent 62%)` 
                  }} 
                />
                <div 
                  className="absolute inset-0"
                  style={{ 
                    background: `radial-gradient(circle at 75% 78%, ${theme.secondary}, transparent 58%)` 
                  }} 
                />

                {/* Subtle film grain texture */}
                <div className="absolute inset-0 opacity-[0.025] mix-blend-screen" 
                     style={{ backgroundImage: 'radial-gradient(#fff 0.5px, transparent 0.5px)', backgroundSize: '3px 3px' }} />

                {/* Large blurred cinematic glows behind poster position for depth */}
                <div 
                  className="absolute left-[1%] bottom-[3%] w-[340px] h-[340px] lg:w-[460px] lg:h-[460px] rounded-full pointer-events-none"
                  style={{ 
                    background: theme.glow, 
                    filter: 'blur(130px)', 
                    opacity: 0.42 
                  }} 
                />

                {/* Low-opacity floating color orbs for atmospheric richness */}
                <div 
                  className="absolute top-[10%] right-[12%] w-[160px] h-[160px] rounded-full pointer-events-none"
                  style={{ 
                    background: theme.glow, 
                    filter: 'blur(85px)', 
                    opacity: 0.14 
                  }} 
                />
                <div 
                  className="absolute bottom-[35%] left-[22%] w-[95px] h-[95px] rounded-full pointer-events-none"
                  style={{ 
                    background: theme.secondary, 
                    filter: 'blur(55px)', 
                    opacity: 0.11 
                  }} 
                />

                {/* Subtle volumetric lighting from upper area */}
                <div className="absolute inset-x-0 top-0 h-[42%] bg-gradient-to-b from-white/[0.04] via-transparent to-transparent pointer-events-none" />

                {/* Smooth cinematic fade-to-black at the bottom edge of the hero image.
                    Starts softly higher in the banner and transitions to full black at the very bottom,
                    so the image dissolves naturally into the black section below without a hard cut.
                    Keeps title/poster/buttons readable (they sit above this layer). */}
                <div className="absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-black via-black/82 to-transparent" />

                {/* Subtle side softening at the bottom for a more natural, rounded cinematic dissolve on the edges */}
                <div className="absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-r from-black/18 via-transparent to-black/18" />

                {/* Main hero content */}
                <div className="absolute inset-0 flex items-end">
                  <div className="w-full max-w-7xl mx-auto px-5 sm:px-6 pb-4 lg:pb-8">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:gap-9 xl:gap-12">
                      
                      {/* Large, prominent poster - raised upward for balanced composition and stronger integration */}
                      <div className="relative z-10 -mb-4 lg:-mt-10 lg:mb-0 flex-shrink-0 mx-auto lg:mx-0">
                        {/* Large blurred glow directly behind poster for premium atmospheric pop */}
                        <div 
                          className="absolute -inset-8 lg:-inset-10 rounded-full pointer-events-none"
                          style={{ 
                            background: theme.glow, 
                            filter: 'blur(90px)', 
                            opacity: 0.38 
                          }} 
                        />

                        <motion.div
                          key={movie.id + '-poster'}
                          initial={{ opacity: 0, y: 30, scale: 0.94 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
                          className="relative w-[138px] sm:w-[165px] lg:w-[240px] xl:w-[275px] aspect-[2/3] rounded-3xl overflow-hidden border border-white/10"
                          style={{ 
                            boxShadow: `0 25px 70px -15px rgb(0,0,0,0.92), 0 0 80px ${posterGlow}` 
                          }}
                        >
                          <img 
                            src={movie.thumbnail} 
                            alt={movie.title}
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                          {/* Inner cinematic vignette on poster - deeper for premium framing */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/12 to-transparent" />
                          <div 
                            className="absolute inset-0" 
                            style={{ background: `linear-gradient(to right, ${theme.glow.replace('0.32','0.08').replace('0.35','0.09').replace('0.30','0.07').replace('0.28','0.06').replace('0.22','0.05')}, transparent 55%)` }} 
                          />
                        </motion.div>
                      </div>

                      {/* Title, metadata and actions - elegant overlay on hero */}
                      <div className="relative z-10 flex-1 text-center lg:text-left pt-2 lg:pt-0 pb-1 lg:pb-2">
                        <motion.div
                          key={movie.id + '-header'}
                          initial={{ opacity: 0, y: 18 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.12, duration: 0.5 }}
                        >
                          {/* Badges */}
                          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-3 gap-y-1 text-[10px] uppercase tracking-[2.5px] text-[#c5a46e] mb-2.5">
                            <span className="px-3 py-0.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">{movie.phase}</span>
                            <span className="text-white/70">•</span>
                            <span>TIMELINE {movie.timelineYear}</span>
                          </div>

                          {/* Massive title */}
                          <h1 className="heading-display text-3xl sm:text-[42px] lg:text-[52px] xl:text-[60px] font-semibold tracking-[-2.8px] leading-[0.92] text-white mb-3 drop-shadow-2xl">
                            {movie.title}
                          </h1>

                          {/* Key metadata row */}
                          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-1 text-sm text-white/75 mb-5">
                            <div className="flex items-center gap-1.5 text-[#c5a46e]">
                              <Star className="h-4 w-4 fill-current" /> {movie.imdbRating} <span className="text-xs text-white/50 tracking-normal">IMDb</span>
                            </div>
                            <div className="text-white/50">•</div>
                            <div>{movie.runtime}</div>
                            <div className="text-white/50">•</div>
                            <div>{movie.releaseYear}</div>
                          </div>
                        </motion.div>

                        {/* Premium cinematic action row */}
                        <motion.div
                          key={movie.id + '-actions'}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.28, duration: 0.45 }}
                          className="flex flex-wrap gap-3 justify-center lg:justify-start"
                        >
                          <button 
                            onClick={handleWatch}
                            className="btn btn-primary px-7 py-3.5 text-[15px] flex items-center gap-2.5 shadow-lg"
                          >
                            <Play className="h-5 w-5" /> WATCH NOW
                          </button>
                          <button 
                            onClick={handleDownload}
                            className="btn btn-download px-6 py-3.5 text-[15px] flex items-center gap-2.5"
                          >
                            <Info className="h-5 w-5" /> MORE INFO
                          </button>
                          <button 
                            onClick={handleTrailer}
                            className="btn btn-secondary px-6 py-3.5 text-[15px] flex items-center gap-2.5 border-white/25"
                          >
                            <ExternalLink className="h-5 w-5" /> TRAILER
                          </button>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Close button - elegant, always accessible */}
                <button 
                  onClick={onClose} 
                  className="absolute top-4 right-4 z-[60] rounded-full bg-black/60 hover:bg-black/80 p-2.5 text-white/80 hover:text-white backdrop-blur-md border border-white/10 transition-all lg:top-6 lg:right-6"
                  aria-label="Close details"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* ============================================
                  LOWER CONTENT - clean, scannable, premium sections
              ============================================ */}
              <div className="max-w-5xl mx-auto px-5 sm:px-6 py-10 lg:py-14 space-y-11 text-white">
                
                {/* Synopsis - prominent, readable */}
                <div className="max-w-3xl">
                  <div className="uppercase text-[10px] tracking-[3.5px] text-[#c5a46e] mb-3">SYNOPSIS</div>
                  <p className="text-[15.5px] leading-relaxed text-[#e5e5e7]">{movie.synopsis}</p>
                </div>

                {/* Cast + Platforms side by side elegant */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-x-8 gap-y-9 pt-1">
                  {/* Cast */}
                  <div className="md:col-span-3">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[3px] text-[#c5a46e] mb-3.5">
                      <Users className="h-3.5 w-3.5" /> PRINCIPAL CAST
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {movie.cast.map((actor, idx) => (
                        <div 
                          key={idx} 
                          className="rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-1.5 text-sm text-white/85 hover:bg-white/[0.04] transition-colors"
                        >
                          {actor}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Platforms */}
                  <div className="md:col-span-2">
                    <div className="text-[10px] uppercase tracking-[3px] text-[#c5a46e] mb-3.5">STREAMING ON</div>
                    <div className="flex flex-wrap gap-2.5">
                      {movie.ottPlatforms.map((p, i) => (
                        <div key={i} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.02] pl-3 pr-4 py-2 text-sm">
                          <PlatformLogo name={p} className="h-4 w-4" />
                          <span className="font-medium text-white/85">{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Timeline context - elegant highlight */}
                <div className="rounded-3xl border border-white/10 bg-white/[0.012] p-6 lg:p-7">
                  <div className="uppercase text-[10px] tracking-[3px] text-[#c5a46e] mb-2">POSITION IN THE MCU TIMELINE</div>
                  <div className="text-2xl lg:text-3xl font-semibold tracking-[-0.5px] text-white mb-1 tabular-nums">
                    {movie.timelineYear} <span className="text-[#c5a46e] font-normal">— {movie.phase}</span>
                  </div>
                  <p className="text-white/70 text-[14.5px] max-w-prose">
                    This film is set in the year {movie.timelineYear} of the official Marvel Cinematic Universe chronology.
                  </p>
                </div>

                {/* Continue the MCU Journey - related titles */}
                {relatedMovies.length > 0 && (
                  <div className="pt-2">
                    <div className="flex items-end justify-between mb-4">
                      <div>
                        <div className="text-[10px] uppercase tracking-[3.5px] text-[#c5a46e]">CONTINUE THE JOURNEY</div>
                        <div className="text-xl font-semibold tracking-tight">Explore nearby titles in the timeline</div>
                      </div>
                    </div>

                    <div className="flex gap-3.5 overflow-x-auto snap-x snap-mandatory pb-5 -mx-1 px-1 scrollbar-hide">
                      {relatedMovies.map((relMovie) => (
                        <button
                          key={relMovie.id}
                          onClick={() => {
                            if (onMovieChange) {
                              onMovieChange(relMovie);
                            }
                          }}
                          className="snap-start group flex-shrink-0 w-[108px] text-left"
                        >
                          <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden border border-white/10 mb-2.5 bg-black">
                            <img 
                              src={relMovie.thumbnail} 
                              alt={relMovie.title}
                              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                          </div>
                          <div className="text-sm font-medium leading-tight tracking-[-0.1px] text-white/90 group-hover:text-[#c5a46e] line-clamp-2 pr-1">
                            {relMovie.title}
                          </div>
                          <div className="text-[10px] text-white/50 mt-0.5">{relMovie.timelineYear}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 text-center text-[10px] tracking-[2px] text-white/40 border-t border-white/10">
                  MARVEL CINEMATIC UNIVERSE — OFFICIAL CHRONOLOGY
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
