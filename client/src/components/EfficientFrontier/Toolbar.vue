<template>
  <Toolbar>
    <template #end>
      <Button @click="openCreatePortfolioDialog" class="mx-3 my-3">
        Create portfolio
      </Button>
    </template>
  </Toolbar>
  <CreatePortfolioDialog
    @save="createPortfolio"
    @close="closeCreatePortfolioDialog"
    :open="isCreatePortfolioDialogVisible"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from 'primevue/button';
import Toolbar from 'primevue/toolbar';
import CreatePortfolioDialog from './CreatePortfolioDialog.vue';
import type { Portfolio } from '@/models';

const emit = defineEmits(['create']);
const isCreatePortfolioDialogVisible = ref(false);

function createPortfolio(portfolio: Portfolio) {
  emit('create', portfolio);
  closeCreatePortfolioDialog();
}

function openCreatePortfolioDialog() {
  isCreatePortfolioDialogVisible.value = true;
}

function closeCreatePortfolioDialog() {
  isCreatePortfolioDialogVisible.value = false;
}
</script>
