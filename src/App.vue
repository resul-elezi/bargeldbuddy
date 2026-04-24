<script setup>
import { ref } from 'vue';
import { transactionStore } from './store/transactionStore.js';
import { formatCurrency } from './utils/currencyHelper.js';
import TransactionForm from './components/TransactionForm.vue';

const isFormOpen = ref(false);
</script>

<template>
  <div class="min-h-screen bg-base-100 p-4 pb-24"> <!-- pb-24 für Platz unten -->
    
    <header class="py-8 text-center">
      <h1 class="text-4xl font-black tracking-tight text-slate-900">Bargeld<span class="text-primary">Buddy</span></h1>
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
      <h2 class="text-sm font-black uppercase tracking-widest text-slate-400 px-1">Letzte Buchungen</h2>

      <section class="max-w-md mx-auto mb-8">
        <div class="stats shadow-sm w-full bg-white rounded-3xl border border-black/5 overflow-hidden">
          
          <!-- Gesamter Verbrauch (Ausgaben) -->
          <div class="stat">
            <div class="stat-title text-xs font-bold uppercase tracking-wider">Verbrauch</div>
            <div class="stat-value text-error text-xl">
              {{ formatCurrency(transactionStore.totalExpenses, transactionStore.settings.currency) }}
            </div>
            <div class="stat-desc mt-1">Diesen Monat</div>
          </div>
          
          <!-- Was übrig ist (Bilanz) -->
          <div class="stat border-l border-slate-50">
            <div class="stat-title text-xs font-bold uppercase tracking-wider">Übrig</div>
            <div class="stat-value text-slate-900 text-lg" :class="transactionStore.balance < 0 ? 'text-error' : 'text-success'">
              {{ formatCurrency(transactionStore.balance, transactionStore.settings.currency) }}
            </div>
            <div class="stat-desc mt-1 italic">Vom Lohn</div>
          </div>
      
        </div>
      </section>
      
      <!-- Liste -->
      <div v-if="transactionStore.transactions.length === 0" class="text-center py-12 bg-white/50 rounded-3xl border-2 border-dashed border-slate-200">
         <p class="opacity-40 italic">Noch nichts notiert...</p>
      </div>

      <div class="space-y-3">
        <div 
          v-for="t in transactionStore.transactions" 
          :key="t.id"
          class="flex items-center justify-between bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div>
            <p class="font-bold text-slate-800">{{ t.description }}</p>
            <p class="text-xs opacity-40">{{ new Date(t.timestamp).toLocaleDateString() }}</p>
          </div>
          <div class="text-right">
            <p :class="t.type === 'expense' ? 'text-red-500' : 'text-green-500'" class="font-black text-lg">
              {{ t.type === 'expense' ? '-' : '+' }} {{ formatCurrency(t.amount, t.currency || transactionStore.settings.currency) }}
            </p>
          </div>
          <!-- Der Löschen-Button -->
          <button 
          @click="transactionStore.deleteTransaction(t.id)"
          class="btn btn-ghost btn-circle btn-xs text-error opacity-30 group-hover:opacity-100 transition-opacity"
          title="Löschen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          </button>
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
      @click="isFormOpen = true"
      class="fixed bottom-8 right-8 btn btn-primary btn-circle btn-lg shadow-2xl text-2xl z-40"
    >
      +
    </button>

    <!-- Modal-Overlay -->
    <div v-if="isFormOpen" class="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-end sm:items-center p-4">
      <TransactionForm @close="isFormOpen = false" />
    </div>

  </div>
</template>