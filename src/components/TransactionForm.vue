<script setup>
import { reactive, onMounted, ref } from 'vue';
import { transactionStore } from '../store/transactionStore.js';
import { toCents } from '../utils/currencyHelper.js';

const emit = defineEmits(['close']);
const amountInput = ref(null);

const form = reactive({
  amount: '',
  description: '',
  type: 'expense', // Standard: Ausgabe
  paymentMethod: 'cash'
});

// Fokus direkt auf das Betragsfeld beim Öffnen
onMounted(() => {
  amountInput.value?.focus();
});

const save = () => {
  if (!form.amount || !form.description) return;

  transactionStore.addTransaction({
    amount: toCents(form.amount),
    type: form.type,
    description: form.description,
    paymentMethod: form.paymentMethod
  });

  emit('close');
};
</script>

<template>
  <!-- Card-Design für das Formular -->
  <div class="bg-white p-6 rounded-3xl shadow-2xl border border-black/5 w-full max-w-md mx-auto">
    <div class="flex gap-2 mb-6 p-1 bg-slate-100 rounded-2xl">
      <button 
        @click="form.type = 'expense'"
        :class="form.type === 'expense' ? 'bg-white shadow-sm text-error' : 'text-slate-500'"
        class="flex-1 py-2 rounded-xl font-bold transition-all"
      >
        Ausgabe
      </button>
      <button 
        @click="form.type = 'income'"
        :class="form.type === 'income' ? 'bg-white shadow-sm text-success' : 'text-slate-500'"
        class="flex-1 py-2 rounded-xl font-bold transition-all"
      >
        Einnahme
      </button>
    </div>

    <div class="space-y-4">
      <!-- Betrag mit decimal inputmode für die mobile Tastatur -->
      <div class="text-center">
        <input 
          ref="amountInput"
          v-model="form.amount"
          type="number"
          inputmode="decimal"
          placeholder="0.00"
          class="text-5xl font-black text-center w-full bg-transparent outline-none text-primary"
        />
        <p class="text-xs opacity-40 mt-1 uppercase tracking-widest font-bold">{{ transactionStore.settings.currency === 'CHF' ? 'Schweizer Franken' : 'Euro' }}</p>
      </div>

      <input 
        v-model="form.description"
        type="text"
        placeholder="Wofür?"
        class="input input-bordered w-full rounded-2xl bg-slate-50 border-none focus:ring-2 ring-primary"
      />

      <div class="grid grid-cols-2 gap-2">
        <button @click="emit('close')" class="btn btn-ghost rounded-2xl">Abbrechen</button>
        <button @click="save" class="btn btn-primary rounded-2xl">Speichern</button>
      </div>
    </div>
  </div>
</template>