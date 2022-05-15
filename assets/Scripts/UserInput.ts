import { _decorator, Component, Node, Input } from 'cc';
import { Klondike } from './Klondike';
const { ccclass, property } = _decorator;

@ccclass('UserInput')
export class UserInput extends Component {
    private klondike: Klondike;

    start() {
        let klondike: Klondike = Klondike.instance;
    }

    update(deltaTime: number) {
        
    }

}

