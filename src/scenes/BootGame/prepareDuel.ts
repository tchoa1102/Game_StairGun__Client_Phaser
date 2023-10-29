import Phaser from 'phaser'
import BaseScene from '../baseScene'
import BtnFunc from '@/components/btnFunc'
import CONSTANT_HOME from '../Home/CONSTANT'
import type {
    IFriend,
    IPlayerOnRoom,
    IPlayerRemoved,
    IReadyRes,
    IRoom,
} from '@/util/interface/state.main.interface'
import { roomService, siteService } from '@/services/socket'
import ShowCharacter from '@/characters/avatars/show'
import type { IChangePosition } from '@/util/interface/index.interface'
import Chat from '@/components/chats'

const CONSTANTS = {
    keyScene: CONSTANT_HOME.key.prepareDuel,
    background:
        'https://res.cloudinary.com/dyhfvkzag/image/upload/v1694967915/StairGunGame/gunGame/boot/bootDuel-background-2.png',
    areas: {
        public: 'Chung',
        room: 'Phòng',
    },
}

class PrepareDuel extends BaseScene {
    public MAX_WIDTH: number
    public MAX_HEIGHT: number
    public className = 'prepareDuel'
    public section: Phaser.GameObjects.DOMElement | undefined

    private listPlayerDOM: Phaser.GameObjects.DOMElement | undefined
    private listCharacterShow: { [key: string]: Phaser.Game }
    constructor() {
        super(CONSTANTS.keyScene)
        this.MAX_WIDTH = this.mainStore.getWidth
        this.MAX_HEIGHT = this.mainStore.getHeight
        this.listCharacterShow = {}
    }

    getListPlayer(): Phaser.GameObjects.DOMElement | undefined {
        return this.listPlayerDOM
    }

    getThis(): typeof this {
        return this
    }

    init() {}

    preload() {
        console.log('%c\nLoading...\n', 'color: yellow; font-size: 16px;')
        this.load.image(`${CONSTANTS.keyScene}-background`, CONSTANTS.background)
    }

    create() {
        console.log('%c\nCreate Prepare game...\n', 'color: red; font-size: 16px;')
        this.physics.world.setBounds(0, 0, this.MAX_WIDTH, this.MAX_HEIGHT)
        this.physics.pause()

        // const background = this.add.image(0, 0, `${CONSTANTS.keyScene}-background`).setOrigin(0)

        // #region dom
        this.section = this.createContainer('section', {})
        this.section.node.classList.add('prepareDuel-dom')
        const interfaceDOM = this.createInterfaceDOM()
        // #endregion dom
        // #region create button functionality
        const sectionFuncBottomRight = new BtnFunc(this).createFuncRoom()
        this.section.node.append(interfaceDOM.node, sectionFuncBottomRight.node)
        // #endregion create button functionality
        this.listeningSocket()
    }

    update() {
        // console.log('bootGame')
        if (this.scene.isVisible(CONSTANTS.keyScene)) {
            this.section!.node.classList.remove('d-none')
            this.section!.node.classList.add('d-flex')
        } else {
            if (!this.section!.node.className.includes('d-none')) {
                this.section?.node.classList.add('d-none')
            }
            this.section?.node.classList.remove('d-flex')
            // this
        }
    }

    createInterfaceDOM(): Phaser.GameObjects.DOMElement {
        // this.add.image(0, 0, `${CONSTANTS.keyScene}-background`)
        // #region create base
        const section = this.createContainer('section', {
            width: '1480px',
            height: '740px',
            background: 'linear-gradient(180deg, #63390F 0%, #4E2905 8%)',
            border: '4px #A87123 solid',
        })
        const divBackground = this.createContainer('div', {
            width: '1460px',
            height: '720px',
            margin: 'calc(10px - 4px)', // subtract border section
            background: 'linear-gradient(0deg, #424D73 0%, #424D73 100%)',
            'box-shadow': '0px 0px 50px rgba(0, 0, 0, 0.90) inset',
            'border-radius': '10px',
        })
        const content = this.createContainer('div', {
            width: '1460px',
            height: '720px',
            'flex-wrap': 'wrap',
        })
        // #endregion create base
        // #region create listPlayerContainer
        const listPlayerContainer = this.createContainer('div', {
            background: '#986641',
        })
        listPlayerContainer.node.classList.add(`${this.className}__listPlayer`)
        const listPlayerBackground = this.createTeamDOMBackground()

        this.listPlayerDOM = this.createContainer('section', {})
        this.listPlayerDOM.node.classList.add(`${this.className}__listPlayer__team__container`)
        for (let i = 0; i < 6; i += 1) {
            const playerContainer = this.createPlayerDOMContainer()
            this.listPlayerDOM.node.appendChild(playerContainer.node)
        }
        listPlayerContainer.node.append(listPlayerBackground.node, this.listPlayerDOM.node)
        // #endregion create listPlayerContainer

        // #region create background screen
        const backgroundScreen = this.createBackgroundScreen()
        // #endregion create background screen

        // #region create items
        const items = this.createItemsDOM()
        // #endregion create items

        // #region create chat
        const chat = new Chat(this, ['position-relative'], { width: '722px' }).create({
            isShowRoom: true,
        })
        // #endregion create chat

        const mapAndBtnFuncWrapper = this.createContainer('section', {
            flex: '1',
            'flex-direction': 'column',
            'padding-right': '10px',
        })
        // #region create map
        const map = this.createMap()
        // #endregion create map
        // #region create map
        const btnFunc = this.createBtnFunc()
        // #endregion create map

        mapAndBtnFuncWrapper.node.append(map.node, btnFunc.node)

        content.node.append(
            listPlayerContainer.node,
            backgroundScreen.node,
            items.node,
            chat.node,
            mapAndBtnFuncWrapper.node,
        )
        // #region append
        divBackground.node.appendChild(content.node)
        section.node.appendChild(divBackground.node)
        return section
        // #endregion append
    }

    // #region create DOM
    // #region manager add player
    addPlayer(data: IPlayerOnRoom) {
        const container = this.listPlayerDOM?.node.children
        if (container) {
            this.editPlayerDOM(container[data.position], data as IPlayerOnRoom)
        }
    }

    changePositionPlayer(data: IChangePosition, oldPosition: number) {
        const container = this.listPlayerDOM?.node.children
        if (container) {
            const oldPositionDOM = container[oldPosition]
            const newPositionDOM = container[data.position]
            // newPositionDOM.innerHTML = oldPositionDOM.innerHTML
            // newPositionDOM.setAttribute('id', data.player)
            oldPositionDOM.innerHTML = ''
            oldPositionDOM.setAttribute('id', '')
            oldPositionDOM.classList.remove('noReady')

            this.freeCharacter(data.player)
            const dataPlayer: IPlayerOnRoom = this.mainStore.getRoom.players.find(
                (p: IPlayerOnRoom) => p.player._id === data.player,
            )
            this.editPlayerDOM(newPositionDOM, dataPlayer)
        }
    }

    removePlayer(data: IPlayerRemoved) {
        const container = this.listPlayerDOM?.node.children
        if (container) {
            this.removePlayerDOM(container[data.position], data)
        }
    }
    // #endregion manager add player
    // #region create team dom
    createTeamDOMBackground() {
        const team = this.createContainer('section', {})
        team.node.classList.add('position-absolute')
        const teamA = this.createContainer('div', {
            width: '100%',
            height: '50%',
            background: 'rgba(255, 0, 0, 0.50)',
        })
        const teamB = this.createContainer('div', {
            width: '100%',
            height: '50%',
            background: 'rgba(0, 132.60, 255, 0.50)',
        })
        team.node.append(teamA.node, teamB.node)
        team.node.classList.add(`${this.className}__listPlayer__team__background`)
        return team
    }

    createPlayerDOMContainer() {
        const player = this.createContainer('div', {
            background:
                'linear-gradient(180deg, rgba(254.79, 211.58, 58.39, 0.50) 0%, #9A7B2B 97%)',
        })
            .addListener('click')
            .on('click', this.handleClickChangePosition.bind(this))
        player.node.classList.add(`${this.className}__listPlayer__player`)
        player.node.setAttribute('data-index', `${this.listPlayerDOM!.node.children.length}`)

        return player
    }

    editPlayerDOM(player: Element, data: IPlayerOnRoom): void {
        const className = `${this.className}__listPlayer__player`

        console.log('Render: ', data.player)
        const playerData = data.player
        const playerIdName = `${this.className}__player--${playerData?._id}`
        if (player.id === playerIdName) return

        // #region init characteristics
        player.innerHTML = ''
        player.setAttribute('id', playerIdName)
        !data.isReady && player.classList.add('noReady')

        // #region header
        const header = this.createContainer('div', {})
        header.node.classList.add(`${className}__header`)
        const playerName = this.createText('div', {}, playerData.name!)
        playerName.node.classList.add(`${className}__header-name`)

        // #region add friend btn
        const addFriend = this.createContainer('iconify-icon', {})
            .addListener('click')
            .on('click', this.handleClickAddFriend.bind(this))
        addFriend.node.classList.add(`${className}__header-icon`)
        addFriend.node.setAttribute('icon', 'fluent-mdl2:add-friend')
        addFriend.node.setAttribute('data-id', playerData._id!)
        // #endregion add friend btn

        // #region delete player on room
        const deletePlayer = this.createContainer('iconify-icon', { color: '#ff0000' })
            .addListener('click')
            .on('click', this.handleClickDeletePlayer.bind(this))
        deletePlayer.node.classList.add(`${className}__header-icon`)
        deletePlayer.node.setAttribute('icon', 'iwwa:delete')
        deletePlayer.node.setAttribute('data-id', playerData._id!)
        // #endregion delete player on room

        header.node.append(playerName.node, addFriend.node, deletePlayer.node)
        // #endregion header

        // #region body
        const body = this.createContainer('div', {})
        body.node.classList.add(`${className}__body`)

        const game = this.createElementShowCharacter(data, body)
        this.listCharacterShow[playerData._id!] = game
        // #endregion body

        // #region other element
        if (data.isRoomMaster) {
        }
        // #endregion other element

        player.append(header.node, body.node)
    }

    removePlayerDOM(player: Element, data: IPlayerRemoved) {
        console.log('Removing player')

        player.setAttribute('id', '')
        player.innerHTML = ''
        player.classList.remove('noReady')

        this.mainStore.setCurrentRoom({
            ...this.mainStore.getRoom.players.reduce(
                (result: Array<IPlayerOnRoom>, p: IPlayerOnRoom) => {
                    if (p.player._id === data.newMaster) {
                        p.isRoomMaster = true
                        // update UI
                    }

                    if (p.player._id !== data.player) result.push(p)
                    return result
                },
                [],
            ),
        })
        // free memory
        this.freeCharacter(data.player)
    }

    createElementShowCharacter(data: IPlayerOnRoom, body: Phaser.GameObjects.DOMElement) {
        const bodyContainer = body.node.getBoundingClientRect()
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: bodyContainer.width,
            height: bodyContainer.height,
            parent: body.node as HTMLElement,
            transparent: true,
        }
        const game = new Phaser.Game(config)
        game.scene.add(`character-show-${data.player}`, ShowCharacter, true)
        return game
    }

    freeCharacter(idPlayer: string) {
        this.listCharacterShow[idPlayer].destroy(true)
        delete this.listCharacterShow[idPlayer]
    }

    // #endregion create team dom
    // #region create background screen
    createBackgroundScreen() {
        const section = this.createContainer('section', {})
        section.node.classList.add(`${this.className}__background-screen`)

        const body = this.createContainer('div', {
            'background-color': '#000',
        })
        body.node.classList.add(`${this.className}__background-screen__body`)

        const sourceImg: any = this.textures
            .get(CONSTANTS.keyScene + '-background')
            .getSourceImage()
        body.node.append(sourceImg)

        section.node.append(body.node)
        return section
    }
    // #endregion create background screen
    // #region create items
    createItemsDOM() {
        const section = this.createContainer('section', {})
        section.node.classList.add(`${this.className}__items`)
        // #region header
        const header = this.createContainer('div', {})
        header.node.classList.add(`${this.className}__items__header`)

        const idRoom = this.add
            .dom(0, 0, 'div', {}, `ID: ${this.mainStore.getPlayer._id}`)
            .setOrigin(0)
        idRoom.node.classList.add('position-relative')
        idRoom.node.classList.add(`${this.className}__items__header__text`)
        // #endregion header

        header.node.append(idRoom.node)
        section.node.append(header.node)
        return section
    }
    // #endregion create items
    // #region create chat
    // #endregion create chat
    // #region create map
    createMap() {
        const className = `${this.className}__map`
        const section = this.createContainer('section', {})
        section.addListener('click').on('click', () => {
            console.log('Click map')
        })
        section.node.classList.add(className)

        const text = this.createText('span', {}, 'Bản đồ ngẫu nhiên')
        text.node.classList.add(className + '__text')

        const icon = this.add.dom(0, 0, 'iconify-icon').setOrigin(0)
        icon.node.setAttribute('icon', 'uiw:setting')
        icon.node.classList.add('position-relative')
        icon.node.classList.add(className + '__icon')

        section.node.append(text.node, icon.node)
        return section
    }
    // #endregion create map

    // #region button functions
    createBtnFunc() {
        const className = `${this.className}__btn-func`
        const section = this.createContainer('section', {})
        section.node.classList.add('d-inline-flex')
        section.node.classList.add(className)

        const btnInvite = this.createContainer('button', {})
            .addListener('click')
            .on('click', this.handleClickInvite.bind(this))
        btnInvite.node.classList.add(className + '__invite')

        const icon = this.add.dom(0, 0, 'iconify-icon').setOrigin(0)
        icon.node.setAttribute('icon', 'bi:flag-fill')
        icon.node.classList.add(className + '__invite__icon')

        const inviteText = this.createText('span', {}, 'Mời')
        inviteText.node.classList.add(className + '__invite__text')

        btnInvite.node.append(icon.node, inviteText.node)

        const btnStart = this.createBtn('button', {})
            .addListener('click')
            .on('click', this.handleClickStart.bind(this))
        btnStart.node.classList.add(className + '__start')
        const startText = this.createText('span', { 'font-weight': '700' }, 'Bắt đầu')
        btnStart.node.append(startText.node)

        const btnDestroy = this.createBtn('button', {})
            .addListener('click')
            .on('click', this.handleClickDestroy.bind(this))
        btnDestroy.node.classList.add('d-none')
        btnDestroy.node.classList.add(className + '__destroy')
        const destroyText = this.createText('span', { 'font-weight': '700' }, 'Huy')
        btnDestroy.node.append(destroyText.node)
        btnDestroy.node.setAttribute('disabled', '')

        section.node.append(btnInvite.node, btnStart.node, btnDestroy.node)
        return section
    }
    // #endregion button functions

    // #region create model ad friend
    createModelAddFriend(data: IFriend) {
        const model = this.createContainer('section', {
            'min-width': '300px',
            'min-height': '100px',
            'z-index': 99999,
            top: '50%',
            left: '50%',
            transform: 'translate(50%, 50%)',
            background: 'linear-gradient(180deg, #63390f 0%, #4e2905 8%)',
        })
        model.node.classList.remove('d-flex')
        model.node.classList.remove('position-relative')
        model.node.classList.add('position-fixed')

        const text = this.createText(
            'div',
            { color: '#fff', 'font-size': '16px' },
            `Người chơi ${data.name!} muốn kết bạn với bạn!`,
        )
        model.node.appendChild(text.node)

        const btnWrapper = this.createContainer('section', { 'justify-content': 'space-around' })
        model.node.appendChild(btnWrapper.node)
        const btnAccept = this.createBtn('button', { background: '#363636' })
            .addListener('click')
            .on('click', (e: any) => this.handleClickAcceptBtn.call(this, e, model))
        btnAccept.node.setAttribute('data-id', data._id)
        btnAccept.node.setAttribute('data-socketId', data.socketId)
        const textAccept = this.createText('span', {}, 'Đồng ý')
        btnAccept.node.appendChild(textAccept.node)
        btnWrapper.node.appendChild(btnAccept.node)

        const btnDeny = this.createBtn('button', { background: '#ff0000' })
            .addListener('click')
            .on('click', (e: any) => this.handleClickDenyBtn.call(this, e, model))
        btnDeny.node.setAttribute('data-id', data._id)
        btnDeny.node.setAttribute('data-socket', data.socketId)
        const textDeny = this.createText('span', {}, 'Từ chối')
        btnDeny.node.appendChild(textDeny.node)
        btnWrapper.node.appendChild(btnDeny.node)

        console.log(model.node)
        this.section?.node.appendChild(model.node)
    }
    // #endregion create model ad friend

    // #endregion create DOM

    // #region handle events
    handleClickChangePosition(e: any) {
        const element: any = e.currentTarget
        const position = Number.parseInt(element.dataset.index)

        roomService.changePosition(position)
    }
    handleClickInvite(e: any) {
        const btnInvite: Element = e.currentTarget
        btnInvite.setAttribute('disabled', 'disabled')
        setTimeout(() => {
            console.log('active')

            btnInvite.removeAttribute('disabled')
        }, 5000)
    }
    handleClickStart(e: any) {
        const btnStart: Element = e.currentTarget
        btnStart.setAttribute('disabled', '')
        setTimeout(() => {
            btnStart.removeAttribute('disabled')
        }, 5000)

        roomService.ready(true)
    }
    handleClickDestroy(e: any) {
        const btnDestroy: Element = e.currentTarget
        btnDestroy.setAttribute('disabled', '')
        setTimeout(() => {
            btnDestroy.removeAttribute('disabled')
        }, 5000)

        roomService.ready(false)
    }
    handleClickAddFriend(e: any) {
        const btn = e.currentTarget
        siteService.addFriend(btn.dataset.id)
    }
    handleClickAcceptBtn(e: any, model: Phaser.GameObjects.DOMElement) {
        const element: Element = e.currentTarget
        const btn = e.currentTarget
        const id = btn.dataset.id
        siteService.acceptAddFriend({ _id: id, isAccepted: true })
        model.destroy()
    }
    handleClickDenyBtn(e: any, model: Phaser.GameObjects.DOMElement) {
        const element: Element = e.currentTarget
        const btn = e.currentTarget
        const id = btn.dataset.id
        siteService.acceptAddFriend({ _id: id, isAccepted: false })
        model.destroy()
    }
    handleClickDeletePlayer(e: any) {
        const element = e.currentTarget
        const id = element.dataset.id
        roomService.deletePlayer(id)
    }
    // #endregion handle events

    // #region other
    changeDisplayBtn(btnBefore: Element, btnAfter: Element) {
        btnBefore.classList.add('d-none')
        btnAfter.removeAttribute('disabled')
        btnAfter.classList.remove('d-none')
    }
    // #endregion other

    // #region listening socket
    listeningSocket() {
        roomService.listeningAddToRoom((data: IRoom) => {
            // show waiting room
            console.log('Players: ', data.players)

            this.mainStore.setCurrentRoom({
                ...data,
                players: data.players.filter((pl: IPlayerOnRoom) => {
                    return pl.isOnRoom
                }),
            })

            // add player
            this.mainStore.getRoom.players.forEach((p: IPlayerOnRoom) => {
                this.addPlayer(p)
            })

            // show prepare screen
            const homeScene: any = this.scene?.get(CONSTANT_HOME.key.home)
            homeScene?.openScene(CONSTANT_HOME.key.prepareDuel)
        })

        roomService.listeningRemovePlayerOnRoom((data: any) => {
            this.removePlayer(data)
        })

        roomService.listeningReady((data: IReadyRes) => {
            const player: Element | undefined | null = document.getElementById(
                `prepareDuel__player--${data.player._id}`,
            )

            const btnStart: Element = this.section?.node.querySelector(
                `.${this.className}__btn-func__start`,
            ) as Element
            const btnDestroy: Element = this.section?.node.querySelector(
                `.${this.className}__btn-func__destroy`,
            ) as Element
            if (data.player._id === this.mainStore.getPlayer._id && data.player.isReady) {
                this.changeDisplayBtn(btnStart, btnDestroy)
            } else if (data.player._id === this.mainStore.getPlayer._id && !data.player.isReady) {
                this.changeDisplayBtn(btnDestroy, btnStart)
            }
            if (player) {
                !data.player.isReady && player.classList.add('noReady')
                data.player.isReady && player.classList.remove('noReady')
            }
        })

        roomService.listeningChangePosition((data: IChangePosition, oldPosition: number) => {
            this.changePositionPlayer(data, oldPosition)
        })

        siteService.listeningAddFriend(this.createModelAddFriend.bind(this.getThis()))
    }
    // #endregion listening socket
    render() {
        console.log('%c\nRendering...\n', 'color: #363; font-size: 16px;')
    }
}

export default PrepareDuel
