<script setup lang="ts">
import { getFormData } from '@/composables/functions';
import { useActionsStore } from '@/stores/actions';
import { useLoadingStore } from '@/stores/loading';

const actionsStore = useActionsStore();
const loadingStore = useLoadingStore();

const onSubmit = (event: Event) => {
    loadingStore.loading = true;

    const actions = getFormData<{ actions: string; }>(event).actions.trim();

    actionsStore.clearActions();

    actions.split('').forEach((action: string) => {
        actionsStore.doAction(action);
    });

    location.reload();
};
</script>

<template>
    <form @submit.prevent="onSubmit">
        <div>
            <label for="actions" class="font-bold">Actions string</label>
            <textarea name="actions" id="actions" placeholder="Actions string" required
                class="w-full border rounded p-4"></textarea>
        </div>
        <div>
            <button type="submit" class="bg-blue-500 w-full text-white p-4 rounded shadow hover:bg-blue-600">Send</button>
        </div>
    </form>
</template>
