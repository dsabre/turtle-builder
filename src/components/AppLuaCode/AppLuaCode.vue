<script setup lang="ts">
import { arrayChunk } from '@/composables/functions';
import { useActionsStore } from '@/stores/actions';
import { nextTick, ref } from 'vue';
import 'highlight.js/styles/stackoverflow-dark.css';
import hljs from 'highlight.js/lib/common';
import type IAppLuaCodeExposeModel from './IAppLuaCodeExposeModel';
import toastr from '@/composables/toastr';

const actionsMaxLength = 40;
const actionsStore = useActionsStore();
const listActions = ref<string[]>(actionsStore.listActions);
const codeElement = ref<HTMLElement>();
const code = ref<string>('');
const copyCode = () => {
    toastr.info('Code copied to clipboard');
    navigator.clipboard.writeText(code.value)
};
const copyStrings = () => {
    toastr.info('Actions copied to clipboard');
    navigator.clipboard.writeText(arrayChunk<string[][]>(listActions.value, actionsMaxLength).map((chunk: string[]) => chunk.join('')).join('\n'))
};
const doHighlight = () => {
    code.value = `local builder="pastebin run 7GrcxsBW"

local function doBuild(command)
    shell.run(builder.." "..command)
end

${arrayChunk<string[][]>(listActions.value, actionsMaxLength).map((chunk: string[]) => `doBuild("${chunk.join('')}")`).join('\n')}
`;

    nextTick(() => {
        if (codeElement.value) {
            hljs.highlightElement(codeElement.value)
        }
    });
};

actionsStore.$subscribe(() => listActions.value = actionsStore.listActions);

defineExpose<IAppLuaCodeExposeModel>({ doHighlight });
</script>

<template>
    <div class="space-y-4 max-h-[500px] overflow-y-scroll px-1">
        <p>Each code is limited to <b>{{ actionsMaxLength }}</b> actions due to compatibility reasons.</p>

        <div class="space-y-2">
            <div class="flex justify-between items-center">
                <h2 class="font-bold text-lg">Lua code:</h2>
                <button class="flex gap-1 bg-gray-200 hover:bg-gray-300 border p-1 shadow rounded"
                    @click.prevent="copyCode">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                    </svg>
                    <span>Copy</span>
                </button>
            </div>
            <pre class="text-xs"><code ref="codeElement" class="language-lua">{{ code }}</code></pre>
            <p class="text-sm leading-7">Paste this code to <a href="https://pastebin.com/" target="_blank">pastebin.com</a>, then run it directly in your turtle using<br><span class="font-mono bg-gray-200 p-2 border rounded">pastebin run [PASTEBIN_CODE]</span></p>
        </div>

        <div class="space-y-2">
            <div class="flex justify-between items-center">
                <h2 class="font-bold text-lg">Actions strings:</h2>
                <button class="flex gap-1 bg-gray-200 hover:bg-gray-300 border p-1 shadow rounded"
                    @click.prevent="copyStrings">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                    </svg>
                    <span>Copy</span>
                </button>
            </div>
            <pre class="text-xs">{{ arrayChunk<string[][]>(listActions, actionsMaxLength).map((chunk: string[]) => chunk.join('')).join('\n') }}</pre>
        </div>
    </div>
</template>
