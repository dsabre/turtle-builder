<script setup lang="ts">
import { ref, watch } from 'vue';
import type IAppModalExposeModel from './IAppModalExposeModel';

const props = defineProps({
    opened: {
        type: Boolean,
        required: false,
        default: false
    },
    closingCallback: {
        type: Function,
        required: true
    }
});
const modal = ref();
const modalContent = ref();
const doClose = (instant: boolean = false) => {
    document.removeEventListener('keyup', handleEscKey, false);

    modal.value?.classList.add('opacity-0');

    setTimeout(
        () => {
            toggleBodyOverflowClass(false);
            props.closingCallback();
        },
        !instant ? 510 : 1
    );
};
const handleClickOutside = (event: Event) => {
    const target = event.target as HTMLElement;

    if (target.classList.contains('modal-holder')) {
        doClose();
    }
};
const toggleBodyOverflowClass = (force: boolean) => {
    const $body = document.querySelector('body');

    if (!$body) {
        return;
    }

    // prevent reflow when body scrollbar disappear
    if (force) {
        const oldWidth = $body.offsetWidth;
        $body.style.width = `${oldWidth}px`;
    } else {
        $body.style.width = 'auto';
    }

    // block scroll when modal is opened
    $body.classList.toggle('overflow-y-hidden', force);
};
const handleEscKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
        doClose();
    }
};
const performClose = (instant: boolean = false) => doClose(instant);
const performOpen = () => {
    document.addEventListener('keyup', handleEscKey, false);

    toggleBodyOverflowClass(true);

    // wait for modal to be created in dom then remove its class opacity-0
    setTimeout(() => {
        modal.value?.classList.remove('opacity-0');
        modalContent.value?.classList.remove('-translate-y-full');
    }, 10);
};

if (props.opened) {
    performOpen();
}

watch(() => props.opened, () => {
    if (props.opened) {
        performOpen();
    }
});

defineExpose<IAppModalExposeModel>({ performClose });
</script>

<template>
    <div v-if="opened" ref="modal"
        class="modal-holder fixed opacity-0 transition-opacity ease-in-out duration-500 bg-black/50 inset-0"
        @click="handleClickOutside">
        <div ref="modalContent"
            class="bg-white w-fit border rounded-lg shadow-md mx-auto mt-7 divide-y -translate-y-full transition-all ease-in-out duration-500">
            <div class="flex justify-between items-center px-7 py-4">
                <div class="font-bold text-lg">
                    <slot name="header"></slot>
                </div>
                <div class="cursor-pointer text-gray-500" @click="() => doClose()">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
            </div>

            <div class="p-7">
                <slot></slot>
            </div>

            <div v-if="!!$slots.footer" class="px-7 py-4">
                <slot name="footer"></slot>
            </div>
        </div>
    </div>
</template>