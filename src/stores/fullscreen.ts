import {defineStore} from 'pinia';
import {ref} from 'vue';

export const useFullscreenStore = defineStore('fullscreen', () => {
    const fullscreen = ref<boolean>(false);

    return {fullscreen};
});
