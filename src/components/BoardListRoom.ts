import type { Home } from '@/scenes'
import Board from './board.game'
import RoomItem from './roomItem'
import roomService from '@/services/socket/room.service'
import { RoomService } from '@/services'
import { useMainStore } from '@/stores'
import { toast } from '@/util/shares'

class BoardListRoom extends Board {
    public content: Phaser.GameObjects.DOMElement | undefined
    private listRoom: Phaser.GameObjects.DOMElement | undefined
    constructor(game: any) {
        super(game, 'Sảnh')
        this.create()
        this.listeningSocket()
    }

    async create() {
        const mainStore: any = useMainStore()
        super.create()
        this.content = this.game.add
            .dom(0, 0, 'section', {
                width: '570px',
                height: '500px',
                background: 'radial-gradient(50% 50% at 50% 50%, #5D3B22 0%, #643A1A 100%)',
                'border-radius': '12px',
            })
            .setOrigin(0)
        // #region left header
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
                    cursor: 'pointer',
                    'font-weight': 'bold',
                    color: '#ddd',
                },
                'Tìm',
            )
            .setOrigin(0)
            .addListener('click')
            .on('click', this.handleEventClickFindRoom)
        enterBtn.node.classList.add('d-flex')
        roomFunction_header.node.append(
            textRoomFunctionHeader.node,
            typesRoom.node,
            formSearchIdRoom.node,
        )
        // #endregion

        // #region left body
        this.listRoom = this.game.add
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
        this.listRoom?.node.classList.add('d-flex')
        this.listRoom?.node.classList.add('flex-wrap')
        this.listRoom?.node.classList.add('flex-normal')
        this.listRoom?.node.classList.add('scrollbar')
        try {
            const listRooms: Array<any> = (await RoomService.getAll()).data
            for (let i = 0; i < listRooms.length; i++) {
                this.createRoom(listRooms[i])
            }
        } catch (e) {
            console.log(e)
        }
        // #endregion

        // #region left footer
        const leftFooter = this.game.add.dom(0, 0, 'section').setOrigin(0)
        const createBtn = this.game.add
            .dom(400, 447, 'div', {
                width: '160px',
                height: '40px',
                'padding-top': '10px',
                'padding-bottom': '10px',
                'padding-left': '38px',
                'padding-right': '39px',
                background:
                    'linear-gradient(180deg, #C0CE6B 0%, #EAED52 100%), linear-gradient(90deg, rgba(248.82, 215.52, 97.46, 0.20) 0%, rgba(160.64, 132.51, 32.80, 0.20) 100%)',
                'box-shadow': '0px 4px 12px rgba(0, 0, 0, 0.75)',
                'justify-content': 'center',
                'align-items': 'center',
                cursor: 'pointer',
            })
            .setOrigin(0)
            .addListener('click')
            .on('click', this.handleEventClickStartBtn)
        createBtn.node.classList.add('d-flex')
        const textCreateBtn = this.game.add
            .dom(
                0,
                0,
                'span',
                {
                    color: '#A76E44',
                    'font-size': '20px',
                    'font-family': 'Inter',
                    'font-weight': '700',
                    'word-wrap': 'break-word',
                },
                'BẮT ĐẦU',
            )
            .setOrigin(0)
        createBtn.node.append(textCreateBtn.node)
        leftFooter.node.append(createBtn.node)

        // #endregion

        formSearchIdRoom.node.append(inputID.node, enterBtn.node)

        this.content!.node.append(roomFunction_header.node, this.listRoom!.node, leftFooter.node)
        this.appendChildToContent(this.content!.node)
    }

    listeningSocket() {
        roomService.listeningUpdateRooms(({ type, data }: { type: string; data: any }) => {
            const id = data._id
            console.log('receiving data room')

            switch (type) {
                case 'create': {
                    console.log('creating room')
                    this.createRoom(data)
                    break
                }
                case 'update': {
                    console.log('updating room')
                    this.editRoom(data)
                    break
                }
                case 'delete': {
                    console.log('deleting room')
                    const item = this.listRoom?.getChildByProperty(
                        'class',
                        `room-item-${id}`,
                    ) as Element
                    item.remove()
                    break
                }
            }
        })
        roomService.listeningAddToRoomError(
            ({ status, message }: { status: number; message: string }) => {
                toast({ message })
            },
        )
    }

    // #region functions handle other features
    createRoom(data: any) {
        const roomItem = new RoomItem(this.game, {
            type: data.type,
            typeMap: data.typeMap,
            numberOf: data.players.length,
            maxNum: data.maxNum,
            _id: data._id,
        })
        roomItem.node.classList.add('position-relative')
        this.listRoom?.node.append(roomItem.node)
    }

    // developing ...
    editRoom(data: any) {
        const id = data._id
        const roomClass = `room-item-${id}`
        const type = 'room-item__type'
        const num = 'room-item__num'
        const typeMap = 'room-item__type-map'
        console.log(data, data.players.length)

        const roomItem = this.listRoom?.node.querySelector('.' + roomClass) as Element
        const roomType = roomItem.querySelector('.' + type) as Element
        roomType.textContent = data.type
        const roomNum = roomItem.querySelector('.' + num) as Element
        roomNum.textContent = `${data.players.length}/${data.maxNum}`
        const roomTypeMap = roomItem.querySelector('.' + typeMap) as Element
        roomTypeMap.textContent = data.typeMap
    }
    // #endregion

    // #region handle events
    handleEventClickFindRoom(e: any) {
        e.preventDefault()
        const input: any = document.getElementsByName('board-room-form__input-find-id')[0]
        const idRoom = input.value
        roomService.addPlayer(idRoom)
    }

    handleEventClickStartBtn(e: any) {
        console.log('start room')

        roomService.create()
    }
    // #endregion handle events
}
export default BoardListRoom
