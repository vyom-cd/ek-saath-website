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
      dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
    };

    const startAuto = () => {
      stopAuto();
      timer = setInterval(() => goTo(idx + 1), 6000);
    };
    const stopAuto = () => { if (timer) clearInterval(timer); };

    dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); stopAuto(); startAuto(); }));
    arrows.forEach((a) => a.addEventListener('click', () => {
      goTo(idx + parseInt(a.dataset.dir, 10));
      stopAuto(); startAuto();
    }));

    // Pause on hover for accessibility
    carousel.addEventListener('mouseenter', stopAuto);
    carousel.addEventListener('mouseleave', startAuto);

    // Respect reduced motion
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) startAuto();
  }
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
