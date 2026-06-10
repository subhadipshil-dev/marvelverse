"use client";

import React from 'react';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-[#f5f5f5] py-16">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <img src="/favicon.ico" alt="MarvelVerse Logo" className="h-12 w-12 rounded-xl" />
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs tracking-[3px] text-[#c5a46e] mb-4">
            GET IN TOUCH
          </div>
          <h1 className="text-5xl font-semibold tracking-[-2px] mb-4">Contact Us</h1>
          <p className="text-xl text-white/70">We'd love to hear from fellow MCU fans.</p>
        </div>

        <div className="glass-strong rounded-3xl p-10 border border-white/10">
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Thank you! This is a demo form.'); }}>
            <div>
              <label className="block text-sm text-white/60 mb-2">Your Name</label>
              <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#c8102e]/50" placeholder="Jane Doe" required />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Email Address</label>
              <input type="email" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#c8102e]/50" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Message</label>
              <textarea rows={6} className="w-full bg-white/5 border border-white/10 rounded-3xl px-5 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-[#c8102e]/50 resize-y" placeholder="How can we help you with the MCU Timeline?" required />
            </div>
            <button type="submit" className="w-full py-4 rounded-2xl bg-[#c8102e] hover:bg-[#e11d48] font-semibold tracking-wide text-white transition-colors">
              SEND MESSAGE
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-white/50">
            For business inquiries or licensing, please reach out via the form above. We typically respond within 48 hours.
          </p>
        </div>
      </div>
    </main>
  );
}
