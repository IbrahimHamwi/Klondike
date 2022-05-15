import { _decorator, Component, Node, SpriteFrame, Prefab, instantiate, Sprite, resources, quat, math, UITransform } from 'cc';
import { Selectable } from './Selectable';
const { ccclass, property } = _decorator;

@ccclass('Klondike')
export class Klondike extends Component {
    static instance: Klondike;

    // sprite array for card faces
    @property({ type: SpriteFrame }) cardFaces: SpriteFrame[] = [];
    @property({ type: Prefab }) card: Prefab = null;
    @property({ type: Node }) topPos: Node[] = [];
    @property({ type: Node }) bottomPos: Node[] = [];

    public static deck: string[] = [];
    public static suits: string[] = ["C", "D", "H", "S"];
    public static values: string[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

    public bottoms: string[][] = [];
    public tops: string[][] = [];

    private bottom0: string[] = [];
    private bottom1: string[] = [];
    private bottom2: string[] = [];
    private bottom3: string[] = [];
    private bottom4: string[] = [];
    private bottom5: string[] = [];
    private bottom6: string[] = [];

    start() {
        Klondike.instance = this;
        this.bottoms = [this.bottom0, this.bottom1, this.bottom2, this.bottom3, this.bottom4, this.bottom5, this.bottom6];
        this.PlayCards(); // call the function to play cards
    }

    update(deltaTime: number) {

    }

    PlayCards(): void {
        Klondike.deck = Klondike.GenerateDeck(); // generate the deck
        Klondike.deck = Klondike.ShuffleDeck(Klondike.deck);// shuffle the deck
        this.KlondikeSort(); // sort the cards
        this.KlondikeDeal(); // deal the cards
    }

    static ShuffleDeck(deck: string[]): string[] {
        // fischer yates shuffle
        for (let i = 0; i < deck.length; i++) {
            let randomIndex = Math.floor(Math.random() * (i + 1));
            let temp = deck[i];
            deck[i] = deck[randomIndex];
            deck[randomIndex] = temp;
        }
        return deck;
    }
    static GenerateDeck(): string[] {
        Klondike.deck = [];
        for (let suit of Klondike.suits) {
            for (let value of Klondike.values) {
                Klondike.deck.push(suit + value);
            }
        }
        return Klondike.deck;
    }
    KlondikeDeal(): void {
        // deal the cards
        for (let i = 0; i < 7; i++) {
            let yoffset = 0;// offset for the y position of the cards
            let zoffset = 0.03;// offset for the z position of the cards
            this.bottoms[i].forEach(card => {
                let newCard = instantiate(this.card);
                let xoffset = newCard.getComponent(UITransform).contentSize.width / 2
                newCard.setRotation(math.quat(0, 0, 0, 1));
                newCard.setPosition(this.bottomPos[i].worldPosition.x, this.bottomPos[i].position.y + yoffset, this.bottomPos[i].position.z - zoffset);
                newCard.name = card;
                newCard.getComponent(Selectable).faceup = true;
                console.log("KlondikeDeal: " + card);
                this.bottomPos[i].addChild(newCard);
                yoffset -= 30;
            });
        }
    }
    KlondikeSort(): void {
        // sort the cards
        for (let i = 0; i < 7; i++) {
            for (let j = i; j < 7; j++) {
                this.bottoms[j].push(Klondike.deck.pop());
            }
        }
    }
}

