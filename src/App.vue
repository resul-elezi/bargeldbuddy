<script setup>
import { ref } from 'vue'; // ref hinzufügen
import { transactionStore } from './store/transactionStore.js';
import { formatCurrency } from './utils/currencyHelper.js';
import TransactionForm from './components/TransactionForm.vue'; // Importieren

const showForm = ref(false);

// Eine kleine Test-Funktion, um zu sehen, ob der Store & LocalStorage arbeiten
const addTestEntry = () => {
  transactionStore.addTransaction({
    amount: 1550, // 15,50 €
    type: 'expense',
    description: 'Test-Kauf (Bäcker)',
    paymentMethod: 'cash'
  });
};
</script>

<template>
  <div class="min-h-screen bg-base-100 p-4 font-sans text-slate-800">
    
    <header class="mb-8 mt-4 text-center">
      <h1 class="text-3xl font-bold tracking-tight text-primary">BargeldBuddy</h1>
      <p class="text-sm opacity-70">So einfach wie Papier.</p>
    </header>

    <main class="mx-auto max-w-md">
      <div class="flex justify-center mb-8">
        <button 
          v-if="!showForm"
          @click="showForm = true" 
          class="btn btn-primary btn-circle btn-lg shadow-2xl fixed bottom-8 right-8 z-50 text-2xl"
        >
          +
        </button>
      </div>
      
      <div v-if="showForm" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
        <div class="w-full max-w-md">
          <TransactionForm @close="showForm = false" />
          <button @click="showForm = false" class="btn btn-ghost btn-block mt-2 text-white">Abbrechen</button>
        </div>
      </div>

      <div class="space-y-3">
        <h2 class="text-lg font-semibold px-1">Letzte Buchungen</h2>
        
        <div v-if="transactionStore.transactions.length === 0" class="text-center py-10 opacity-50 italic">
          Noch keine Einträge vorhanden.
        </div>

        <div 
          v-for="t in transactionStore.transactions" 
          :key="t.id" 
          class="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-black/5"
        >
          <div>
            <p class="font-medium">{{ t.description }}</p>
            <p class="text-xs opacity-50">{{ new Date(t.timestamp).toLocaleTimeString() }} Uhr</p>
          </div>
          <span :class="t.type === 'expense' ? 'text-error' : 'text-success'" class="font-bold text-lg">
            {{ t.type === 'expense' ? '-' : '+' }} {{ formatCurrency(t.amount) }}
          </span>
        </div>
      </div>
    </main>

  </div>
</template>

<style>
/* Hier brauchen wir aktuell kein extra CSS, da alles über Tailwind & style.css kommt */
</style>
