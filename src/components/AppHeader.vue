<script setup lang="ts">
import { useActionsStore } from '@/stores/actions';
import { useFullscreenStore } from '@/stores/fullscreen';
import AppModal from './AppModal/AppModal.vue';
import { ref, watch } from 'vue';
import type IAppModalExposeModel from './AppModal/IAppModalExposeModel';
import FormCreateFromString from '@/forms/FormCreateFromString.vue';

const actionsStore = useActionsStore();
const fullscreenStore = useFullscreenStore();

const modalCreateFromString = ref<IAppModalExposeModel>();
const modalCreateFromStringOpened = ref<boolean>(false);

const resetBuild = () => {
    if (confirm('This operation is irreversible, continue?')) {
        actionsStore.clearActions();
        location.reload();
    }
};
const generateProgram = () => {
    // TODO
    alert('TODO');
};

watch(modalCreateFromStringOpened, () => {
    if (modalCreateFromStringOpened.value) {
        actionsStore.removeListener()
    }
    else {
        actionsStore.addListener();
    }
});
</script>

<template>
    <div>
        <AppModal ref="modalCreateFromString" :opened="modalCreateFromStringOpened"
            :closingCallback="() => modalCreateFromStringOpened = false">
            <template #header>
                Create from actions string
            </template>
            <FormCreateFromString />
        </AppModal>

        <header class="text-gray-600 body-font border-b">
            <div class="flex flex-wrap p-2 flex-col md:flex-row items-center">
                <a class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                    <span class="ml-3 text-xl">Computercraft - turtle builder</span>
                </a>
                <nav class="md:ml-auto flex flex-wrap items-center text-base justify-center">
                    <span class="mr-5 hover:text-gray-900 cursor-pointer flex gap-1"
                        @click.prevent="fullscreenStore.fullscreen = true">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                        </svg>
                        <span>Fullscreen</span>
                    </span>
                    <span class="mr-5 hover:text-gray-900 cursor-pointer flex gap-1" @click.prevent="resetBuild">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                        <span>Reset</span>
                    </span>
                    <span class="mr-5 hover:text-gray-900 cursor-pointer flex gap-1"
                        @click.prevent="modalCreateFromStringOpened = true">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                        <span>Create from actions string</span>
                    </span>
                    <span class="mr-5 hover:text-gray-900 cursor-pointer flex gap-1" @click.prevent="generateProgram">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                        <span>Generate program</span>
                    </span>
                    <a class="mr-5 hover:text-gray-900 flex gap-1" href="https://pastebin.com/7GrcxsBW" target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                        <span>Open base program</span>
                    </a>
                    <router-link to="/help" class="mr-5 hover:text-gray-900 cursor-pointer flex gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                        </svg>
                        <span>Help</span>
                    </router-link>
                </nav>
            </div>
        </header>
    </div>
</template>
