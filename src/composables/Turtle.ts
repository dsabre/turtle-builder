import * as THREE from 'three';

export default class Turtle {
    getTurtle(): THREE.Mesh {
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
            new THREE.Color('rgb(255, 0, 0)'), // left
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
    }
}
