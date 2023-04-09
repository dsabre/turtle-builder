<script setup lang="ts">
import { nextTick, ref, toRaw } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { isDev } from '@/composables/functions';
import { useTurtleStore } from '@/stores/turtle';
import { useActionsStore } from '@/stores/actions';

const builder = ref();
const turtleStore = useTurtleStore();
const actionsStore = useActionsStore();

nextTick(() => {
    const w = window.innerWidth - 260;
    const h = window.innerHeight - 150;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(w, h);
    builder.value?.appendChild(renderer.domElement);

    scene.add(toRaw(turtleStore.turtle));

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);

        renderer.render(scene, camera);
    }

    actionsStore.listener();

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
})
</script>

<template>
    <div ref="builder"></div>
</template>
