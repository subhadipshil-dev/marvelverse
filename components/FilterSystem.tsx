"use client";

import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlatformLogo } from './PlatformLogo';
import { cn } from '@/lib/utils';

interface FilterSystemProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activePhase: string;
  setActivePhase: (p: string) => void;
  activePlatform: string;
  setActivePlatform: (p: string) => void;
  minRating: number;
  setMinRating: (r: number) => void;
  sortBy: 'timeline' | 'rating' | 'release' | 'alpha';
  setSortBy: (s: 'timeline' | 'rating' | 'release' | 'alpha') => void;
}

const PHASE_OPTIONS = ['All', 'Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'Phase 5'];
const PLATFORMS = ['JioHotstar', 'Netflix', 'Prime Video', 'Sony LIV'];
const PLATFORM_COLORS: Record<string, string> = {
  'JioHotstar': '#0F1C3F',
  'Netflix': '#E50914',
  'Prime Video': '#00A8E1',
  'Sony LIV': '#FFCC00',
};
const SORT_OPTIONS = [
  { value: 'timeline', label: 'Timeline Order' },
  { value: 'rating', label: 'IMDb Rating' },
  { value: 'release', label: 'Release Date' },
  { value: 'alpha', label: 'A–Z' },
] as const;

export function FilterSystem({
  searchQuery,
  setSearchQuery,
  activePhase,
  setActivePhase,
  activePlatform,
  setActivePlatform,
  minRating,
  setMinRating,
  sortBy,
  setSortBy,
}: FilterSystemProps) {
  const [sortOpen, setSortOpen] = useState(false);

  const currentSort = SORT_OPTIONS.find(o => o.value === sortBy)!;

  const handleSortSelect = (value: typeof sortBy) => {
    setSortBy(value);
    setSortOpen(false);
  };

  const phaseContainerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const updatePhaseIndicator = () => {
    if (!phaseContainerRef.current) return;
    const activeButton = phaseContainerRef.current.querySelector(
      `[data-phase="${activePhase}"]`
    ) as HTMLElement | null;
    if (!activeButton) return;
    const containerRect = phaseContainerRef.current.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();
    const left = buttonRect.left - containerRect.left;
    const width = buttonRect.width;
    setIndicatorStyle({ left, width });
  };

  useLayoutEffect(() => {
    updatePhaseIndicator();
  }, [activePhase]);

  useEffect(() => {
    const handleResize = () => {
      updatePhaseIndicator();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Ensure initial measurement after layout
  useEffect(() => {
    const timer = setTimeout(updatePhaseIndicator, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      className="filter-container mx-auto max-w-[1400px] relative rounded-[28px] border overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(18,18,26,.95), rgba(12,12,18,.98))',
        border: '1px solid rgba(255,255,255,.06)',
        boxShadow: '0 20px 80px rgba(0,0,0,.35)',
        padding: '32px',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Subtle cinematic background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(200,16,46,0.04),transparent_60%)] rounded-[28px] pointer-events-none" />

      {/* ROW 1: Full-width cinematic search (Apple Spotlight style) */}
      <div className="mb-6">
        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 transition-colors group-focus-within:text-[#c8102e]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search movies, series, characters or timeline years..."
            className="w-full h-[60px] bg-[#0a0a12]/80 border border-white/10 pl-14 pr-12 text-base placeholder:text-white/40 focus:outline-none focus:border-[#c8102e]/40 focus:bg-[#0a0a12] rounded-[999px] transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(200,16,46,0.15)]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all active:scale-95"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <div className="absolute inset-0 rounded-[999px] bg-[radial-gradient(circle_at_50%_50%,rgba(200,16,46,0.04),transparent_70%)] opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
        </div>
      </div>

      {/* ROW 2: 4-column premium controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* PHASE - Segmented control */}
        <div>
          <div className="text-[12px] uppercase tracking-[2px] text-[#c5a46e] mb-2">PHASE</div>
          <div 
            ref={phaseContainerRef}
            className="relative flex flex-nowrap overflow-x-auto rounded-2xl bg-white/[0.03] p-1 border border-white/5 h-[52px] items-center"
          >
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 h-[44px] rounded-[14px] z-0"
              style={{
                background: 'linear-gradient(135deg, #ff1744, #d50032)',
                boxShadow: '0 0 20px rgba(255,23,68,.3), 0 0 40px rgba(255,23,68,.15)',
              }}
              animate={{
                left: indicatorStyle.left,
                width: indicatorStyle.width,
              }}
              transition={{
                left: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
                width: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
              }}
            />
            {PHASE_OPTIONS.map((phase) => {
              const isActive = activePhase === phase;
              const label = phase === 'All' ? 'All' : phase;
              return (
                <button
                  key={phase}
                  data-phase={phase}
                  onClick={() => setActivePhase(phase)}
                  className={cn(
                    "relative z-10 flex-shrink-0 whitespace-nowrap min-w-[72px] px-4 h-[44px] flex items-center justify-center rounded-xl font-medium transition-all text-center text-[13px] tracking-wider",
                    isActive 
                      ? "text-white" 
                      : "text-white/65 hover:text-white/90"
                  )}
                  style={{
                    transform: isActive ? 'scale(1.03)' : 'scale(1)',
                    transition: 'transform 300ms ease',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* PLATFORMS - Single row elegant chips */}
        <div>
          <div className="text-[12px] uppercase tracking-[2px] text-[#c5a46e] mb-2">PLATFORMS</div>
          <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1">
            {PLATFORMS.map((platform) => {
              const isActive = activePlatform === platform;
              const color = PLATFORM_COLORS[platform] || '#c8102e';
              return (
                <button
                  key={platform}
                  onClick={() => setActivePlatform(isActive ? 'All' : platform)}
                  className={cn(
                    "flex items-center gap-2 rounded-full border px-4 h-[40px] text-sm font-medium transition-all active:scale-[0.985] flex-shrink-0 whitespace-nowrap",
                    isActive 
                      ? "text-white" 
                      : "text-white/80 hover:text-white"
                  )}
                  style={{ 
                    borderColor: isActive ? color : 'rgba(255,255,255,.1)',
                    background: isActive ? `${color}15` : 'rgba(255,255,255,.015)',
                    boxShadow: isActive ? `0 0 12px ${color}40` : 'none'
                  }}
                  title={platform}
                >
                  <PlatformLogo name={platform} className="h-4 w-4" />
                  <span className="text-xs tracking-wider">{platform}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* RATING - Premium gold slider */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <div className="text-[12px] uppercase tracking-[2px] text-[#c5a46e]">MCU RATING</div>
            <div className="text-sm font-medium text-[#c5a46e] tabular-nums tracking-tight">★ {minRating.toFixed(1)}</div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-white/40 tabular-nums shrink-0">6.0</span>
            <div className="relative flex-1">
              <input
                type="range"
                min={6}
                max={10}
                step={0.1}
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="premium-slider w-full accent-[#c5a46e]"
              />
              <div className="absolute top-1/2 -translate-y-1/2 left-0 h-0.5 w-full bg-[#c5a46e]/10 rounded pointer-events-none" />
            </div>
            <span className="text-[10px] text-white/40 tabular-nums shrink-0">10.0</span>
          </div>
        </div>

        {/* SORT - Modern dropdown */}
        <div>
          <div className="text-[12px] uppercase tracking-[2px] text-[#c5a46e] mb-2">SORT BY</div>
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex w-full h-[52px] items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.02] px-4 text-sm font-medium transition-all hover:bg-white/5 active:scale-[0.985] text-white/90"
            >
              <span className="truncate">{currentSort.label}</span>
              <ChevronDown className={cn("h-4 w-4 text-white/50 transition-transform", sortOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {sortOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
                  className="absolute right-0 z-[100] mt-2 w-48 overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl py-1"
                >
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSortSelect(option.value)}
                      className={cn(
                        "block w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/5",
                        sortBy === option.value ? "text-white bg-white/5" : "text-white/75"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
