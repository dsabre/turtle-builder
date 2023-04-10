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
        required: false,
        default: () => { }
    }
});

const turtleStore = useTurtleStore();

const onSubmit = (event: Event) => {
    const {color, quantity} = getFormData<{ color: string; quantity: number; }>(event);

    if (props.slotId > -1) {
        turtleStore.setInventorySlot(props.slotId, color.trim(), quantity);
    }
    else {
        turtleStore.fillInventory(color);
    }

    props.submitCallback();
};
</script>

<template>
    <form @submit.prevent="onSubmit" class="space-y-4">
        <div class="flex items-center gap-1">
            <input type="color" name="color" id="color" required>
            <label for="color" class="font-bold">Slot {{ slotCommand }}</label>
        </div>
        <div v-show="slotId > -1">
            <label for="quantity" class="font-bold">Quantity for slot {{ slotCommand }}</label>
            <input type="quantity" name="quantity" id="quantity" required value="64" class="w-full border rounded p-2" :placeholder="`Quantity for slot ${slotCommand}`">
        </div>
        <div>
            <button type="submit" class="bg-blue-500 w-full text-white p-4 rounded shadow hover:bg-blue-600">Pick
                color</button>
        </div>
    </form>
</template>
