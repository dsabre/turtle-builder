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
let cameraHolder: THREE.PerspectiveCamera | null = null;
let rendererHolder: THREE.WebGLRenderer | null = null;
const resizeBuilder = () => {
    const dimensionsOffset = getDimensionsOffset();

    const w = window.innerWidth - dimensionsOffset.w;
    const h = window.innerHeight - dimensionsOffset.h;

    if (cameraHolder !== null) {
        cameraHolder.aspect = w / h;
        cameraHolder.updateProjectionMatrix();
    }

    if (rendererHolder !== null) {
        rendererHolder.setSize(w, h);
    }
};
const createBuilder = () => {
    builder.value.innerHTML = '';
    const dimensionsOffset = getDimensionsOffset();

    const w = window.innerWidth - dimensionsOffset.w;
    const h = window.innerHeight - dimensionsOffset.h;

    const scene = new THREE.Scene();
    actionsStore.scene = scene;
    cameraHolder = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);

    rendererHolder = new THREE.WebGLRenderer();
    rendererHolder.setSize(w, h);
    builder.value?.appendChild(rendererHolder.domElement);

    const turtle = toRaw(turtleStore.turtle);

    scene.add(turtle);

    cameraHolder.position.x = -3;
    cameraHolder.position.y = 3;
    cameraHolder.position.z = 3;

    // camera control
    const controls = new OrbitControls(cameraHolder, rendererHolder.domElement);
    controls.target.set(turtle.position.x, turtle.position.y, turtle.position.z);
    controls.update();
    controls.enablePan = true;
    controls.enableDamping = true;

    function animate() {
        requestAnimationFrame(animate);

        if (cameraHolder !== null && rendererHolder !== null) {
            rendererHolder.render(scene, cameraHolder);
        }
    }

    actionsStore.orbitControls = controls;
    actionsStore.addListener();

    animate();

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
    window.onresize = () => resizeBuilder();
};
const onFullscreenchange = () => fullscreenStore.fullscreen = !!document.fullscreenElement;
document.addEventListener("fullscreenchange", onFullscreenchange, false);

// fullscreen listener
fullscreenStore.$subscribe(() => {
    if (fullscreenStore.fullscreen) {
        builder.value.requestFullscreen();
    }

    resizeBuilder();
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
