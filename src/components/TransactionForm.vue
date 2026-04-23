<script setup>
import { ref, reactive } from 'vue';
import { transactionStore } from '../store/transactionStore.js';
import { toCents } from '../utils/currencyHelper.js';

const emit = defineEmits(['close']);

// Lokaler State für das Formular
const form = reactive({
  amount: '',
  description: '',
  type: 'expense',
  paymentMethod: 'cash'
});

const submit = () => {
  if (!form.amount || !form.description) return;

  transactionStore.addTransaction({
    amount: toCents(form.amount),
    type: form.type,
    description: form.description,
    paymentMethod: form.paymentMethod
  });

  // Formular zurücksetzen
  form.amount = '';
  form.description = '';
  emit('close');
};
</script>

<template>
  <div class="bg-white p-6 rounded-3xl shadow-xl border border-black/5">
    <div class="flex gap-4 mb-6">
      <button 
        @click="form.type = 'expense'"
        :class="form.type === 'expense' ? 'btn-error' : 'btn-ghost'"
        class="btn flex-1 rounded-2xl"
      >
        Ausgabe
      </button>
      <button 
        @click="form.type = 'income'"
        :class="form.type === 'income' ? 'btn-success' : 'btn-ghost'"
        class="btn flex-1 rounded-2xl"
      >
        Einnahme
      </button>
    </div>

    <div class="form-control w-full space-y-4">
      <input 
        v-model="form.amount" 
        type="number" 
        step="0.01" 
        placeholder="0,00 €" 
        class="input input-bordered input-lg w-full text-center text-2xl font-bold rounded-2xl" 
      />

      <input 
        v-model="form.description" 
        type="text" 
        placeholder="Was hast du gekauft?" 
        class="input input-bordered w-full rounded-2xl" 
      />

      <button @click="submit" class="btn btn-primary btn-block rounded-2xl text-lg">
        Speichern
      </button>
    </div>
  </div>
</template>