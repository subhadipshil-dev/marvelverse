import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MARVELVERSE TIMELINE | Ultimate MCU Chronology & Watch Guide",
  description: "Experience the Marvel Cinematic Universe in perfect chronological order. Premium timeline, stunning visuals, and the definitive MCU watch guide.",
  metadataBase: new URL("https://marvelverse-sd.vercel.app"),
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "MARVELVERSE TIMELINE",
    description: "The ultimate premium MCU chronological experience. Explore every film in timeline order with cinematic design.",
    images: [{ url: "/og-image.jpg" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://marvelverse-sd.vercel.app',
  },
  verification: {
    // Google AdSense client verification via script below; add google-site-verification meta here if you have a verification code from Google Search Console
  },
  other: {
    // AdSense specific if needed
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#050505] text-[#f5f5f5]">
        {children}
        <Script
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3996858089273040"
          crossOrigin="anonymous"
        />
        <Toaster 
          position="top-center" 
          richColors 
          closeButton 
          className="font-sans" 
          toastOptions={{
            style: {
              background: '#111111',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#f5f5f5',
            }
          }}
        />
      </body>
    </html>
  );
}
