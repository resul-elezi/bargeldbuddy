/**
 * Konvertiert einen Anzeige-String (z.B. "12.50") in Cents (1250)
 */
export const toCents = (amount) => {
  if (!amount) return 0;
  const normalized = amount.toString().replace(',', '.');
  return Math.round(parseFloat(normalized) * 100);
};

/**
 * Formatiert Cents zurück in die lokale Währung
 * @param {number} cents 
 * @param {string} currency - 'CHF' oder 'EUR'
 */
export const formatCurrency = (cents, currency = 'CHF') => {
  // de-CH für Franken (1'250.00), de-DE für Euro (1.250,00)
  const locale = currency === 'CHF' ? 'de-CH' : 'de-DE';
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(cents / 100);
  } catch (e) {
    // Falls mal eine ungültige Währung reinkommt, fallen wir auf CHF zurück
    return new Intl.NumberFormat('de-CH', {
      style: 'currency',
      currency: 'CHF',
    }).format(cents / 100);
  }
};