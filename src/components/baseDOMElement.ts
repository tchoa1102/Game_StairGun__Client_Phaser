import type { Home } from '@/scenes'

export default class BaseDOM extends Phaser.GameObjects.DOMElement {
    // protected game: Home
    protected game: any
    constructor(game: any, style: { [key: string]: string }) {
        super(game, 0, 0, 'section', style)
        this.setOrigin(0)
        this.game = game
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
}
