# EA STUDIO — landing page

Vite + React + TypeScript, plain CSS. English only, LTR. Runtime dependencies: React, Lenis (smooth scroll) and anime.js (hero entrance and scroll reveals, in `src/lib.tsx`). Hover and state effects stay in CSS.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
```

## Where things live
- `src/content.ts` — all copy, project data, contact links, image metadata. Edit text here.
- `src/tokens.css` — palette, type scale, spacing, motion tokens. Every text/background pair is >= 4.5:1 (large text >= 3:1).
- `src/styles.css` — layout. Breakpoints: 768 (tablet), 1024 (desktop nav + 12-column layouts), 1280/1440 (wider margins).
- `src/sections.tsx` — Header, Hero, Work, Nava, Approach, Services, Studio, Contact, Footer.
- `public/images` — source JPEGs exported from the old Framer site, plus generated `-480/-800/-1200/-1800` AVIF and WebP variants. After adding or replacing a JPG run `npm run images` (all images, a few minutes) or `npm run images -- portrait` (just that one, seconds); it regenerates the variants and `src/images.json`. Commit the output.

## Open items for the owner
- Replace placeholder contact data in `src/content.ts` (`contact`): phone, email, Instagram.
- Swap the Framer-exported images for original high-resolution photos; add a photo of the finished Nava House and a vector ground-floor plan to turn the drawings step into an SVG line-drawing animation.
- Add an absolute `og:image` in `index.html` once the production URL is known.
- Confirm what "Development" means in Services, and the studio tagline.
