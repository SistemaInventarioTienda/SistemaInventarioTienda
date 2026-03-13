/**
 * Formatea un número de teléfono de 8 dígitos al formato 0000-0000.
 * @param {string|number} phone - El número de teléfono a formatear.
 * @returns {string} - El teléfono formateado.
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return 'Sin Información';
  const cleaned = ('' + phone).replace(/\D/g, '');
  if (cleaned.length === 8) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
  }
  return cleaned;
};

/**
 * Formatea una cantidad numérica como precio con separador de miles (espacio)
 * y decimales (coma).
 * @param {number|string} amount - La cantidad a formatear.
 * @returns {string} - El precio formateado.
 */
export const formatPrice = (amount) => {
  if (amount === null || amount === undefined || amount === '') return '0,00';
  
  const numericAmount = Number(amount);
  if (isNaN(numericAmount)) return amount;

  // Usamos fr-FR porque usa espacio como separador de miles y coma como decimal
  return numericAmount.toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).replace(/\u00a0/g, ' '); // Reemplazar espacio de no ruptura por espacio normal
};
