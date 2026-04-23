# Ek Saath Website — Owner Handoff

## What's built
A local Phase 1 site for Ek Saath Specialty Coffee & Pizzeria. It runs on your machine now — we haven't deployed it to the public internet yet.

## Run it locally
```bash
cd "C:/Users/VJ/Desktop/Office/website trial"
python -m http.server 8000
# Open http://localhost:8000
```

Stop the server with Ctrl+C.

## Placeholders you should swap

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
Same pattern — replace `.story__visual` block with `<img src="assets/story.webp" alt="...">`.

### 3. Gallery photos
Replace each `.gallery__item` placeholder with `<img src="assets/gallery/0N.webp" alt="...">`.

### 4. Menu items & prices
In `index.html`, find the comment `<!-- MENU: pending owner confirmation -->`. Each `<article class="menu__item">` has:
- `<h3>` = item name
- `<p>` = description
- `<span class="menu__price">` = currently `₹—`; replace with real price
- The WhatsApp `href` includes the item name — update if you change the name.

Also remove the yellow "pending confirmation" pill inside `.menu__pending` once confirmed.

### 5. Story copy
Find `<!-- COPY: draft, owner to confirm -->` and edit the two paragraphs as you like.

### 6. Logo
If you have an SVG or PNG logo:
- Put it at `assets/logo.svg`
- In `index.html` find `<span class="nav__logo-mark">...` and replace with `<img src="assets/logo.svg" alt="Ek Saath" class="nav__logo-img">`
- Add CSS: `.nav__logo-img { height: 32px; width: auto; }`

### 7. Google Map embed
The current map URL is a generic placeholder (shows blank gray box).
To fix:
1. Go to [Google Maps](https://maps.google.com)
2. Search for your cafe, click the result
3. Click "Share" → "Embed a map" → copy the HTML `<iframe src="...">` URL
4. In `index.html`, find the `.visit__map` iframe and paste the new `src=`

## When ready to go live
Come back to me and say "let's deploy" — we'll push to Cloudflare Pages (free, drag-drop or git-based, your choice).

## Design reference
Source of truth: `docs/superpowers/specs/2026-04-23-ek-saath-cafe-website-design.md`
Build plan: `docs/superpowers/plans/2026-04-23-ek-saath-cafe-website.md`
Running project overview: `PROJECT.md`
