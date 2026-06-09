"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Settings2, ChevronDown } from 'lucide-react';
import { PlatformLogo } from './PlatformLogo';
import { cn } from '@/lib/utils';

interface FilterPanelProps {
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
const PLATFORM_LIST = ['Disney+', 'Netflix', 'Prime Video', 'JioHotstar', 'Sony LIV'];
const SORT_OPTIONS = [
  { value: 'timeline', label: 'Timeline Order' },
  { value: 'rating', label: 'IMDb Rating' },
  { value: 'release', label: 'Release Date' },
  { value: 'alpha', label: 'A–Z' },
] as const;

export function FilterPanel({
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
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

  const currentSort = SORT_OPTIONS.find(o => o.value === sortBy) || SORT_OPTIONS[0];

  const closePanel = () => {
    setIsOpen(false);
    setIsSortMenuOpen(false);
  };

  const handlePlatformClick = (platform: string) => {
    if (activePlatform === platform) {
      setActivePlatform('All');
    } else {
      setActivePlatform(platform);
    }
  };

  const handleSortSelect = (value: typeof sortBy) => {
    setSortBy(value);
    setIsSortMenuOpen(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-6">
      {/* Minimal default bar - Search + Filters button */}
      <div className="flex items-center gap-3">
        {/* Search - always visible, elegant */}
        <div className="relative flex-1">
          <div className="relative flex items-center rounded-2xl border border-white/10 bg-white/[0.02] transition-all focus-within:border-[#c8102e]/50 focus-within:bg-white/[0.03]">
            <Search className="absolute left-4 h-4 w-4 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies, characters, phases..."
              className="w-full bg-transparent py-3 pl-11 pr-4 text-sm placeholder:text-white/40 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 rounded-full p-1 text-white/40 hover:text-white hover:bg-white/10"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filters trigger button */}
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm font-medium text-white/80 transition-all hover:bg-white/5 hover:text-white active:scale-[0.985]"
        >
          <Settings2 className="h-4 w-4" />
          Filters
        </button>
      </div>

      {/* Floating glass panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-md"
              onClick={closePanel}
            />

            {/* Centered panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28, mass: 0.8 }}
              className="fixed left-1/2 top-[18%] z-[70] w-full max-w-[780px] -translate-x-1/2 rounded-3xl border border-white/10 bg-[#0a0a0a]/95 p-8 shadow-2xl backdrop-blur-2xl"
            >
              {/* Panel Header */}
              <div className="mb-6 flex items-center justify-between">
                <div className="text-lg font-semibold tracking-tight">Filters</div>
                <button
                  onClick={closePanel}
                  className="rounded-full p-2 text-white/50 hover:bg-white/5 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-8">
                {/* Phase - Segmented with layoutId sliding indicator */}
                <div>
                  <div className="mb-3 text-xs uppercase tracking-[2px] text-white/50">Phase</div>
                  <div className="relative flex rounded-2xl bg-white/[0.04] p-1">
                    {PHASE_OPTIONS.map((phase) => {
                      const isActive = activePhase === phase;
                      const label = phase === 'All' ? 'All' : 'P' + phase.split(' ')[1];
                      return (
                        <button
                          key={phase}
                          onClick={() => setActivePhase(phase)}
                          className={cn(
                            "relative z-10 flex-1 rounded-xl px-4 py-2 text-sm font-medium transition-colors",
                            isActive ? "text-white" : "text-white/60 hover:text-white/80"
                          )}
                        >
                          {label}
                          {isActive && (
                            <motion.div
                              layoutId="activePhase"
                              className="absolute inset-0 -z-10 rounded-xl bg-[#c8102e]"
                              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Platforms - Logo only chips */}
                <div>
                  <div className="mb-3 text-xs uppercase tracking-[2px] text-white/50">Platforms</div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setActivePlatform('All')}
                      className={cn(
                        "rounded-2xl border px-4 py-2 text-sm font-medium transition-all active:scale-[0.985]",
                        activePlatform === 'All'
                          ? "border-[#c8102e] bg-[#c8102e]/10 text-white"
                          : "border-white/10 bg-white/[0.02] text-white/70 hover:border-white/20 hover:text-white"
                      )}
                    >
                      All
                    </button>
                    {PLATFORM_LIST.map((platform) => {
                      const isActive = activePlatform === platform;
                      return (
                        <button
                          key={platform}
                          onClick={() => handlePlatformClick(platform)}
                          className={cn(
                            "flex items-center justify-center rounded-2xl border p-2.5 transition-all active:scale-[0.985]",
                            isActive
                              ? "border-[#c8102e] bg-[#c8102e]/10 scale-105 shadow-[0_0_12px_rgba(200,16,46,0.3)]"
                              : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/5"
                          )}
                          title={platform}
                        >
                          <PlatformLogo name={platform} className="h-5 w-5" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Rating + Sort in a clean row */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  {/* Rating - compact elegant */}
                  <div>
                    <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[2px] text-white/50">
                      <span>IMDb Rating</span>
                      <span className="font-mono text-[#c5a46e]">{minRating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-white/40">6.0</span>
                      <input
                        type="range"
                        min={6}
                        max={10}
                        step={0.1}
                        value={minRating}
                        onChange={(e) => setMinRating(parseFloat(e.target.value))}
                        className="premium-slider flex-1 accent-[#c8102e]"
                      />
                      <span className="text-xs text-white/40">10.0</span>
                    </div>
                  </div>

                  {/* Sort - compact selector */}
                  <div>
                    <div className="mb-2 text-xs uppercase tracking-[2px] text-white/50">Sort</div>
                    <div className="relative">
                      <button
                        onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                        className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm font-medium transition-all hover:bg-white/5"
                      >
                        <span>{currentSort.label}</span>
                        <ChevronDown className={cn("h-4 w-4 text-white/50 transition-transform", isSortMenuOpen && "rotate-180")} />
                      </button>

                      <AnimatePresence>
                        {isSortMenuOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="absolute left-0 right-0 z-10 mt-1 overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-xl"
                          >
                            {SORT_OPTIONS.map((option) => (
                              <button
                                key={option.value}
                                onClick={() => handleSortSelect(option.value)}
                                className={cn(
                                  "block w-full px-4 py-2.5 text-left text-sm transition-colors",
                                  sortBy === option.value ? "bg-white/5 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
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
              </div>

              {/* Subtle footer action */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActivePhase('All');
                    setActivePlatform('All');
                    setMinRating(6);
                    setSortBy('timeline');
                    closePanel();
                  }}
                  className="text-xs uppercase tracking-[1.5px] text-white/40 hover:text-[#c8102e] transition-colors"
                >
                  Reset all
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
