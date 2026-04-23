/**
 * Konvertiert einen Anzeige-String (z.B. "12,50") in Cents (1250)
 */
export const toCents = (amount) => {
    return Math.round(parseFloat(amount.toString().replace(',', '.')) * 100);
  };
  
  /**
   * Formatiert Cents zurück in die lokale Währung (z.B. "12,50 €")
   */
  export const formatCurrency = (cents) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(cents / 100);
  };