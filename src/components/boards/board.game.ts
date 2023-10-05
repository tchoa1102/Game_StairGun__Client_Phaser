import type { Home } from '@/scenes'

const CONSTANTS = {
    exitBtn: 'src/assets/exit.png',
}

class Board extends Phaser.GameObjects.DOMElement {
    public name: string
    public callbackExit: CallableFunction | undefined

    protected game: Home

    private contentBoard: Phaser.GameObjects.DOMElement | undefined
    private exitBtn: Phaser.GameObjects.DOMElement | undefined
    constructor(game: any, name: string) {
        super(game, 0, 0, 'section', {
            width: '900px',
            height: '600px',
            position: 'relative',
            top: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(180deg, #63390F 0%, #4E2905 8%)',
            'border-radius': '20px',
            border: '4px #A87123 solid',
        })
        this.setOrigin(0.5, 0)
        this.game = game
        this.name = name
        console.log('name input: ', this.name, name)
    }

    create() {
        const nameBoard = this.game.add
            .dom(
                24,
                8,
                'span',
                {
                    color: '#fff',
                    font: '20px Arial',
                },
                this.name,
            )
            .setOrigin(0)

        this.exitBtn = this.game.add
            .dom(880, 5, 'div', {
                width: '51px',
                height: '28px',
                background: `url(${CONSTANTS.exitBtn})`,
                'box-shadow': '0px 2px 6px rgba(0, 0, 0, 0.75)',
                'border-radius': '6px',
                overflow: 'hidden',
            })
            .setOrigin(1, 0) // render from top - right
            .addListener('click')
            .on('click', this.handleClickExit.bind(this))
        const boardPadding = this.game.add
            .dom(10, 45, 'section', {
                width: '880px',
                height: '530px',
                background: 'linear-gradient(180deg, #DCAB55 0%, #945F02 86%)',
                'border-radius': '10px',
            })
            .setOrigin(0)
        this.contentBoard = this.game.add
            .dom(5, 10, 'section', {
                width: '870px',
                height: '510px',
                background: '#A97739',
                'border-radius': '4px',
                border: '1px black solid',
            })
            .setOrigin(0)
        boardPadding.node.append(this.contentBoard!.node)
        this.node.append(nameBoard.node, this.exitBtn!.node, boardPadding.node)
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
}

export default Board
