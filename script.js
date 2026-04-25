/* Ek Saath — interactivity
   - Sticky nav compacts on scroll
   - Menu tab filter
   - Scroll-reveal animation
   - Active section indicator in nav
   - "Open now" chip (based on 11 AM – 11:59 PM hours, every day) */

(function () {
  'use strict';

  // Mark JS ready — CSS uses this to gate reveal animations
  // so no-JS users see content rendered (not invisible).
  document.body.classList.add('js-ready');

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

  // ===== Scroll reveal =====
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });

    reveals.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: show all immediately
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  // ===== Active section indicator =====
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav__links a[data-section]');

  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle('is-active', link.dataset.section === id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

    sections.forEach((s) => sectionObserver.observe(s));
  }

  // ===== Open now chip — three states: open, closing soon, closed =====
  // Hours: every day, 11:00 - 23:59
  const openNow = document.getElementById('open-now');
  if (openNow) {
    const now = new Date();
    const hour = now.getHours();
    const min = now.getMinutes();
    const isOpen = (hour >= 11 && hour < 23) || (hour === 23 && min < 59);

    openNow.hidden = false;
    const text = openNow.querySelector('.open-now__text');
    const dot = openNow.querySelector('.open-now__dot');

    if (isOpen) {
      // Within open hours
      const minsUntilClose = (23 - hour) * 60 + (59 - min);
      if (minsUntilClose < 60) {
        // Last hour
        text.textContent = `Closing soon · ${minsUntilClose}m left`;
        openNow.classList.add('is-closing');
      } else {
        text.textContent = 'Open now · Till midnight';
        openNow.classList.add('is-open');
      }
    } else {
      // Closed — show when we open next
      const nextOpenHour = (hour < 11) ? 11 : 11; // always 11 AM next day
      const isMorning = hour < 11;
      text.textContent = isMorning
        ? `Closed · Opens ${nextOpenHour} AM`
        : `Closed · Opens 11 AM tomorrow`;
      openNow.classList.add('is-closed');
    }
  }

  // ===== Roaster flip cards — tap to flip on touch devices =====
  const roasters = document.querySelectorAll('.roaster');
  roasters.forEach((card) => {
    card.addEventListener('click', (e) => {
      // Only toggle on touch / no-hover devices; mouse users get hover
      const hasHover = window.matchMedia('(hover: hover)').matches;
      if (!hasHover) {
        e.preventDefault();
        card.classList.toggle('is-flipped');
      }
    });
    // Keyboard: Enter / Space toggles flip
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('is-flipped');
      }
    });
  });

  // ===== Hero carousel (Component 9) =====
  const carousel = document.getElementById('hero-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.hero__photo');
    const dots = carousel.querySelectorAll('.hero__dot');
    const arrows = carousel.querySelectorAll('.hero__arrow');
    let idx = 0;
    let timer;

    const goTo = (n) => {
      idx = (n + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle('is-active', i === idx));
      // Reset active dot to restart progress animation
      dots.forEach((d, i) => {
        d.classList.remove('is-active');
        if (i === idx) {
          // Force reflow then add class — resets the CSS animation
          void d.offsetWidth;
          d.classList.add('is-active');
        }
      });
    };

    const startAuto = () => {
      stopAuto();
      timer = setInterval(() => goTo(idx + 1), 3000);
    };
    const stopAuto = () => { if (timer) clearInterval(timer); };

    dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); stopAuto(); startAuto(); }));
    arrows.forEach((a) => a.addEventListener('click', () => {
      goTo(idx + parseInt(a.dataset.dir, 10));
      stopAuto(); startAuto();
    }));

    // Respect reduced motion
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) startAuto();
  }

  // ===== Today's three picks — rotate daily =====
  // Deterministic by date so all visitors today see the same 3,
  // and tomorrow they see different 3.
  const SIDE_PICKS = [
    { name: 'Matcha Latte', origin: 'Kyoto, Japan', desc: 'Ceremonial-grade matcha whisked into warm milk. Grassy, smooth, quietly energising.', photo: 'assets/gallery/05-latte.jpg', alt: 'Matcha latte with art in a ceramic cup', tags: ['Smooth','Grassy'] },
    { name: 'Hazelnut Latte', origin: 'House favourite', desc: 'Espresso, steamed milk, slow-stirred hazelnut. Comfort in a cup.', photo: 'assets/menu/hazelnut-latte.jpg', alt: 'Hazelnut latte with foam art', tags: ['Nutty','Warm'] },
    { name: 'Cortado', origin: 'From Spain', desc: 'Equal parts espresso and warm milk. Bold, balanced, no foam.', photo: 'assets/menu/cortado.jpg', alt: 'Cortado in a small glass cup', tags: ['Bold','Balanced'] },
    { name: 'Flat White', origin: 'From Australia', desc: 'Velvety microfoam over a strong double shot. Creamy with a real espresso bite.', photo: 'assets/menu/flat-white.jpg', alt: 'Flat white in a white ceramic cup', tags: ['Creamy','Strong'] },
    { name: 'Iced Latte', origin: 'Slow-poured cold', desc: 'Cold milk, fresh espresso, plenty of ice. The everyday cool-down.', photo: 'assets/menu/iced-latte.jpg', alt: 'Iced latte in a tall glass', tags: ['Cool','Smooth'] },
    { name: 'Cappuccino', origin: 'From Italy', desc: 'Espresso, steamed milk, dense foam. The morning standard, done properly.', photo: 'assets/menu/cappuccino.jpg', alt: 'Cappuccino with rosetta foam art', tags: ['Foamy','Classic'] },
    { name: 'Cold Brew Tonic', origin: 'House twist', desc: 'Slow-steeped cold brew, tonic water, lemon. Bright, fizzy, unexpected.', photo: 'assets/menu/cold-brew-tonic.jpg', alt: 'Cold brew tonic with citrus garnish', tags: ['Bright','Fizzy'] },
    { name: 'Hojicha Latte', origin: 'Kyoto, Japan', desc: 'Roasted green tea steamed with milk. Toasty, low-caffeine, mellow.', photo: 'assets/menu/hojicha-latte.jpg', alt: 'Hojicha latte with foam in a ceramic cup', tags: ['Toasty','Mellow'] },
    { name: 'Iced Americano', origin: 'Long & cold', desc: 'Double shot stretched over ice and water. Clean, sharp, refreshing.', photo: 'assets/menu/iced-americano.jpg', alt: 'Iced americano in a tall glass', tags: ['Clean','Sharp'] },
    { name: 'Vanilla Latte', origin: 'House favourite', desc: 'Espresso, steamed milk, vanilla syrup. Familiar, easy, always warming.', photo: 'assets/menu/vanilla-latte.jpg', alt: 'Vanilla latte with foam art', tags: ['Sweet','Warm'] },
    { name: 'Hot Chocolate', origin: 'Belgian cocoa', desc: 'Real dark chocolate melted into warm milk. Thick, deep, indulgent.', photo: 'assets/menu/hot-chocolate.jpg', alt: 'Hot chocolate in a ceramic mug', tags: ['Rich','Cozy'] },
    { name: 'Choco Chips Frappe', origin: 'Cold blend', desc: 'Cold milk, espresso, ice and chocolate chips. Dessert in a glass.', photo: 'assets/menu/choco-chips-frappe.jpg', alt: 'Choco chips frappe with whipped cream', tags: ['Sweet','Iced'] }
  ];

  const FEATURE_PICKS = [
    { name: 'Vietnamese Cold Brew', origin: 'Our house favourite', desc: 'Strong, sweet, slow-steeped with condensed milk. The one our regulars keep coming back for.', photo: 'assets/menu/vietnamese-cold.jpg', alt: 'Vietnamese cold coffee in a glass with condensed milk', tags: ['Bold','Sweet','Iconic'] },
    { name: 'Mocha', origin: 'House signature', desc: 'Espresso, chocolate, steamed milk. Dessert-meets-drink. Good for late conversations.', photo: 'assets/menu/mocha.jpg', alt: 'Mocha latte with rosetta art', tags: ['Rich','Chocolatey','Indulgent'] },
    { name: 'Affogato', origin: 'From Italy', desc: 'A scoop of vanilla ice cream drowned in fresh espresso. Hot meets cold.', photo: 'assets/menu/affogato.jpg', alt: 'Affogato — espresso poured over vanilla ice cream', tags: ['Sweet','Iced','Iconic'] },
    { name: 'Iced Cafe Mocha', origin: 'Cold & decadent', desc: 'Chocolate, espresso, milk, ice. The mocha — but cold and a little bolder.', photo: 'assets/menu/iced-cafe-mocha.jpg', alt: 'Iced cafe mocha in a tall glass', tags: ['Rich','Cold','Indulgent'] }
  ];

  const dayOfYear = (d) => {
    const start = Date.UTC(d.getFullYear(), 0, 0);
    const today = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
    return Math.floor((today - start) / 86400000);
  };

  const applyPick = (selector, p, badgeClass, badgeText) => {
    const el = document.querySelector(selector);
    if (!el) return;
    const img = el.querySelector('.pick__photo img');
    if (img) { img.src = p.photo; img.alt = p.alt; }
    const badge = el.querySelector('.pick__badge');
    if (badge) {
      badge.className = 'pick__badge pick__badge--' + badgeClass;
      badge.textContent = badgeText;
    }
    const origin = el.querySelector('.pick__origin');
    if (origin) origin.textContent = p.origin;
    const name = el.querySelector('.pick__name');
    if (name) name.textContent = p.name;
    const desc = el.querySelector('.pick__desc');
    if (desc) desc.textContent = p.desc;
    const meta = el.querySelector('.pick__meta');
    if (meta) {
      meta.innerHTML = '';
      p.tags.forEach((t) => {
        const span = document.createElement('span');
        span.className = 'pick__tag';
        span.textContent = t;
        meta.appendChild(span);
      });
    }
    const cta = el.querySelector('.pick__cta');
    if (cta) cta.href = 'https://wa.me/918109800010?text=' + encodeURIComponent("Hi, I'd like to order a " + p.name);
  };

  const rotatePicks = () => {
    if (!document.getElementById('pick-1')) return;
    const day = dayOfYear(new Date());
    const len = SIDE_PICKS.length;
    const i1 = day % len;
    let i2 = (day * 7 + 3) % len;
    if (i2 === i1) i2 = (i2 + 1) % len;
    const feature = FEATURE_PICKS[day % FEATURE_PICKS.length];

    applyPick('#pick-1', SIDE_PICKS[i1], 'morning', 'Morning');
    applyPick('#pick-2', feature, 'signature', 'Signature');
    applyPick('#pick-3', SIDE_PICKS[i2], 'evening', 'Evening');
  };

  rotatePicks();
})();

// ===== ENGAGEMENT COMPONENTS =====
(function () {
  // #6 — Scroll progress bar
  const progressBar = document.getElementById('scroll-progress-bar');
  if (progressBar) {
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      progressBar.style.width = pct + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // #1 — Mobile drawer
  const burger = document.getElementById('nav-burger');
  const drawer = document.getElementById('drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const drawerClose = document.getElementById('drawer-close');
  const openDrawer = () => {
    drawer.classList.add('is-open');
    drawerBackdrop.classList.add('is-open');
    burger.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const closeDrawer = () => {
    drawer.classList.remove('is-open');
    drawerBackdrop.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  if (burger && drawer) {
    burger.addEventListener('click', () => {
      drawer.classList.contains('is-open') ? closeDrawer() : openDrawer();
    });
    drawerClose && drawerClose.addEventListener('click', closeDrawer);
    drawerBackdrop && drawerBackdrop.addEventListener('click', closeDrawer);
    drawer.querySelectorAll('.drawer__link, .drawer__cta a').forEach(a => a.addEventListener('click', closeDrawer));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer(); });
  }

  // #2 — Stats / number counters
  const stats = document.querySelectorAll('.stat__num');
  const tickStat = (el) => {
    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimals || '0');
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1500;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const cur = target * eased;
      el.textContent = prefix + (decimals ? cur.toFixed(decimals) : Math.floor(cur).toLocaleString()) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (stats.length && 'IntersectionObserver' in window) {
    const statObs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { tickStat(e.target); statObs.unobserve(e.target); } });
    }, { threshold: 0.4 });
    stats.forEach(s => statObs.observe(s));
  }

  // #4 — Rotating pull quote (every 3s)
  const pullquote = document.getElementById('pullquote');
  if (pullquote) {
    const quotes = [
      { q: 'It’s a small community, and a really warm one. The Vietnamese cold brew is unreal.', cite: '— Priya S. · ★ 5.0 Google' },
      { q: 'Best cafe in Bhilai. The pizza dough is hand-stretched, you can tell. We come every weekend.', cite: '— Aman R. · ★ 4.5 Zomato' },
      { q: 'Open till midnight, pure veg, and the matcha is properly made. Found my new study spot.', cite: '— Neha T. · ★ 4.0 Google' },
      { q: 'Multi-roaster coffee at this quality in Bhilai is rare. The hojicha latte made my week.', cite: '— Rohan M. · ★ 4.5 Google' },
    ];
    const txt = pullquote.querySelector('.pullquote__text');
    const cite = pullquote.querySelector('.pullquote__cite');
    let qi = 0;
    setInterval(() => {
      qi = (qi + 1) % quotes.length;
      pullquote.classList.add('is-changing');
      setTimeout(() => {
        txt.textContent = quotes[qi].q;
        cite.textContent = quotes[qi].cite;
        pullquote.classList.remove('is-changing');
      }, 320);
    }, 3000);
  }

  // #8 — Mood picker
  const moodPills = document.querySelectorAll('.mood__pill');
  const moodResult = document.getElementById('mood-result');
  moodPills.forEach(pill => {
    pill.addEventListener('click', () => {
      moodPills.forEach(p => p.classList.remove('is-active'));
      pill.classList.add('is-active');
      const drink = pill.dataset.drink;
      const tab = pill.dataset.tab;
      moodResult.textContent = '→ Try the ' + drink;
      moodResult.classList.add('is-visible');
      // Switch the menu tab to highlight the drink's category
      if (tab) {
        const tabBtn = document.querySelector('.menu__tab[data-filter="' + tab + '"]');
        if (tabBtn) tabBtn.click();
      }
    });
  });

  // #3 — Gallery lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const galleryFigures = document.querySelectorAll('.gallery__bento .bento');
  let lbIdx = 0;
  const lbItems = [];
  galleryFigures.forEach((fig, i) => {
    const img = fig.querySelector('img');
    const cap = fig.querySelector('figcaption');
    if (img) {
      lbItems.push({ src: img.src, alt: img.alt, caption: cap ? cap.textContent : '' });
      fig.addEventListener('click', () => { lbIdx = i; openLB(); });
    }
  });
  const openLB = () => {
    if (!lbItems.length) return;
    const item = lbItems[lbIdx];
    lightboxImg.src = item.src;
    lightboxImg.alt = item.alt;
    lightboxCaption.textContent = item.caption;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const closeLB = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  const navLB = (dir) => {
    lbIdx = (lbIdx + dir + lbItems.length) % lbItems.length;
    openLB();
  };
  if (lightbox) {
    lightboxClose.addEventListener('click', closeLB);
    lightboxPrev.addEventListener('click', e => { e.stopPropagation(); navLB(-1); });
    lightboxNext.addEventListener('click', e => { e.stopPropagation(); navLB(1); });
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLB(); });
    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLB();
      else if (e.key === 'ArrowLeft') navLB(-1);
      else if (e.key === 'ArrowRight') navLB(1);
    });
  }

  // #5 — Parallax hero (photo translates slower than scroll)
  const heroPhotos = document.querySelectorAll('.hero__photo');
  if (heroPhotos.length) {
    const onParallax = () => {
      const y = window.scrollY;
      const yo = Math.min(y * 0.3, 200);
      heroPhotos.forEach(p => { p.style.transform = `scale(1.04) translateY(${yo}px)`; });
    };
    window.addEventListener('scroll', onParallax, { passive: true });
  }

  // #9 — 3D tilt on brewing cards (NOT roasters)
  const brewCards = document.querySelectorAll('.brew');
  brewCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();

// ===== Newsletter (Component 8) — opens WhatsApp with the email =====
function handleNewsletter(e) {
  e.preventDefault();
  const form = e.target;
  const email = form.email.value.trim();
  if (!email) return false;
  const success = document.getElementById('news-success');
  if (success) {
    success.hidden = false;
    form.style.display = 'none';
  }
  // Optional: open WhatsApp with the email so owner has a record
  const msg = encodeURIComponent(`Hi! Add me to the Ek Saath newsletter. Email: ${email}`);
  // Open in new tab so user keeps the success message in view
  window.open(`https://wa.me/918109800010?text=${msg}`, '_blank', 'noopener');
  return false;
}

// ===== Marginalia: draw-on when scribbles enter viewport =====
(function () {
  const scribbles = document.querySelectorAll('.scribble');
  if (!scribbles.length) return;

  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced || !('IntersectionObserver' in window)) {
    scribbles.forEach((s) => s.classList.add('is-drawn'));
    return;
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('is-drawn');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.35 });

  scribbles.forEach((s) => obs.observe(s));

  // Pizza tab can reveal a hidden scribble; nudge IO to recheck after tab change
  document.querySelectorAll('.menu__tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      // Re-observe any not-yet-drawn scribbles inside the menu
      requestAnimationFrame(() => {
        document.querySelectorAll('.menu .scribble:not(.is-drawn)').forEach((s) => {
          obs.unobserve(s);
          obs.observe(s);
        });
      });
    });
  });
})();

// ===== Origin map: pulse the city dot when its roaster card is hovered/focused =====
(function () {
  const cards = document.querySelectorAll('.roaster[data-city]');
  if (!cards.length) return;

  cards.forEach((card) => {
    const city = card.dataset.city;
    const dot = document.querySelector('.city--' + city);
    if (!dot) return;
    const on = () => dot.classList.add('is-pulsing');
    const off = () => dot.classList.remove('is-pulsing');
    card.addEventListener('mouseenter', on);
    card.addEventListener('mouseleave', off);
    card.addEventListener('focus', on);
    card.addEventListener('blur', off);
  });
})();
