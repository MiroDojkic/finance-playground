<template>
  <div class="card flex flex-col justify-center">
    <ul class="pt-1">
      <li v-for="asset in assets" :key="asset.symbol" class="pr-1 py-2">
        <AssetPercentageSlider
          @change="updatePercentage(asset, $event)"
          :asset="asset"
        />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PortfolioAsset } from '@/models';
import AssetPercentageSlider from './AssetPercentageSlider.vue';

const emit = defineEmits(['add', 'update']);
const { assets } = defineProps<{ assets: PortfolioAsset[] }>();
const maxTotalPercentage = 100;

const isPercentageUsed = computed(() => {
  const percentageUsed = assets.reduce((total, asset) => total + asset.percentage, 0);
  return percentageUsed >= maxTotalPercentage;
});

function updatePercentage(asset: PortfolioAsset, percentage: number) {
  const isPercentageDecreased = percentage < asset.percentage;
  if (isPercentageUsed.value && !isPercentageDecreased) return;
  emit('update', { ...asset, percentage });
}
</script>
