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
        <div class="stats">
          
          <div class="stat">
            <div class="stat-title">Verbrauch</div>
            <div class="stat-value text-error">
              {{ formatCurrency(transactionStore.totalExpenses, transactionStore.settings.currency) }}
            </div>
            <div class="stat-desc">Diesen Monat</div>
          </div>
          
          <div class="stat">
            <div class="stat-title">Übrig</div>
            <div class="stat-value" :class="transactionStore.balance < 0 ? 'text-error' : 'text-success'">
              {{ formatCurrency(transactionStore.balance, transactionStore.settings.currency) }}
            </div>
            <div class="stat-desc italic">Vom Lohn</div>
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
        <div class="flex-1 min-w-0 pr-2">
          <p class="font-bold text-slate-800 truncate text-sm sm:text-base">{{ t.description }}</p>
          <div class="flex items-center gap-2">
            <p class="text-[10px] opacity-40 uppercase font-medium">
              {{ new Date(t.timestamp).toLocaleDateString() }}
            </p>
            <span class="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-bold uppercase">
              {{ t.paymentMethod === 'cash' ? 'Bar' : t.paymentMethod === 'card' ? 'Karte' : 'Andere' }}
            </span>
          </div>
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