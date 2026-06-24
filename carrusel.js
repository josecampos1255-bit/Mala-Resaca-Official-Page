/* =========================================================
   CARRUSEL - MOMENTOS DE LUCIDEZ
   Mala Resaca Official Website
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- CONFIGURACIÓN ----------
  const INTERVALO_MS   = 4000;   // tiempo entre slides automáticos
  const SLIDES_DESKTOP = 3;      // imágenes visibles en escritorio
  const SLIDES_TABLET  = 2;      // imágenes visibles en tablet
  const SLIDES_MOBILE  = 1;      // imágenes visibles en celular

  // ---------- REFERENCIAS ----------
  const track     = document.getElementById('carruselTrack');
  const dotsWrap  = document.getElementById('carruselDots');
  const btnPrev   = document.querySelector('.carrusel-prev');
  const btnNext   = document.querySelector('.carrusel-next');
  const lightbox  = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lightboxImg');
  const lbClose   = document.getElementById('lightboxClose');

  if (!track) return;

  const slides = Array.from(track.querySelectorAll('.carrusel-slide'));
  const total  = slides.length;
  let current  = 0;
  let timer    = null;
  let isDragging = false;
  let dragStartX = 0;

  // ---------- RESPONSIVE: cuántos slides mostrar ----------
  function getSlidesVisibles() {
    if (window.innerWidth <= 480) return SLIDES_MOBILE;
    if (window.innerWidth <= 768) return SLIDES_TABLET;
    return SLIDES_DESKTOP;
  }

  // ---------- DOTS ----------
  function crearDots() {
    dotsWrap.innerHTML = '';
    const visibles = getSlidesVisibles();
    const totalDots = total - visibles + 1;
    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement('button');
      dot.className = 'carrusel-dot';
      dot.setAttribute('aria-label', `Ir a imagen ${i + 1}`);
      dot.addEventListener('click', () => irA(i));
      dotsWrap.appendChild(dot);
    }
    actualizarDots();
  }

  function actualizarDots() {
    const dots = dotsWrap.querySelectorAll('.carrusel-dot');
    dots.forEach((d, i) => d.classList.toggle('activo', i === current));
  }

  // ---------- MOVER CARRUSEL ----------
  function irA(index) {
    const visibles  = getSlidesVisibles();
    const maxIndex  = total - visibles;
    current = Math.max(0, Math.min(index, maxIndex));

    const slideWidth = slides[0].getBoundingClientRect().width;
    const gap = 20; // debe coincidir con el gap del CSS
    track.style.transform = `translateX(-${current * (slideWidth + gap)}px)`;
    actualizarDots();
  }

  function siguiente() { irA(current + 1); }
  function anterior()  { irA(current - 1); }

  // ---------- AUTO-PLAY ----------
  function iniciarTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
      const visibles = getSlidesVisibles();
      const maxIndex = total - visibles;
      irA(current >= maxIndex ? 0 : current + 1);
    }, INTERVALO_MS);
  }

  function pausarTimer() { clearInterval(timer); }

  // ---------- EVENTOS FLECHAS ----------
  btnPrev.addEventListener('click', () => { anterior(); iniciarTimer(); });
  btnNext.addEventListener('click', () => { siguiente(); iniciarTimer(); });

  // Pausa al hover
  track.parentElement.addEventListener('mouseenter', pausarTimer);
  track.parentElement.addEventListener('mouseleave', iniciarTimer);

  // ---------- SWIPE TÁCTIL ----------
  track.addEventListener('touchstart', e => {
    dragStartX = e.touches[0].clientX;
    pausarTimer();
  }, { passive: true });

  track.addEventListener('touchend', e => {
    const diff = dragStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? siguiente() : anterior();
    }
    iniciarTimer();
  }, { passive: true });

  // ---------- LIGHTBOX ----------
  document.querySelectorAll('.slide-img').forEach(img => {
    img.addEventListener('click', () => {
      lbImg.src = img.dataset.img;
      lbImg.alt = img.alt;
      lightbox.classList.add('activo');
      document.body.style.overflow = 'hidden';
    });
  });

  function cerrarLightbox() {
    lightbox.classList.remove('activo');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 300);
  }

  lbClose.addEventListener('click', cerrarLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) cerrarLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarLightbox(); });

  // ---------- RESIZE ----------
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      irA(0);
      crearDots();
    }, 200);
  });

  // ---------- INIT ----------
  crearDots();
  irA(0);
  iniciarTimer();
});
