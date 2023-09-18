import type { Home } from '@/scenes'
import Board from './board.game'
import RoomItem from './roomItem'

class BoardListRoom {
    private game: Home
    public board: Board | undefined
    private name = 'Sảnh'
    private callbackExit: CallableFunction
    constructor(game: any, callbackExit: CallableFunction) {
        this.game = game
        this.callbackExit = callbackExit
        this.create()
    }

    create() {
        this.board = new Board(this.game, this.name, this.callbackExit)
        this.board.create()

        const roomFunction = this.game.add
            .dom(0, 0, 'section', {
                width: '570px',
                height: '500px',
                background: 'radial-gradient(50% 50% at 50% 50%, #5D3B22 0%, #643A1A 100%)',
                'border-radius': '12px',
            })
            .setOrigin(0)
        // #region header
        const roomFunction_header = this.game.add.dom(0, 12, 'section').setOrigin(0)
        const textRoomFunctionHeader = this.game.add
            .dom(
                10,
                0,
                'span',
                {
                    width: '85px',
                    height: '30px',
                    'text-align': 'center',
                    color: '#fff',
                    'font-size': '13px',
                    'line-height': '13px',
                    'font-family': 'Inter',
                    'font-weight': 400,
                    'word-wrap': 'break-word',
                },
                'Danh sách phòng',
            )
            .setOrigin(0)

        const typesRoom = this.game.add
            .dom(103, 0, 'select', {
                width: '108px',
                height: '30px',
                'padding-top': '3px',
                'padding-bottom': '3px',
                'padding-left': '10px',
                'padding-right': '7px',
                background: '#DCAB55d',
                'justify-content': 'centerd',
                'align-items': 'centerd',
                gap: '9px',
            })
            .setOrigin(0)
        const optionTag = this.game.add.dom(0, 0, 'option', {}, 'Tất cả loại')
        const optionTag2 = this.game.add.dom(0, 0, 'option', {}, 'Thường')
        const optionTag3 = this.game.add.dom(0, 0, 'option', {}, 'Đấu hạng')

        typesRoom.node.append(optionTag.node, optionTag2.node, optionTag3.node)

        const formSearchIdRoom = this.game.add.dom(310, 0, 'form').setOrigin(0)
        formSearchIdRoom.node.setAttribute('id', 'board-room-form')
        const inputID = this.game.add
            .dom(0, 0, 'input', {
                width: '142px',
                height: '30px',
                'padding-top': '7px',
                'padding-bottom': '6px',
                'padding-left': '11px',
                'padding-right': '11px',
                background: '#AB7100',
                color: '#fff',
            })
            .setOrigin(0)
        inputID.node.setAttribute('placeholder', '🔍 Nhập ID phòng')
        inputID.node.setAttribute('name', 'board-room-form__input-find-id')

        const enterBtn = this.game.add
            .dom(
                150,
                0,
                'a',
                {
                    width: '100px',
                    height: '30px',
                    'padding-top': '3px',
                    'padding-bottom': '3px',
                    'text-align': 'center',
                    background: 'linear-gradient(180deg, #E9C808 0%, #A9920B 100%)',
                    'justify-content': 'center',
                    'align-items': 'center',
                    display: 'inline-flex',
                },
                'Tìm',
            )
            .setOrigin(0)
            .addListener('click')
            .on('click', (e: any) => {
                e.preventDefault()
                const input: any = document.getElementsByName('board-room-form__input-find-id')[0]
                const idRoom = input.value
            })

        roomFunction_header.node.append(
            textRoomFunctionHeader.node,
            typesRoom.node,
            formSearchIdRoom.node,
        )
        // #endregion

        // #region body
        const listRoom = this.game.add
            .dom(10, 60, 'section', {
                width: '550px',
                height: '372px',
                padding: '0 10px 10px',
                background:
                    'radial-gradient(42.12% 42.12% at 21.06% 21.06%, #5F4224 0%, #93704B 100%)',
                'border-radius': '12px',
                overflow: 'auto',
            })
            .setOrigin(0)
        listRoom.node.classList.add('d-flex')
        listRoom.node.classList.add('flex-wrap')
        listRoom.node.classList.add('flex-normal')
        listRoom.node.classList.add('scrollbar')
        for (let i = 0; i < 12; i++) {
            const roomItem = new RoomItem(this.game, {
                type: 'Tự do',
                typeMap: 'Ngẫu nhiên',
                numberOf: 1,
                max: 2,
                _id: '1234567890',
            })
            // roomItem.node.classList.add('d-flex')
            roomItem.node.classList.add('position-relative')
            listRoom.node.append(roomItem.node)
        }
        // #endregion

        formSearchIdRoom.node.append(inputID.node, enterBtn.node)
        roomFunction.node.append(roomFunction_header.node, listRoom.node)
        this.board.appendChildToContent(roomFunction.node)
    }
}
export default BoardListRoom
