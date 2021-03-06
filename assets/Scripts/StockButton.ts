import { _decorator, Component, Node } from 'cc';
import { Klondike } from './Klondike';
const { ccclass, property } = _decorator;

@ccclass('StockButton')
export class StockButton extends Component {

    private klondike: Klondike;
    start() {
        this.scheduleOnce(function () {
            let klondike: Klondike = Klondike.instance;
            this.node.on(Node.EventType.TOUCH_START, function (event) { // on mouse down
                console.log('Clicked stock button ' + event.target.name);
                Klondike.instance.AddClick();
                klondike.DealFromStock();
            }, this)
        }, 0.1);
    }

    update(deltaTime: number) {

    }
}

