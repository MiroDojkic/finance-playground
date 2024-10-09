<template>
  <label class="flex flex-col">
    {{ label }}
    <AutoComplete
      v-model="query"
      @complete="search"
      @option-select="selectAsset"
      @hide="completeSelection"
      :suggestions="assetSearchSuggestions"
      :aria-label="label"
      :focus-on-hover="false"
      placeholder="Search..."
      optionLabel="label"
      input-class="flex-1 max-w-full" />
  </label>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AutoComplete from 'primevue/autocomplete';
import { searchAssets } from '@/api';
import type { PortfolioAsset } from '@/models';

type SearchEvent = {
  originalEvent: Event;
  query: string;
};

type OptionSelectEvent = {
  originalEvent: Event;
  value: PortfolioAsset;
};

type Option = PortfolioAsset & {
  label: string;
};

defineProps<{ label: string; }>();
const emit = defineEmits(['select']);
const query = ref();
const selectedOption = ref<PortfolioAsset | null>(null);
const assetSearchSuggestions = ref<Option[]>([]);

async function search({ query }: SearchEvent): Promise<void> {
  const assets = await searchAssets(query);
  assetSearchSuggestions.value = assets.map(asset => ({
    ...asset,
    label: createLabel(asset)
  }));
}

function selectAsset({ value }: OptionSelectEvent): void {
  selectedOption.value = value;
}

function completeSelection(): void {
  emit('select', selectedOption.value);
  query.value = '';
  selectedOption.value = null;
}

function createLabel(asset: PortfolioAsset): string {
  if (!asset.shortname) return asset.symbol;
  return `${asset.symbol} (${asset.shortname})`;
}
</script>
