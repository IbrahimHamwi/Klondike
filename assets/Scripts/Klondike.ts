import { _decorator, Component, Node, SpriteFrame, Prefab, instantiate, Sprite, resources, quat, math, UITransform } from 'cc';
import { Selectable } from './Selectable';
import { UpdateSprite } from './UpdateSprite';
const { ccclass, property } = _decorator;

@ccclass('Klondike')
export class Klondike extends Component {
    static instance: Klondike;

    // sprite array for card faces
    @property({ type: SpriteFrame }) cardFaces: SpriteFrame[] = [];
    @property({ type: Prefab }) card: Prefab = null;
    @property({ type: Node }) deckButton: Node = null;
    @property({ type: Node }) topPos: Node[] = [];
    @property({ type: Node }) bottomPos: Node[] = [];
    @property({ type: Node }) slot1: Node = null;

    public static deck: string[] = [];
    public discardPile: string[] = [];
    private trips: number;
    private tripsRemainder: number;
    private deckLocation: number;

    public static suits: string[] = ["C", "D", "H", "S"];
    public static values: string[] = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "A", "J", "K", "Q",];
    public bottoms: string[][] = [];
    public tops: string[][] = [];
    public tripsOnDisplay: string[] = [];
    public deckTrips: string[][] = [];

    private bottom0: string[] = [];
    private bottom1: string[] = [];
    private bottom2: string[] = [];
    private bottom3: string[] = [];
    private bottom4: string[] = [];
    private bottom5: string[] = [];
    private bottom6: string[] = [];

    start() {
        Klondike.instance = this;
        this.slot1 = this.node;
        this.bottoms = [this.bottom0, this.bottom1, this.bottom2, this.bottom3, this.bottom4, this.bottom5, this.bottom6];
        this.bottomPos.reverse();
        this.scheduleOnce(() => {
            this.PlayCards(); // call the function to play cards
        }, 0.3);
    }

    update(deltaTime: number) {

    }

    PlayCards(): void {
        Klondike.deck = Klondike.GenerateDeck(); // generate the deck
        Klondike.deck = Klondike.ShuffleDeck(Klondike.deck);// shuffle the deck
        this.KlondikeSort(); // sort the cards
        this.KlondikeDeal(); // deal the cards
        this.SortDeckIntoTrips(); // sort the cards into trips
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
        let waitcounter = 0;
        for (let i = 0; i < 7; i++) {
            let yoffset = 0;// offset for the y position of the cards
            let zoffset = 0.03;// offset for the z position of the cards
            this.bottoms[i].forEach(card => {
                let counter = i;
                this.scheduleOnce(() => {
                    let newCard = instantiate(this.card);
                    let xoffset = newCard.getComponent(UITransform).contentSize.width / 2
                    newCard.setRotation(math.quat(0, 0, 0, 1));
                    newCard.name = card;
                    newCard.getComponent(Selectable).row = i;
                    if (card == this.bottoms[counter][this.bottoms[counter].length - 1]) {

                        newCard.getComponent(Selectable).faceup = true;
                    }
                    this.bottomPos[counter].addChild(newCard);
                    newCard.setWorldPosition(this.bottomPos[counter].worldPosition.x, this.bottomPos[counter].worldPosition.y + yoffset, this.bottomPos[counter].worldPosition.z - zoffset);
                    yoffset -= 30;
                    zoffset += 0.03;
                    this.discardPile.push(card);
                }, waitcounter * 0.1);
                waitcounter++;
            });
        }
        this.discardPile.forEach(card => {
            if (Klondike.deck.indexOf(card) != -1) {
                Klondike.deck.splice(Klondike.deck.indexOf(card), 1);
            }
        })
        this.discardPile = [];
    }
    KlondikeSort(): void {
        // sort the cards
        for (let i = 0; i < 7; i++) {
            for (let j = i; j < 7; j++) {
                this.bottoms[j].push(Klondike.deck.pop());
            }
        }
    }
    SortDeckIntoTrips(): void {
        this.trips = Klondike.deck.length / 3;
        this.tripsRemainder = Klondike.deck.length % 3;
        this.deckTrips = [];

        let modifier = 0;
        for (let i = 0; i < this.trips; i++) {
            let myTrips = [];
            for (let j = 0; j < 3; j++) {
                myTrips.push(Klondike.deck[j + modifier]);
            }
            this.deckTrips.push(myTrips);
            modifier += 3;
        }
        if (this.tripsRemainder != 0) {
            let myRemainders = [];
            modifier = 0;
            for (let k = 0; k < this.tripsRemainder; k++) {
                myRemainders.push(Klondike.deck[Klondike.deck.length - this.tripsRemainder + modifier]);
                modifier++;
            }
            this.deckTrips.push(myRemainders);
            this.trips += 1;
        }
        console.log(this.deckTrips);
        this.deckLocation = 0;
    }
    DealFromDeck(): void {
        console.log("DealFromDeck");
        // add remaining cards to the discard pile
        this.deckButton.children.forEach(child => {
            if (child.getComponent(UpdateSprite)) {
                Klondike.deck.splice(Klondike.deck.indexOf(child.name), 1);
                this.discardPile.push(child.name);
                child.destroy();
            }
        });


        if (this.deckLocation < this.trips) {
            //draw 3 new cards
            console.log("draw 3 new cards");
            this.tripsOnDisplay = [];// clear the trips on display
            let xoffset = 130;
            let zoffset = 3;
            this.deckTrips[this.deckLocation].forEach(card => {
                console.log("card: " + card);
                let newTopCard: Node = instantiate(this.card); // instantiate a new card
                this.deckButton.addChild(newTopCard); // add the card to the deck button
                newTopCard.setWorldPosition(
                    this.deckButton.worldPosition.x + xoffset,
                    this.deckButton.worldPosition.y,
                    this.deckButton.worldPosition.z + zoffset); // set the position of the card
                newTopCard.setRotation(math.quat(0, 0, 0, 1));
                xoffset += 25;
                zoffset += 3;
                newTopCard.name = card;
                this.tripsOnDisplay.push(card);
                newTopCard.getComponent(Selectable).faceup = true;
                newTopCard.getComponent(Selectable).inDeckPile = true;
            });
            this.deckLocation++;
        }
        else {
            console.log("no more cards to draw");
            //restack the top deck

        }
    }
    RestackTopDeck(): void {
        this.discardPile.forEach(card => {
            Klondike.deck.push(card);
        })
        this.discardPile = [];
        this.SortDeckIntoTrips();
    }
    Card(selected: Node): void {
        console.log("Card " + selected.name);
        let comp = selected.getComponent(UpdateSprite);
        if (this.slot1 == this.node) {
            this.slot1 = selected;
        }

        //if the card clicked on is facedown
        //if the the card clicked on is not blocked
        // flip it over

        //if the card clicked on is in the deck pile with the trips
        // if it is not blocked
        // select it

        // if the card is face up
        // if there is no currently selected card
        // select it

        //  if there is already a card selected(and it is not the same card)
        else if (this.slot1 != selected) {// if the new card is eligible to stack on the old card
            if (this.Stackable(selected)) {
                this.slot1 = selected; // stack the cards
            } else {
                // select the new card
                this.slot1 = selected;
            }
        }


        // else if there is already a card selected and it is the same card
        // if the time is short enough the it is a double click
        // if the card is eligible to fly up top then do it
    }
    Stackable(selected: Node): boolean {
        let s1: Selectable = this.slot1.getComponent(Selectable);
        let s2: Selectable = selected.getComponent(Selectable);
        //compare them to see if the stack

        //if in the top pile must stack suited Ace to King
        if (s2.top) {
            if (s1.suit == s2.suit || (s1.value == 1 && s2.value == null)) {
                if (s1.value == s2.value - 1) {
                    if (s1.value == s2.value + 1) {
                        return true;
                    }
                }
                else {
                    return false;
                }
            }
        }
        else {//if in the bottom pile must stack alternate colors king to ace
            if (s1.value == s2.value - 1) {
                let card1Red = true;
                let card2Red = true;
                if (s1.suit == "C" || s1.suit == "S") {
                    card1Red = false;
                }
                if (s2.suit == "C" || s2.suit == "S") {
                    card2Red = false;
                }
                if (card1Red == card2Red) {
                    return true;
                }
                else {
                    console.log("Stackable");
                    return false;
                }
            }
        }
        return false;
    }
    Stack(selected: Node): void {

    }
}



