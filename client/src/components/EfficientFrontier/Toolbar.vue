<template>
  <Toolbar>
    <template #end>
      <Button
        @click="openCreatePortfolioDialog"
        label="Create portfolio"
        class="mx-3" />
      <Button
        @click="openLoadPortfolioDialog"
        label="Load portfolio"
        severity="contrast" />
    </template>
  </Toolbar>
  <CreatePortfolioDialog
    @save="createPortfolio"
    @close="closeCreatePortfolioDialog"
    :open="isCreatePortfolioDialogVisible"
  />
  <LoadPortfolioDialog
    @load="loadPortfolio"
    :open="isLoadPortfolioDialogVisible" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from 'primevue/button';
import Toolbar from 'primevue/toolbar';
import type { Portfolio } from '@/models';
import CreatePortfolioDialog from './CreatePortfolioDialog.vue';
import LoadPortfolioDialog from './LoadPortfolioDialog.vue';

const emit = defineEmits(['create', 'load']);
const isCreatePortfolioDialogVisible = ref(false);
const isLoadPortfolioDialogVisible = ref(false);

function createPortfolio(portfolio: Portfolio) {
  emit('create', portfolio);
  closeCreatePortfolioDialog();
}

function loadPortfolio(name: string) {
  emit('load', name);
  closeLoadPortfolioDialog();
}

function openCreatePortfolioDialog() {
  isCreatePortfolioDialogVisible.value = true;
}

function closeCreatePortfolioDialog() {
  isCreatePortfolioDialogVisible.value = false;
}

function openLoadPortfolioDialog() {
  isLoadPortfolioDialogVisible.value = true;
}

function closeLoadPortfolioDialog() {
  isLoadPortfolioDialogVisible.value = false;
}
</script>
