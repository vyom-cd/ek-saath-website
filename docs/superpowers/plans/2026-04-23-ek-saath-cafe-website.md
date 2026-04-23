# Ek Saath Cafe Website — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Phase 1 single-page marketing website for Ek Saath Specialty Coffee & Pizzeria — warm editorial design, plain HTML/CSS/JS, deployed to Cloudflare Pages, converting local search traffic into walk-ins and WhatsApp orders.

**Architecture:** Zero-framework static site. One `index.html`, one `styles.css`, one `script.js`. Fonts from Google Fonts CDN. Icons inline SVG. Images locally-hosted WebP. Deploys as a flat folder to Cloudflare Pages. Design system drawn from `docs/superpowers/specs/2026-04-23-ek-saath-cafe-website-design.md`.

**Tech Stack:** HTML5 · CSS3 (custom properties, grid, flexbox, `clamp()`) · Vanilla JS · Google Fonts (Fraunces + Inter) · Lucide icons · Cloudflare Pages hosting.

**Testing philosophy:** This is a static marketing site, not a test-coverable codebase. "Verification" in each task means: (1) open the local file in a browser, (2) visually check the expected outcome, (3) check the browser devtools console for errors, (4) check at mobile (375px) AND desktop (1280px) widths. Automated lint only for HTML validity and basic a11y.

**Repository note:** The project folder (`C:\Users\VJ\Desktop\Office\website trial`) is not currently a git repo. Task 0 initializes it so every subsequent task ends in a clean commit — this is what makes the plan reversible.

---

## File Structure

```
ek-saath-website/
├── index.html              — single-page structure, all 7 sections
├── styles.css              — design tokens + all component styles
├── script.js               — nav scroll, menu tab filter, minor UX
├── README.md               — how to run locally, deploy, edit content
├── .gitignore              — standard node/editor ignores
├── _headers                — Cloudflare Pages security headers
├── _redirects              — (reserved, empty for v1)
└── assets/
    ├── logo.svg            — typographic wordmark (placeholder until real logo)
    ├── favicon.svg
    ├── hero.webp           — (placeholder until real photo)
    ├── story.webp
    ├── gallery/
    │   ├── 01.webp … 06.webp
    └── icons/              — any standalone icon files if needed
```

Each file has one job:
- `index.html` = semantic structure + content
- `styles.css` = all visual design
- `script.js` = minimal interactivity (nav compact, menu filter, smooth scroll polyfill)

No split into components because there's no framework and the whole site fits in one screen-worth of each file. Splitting prematurely would add load overhead.

---

## Content-placeholder strategy

Some real content (final logo, real photos, confirmed menu/prices) is not yet supplied by the owner. Rather than blocking the build, we use clearly-marked **placeholders** that make the swap trivial later:

- **Logo** → Fraunces italic wordmark "Ek Saath." Replaced by inserting `<img src="assets/logo.svg">` when real logo arrives.
- **Hero photo** → CSS-painted warm-gradient hero with subtle grain texture. Replaced by swapping one `<img>` element.
- **Gallery photos** → CSS-painted gradient blocks with labels ("Cafe interior", "Vietnamese cold brew", etc.). Replaced by swapping `src` attrs.
- **Menu items** → Pulled from public Zomato/Restaurant-Guru data we already have. Marked with a comment `<!-- MENU: pending owner confirmation -->`. Prices shown as `₹—` where not public.
- **About copy** → Drafted from public business facts, clearly bracketed with `<!-- COPY: draft, owner to confirm -->`.

Every placeholder has a `data-placeholder` attribute and an HTML comment so a simple grep finds them all: `grep -rn "placeholder\|PENDING\|pending owner" index.html`.

---

## Tasks

### Task 0: Initialize project scaffold

**Files:**
- Create: `.gitignore`
- Create: `README.md`
- Create: `assets/` (empty directory structure)
- Init: git repo in `C:\Users\VJ\Desktop\Office\website trial`

- [ ] **Step 1: Initialize git repo**

Run:
```bash
cd "C:/Users/VJ/Desktop/Office/website trial"
git init
git config user.email "info@calldental.ai"
git config user.name "Ek Saath Website"
```

Expected: `Initialized empty Git repository in .../website trial/.git/`

- [ ] **Step 2: Create `.gitignore`**

Write `C:\Users\VJ\Desktop\Office\website trial\.gitignore`:
```
# OS / editor
.DS_Store
Thumbs.db
*.swp
.idea/
.vscode/

# Build / deploy
node_modules/
dist/
.cache/
.wrangler/

# Env
.env
.env.local

# Superpowers brainstorm session artifacts (don't commit session state)
.superpowers/brainstorm/*/state/
.superpowers/brainstorm/*/content/
```

- [ ] **Step 3: Create `README.md`**

Write `C:\Users\VJ\Desktop\Office\website trial\README.md`:
```markdown
# Ek Saath Cafe — Website

Phase 1 marketing site for Ek Saath Specialty Coffee & Pizzeria, Bhilai.

## Run locally
```bash
# Any static server works. Using Python (comes pre-installed):
python -m http.server 8000
# Then open http://localhost:8000
```

## Edit content
- Text → `index.html`
- Styles → `styles.css`
- Interactivity → `script.js`
- Images → `assets/`

## Deploy
Cloudflare Pages — either `git push` to connected repo, or drag the folder
into https://dash.cloudflare.com/pages.

## Design system
See `docs/superpowers/specs/2026-04-23-ek-saath-cafe-website-design.md`.
```

- [ ] **Step 4: Create asset folders**

Run:
```bash
mkdir -p assets/gallery assets/icons
```

- [ ] **Step 5: First commit**

Run:
```bash
git add .gitignore README.md docs PROJECT.md
git commit -m "chore: initialize project scaffold"
```

Expected: commit succeeds with ~4 files tracked.

---

### Task 1: HTML skeleton — semantic structure for all 7 sections

**Files:**
- Create: `index.html`

- [ ] **Step 1: Write the full HTML skeleton**

Write `C:\Users\VJ\Desktop\Office\website trial\index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Ek Saath — Specialty Coffee & Pizzeria · Bhilai</title>
  <meta name="description" content="Multi-roaster specialty coffee and artisanal pizza in Bhilai. 100% vegetarian. Open 11 AM to midnight. Where friends meet and memories are made.">

  <!-- Open Graph -->
  <meta property="og:title" content="Ek Saath — Specialty Coffee & Pizzeria">
  <meta property="og:description" content="Multi-roaster coffee and artisanal pizza in Bhilai. 100% veg.">
  <meta property="og:type" content="website">
  <meta property="og:image" content="assets/hero.webp">

  <!-- Favicon -->
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">

  <!-- Fonts: preconnect then load -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="styles.css">
</head>
<body>

  <header class="nav" id="nav">
    <!-- Nav: filled in Task 3 -->
  </header>

  <main>
    <section class="hero" id="top">
      <!-- Hero: filled in Task 4 -->
    </section>

    <section class="story" id="story">
      <!-- Story: filled in Task 5 -->
    </section>

    <section class="menu" id="menu">
      <!-- Menu: filled in Task 6 -->
    </section>

    <section class="gallery" id="gallery">
      <!-- Gallery: filled in Task 7 -->
    </section>

    <section class="visit" id="visit">
      <!-- Visit: filled in Task 8 -->
    </section>
  </main>

  <footer class="footer">
    <!-- Footer: filled in Task 9 -->
  </footer>

  <script src="script.js" defer></script>
</body>
</html>
```

- [ ] **Step 2: Verify the file opens in a browser**

Run:
```bash
python -m http.server 8000 &
```

Open `http://localhost:8000` in a browser.
Expected: a blank white page with tab title "Ek Saath — Specialty Coffee & Pizzeria · Bhilai". No console errors (fonts + styles.css + script.js will 404 — that's okay for now).

- [ ] **Step 3: Commit**

Run:
```bash
git add index.html
git commit -m "feat: html skeleton with semantic sections"
```

---

### Task 2: CSS foundation — design tokens, base typography, reset

**Files:**
- Create: `styles.css`

- [ ] **Step 1: Write design tokens and base styles**

Write `C:\Users\VJ\Desktop\Office\website trial\styles.css`:

```css
/* ==========================================================================
   Ek Saath — Design tokens
   See docs/superpowers/specs/2026-04-23-ek-saath-cafe-website-design.md
   ========================================================================== */

:root {
  /* Palette — 60/30/8/2 */
  --cream: #f4ede0;
  --cream-soft: #fbf6ea;
  --espresso: #2b1e14;
  --espresso-soft: #3d2817;
  --terracotta: #8b5a3c;
  --terracotta-dark: #724629;
  --olive: #6b7a3e;
  --border: #e5dcc8;
  --muted: #6b5d4a;

  /* Fonts */
  --font-serif: 'Fraunces', Georgia, 'Times New Roman', serif;
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;

  /* Type scale (clamp = fluid responsive) */
  --text-hero: clamp(2.5rem, 2rem + 4vw, 5.5rem);
  --text-h2: clamp(1.75rem, 1.5rem + 1.5vw, 2.75rem);
  --text-h3: clamp(1.25rem, 1.1rem + 0.75vw, 1.75rem);
  --text-body: clamp(1rem, 0.95rem + 0.2vw, 1.125rem);
  --text-small: 0.875rem;
  --text-label: 0.75rem;

  /* Spacing (8px grid) */
  --space-1: 0.5rem;
  --space-2: 1rem;
  --space-3: 1.5rem;
  --space-4: 2rem;
  --space-5: 3rem;
  --space-6: 4rem;
  --space-section: clamp(4rem, 3rem + 4vw, 8rem);

  /* Effects */
  --radius-sm: 4px;
  --radius: 8px;
  --radius-lg: 16px;
  --shadow-sm: 0 1px 3px rgba(43, 30, 20, 0.08);
  --shadow: 0 4px 20px rgba(43, 30, 20, 0.1);

  /* Motion */
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
}

/* ==========================================================================
   Reset + base
   ========================================================================== */

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
}

body {
  background: var(--cream);
  color: var(--espresso);
  font-family: var(--font-sans);
  font-size: var(--text-body);
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

img, svg {
  display: block;
  max-width: 100%;
  height: auto;
}

a {
  color: var(--terracotta);
  text-decoration: none;
  transition: color var(--duration-fast);
}

a:hover {
  color: var(--terracotta-dark);
}

button {
  font: inherit;
  cursor: pointer;
  border: none;
  background: none;
}

/* ==========================================================================
   Layout helpers
   ========================================================================== */

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(1rem, 2vw + 0.5rem, 2rem);
}

.section {
  padding: var(--space-section) 0;
}

/* ==========================================================================
   Typography components
   ========================================================================== */

.label {
  font-family: var(--font-sans);
  font-size: var(--text-label);
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--terracotta);
  font-weight: 700;
}

.heading-serif {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 500;
  line-height: 1.05;
  color: var(--espresso);
}

/* ==========================================================================
   Button components
   ========================================================================== */

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: var(--radius-sm);
  font-family: var(--font-sans);
  font-size: 0.9375rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  transition: transform var(--duration-fast), background var(--duration-fast), color var(--duration-fast);
}

.btn:hover {
  transform: translateY(-1px);
}

.btn-primary {
  background: var(--terracotta);
  color: #fff;
}

.btn-primary:hover {
  background: var(--terracotta-dark);
  color: #fff;
}

.btn-ghost {
  background: transparent;
  color: var(--espresso);
  border: 1.5px solid var(--espresso);
}

.btn-ghost:hover {
  background: var(--espresso);
  color: var(--cream);
}

/* ==========================================================================
   Reduced motion
   ========================================================================== */

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* ==========================================================================
   Section-specific styles appended below in later tasks
   ========================================================================== */
```

- [ ] **Step 2: Verify in browser**

Reload `http://localhost:8000`.
Expected: page background is cream (#f4ede0). Font loads (check Network tab — `fonts.googleapis.com` returns 200). No console errors.

- [ ] **Step 3: Commit**

Run:
```bash
git add styles.css
git commit -m "feat: css design tokens and base styles"
```

---

### Task 3: Nav — sticky header with smooth-scroll links and WhatsApp CTA

**Files:**
- Modify: `index.html` (inside `<header class="nav" id="nav">`)
- Append to: `styles.css`

- [ ] **Step 1: Replace the nav placeholder in `index.html`**

Find `<!-- Nav: filled in Task 3 -->` and replace the whole `<header>` block with:

```html
<header class="nav" id="nav">
  <div class="container nav__inner">
    <a href="#top" class="nav__logo">
      <span class="nav__logo-mark">Ek Saath<span class="nav__logo-dot">.</span></span>
    </a>
    <nav class="nav__links" aria-label="Main navigation">
      <a href="#story">Story</a>
      <a href="#menu">Menu</a>
      <a href="#gallery">Gallery</a>
      <a href="#visit">Visit</a>
    </nav>
    <a class="btn btn-primary nav__cta" href="https://wa.me/918109800010?text=Hi%2C%20I%27d%20like%20to%20order">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.47-2.4-1.48-.89-.79-1.48-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.14-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35z"/><path d="M12 2C6.48 2 2 6.48 2 12c0 1.76.45 3.41 1.25 4.85L2 22l5.25-1.37A9.95 9.95 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.51 0-2.91-.4-4.13-1.1l-.3-.17-3.12.81.83-3.04-.2-.31A7.96 7.96 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z"/></svg>
      WhatsApp
    </a>
  </div>
</header>
```

- [ ] **Step 2: Append nav styles to `styles.css`**

Append to `styles.css`:

```css
/* ==========================================================================
   Nav
   ========================================================================== */

.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(244, 237, 224, 0.85);
  backdrop-filter: saturate(180%) blur(12px);
  -webkit-backdrop-filter: saturate(180%) blur(12px);
  border-bottom: 1px solid transparent;
  transition: padding var(--duration-normal), border-color var(--duration-normal);
}

.nav.is-compact {
  border-bottom-color: var(--border);
}

.nav__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: 1.25rem 0;
  transition: padding var(--duration-normal);
}

.nav.is-compact .nav__inner {
  padding: 0.75rem 0;
}

.nav__logo {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 600;
  font-size: 1.375rem;
  color: var(--espresso);
  letter-spacing: -0.01em;
}

.nav__logo:hover {
  color: var(--espresso);
}

.nav__logo-dot {
  color: var(--terracotta);
}

.nav__links {
  display: flex;
  gap: 1.75rem;
  font-size: 0.9375rem;
}

.nav__links a {
  color: var(--espresso);
  font-weight: 500;
  position: relative;
  padding-bottom: 2px;
}

.nav__links a::after {
  content: '';
  position: absolute;
  left: 0; bottom: 0;
  width: 0; height: 1.5px;
  background: var(--terracotta);
  transition: width var(--duration-normal) var(--ease-out-expo);
}

.nav__links a:hover::after { width: 100%; }

.nav__cta {
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
}

/* Mobile */
@media (max-width: 720px) {
  .nav__links { display: none; }
  .nav__logo { font-size: 1.125rem; }
  .nav__cta { padding: 0.5rem 0.875rem; }
}
```

- [ ] **Step 3: Verify in browser**

Reload the page. Expected:
- Sticky nav bar at top with cream background and subtle blur
- "Ek Saath." logo on the left, terracotta period
- 4 nav links in espresso (Story, Menu, Gallery, Visit)
- Terracotta "WhatsApp" button on the right with small SVG icon
- Clicking any link smooth-scrolls (to empty anchors — will show no effect yet, that's fine)
- On mobile (narrow the window to 375px), the middle links hide

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "feat: sticky nav with whatsapp cta"
```

---

### Task 4: Hero — italic headline, subhead, two CTAs, placeholder hero visual

**Files:**
- Modify: `index.html` (hero section)
- Append to: `styles.css`

- [ ] **Step 1: Replace hero placeholder**

Find `<!-- Hero: filled in Task 4 -->` and replace the whole hero section with:

```html
<section class="hero" id="top">
  <div class="container hero__inner">
    <div class="hero__text">
      <div class="label hero__label">
        Specialty Coffee · Pizzeria
        <span class="hero__veg">· 100% Veg <span class="hero__leaf" aria-hidden="true">🌿</span></span>
      </div>
      <h1 class="hero__title heading-serif">
        Where friends meet,<br>
        and memories are made.
      </h1>
      <p class="hero__sub">
        Multi-roaster coffee, hand-stretched pizzas, and a table that&rsquo;s always open.
        Open 11 AM to midnight. Bhilai, Chhattisgarh.
      </p>
      <div class="hero__ctas">
        <a class="btn btn-primary" href="https://wa.me/918109800010?text=Hi%2C%20I%27d%20like%20to%20order">Order on WhatsApp</a>
        <a class="btn btn-ghost" href="#menu">See the menu</a>
      </div>
    </div>

    <!-- Placeholder hero visual — replaced with real photo later -->
    <div class="hero__visual" data-placeholder="hero-photo" aria-hidden="true">
      <div class="hero__visual-inner">
        <div class="hero__visual-grain"></div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Append hero styles to `styles.css`**

Append:

```css
/* ==========================================================================
   Hero
   ========================================================================== */

.hero {
  padding: var(--space-6) 0 var(--space-section);
  overflow: hidden;
}

.hero__inner {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: clamp(2rem, 3vw, 5rem);
  align-items: center;
}

.hero__label {
  margin-bottom: var(--space-2);
}

.hero__veg {
  color: var(--olive);
  margin-left: 0.5rem;
}

.hero__leaf { filter: saturate(0.8); }

.hero__title {
  font-size: var(--text-hero);
  letter-spacing: -0.02em;
}

.hero__sub {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(1.125rem, 1rem + 0.5vw, 1.375rem);
  color: var(--espresso-soft);
  margin-top: var(--space-3);
  max-width: 34ch;
  line-height: 1.5;
}

.hero__ctas {
  display: flex;
  gap: var(--space-2);
  margin-top: var(--space-4);
  flex-wrap: wrap;
}

/* Placeholder hero visual — warm gradient + grain.
   Replaced by real photo: <img src="assets/hero.webp" alt="..." class="hero__photo"> */
.hero__visual {
  aspect-ratio: 4 / 5;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow);
  background:
    radial-gradient(ellipse at 30% 20%, #d6a574 0%, transparent 60%),
    radial-gradient(ellipse at 70% 80%, #8b5a3c 0%, transparent 55%),
    linear-gradient(135deg, #3d2817 0%, #2b1e14 100%);
  position: relative;
}

.hero__visual-inner {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 50%, transparent 0%, rgba(43, 30, 20, 0.3) 100%);
}

.hero__visual-grain {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.12'/></svg>");
  mix-blend-mode: overlay;
  pointer-events: none;
}

/* Mobile */
@media (max-width: 880px) {
  .hero__inner {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }
  .hero__visual {
    aspect-ratio: 3 / 2;
    max-height: 320px;
    order: -1;
  }
}
```

- [ ] **Step 3: Verify in browser**

Reload. Expected:
- Large italic Fraunces headline "Where friends meet, and memories are made." in espresso
- Terracotta uppercase label "SPECIALTY COFFEE · PIZZERIA · 100% VEG 🌿" above it (with olive-green "100% VEG")
- Italic subhead paragraph in espresso-soft
- Two buttons: terracotta "Order on WhatsApp" (primary), outlined "See the menu" (ghost)
- On the right: warm gradient hero visual with subtle grain
- On mobile (<880px), hero visual moves above text

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "feat: hero section with placeholder visual"
```

---

### Task 5: Story — two-column editorial section

**Files:**
- Modify: `index.html` (story section)
- Append to: `styles.css`

- [ ] **Step 1: Replace story placeholder**

Replace `<!-- Story: filled in Task 5 -->` section block with:

```html
<section class="story section" id="story">
  <div class="container story__inner">

    <div class="story__visual" data-placeholder="story-photo" aria-hidden="true"></div>

    <div class="story__text">
      <div class="label">The story</div>
      <h2 class="heading-serif story__title">
        Coffee, pizza, and a room full of regulars.
      </h2>

      <!-- COPY: draft, owner to confirm. Based on public info from Restaurant Guru + Instagram. -->
      <p>
        Ek Saath started in Bhilai with one idea &mdash; a place where families,
        students, and coffee people could all feel at home. We pull from
        multiple roasters because no single bean tells the whole story, and we
        stretch our own pizza dough because it&rsquo;s worth the time.
      </p>
      <p>
        We&rsquo;re pure vegetarian. Always. And we&rsquo;re open until midnight
        because the best conversations start late.
      </p>

      <div class="story__meta">
        <div>
          <div class="label">Signature</div>
          <div class="story__meta-value">Vietnamese cold brew</div>
        </div>
        <div>
          <div class="label">Locations</div>
          <div class="story__meta-value">Nehru Nagar · Aveer Arcade</div>
        </div>
        <div>
          <div class="label">Rating</div>
          <div class="story__meta-value">4.1 ★ &middot; 100+ reviews</div>
        </div>
      </div>
    </div>

  </div>
</section>
```

- [ ] **Step 2: Append story styles**

Append to `styles.css`:

```css
/* ==========================================================================
   Story
   ========================================================================== */

.story {
  background: var(--cream);
}

.story__inner {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: clamp(2rem, 4vw, 5rem);
  align-items: center;
}

.story__visual {
  aspect-ratio: 4 / 5;
  border-radius: var(--radius);
  background:
    linear-gradient(135deg, #c2a07a 0%, #8b5a3c 100%),
    radial-gradient(circle at 30% 30%, #e8cfa8 0%, transparent 50%);
  box-shadow: var(--shadow);
  position: relative;
  overflow: hidden;
}

.story__visual::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.1'/></svg>");
  mix-blend-mode: overlay;
}

.story__title {
  font-size: var(--text-h2);
  margin: var(--space-2) 0 var(--space-3);
}

.story p {
  color: var(--espresso-soft);
  margin-bottom: var(--space-2);
  max-width: 54ch;
}

.story__meta {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
  margin-top: var(--space-4);
  padding-top: var(--space-3);
  border-top: 1px solid var(--border);
}

.story__meta-value {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 1.0625rem;
  color: var(--espresso);
  margin-top: 0.25rem;
}

@media (max-width: 880px) {
  .story__inner { grid-template-columns: 1fr; }
  .story__visual { aspect-ratio: 16/10; max-height: 280px; }
  .story__meta { grid-template-columns: 1fr; gap: var(--space-2); }
}
```

- [ ] **Step 3: Verify**

Reload, scroll to story section. Expected:
- Two-column on desktop: warm-gradient placeholder visual on left, text on right
- "THE STORY" label, italic serif h2, two body paragraphs
- Three meta fields at the bottom (Signature, Locations, Rating) separated by a thin border
- On mobile, stacks vertically

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "feat: story section editorial layout"
```

---

### Task 6: Menu — tabbed filter with per-item WhatsApp order

**Files:**
- Modify: `index.html` (menu section)
- Append to: `styles.css`
- Create: `script.js`

- [ ] **Step 1: Replace menu placeholder**

Replace `<!-- Menu: filled in Task 6 -->` section with:

```html
<section class="menu section" id="menu">
  <div class="container">
    <div class="menu__header">
      <div class="label">The menu</div>
      <h2 class="heading-serif menu__title">Brewed, baked, and built to share.</h2>
      <p class="menu__note">
        Tap any item to order on WhatsApp.
        <span class="menu__pending" title="These items come from public sources — pending owner confirmation">
          Menu &amp; prices pending confirmation
        </span>
      </p>
    </div>

    <div class="menu__tabs" role="tablist">
      <button class="menu__tab is-active" role="tab" aria-selected="true" data-filter="coffee">Coffee</button>
      <button class="menu__tab" role="tab" aria-selected="false" data-filter="pizza">Pizza</button>
      <button class="menu__tab" role="tab" aria-selected="false" data-filter="pasta">Pasta</button>
      <button class="menu__tab" role="tab" aria-selected="false" data-filter="shakes">Shakes &amp; More</button>
    </div>

    <!-- MENU: pending owner confirmation. Items from public Zomato/Restaurant-Guru. Prices marked ₹— where not public. -->
    <div class="menu__list" id="menu-list">

      <!-- Coffee -->
      <article class="menu__item" data-category="coffee">
        <div class="menu__item-text">
          <h3>Vietnamese Cold Brew <span class="menu__badge">Signature</span></h3>
          <p>Strong, sweet, slow-steeped. Our house favourite.</p>
        </div>
        <div class="menu__item-actions">
          <span class="menu__price">₹—</span>
          <a class="menu__order" href="https://wa.me/918109800010?text=Hi%2C%20I%27d%20like%20to%20order%20a%20Vietnamese%20Cold%20Brew">Order</a>
        </div>
      </article>

      <article class="menu__item" data-category="coffee">
        <div class="menu__item-text">
          <h3>Iced Coffee</h3>
          <p>Chilled classic. Clean, cold, uncomplicated.</p>
        </div>
        <div class="menu__item-actions">
          <span class="menu__price">₹—</span>
          <a class="menu__order" href="https://wa.me/918109800010?text=Hi%2C%20I%27d%20like%20to%20order%20an%20Iced%20Coffee">Order</a>
        </div>
      </article>

      <article class="menu__item" data-category="coffee">
        <div class="menu__item-text">
          <h3>Cappuccino</h3>
          <p>Espresso, steamed milk, a thick foam cap.</p>
        </div>
        <div class="menu__item-actions">
          <span class="menu__price">₹—</span>
          <a class="menu__order" href="https://wa.me/918109800010?text=Hi%2C%20I%27d%20like%20to%20order%20a%20Cappuccino">Order</a>
        </div>
      </article>

      <article class="menu__item" data-category="coffee">
        <div class="menu__item-text">
          <h3>Latte</h3>
          <p>Smooth, milky, comforting.</p>
        </div>
        <div class="menu__item-actions">
          <span class="menu__price">₹—</span>
          <a class="menu__order" href="https://wa.me/918109800010?text=Hi%2C%20I%27d%20like%20to%20order%20a%20Latte">Order</a>
        </div>
      </article>

      <!-- Pizza -->
      <article class="menu__item" data-category="pizza" hidden>
        <div class="menu__item-text">
          <h3>Paneer Makhani Pizza <span class="menu__badge">Fan favourite</span></h3>
          <p>Rich makhani sauce, soft paneer, mozzarella on hand-stretched base.</p>
        </div>
        <div class="menu__item-actions">
          <span class="menu__price">₹—</span>
          <a class="menu__order" href="https://wa.me/918109800010?text=Hi%2C%20I%27d%20like%20to%20order%20a%20Paneer%20Makhani%20Pizza">Order</a>
        </div>
      </article>

      <article class="menu__item" data-category="pizza" hidden>
        <div class="menu__item-text">
          <h3>Margherita</h3>
          <p>Tomato, mozzarella, basil. The original test.</p>
        </div>
        <div class="menu__item-actions">
          <span class="menu__price">₹—</span>
          <a class="menu__order" href="https://wa.me/918109800010?text=Hi%2C%20I%27d%20like%20to%20order%20a%20Margherita%20Pizza">Order</a>
        </div>
      </article>

      <article class="menu__item" data-category="pizza" hidden>
        <div class="menu__item-text">
          <h3>Farmhouse</h3>
          <p>Onions, capsicum, tomato, corn, mozzarella.</p>
        </div>
        <div class="menu__item-actions">
          <span class="menu__price">₹—</span>
          <a class="menu__order" href="https://wa.me/918109800010?text=Hi%2C%20I%27d%20like%20to%20order%20a%20Farmhouse%20Pizza">Order</a>
        </div>
      </article>

      <!-- Pasta -->
      <article class="menu__item" data-category="pasta" hidden>
        <div class="menu__item-text">
          <h3>Spaghetti Arrabbiata</h3>
          <p>Spicy tomato, garlic, chilli, olive oil.</p>
        </div>
        <div class="menu__item-actions">
          <span class="menu__price">₹—</span>
          <a class="menu__order" href="https://wa.me/918109800010?text=Hi%2C%20I%27d%20like%20to%20order%20Spaghetti%20Arrabbiata">Order</a>
        </div>
      </article>

      <article class="menu__item" data-category="pasta" hidden>
        <div class="menu__item-text">
          <h3>Alfredo Pasta</h3>
          <p>Creamy white sauce, parmesan, cracked pepper.</p>
        </div>
        <div class="menu__item-actions">
          <span class="menu__price">₹—</span>
          <a class="menu__order" href="https://wa.me/918109800010?text=Hi%2C%20I%27d%20like%20to%20order%20Alfredo%20Pasta">Order</a>
        </div>
      </article>

      <!-- Shakes -->
      <article class="menu__item" data-category="shakes" hidden>
        <div class="menu__item-text">
          <h3>Oreo Thick Shake</h3>
          <p>Spoon-required thick. Blended cookies, vanilla ice cream.</p>
        </div>
        <div class="menu__item-actions">
          <span class="menu__price">₹—</span>
          <a class="menu__order" href="https://wa.me/918109800010?text=Hi%2C%20I%27d%20like%20to%20order%20an%20Oreo%20Thick%20Shake">Order</a>
        </div>
      </article>

      <article class="menu__item" data-category="shakes" hidden>
        <div class="menu__item-text">
          <h3>Chocolate Shake</h3>
          <p>Deep, rich, cold. The safe order that never fails.</p>
        </div>
        <div class="menu__item-actions">
          <span class="menu__price">₹—</span>
          <a class="menu__order" href="https://wa.me/918109800010?text=Hi%2C%20I%27d%20like%20to%20order%20a%20Chocolate%20Shake">Order</a>
        </div>
      </article>

    </div>
  </div>
</section>
```

- [ ] **Step 2: Append menu styles to `styles.css`**

```css
/* ==========================================================================
   Menu
   ========================================================================== */

.menu { background: var(--cream-soft); }

.menu__header { max-width: 48rem; margin-bottom: var(--space-5); }

.menu__title {
  font-size: var(--text-h2);
  margin: var(--space-2) 0 var(--space-2);
}

.menu__note {
  color: var(--muted);
  font-size: var(--text-small);
}

.menu__pending {
  display: inline-block;
  margin-left: 0.5rem;
  padding: 2px 10px;
  background: #fef3c7;
  color: #78350f;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: help;
}

.menu__tabs {
  display: flex;
  gap: 0.25rem;
  margin-bottom: var(--space-4);
  border-bottom: 1px solid var(--border);
  overflow-x: auto;
  scrollbar-width: none;
}
.menu__tabs::-webkit-scrollbar { display: none; }

.menu__tab {
  padding: 0.875rem 1.25rem;
  font-family: var(--font-sans);
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--muted);
  border-bottom: 2px solid transparent;
  white-space: nowrap;
  transition: color var(--duration-fast), border-color var(--duration-fast);
}

.menu__tab:hover { color: var(--espresso); }

.menu__tab.is-active {
  color: var(--espresso);
  font-weight: 600;
  border-bottom-color: var(--terracotta);
}

.menu__list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-3);
}

.menu__item {
  display: flex;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-3);
  background: #fff;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  transition: transform var(--duration-fast), box-shadow var(--duration-fast);
}

.menu__item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.menu__item h3 {
  font-family: var(--font-serif);
  font-weight: 600;
  font-size: 1.125rem;
  color: var(--espresso);
  margin-bottom: 0.25rem;
}

.menu__item p {
  font-size: 0.875rem;
  color: var(--muted);
  line-height: 1.5;
}

.menu__badge {
  display: inline-block;
  margin-left: 0.5rem;
  padding: 1px 8px;
  background: var(--olive);
  color: #fff;
  font-family: var(--font-sans);
  font-style: normal;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  border-radius: 999px;
  vertical-align: middle;
}

.menu__item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  min-width: 70px;
}

.menu__price {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 1.125rem;
  color: var(--espresso);
}

.menu__order {
  padding: 0.375rem 0.875rem;
  background: var(--terracotta);
  color: #fff;
  border-radius: var(--radius-sm);
  font-size: 0.8125rem;
  font-weight: 600;
}

.menu__order:hover {
  background: var(--terracotta-dark);
  color: #fff;
}
```

- [ ] **Step 3: Create `script.js` with tab filter logic**

Write `C:\Users\VJ\Desktop\Office\website trial\script.js`:

```javascript
/* Ek Saath — minimal interactivity
   - Sticky nav compacts on scroll
   - Menu tab filter
   - Smooth scroll already handled by CSS (scroll-behavior: smooth) */

(function () {
  'use strict';

  // ===== Nav compact on scroll =====
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 24) nav.classList.add('is-compact');
      else nav.classList.remove('is-compact');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ===== Menu tab filter =====
  const tabs = document.querySelectorAll('.menu__tab');
  const items = document.querySelectorAll('.menu__item');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const filter = tab.dataset.filter;

      tabs.forEach((t) => {
        t.classList.toggle('is-active', t === tab);
        t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
      });

      items.forEach((item) => {
        const matches = item.dataset.category === filter;
        if (matches) item.removeAttribute('hidden');
        else item.setAttribute('hidden', '');
      });
    });
  });
})();
```

- [ ] **Step 4: Verify**

Reload. Scroll to Menu section. Expected:
- "THE MENU" label, h2, note with pending-pill
- Four tabs: Coffee (active), Pizza, Pasta, Shakes & More
- Grid of 4 coffee items showing. Each has name, description, "₹—" price, and terracotta "Order" button
- Click Pizza tab → 3 pizza items show, coffee items hide, active underline moves
- Click "Order" on any item → opens WhatsApp with pre-filled message ("Hi, I'd like to order a Cappuccino")
- Scroll page → nav compacts (less padding, border appears)

- [ ] **Step 5: Commit**

```bash
git add index.html styles.css script.js
git commit -m "feat: menu section with tab filter and whatsapp orders"
```

---

### Task 7: Gallery — responsive photo grid with placeholders

**Files:**
- Modify: `index.html` (gallery section)
- Append to: `styles.css`

- [ ] **Step 1: Replace gallery placeholder**

```html
<section class="gallery section" id="gallery">
  <div class="container">
    <div class="gallery__header">
      <div class="label">The room</div>
      <h2 class="heading-serif gallery__title">A few looks at the place.</h2>
    </div>

    <div class="gallery__grid">
      <div class="gallery__item gallery__item--tall" data-placeholder="gallery-1" aria-label="Cafe interior"><span>Cafe interior</span></div>
      <div class="gallery__item" data-placeholder="gallery-2" aria-label="Vietnamese cold brew"><span>Cold brew</span></div>
      <div class="gallery__item" data-placeholder="gallery-3" aria-label="Pizza on the pass"><span>Pizza on the pass</span></div>
      <div class="gallery__item gallery__item--wide" data-placeholder="gallery-4" aria-label="Friends at a table"><span>Friends at a table</span></div>
      <div class="gallery__item" data-placeholder="gallery-5" aria-label="Latte art"><span>Latte art</span></div>
      <div class="gallery__item" data-placeholder="gallery-6" aria-label="Evening ambience"><span>Evening ambience</span></div>
    </div>

    <div class="gallery__footer">
      <p>More on Instagram.</p>
      <a class="btn btn-ghost" href="https://instagram.com/eksaathindia" target="_blank" rel="noopener">@eksaathindia →</a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Append gallery styles**

```css
/* ==========================================================================
   Gallery
   ========================================================================== */

.gallery { background: var(--cream); }

.gallery__header { max-width: 48rem; margin-bottom: var(--space-4); }
.gallery__title { font-size: var(--text-h2); margin-top: var(--space-2); }

.gallery__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 180px;
  gap: var(--space-2);
}

.gallery__item {
  border-radius: var(--radius);
  background: linear-gradient(135deg, #d6c9b0, #8b5a3c);
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;
  transition: transform var(--duration-normal) var(--ease-out-expo);
  display: flex;
  align-items: flex-end;
  padding: var(--space-2);
  color: rgba(255,255,255,0.85);
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 0.9375rem;
}

.gallery__item:hover { transform: scale(1.02); }

.gallery__item--tall { grid-row: span 2; background: linear-gradient(160deg, #3d2817, #8b5a3c); }
.gallery__item--wide { grid-column: span 2; background: linear-gradient(90deg, #8b5a3c, #c2a07a); }

.gallery__item::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 30%, transparent 40%, rgba(43,30,20,0.35) 100%);
}

.gallery__item span { position: relative; z-index: 1; }

.gallery__footer {
  margin-top: var(--space-4);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.gallery__footer p {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 1.25rem;
  color: var(--espresso);
}

@media (max-width: 720px) {
  .gallery__grid { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 140px; }
  .gallery__item--wide { grid-column: span 2; }
}
```

- [ ] **Step 3: Verify**

Reload, scroll to Gallery. Expected:
- 3-column grid with 6 warm-gradient blocks at varying sizes (one tall, one wide)
- Each shows a small italic label in the bottom-left ("Cafe interior", "Cold brew", etc.)
- Hover scales blocks subtly
- Footer row: italic text "More on Instagram." and outlined button "@eksaathindia →"
- Clicking the Instagram button opens instagram.com/eksaathindia in a new tab
- On mobile, grid collapses to 2 columns, wide item still spans full width

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "feat: gallery grid with placeholder tiles"
```

---

### Task 8: Visit — address, hours, tap-to-call, map

**Files:**
- Modify: `index.html` (visit section)
- Append to: `styles.css`

- [ ] **Step 1: Replace visit placeholder**

```html
<section class="visit section" id="visit">
  <div class="container visit__inner">

    <div class="visit__info">
      <div class="label">Visit us</div>
      <h2 class="heading-serif visit__title">Come hang.</h2>

      <div class="visit__block">
        <div class="label">Address</div>
        <p>
          1/36, Nehru Nagar,<br>
          Bhilai Sector 7, Bhilai,<br>
          Chhattisgarh &mdash; 490006
        </p>
      </div>

      <div class="visit__block">
        <div class="label">Hours</div>
        <p>Every day &middot; 11:00 AM &ndash; 11:59 PM</p>
      </div>

      <div class="visit__block">
        <div class="label">Call us</div>
        <p><a href="tel:+918109800010" class="visit__phone">+91 81098 00010</a></p>
      </div>

      <div class="visit__ctas">
        <a class="btn btn-primary" href="https://wa.me/918109800010?text=Hi%2C%20I%27d%20like%20to%20order">Order on WhatsApp</a>
        <a class="btn btn-ghost" href="https://www.google.com/maps/search/?api=1&query=Ek+Saath+Specialty+Coffee+Pizzeria+Nehru+Nagar+Bhilai" target="_blank" rel="noopener">Open in Google Maps</a>
      </div>
    </div>

    <div class="visit__map">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.0!2d81.379!3d21.198!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sEk+Saath+Specialty+Coffee+and+Pizzeria!5e0!3m2!1sen!2sin!4v1714000000"
        width="100%"
        height="100%"
        style="border:0"
        allowfullscreen=""
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        title="Ek Saath on Google Maps">
      </iframe>
    </div>

  </div>
</section>
```

- [ ] **Step 2: Append visit styles**

```css
/* ==========================================================================
   Visit
   ========================================================================== */

.visit { background: var(--cream-soft); }

.visit__inner {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: clamp(2rem, 4vw, 5rem);
  align-items: start;
}

.visit__title {
  font-size: var(--text-h2);
  margin: var(--space-2) 0 var(--space-3);
}

.visit__block { margin-bottom: var(--space-3); }
.visit__block p {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 1.125rem;
  color: var(--espresso);
  margin-top: 0.25rem;
}

.visit__phone {
  color: var(--terracotta);
  font-weight: 600;
  font-style: italic;
}

.visit__phone:hover { color: var(--terracotta-dark); }

.visit__ctas {
  display: flex;
  gap: var(--space-2);
  margin-top: var(--space-3);
  flex-wrap: wrap;
}

.visit__map {
  aspect-ratio: 1 / 1.1;
  max-height: 520px;
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
  background: #e0e0d8;
}

@media (max-width: 880px) {
  .visit__inner { grid-template-columns: 1fr; }
  .visit__map { aspect-ratio: 4/3; max-height: none; }
}
```

- [ ] **Step 3: Verify**

Reload, scroll to Visit. Expected:
- Two-column layout: info left, map right
- "VISIT US" label, italic h2 "Come hang."
- Three info blocks with labels and italic values
- Phone number is terracotta-italic, clickable (on desktop, hover cursor; on mobile, tapping launches dialer)
- Two CTAs side-by-side
- Google Map iframe on the right showing Bhilai area (may show approximate location; owner can fine-tune later)
- On mobile, stacks vertically

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "feat: visit section with map and tap-to-call"
```

---

### Task 9: Footer — dark espresso section, Instagram link, copyright

**Files:**
- Modify: `index.html` (footer)
- Append to: `styles.css`

- [ ] **Step 1: Replace footer placeholder**

```html
<footer class="footer">
  <div class="container footer__inner">

    <div class="footer__brand">
      <div class="footer__logo">Ek Saath<span class="footer__dot">.</span></div>
      <p class="footer__tag">Where friends meet,<br>and memories are made.</p>
    </div>

    <div class="footer__cols">
      <div class="footer__col">
        <div class="footer__label">Visit</div>
        <p>Nehru Nagar, Sector 7<br>Bhilai 490006</p>
      </div>
      <div class="footer__col">
        <div class="footer__label">Hours</div>
        <p>Every day<br>11 AM &ndash; 11:59 PM</p>
      </div>
      <div class="footer__col">
        <div class="footer__label">Follow</div>
        <p>
          <a href="https://instagram.com/eksaathindia" target="_blank" rel="noopener">@eksaathindia</a><br>
          <a href="tel:+918109800010">+91 81098 00010</a>
        </p>
      </div>
    </div>

  </div>

  <div class="footer__bottom">
    <div class="container footer__bottom-inner">
      <span>&copy; 2026 Ek Saath Specialty Coffee &amp; Pizzeria&reg;</span>
      <span class="footer__small">Pure veg &middot; Bhilai, India</span>
    </div>
  </div>
</footer>
```

- [ ] **Step 2: Append footer styles**

```css
/* ==========================================================================
   Footer — the one dark moment
   ========================================================================== */

.footer {
  background: var(--espresso);
  color: var(--cream);
  padding-top: var(--space-6);
}

.footer__inner {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: clamp(2rem, 4vw, 5rem);
  padding-bottom: var(--space-5);
}

.footer__logo {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 600;
  font-size: 2rem;
  color: var(--cream);
  letter-spacing: -0.01em;
}

.footer__dot { color: var(--terracotta); }

.footer__tag {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 1.125rem;
  color: var(--cream);
  opacity: 0.75;
  margin-top: var(--space-2);
  line-height: 1.4;
}

.footer__cols {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
}

.footer__label {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--terracotta);
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.footer__col p {
  color: var(--cream);
  opacity: 0.85;
  line-height: 1.6;
  font-size: 0.9375rem;
}

.footer__col a {
  color: var(--cream);
  border-bottom: 1px solid rgba(244, 237, 224, 0.3);
  transition: border-color var(--duration-fast);
}

.footer__col a:hover { border-bottom-color: var(--terracotta); color: var(--cream); }

.footer__bottom {
  border-top: 1px solid rgba(244, 237, 224, 0.1);
  padding: var(--space-2) 0;
}

.footer__bottom-inner {
  display: flex;
  justify-content: space-between;
  gap: var(--space-2);
  flex-wrap: wrap;
  font-size: 0.8125rem;
  color: rgba(244, 237, 224, 0.6);
}

@media (max-width: 720px) {
  .footer__inner { grid-template-columns: 1fr; }
  .footer__cols { grid-template-columns: 1fr 1fr; gap: var(--space-3); }
}
```

- [ ] **Step 3: Verify**

Reload, scroll to bottom. Expected:
- Dark espresso-colored footer
- Left: "Ek Saath." wordmark with terracotta period, italic tagline
- Right: three labeled columns (Visit, Hours, Follow) with cream-on-espresso text
- Underlined links for Instagram and phone
- Thin divider, then bottom row with copyright and "Pure veg · Bhilai, India"
- On mobile, brand on top, cols 2×2, bottom row stacks

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "feat: footer dark espresso section"
```

---

### Task 10: Favicon and logo wordmark SVG

**Files:**
- Create: `assets/favicon.svg`
- Create: `assets/logo.svg` (future use — for when real logo comes)

- [ ] **Step 1: Create favicon.svg**

Write `C:\Users\VJ\Desktop\Office\website trial\assets\favicon.svg`:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#f4ede0" rx="10"/>
  <text x="32" y="46" text-anchor="middle"
        font-family="Georgia, serif"
        font-style="italic"
        font-weight="600"
        font-size="44"
        fill="#2b1e14">E</text>
  <circle cx="52" cy="48" r="3" fill="#8b5a3c"/>
</svg>
```

- [ ] **Step 2: Verify**

Reload the page. Expected:
- Tab icon shows a cream square with italic "E" and a small terracotta dot
- No 404 in the Network tab for favicon.svg

- [ ] **Step 3: Commit**

```bash
git add assets/favicon.svg
git commit -m "feat: favicon wordmark"
```

---

### Task 11: Cloudflare Pages headers and config

**Files:**
- Create: `_headers`
- Create: `_redirects`

- [ ] **Step 1: Create `_headers` for security headers**

Write `C:\Users\VJ\Desktop\Office\website trial\_headers`:

```
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains

/*.html
  Cache-Control: public, max-age=300, must-revalidate

/*.css
  Cache-Control: public, max-age=31536000, immutable

/*.js
  Cache-Control: public, max-age=31536000, immutable

/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

- [ ] **Step 2: Create empty `_redirects` (reserved)**

Write `C:\Users\VJ\Desktop\Office\website trial\_redirects`:

```
# Reserved for future use — e.g., /order → WhatsApp deep link, /menu.pdf → asset
```

- [ ] **Step 3: Commit**

```bash
git add _headers _redirects
git commit -m "feat: cloudflare pages headers and redirects"
```

---

### Task 12: Responsive polish + accessibility sweep

**Files:**
- Modify: `styles.css`, `index.html` (small tweaks)

- [ ] **Step 1: Test at all key breakpoints**

Open devtools, test these widths:
- 375px (iPhone SE)
- 414px (iPhone Plus)
- 768px (tablet)
- 1024px (laptop)
- 1440px (desktop)

For each, scroll the whole page and verify:
- No horizontal scrollbar
- Text is readable (not overflowing containers)
- Images/visuals are not squished
- Nav works
- Menu tabs scroll horizontally on mobile if overflow
- CTAs are tappable (44×44 min target)

Fix any issues by adjusting styles. Log fixes as comments in `styles.css`.

- [ ] **Step 2: Add `:focus-visible` states**

Append to `styles.css`:

```css
/* ==========================================================================
   Focus states
   ========================================================================== */

*:focus-visible {
  outline: 2px solid var(--terracotta);
  outline-offset: 3px;
  border-radius: 2px;
}

.btn:focus-visible { outline-offset: 4px; }

a:focus-visible { outline-offset: 4px; }
```

- [ ] **Step 3: Add skip-to-content link**

In `index.html`, as the very first child of `<body>`:

```html
<a href="#top" class="skip-link">Skip to main content</a>
```

Append to `styles.css`:

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 1rem;
  padding: 0.5rem 1rem;
  background: var(--espresso);
  color: var(--cream);
  font-size: 0.875rem;
  border-radius: var(--radius-sm);
  z-index: 200;
  transition: top var(--duration-fast);
}

.skip-link:focus {
  top: 1rem;
  color: var(--cream);
}
```

- [ ] **Step 4: Keyboard navigation test**

Press Tab from the page load. Verify:
- Skip link appears and is focusable first
- Then nav logo, nav links, nav CTA
- Then hero CTAs
- Then menu tabs, menu order buttons
- Then gallery Instagram link
- Then visit CTAs and phone
- Every focused element has a visible terracotta outline

- [ ] **Step 5: Commit**

```bash
git add index.html styles.css
git commit -m "a11y: focus states, skip link, responsive polish"
```

---

### Task 13: Deploy to Cloudflare Pages

**Files:** none modified — this is a deploy step.

- [ ] **Step 1: Prepare deploy folder**

Confirm the project folder contains:
- `index.html`
- `styles.css`
- `script.js`
- `assets/favicon.svg`
- `_headers`
- `_redirects`
- `README.md`

Run:
```bash
ls -la
```

Expected: all files listed, nothing extra.

- [ ] **Step 2: Push to GitHub (if using git-based deploy)**

If the user wants git-based auto-deploy:

```bash
# Create a GitHub repo in the browser first: github.com/new
# Name it e.g. "ek-saath-website", make it public or private
# Copy the remote URL it gives you

git remote add origin https://github.com/<user>/ek-saath-website.git
git branch -M main
git push -u origin main
```

Then in Cloudflare Pages dashboard:
1. Open `dash.cloudflare.com/pages`
2. Click "Create a project" → "Connect to Git"
3. Authorize GitHub, pick the `ek-saath-website` repo
4. Build settings: **Build command = (empty)**. **Output directory = `/`** (root — no build step)
5. Click "Save and Deploy"
6. Wait ~1 min. Get a URL like `ek-saath-website.pages.dev`.

OR, Step 2-alt: **Direct upload** (no git required):

1. Open `dash.cloudflare.com/pages`
2. Click "Create a project" → "Upload assets"
3. Drag the entire project folder (or a zip of it) into the uploader
4. Project name: `eksaath`
5. Click "Deploy Site"
6. Get URL `eksaath.pages.dev`

- [ ] **Step 3: Verify live site**

Open the Cloudflare URL. Expected:
- Site loads in < 2s
- All sections visible
- WhatsApp button works (on a mobile device ideally)
- Map loads
- Check devtools Lighthouse → Performance > 90, Accessibility > 95, SEO > 95

- [ ] **Step 4: Tag the release**

```bash
git tag -a v1.0-phase1 -m "Phase 1: marketing site launched"
git push origin v1.0-phase1
```

- [ ] **Step 5: Update PROJECT.md with deploy info**

Edit `PROJECT.md`, append a "Deploy" section:

```markdown
## Deploy

- **Live:** https://eksaath.pages.dev
- **Deployed:** 2026-04-XX
- **Version:** v1.0-phase1
- **Host:** Cloudflare Pages
- **Auto-deploy:** yes (on push to `main`) — OR — manual direct upload
```

Commit:
```bash
git add PROJECT.md
git commit -m "docs: phase 1 deploy info"
```

---

### Task 14: Owner handoff — content swap guide

**Files:**
- Create: `HANDOFF.md`

- [ ] **Step 1: Write handoff guide**

Write `C:\Users\VJ\Desktop\Office\website trial\HANDOFF.md`:

````markdown
# Ek Saath Website — Owner Handoff

## What's live
Your Phase 1 site is live at **https://eksaath.pages.dev**.

It has placeholder content in a few spots that you should swap for real content.

## How to swap placeholders

### Find all placeholders
```bash
grep -n "placeholder\|pending owner\|COPY: draft\|MENU: pending" index.html
```

### 1. Hero photo
Current: CSS-painted warm gradient.
Replace: put a real photo at `assets/hero.webp` (ratio 4:5, ideally under 150KB), then in `index.html` find:
```html
<div class="hero__visual" data-placeholder="hero-photo" aria-hidden="true">
  <div class="hero__visual-inner">
    <div class="hero__visual-grain"></div>
  </div>
</div>
```
Replace with:
```html
<img class="hero__visual hero__photo" src="assets/hero.webp" alt="Ek Saath cafe interior" fetchpriority="high">
```

### 2. Story photo
Same pattern, replace `.story__visual` block with `<img src="assets/story.webp" alt="...">`.

### 3. Gallery photos
Replace each `.gallery__item` placeholder with `<img src="assets/gallery/0N.webp" alt="...">`.

### 4. Menu items & prices
In `index.html`, find the comment `<!-- MENU: pending owner confirmation -->`. Each `<article class="menu__item">` has:
- `<h3>` = item name
- `<p>` = description
- `<span class="menu__price">` = currently `₹—`; replace with real price
- The WhatsApp `href` includes the item name — update if you change the name.

### 5. Story copy
Find `<!-- COPY: draft, owner to confirm -->` and edit the two paragraphs as you like.

### 6. Logo
If you have an SVG or PNG logo:
- Put it at `assets/logo.svg`
- In `index.html` find the nav logo `<span class="nav__logo-mark">...` and replace with `<img src="assets/logo.svg" alt="Ek Saath" class="nav__logo-img">`
- Add CSS: `.nav__logo-img { height: 32px; width: auto; }`

## How to deploy changes

### If using git
```bash
git add .
git commit -m "content: swap real photos"
git push
```
Cloudflare auto-deploys in ~30 seconds.

### If using direct upload
Open `dash.cloudflare.com/pages`, find the project, click "Create deployment", drag the folder.

## Editing without anything technical
You can open `index.html` in Notepad, Ctrl+F to find text, edit, save, and re-upload. No command line needed.

## Questions?
See the design spec at `docs/superpowers/specs/2026-04-23-ek-saath-cafe-website-design.md`.
````

- [ ] **Step 2: Commit**

```bash
git add HANDOFF.md
git commit -m "docs: owner handoff guide"
```

---

## Self-review results

**Spec coverage check:**
- ✅ Section 3 (Goals): covered by Tasks 4, 6, 8 (WhatsApp CTAs everywhere)
- ✅ Section 4.1 (Palette): Task 2 defines all four as CSS variables
- ✅ Section 4.2 (Typography): Task 2 loads Fraunces + Inter; Task 4 uses italic hero style
- ✅ Section 4.3 (Design principles): semantic HTML throughout, cream-dominant, dark only in footer (Task 9), CTAs all terracotta, `prefers-reduced-motion` handled in Task 2
- ✅ Section 5 (Architecture, 7 sections): Tasks 3–9 each implement one section in order
- ✅ Section 6 (Tech stack): plain HTML/CSS/JS from Task 1 on; no build step; fonts via CDN
- ✅ Section 7 (Hosting): Task 11 sets up CF headers; Task 13 deploys
- ✅ Section 8 (Performance): `defer` on script, `loading="lazy"` on map iframe, `font-display: swap`, `fetchpriority="high"` in HANDOFF for hero
- ✅ Section 9 (Content placeholders): explicit placeholder strategy section + Task 14 handoff
- ✅ Section 11 (Risks): menu edit path, WhatsApp link format, map embed lazy-load — all addressed
- ✅ Task 12 covers a11y (focus, skip link, reduced motion)

**Placeholder scan:** no "TBD" / "implement later" / "similar to Task N" in actual task steps. Content placeholders (menu items, photos) are INTENTIONAL and have a defined swap process in Task 14.

**Type consistency:** class names, section IDs, and data attributes are consistent across tasks (e.g., `.menu__tab`, `.menu__item`, `data-filter`, `data-category`).

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-23-ek-saath-cafe-website.md`.

Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration. Best if you want to just watch it happen and approve tasks as they complete.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints. Best if you want to stay in the conversation as it builds.

**Which approach?**
