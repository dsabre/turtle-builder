<script setup lang="ts">import { useActionsStore } from '@/stores/actions';

const actionsStore = useActionsStore();
</script>

<template>
    <div class="p-2 border-t space-x-1">
        <b>Actions:</b>
        <span class="font-mono">{{ actionsStore.listActions.join('') }}</span>
        <span v-show="actionsStore.listActions.length < 1" class="font-mono">empty</span>
    </div>
</template>
