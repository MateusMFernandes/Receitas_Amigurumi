document.addEventListener('DOMContentLoaded', function () {

  /* -----------------------
     Header / Nav / Hamburger
  ------------------------*/
  const btnHamburger = document.getElementById('btn-hamburger');
  const mainNav = document.getElementById('main-nav');
  const siteHeader = document.querySelector('.site-header');

  btnHamburger.addEventListener('click', function () {
    const isOpen = mainNav.classList.toggle('open');
    this.classList.toggle('open');
    this.setAttribute('aria-expanded', String(isOpen));
  });

  // Fechar ao clicar em link do menu
  document.querySelectorAll('.main-nav a').forEach(a => {
    a.addEventListener('click', () => {
      if (mainNav.classList.contains('open')) {
        mainNav.classList.remove('open');
        btnHamburger.classList.remove('open');
        btnHamburger.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Fechar ao clicar fora do menu
  document.addEventListener('click', function (e) {
    if (
      mainNav.classList.contains('open') &&
      !mainNav.contains(e.target) &&
      !btnHamburger.contains(e.target)
    ) {
      mainNav.classList.remove('open');
      btnHamburger.classList.remove('open');
      btnHamburger.setAttribute('aria-expanded', 'false');
    }
  });

  // Fechar com Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mainNav.classList.contains('open')) {
      mainNav.classList.remove('open');
      btnHamburger.classList.remove('open');
      btnHamburger.setAttribute('aria-expanded', 'false');
      btnHamburger.focus();
    }
  });

  // Header shadow on scroll
  window.addEventListener('scroll', () => {
    siteHeader.classList.toggle('scrolled', window.scrollY > 10);
    updateScrollSpy();
  }, { passive: true });

  /* -----------------------
     Scroll Spy
  ------------------------*/
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const navLinks = Array.from(document.querySelectorAll('.main-nav a'));

  function findCurrentSection() {
    const scrollPos = window.scrollY + 120;
    let current = sections[0];
    for (const sec of sections) {
      if (scrollPos >= sec.offsetTop) current = sec;
    }
    return current ? current.id : null;
  }

  function updateScrollSpy() {
    const id = findCurrentSection();
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
    });
  }
  updateScrollSpy();

  /* -----------------------
     Year
  ------------------------*/
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -----------------------
     Focus trap
  ------------------------*/
  let focusTrapHandlers = null;

  function trapFocus(container) {
    const focusable = Array.from(container.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )).filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    focusTrapHandlers = function (e) {
      if (modal.getAttribute('aria-hidden') === 'true') return;
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
    };
    document.addEventListener('keydown', focusTrapHandlers);
  }

  function releaseFocusTrap() {
    if (focusTrapHandlers) {
      document.removeEventListener('keydown', focusTrapHandlers);
      focusTrapHandlers = null;
    }
  }

  /* -----------------------
     Scroll-to anchors
  ------------------------*/
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').slice(1);

      if (mainNav.classList.contains('open')) {
        mainNav.classList.remove('open');
        btnHamburger.classList.remove('open');
        btnHamburger.setAttribute('aria-expanded', 'false');
      }

      // href="#" (Home) — rola suavemente para o topo
      if (!targetId) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const target = document.getElementById(targetId);
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  window.addEventListener('resize', updateScrollSpy);
  window.addEventListener('load', updateScrollSpy);

  /* -----------------------
     Share fallback
  ------------------------*/
  const shareFallback = document.getElementById('share-fallback');
  if (shareFallback) {
    shareFallback.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeShareFallback();
    });
  }

  /* -----------------------
     Hero Carrossel
  ------------------------*/
  const hero = document.querySelector('.hero');
  const dots = document.querySelectorAll('.hero-dots input');

  if (hero && dots.length > 0) {

    const images = [
      'Img/002.jpg',
      'Img/003.jpg',
      'Img/001.jpg'
    ];

    let current = 0;

    // Pré-carrega as imagens
    images.forEach(src => { const img = new Image(); img.src = src; });

    function changeSlide(index) {
      if (index === current) return;
      hero.style.backgroundImage = `url('${images[index]}')`;
      dots[index].checked = true;
      current = index;
    }

    function startAutoplay() {
      return setInterval(() => {
        changeSlide((current + 1) % images.length);
      }, 6000);
    }

    let autoplayTimer = startAutoplay();

    // Clique manual reinicia o timer
    dots.forEach((dot, index) => {
      dot.addEventListener('change', () => {
        clearInterval(autoplayTimer);
        changeSlide(index);
        autoplayTimer = startAutoplay();
      });
    });
  }

});