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
    </header>

    <main class="max-w-md mx-auto space-y-6">
      <h2 class="text-sm font-black uppercase tracking-widest text-slate-400 px-1">Letzte Buchungen</h2>
      
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
              {{ t.type === 'expense' ? '-' : '+' }} {{ formatCurrency(t.amount) }}
            </p>
          </div>
        </div>
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