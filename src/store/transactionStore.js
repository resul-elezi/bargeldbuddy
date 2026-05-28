import { reactive, watch } from 'vue';
import { v4 as uuidv4 } from 'uuid';

// 1. Wir definieren den Key für den LocalStorage
const STORAGE_KEY = 'bargeldbuddy_data';

// 2. Wir versuchen, bestehende Daten zu laden
const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

// 3. Das Herzstück: Der reaktive Store
export const transactionStore = reactive({
  // Unsere Liste mit allen Buchungen
  transactions: savedData,

  // Neue Settings-Sektion
  settings: JSON.parse(localStorage.getItem('bb_settings')) || { currency: 'CHF' },

  // Berechnete Werte (Getters)
  get totalIncome() {
    return this.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  },
  get totalExpenses() {
    return this.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  },

  get balance() {
    return this.totalIncome - this.totalExpenses;
  },

  // Methode zum Ändern der Währung
  setCurrency(newSymbol) {
    this.settings.currency = newSymbol;
    localStorage.setItem('bb_settings', JSON.stringify(this.settings));
  },

  // Methode: Neuen Eintrag hinzufügen
  addTransaction(data) {
    const newEntry = {
      id: uuidv4(),
      // Wir nehmen das Datum vom User oder "jetzt" als Fallback
      timestamp: data.date ? new Date(data.date).getTime() : Date.now(),
      amount: data.amount,
      type: data.type,
      description: data.description,
      paymentMethod: data.paymentMethod, // Jetzt aktiv genutzt!
      currency: this.settings.currency 
    };
    this.transactions.unshift(newEntry);
    // Optional: Nach Datum sortieren, falls User ein Datum in der Vergangenheit wählt
    this.transactions.sort((a, b) => b.timestamp - a.timestamp);
  },

  // Methode: Eintrag löschen (Reaktivität bleibt erhalten!)
  deleteTransaction(id) {
    const index = this.transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      this.transactions.splice(index, 1);
    }
  },
  clearAllTransactions() {
    if (confirm('Möchtest du wirklich alle Buchungen löschen? Dies kann nicht rückgängig gemacht werden.')) {
      this.transactions.length = 0; // Leert das reaktive Array sauber
    }
  },
  // Aktion zum Aktualisieren einer bestehenden Transaktion
  updateTransaction(updatedTransaction) {
    const index = this.transactions.findIndex(t => t.id === updatedTransaction.id);
    if (index !== -1) {
      // Wir überschreiben das Objekt direkt an seinem Platz im Array
      this.transactions[index] = {
        ...this.transactions[index],
        amount: updatedTransaction.amount,
        type: updatedTransaction.type,
        description: updatedTransaction.description,
        paymentMethod: updatedTransaction.paymentMethod,
        // Wir konvertieren das geänderte Datum wieder zurück in einen Timestamp
        timestamp: updatedTransaction.date ? new Date(updatedTransaction.date).getTime() : Date.now()
      };
      
      // Nach dem Update neu sortieren, falls das Datum geändert wurde
      this.transactions.sort((a, b) => b.timestamp - a.timestamp);
    }
  }
});

// 4. Der "Autosave" (Watcher)
// Jedes Mal, wenn sich das Array ändert, speichern wir es offline
watch(
  () => transactionStore.transactions,
  (newVal) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal));
  },
  { deep: true } // "deep" ist wichtig, um Änderungen innerhalb des Arrays zu erkennen
);