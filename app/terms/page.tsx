"use client";

import React from 'react';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-[#f5f5f5] py-16">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs tracking-[3px] text-[#c5a46e] mb-4">
            LEGAL
          </div>
          <h1 className="text-5xl font-semibold tracking-[-2px]">Terms of Service</h1>
          <p className="mt-2 text-white/60">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-white/80">
          <section>
            <h2 className="text-[#c5a46e] text-2xl font-semibold tracking-tight mb-3">Acceptance of Terms</h2>
            <p>By accessing or using MarvelVerse Timeline ("the Site"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Site.</p>
          </section>

          <section>
            <h2 className="text-[#c5a46e] text-2xl font-semibold tracking-tight mb-3">Intellectual Property</h2>
            <p>The Site is a fan-made, unofficial project. All Marvel characters, films, logos, and related intellectual property are owned by Marvel Entertainment, LLC and The Walt Disney Company. This Site does not claim ownership of any Marvel IP and exists solely for referential and entertainment purposes.</p>
          </section>

          <section>
            <h2 className="text-[#c5a46e] text-2xl font-semibold tracking-tight mb-3">User Conduct</h2>
            <p>You agree not to use the Site for any unlawful purpose or in a way that could damage, disable, or impair the Site or interfere with any other party's use.</p>
          </section>

          <section>
            <h2 className="text-[#c5a46e] text-2xl font-semibold tracking-tight mb-3">Disclaimer of Warranties</h2>
            <p>The Site is provided "as is" without warranties of any kind. We make no guarantees regarding accuracy, completeness, or availability of information.</p>
          </section>

          <section>
            <h2 className="text-[#c5a46e] text-2xl font-semibold tracking-tight mb-3">Limitation of Liability</h2>
            <p>In no event shall the creators of MarvelVerse Timeline be liable for any indirect, incidental, or consequential damages arising from your use of the Site.</p>
          </section>

          <section>
            <h2 className="text-[#c5a46e] text-2xl font-semibold tracking-tight mb-3">Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Continued use of the Site after changes constitutes acceptance of the new terms.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
