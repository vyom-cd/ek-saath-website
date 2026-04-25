# Ek Saath Cafe — Website

> **📄 Design spec (APPROVED ✅ 2026-04-23):** [`docs/superpowers/specs/2026-04-23-ek-saath-cafe-website-design.md`](docs/superpowers/specs/2026-04-23-ek-saath-cafe-website-design.md)
> **📋 Build plan:** ✅ executed — [`docs/superpowers/plans/2026-04-23-ek-saath-cafe-website.md`](docs/superpowers/plans/2026-04-23-ek-saath-cafe-website.md)
> **📘 Owner handoff:** ✅ [`HANDOFF.md`](HANDOFF.md)
> **🌐 Status:** Live on Vercel — repo `vyom-cd/ek-saath-website`, auto-deploys from `main`.
> This PROJECT.md is the living overview. The spec above is the source of truth for the build.

A website for **Ek Saath Cafe**, located in Bhilai, Chhattisgarh.

> Status: **Brainstorming phase** — gathering requirements before any code.

---

## Goal
**Phase 1:** gorgeous storefront + brand story + scroll-friendly menu + WhatsApp ordering button. Mobile-first, fast, SEO-ready.

**Phase 2 (later, only if Phase 1 validates demand):** real cart + Razorpay + order dashboard.

## What we know so far

### Identity
- **Official name:** Ek Saath Specialty Coffee & Pizzeria® (trademarked)
- **Tagline seen on reel:** "Where friends meet and memories are made"
- **Positioning:** Multi-roaster specialty coffee + artisanal pizza
- **Type:** Pure vegetarian (vegan options too)
- **Vibe described by reviewers:** Minimalist aesthetic, cozy, warm, community cafe
- **Partner mentioned:** Indus People (Facebook collaboration post)
- **Related handle found:** [@eksaathfoundation](https://instagram.com/eksaathfoundation) — "The Earth Foundation" (social cause — worth confirming if linked to the cafe)

### Locations (TWO — this is important)
1. **Nehru Nagar West:** 1/36, Nehru Nagar, Bhilai Sector 7, Bhilai — 490006
2. **Aveer Arcade, Nehru Nagar East, Bhilai**

### Contact
- Phone: **+91 81098 00010**
- Hours: **11:00 AM – 11:59 PM**, Mon–Sun
- Instagram: **[@eksaathindia](https://instagram.com/eksaathindia)** (3,400+ followers) — NOT @eksaathindia as initially given; please confirm
- Also listed on: Zomato, Swiggy, Justdial, Snapchat, Restaurant Guru

### Menu highlights (from public sources)
- **Coffee:** Vietnamese cold brew (signature), iced coffee, standard espresso lineup
- **Food:** Artisanal pizzas (paneer makhani pizza is the star), spaghetti pasta in various sauces, thick shakes, sandwiches
- **Price range:** ₹200–400 per person
- **Rating:** 4.1/5 (104+ reviews), #6 of 208 coffeehouses in Durg

### Audience
- Family + students (dual-use hangout)
- Open late (till midnight) suggests evening/late-night crowd is key

## Open questions
1. ~~Primary purpose~~ ✅ Phase 1 storefront
2. ~~Cafe identity~~ ✅ coffee-forward + artisanal pizza, pure veg, family + students
3. **Instagram handle confirmation** — @eksaathindia (what I found) vs @eksaathindia (what you said). Which is correct?
4. **One site for BOTH locations, or just one?** Site structure changes based on this.
5. Visual direction / mood — coming up next via browser
6. Page structure — single long landing page vs 3–4 pages (About, Menu, Locations, Contact)
7. Languages — English only, or Hindi + English?
8. Technical — domain owned? hosting preference? who will maintain?

## Decisions made
- **2026-04-23** — Scope: Phase 1 (storefront + brand + menu + WhatsApp ordering). Full e-commerce deferred to Phase 2.
- **2026-04-23** — Audience: dual — family AND students.
- **2026-04-23** — Focus: coffee-forward + artisanal pizza.
- **2026-04-23** — 100% vegetarian cafe (core brand pillar).
- **2026-04-23** — Research: Pulled real data from Google, Zomato, Restaurant Guru, Instagram search. Confirmed real business with 2 locations, 4.1 rating, established on delivery platforms.
- **2026-04-23** — Instagram confirmed: @eksaathindia (3,400+ followers).
- **2026-04-23** — v1 scope limited to ONE location (main — Nehru Nagar Sector 7). Second location optional future addition.

## Design system (locked)

**Direction:** Editorial Warm — magazine feel, coffee-zine confidence.

**Palette (60 / 30 / 8 / 2):**
| Role | Color | Hex |
|---|---|---|
| Dominant (backgrounds) | Cream | `#f4ede0` |
| Secondary (text, dark sections) | Espresso | `#2b1e14` |
| Accent (CTAs, labels, links) | Terracotta | `#8b5a3c` |
| Spice (veg touch, small details) | Olive | `#6b7a3e` |

**Typography (planned):**
- Headlines: **Fraunces** (warm editorial serif, italic variant) — Google Fonts
- Body: **Inter** (clean neutral sans) — Google Fonts

## Architecture

- **Structure:** Single-page long scroll (locked 2026-04-23)
- **Sections (in order):** Nav → Hero → Story → Menu → Gallery → Visit → Footer
- **Tech stack:** Plain HTML + CSS + vanilla JS (no framework, no build step)
  - Fonts: Fraunces + Inter via Google Fonts CDN
  - Icons: Lucide inline SVG
- **Hosting:** Cloudflare Pages (free, fastest in India). Deploy via git push OR direct upload — choose at deploy time.
- **Domain:** _TBD — to confirm._ Default for v1: free `eksaath.pages.dev` subdomain. Custom domain (~₹700-900/year) optional.

## Timeline / next step
Site is live and iterating on content + engagement. Auto-deploys from GitHub `main` to Vercel. No active blockers.

## Recent changes

- **2026-04-25** — **Three Picks now rotate daily.** Page promised "come tomorrow, it'll be three others" but the picks were hardcoded. Wired up deterministic daily rotation in `script.js`: pool of 12 side picks + 4 features, day-of-year selects which 3 show. All visitors today see the same 3; tomorrow it cycles. Cache bumped to `script.js?v=31`.
- **2026-04-25** — Menu item thumbnails enlarged 64 → 110 px (88/72 px responsive). `styles.css?v=30`.
- **2026-04-25** — Brewing-methods cards unified to dark espresso gradient (matching Vietnamese Cold Brew feature). Added looping pour-over video to section header.
- **2026-04-25** — Menu section recolored to chocolate-brown background with cards in dark espresso; mood picker reverted to transparent with amber accent text for readability.
- **2026-04-25** — Engagement components added: scroll-progress bar, mobile drawer, animated stats counters, testimonials carousel, mood picker, lightbox, rotating pull-quote, parallax + tilt.
- **2026-04-25** — Roaster flip-cards now show photo on the front face (4 bean-journey photos: subko, blue-tokai, roastery, third-wave).
- **2026-04-24** — All 42 menu photos re-fetched from Pexels via search (zero duplicates, all veg-correct).
- **2026-04-24** — Deployed to Vercel via GitHub repo `vyom-cd/ek-saath-website`. `vercel.json` headers fixed (path-based, not regex extensions).

---

_This file is kept updated as the project evolves — decisions, palette, stack, and progress all land here._
