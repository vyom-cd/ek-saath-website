# Ek Saath Cafe — Website Design Spec

**Date:** 2026-04-23
**Owner:** info@calldental.ai
**Status:** Draft for user review

---

## 1. Project

A **Phase 1 marketing website** for **Ek Saath Specialty Coffee & Pizzeria®**, a 100% vegetarian specialty-coffee-and-pizza cafe in Bhilai, Chhattisgarh. The goal is to convert local search traffic into walk-ins, WhatsApp orders, and calls.

Out of scope for Phase 1: shopping cart, payment gateway, order dashboard, inventory. These are explicitly deferred to Phase 2 if/when Phase 1 validates demand.

## 2. Business context (from public research)

- **Official name:** Ek Saath Specialty Coffee & Pizzeria® (trademarked)
- **Tagline:** "Where friends meet, and memories are made." (spotted on Instagram reel)
- **Positioning:** Multi-roaster specialty coffee + artisanal pizza, 100% vegetarian
- **Locations:** Two — Nehru Nagar West (Sector 7) + Aveer Arcade, Nehru Nagar East (v1 focuses on one; second can be added later)
- **Primary address:** 1/36, Nehru Nagar, Bhilai Sector 7, Bhilai – 490006
- **Phone:** +91 81098 00010
- **Hours:** 11:00 AM – 11:59 PM, Mon–Sun
- **Instagram:** [@eksaathindia](https://instagram.com/eksaathindia) (3,400+ followers)
- **Third-party presence:** Zomato, Swiggy, Justdial, Snapchat, Restaurant Guru (4.1/5, 104+ reviews, #6 of 208 coffeehouses in Durg)
- **Audience:** Families + students (dual-use hangout); late-night crowd (open to midnight)
- **Menu highlights:** Vietnamese cold brew (signature), iced coffee, paneer makhani pizza, artisanal pizzas, spaghetti pasta, thick shakes
- **Price range:** ₹200-400 per person

## 3. Goals (what the site is for)

Primary (in priority order):
1. **Walk-ins** — anyone Googling "cafe in Bhilai" or "coffee near me" lands here and decides to visit
2. **WhatsApp orders / calls** — pre-filled WhatsApp message and tap-to-call CTAs drive direct orders
3. **Brand** — the feel of the site matches the feel of the cafe (warm, editorial, specialty coffee credibility, community warmth)

Non-goals:
- Online cart / payments (Phase 2)
- Email signups / newsletter (Phase 2)
- Blog / events calendar (Phase 2)

## 4. Design direction — "Editorial Warm"

### 4.1 Palette (60 / 30 / 8 / 2 ratio)

| Role | Name | Hex | Usage |
|------|------|------|-------|
| **60% — Dominant** | Cream | `#f4ede0` | All section backgrounds |
| **30% — Secondary** | Espresso | `#2b1e14` | Body text, headlines, one dark section (footer) |
| **8% — Accent** | Terracotta | `#8b5a3c` | CTAs, links, section labels, hover states |
| **2% — Spice** | Olive | `#6b7a3e` | "100% Veg" leaf icon, small tags |

### 4.2 Typography

- **Headlines:** [Fraunces](https://fonts.google.com/specimen/Fraunces) (warm editorial serif, strong italic). Loaded via Google Fonts CDN.
- **Body:** [Inter](https://fonts.google.com/specimen/Inter) (clean neutral sans). Loaded via Google Fonts CDN.
- **Scale (clamp-based for responsive):**
  - Hero: clamp(2.5rem, 2rem + 6vw, 5.5rem), italic
  - H2: clamp(1.75rem, 1.5rem + 2vw, 2.75rem)
  - H3: clamp(1.25rem, 1.1rem + 1vw, 1.75rem)
  - Body: clamp(1rem, 0.95rem + 0.25vw, 1.125rem)
  - Labels: 0.75rem, uppercase, 3px letter-spacing

### 4.3 Design principles

- **Semantic HTML first** — `<header>`, `<main>`, `<section>`, `<footer>`, proper headings
- **Cream dominates; dark sections are rare** — power comes from scarcity
- **CTAs are always terracotta** — trains the eye; consistent across the site
- **Photography is warm and natural-light** — no harsh flash; close-ups of food/coffee
- **Animation is compositor-friendly** — only `transform`, `opacity`, `filter`
- **Mobile-first** — designed for 375px width first, scaled up

## 5. Site architecture

**Structure:** single-page long scroll. Smooth-scroll navigation anchors to section IDs.

### Section flow (top to bottom)

| # | Section | Contents | Notes |
|---|---------|----------|-------|
| 1 | **Nav** | Logo left · links (Menu, Story, Visit) · WhatsApp pill right | Sticky on scroll; cream bg with subtle shadow |
| 2 | **Hero** | Hero photo (or hero illustration) · italic serif headline "Where friends meet, and memories are made." · subhead · two CTAs ("Order on WhatsApp", "See the menu") | Full viewport minus nav |
| 3 | **Story** | 2-paragraph about section — multi-roaster focus, pure veg, Bhilai roots. One portrait or cafe photo. | Editorial two-column layout on desktop |
| 4 | **Menu** | Tabbed or pill-filtered list: Coffee · Pizza · Pasta · Shakes · More. Each item has name, short description, price, and a per-item "Order" button that opens WhatsApp with the item pre-filled. | Accordion on mobile, grid on desktop |
| 5 | **Gallery** | 4–8 photos of cafe interior, coffee pours, pizzas. Optional Instagram embed at bottom. | Masonry or grid |
| 6 | **Visit** | Address · hours · phone (tap-to-call) · embedded Google Map | Two-column on desktop, stacked on mobile |
| 7 | **Footer** | Dark espresso background. Logo, Instagram link, copyright, small "made with care" line. | The only dark section on the page |

### Interactive behaviors

- Smooth-scroll nav links
- Sticky nav that compacts after ~100px scroll
- Menu filter/tab switching (JS toggle of visibility classes)
- Per-item WhatsApp deep link: `https://wa.me/918109800010?text=Hi%2C%20I%27d%20like%20to%20order%20${encodeURIComponent(itemName)}`
- Tap-to-call link: `tel:+918109800010`
- Map link opens Google Maps app on mobile
- `prefers-reduced-motion` respected — all animations disabled if set

## 6. Tech stack

- **Plain HTML + CSS + vanilla JS** — no framework, no build step
- **Fonts:** Fraunces + Inter via Google Fonts CDN (preconnect + `font-display: swap`)
- **Icons:** Lucide inline SVG (free, small)
- **Images:** WebP with JPEG fallback. Hero preloaded with `fetchpriority="high"`. Below-the-fold `loading="lazy"`.
- **JS scope:** < 2KB total — nav compaction on scroll, menu tab filter, smooth scroll polyfill if needed

### Project structure

```
ek-saath-website/
├── index.html
├── styles.css
├── script.js
├── assets/
│   ├── hero.webp
│   ├── story.webp
│   ├── gallery/
│   │   ├── 01.webp
│   │   ├── 02.webp
│   │   └── ...
│   └── logo.svg
└── README.md
```

## 7. Hosting & deployment

- **Host:** Cloudflare Pages (free tier)
- **Region:** CF edge — fastest in India (Mumbai + Delhi POPs)
- **Deploy:** either (a) GitHub-connected auto-deploy on push, or (b) direct upload from dashboard. Decision deferred to deploy time.
- **v1 URL:** `eksaath.pages.dev` (free subdomain)
- **Custom domain:** optional Phase 1.5 — register one if/when user confirms (~₹700-900/year on Namecheap/GoDaddy)
- **HTTPS:** automatic via Cloudflare
- **Headers config:** `_headers` file for CSP, HSTS, X-Content-Type-Options

## 8. Performance targets

- **LCP:** < 2.5s
- **CLS:** < 0.1
- **INP:** < 200ms
- **Total bundle:** < 100KB gzipped (HTML + CSS + JS, not counting images)
- **Images:** compressed WebP; hero < 150KB

## 9. Content still needed from user

Hard blockers for ship:
1. **Final confirmation of content** — is the menu listing from public sources (Zomato) accurate and current?
2. **Photos** — at least 1 hero photo and 4+ cafe/food photos. If unavailable, we source from Instagram with permission.
3. **About copy** — 2 paragraphs on the cafe's story. Can be drafted by us based on public info, then approved by owner.
4. **Logo file** — if one exists. If not, we'll use a typographic wordmark (Fraunces italic "Ek Saath").

Nice-to-haves:
- Menu PDF (definitive version)
- Owner quote for "Story" section
- Reviews from Google/Zomato to quote on site

## 10. Content not needed yet (Phase 2)

- Shopping cart / checkout
- Razorpay or any payment gateway
- Order management dashboard
- Email signup
- Blog / events
- Second-location pages

## 11. Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Menu/prices change often, site goes stale | Simple structure; owner can edit `index.html` directly in Notepad, or we document the edit process |
| No real photos available | Stage a basic photoshoot with phone camera, or pull from Instagram with permission; have 1 illustrated fallback for hero |
| WhatsApp link format differs on iOS vs Android | Use `wa.me/` format — works universally |
| Google Maps embed slow on mobile | Use static map image as placeholder; load iframe on user interaction |
| User doesn't have GitHub account for Cloudflare git deploy | Cloudflare Pages direct upload works without git |

## 12. Milestones (rough)

1. **Content gather** — photos + menu confirmation (1-2 days, user-driven)
2. **Build v1** — HTML/CSS/JS for all 7 sections (2-3 days)
3. **Design review** — visual QA on desktop + mobile, polish pass
4. **Deploy to Cloudflare Pages** — (30 mins)
5. **Stakeholder review** — owner reviews staged URL
6. **Revise + launch** — fixes based on feedback, point custom domain if owned

---

*This spec is the source of truth for Phase 1. Updates go here first, then propagate to `PROJECT.md`.*
