import * as THREE from 'three';

export default class Actions {
    private validActions = [
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
    private listActions: string[] = [];

    constructor(private turtle: THREE.Mesh) {}

    listener() {
        document.addEventListener('keypress', (event) => {
            event.preventDefault();

            const action = event.key;

            if (!this.validActions.includes(action)) {
                return false;
            }

            if (this.movements(action)) {
                this.listActions.push(action);
            } else if (this.place(action)) {
                this.listActions.push(action);
            } else {
                this.rollbackLastAction();
            }
        });
    }

    private rollbackLastAction() {
        let lastAction = this.listActions.pop();

        if (!lastAction) {
            return;
        }

        switch (lastAction) {
            case 'u':
                this.movements('n');
                break;
            case 'n':
                this.movements('u');
                break;
            case 'i':
                this.movements('k');
                break;
            case 'k':
                this.movements('i');
                break;
            case 'j':
                this.movements('l');
                break;
            case 'l':
                this.movements('j');
                break;
        }
    }

    private place(action: string): boolean {
        return false;
    }

    private movements(action: string): boolean {
        switch (action) {
            case 'u':
                this.turtle.translateY(1);
                return true;
            case 'n':
                if (this.turtle.position.y > 0) {
                    this.turtle.translateY(-1);
                }
                return true;
            case 'i':
                this.turtle.translateX(1);
                return true;
            case 'k':
                this.turtle.translateX(-1);
                return true;
            case 'j':
                this.turtle.rotation.y += Math.PI / 2;
                return true;
            case 'l':
                this.turtle.rotation.y -= Math.PI / 2;
                return true;
        }

        return false;
    }
}
