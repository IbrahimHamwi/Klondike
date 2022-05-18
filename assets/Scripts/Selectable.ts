import { _decorator, Component, Node } from 'cc';
import { UpdateSprite } from './UpdateSprite';
const { ccclass, property } = _decorator;

@ccclass('Selectable')
export class Selectable extends Component {

    top: boolean = false;
    suit: string;
    value: number;
    row: number;
    faceup: boolean = false;
    inDeckPile: boolean = false;

    private valueString: string;

    start() {
        if (this.getComponent(UpdateSprite)) {
            this.suit = this.node.name.substring(0, 1);//get suit

            let c = this.node.name.substring(1, this.node.name.length);//get value
            this.valueString = c;
            if (c == 'A') {
                this.value = 1;
            }
            else if (c == '2') {
                this.value = 2;
            }
            else if (c == '3') {
                this.value = 3;
            }
            else if (c == '4') {
                this.value = 4;
            }
            else if (c == '5') {
                this.value = 5;
            }
            else if (c == '6') {
                this.value = 6;
            }
            else if (c == '7') {
                this.value = 7;
            }
            else if (c == '8') {
                this.value = 8;
            }
            else if (c == '9') {
                this.value = 9;
            }
            else if (c == '10') {
                this.value = 10;
            }
            else if (c == 'J') {
                this.value = 11;
            }
            else if (c == 'Q') {
                this.value = 12;
            }
            else if (c == 'K') {
                this.value = 13;
            }
        }
    }

    update(deltaTime: number) {

    }
}

