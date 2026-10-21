'use strict';
// El contenido y los acordeones nativos funcionan sin JavaScript.
const menu = document.querySelector('#menu');
const mobileNav = document.querySelector('#mobile-nav');
function closeMenu(restoreFocus = false) {
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Abrir menú');
  mobileNav.hidden = true;
  menu.textContent = 'Menú +';
  if (restoreFocus) menu.focus();
}
menu.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!expanded));
  menu.setAttribute('aria-label', expanded ? 'Abrir menú' : 'Cerrar menú');
  mobileNav.hidden = expanded;
  menu.textContent = expanded ? 'Menú +' : 'Cerrar −';
});
mobileNav.addEventListener('click', event => {
  const link = event.target.closest('a');
  if (!link) return;
  closeMenu();
  // Mantener la navegación por teclado en la sección elegida.
  const section = document.querySelector(link.getAttribute('href'));
  if (section) {
    section.setAttribute('tabindex', '-1');
    section.focus({ preventScroll: true });
  }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') closeMenu(true);
});
window.matchMedia('(min-width: 801px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

// Solicitud de cotización: los datos permanecen en la página hasta abrir WhatsApp.
const quoteDialog = document.querySelector('#quote-dialog');
const quoteForm = document.querySelector('#quote-form');
const quotePanels = [...quoteForm.querySelectorAll('[data-step]')];
const quoteProgress = [...document.querySelectorAll('.quote-progress li')];
const quoteNext = document.querySelector('#quote-next');
const quoteBack = document.querySelector('#quote-back');
const quoteError = document.querySelector('#quote-error');
let quoteStep = 0;
let quoteTrigger = null;
function showQuoteStep(index, focus = true) {
  quoteStep = index;
  quotePanels.forEach((panel, i) => { panel.hidden = i !== index; });
  quoteProgress.forEach((item, i) => {
    item.classList.toggle('is-complete', i < index);
    if (i === index) item.setAttribute('aria-current', 'step');
    else item.removeAttribute('aria-current');
  });
  quoteBack.hidden = index === 0;
  quoteNext.hidden = index === 3;
  quoteNext.innerHTML = index === 2 ? 'Revisar solicitud <span aria-hidden="true">→</span>' : 'Continuar <span aria-hidden="true">→</span>';
  quoteError.hidden = true;
  if (focus) {
    const legend = quotePanels[index].querySelector('legend');
    legend.setAttribute('tabindex', '-1');
    legend.focus({ preventScroll: true });
    quoteDialog.scrollTop = 0;
  }
}
function validateQuoteStep(index) {
  const services = [...quoteForm.querySelectorAll('input[name="services"]')];
  services[0].setCustomValidity(services.some(input => input.checked) ? '' : 'Selecciona al menos un servicio.');
  const phone = quoteForm.elements.clientPhone;
  const phoneValue = phone.value.trim();
  phone.setCustomValidity(phoneValue && !MDCQuote.isValidClientPhone(phoneValue) ? 'Indica un teléfono válido con código de país (8 a 15 dígitos).' : '');
  const consent = quoteForm.elements.consent;
  consent.setCustomValidity(consent.checked ? '' : 'Confirma que aceptas compartir estos datos por WhatsApp.');
  const fields = [...quotePanels[index].querySelectorAll('input, select, textarea')];
  fields.forEach(input => {
    if (input.type === 'checkbox' || input.name === 'clientPhone') return;
    const value = input.value.trim();
    let error = '';
    if (input.required && !value) error = 'Completa este campo.';
    else if (input.type === 'email' && input.validity.typeMismatch) error = 'Indica un correo electrónico válido.';
    else if (value && input.minLength > 0 && value.length < input.minLength) error = `Escribe al menos ${input.minLength} caracteres.`;
    else if (input.maxLength > 0 && value.length > input.maxLength) error = `Usa como máximo ${input.maxLength} caracteres.`;
    input.setCustomValidity(error);
  });
  const invalid = fields.find(input => !input.checkValidity());
  fields.forEach(input => input.removeAttribute('aria-invalid'));
  if (!invalid) return true;
  showQuoteStep(index, false);
  quoteError.textContent = 'Revisa los campos obligatorios y el formato de los datos antes de continuar.';
  quoteError.hidden = false;
  invalid.setAttribute('aria-invalid', 'true');
  invalid.focus();
  invalid.reportValidity();
  return false;
}
function quoteData() {
  const data = new FormData(quoteForm);
  return { ...Object.fromEntries(data), services: data.getAll('services'), deliverables: data.getAll('deliverables') };
}
document.querySelectorAll('[data-quote-open]').forEach(trigger => {
  trigger.addEventListener('click', () => {
    quoteTrigger = trigger;
    showQuoteStep(0, false);
    quoteDialog.showModal();
    document.body.classList.add('quote-open');
    document.querySelector('#quote-title').focus();
  });
});
document.querySelector('.quote-close').addEventListener('click', () => quoteDialog.close());
quoteDialog.addEventListener('click', event => {
  const rect = quoteDialog.getBoundingClientRect();
  if (event.target === quoteDialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) quoteDialog.close();
});
quoteDialog.addEventListener('close', () => {
  document.body.classList.remove('quote-open');
  if (quoteTrigger) quoteTrigger.focus({ preventScroll: true });
});
quoteBack.addEventListener('click', () => showQuoteStep(Math.max(0, quoteStep - 1)));
quoteForm.addEventListener('submit', event => {
  event.preventDefault();
  if (quoteStep === 3 || !validateQuoteStep(quoteStep)) return;
  if (quoteStep === 2) {
    for (let i = 0; i < 3; i++) if (!validateQuoteStep(i)) return;
    const data = quoteData();
    document.querySelector('#quote-preview').textContent = MDCQuote.buildQuoteMessage(data);
    document.querySelector('#quote-whatsapp').href = MDCQuote.createWhatsAppUrl(quoteDialog.dataset.whatsappNumber, data);
    document.querySelector('#quote-status').textContent = '';
  }
  showQuoteStep(quoteStep + 1);
});
quoteForm.addEventListener('input', event => {
  event.target.removeAttribute('aria-invalid');
  event.target.setCustomValidity('');
  if (event.target.name === 'services') quoteForm.querySelector('input[name="services"]').setCustomValidity('');
  if (event.target.name === 'clientPhone') event.target.setCustomValidity('');
});
document.querySelector('#quote-whatsapp').addEventListener('click', () => {
  document.querySelector('#quote-status').textContent = 'Continúa en WhatsApp y pulsa Enviar. Si no se abrió, vuelve a pulsar el botón.';
});
quoteDialog.addEventListener('keydown', event => {
  if (event.key !== 'Tab') return;
  const controls = [...quoteDialog.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]')].filter(control => !control.closest('[hidden]') && control.getClientRects().length > 0);
  const first = controls[0], last = controls[controls.length - 1];
  if (!first) return;
  const active = document.activeElement;
  if (event.shiftKey && (active === first || !controls.includes(active))) {
    event.preventDefault(); last.focus();
  } else if (!event.shiftKey && (active === last || active === quoteDialog)) {
    event.preventDefault(); first.focus();
  }
});

// Activar el contraste del CTA dentro de un radio de 64 px alrededor del botón.
const quotePointerMedia = window.matchMedia('(hover: hover) and (pointer: fine)');
const quoteTriggers = [...document.querySelectorAll('.quote-trigger')];
let quotePointer = null;
let quotePointerFrame = 0;
function clearQuoteProximity() {
  quotePointer = null;
  quoteTriggers.forEach(button => button.classList.remove('is-near'));
}
function updateQuoteProximity() {
  quotePointerFrame = 0;
  quoteTriggers.forEach(button => {
    let nearby = false;
    if (quotePointer && quotePointerMedia.matches && !quoteDialog.open) {
      const rect = button.getBoundingClientRect();
      const dx = Math.max(rect.left - quotePointer.x, 0, quotePointer.x - rect.right);
      const dy = Math.max(rect.top - quotePointer.y, 0, quotePointer.y - rect.bottom);
      nearby = rect.width > 0 && rect.height > 0 && Math.hypot(dx, dy) <= 64;
    }
    button.classList.toggle('is-near', nearby);
  });
}
function scheduleQuoteProximity() {
  if (!quotePointerFrame) quotePointerFrame = requestAnimationFrame(updateQuoteProximity);
}
window.addEventListener('pointermove', event => {
  if (event.pointerType !== 'mouse' || !quotePointerMedia.matches) return;
  quotePointer = { x: event.clientX, y: event.clientY };
  scheduleQuoteProximity();
}, { passive: true });
window.addEventListener('scroll', scheduleQuoteProximity, { passive: true });
window.addEventListener('resize', scheduleQuoteProximity, { passive: true });
window.addEventListener('blur', clearQuoteProximity);
document.addEventListener('pointerout', event => { if (!event.relatedTarget) clearQuoteProximity(); });
quotePointerMedia.addEventListener('change', clearQuoteProximity);
quoteDialog.addEventListener('close', clearQuoteProximity);
document.querySelectorAll('[data-quote-open]').forEach(button => button.addEventListener('click', clearQuoteProximity));
