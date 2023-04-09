<script setup lang="ts">import { useActionsStore } from '@/stores/actions';

const actionsStore = useActionsStore();
</script>

<template>
    <div class="p-2">
        <b>Actions:</b> {{ actionsStore.listActions.join('') }}
    </div>
</template>
