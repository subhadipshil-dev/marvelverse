"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Download, Info, Star, Clock } from 'lucide-react';
import { Movie } from '@/types/movie';
import { PlatformLogo } from './PlatformLogo';

interface MovieCardProps {
  movie: Movie;
  onDetails: (movie: Movie) => void;
  onWatch: (movie: Movie) => void;
  onDownload: (movie: Movie) => void;
  index?: number;
}

/**
 * Netflix / Disney+ style PORTRAIT movie card.
 * 
 * - Fixed portrait orientation
 * - Poster (2:3) dominates the top ~70%
 * - Uses object-cover so the poster fills the frame cleanly
 * - Card width controlled by parent grid (typically 320-380px)
 * - Compact metadata + equal-width action buttons at bottom
 */
export function MovieCard({ 
  movie, 
  onDetails, 
  onWatch, 
  onDownload, 
  index = 0 
}: MovieCardProps) {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownload(movie);
  };

  const handleWatch = (e: React.MouseEvent) => {
    e.stopPropagation();
    onWatch(movie);
  };

  const handleDetails = () => {
    onDetails(movie);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: Math.min(index * 0.012, 0.4),
        ease: [0.23, 1, 0.32, 1] 
      }}
      whileHover={{ y: -4 }}
      onClick={handleDetails}
      className="group flex w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] transition-all duration-300 hover:border-white/25 hover:shadow-2xl focus:outline-none focus-visible:ring-1 focus-visible:ring-[#c8102e]/60"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleDetails();
        }
      }}
    >
      {/* ========== POSTER SECTION (Dominant, 2:3, object-cover) ========== */}
      <div className="relative w-full overflow-hidden bg-black">
        <div className="relative aspect-[2/3] w-full">
          <img
            src={movie.thumbnail}
            alt={movie.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          {/* Subtle gradient at bottom of poster for text separation */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* IMDb Rating - floating on poster */}
        <div className="absolute right-3 top-3 z-20 flex items-center gap-1 rounded-full bg-black/85 px-2 py-0.5 text-xs font-semibold text-[#c5a46e] shadow ring-1 ring-white/10 backdrop-blur">
          <Star className="h-3 w-3 fill-current" />
          <span>{movie.imdbRating}</span>
        </div>

        {/* Phase badge - top left on poster */}
        <div className="absolute left-3 top-3 z-20 rounded-full bg-black/80 px-2.5 py-px text-[10px] font-medium tracking-wider text-white/90 backdrop-blur">
          {movie.phase}
        </div>
      </div>

      {/* ========== METADATA + ACTIONS SECTION ========== */}
      <div className="flex flex-1 flex-col p-4">
        {/* Title */}
        <h3 className="mb-2 line-clamp-2 text-[15px] font-semibold leading-tight tracking-[-0.2px] text-white group-hover:text-[#c5a46e] transition-colors">
          {movie.title}
        </h3>

        {/* Compact meta: Runtime + Year + Timeline */}
        <div className="mb-3 flex items-center gap-2 text-xs text-white/50">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{movie.runtime}</span>
          </div>
          <span className="text-white/30">•</span>
          <span>{movie.releaseYear}</span>
          <span className="text-white/30">•</span>
          <span className="text-[#c8102e]/80">{movie.timelineYear}</span>
        </div>

        {/* OTT Platforms with real logos */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {movie.ottPlatforms.slice(0, 3).map((platform) => (
            <div 
              key={platform}
              className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.02] px-2 py-px text-[10px]"
            >
              <PlatformLogo name={platform} className="h-3 w-3" />
              <span className="font-medium text-white/70 tracking-wide">{platform}</span>
            </div>
          ))}
          {movie.ottPlatforms.length > 3 && (
            <div className="flex items-center rounded-md border border-white/10 bg-white/[0.015] px-1.5 text-[10px] text-white/50">
              +{movie.ottPlatforms.length - 3}
            </div>
          )}
        </div>

        {/* Action Buttons - Equal width, bottom aligned */}
        <div className="mt-auto grid grid-cols-3 gap-2 pt-1">
          <button
            onClick={handleWatch}
            className="flex h-9 items-center justify-center gap-1.5 rounded-xl bg-[#c8102e] text-[11px] font-semibold tracking-[0.3px] text-white transition-all active:scale-[0.985] hover:bg-[#e11d48]"
          >
            <Play className="h-3.5 w-3.5" />
            <span>WATCH</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex h-9 items-center justify-center gap-1.5 rounded-xl border border-[#c5a46e]/60 text-[11px] font-semibold tracking-[0.3px] text-[#c5a46e] transition-all hover:border-[#c5a46e] hover:bg-[#c5a46e]/5 active:scale-[0.985]"
          >
            <Download className="h-3.5 w-3.5" />
            <span>MORE INFO</span>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); onDetails(movie); }}
            className="flex h-9 items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.015] text-[11px] font-medium tracking-[0.3px] text-white/80 transition-all hover:bg-white/[0.04] hover:text-white active:scale-[0.985]"
          >
            <Info className="h-3.5 w-3.5" />
            <span>INFO</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
