export default class BaseScene extends Phaser.Scene {
    constructor(key: string) {
        super(key)
    }

    createContainer(tag: string, style: { [key: string]: string }) {
        const section = this.add.dom(0, 0, tag, style).setOrigin(0)
        section.node.classList.add('position-relative')
        section.node.classList.add('d-flex')
        return section
    }

    createText(tag: string, style: { [key: string]: string }, message: string) {
        const text = this.add.dom(0, 0, tag, style, message).setOrigin(0)
        text.node.classList.add('position-relative')
        return text
    }

    createBtn(tag: string, style: { [key: string]: string }) {
        const btn = this.add.dom(0, 0, tag, style).setOrigin(0)
        btn.node.classList.add('position-relative')
        return btn
    }
}
