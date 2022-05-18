import { _decorator, Component, Node, SpriteFrame, Sprite, Color } from 'cc';
import { Klondike } from './Klondike';
import { Selectable } from './Selectable';
const { ccclass, property } = _decorator;

@ccclass('UpdateSprite')
export class UpdateSprite extends Component {
    @property({ type: SpriteFrame }) cardFace: SpriteFrame;
    @property({ type: SpriteFrame }) cardBack: SpriteFrame;
    @property({ type: Sprite }) spriteRenderer: Sprite;
    private selectable: Selectable;
    private klondike: Klondike;

    start() {
        let deck: string[] = Klondike.GenerateDeck();
        let klondike: Klondike = Klondike.instance;

        let i = 0;
        for (let card of deck) {
            if (this.node.name == card) {
                let suit = card.substring(0, 1);
                let value = card.substring(1, card.length);
                let suitIndex = Klondike.suits.indexOf(suit);
                let valueIndex = Klondike.values.indexOf(value);
                let cardFace = klondike.cardFaces[valueIndex * 4 + suitIndex];
                this.cardFace = cardFace;
                // this.cardFace = klondike.cardFaces[i];
                break;
            }
            i++;
        }
        this.spriteRenderer = this.node.getComponent(Sprite);
        this.selectable = this.node.getComponent(Selectable);

        this.node.on(Node.EventType.MOUSE_DOWN, function (event) { // on mouse down
            // click card options
            console.log('Mouse down ' + this.node.name);
            Klondike.instance.Card(this.node);
        }, this);
    }

    update(deltaTime: number) {
        if (this.selectable.faceup) {
            this.spriteRenderer.spriteFrame = this.cardFace;
        }
        else {
            this.spriteRenderer.spriteFrame = this.cardBack;
        }
        if (Klondike.instance.slot1) {

            if (this.node.name == Klondike.instance.slot1.name) {
                this.spriteRenderer.color = Color.YELLOW;
            } else {
                this.spriteRenderer.color = Color.WHITE;
            }
        }
    }
}

