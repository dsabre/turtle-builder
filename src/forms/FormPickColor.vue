<script setup lang="ts">
import { getFormData } from '@/composables/functions';
import { useTurtleStore } from '@/stores/turtle';

const props = defineProps({
    slotId: {
        type: Number,
        required: true
    },
    slotCommand: {
        type: String,
        required: true
    },
    submitCallback: {
        type: Function,
        required: true
    }
});

const turtleStore = useTurtleStore();

const onSubmit = (event: Event) => {
    const color = getFormData<{ color: string; }>(event).color.trim();

    turtleStore.setInventorySlot(props.slotId, color);

    props.submitCallback();
};
</script>

<template>
    <form @submit.prevent="onSubmit" class="space-y-4">
        <div class="flex items-center gap-1">
            <input type="color" name="color" id="color" required class="">
            <label for="color" class="font-bold">Slot {{ slotCommand }}</label>
        </div>
        <div>
            <button type="submit" class="bg-blue-500 w-full text-white p-4 rounded shadow hover:bg-blue-600">Pick
                color</button>
        </div>
    </form>
</template>
