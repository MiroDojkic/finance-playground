<template>
  <div class="flex flex-col">
    <span class="pb-2">{{ asset.symbol }}: {{asset.percentage}}%</span>
    <Slider
      @update:modelValue="$emit('change', $event)"
      :modelValue="asset.percentage"
      :min="0"
      :max="100"
      />
  </div>
</template>

<script setup lang="ts">
import Slider from 'primevue/slider';
import type { PortfolioAsset } from '@/models';

defineEmits(['change']);
defineProps<{ asset: PortfolioAsset }>();
</script>
