<script setup lang="ts">
</script>

<template>
    <div class="p-2">
        <h2 class="font-bold text-lg">Turtle commands</h2>

        <ul>
            <li>
                <span class="kbd">i</span>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.kbd {
    @apply inline-flex justify-center items-center border px-2;
    border-color: hsl(var(--bc)/var(--tw-border-opacity));
    --tw-border-opacity: .2;
    --tw-bg-opacity: 1;
    background-color: hsl(var(--b2,var(--b1))/var(--tw-bg-opacity));
    border-radius: var(--rounded-btn,.5rem);
    border-bottom-width: 2px;
    min-height: 2.2em;
    min-width: 2.2em;
}
</style>