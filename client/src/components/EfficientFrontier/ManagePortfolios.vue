<template>
  <ul>
    <li
      v-for="portfolio in portfolios"
      :key="portfolio.name"
      class="flex flex-col">
      <span class="flex justify-between items-center">
        {{ portfolio.name }}
        <Button
          @click="showAssetSearch = true"
          aria-label="Add asset"
          size="small"
          icon="pi pi-plus"
          class="self-center"
          outlined />
      </span>
      <AssetAllocation
        @update="updateAsset(portfolio, $event)"
        :assets="portfolio.assets" />
      <AssetSearch
        v-show="showAssetSearch"
        @select="addAsset(portfolio, $event)"
        label="Add asset"
        class="mt-3 mr-8"/>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from 'primevue/button';
import type { Portfolio, PortfolioAsset } from '@/models';
import AssetAllocation from './AssetAllocation.vue';
import AssetSearch from './AssetSearch.vue';

const emit = defineEmits(['create', 'update']);
defineProps<{ portfolios: Portfolio[] }>();
const showAssetSearch = ref(false);


function addAsset(portfolio: Portfolio, asset: PortfolioAsset) {
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

function updateAsset(portfolio: Portfolio, asset: PortfolioAsset) {
  const updated = portfolio.assets.map(it => it.symbol === asset.symbol ? asset : it);
  emit('update', { ...portfolio, assets: updated });
}
</script>
