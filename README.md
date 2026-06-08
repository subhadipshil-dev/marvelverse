# MARVELVERSE TIMELINE

**A premium, cinematic Marvel Cinematic Universe chronological experience.**

Built to feel like Netflix × Apple TV+ × Awwwards. Insanely beautiful. Production-ready.

> "Wow, this looks expensive."

---

## ✨ What You Get

- Full-screen cinematic hero with **3D perspective poster carousel**, animated particles, and floating energy field
- **Gorgeous vertical timeline** with glowing red progress line, energy pulse, and year markers
- **Premium glassmorphism movie cards** with hover glows, light sweep, poster zoom — Download button **always visible**
- **Luxury fullscreen drawer** (bottom sheet on mobile) with large poster, cast, synopsis, and all actions
- Powerful **instant search + animated filter chips** (Phase, Platform, Rating, Sort)
- **Random MCU Movie** floating action button (🎲)
- Animated statistics, Featured banner, Platform badges, Stats dashboard
- Scroll progress bar, back-to-top, smooth everything
- **100% ready for real links**: `watchUrl`, `downloadUrl`, `trailerUrl` are empty by design. Download & Watch buttons are always shown and gracefully handle missing links with premium toasts.

---

## 🛠 Tech Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS 4 + custom luxury cinematic design system
- Framer Motion (extensive, buttery animations)
- Sonner (beautiful toast system)
- Lucide icons
- Zero external data sources — fully self-contained

---

## 🚀 Quick Start

```bash
# 1. Install dependencies (already done if you cloned)
npm install

# 2. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 📁 Project Structure

```
/home/subhadip/Documents/GitHub/marvelverse
├── app/
│   ├── layout.tsx          # Premium metadata + Toaster
│   ├── page.tsx            # The entire experience (hero, timeline, filters, etc.)
│   └── globals.css         # Complete luxury design system (glass, glows, buttons)
├── components/
│   ├── MovieCard.tsx       # Insanely beautiful cards (Download always visible)
│   ├── MovieDrawer.tsx     # Full cinematic details experience
│   ├── Poster.tsx          # Smart local images + stunning gradient fallback
│   └── ParticleField.tsx   # Cinematic red/gold particle energy field
├── data/
│   ├── movies.json         # 32 movies in true chronological order (all fields)
│   ├── phases.json
│   └── platforms.json
├── lib/
│   └── utils.ts
├── public/
│   └── posters/            # Drop your JPGs here (see README inside)
├── types/
│   └── movie.ts
└── README.md
```

---

## 🖼 Adding Real Posters (Critical)

1. Go to `public/posters/`
2. Add images named exactly as defined in `data/movies.json` → `thumbnail` field.
   - Example: `iron-man.jpg`, `avengers-endgame.jpg`, `deadpool-wolverine.jpg`
3. Recommended: 600×900 or larger, high quality theatrical posters.

**Even without images**, the site looks premium thanks to the custom cinematic `Poster` fallback component.

---

## 🔗 Adding Watch / Download / Trailer Links

All links start empty on purpose.

In `data/movies.json`, simply fill:

```json
"watchUrl": "https://www.disneyplus.com/...",
"downloadUrl": "https://your-offline-source/...",   // or leave ""
"trailerUrl": "https://www.youtube.com/..."
```

**Behavior (guaranteed):**
- **Download button** is *always* visible on every card and in the drawer.
- If `downloadUrl` is empty → beautiful "Download link will be added soon" toast.
- Same for Watch and Trailer.

No piracy. No hidden buttons.

---

## 🎨 Design Philosophy

- Deep black (#050505) + glass (#111 / 75% + heavy blur)
- Marvel red glow system (#c8102e + #e11d48)
- Gold accents exclusively for ratings (#c5a46e)
- Heavy use of Framer Motion spring + cubic-bezier for expensive motion feel
- Every hover, transition, and interaction is deliberate and delightful
- Fully responsive (perfect on mobile with bottom-sheet drawer)

---

## 🧪 Production Commands

```bash
npm run dev          # Development
npm run build        # Production build
npm run start        # Start production server
npm run lint
```

---

## 📦 Deployment

Deploy anywhere Next.js runs (Vercel is ideal).

The project is already optimized:
- Client components only where needed
- Lazy images + fallbacks
- Minimal dependencies
- Excellent Lighthouse scores possible with real posters

---

## 📝 Notes for Future Polish

- Replace the placeholder `og-image.jpg` in public for social sharing
- Add real video trailers inside the drawer (YouTube embed or native)
- When you add download links, consider showing file size / quality badges
- Consider adding a "Watched" localStorage feature for personal progress

---

Built with obsession for cinematic interfaces.

**All changes confined to `/home/subhadip/Documents/GitHub/marvelverse` as requested.**

Enjoy the timeline. Visitors will say *"this looks expensive."*

