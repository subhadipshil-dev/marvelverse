"use client";

import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-[#f5f5f5] py-16">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs tracking-[3px] text-[#c5a46e] mb-4">
            LEGAL
          </div>
          <h1 className="text-5xl font-semibold tracking-[-2px]">Privacy Policy</h1>
          <p className="mt-2 text-white/60">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-white/80">
          <section>
            <h2 className="text-[#c5a46e] text-2xl font-semibold tracking-tight mb-3">Information We Collect</h2>
            <p>MarvelVerse Timeline is a static reference site. We do not collect personal information from visitors. We may use basic analytics (via Vercel or similar) to understand traffic patterns. No cookies are used for tracking or advertising purposes beyond what is necessary for core functionality.</p>
          </section>

          <section>
            <h2 className="text-[#c5a46e] text-2xl font-semibold tracking-tight mb-3">Third-Party Services</h2>
            <p>This site uses Google AdSense to display advertisements. Google may use cookies and web beacons to serve ads based on your prior visits to this and other websites. You can opt out of personalized advertising by visiting Google's Ads Settings.</p>
          </section>

          <section>
            <h2 className="text-[#c5a46e] text-2xl font-semibold tracking-tight mb-3">Data Security</h2>
            <p>We take reasonable measures to protect any information processed through the site. Since we do not store user data, risk is minimal.</p>
          </section>

          <section>
            <h2 className="text-[#c5a46e] text-2xl font-semibold tracking-tight mb-3">Your Rights</h2>
            <p>You may request information about any data we hold (though we hold none personally identifiable). Contact us via the Contact page.</p>
          </section>

          <section>
            <h2 className="text-[#c5a46e] text-2xl font-semibold tracking-tight mb-3">Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
