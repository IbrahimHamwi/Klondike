import { _decorator, Component, Node, SpriteFrame, Sprite, Color, Event, instantiate } from 'cc';
import { Klondike } from './Klondike';
import { Selectable } from './Selectable';
const { ccclass, property } = _decorator;

@ccclass('UpdateSprite')
export class UpdateSprite extends Component {
    @property({ type: SpriteFrame }) cardFace: SpriteFrame;
    @property({ type: SpriteFrame }) cardBack: SpriteFrame;
    @property({ type: SpriteFrame }) cardOutLine: SpriteFrame;
    @property({ type: Sprite }) spriteRenderer: Sprite;
    @property({ type: Sprite }) outlineRenderer: Sprite;
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
        this.outlineRenderer = this.node.getComponentInChildren(Sprite);
        this.selectable = this.node.getComponent(Selectable);

        this.node.on(Node.EventType.TOUCH_START, function (event) { // on mouse down
            // click card options
            console.log('Mouse down ' + this.node.name);
            Klondike.instance.AddClick();
            Klondike.instance.Card(this.node);
            event.propagationStopped = true;
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
                this.outlineRenderer.spriteFrame = this.cardOutLine;
            } else {
                this.outlineRenderer.spriteFrame = null;
            }
        }
        if (!Klondike.instance.Blocked(this.node)) {
            this.node.getComponent(Selectable).faceup = true;
        }
    }
}

