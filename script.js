/* ═══════════════════════════════════════════
   MFG Arte e Fé — Script Principal
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Menu Mobile ─────────────────────────────── */
  const hamburger = document.querySelector('.hamburger');
  const mainNav   = document.querySelector('.main-nav');
  const overlay   = document.querySelector('.mobile-overlay');

  function openMenu() {
    hamburger && hamburger.setAttribute('aria-expanded', 'true');
    mainNav   && mainNav.classList.add('open');
    overlay   && overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger && hamburger.setAttribute('aria-expanded', 'false');
    mainNav   && mainNav.classList.remove('open');
    overlay   && overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger && hamburger.addEventListener('click', () => {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });

  overlay && overlay.addEventListener('click', closeMenu);

  // Fecha ao clicar em link de nav
  mainNav && mainNav.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', closeMenu)
  );

  // Fecha ao pressionar Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  /* ── Carrossel de Destaques ────────────────── */
  const track     = document.querySelector('.carousel-track');
  const container = document.querySelector('.carousel-track-container');
  const btnPrev   = document.querySelector('.carousel-arrow-prev');
  const btnNext   = document.querySelector('.carousel-arrow-next');
  const dotsEl    = document.querySelector('.carousel-dots');

  if (track && container) {
    const cards       = Array.from(track.children);
    let   current     = 0;
    let   autoTimer   = null;

    function getVisible() {
      const w = container.offsetWidth;
      const c = cards[0] ? cards[0].offsetWidth : 1;
      return Math.max(1, Math.round(w / (c + 16)));
    }

    function maxIndex() {
      return Math.max(0, cards.length - getVisible());
    }

    function goTo(idx) {
      current = Math.min(Math.max(0, idx), maxIndex());
      const cardW   = cards[0] ? cards[0].offsetWidth + 16 : 0;
      track.style.transform = `translateX(-${current * cardW}px)`;
      updateDots();
    }

    function buildDots() {
      if (!dotsEl) return;
      dotsEl.innerHTML = '';
      const total = maxIndex() + 1;
      for (let i = 0; i < total; i++) {
        const btn = document.createElement('button');
        btn.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        btn.setAttribute('aria-label', `Slide ${i + 1}`);
        btn.addEventListener('click', () => { goTo(i); resetAuto(); });
        dotsEl.appendChild(btn);
      }
    }

    function updateDots() {
      if (!dotsEl) return;
      dotsEl.querySelectorAll('.carousel-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    function startAuto() {
      autoTimer = setInterval(() => {
        goTo(current >= maxIndex() ? 0 : current + 1);
      }, 3800);
    }

    function resetAuto() {
      clearInterval(autoTimer);
      startAuto();
    }

    btnPrev && btnPrev.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    btnNext && btnNext.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

    // Touch / swipe
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        goTo(diff > 0 ? current + 1 : current - 1);
        resetAuto();
      }
    });

    buildDots();
    startAuto();

    // Recalcula ao redimensionar
    window.addEventListener('resize', () => {
      goTo(Math.min(current, maxIndex()));
      buildDots();
    });
  }

  /* ── Active link no nav ──────────────────────── */
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.main-nav a').forEach(a => {
    if (a.getAttribute('href') === currentPage) a.classList.add('active');
  });

});
