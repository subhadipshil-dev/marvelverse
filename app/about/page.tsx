"use client";

import React from 'react';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-[#f5f5f5] py-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Hero Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs tracking-[3px] text-[#c5a46e] mb-4">
            ABOUT THE PROJECT
          </div>
          <h1 className="text-5xl font-semibold tracking-[-2px] mb-4">About MarvelVerse Timeline</h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            A premium, fan-crafted experience celebrating the Marvel Cinematic Universe in perfect chronological order.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          <section className="glass-strong rounded-3xl p-8 border border-white/10">
            <h2 className="text-2xl font-semibold tracking-tight mb-4 text-[#c5a46e]">Our Mission</h2>
            <p className="text-white/80 leading-relaxed">
              MarvelVerse Timeline is an independent, unofficial reference guide designed to help fans explore the MCU in the order the stories unfold within the universe. We believe the best way to experience these interconnected films is through their in-universe chronology.
            </p>
          </section>

          <section className="glass-strong rounded-3xl p-8 border border-white/10">
            <h2 className="text-2xl font-semibold tracking-tight mb-4 text-[#c5a46e]">What We Offer</h2>
            <ul className="space-y-3 text-white/80">
              <li className="flex gap-3"><span className="text-[#c8102e]">•</span> Accurate chronological ordering of all major MCU films</li>
              <li className="flex gap-3"><span className="text-[#c8102e]">•</span> Detailed metadata including IMDb ratings, runtimes, and platforms</li>
              <li className="flex gap-3"><span className="text-[#c8102e]">•</span> Beautiful, cinematic interface inspired by premium streaming platforms</li>
              <li className="flex gap-3"><span className="text-[#c8102e]">•</span> Easy discovery of where to watch each title</li>
            </ul>
          </section>

          <section className="glass-strong rounded-3xl p-8 border border-white/10">
            <h2 className="text-2xl font-semibold tracking-tight mb-4 text-[#c5a46e]">Important Notice</h2>
            <p className="text-white/80 leading-relaxed">
              This is a fan-made project created out of love for the MCU. It is not affiliated with, endorsed by, or sponsored by Marvel Studios, Marvel Entertainment, or The Walt Disney Company. All trademarks, characters, and related imagery remain the property of their respective owners.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
