<template>
  <div class="flex flex-col items-stretch">
    <ColorPicker
      @update:model-value="updateColor"
      :model-value="portfolio.color"
      format="rgb" />
    <AssetAllocation @update="updateAsset" :assets="portfolio.assets" />
    <AssetSearch
      v-show="showAssetSearch"
      @select="addAsset"
      label="Add asset"
      class="mt-3" />
    <Button
      @click="savePortfolio"
      label="Save"
      size="small" />
    <Button
      @click="showAssetSearch = true"
      label="Add asset"
      size="small"
      icon="pi pi-plus"
      class="mt-3 self-center"
      outlined />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from 'primevue/button';
import ColorPicker from 'primevue/colorpicker';
import db from '@/database';
import type { Portfolio, PortfolioAsset } from '@/models';
import AssetAllocation from './AssetAllocation.vue';
import AssetSearch from './AssetSearch.vue';

type Color = { r: number; g: number; b: number };

const emit = defineEmits(['update']);
const { portfolio } = defineProps<{ portfolio: Portfolio }>();
const showAssetSearch = ref(false);

function addAsset(asset: PortfolioAsset): void {
  const isAlreadyAdded = portfolio.assets.some(it => it.symbol === asset.symbol);
  if (isAlreadyAdded) {
    showAssetSearch.value = false;
    return;
  }
  const percentage = portfolio.assets.length ? 0 : 100;
  const updated = [...portfolio.assets, { ...asset, percentage }];
  emit('update', { ...portfolio, assets: updated });
  showAssetSearch.value = false;
}

function savePortfolio(): void {
  db.savePortfolio(portfolio.name, portfolio);
}

function updateAsset(asset: PortfolioAsset): void {
  const updated = portfolio.assets.map(it => it.symbol === asset.symbol ? asset : it);
  emit('update', { ...portfolio, assets: updated });
}

function updateColor(color: Color): void {
  emit('update', { ...portfolio, color: `rgba(${color.r},${color.g}, ${color.b}, 1)` });
}
</script>
