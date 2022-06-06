import { _decorator, Component, Node, AudioSource, assert, AudioClip } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioController')
export class AudioController extends Component {
    static instance: AudioController;

    @property({ type: AudioClip }) cardFlip: AudioClip = null;
    @property({ type: AudioClip }) stack: AudioClip = null;
    @property({ type: AudioClip }) playCards: AudioClip = null;
    @property({ type: AudioClip }) stock: AudioClip = null;

    onLoad() {
        // Get the audio source component
        const audioSource = this.node.getComponent(AudioSource);
        // Check if it contains AudioSource component, if not, output error message
        assert(audioSource, 'AudioSource component not found!');
        AudioController.instance = this;

    }

    playCardFlipSound(): void {
        this.node.getComponent(AudioSource).playOneShot(this.cardFlip);
    }
    playStackSound(): void {
        this.node.getComponent(AudioSource).playOneShot(this.stack);
    }
    playPlayCardsSound(): void {
        this.node.getComponent(AudioSource).playOneShot(this.playCards);
    }
    playStockSound(): void {
        this.node.getComponent(AudioSource).playOneShot(this.stock);
    }
}

