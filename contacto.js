/* =========================================================
   FORMULARIO DE CONTACTO - EmailJS
   Mala Resaca Official Website
   ========================================================= */

emailjs.init('ciqX1aKkWnemTyg6w');

document.addEventListener('DOMContentLoaded', () => {

  const form       = document.getElementById('contactoForm');
  const btnEnviar  = document.getElementById('btnEnviar');
  const formStatus = document.getElementById('formStatus');

  const campos = {
    nombre:  { input: form.querySelector('[name="from_name"]'),  error: document.getElementById('errorNombre') },
    email:   { input: form.querySelector('[name="from_email"]'), error: document.getElementById('errorEmail') },
    mensaje: { input: form.querySelector('[name="message"]'),    error: document.getElementById('errorMensaje') },
  };

  // ---------- VALIDACIÓN ----------
  function validarCampo(campo, valor) {
    switch (campo) {
      case 'nombre':
        if (!valor) return 'El nombre es obligatorio.';
        if (valor.length < 2) return 'Ingresa al menos 2 caracteres.';
        return '';
      case 'email':
        if (!valor) return 'El email es obligatorio.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) return 'Ingresa un email válido (ej: correo@dominio.com).';
        return '';
      case 'mensaje':
        if (!valor) return 'El mensaje es obligatorio.';
        if (valor.length < 10) return 'El mensaje debe tener al menos 10 caracteres.';
        return '';
    }
  }

  function mostrarError(ref, msg) {
    ref.input.classList.toggle('input-error', !!msg);
    ref.error.textContent = msg;
  }

  function limpiarError(ref) {
    ref.input.classList.remove('input-error');
    ref.error.textContent = '';
  }

  // Validación en tiempo real al salir del campo
  Object.entries(campos).forEach(([key, ref]) => {
    ref.input.addEventListener('blur', () => {
      const err = validarCampo(key, ref.input.value.trim());
      mostrarError(ref, err);
    });

    ref.input.addEventListener('input', () => {
      if (ref.input.classList.contains('input-error')) {
        const err = validarCampo(key, ref.input.value.trim());
        if (!err) limpiarError(ref);
      }
    });
  });

  // ---------- ENVÍO ----------
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validar todos los campos
    let hayErrores = false;
    Object.entries(campos).forEach(([key, ref]) => {
      const err = validarCampo(key, ref.input.value.trim());
      mostrarError(ref, err);
      if (err) hayErrores = true;
    });

    if (hayErrores) return;

    // Estado de carga
    btnEnviar.disabled = true;
    btnEnviar.textContent = 'Enviando...';
    formStatus.className = 'form-status';
    formStatus.textContent = '';

    try {
      await emailjs.sendForm('service_pgam3hm', 'template_rj8stah', form);

      // Éxito
      formStatus.textContent = '🤘 ¡Mensaje enviado! Te contactamos pronto.';
      formStatus.classList.add('form-status--ok');
      form.reset();
      Object.values(campos).forEach(ref => limpiarError(ref));

    } catch (err) {
      // Error
      formStatus.textContent = '❌ Hubo un problema al enviar. Intenta de nuevo.';
      formStatus.classList.add('form-status--error');
      console.error('EmailJS error:', err);

    } finally {
      btnEnviar.disabled = false;
      btnEnviar.textContent = 'Enviar';

      // Ocultar el mensaje de estado después de 5 segundos
      setTimeout(() => {
        formStatus.textContent = '';
        formStatus.className = 'form-status';
      }, 5000);
    }
  });
});
