<script setup lang="ts">
import { nextTick, ref } from 'vue';
import * as THREE from 'three';
import Turtle from '@/composables/Turtle';
import Actions from '@/composables/Actions';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { isDev } from '@/composables/functions';

const builder = ref();

nextTick(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.querySelector('#app')?.appendChild(renderer.domElement);

    const turtleClass = new Turtle();
    const turtle = turtleClass.getTurtle();
    scene.add(turtle);

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);

        renderer.render(scene, camera);
    }

    const actions = new Actions(turtle);
    actions.listener();

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
