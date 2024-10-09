<template>
  <Bubble :data="data" :options="config" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Bubble } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  PointElement,
  LinearScale
} from 'chart.js';
import type { TooltipItem } from 'chart.js';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

type PortfolioDataPoint = {
  x: number;
  y: number;
  sharpe: number;
  assets: string[];
  weights: number[];
};

type PortfolioDataset = {
  label: string,
  backgroundColor: string,
  data: PortfolioDataPoint[],
}

const props = defineProps<{
  datasets: PortfolioDataset[];
}>();

const datasetDefault = {
  backgroundColor: 'rgba(75, 192, 192, 0.6)',
  borderColor: 'rgba(75, 192, 192, 1)',
  borderWidth: 1,
  hoverBackgroundColor: 'rgba(255, 99, 132, 0.6)',
  hoverBorderColor: 'rgba(255, 99, 132, 1)'
};
const data = computed(() => ({
  datasets: props.datasets.map(dataset => ({
    ...datasetDefault,
    label: dataset.label,
    backgroundColor: dataset.backgroundColor,
    data: dataset.data,
  }))
}));


const config = ref({
  scales: {
    x: {
      type: 'linear',
      position: 'bottom',
      suggestedMin: 5,
      title: {
        display: true,
        text: 'Risk (Standard Deviation)',
        font: {
          size: 14
        }
      }
    },
    y: {
      suggestedMin: 8,
      title: {
        display: true,
        text: 'Expected Return',
        font: {
          size: 14
        }
      }
    }
  },
  plugins: {
    legend: {
      display: true
    },
    tooltip: {
      callbacks: {
        label: createLabel,
        afterLabel: createAfterLabel
      }
    }
  }
});

function createLabel(context: TooltipItem<'bubble'>): string {
  const risk = context.parsed.x.toFixed(4);
  const returnVal = context.parsed.y.toFixed(4);
  const hasSharpe = context.raw && typeof context.raw === 'object' && 'sharpe' in context.raw;
  if (hasSharpe) {
    const sharpe = (context.raw as { sharpe: number }).sharpe.toFixed(4);
    return `Risk: ${risk}%, Return: ${returnVal}%, Sharpe: ${sharpe}`;
  }

  return `Risk: ${risk}%, Return: ${returnVal}%`;
}

function createAfterLabel(context: TooltipItem<'bubble'>): string {
  const rawDataExists = context.raw &&
    typeof context.raw === 'object' &&
    'assets' in context.raw &&
    'weights' in context.raw;
  if (!rawDataExists) return '';
  const { assets, weights } = context.raw as { assets: string[], weights: number[] };
  const percentages = weights.map((w: number) => (w * 100).toFixed(2));

  return `Portfolio: ${
    assets.map((asset: string, i: number) => `${percentages[i]}% ${asset}`).join(', ')
  }`;
}
</script>
