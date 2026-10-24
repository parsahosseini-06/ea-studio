# EA STUDIO — landing page

Vite + React + TypeScript, plain CSS. English only, LTR. No runtime dependencies besides React.

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
- `public/images` — JPEGs exported from the old Framer site (see below).

## Open items for the owner
- Replace placeholder contact data in `src/content.ts` (`contact`): phone, email, Instagram.
- Daroos metadata was a copy of Dezashib on the Framer site; set the real area, years and team (`projects`).
- Swap the Framer-exported images for original high-resolution photos; add a photo of the finished Nava House and a vector ground-floor plan to turn the drawings step into an SVG line-drawing animation.
- Add an absolute `og:image` in `index.html` once the production URL is known.
- Confirm what "Development" means in Services, and the studio tagline.
