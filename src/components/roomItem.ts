import type { Home } from '@/scenes'
import { roomService } from '@/services/socket'
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
        this.node.setAttribute('data-id', roomData._id)
        this.node.classList.add(`room-item-${roomData._id}`)
        this.roomData = roomData
        this.game = game
        this.setOrigin(0)
        this.create()
    }

    create() {
        this.addListener('click')
        this.on('click', this.handleEventClickRoom)
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
        roomType.node.classList.add('room-item__type')
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
                `${this.roomData.numberOf}/${this.roomData.maxNum}`,
            )
            .setOrigin(0)
        numberOf.node.classList.add('room-item__num')
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
        typeMap.node.classList.add('room-item__type-map')
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

    handleEventClickRoom(e: any) {
        console.log('go on room')
        const ele = e.currentTarget
        const id: string = ele.dataset.id
        roomService.addPlayer(id)
    }
}

export default RoomItem
