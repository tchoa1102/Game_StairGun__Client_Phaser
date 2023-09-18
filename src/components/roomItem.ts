import type { Home } from '@/scenes'

const CONSTANTS = {
    roomTypeBackground: 'src/assets/roomTypeBackground.png',
}

class RoomItem extends Phaser.GameObjects.DOMElement {
    private game: Home
    private roomData: any
    constructor(game: any, roomData: any) {
        super(game, 0, 0, 'section', {
            width: '260px',
            height: '70px',
            background: 'linear-gradient(270deg, #AE9066 0%, #86662E 100%)',
            'border-radius': '10px',
            overflow: 'hidden',
            'margin-top': '10px',
            border: '1px solid #cccccc50',
            'box-shadow': '0px 3px 12px 0px rgba(0, 0, 0, 0.75)',
        })
        this.roomData = roomData
        this.game = game
        this.setOrigin(0)
        this.create()
    }

    create() {
        this.addListener('click')
        this.on('click', () => {
            console.log('go on room')
        })
        // #region elements
        const roomTypeBackground = this.game.add
            .dom(0, 0, 'div', {
                width: '120px',
                height: '30px',
                background: `url(${CONSTANTS.roomTypeBackground})`,
            })
            .setOrigin(0)

        const roomType = this.game.add
            .dom(
                10,
                4,
                'span',
                {
                    color: '#fff',
                    'font-size': '14px',
                    'font-family': 'Inter',
                    'font-weight': '400',
                    'word-wrap': 'break-word',
                },
                this.roomData.type,
            )
            .setOrigin(0)
        const numberOf = this.game.add
            .dom(
                230,
                2,
                'span',
                {
                    color: '#fff',
                    'font-size': '14px',
                    'font-family': 'Inter',
                    'font-weight': '400',
                    'word-wrap': 'break-word',
                },
                `${this.roomData.numberOf}/${this.roomData.max}`,
            )
            .setOrigin(0)
        const typeMap = this.game.add
            .dom(
                115,
                16,
                'span',
                {
                    color: '#fff',
                    'font-size': '16px',
                    'font-family': 'Inter',
                    'font-weight': '400',
                    'word-wrap': 'break-word',
                },
                `${this.roomData.typeMap}`,
            )
            .setOrigin(0)
        const idRoom = this.game.add
            .dom(
                24,
                44,
                'span',
                {
                    color: '#fff',
                    'font-size': '16px',
                    'font-family': 'Inter',
                    'font-weight': '400',
                    'word-wrap': 'break-word',
                },
                `ID: ${this.roomData._id}`,
            )
            .setOrigin(0)

        this.node.append(
            roomTypeBackground.node,
            roomType.node,
            numberOf.node,
            typeMap.node,
            idRoom.node,
        )
        // #endregion
    }
}

export default RoomItem
