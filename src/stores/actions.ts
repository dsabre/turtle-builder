import {defineStore} from 'pinia';
import {useTurtleStore} from './turtle';
import {nextTick, ref, toRaw} from 'vue';
import {getClonedObject, hexToDecimal} from '@/composables/functions';
import * as THREE from 'three';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

type Cube = {mesh: THREE.Mesh, line: THREE.LineSegments, fromSlotId: number};

const validActions = [
    'i',
    'j',
    'k',
    'l',
    'u',
    'n',

    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'z',
    'x',

    'r'
];
const storeId = 'actions';
const getCube = (r: number, g: number, b: number, fromSlotId: number): Cube => {
    const geometry = new THREE.BoxGeometry(1, 1, 1).toNonIndexed();
    const edges = new THREE.EdgesGeometry( geometry );
    const material = new THREE.MeshBasicMaterial({
        vertexColors: true
    });
    
    const color = new THREE.Color(`rgb(${r}, ${g}, ${b})`);
    const colors = Array(6).fill(color);
    const facesColors: number[] = [];

    colors.forEach((color) => {
        for (let k = 0; k < 6; k++) {
            facesColors.push(color.r, color.g, color.b);
        }
    });

    // define the new attribute
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(facesColors, 3));
    return {
        mesh: new THREE.Mesh(geometry, material),
        line: new THREE.LineSegments(edges, material),
        fromSlotId
    };
};

export const useActionsStore = defineStore(storeId, () => {
    const turtleStore = useTurtleStore();
    const turtle = toRaw(turtleStore.turtle);
    const scene = ref<THREE.Scene>();
    const listActions = ref<string[]>([]);
    const lastSlotSelected = ref<number>(0);
    const mustRestoreActions = ref<boolean>(true);
    const orbitControls = ref<OrbitControls>();
    const cubesAdded = ref<Cube[]>([]);
    const getActionsFromStorage = (): string[] => JSON.parse(localStorage.getItem(storeId) || '[]');
    const saveActions = () => localStorage.setItem(storeId, JSON.stringify(listActions.value));
    const addAction = (action: string, save: boolean) => {
        listActions.value.push(action);

        if (save) {
            saveActions();
        }
    };
    const clearActions = () => {
        localStorage.removeItem(storeId);
        listActions.value = [];
    };
    const placeItem = (action: string): boolean => {
        let slotId;

        if (action === 'z') {
            slotId = lastSlotSelected.value;
        } else if (action === 'x') {
            for (let index = 0; index < turtleStore.inventory.length; index++) {
                const element = turtleStore.inventory[index];

                if (element.quantity > 0) {
                    slotId = index;
                    break;
                }
            }
        } else {
            slotId = hexToDecimal(action);
        }

        if (slotId === undefined) {
            return false;
        }

        const color = turtleStore.inventory[slotId];

        if (!color) {
            return false;
        }

        if (color.quantity < 1 || turtle.position.y < 1) {
            return false;
        }

        const x = turtle.position.x;
        const y = turtle.position.y - 1;
        const z = turtle.position.z;

        if (cubesAdded.value.filter((cube) => cube.mesh.position.x === x && cube.mesh.position.y === y && cube.mesh.position.z === z).length > 0) {
            return false;
        }

        const {r, g, b} = color;
        turtleStore.inventory[slotId].quantity--;

        const cube = getCube(r, g, b, slotId);
        scene.value?.add(cube.mesh);
        scene.value?.add(cube.line);
        cube.mesh.position.set(x, y, z);
        cube.line.position.set(x, y, z);

        cubesAdded.value.push(cube);

        lastSlotSelected.value = slotId;

        return true;
    };
    const movements = (action: string): boolean => {
        let ret = false;

        switch (action) {
            case 'u':
                turtle.translateY(1);
                ret = true;
                break;
            case 'n':
                if (turtle.position.y > 0) {
                    turtle.translateY(-1);
                    ret = true;
                }
                break;
            case 'i':
                turtle.translateX(1);
                ret = true;
                break;
            case 'k':
                turtle.translateX(-1);
                ret = true;
                break;
            case 'j':
                turtle.rotation.y += Math.PI / 2;
                ret = true;
                break;
            case 'l':
                turtle.rotation.y -= Math.PI / 2;
                ret = true;
                break;
        }

        if (ret && orbitControls.value) {
            orbitControls.value.target.set(turtle.position.x, turtle.position.y, turtle.position.z);
            orbitControls.value.update();
        }

        return ret;
    };
    const rollbackLastAction = (): void => {
        let lastAction = listActions.value.pop();
        saveActions();

        if (!lastAction) {
            return;
        }

        switch (lastAction) {
            case 'u':
                movements('n');
                break;
            case 'n':
                movements('u');
                break;
            case 'i':
                movements('k');
                break;
            case 'k':
                movements('i');
                break;
            case 'j':
                movements('l');
                break;
            case 'l':
                movements('j');
                break;
            default:
                const turtlePosition = getClonedObject(turtle.position);
                turtlePosition.y -= 1;
                const cubeIndex = cubesAdded.value.map((cube) => JSON.stringify(cube.mesh.position)).indexOf(JSON.stringify(turtlePosition));

                if(cubeIndex < 0){
                    return;
                }

                const cube = cubesAdded.value[cubeIndex];

                scene.value?.remove(cube.mesh);
                scene.value?.remove(cube.line);

                turtleStore.inventory[cube.fromSlotId].quantity++;

                delete cubesAdded.value[cubeIndex];
                break;
        }
    };
    const doAction = (action: string, save: boolean = true) => {
        if (!validActions.includes(action)) {
            return false;
        }

        if (action === 'r') {
            rollbackLastAction();
        } else {
            if (movements(action)) {
                addAction(action, save);
            } else if (placeItem(action)) {
                addAction(action, save);
            }
        }
    };
    const handleKeyPress = (event: KeyboardEvent) => {
        event.preventDefault();

        if (!event.ctrlKey) {
            doAction(event.key);
        }
    };
    const restoreActions = () =>
        getActionsFromStorage().forEach((action: string) => {
            doAction(action, false);
        });
    const addListener = () => {
        if (mustRestoreActions.value) {
            mustRestoreActions.value = false;
            nextTick(() => restoreActions());
        }

        document.addEventListener('keypress', handleKeyPress, false);
    };
    const removeListener = () => document.removeEventListener('keypress', handleKeyPress, false);

    return {addListener, removeListener, listActions, clearActions, restoreActions, doAction, scene, orbitControls};
});
