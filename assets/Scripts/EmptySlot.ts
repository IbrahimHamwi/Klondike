import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EmptySlot')
export class EmptySlot extends Component {
    start() {
        this.node.on(Node.EventType.MOUSE_DOWN, function (event) { // on mouse down
            console.log('Clicked empty ' + event.target.name);
        }, this);
    }

    update(deltaTime: number) {

    }
}

