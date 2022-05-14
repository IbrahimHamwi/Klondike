import { _decorator, Component, Node, SpriteFrame, Prefab, instantiate, Sprite, resources, quat, math } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Klondike')
export class Klondike extends Component {

    // sprite array for card faces
    @property({ type: SpriteFrame }) cardFaces: SpriteFrame[] = [];
    @property({ type: Prefab }) card: Prefab = null;
    public static suits: string[] = ["C", "D", "H", "S"];
    public static values: string[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

    public static deck: string[] = [];

    start() {
        this.PlayCards(); // call the function to play cards
    }

    update(deltaTime: number) {

    }

    PlayCards(): void {
        Klondike.deck = Klondike.GenerateDeck(); // generate the deck
        Klondike.deck = Klondike.ShuffleDeck(Klondike.deck);// shuffle the deck
        Klondike.deck.forEach(card => {
            // console.log(card);
        }
        );
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
        Klondike.deck.forEach(card => {
            let newCard = instantiate(this.card);
            newCard.setRotation(math.quat(0, 0, 0, 1));
            newCard.setPosition(0, 0);
            newCard.name = card;
            console.log(card);

        }
        );
    }
}

