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

  // ===== Open now chip =====
  // Hours: every day, 11:00 - 23:59
  const openNow = document.getElementById('open-now');
  if (openNow) {
    const now = new Date();
    const hour = now.getHours();
    const min = now.getMinutes();
    const isOpen = (hour >= 11 && hour < 23) || (hour === 23 && min < 59);

    if (isOpen) {
      openNow.hidden = false;
      const text = openNow.querySelector('.open-now__text');
      if (text) {
        // Closes at midnight (effectively 23:59)
        const minsUntilClose = (23 - hour) * 60 + (59 - min);
        if (minsUntilClose < 60) {
          text.textContent = `Closing soon · ${minsUntilClose}m`;
          openNow.style.color = 'var(--terracotta)';
          openNow.style.background = 'rgba(139, 90, 60, 0.12)';
          const dot = openNow.querySelector('.open-now__dot');
          if (dot) dot.style.background = 'var(--terracotta)';
        } else {
          text.textContent = 'Open now · Till midnight';
        }
      }
    }
  }
})();
