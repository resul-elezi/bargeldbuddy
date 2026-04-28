<script setup>
import { reactive, onMounted, ref } from 'vue';
import { transactionStore } from '../store/transactionStore.js';
import { toCents } from '../utils/currencyHelper.js';

const emit = defineEmits(['close']);
const amountInput = ref(null);

const form = reactive({
  amount: '',
  description: '',
  type: 'expense',
  paymentMethod: 'cash', // 'cash', 'card', 'other'
  date: new Date().toISOString().substr(0, 10) // Heute als Standard
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
    paymentMethod: form.paymentMethod,
    date: form.date // Wir geben das gewählte Datum mit
  });

  emit('close');
};
</script>

<template>
  <!-- Card-Design für das Formular -->
  <div class="bg-white p-6 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-black/5 w-full max-w-md mx-auto">
    <!-- Einnahme/Ausgabe Toggle -->
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

    <div class="space-y-5">
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
        <p class="text-xs opacity-40 mt-1 uppercase tracking-widest font-bold">
          {{ transactionStore.settings.currency }}
          <!-- {{ transactionStore.settings.currency === 'CHF' ? 'CHF' : 'Euro' }} -->
        </p>
      </div>
      <!-- Beschreibung -->
      <input 
        v-model="form.description"
        type="text"
        placeholder="Wofür? (z.B. Einkauf, Miete...)"
        class="input-field w-full rounded-2xl bg-slate-50 border-none outline-primary"
      />

      <!-- NEU: Datum -->
      <div class="flex flex-col gap-1">
        <label class="text-[10px] font-bold uppercase opacity-40 ml-2">Datum</label>
        <input v-model="form.date" type="date" class="input-field w-full rounded-2xl bg-slate-50 border-none outline-primary" />
      </div>

      <!-- NEU: Zahlungsart -->
      <div class="flex flex-col gap-1">
        <label class="text-[10px] font-bold uppercase opacity-40 ml-2">Zahlungsart</label>
        <div class="grid grid-cols-3 gap-2">
          <button @click="form.paymentMethod = 'cash'" :class="form.paymentMethod === 'cash' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'" class="py-2 rounded-xl text-xs font-bold transition-all">Bar</button>
          <button @click="form.paymentMethod = 'card'" :class="form.paymentMethod === 'card' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'" class="py-2 rounded-xl text-xs font-bold transition-all">Karte</button>
          <button @click="form.paymentMethod = 'other'" :class="form.paymentMethod === 'other' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'" class="py-2 rounded-xl text-xs font-bold transition-all">Andere</button>
        </div>
      </div>

      <!-- Buttons -->
      <div class="grid grid-cols-2 gap-2">
        <button @click="emit('close')" class="btn btn-ghost rounded-2xl">Abbrechen</button>
        <button @click="save" class="btn btn-primary rounded-2xl text-white">Speichern</button>
      </div>
    </div>
  </div>
</template>