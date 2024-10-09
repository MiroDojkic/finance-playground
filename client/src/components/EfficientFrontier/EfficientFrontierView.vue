<template>
  <EfficientFrontierToolbar @create="createPortfolio" />
  <Splitter class="min-h-full">
    <SplitterPanel :size="80" class="flex">
      <EfficientFrontierChart
      :performanceMetrics="performanceMetrics"
      class="px-4 pt-4 flex-1" />
    </SplitterPanel>
    <SplitterPanel :size="20">
      <ManagePortfolios
        @update="updatePortfolio"
        :portfolios="portfolios"
        class="p-4" />
    </SplitterPanel>
  </Splitter>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import { getPortfolioAnalysis } from '@/components/portfolio';
import type { Portfolio, PortfolioPerformanceMetrics } from '@/models';
import EfficientFrontierToolbar from './Toolbar.vue';
import EfficientFrontierChart from './EfficientFrontierChart.vue';
import ManagePortfolios from './ManagePortfolios.vue';

const portfolios = ref<Portfolio[]>([]);
const performanceMetrics = ref<{ [name: string]: PortfolioPerformanceMetrics }>({});
const startDate = '2018-01-01';

async function createPortfolio(portfolio: Portfolio): Promise<void> {
  portfolios.value.push(portfolio);
  const metrics = await fetchPortfolioPerformanceMetrics(portfolio);
  if (!metrics) return;
  performanceMetrics.value[portfolio.name] = metrics;
}

async function updatePortfolio(portfolio: Portfolio): Promise<void> {
  const idx = portfolios.value.findIndex(it => it.name === portfolio.name);
  portfolios.value[idx] = portfolio;
  const metrics = await fetchPortfolioPerformanceMetrics(portfolio);
  if (!metrics) return;
  performanceMetrics.value[portfolio.name] = metrics;
}

// function updatePercentage(asset: PortfolioAsset, value: number): void {
//   const idx = assets.value.findIndex(it => it.symbol === asset.symbol);
//   assets.value[idx].percentage = value;
// }
//
// function addAsset(asset: PortfolioAsset): void {
//   assets.value.push(asset);
// }

function fetchPortfolioPerformanceMetrics(portfolio: Portfolio): Promise<PortfolioPerformanceMetrics | undefined> {
  const { assets } = portfolio;
  if (!assets.length) return Promise.resolve(undefined);
  return getPortfolioAnalysis(
    assets.map(asset => asset.symbol),
    assets.map(asset => asset.percentage / 100),
    startDate
  );
}
</script>
