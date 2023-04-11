<script setup lang="ts">
import { useTurtleStore } from '@/stores/turtle';
import { ref, watch } from 'vue';
import type IAppModalExposeModel from './AppModal/IAppModalExposeModel';
import AppModal from './AppModal/AppModal.vue';
import { useActionsStore } from '@/stores/actions';
import FormPickColor from '@/forms/FormPickColor.vue';
import { storeToRefs } from 'pinia';

const actionsStore = useActionsStore();
const turtleStore = useTurtleStore();
const {listActions} = storeToRefs(actionsStore);
const modalColor = ref<IAppModalExposeModel>();
const modalColorOpened = ref<boolean>(false);
const { inventory } = storeToRefs(turtleStore);
const slotIdSelected = ref<number>(-1);
const hexString = (number: number) => number.toString(16).toUpperCase();
const openModal = (slotId: number) => {
    modalColorOpened.value = true;
    slotIdSelected.value = slotId;
};

actionsStore.$subscribe(() => listActions.value = actionsStore.listActions);

watch(modalColorOpened, () => {
    if (modalColorOpened.value) {
        actionsStore.removeListener();
    }
    else {
        actionsStore.addListener();
    }
});
</script>

<template>
    <div>
        <AppModal ref="modalColor" :opened="modalColorOpened" :closingCallback="() => modalColorOpened = false">
            <template #header>
                Pick a color for {{ hexString(slotIdSelected) }}
            </template>
            <FormPickColor :slotId="slotIdSelected" :slotCommand="hexString(slotIdSelected)"
                :submitCallback="() => modalColor?.performClose()" />
        </AppModal>

        <div class="px-2 pt-2 space-y-4">
            <div class="flex justify-between items-center">
                <h2 class="font-bold text-lg">Turtle inventory</h2>

                <button class="flex gap-1 bg-gray-200 hover:bg-gray-300 border p-1 shadow rounded"
                    @click.prevent="turtleStore.clearInventory">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    <span>Clear</span>
                </button>
            </div>

            <div class="grid grid-cols-4 gap-1">
                <div v-for="(i, k) in inventory" @click.prevent="() => openModal(k)"
                    :class="{ 'border w-15 aspect-square cursor-pointer flex items-center justify-center': true, 'bg-gray-400': i.quantity < 1 }"
                    :style="{ backgroundColor: i.quantity > 0 ? `rgb(${i.r}, ${i.g}, ${i.b})` : undefined, color: i.quantity > 0 ? i.textColor : undefined }">
                    <span>{{ i.quantity }}</span>
                </div>
            </div>

            <div>
                <h3 class="font-bold">Fill inventory with color:</h3>
                <FormPickColor :slotId="-1" slotCommand="all" />
            </div>

            <hr>

            <div class="flex items-center gap-1">
                <h2 class="font-bold text-lg">Fuel required:</h2>
                {{ listActions.filter((action) => ['i', 'k', 'u', 'n'].indexOf(action) > -1).length }}
            </div>
        </div>
    </div>
</template>
