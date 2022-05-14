import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Klondike')
export class Klondike extends Component {

    // public static string[] suits = ["C", "D", "H", "S"];
    public static suits: string[] = ["C", "D", "H", "S"];
    public static values: string[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

    public static deck: string[] = [];



    start() {
        this.PlayCards();
    }

    update(deltaTime: number) {

    }

    PlayCards(): void {
        Klondike.deck = Klondike.GenerateDeck();
        Klondike.deck = Klondike.ShuffleDeck(Klondike.deck);
        Klondike.deck.forEach(card => {
            console.log(card);
        }
        );
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
}

