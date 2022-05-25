import { _decorator, Component, Node } from 'cc';
import { UpdateSprite } from './UpdateSprite';
const { ccclass, property } = _decorator;

@ccclass('Selectable')
export class Selectable extends Component {

    @property({ type: Boolean }) top: boolean = false;
    @property({ type: Number }) row: number = 0;
    suit: string;
    value: number = 0;
    faceup: boolean = false;
    inDeckPile: boolean = false;

    private valueString: string;

    start() {
        if (this.getComponent(UpdateSprite)) {
            this.suit = this.node.name.substring(0, 1);//get suit

            let c = this.node.name.substring(1, this.node.name.length);//get value
            this.valueString = c;
            if (this.valueString == 'A') {
                this.value = 1;
            }
            else if (this.valueString == '2') {
                this.value = 2;
            }
            else if (this.valueString == '3') {
                this.value = 3;
            }
            else if (this.valueString == '4') {
                this.value = 4;
            }
            else if (this.valueString == '5') {
                this.value = 5;
            }
            else if (this.valueString == '6') {
                this.value = 6;
            }
            else if (this.valueString == '7') {
                this.value = 7;
            }
            else if (this.valueString == '8') {
                this.value = 8;
            }
            else if (this.valueString == '9') {
                this.value = 9;
            }
            else if (this.valueString == '10') {
                this.value = 10;
            }
            else if (this.valueString == 'J') {
                this.value = 11;
            }
            else if (this.valueString == 'Q') {
                this.value = 12;
            }
            else if (this.valueString == 'K') {
                this.value = 13;
            }
        }
    }

    update(deltaTime: number) {

    }
}

