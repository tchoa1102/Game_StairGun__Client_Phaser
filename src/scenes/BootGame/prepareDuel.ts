import { useMainStore } from '@/stores'
import Phaser from 'phaser'
import BaseScene from '../baseScene'
import BtnFunc from '@/components/btnFunc'
import CONSTANT_HOME from '../Home/CONSTANT'
import type { IPlayer } from '@/util/interface/state.main.interface'

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
    constructor() {
        super(CONSTANTS.keyScene)
        const mainStore: any = useMainStore()
        this.MAX_WIDTH = mainStore.getWidth * mainStore.zoom
        this.MAX_HEIGHT = mainStore.getHeight * mainStore.zoom
    }

    init() {}

    preload() {
        console.log('%c\nLoading...\n', 'color: yellow; font-size: 16px;')
        this.load.image(`${CONSTANTS.keyScene}-background`, CONSTANTS.background)
    }

    create() {
        console.log('%c\nCreate...\n', 'color: red; font-size: 16px;')
        this.physics.world.setBounds(0, 0, this.MAX_WIDTH, this.MAX_HEIGHT)
        this.physics.pause()

        // const background = this.add.image(0, 0, `${CONSTANTS.keyScene}-background`).setOrigin(0)

        // #region dom
        this.section = this.createContainer('section', {})
        const interfaceDOM = this.createInterfaceDOM()
        // #endregion dom
        // #region create button functionality
        const sectionFuncBottomRight = new BtnFunc(this).createFuncRoom()
        this.section.node.append(interfaceDOM.node, sectionFuncBottomRight.node)
        // #endregion create button functionality
    }

    update() {
        // console.log('bootGame')
        if (
            this.scene.isVisible(CONSTANTS.keyScene)
            //  &&
            // this.section!.node.className.includes('d-none')
        ) {
            this.section!.node.classList.remove('d-none')
            this.section!.node.classList.add('d-flex')
        } else {
            if (!this.section!.node.className.includes('d-none')) {
                this.section?.node.classList.add('d-none')
            }
            this.section?.node.classList.remove('d-flex')
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
        listPlayerContainer.node.append(listPlayerBackground.node, this.listPlayerDOM.node)
        // #endregion create listPlayerContainer

        // #region create background screen
        const backgroundScreen = this.createBackgroundScreen()
        // #endregion create background screen

        // #region create items
        const items = this.createItemsDOM()
        // #endregion create items

        // #region create chat
        const chat = this.createChat()
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
    addPlayer(data: any) {
        const player = this.createPlayerDOM(data)
        this.listPlayerDOM?.node.append(player.node)
    }

    editPlayer() {}
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

    createPlayerDOM(data: any) {
        const player = this.createContainer('div', {
            background:
                'linear-gradient(180deg, rgba(254.79, 211.58, 58.39, 0.50) 0%, #9A7B2B 97%)',
        })
        player.node.classList.add(`${this.className}__listPlayer__player`)

        // #region header
        const header = this.add.dom(0, 0, 'div').setOrigin(0)
        header.node.classList.add('position-relative')
        header.node.classList.add(`${this.className}__listPlayer__player__header`)
        const playerName = this.add.dom(0, 0, 'div', {}, data.name).setOrigin(0)
        playerName.node.classList.add(`${this.className}__listPlayer__player__header-name`)

        header.node.append(playerName.node)
        // #endregion header

        // #region body
        const body = this.add
            .dom(0, 0, 'div', {
                width: '204px',
                height: '190px',
                position: 'relative',
                background: '#F7E7C9',
                'border-radius': '10px',
            })
            .setOrigin(0)
        body.node.classList.add('position-relative')
        // #endregion body

        player.node.append(header.node, body.node)
        return player
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

        const idRoom = this.add.dom(0, 0, 'div', {}, `ID: 1234567890`).setOrigin(0)
        idRoom.node.classList.add('position-relative')
        idRoom.node.classList.add(`${this.className}__items__header__text`)
        // #endregion header

        header.node.append(idRoom.node)
        section.node.append(header.node)
        return section
    }
    // #endregion create items
    // #region create chat
    createChat() {
        const section = this.createContainer('section', {})
        section.node.classList.add(`${this.className}__chat`)

        // #region header
        const header = this.createContainer('div', {})
        header.node.classList.add(`${this.className}__chat__header`)

        const btnPublic = this.createChatAreaBtn('public', 'Chung')
        const btnRoom = this.createChatAreaBtn('room', 'Phòng')
        const btnPrivate = this.createChatAreaBtn('private', 'Riêng')
        header.node.append(btnPublic.node, btnRoom.node, btnPrivate.node)
        // #endregion header

        // #region body
        const body = this.createContainer('div', {})
        body.node.classList.add(`${this.className}__chat__body-wrapper`)
        body.node.classList.add('scrollbar')
        const pad = this.add.dom(0, 0, 'span').setOrigin(0)
        pad.node.classList.add('position-relative')
        pad.node.classList.add('pad')
        const bodyContainer = this.createContainer('div', {})
        bodyContainer.node.classList.add(`${this.className}__chat__body-wrapper__container`)
        for (let i of [1, 2]) {
            const message = this.createChatMessage(
                'public',
                'ABCasasdasfasasdasdasdasdasdasdasaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
                'Hhahahahhahahahahahahahahaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbb1',
            )
            bodyContainer.node.append(message.node)
        }

        // let i = 2
        // setInterval(() => {
        //     const message = this.createChatMessage(
        //         'public',
        //         'ABC',
        //         'Hhahahahhahahahahahahahahaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbb' +
        //             i++,
        //     )
        //     body.node.append(message.node)
        // }, 3000)
        body.node.append(pad.node, bodyContainer.node)
        // #endregion body

        // #region footer
        const footer = this.createChatFooter()
        footer.node.classList.add(`${this.className}__chat__footer`)
        // #endregion footer
        section.node.append(header.node, body.node, footer.node)
        return section
    }

    createChatAreaBtn(area: string, text: string) {
        const btn = this.createContainer('div', {})
        btn.node.classList.add(`${this.className}__chat__header__btn`)
        btn.node.classList.add(`prepareDuel__chat__header__btn--${area}`)
        const btnText = this.add.dom(0, 0, 'div', {}, text).setOrigin(0)
        btnText.node.classList.add('position-relative')
        btnText.node.classList.add(`${this.className}__chat__header__btn--public__text`)

        btn.node.append(btnText.node)

        return btn
    }

    createChatMessage(area: string, from: string, message: string) {
        const section = this.createContainer('div', {})
        section.node.classList.add('d-block')
        section.node.classList.add(`${this.className}__chat__body-wrapper__container__message`)

        // area
        const areaText = this.add
            .dom(0, 0, 'span', {}, `[${(CONSTANTS.areas as any)[area] || area}]`)
            .setOrigin(0)
        areaText.node.classList.add('position-relative')
        areaText.node.classList.add(
            `${this.className}__chat__body-wrapper__container__message__area`,
        )
        if (area === 'public' || area === 'room') {
            areaText.node.classList.add(
                `prepareDuel__chat__body-wrapper__container__message__area--${area}`,
            )
        }
        // message
        const messageBlock = this.add.dom(0, 0, 'div', {}).setOrigin(0)
        messageBlock.node.classList.add('position-relative')
        messageBlock.node.classList.add(
            `${this.className}__chat__body-wrapper__container__message__block`,
        )

        // whoSend
        const whoSend = this.add.dom(0, 0, 'span', {}, `[${from}]: `).setOrigin(0)
        whoSend.node.classList.add('position-relative')
        whoSend.node.classList.add('d-inline')
        whoSend.node.classList.add(
            `${this.className}__chat__body-wrapper__container__message__block__from`,
        )
        // text
        const text = this.add.dom(0, 0, 'span', {}, `${message}`).setOrigin(0)
        text.node.classList.add('position-relative')
        text.node.classList.add('d-inline')
        text.node.classList.add(
            `${this.className}__chat__body-wrapper__container__message__block__text`,
        )

        messageBlock.node.append(whoSend.node, text.node)
        section.node.append(areaText.node, messageBlock.node)

        return section
    }

    createChatFooter() {
        const className = `${this.className}__chat__footer`
        const section = this.createContainer('section', {})

        const location = this.createContainer('div', {})
        location.node.classList.add(`${className}__location`)
        const locationText = this.createText('span', {}, 'Chung')
        locationText.node.classList.add(className + '__location__text')
        location.node.append(locationText.node)

        // #region inputContainer
        const inputContainer = this.createContainer('form', {})
        inputContainer.node.classList.add(className + '__input-container')
        inputContainer.addListener('submit').on('submit', (e: any) => {
            e.preventDefault()
            console.log('Send Message')
        })

        const inputWrapper = this.add.dom(0, 0, 'div', { height: '100%', flex: 1 }).setOrigin(0)
        inputWrapper.node.classList.add('position-relative')
        const input = this.add.dom(0, 0, 'input', {}).setOrigin(0)
        input.node.classList.add('position-relative')
        input.node.classList.add('d-block')
        input.node.setAttribute('value', 'aaaaaaaaaaaa')
        input.node.classList.add(className + '__input-container__input')
        inputWrapper.node.append(input.node)

        const btnSend = this.createContainer('button', {})
        btnSend.node.classList.add(className + '__input-container__btn-send')

        // #region icon send
        const iconSend = this.add.dom(0, 0, 'iconify-icon', {}).setOrigin(0)
        iconSend.node.classList.add('position-relative')
        iconSend.node.classList.add(className + '__input-container__btn-send__icon')
        iconSend.node.setAttribute('icon', 'bi:send')
        const iconSendFillBackground = this.add
            .dom(0, 0, 'iconify-icon', { color: '#fff', 'font-size': '24px' })
            .setOrigin(0)
        iconSendFillBackground.node.classList.add(className + '__input-container__btn-send__icon')
        iconSendFillBackground.node.setAttribute('icon', 'teenyicons:send-solid')
        // #endregion icon send

        btnSend.node.append(iconSend.node, iconSendFillBackground.node)

        inputContainer.node.append(inputWrapper.node, btnSend.node)
        // #endregion inputContainer

        // #region other functionality
        const functionContainer = this.createContainer('div', {})
        functionContainer.node.classList.add(className + '__func')

        const friend = this.createContainer('div', {})
            .addListener('click')
            .on('click', (e: any) => {
                console.log('Func friend')
            })
        const friendIcon = this.add.dom(0, 0, 'iconify-icon').setOrigin(0)
        friendIcon.node.classList.add('position-relative')
        friendIcon.node.setAttribute('icon', 'fa6-solid:user')
        friendIcon.node.classList.add(className + '__func__friend')
        friend.node.append(friendIcon.node)

        const icon = this.createContainer('div', {})
            .addListener('click')
            .on('click', (e: any) => {
                console.log('Func icon')
            })
        const iconIcon = this.add.dom(0, 0, 'iconify-icon').setOrigin(0)
        iconIcon.node.classList.add('position-relative')
        iconIcon.node.setAttribute('icon', 'carbon:face-add')
        iconIcon.node.classList.add(className + '__func__icon')
        icon.node.append(iconIcon.node)

        functionContainer.node.append(friend.node, icon.node)
        // #endregion other functionality

        section.node.append(location.node, inputContainer.node, functionContainer.node)
        return section
    }
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

        const btnInvite = this.createContainer('div', {})
        btnInvite.node.classList.add(className + '__invite')

        const icon = this.add.dom(0, 0, 'iconify-icon').setOrigin(0)
        icon.node.setAttribute('icon', 'bi:flag-fill')
        icon.node.classList.add(className + '__invite__icon')

        const inviteText = this.createText('span', {}, 'Mời')
        inviteText.node.classList.add(className + '__invite__text')

        btnInvite.node.append(icon.node, inviteText.node)

        const btnStart = this.createContainer('div', {})
        btnStart.node.classList.add(className + '__start')
        const startText = this.createText('span', { 'font-weight': '700' }, 'Bắt đầu')
        btnStart.node.append(startText.node)

        section.node.append(btnInvite.node, btnStart.node)
        return section
    }
    // #endregion button functions

    // #endregion create DOM

    // #region handle events
    // #endregion handle events

    // #region listening socket
    // listeningRoom() {
    //     if (playersOnRoom) {
    //         const numOfPlayers = playersOnRoom.length
    //         playersOnRoom.forEach((dataPlayer: any, i: number) => {
    //             if (i < 3) {
    //                 const player = this.createPlayerDOM(dataPlayer)
    //                 teamA.node.append(player.node)
    //             } else {
    //                 const player = this.createPlayerDOM(dataPlayer)
    //                 teamB.node.append(player.node)
    //             }
    //         })
    //     }
    // }
    // #endregion listening socket
    render() {
        console.log('%c\nRendering...\n', 'color: #363; font-size: 16px;')
    }
}

export default PrepareDuel
