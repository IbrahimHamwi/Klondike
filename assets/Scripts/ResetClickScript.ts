import { _decorator, Component, Node } from 'cc';
import { Klondike } from './Klondike';
const { ccclass, property } = _decorator;

@ccclass('ResetClickScript')
export class ResetClickScript extends Component {
    start() {
        this.node.on(Node.EventType.MOUSE_DOWN, function (event) { // on mouse down
            // click card options
            console.log('Mouse down ' + this.node.name);
            Klondike.instance.ResetClick();
        }, this);
    }

    update(deltaTime: number) {

    }
}

