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
