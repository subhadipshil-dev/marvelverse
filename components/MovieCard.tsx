"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Download, Info, Star, Clock, Calendar } from 'lucide-react';
import { Movie } from '@/types/movie';
import { Poster } from './Poster';
import { cn } from '@/lib/utils';

interface MovieCardProps {
  movie: Movie;
  onDetails: (movie: Movie) => void;
  onWatch: (movie: Movie) => void;
  onDownload: (movie: Movie) => void;
  onTrailer?: (movie: Movie) => void;
  index?: number;
}

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
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: Math.min(index * 0.018, 0.6),
        ease: [0.23, 1, 0.32, 1] 
      }}
      whileHover={{ y: -4 }}
      className="movie-card group flex h-full flex-col focus-within:outline-none focus-within:ring-1 focus-within:ring-[#c8102e]/60"
      onClick={handleDetails}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') handleDetails(); }}
    >
      {/* Poster Area */}
      <div className="poster-container relative aspect-[2/2.85] bg-[#0a0a0a]">
        <Poster 
          src={movie.thumbnail} 
          alt={movie.title}
          phase={movie.phase}
          year={movie.timelineYear}
        />

        {/* Top overlay badges */}
        <div className="absolute left-3 top-3 z-20 flex items-center gap-1.5">
          <div className="glass flex items-center gap-1 rounded-full px-2.5 py-px text-[10px] font-medium tracking-widest text-white/90">
            {movie.phase}
          </div>
          <div className="glass flex items-center gap-1 rounded-full px-2 py-px text-[10px] font-medium text-[#c5a46e]">
            <Calendar className="h-3 w-3" /> {movie.releaseYear}
          </div>
        </div>

        {/* IMDb Gold Rating */}
        <div className="absolute right-3 top-3 z-20">
          <div className="glass flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-[#c5a46e]">
            <Star className="h-3.5 w-3.5 fill-current" />
            {movie.imdbRating}
          </div>
        </div>

        {/* Timeline position indicator */}
        <div className="absolute bottom-3 left-3 z-20 rounded-full bg-black/70 px-2.5 py-0.5 text-[10px] font-medium text-white/70 tracking-widest">
          {movie.timelineYear}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3">
          <h3 className="line-clamp-2 text-[15px] font-semibold leading-tight tracking-[-0.01em] text-white group-hover:text-[#c5a46e] transition-colors">
            {movie.title}
          </h3>
        </div>

        {/* Meta row */}
        <div className="mb-4 flex items-center gap-3 text-xs text-[#71717a]">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{movie.runtime}</span>
          </div>
          <div className="h-1 w-1 rounded-full bg-white/20" />
          <div>{movie.ottPlatforms.length} platforms</div>
        </div>

        {/* OTT Platform badges (compact) */}
        <div className="mb-5 flex flex-wrap gap-1.5">
          {movie.ottPlatforms.slice(0, 2).map((platform) => (
            <div 
              key={platform} 
              className="platform-badge text-[10px] py-px"
              style={{ borderColor: 'rgba(255,255,255,0.1)' }}
            >
              {platform}
            </div>
          ))}
          {movie.ottPlatforms.length > 2 && (
            <div className="platform-badge text-[10px] py-px">+{movie.ottPlatforms.length - 2}</div>
          )}
        </div>

        {/* Action Buttons — Download ALWAYS visible */}
        <div className="mt-auto grid grid-cols-3 gap-2">
          <button
            onClick={handleWatch}
            className="btn btn-primary col-span-1 flex-1 py-2.5 text-xs"
          >
            <Play className="h-3.5 w-3.5" />
            <span>WATCH</span>
          </button>

          <button
            onClick={handleDownload}
            className="btn btn-download col-span-1 flex-1 py-2.5 text-xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>DOWNLOAD</span>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); onDetails(movie); }}
            className="btn btn-ghost col-span-1 flex-1 py-2.5 text-xs"
          >
            <Info className="h-3.5 w-3.5" />
            <span>DETAILS</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
