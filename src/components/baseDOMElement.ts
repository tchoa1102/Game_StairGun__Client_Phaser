import type { GamePlay, Home, PrepareDuel } from '@/scenes'
import { useMainStore } from '@/stores'

export default abstract class BaseDOM extends Phaser.GameObjects.DOMElement {
    protected game: Home | PrepareDuel | GamePlay
    protected mainStore: any
    // protected game: any
    constructor(game: any, style: { [key: string]: string }) {
        super(game, 0, 0, 'section', style)
        this.setOrigin(0)
        this.game = game
        this.mainStore = useMainStore()
    }

    createContainer(tag: string, style: { [key: string]: string }) {
        const section = this.game.add.dom(0, 0, tag, style).setOrigin(0)
        section.node.classList.add('position-relative')
        section.node.classList.add('d-flex')
        return section
    }

    createText(tag: string, style: { [key: string]: string }, message: string) {
        const text = this.game.add.dom(0, 0, tag, style, message).setOrigin(0)
        text.node.classList.add('position-relative')
        return text
    }

    createBtn(tag: string, style: { [key: string]: string }) {
        const btn = this.game.add.dom(0, 0, tag, style).setOrigin(0)
        btn.node.classList.add('position-relative')
        return btn
    }

    createIcon(icon: string, style: Record<string, string | number>) {
        const iconDOM = this.game.add.dom(0, 0, 'iconify-icon', style).setOrigin(0)
        iconDOM.node.setAttribute('icon', icon)
        iconDOM.node.classList.add('position-relative')
        return iconDOM
    }
}
