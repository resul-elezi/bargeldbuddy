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
      timestamp: Date.now(),
      amount: data.amount,       // Erwartet Integer (Cents)
      type: data.type,           // 'income' oder 'expense'
      description: data.description,
      paymentMethod: data.paymentMethod || 'cash',
      currency: this.settings.currency
    };
    
    // Neue Einträge kommen nach oben (unshift statt push)
    this.transactions.unshift(newEntry);
  },

  // Methode: Eintrag löschen (für später wichtig)
  deleteTransaction(id) {
    this.transactions = this.transactions.filter(t => t.id !== id);
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