import {defineStore} from 'pinia';
import {useTurtleStore} from './turtle';
import {nextTick, ref, toRaw} from 'vue';
import {hexToDecimal} from '@/composables/functions';
import * as THREE from 'three';

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
const getCube = (r: number, g: number, b: number): THREE.Mesh => {
    const piece = new THREE.BoxGeometry(1, 1, 1).toNonIndexed();
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
    piece.setAttribute('color', new THREE.Float32BufferAttribute(facesColors, 3));
    return new THREE.Mesh(piece, material);
};

export const useActionsStore = defineStore(storeId, () => {
    const turtleStore = useTurtleStore();
    const turtle = toRaw(turtleStore.turtle);
    const inventory = toRaw(turtleStore.inventory);
    const scene = ref<THREE.Scene>();
    const listActions = ref<string[]>([]);
    const mustRestoreActions = ref<boolean>(true);
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
        const color = inventory[hexToDecimal(action)];

        if (!color) {
            return false;
        }

        if (!color.selected || turtle.position.y < 1) {
            return true;
        }

        const {r, g, b} = color;

        const mesh = getCube(r, g, b);
        scene.value?.add(mesh);
        mesh.position.set(turtle.position.x, turtle.position.y - 1, turtle.position.z);

        return true;
    };
    const movements = (action: string): boolean => {
        switch (action) {
            case 'u':
                turtle.translateY(1);
                return true;
            case 'n':
                if (turtle.position.y > 0) {
                    turtle.translateY(-1);
                }
                return true;
            case 'i':
                turtle.translateX(1);
                return true;
            case 'k':
                turtle.translateX(-1);
                return true;
            case 'j':
                turtle.rotation.y += Math.PI / 2;
                return true;
            case 'l':
                turtle.rotation.y -= Math.PI / 2;
                return true;
        }

        return false;
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
        }
    };
    const doAction = (action: string, save: boolean = true) => {
        if (!validActions.includes(action)) {
            return false;
        }

        if (movements(action)) {
            addAction(action, save);
        } else if (placeItem(action)) {
            addAction(action, save);
        } else {
            rollbackLastAction();
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

    return {addListener, removeListener, listActions, clearActions, restoreActions, doAction, scene};
});
