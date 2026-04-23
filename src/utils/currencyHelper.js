/**
 * Konvertiert einen Anzeige-String (z.B. "12.50") in Cents (1250)
 */
export const toCents = (amount) => {
  if (!amount) return 0;
  // Ersetzt Komma durch Punkt für die Berechnung
  return Math.round(parseFloat(amount.toString().replace(',', '.')) * 100);
};

/**
 * Formatiert Cents zurück in die lokale Währung
 * @param {number} cents 
 * @param {string} currency - 'EUR', 'CHF', etc.
 */
export const formatCurrency = (cents, currency = 'CHF') => {
  return new Intl.NumberFormat('de-CH', { // 'de-CH' sorgt für Schweizer Formatierung (z.B. 1'000.00)
    style: 'currency',
    currency: currency,
  }).format(cents / 100);
};