import type { GamePlay, Home, PrepareDuel } from '@/scenes'
import { useMainStore } from '@/stores'

const CONSTANTS = {
    exitBtn: 'src/assets/exit.png',
}

abstract class Board extends Phaser.GameObjects.DOMElement {
    public name: string
    public callbackExit: CallableFunction | undefined

    protected game: Home | PrepareDuel | GamePlay
    protected mainStore: any

    protected className: string = 'board'
    private contentBoard: Phaser.GameObjects.DOMElement | undefined
    private exitBtn: Phaser.GameObjects.DOMElement | undefined
    constructor(game: any, name: string) {
        super(game, 0, 0, 'section', {})
        this.node.classList.add(this.className)
        this.setOrigin(0.5, 0)
        this.game = game
        this.mainStore = useMainStore()
        this.name = name
        console.log('name input: ', this.name, name)
    }

    create(): typeof this {
        const header = this.createContainer('section', {
            'justify-content': 'space-between',
        })
        const nameBoard = this.createText('span', {}, this.name)
        nameBoard.node.classList.add(this.className + '__name')

        this.exitBtn = this.game.add
            .dom(0, 0, 'div', { background: `url(${CONSTANTS.exitBtn})` })
            .setOrigin(1, 0) // render from top - right
            .addListener('click')
            .on('click', this.handleClickExit.bind(this))
        this.exitBtn.node.classList.add(this.className + '__btn-exit')
        this.exitBtn.node.classList.add('position-relative')
        header.node.append(nameBoard.node, this.exitBtn!.node)

        const boardPadding = this.createContainer('section', {})
        boardPadding.node.classList.add(this.className + '__board-padding')
        this.contentBoard = this.createContainer('section', {})
        this.contentBoard.node.classList.add(this.className + '__board-padding__content')
        boardPadding.node.append(this.contentBoard!.node)
        this.node.append(header.node, boardPadding.node)

        return this
    }

    update() {
        // if (
        //     // add role to if clause run true
        //     // this.game.scene.isVisible(`${this.game.scene.key}`) &&
        //     this!.node.className.includes('d-none')
        // ) {
        //     this!.node.classList.remove('d-none')
        // }
    }

    appendChildToContent(childNode: Element) {
        this.contentBoard?.node.append(childNode)
    }

    // #region handle event
    handleClickExit(e: Event) {
        if (this.callbackExit !== undefined) {
            this.callbackExit()
        }
    }
    setCallbackExit(callback: CallableFunction) {
        this.callbackExit = callback
    }
    // #endregion handle event

    // #region share functionality
    hidden() {
        this.node.classList.add('d-none')
    }

    show() {
        try {
            this.node.classList.remove('d-none')
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }
    // #endregion share functionality

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

export default Board
