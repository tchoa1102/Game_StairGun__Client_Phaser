import type { Home } from '@/scenes'

const CONSTANTS = {
    exitBtn: 'src/assets/exit.png',
}

class Board {
    private game: any
    private name: string
    private contentBoard: Phaser.GameObjects.DOMElement | undefined
    private exitBtn: Phaser.GameObjects.DOMElement | undefined
    public callbackExit: CallableFunction
    constructor(game: any, name: string, callbackExit: CallableFunction) {
        this.game = game
        this.name = name
        this.callbackExit = callbackExit
    }

    create() {
        const board = this.game.add
            .dom(0, 0, 'section', {
                width: '900px',
                height: '600px',
                position: 'relative',
                top: '40px',
                left: '50%',
                background: 'linear-gradient(180deg, #63390F 0%, #4E2905 8%)',
                'border-radius': '20px',
                border: '4px #A87123 solid',
            })
            .setOrigin(0.5, 0)
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
            .on('click', this.callbackExit)
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
        board.node.append(nameBoard.node, this.exitBtn!.node, boardPadding.node)
    }

    appendChildToContent(childNode: Element) {
        this.contentBoard?.node.append(childNode)
    }
}

export default Board
