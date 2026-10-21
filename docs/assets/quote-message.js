(function (root) {
  'use strict';
  const clean = value => String(value || '').replace(/\r/g, '').trim();
  const line = value => clean(value).replace(/\n+/g, ' ');
  const list = (items, fallback) => Array.isArray(items) && items.length ? items.map(line).join(', ') : fallback;
  function formatDate(value) {
    const match = line(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    return match ? `${match[3]}/${match[2]}/${match[1]}` : 'Por definir';
  }
  function buildQuoteMessage(data) {
    return [
      'SOLICITUD DE COTIZACIÓN · MDC', '',
      'PROYECTO',
      `Nombre: ${line(data.project)}`,
      `Tipo: ${line(data.sector)}`,
      `Ubicación: ${line(data.location)}`,
      `Etapa: ${line(data.stage) || 'Por definir'}`,
      `Modalidad: ${line(data.modality) || 'Por definir'}`, '',
      'SERVICIOS SOLICITADOS', list(data.services, 'Por definir'), '',
      'ALCANCE DEL TRABAJO', clean(data.scope), '',
      'ENTREGABLES Y PLAZO',
      `Entregables: ${list(data.deliverables, 'A coordinar')}`,
      `Plazo requerido: ${line(data.deadline)}`,
      `Inicio deseado: ${formatDate(data.startDate)}`,
      `Documentación: ${line(data.documents) || 'Por confirmar'}`,
      `Presupuesto estimado: ${line(data.budget) || 'Por definir'}`, '',
      'CONTACTO',
      `Nombre: ${line(data.clientName)}`,
      `Empresa: ${line(data.company) || 'No indicada'}`,
      `Teléfono / WhatsApp: ${line(data.clientPhone)}`,
      `Correo: ${line(data.email) || 'No indicado'}`, '',
      'Solicitud preparada desde la web de MDC.'
    ].join('\n');
  }
  function isValidClientPhone(value) {
    const text = line(value);
    const digits = text.replace(/\D/g, '');
    return /^\+?[0-9\s().-]+$/.test(text) && digits.length >= 8 && digits.length <= 15;
  }
  function createWhatsAppUrl(number, data) {
    const digits = String(number).replace(/\D/g, '');
    if (!/^\d{8,15}$/.test(digits)) throw new Error('Número de WhatsApp inválido.');
    return `https://wa.me/${digits}?text=${encodeURIComponent(buildQuoteMessage(data))}`;
  }
  const api = { buildQuoteMessage, createWhatsAppUrl, isValidClientPhone };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.MDCQuote = api;
})(typeof window !== 'undefined' ? window : globalThis);
