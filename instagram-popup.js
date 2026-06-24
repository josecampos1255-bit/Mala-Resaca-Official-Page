/* =========================================================
   POPUP - SEGUINOS EN INSTAGRAM
   Mala Resaca Official Website
   ========================================================= */
 
document.addEventListener('DOMContentLoaded', () => {
 
  // ---------- CONFIGURACIÓN ----------
  const INSTAGRAM_URL = 'https://www.instagram.com/mala_resaca/';
  const DELAY_MS = 3000;            // tiempo de espera antes de mostrar el popup (ms)
  const HORAS_PARA_REPETIR = 24;    // horas antes de volver a mostrar el popup al mismo usuario
  const STORAGE_KEY = 'mr_ig_popup_cerrado';
 
  // ---------- VERIFICAR SI YA SE MOSTRÓ ----------
    function debeMostrarPopup() {
    const ultimoCierre = localStorage.getItem(STORAGE_KEY);
    if (!ultimoCierre) return true;
 
    const horasTranscurridas = (Date.now() - Number(ultimoCierre)) / (1000 * 60 * 60);
    return horasTranscurridas >= HORAS_PARA_REPETIR;
  }
 
  function marcarComoCerrado() {
    localStorage.setItem(STORAGE_KEY, Date.now().toString());

  }
 
  // ---------- CREAR EL HTML DEL POPUP ----------
  function crearPopup() {
    const overlay = document.createElement('div');
    overlay.className = 'ig-popup-overlay';
    overlay.id = 'igPopupOverlay';
 
    overlay.innerHTML = `
      <div class="ig-popup-box" role="dialog" aria-labelledby="igPopupTitulo" aria-modal="true">
        <button class="ig-popup-close" id="igPopupClose" aria-label="Cerrar">&times;</button>
 
        <div class="ig-popup-icon">
          <img src="https://cdn.simpleicons.org/instagram/E1306C" alt="Instagram">
        </div>
 
        <h3 id="igPopupTitulo">¡No te pierdas nuestras locuras!</h3>
        <p>Siguenos en instagram para enterarte de nuestros próximos shows, lanzamientos y todo el desmadre de Mala Resaca.</p>
 
        <a href="${INSTAGRAM_URL}" target="_blank" rel="noopener noreferrer" class="ig-popup-btn" id="igPopupBtn">
          Seguir en Instagram
        </a>
 
        <button class="ig-popup-later" id="igPopupLater">Tal vez después :c</button>
      </div>
    `;
 
    document.body.appendChild(overlay);
    return overlay;
  }
 
  // ---------- MOSTRAR / CERRAR ----------
  function mostrarPopup(overlay) {
    // pequeño timeout para permitir la transición CSS
    requestAnimationFrame(() => {
      overlay.classList.add('activo');
    });
  }
 
  function cerrarPopup(overlay) {
    overlay.classList.remove('activo');
    marcarComoCerrado();
 
    // remover del DOM después de la transición
    setTimeout(() => {
      overlay.remove();
    }, 300);
  }
 
  // ---------- INICIALIZAR ----------
  function init() {
    if (!debeMostrarPopup()) return;
 
    setTimeout(() => {
      const overlay = crearPopup();
      mostrarPopup(overlay);
 
      // Cerrar con la X
      document.getElementById('igPopupClose').addEventListener('click', () => {
        cerrarPopup(overlay);
      });
 
      // Cerrar con "Tal vez después"
      document.getElementById('igPopupLater').addEventListener('click', () => {
        cerrarPopup(overlay);
      });
 
      // Cerrar al hacer clic en el botón de Instagram (se va a abrir en nueva pestaña)
      document.getElementById('igPopupBtn').addEventListener('click', () => {
        cerrarPopup(overlay);
      });
 
      // Cerrar al hacer clic fuera de la caja
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          cerrarPopup(overlay);
        }
      });
 
      // Cerrar con la tecla ESC
      document.addEventListener('keydown', function escListener(e) {
        if (e.key === 'Escape') {
          cerrarPopup(overlay);
          document.removeEventListener('keydown', escListener);
        }
      });
 
    }, DELAY_MS);
  }
 
  init();
});
 
