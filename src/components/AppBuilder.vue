<script setup lang="ts">
import { nextTick, onUnmounted, ref, toRaw } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { isDev } from '@/composables/functions';
import { useTurtleStore } from '@/stores/turtle';
import { useActionsStore } from '@/stores/actions';
import { useFullscreenStore } from '@/stores/fullscreen';

const builder = ref();
const turtleStore = useTurtleStore();
const actionsStore = useActionsStore();
const fullscreenStore = useFullscreenStore();
const getDimensionsOffset = (): { w: number; h: number } => {
    if (fullscreenStore.fullscreen) {
        return {
            w: 0,
            h: 0
        }
    }

    return {
        w: 260,
        h: 150
    }
};
const createBuilder = () => {
    builder.value.innerHTML = '';
    const dimensionsOffset = getDimensionsOffset();

    const w = window.innerWidth - dimensionsOffset.w;
    const h = window.innerHeight - dimensionsOffset.h;

    const scene = new THREE.Scene();
    actionsStore.scene = scene;
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(w, h);
    builder.value?.appendChild(renderer.domElement);

    scene.add(toRaw(turtleStore.turtle));

    camera.position.x = -3;
    camera.position.y = 3;
    camera.position.z = 3;

    function animate() {
        requestAnimationFrame(animate);

        renderer.render(scene, camera);
    }

    actionsStore.addListener();

    animate();

    // camera control
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.5, 0);
    controls.update();
    controls.enablePan = false;
    controls.enableDamping = true;

    // add grid
    const gridDimensions = 100;
    const size = gridDimensions + 1;
    const divisions = gridDimensions + 1;
    const gridHelper = new THREE.GridHelper(size, divisions);
    scene.add(gridHelper);

    // only in dev add axis view
    if (isDev()) {
        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);
    }

    // listen for window resizing
    window.onresize = () => {
        const w = window.innerWidth - dimensionsOffset.w;
        const h = window.innerHeight - dimensionsOffset.h;

        camera.aspect = w / h;
        camera.updateProjectionMatrix();

        renderer.setSize(w, h);
    };
};
const onFullscreenchange = () => fullscreenStore.fullscreen = !!document.fullscreenElement;
document.addEventListener("fullscreenchange", onFullscreenchange, false);

// fullscreen listener
fullscreenStore.$subscribe(() => {
    if (fullscreenStore.fullscreen) {
        builder.value.requestFullscreen();
    }

    createBuilder();
});

// initial creation
nextTick(() => createBuilder());

// listen for component unmount
onUnmounted(() => {
    actionsStore.removeListener();
    document.removeEventListener("fullscreenchange", onFullscreenchange, false);
});
</script>

<template>
    <div ref="builder"></div>
</template>
