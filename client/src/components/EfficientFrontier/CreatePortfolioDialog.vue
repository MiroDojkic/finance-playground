<template>
  <Dialog @update:visible="toggleDialog" :visible="open" header="Create portfolio">
    <div class="flex flex-col min-w-80">
      <label class="flex flex-col pb-3">
        Name
        <InputText v-model="name" />
      </label>
      <AssetSearch @select="addAsset" label="Add asset" class="flex-1" />
      <AssetAllocation
        @add="addAsset"
        @update="updateAsset"
        :assets="assets"
        class="pt-3 pb-8" />
      <Button @click="save">Create</Button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dialog from 'primevue/dialog';
import type { PortfolioAsset } from '@/models';
import AssetSearch from './AssetSearch.vue';
import AssetAllocation from './AssetAllocation.vue';

defineProps<{ open: boolean; }>();
const emit = defineEmits(['close', 'save']);
const name = ref('');
const assets = ref<PortfolioAsset[]>([]);

function addAsset(asset: PortfolioAsset) {
  const isAlreadyAdded = assets.value.some(it => it.symbol === asset.symbol);
  if (isAlreadyAdded) return;
  const percentage = assets.value.length ? 0 : 100;
  assets.value.push({ ...asset, percentage });
}

function updateAsset(asset: PortfolioAsset) {
  assets.value = assets.value.map(it => it.symbol === asset.symbol ? asset : it);
}

function save() {
  emit('save', {
    name: name.value,
    assets: assets.value,
    color: 'rgba(3, 138, 255, 1)'
  });
  close();
}

function toggleDialog(open: boolean) {
  if (!open) close();
}

function close() {
  name.value = '';
  assets.value = [];
  emit('close');
}
</script>
