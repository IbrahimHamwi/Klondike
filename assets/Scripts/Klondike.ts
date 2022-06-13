import { _decorator, Component, Node, SpriteFrame, Prefab, instantiate, Sprite, resources, quat, math, UITransform, find, CCObject, tween, Vec3, v3, Vec2, Tween } from 'cc';
import { AudioController } from './AudioController';
import { Selectable } from './Selectable';
import { TopScript } from './TopScript';
import { UpdateSprite } from './UpdateSprite';
const { ccclass, property } = _decorator;

@ccclass('Klondike')
export class Klondike extends Component {
    static instance: Klondike;

    // sprite array for card faces
    @property({ type: SpriteFrame }) cardFaces: SpriteFrame[] = [];
    @property({ type: Prefab }) cardPrefab: Prefab = null;
    @property({ type: Node }) deckButton: Node = null;
    @property({ type: Node }) topPos: Node[] = [];
    @property({ type: Node }) bottomPos: Node[] = [];
    @property({ type: Node }) slot1: Node = null; // to store what previously has been selected
    @property({ type: Node }) DeckPile: Node = null;

    public deck: string[] = [];
    public discardPile: string[] = []; // whenever a card leaves the deck it gets added to the discard pile
    private trips: number = 0;
    private tripsRemainder: number = 0;
    private deckLocation: number = 0; //track where I am within the deck
    private timer: number = 0;
    private doubleClickTimer: number = 0.3;
    private clickCount: number = 0;

    public static suits: string[] = ["C", "D", "H", "S"];
    public static values: string[] = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "A", "J", "K", "Q",];
    public bottoms: string[][] = [];
    public tops: string[][] = [];
    public tripsOnDisplay: string[] = [];
    public deckTrips: string[][] = [];//chunks of up to 3 cards each


    start() {
        Klondike.instance = this;
        this.slot1 = this.node;
        this.bottoms = [[], [], [], [], [], [], []];
        this.bottomPos.reverse();
        this.scheduleOnce(() => {
            this.PlayCards(); // call the function to play cards
        }, 0.3);
    }

    ResetScene(): void {
        //find all cards and remove them
        this.unscheduleAllCallbacks();
        let cards = this.node.parent.getComponentsInChildren(UpdateSprite);
        for (let i = 0; i < cards.length; i++) {
            cards[i].node.active = false;
            cards[i].node.destroy();
        }
        //clear the top values
        this.ClearTopValues();
        this.bottoms = [[], [], [], [], [], [], []];

        //deal new cards
        this.PlayCards();
    }
    ClearTopValues(): void {
        let tops = this.node.parent.getComponentsInChildren(TopScript);
        for (let i = 0; i < tops.length; i++) {
            let selectable = tops[i].node.getComponent(Selectable);
            selectable.value = 0;
            selectable.suit = "";
        }

    }

    update(deltaTime: number) {
        if (this.clickCount == 1) {
            console.log("click count is 1");
            this.timer += deltaTime;
        }
        if (this.clickCount >= 3) {
            console.log("click count is 3");
            this.timer = 0;
            this.clickCount = 1;
        }
        if (this.timer > this.doubleClickTimer) {
            console.log("greater than double click timer");
            this.clickCount = 0;
            this.timer = 0;
        }
        if (this.clickCount == 2) {
            console.log("click count is 2");
        }

    }

    PlayCards(): void {
        Klondike.instance.deck = Klondike.GenerateDeck(); // generate the deck
        Klondike.instance.deck = Klondike.ShuffleDeck(Klondike.instance.deck);// shuffle the deck
        AudioController.instance.playPlayCardsSound();
        // console.log("size of deck: " + Klondike.instance.deck.length);
        this.KlondikeSort(); // sort the cards
        this.KlondikeDeal(); // deal the cards
        this.SortDeckIntoTrips(); // sort the cards into trips
        // console.log("deck card are: " + Klondike.instance.deck);
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
        let deck = [];
        for (let suit of Klondike.suits) {
            for (let value of Klondike.values) {
                deck.push(suit + value);
            }
        }
        return deck;
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
                    let newCard = instantiate(this.cardPrefab);
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
                    // this.discardPile.push(card);
                }, waitcounter * 0.1);
                waitcounter++;
            });
        }
        this.discardPile = this.discardPile.filter(function (value, index, arr) {
            return arr.indexOf(value) == index;
        });
        // console.log("discard pile: " + this.discardPile);
        // this.discardPile.forEach(card => {
        //     if (Klondike.instance.deck.indexOf(card) != -1) { // if the card is still in the deck
        //         Klondike.instance.deck.splice(Klondike.instance.deck.indexOf(card), 1);// remove it from the deck
        //     }
        // })
        this.discardPile = [];
        // console.log("discard pile has been cleared");
    }
    KlondikeSort(): void {
        // sort the cards
        for (let i = 0; i < 7; i++) {
            for (let j = i; j < 7; j++) {
                this.bottoms[j].push(Klondike.instance.deck.pop());
            }
        }
    }
    SortDeckIntoTrips(): void { // sort the cards into trips
        this.trips = Math.floor(Klondike.instance.deck.length / 3);
        this.tripsRemainder = Klondike.instance.deck.length % 3;
        this.deckTrips = [];

        let modifier = 0;
        for (let i = 0; i < this.trips; i++) {
            let myTrips = [];
            for (let j = 0; j < 3; j++) {
                myTrips.push(Klondike.instance.deck[j + modifier]);
            }
            this.deckTrips.push(myTrips);
            modifier += 3;
        }
        if (this.tripsRemainder != 0) {
            let myRemainders = [];
            modifier = 0;
            for (let k = 0; k < this.tripsRemainder; k++) {
                myRemainders.push(Klondike.instance.deck[Klondike.instance.deck.length - this.tripsRemainder + modifier]);
                modifier++;
            }
            this.deckTrips.push(myRemainders);
            this.trips += 1;
        }
        this.deckLocation = 0;
    }
    DealFromStock(): void {
        //console.log("Deal from stock");
        // add remaining cards to the discard pile
        this.DeckPile.children.forEach(child => {
            if (child.getComponent(UpdateSprite)) {
                Klondike.instance.deck.splice(Klondike.instance.deck.indexOf(child.name), 1);
                this.discardPile.push(child.name);
                //console.log("removed: " + child.name);
                // console.log("discard pile: " + this.discardPile);
                //console.log("length of discard pile: " + this.discardPile.length);
                child.destroy();
            }
        });


        if (this.deckLocation < this.trips) {
            AudioController.instance.playStockSound();
            //draw 3 new cards
            //console.log("draw 3 new cards");
            this.tripsOnDisplay = [];// clear the trips on display
            let xoffset = 130;
            let zoffset = 3;
            this.deckTrips[this.deckLocation].forEach(card => {
                // console.log("card to be instantiated: " + card);
                let newTopCard: Node = instantiate(this.cardPrefab); // instantiate a new card
                this.DeckPile.addChild(newTopCard);
                newTopCard.setWorldPosition(
                    this.deckButton.worldPosition.x + xoffset,
                    this.deckButton.worldPosition.y,
                    this.deckButton.worldPosition.z + zoffset); // set the position of the card
                newTopCard.setRotation(math.quat(0, 0, 0, 1));
                xoffset += 40;
                zoffset += 3;
                newTopCard.name = card;
                this.tripsOnDisplay.push(card);
                newTopCard.getComponent(Selectable).faceup = true; // set the card to face up
                newTopCard.getComponent(Selectable).inDeckPile = true;
            });
            this.deckLocation++;
        }
        else {
            //console.log("no more cards to draw");
            this.RestackTopDeck();//restack the stock
        }
    }
    RestackTopDeck(): void {
        Klondike.instance.deck == [];// clear the deck
        this.discardPile.forEach(card => {
            //console.log("length of discard pile: " + this.discardPile.length);
            Klondike.instance.deck.push(card);
            // console.log("deck: " + Klondike.instance.deck);
        })
        this.discardPile = [];
        this.SortDeckIntoTrips();
    }

    Top(selected: Node): void { // top click actions
        //console.log("clicked on top");
        if (this.slot1.getComponent(UpdateSprite)) {
            //if the card is an ace and the empty slot is top the stack
            if (this.slot1.getComponent(Selectable).value == 1) {
                //console.log("ace in slot 1");
                this.Stack(selected);// stack the card
            }

        }
    }
    Bottom(selected: Node): void {
        //console.log("clicked on bottom");
        if (this.slot1.getComponent(UpdateSprite)) {
            //if the card is a king and the empty slot is bottom the stack
            if (this.slot1.getComponent(Selectable).value == 13) {
                //console.log("king in slot 1");
                this.Stack(selected);// stack the card
            }
        }
    }
    Card(selected: Node): void {
        if (!selected.getComponent(Selectable).faceup) {//if the card clicked on is facedown
            // console.log("card is facedown");
            if (!this.Blocked(selected)) {//if the the card clicked on is not blocked
                // console.log("card is not blocked");
                selected.getComponent(Selectable).faceup = true;// flip it over
                AudioController.instance.playCardFlipSound();
                this.slot1 = this.node;
            }
        }
        else if (selected.getComponent(Selectable).inDeckPile) { // if the card clicked on is in the deck pile with the trips
            if (!this.Blocked(selected)) { // if it is not blocked
                // console.log("card is not blocked");
                if (this.slot1 == selected) {
                    // console.log("card is clicked on twice");
                    if (this.DoubleClick()) {
                        // console.log("double click");
                        // this.AutoStack(selected);//attempt autostack
                    }
                }
                else {
                    this.slot1 = selected;// select it
                }
            }
        }
        else {
            // if the card is face up
            // if there is no currently selected card
            // select it

            if (this.slot1 == this.node) { //not null because we pass in this gameobject instead
                // console.log("slot1 is empty");
                this.slot1 = selected;
                console.log("slot 1: " + this.slot1.name);
            }

            //if there is already a card selected(and it is not the same card)
            else if (this.slot1 != selected) {
            // console.log("slot1 is not empty");
            // if the new card is eligible to stack on the old card
                if (this.Stackable(selected)) {
                // stack the cards
                this.Stack(selected);
                // console.log("cards stacked");

                } else {
                // select the new card
                this.slot1 = selected;
                console.log("selecting new card " + selected.name);
                }
            }
            // if the card is eligible to fly up top then do it
            else if (this.slot1 == selected) {// else if there is already a card selected and it is the same card
                if (this.DoubleClick()) {// if the time is short enough the it is a double click
                //attempt autostack
                // this.AutoStack(selected);
                }
            }
        }
    }
    Stackable(selected: Node): boolean {
        let s1: Selectable = this.slot1.getComponent(Selectable);
        let s2: Selectable = selected.getComponent(Selectable);
        //compare them to see if the stack
        // console.log("s1.value: " + s1.value + " s2.value: " + s2.value);

        if (!s2.inDeckPile) {
            if (s2.top) {//if in the top pile must stack suited Ace to King
                // console.log("s2 is top");
                if (s1.suit == s2.suit || (s1.value == 1 && s2.value == null)) {
                    // console.log("s1 and s2 are suited or s1 is Ace and s2 is null");
                    if (s1.value == s2.value + 1) {
                        // console.log("s1 and s2 are one value apart");
                        // console.log("stackable");
                        return true;
                    }
                }
                else {
                    // console.log("s1 and s2 are not suited or s1 is Ace and s2 is null");
                    return false;
                }
            }
            else {
                // console.log("s2 is not top");
                //if in the bottom pile must stack alternate colors king to ace
                if (s1.value == s2.value - 1) {
                    // console.log("s1 and s2 are one value apart");
                    let card1Red = true;
                    let card2Red = true;
                    if (s1.suit == "C" || s1.suit == "S") {
                        // console.log("s1 is red");
                        console.log("not stackable");
                        card1Red = false;
                    }
                    if (s2.suit == "C" || s2.suit == "S") {
                        // console.log("s2 is red");
                        console.log("not stackable");
                        card2Red = false;
                    }
                    if (card1Red == card2Red) {
                        console.log("not stackable");
                        return false;
                    }
                    else {
                        // console.log("Stackable");
                        return true;
                    }
                } else {
                    // console.log("s1 and s2 are not one value apart");
                }
            }
        }
        console.log("not stackable");
        return false;
    }
    Stack(selected: Node): void {
        AudioController.instance.playStackSound();
        //if on top king or empty bottom stack cards in plance
        //else stack the cards with a negative y offset
        // console.log("stacking cards");
        let s1: Selectable = this.slot1.getComponent(Selectable);
        let s2: Selectable = selected.getComponent(Selectable);
        let yoffset = -30

        if (s2.top || (!s2.top && s1.value == 13)) {
            yoffset = 0;
        }
        // this.slot1.removeFromParent();
        // let ballTween = new Tween(this.slot1)
        //     .call(() => selected.addChild(this.slot1))
        //     .to(2, { position: new Vec3(selected.position.x, 0, 0) })
        //     .start();
        selected.addChild(this.slot1);
        // tween(this.slot1).to(2.5, { position: new Vec3(0, yoffset, 0) }).start();
        this.slot1.setPosition(0, yoffset, 0);
        // console.log("position of slot1: " + this.slot1.position);

        if (s1.inDeckPile) { // remove the cards from the top pile to prevent duplicate cards
            this.tripsOnDisplay.splice(this.tripsOnDisplay.indexOf(this.slot1.name), 1);
            this.deck.splice(this.deck.indexOf(this.slot1.name), 1);
            // console.log("removed " + this.slot1.name + " from tripsOnDisplay");
            // console.log("tripsOnDisplay: " + this.tripsOnDisplay);
        }
        else if (s1.top && s2.top && s1.value == 1) { //allow movement of cards between top spots
            this.topPos[s1.row].getComponent(Selectable).value = 0;
            this.topPos[s1.row].getComponent(Selectable).suit = null;
            // that way if an ace is moved from one space to another, the space no longer keeps track of the value.
        } else if (s1.top) { // keep track of the current value of the top decks as a card has been removed
            this.topPos[s1.row].getComponent(Selectable).value = s1.value - 1;
        } else { // removes the card string from the appropriate bottom pile
            this.bottoms[s1.row].splice(this.bottoms[s1.row].indexOf(this.slot1.name), 1);
        }
        s1.inDeckPile = false;//you cannot adds to the trips pile so this is always fine
        s1.row = s2.row;

        if (s2.top) { //moves a card to the top of the pile and assigns the top's value and suit
            this.topPos[s1.row].getComponent(Selectable).value = s1.value;
            this.topPos[s1.row].getComponent(Selectable).suit = s1.suit;
            s1.top = true;
        }
        else {
            s1.top = false;
        }
        //after completing move reset slot1 to be essentially null as being null will break the logic
        this.slot1 = this.node;
    }
    Blocked(selected: Node): boolean {
        let s2: Selectable = selected.getComponent(Selectable);
        if (s2.inDeckPile == true) { //if the card is in the deck pile
            // console.log("card is in the deck pile");
            if (s2.node.name == this.tripsOnDisplay[this.tripsOnDisplay.length - 1]) { //if the card is the last card in the deck pile
                // console.log("the selected card " + s2.node.name + " is the last card in the deck pile");
                // console.log("card is not blocked");
                return false;
            }
            else {
                // console.log(s2.node.name + " is blocked by " + this.tripsOnDisplay[this.tripsOnDisplay.length - 1]);
                // console.log("card is blocked");
                return true;
            }
        }
        else {
            // console.log("the selected card " + s2.node.name + " is in the bottoms");
            if (s2.node.name == this.bottoms[s2.row][this.bottoms[s2.row].length - 1]) { //check if is the bottom card
                // console.log("the selected card row is " + s2.row);
                // console.log(s2.node.name + " is the bottom card");
                // console.log("card is not blocked");
                return false;
            } else {
                // console.log("card is blocked by " + this.bottoms[s2.row][this.bottoms[s2.row].length - 1]);
                // console.log(s2.node.name + " is not the bottom card");
                // console.log("card is blocked");
                return true;
            }   
        }
    }
    AddClick(): void {
        // console.log("add click");
        this.clickCount += 1;
    }
    ResetClick(): void {
        // console.log("reset click");
        this.clickCount = 0;
    }
    DoubleClick(): boolean {
        if (this.timer < this.doubleClickTimer && this.clickCount == 2) {
            console.log("double click");
            return true;
        } else {
            // console.log("single click");
            // console.log("click count is " + this.clickCount);
            // console.log("timer is " + this.timer + " and double click timer is " + this.doubleClickTimer);
            return false;
        }
    }
    AutoStack(selected: Node): void {
        // console.log("autostacking cards");
        for (let i = 0; i < this.topPos.length; i++) {
            // console.log("checking top " + i);
            let stack: Selectable = this.topPos[i].getComponent(Selectable);
            if (selected.getComponent(Selectable).value == 1) { //if the card is an ace
                // console.log("selected card is an ace");
                if (this.topPos[i].getComponent(Selectable).value == 0) { // and the top position is empty
                    // console.log("top position is empty");
                    this.slot1 = selected;
                    this.Stack(stack.node);// stack the ace on top
                    break;                  // in the first empty position found
                } else {
                    // console.log("top position is not empty");
                    // console.log("top position value is " + this.topPos[i].getComponent(Selectable).value);
                }
            }
            else if (this.topPos[i].getComponent(Selectable).suit == this.slot1.getComponent(Selectable).suit && this.topPos[i].getComponent(Selectable).value == this.slot1.getComponent(Selectable).value - 1) {
                console.log("selected card is one value away from the top card");
                if (this.slot1.children.length == 0) { //if it is the last card (if it has no children)
                    console.log("slot 1 " + this.slot1.name + " has no children");
                    this.slot1 = selected;
                    // find a top spot that matches the conditions for auto stacking if it exists
                    let lastCardName: string = stack.suit + stack.value.toString();
                    if (stack.value == 1) {
                        lastCardName = stack.suit + "A";
                        console.log("last card name is " + lastCardName);
                    }
                    if (stack.value == 11) {
                        lastCardName = stack.suit + "J";
                        console.log("last card name is " + lastCardName);

                    }
                    if (stack.value == 12) {
                        lastCardName = stack.suit + "Q";
                        console.log("last card name is " + lastCardName);
                    }
                    if (stack.value == 13) {
                        lastCardName = stack.suit + "K";
                        console.log("last card name is " + lastCardName);
                    }
                    let lastCard: Node = null;
                    for (let i = 0; i < this.bottomPos.length; i++) {
                        // console.log("checking bottom " + i);
                        for (let j = 0; j < this.bottomPos[i].children.length; j++) {
                            // console.log("checking bottom " + i + " child " + j);
                            if (this.bottomPos[i].children[j].name == lastCardName) {
                                // console.log("found last card");
                                lastCard = this.bottomPos[i].children[j];
                                this.Stack(lastCard);
                                break;
                            }
                        }
                    }
                }
                else {
                    console.log("selected card is not the last card");
                }
            } else {
                console.log("selected card is not one value away from the top card");
            }
        }
    }
    HasNoChildren(card: Node): boolean {
        let children: Node[] = card.children;
        if (children.length == 0) {
            return true;
        }
        else {
            return false;
        }
    }

}

    // FindNodeWithName(name: string): Node {
    //     for (let i = 0; i < this.topPos.length; i++) {
    //         let stack: Node = this.topPos[i];
    //         if (stack.name == name) {
    //             return stack;
    //         }
    //     for (let i = 0; i < this.bottoms.length; i++) {
    //         let stack: Node = this.bottoms[i][this.bottoms[i].length - 1];
    //         if (stack.name == name) {
    //             return stack;
    //         }
    //     }
    // }




