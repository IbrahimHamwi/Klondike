import { _decorator, Component, Node, SpriteFrame, Sprite } from 'cc';
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
                this.cardFace = klondike.cardFaces[i];
                break;
            }
            i++;
        }
        this.spriteRenderer = this.node.getComponent(Sprite);
        this.selectable = this.node.getComponent(Selectable);
    }

    update(deltaTime: number) {
        if (this.selectable.faceup) {
            this.spriteRenderer.spriteFrame = this.cardFace;
        }
        else {
            this.spriteRenderer.spriteFrame = this.cardBack;
        }
    }
}

