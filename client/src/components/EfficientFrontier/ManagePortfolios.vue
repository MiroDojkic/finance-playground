<template>
  <Accordion>
    <AccordionPanel
      v-for="(portfolio, idx) in portfolios"
      :key="portfolio.name"
      :value="idx"
      class="flex flex-col">
      <AccordionHeader>{{ portfolio.name }}</AccordionHeader>
      <AccordionContent>
        <ManagePortfolio
          @update="$emit('update', $event)"
          :portfolio="portfolio" />
      </AccordionContent>
    </AccordionPanel>
  </Accordion>
</template>

<script setup lang="ts">
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import type { Portfolio } from '@/models';
import ManagePortfolio from './ManagePortfolio.vue';

const emit = defineEmits(['update']);
defineProps<{ portfolios: Portfolio[] }>();
</script>
