<template>
  <Dialog
    :visible="open"
    header="Load portfolio">
    <Listbox
      @update:model-value="select"
      :model-value="selected"
      :options="portfolios" />
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Dialog from 'primevue/dialog';
import Listbox from 'primevue/listbox';
import db from '@/database';

defineProps<{ open: boolean; }>();
const emit = defineEmits(['load']);
const selected = ref();

const portfolios = db.listPortfolios();

function select(value: string): void {
  emit('load', value);
}
</script>
