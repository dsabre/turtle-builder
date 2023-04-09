import {defineStore} from 'pinia';
import {useTurtleStore} from './turtle';
import {ref, toRaw} from 'vue';

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

export const useActionsStore = defineStore('actions', () => {
    const turtleStore = useTurtleStore();
    const turtle = toRaw(turtleStore.turtle);
    const listActions = ref<string[]>([]);

    const placeItem = (action: string): boolean => {
        console.log('🚀 ~ file: actions.ts:41 ~ placeItem ~ action:', action);
        return false;
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

    const listener = () => {
        document.addEventListener('keypress', (event) => {
            event.preventDefault();

            const action = event.key;

            if (!validActions.includes(action)) {
                return false;
            }

            if (movements(action)) {
                listActions.value.push(action);
            } else if (placeItem(action)) {
                listActions.value.push(action);
            } else {
                rollbackLastAction();
            }
        });
    };

    return {listener, listActions};
});
