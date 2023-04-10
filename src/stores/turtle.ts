import {getClonedObject, rgbToGrayscale} from '@/composables/functions';
import {defineStore} from 'pinia';
import * as THREE from 'three';
import {ref} from 'vue';

type ColorType = {
    r: number;
    g: number;
    b: number;
    textColor: string;
    quantity: number;
};

const turtleInventorySlots = 16;
const turtleInventoryStoreId = 'turtleInventory';
const getTurtle = (): THREE.Mesh => {
    const piece = new THREE.BoxGeometry(1, 1, 1).toNonIndexed();
    const material = new THREE.MeshBasicMaterial({
        vertexColors: true
    });

    const colors = [
        new THREE.Color('rgb(255, 255, 0)'), // front
        new THREE.Color('rgb(0, 255, 255)'), // back
        new THREE.Color('rgb(255, 255, 255)'), // top
        new THREE.Color('rgb(30, 30, 30)'), // bottom
        new THREE.Color('rgb(0, 255, 0)'), // right
        new THREE.Color('rgb(255, 0, 0)') // left
    ];
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
const hexToRgb = (hex: string, quantity: number): ColorType | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    if (!result) {
        return null;
    }

    const rgb = {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        textColor: '#000000',
        quantity
    };

    rgb.textColor = rgbToGrayscale(rgb.r, rgb.g, rgb.b) < 128 ? '#ffffff' : '#000000';

    return rgb;
};
const initColor: ColorType = {r: 0, g: 0, b: 0, textColor: '#ffffff', quantity: 0};

export const useTurtleStore = defineStore('turtle', () => {
    const turtle = getTurtle();
    const inventory = ref<ColorType[]>(
        localStorage.getItem(turtleInventoryStoreId)
            ? JSON.parse(localStorage.getItem(turtleInventoryStoreId) || '[]')
            : Array(turtleInventorySlots).fill(initColor)
    );
    const saveInventory = () => localStorage.setItem(turtleInventoryStoreId, JSON.stringify(inventory.value));
    const setInventorySlot = (slotId: number, color: string, quantity: number) => {
        const colorRGB = hexToRgb(color, quantity);
        if (colorRGB) {
            inventory.value[slotId] = colorRGB;
            saveInventory();
        }
    };
    const fillInventory = (color: string) => {
        const colorRGB = hexToRgb(color, 64);
        if (colorRGB) {
            inventory.value = inventory.value.map(() => getClonedObject<ColorType>(colorRGB));
            saveInventory();
        }
    };
    const clearInventory = () => {
        inventory.value = inventory.value.fill(initColor);
        localStorage.removeItem(turtleInventoryStoreId);
    };

    return {turtle, inventory, setInventorySlot, clearInventory, fillInventory};
});
