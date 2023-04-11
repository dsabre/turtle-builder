<template>
    <div class="p-4 space-y-4">
        <div class="flex items-center gap-2">
            <router-link to="/" class="bg-gray-100 p-1 rounded" title="Return to home">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
            </router-link>

            <h1 class="font-bold text-2xl">Help</h1>
        </div>

        <div class="space-y-2">
            <h2 class="font-bold text-lg">Commands</h2>

            <div>
                <h3 class="font-bold">Movements</h3>
                <ul class="grid grid-cols-4 gap-2">
                    <li><kbd>i</kbd>: move turtle forward</li>
                    <li><kbd>j</kbd>: turn turtle to left</li>
                    <li><kbd>k</kbd>: move turtle backward</li>
                    <li><kbd>l</kbd>: turn turtle to right</li>
                    <li><kbd>u</kbd>: move turtle up</li>
                    <li><kbd>n</kbd>: move turtle down</li>
                </ul>
            </div>

            <div>
                <h3 class="font-bold">Placing</h3>
                <ul class="grid grid-cols-4 gap-2">
                    <li><kbd>0</kbd>: place from inventory slot 1</li>
                    <li><kbd>1</kbd>: place from inventory slot 2</li>
                    <li><kbd>2</kbd>: place from inventory slot 3</li>
                    <li><kbd>3</kbd>: place from inventory slot 4</li>
                    <li><kbd>4</kbd>: place from inventory slot 5</li>
                    <li><kbd>5</kbd>: place from inventory slot 6</li>
                    <li><kbd>6</kbd>: place from inventory slot 7</li>
                    <li><kbd>7</kbd>: place from inventory slot 8</li>
                    <li><kbd>8</kbd>: place from inventory slot 9</li>
                    <li><kbd>9</kbd>: place from inventory slot 10</li>
                    <li><kbd>a</kbd>: place from inventory slot 11</li>
                    <li><kbd>b</kbd>: place from inventory slot 12</li>
                    <li><kbd>c</kbd>: place from inventory slot 13</li>
                    <li><kbd>d</kbd>: place from inventory slot 14</li>
                    <li><kbd>e</kbd>: place from inventory slot 15</li>
                    <li><kbd>f</kbd>: place from inventory slot 16</li>
                </ul>
            </div>

            <div>
                <h3 class="font-bold">Special placing</h3>
                <ul class="grid grid-cols-4 gap-2">
                    <li class="col-span-2"><kbd>z</kbd>: place down the item in last selected slot</li>
                    <li class="col-span-2"><kbd>x</kbd>: search for the first slot not empty and place down it (useful for
                        big constructions
                        with the same block type and you have the turtle filled with the same block)</li>
                </ul>
            </div>

            <div>
                <h3 class="font-bold">Other</h3>
                <ul class="grid grid-cols-4 gap-2">
                    <li class="col-span-4"><kbd>r</kbd>: cancel last move</li>
                </ul>
            </div>
        </div>

        <hr>

        <div class="space-y-2">
            <h2 class="font-bold text-lg">Camera control</h2>

            <ul class="list-inside list-disc">
                <li>Hold left mouse button and drag to move the camera around the center</li>
                <li>Use mouse wheel to change zoom</li>
                <li>Hold <kbd>Shift</kbd> and left mouse button while dragging to pan the camera</li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
kbd {
    @apply px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg;
    @apply dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500 mr-1;
}
</style>