<template>
  <BubbleChart :datasets="datasets" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PortfolioPerformanceMetrics } from '@/models';
import BubbleChart from './BubbleChart.vue';

type Dataset = {
  label: string;
  backgroundColor: string;
  data: {
    x: number;
    y: number;
    r: number;
  }[];
};

const props = defineProps<{
  performanceMetrics: { [name: string]: PortfolioPerformanceMetrics };
}>();

const datasets = computed<Dataset[]>(() => {
  return Object.entries(props.performanceMetrics).map(([label, metrics]) => ({
    label,
    backgroundColor: metrics.color || 'rgba(75, 192, 192, 0.6)',
    data: [{
      ...metrics,
      r: metrics.sharpe * 3,
      x: metrics.risk * 100,
      y: metrics.return * 100
    }]
  }));
});
</script>
