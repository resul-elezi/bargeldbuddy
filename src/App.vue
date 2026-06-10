<script setup>
import { ref } from 'vue';
import { transactionStore } from './store/transactionStore.js';
import { formatCurrency } from './utils/currencyHelper.js';
import TransactionForm from './components/TransactionForm.vue';

const isFormOpen = ref(false);

// Variable für die Buchung, die bearbeitet wird
const transactionToEdit = ref(null);
const transactionIdToDelete = ref(null);

// Öffnet das Formular im Bearbeitungs-Modus
const openEditModal = (transaction) => {
  transactionToEdit.value = { ...transaction };
  isFormOpen.value = true; // Nutzt das gleiche Overlay!
};

// Macht aus "2026-06" ein lesbares "Juni 2026"
const formatFilterMonth = (yearMonthStr) => {
  const [year, month] = yearMonthStr.split('-');
  const date = new Date(year, month - 1);
  return date.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
};

// Blättert Monate vor oder zurück
const changeMonth = (direction) => {
  const [year, month] = transactionStore.currentMonthFilter.split('-').map(Number);
  // Wir erstellen ein neues Datum und addieren/subtrahieren einen Monat
  const newDate = new Date(year, month - 1 + direction, 1);
  
  const newYear = newDate.getFullYear();
  const newMonth = String(newDate.getMonth() + 1).padStart(2, '0');
  
  // Setzt den neuen Filter im Store (z.B. "2026-05")
  transactionStore.setMonthFilter(`${newYear}-${newMonth}`);
};

// Schließt das Formular (egal ob neu oder edit) und resettet den Zustand
const closeForm = () => {
  isFormOpen.value = false;
  transactionToEdit.value = null;
};

// Löschen-Modal bleibt über ID gesteuert (das funktioniert super)
const openDeleteModal = (id) => {
  transactionIdToDelete.value = id;
  const modal = document.getElementById('delete-modal');
  if (modal) {
    modal.showModal();
  }
};

const confirmDelete = () => {
  if (transactionIdToDelete.value !== null) {
    transactionStore.deleteTransaction(transactionIdToDelete.value);
    transactionIdToDelete.value = null;
  }
  
  const modal = document.getElementById('delete-modal');
  if (modal) {
    modal.close();
  }
};

// Export function
const exportToPDF = () => {
  // Setzt den Titel des Browser-Tabs kurz um, damit die PDF-Datei automatisch einen schönen Namen bekommt
  const originalTitle = document.title;
  const currentMonth = formatFilterMonth(transactionStore.currentMonthFilter);
  document.title = `BargeldBuddy_Report_${currentMonth.replace(' ', '_')}`;
  
  // Öffnet das native Druckfenster / "Als PDF speichern"
  window.print();
  
  // Setzt den Tab-Titel wieder zurück
  document.title = originalTitle;
};

</script>

<template>
  <div class="min-h-screen bg-base-100 p-4"> <!-- pb-24 für Platz unten -->
    
    <header class="py-8 text-center">
      <h1 class="text-4xl font-black tracking-tight text-base-content">Bargeld<span class="text-primary">Buddy</span></h1>
      <!-- <p class="text-sm opacity-70">So einfach wie Papier.</p> -->
      <div class="badge badge-ghost font-mono mt-1 opacity-50">v0.1 MVP</div>
      
      <div class="flex justify-center gap-2 mt-2">
        <button 
          @click="transactionStore.setCurrency('CHF')" 
          :class="transactionStore.settings.currency === 'CHF' ? 'badge-primary' : 'badge-ghost'"
          class="badge cursor-pointer"
        >
          CHF
        </button>
        <button 
          @click="transactionStore.setCurrency('EUR')" 
          :class="transactionStore.settings.currency === 'EUR' ? 'badge-primary' : 'badge-ghost'"
          class="badge cursor-pointer"
        >
          EUR
        </button>
      </div>
    </header>


    <main class="max-w-md mx-auto space-y-6">
      <!-- Datum Bereich -->

    <div class="flex items-center justify-between bg-base-100 p-3 rounded-2xl shadow-sm max-w-md mx-auto border border-black/5">
      <button 
        @click="changeMonth(-1)" 
        class="btn btn-ghost btn-circle btn-sm font-bold text-lg"
      >
        ‹
      </button>
      
      <div class="text-center">
        <span class="text-sm font-black uppercase tracking-wider text-base-content">
          {{ formatFilterMonth(transactionStore.currentMonthFilter) }}
        </span>
      </div>
      
      <button 
        @click="changeMonth(1)" 
        class="btn btn-ghost btn-circle btn-sm font-bold text-lg"
      >
        ›
      </button>
    </div>
    
    <div class="flex items-center justify-between px-1 mb-4 print:hidden">
      <h2 class="text-sm font-black uppercase tracking-widest text-(--color-bookings-heading)">
        Letzte Buchungen
      </h2>
      
      <!-- Der PDF-Export-Button (wird beim Drucken selbst versteckt) -->
      <button 
        @click="exportToPDF" 
        class="btn btn-ghost btn-xs text-xs opacity-60 hover:opacity-100 flex items-center gap-1"
      >
        <span class="text-sm">📄</span> PDF Export
      </button>
    </div>


    <section class="max-w-md mx-auto mb-8">
      <div class="stats stats-vertical sm:stats-horizontal shadow-sm w-full bg-base-100 rounded-3xl border border-black/5 overflow-hidden">
        
        <!-- Gesamter Verbrauch (Ausgaben) -->
        <div class="stat">
          <div class="stat-title text-xs font-bold uppercase tracking-wider">Verbrauch</div>
          <div class="stat-value text-error text-2xl">
            {{ formatCurrency(transactionStore.totalExpenses, transactionStore.settings.currency) }}
          </div>
          <div class="stat-desc mt-1">Diesen Monat</div>
        </div>
        
        <!-- Was übrig ist (Bilanz) -->
        <div class="stat border-l border-slate-50">
          <div class="stat-title text-xs font-bold uppercase tracking-wider">Übrig</div>
          <div class="stat-value text-2xl" :class="transactionStore.balance < 0 ? 'text-error' : 'text-success'">
                  {{ formatCurrency(transactionStore.balance, transactionStore.settings.currency) }}
                </div>
          <div class="stat-desc mt-1 italic">Vom Lohn</div>
        </div>

      </div>
    </section>
      
      
      <!-- Liste -->
      <div v-if="transactionStore.filteredTransactions.length === 0" class="text-center py-12 bg-white/50 rounded-3xl border-2 border-dashed border-base-200">
         <p class="opacity-40 italic">In diesem Monat noch nichts notiert...</p>
      </div>

      <div class="space-y-3">
        <div 
          v-for="t in transactionStore.filteredTransactions" 
          :key="t.id"
          class="flex items-center justify-between bg-base-100 p-4 sm:p-5 rounded-2xl shadow-sm"
        >
        <div class="flex-1 min-w-0 pr-2">
          <p class="font-bold text-base-content truncate text-sm sm:text-base">{{ t.description }}</p>
          <div class="flex items-center gap-2">
            <p class="text-[10px] opacity-40 uppercase tracking-tighter">
              {{ new Date(t.timestamp).toLocaleDateString() }}
            </p>
            <span class="text-[9px] px-1.5 py-0.5 rounded bg-base-200 text-base-content font-bold uppercase">
              {{ t.paymentMethod === 'cash' ? 'Bar' : t.paymentMethod === 'card' ? 'Karte' : 'Andere' }}
            </span>
          </div>
        </div>

          <div class="text-right">
            <p :class="t.type === 'expense' ? 'text-(--text-red)' : 'text-success'" class="font-black text-lg">
              {{ t.type === 'expense' ? '-' : '+' }} {{ formatCurrency(t.amount, t.currency || transactionStore.settings.currency) }}
            </p>
          </div>
          <!-- Der Edit-Button -->
          <div class="flex items-center gap-1 ml-1">
            <button 
            @click="openEditModal(t)"
            class="btn btn-ghost btn-circle btn-xs text-base-content/40 shadow-xs/10"
            title="Bearbeiten"
          >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-3.5 w-3.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
              </svg>
            </button>
          <!-- Der Löschen-Button -->
          <button 
          @click="openDeleteModal(t.id)"
          class="btn btn-ghost btn-circle btn-xs text-error/40 shadow-xs/10"
          title="Löschen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
         </button>
         </div>
        </div>
      </div>

      <!-- Reset Bereich -->
      <div v-if="transactionStore.transactions.length > 0" class="pt-12 pb-8 text-center">
        <button 
          @click="transactionStore.clearAllTransactions()" 
          class="btn btn-ghost btn-xs opacity-30 hover:opacity-100 transition-opacity"
        >
          Alle Daten zurücksetzen
        </button>
      </div>
    </main>

    <!-- Floating Action Button -->
    <button 
  @click="transactionToEdit = null; isFormOpen = true"
      class="fixed bottom-8 right-8 btn btn-primary btn-circle btn-lg shadow-2xl text-2xl z-40"
    >
      +
    </button>

    <div v-if="isFormOpen" class="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-2">
        
        <TransactionForm 
          :editTransaction="transactionToEdit" 
          @close="closeForm" 
        />
        
    </div>

  </div> 
  <dialog id="delete-modal" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box bg-base-100 rounded-3xl border border-black/5">
      <h3 class="text-lg font-bold text-base-content">Buchung löschen?</h3>
      <p class="py-4 text-sm text-bookings-heading">
        Möchtest du diese Buchung wirklich unwiderruflich entfernen?
      </p>
      <div class="modal-action grid grid-cols-2 gap-3">
        <form method="dialog">
          <button class="btn btn-ghost w-full rounded-2xl bg-base-200">Abbrechen</button>
        </form>
        <button @click="confirmDelete" class="btn btn-error text-white rounded-2xl shadow-none">
          Löschen
        </button>
      </div>
    </div>
  </dialog>
</template>
