import { useMainStore } from '@/stores'
import BaseDOM from '../baseDOMElement'
import chatService from '@/services/socket/chat.service'
import type { IChatReceiveMessage } from '@/util/interface/index.interface'

const CONSTANTS = {
    areas: {
        public: {
            key: 'public',
            value: 'Chung',
        },
        room: {
            key: 'room',
            value: 'Phòng',
        },
    },
}

export default class Chat extends BaseDOM {
    private className = 'chat'
    private mainStore: any
    private targetMessage: Phaser.GameObjects.DOMElement | undefined
    private listMessageWrapper: Phaser.GameObjects.DOMElement | undefined
    constructor(game: any, customClass: Array<string>, style: { [key: string]: string }) {
        super(game, style)
        this.mainStore = useMainStore()
        this.node.classList.add(this.className)
        customClass.forEach((c) => this.node.classList.add(c))
    }

    setTargetMessage(target: { _id: string; name: string }) {
        this.targetMessage!.setName(this.createTargetId(target._id!))
        this.targetMessage!.node.textContent = target.name
    }

    create({ isShowRoom = false }: { isShowRoom?: boolean }): Phaser.GameObjects.DOMElement {
        // #region header
        const header = this.createContainer('div', {})
        header.node.classList.add(`${this.className}__header`)

        const btnPublic = this.createChatAreaBtn(CONSTANTS.areas.public.key, 'Chung')
        btnPublic.node.setAttribute('data-id', '')
        btnPublic.node.setAttribute('data-name', CONSTANTS.areas.public.value)
        header.node.appendChild(btnPublic.node)
        if (isShowRoom) {
            const btnRoom = this.createChatAreaBtn(CONSTANTS.areas.room.key, 'Phòng')
            btnRoom.node.setAttribute('data-id', CONSTANTS.areas.room.key)
            btnRoom.node.setAttribute('data-name', CONSTANTS.areas.room.value)
            header.node.appendChild(btnRoom.node)
        }
        // const btnPrivate = this.createChatAreaBtn('private', 'Riêng')
        // header.node.appendChild(btnPrivate.node)
        // #endregion header

        // #region body
        const body = this.game.createContainer('div', {})
        body.node.classList.add(`${this.className}__body-wrapper`)
        body.node.classList.add('scrollbar')
        const pad = this.game.add.dom(0, 0, 'span').setOrigin(0)
        pad.node.classList.add('position-relative')
        pad.node.classList.add('pad')

        // #region message public
        this.listMessageWrapper = this.game.createContainer('section', {})
        body.node.append(pad.node, this.listMessageWrapper.node)
        // #endregion message public

        // let i = 2
        // setInterval(() => {
        //     this.addMessage('public', 'He Thong', 'Hello World' + ++i, {})
        // }, 3000)
        // #endregion body

        // #region footer
        const footer = this.createChatFooter()
        footer.node.classList.add(`${this.className}__footer`)
        isShowRoom &&
            this.setTargetMessage({
                _id: CONSTANTS.areas.room.key,
                name: CONSTANTS.areas.room.value,
            })
        // #endregion footer
        this.node.append(header.node, body.node, footer.node)

        this.listeningSocket()
        return this
    }

    createTargetId(id?: string): string {
        return id || ''
    }

    createChatAreaBtn(area: string, text: string) {
        const btn = this.createContainer('div', {})
        btn.node.classList.add(`${this.className}__header__btn`)
        btn.node.classList.add(`${this.className}__header__btn--${area}`)
        const btnText = this.game.add.dom(0, 0, 'div', {}, text).setOrigin(0)
        btnText.node.classList.add('position-relative')
        btnText.node.classList.add(`${this.className}__header__btn--public__text`)

        btn.node.append(btnText.node)
        btn.addListener('click').on('click', this.handleClickChatAreaBtn.bind(this))

        return btn
    }

    addMessage(from: string, receiver: { _id?: string }, message: string) {
        const children = this.listMessageWrapper!.node.children
        let messageWrapper = Array.from(children).find(
            (child: Element) => child.getAttribute('data-id') === this.createTargetId(receiver._id),
        )

        if (!messageWrapper) {
            messageWrapper = this.createMessageWrapper({
                _id: receiver._id,
            }).node
            // console.log(messageWrapper)
            this.listMessageWrapper?.node.appendChild(messageWrapper)
        }
        const messageContainer = this.createChatMessage(from, receiver._id!, message)
        messageWrapper!.append(messageContainer.node)
    }

    createMessageWrapper(target: { _id?: string }): Phaser.GameObjects.DOMElement {
        const messageWrapper = this.game.createContainer('div', {})
        messageWrapper.node.setAttribute('data-id', this.createTargetId(target._id))
        messageWrapper.node.classList.add(`${this.className}__body-wrapper__container`)

        return messageWrapper
    }

    createChatMessage(fromName: string, receivedId: string, message: string) {
        let area = CONSTANTS.areas.public.key
        if (receivedId && receivedId === this.mainStore.getRoom._id) area = CONSTANTS.areas.room.key

        const section = this.createContainer('div', {})
        section.node.classList.add('d-block')
        section.node.classList.add(`${this.className}__body-wrapper__container__message`)

        // area
        const areaText = this.game.add
            .dom(0, 0, 'span', {}, `[${(CONSTANTS.areas as any)[area].value || 'Private'}]`)
            .setOrigin(0)
        areaText.node.classList.add('position-relative')
        areaText.node.classList.add(`${this.className}__body-wrapper__container__message__area`)
        if (CONSTANTS.areas.hasOwnProperty(area)) {
            areaText.node.classList.add(
                `${this.className}__body-wrapper__container__message__area--${area}`,
            )
        }
        // message
        const messageBlock = this.game.add.dom(0, 0, 'div', {}).setOrigin(0)
        messageBlock.node.classList.add('position-relative')
        messageBlock.node.classList.add(
            `${this.className}__body-wrapper__container__message__block`,
        )

        // whoSend
        const whoSend = this.game.add.dom(0, 0, 'span', {}, `[${fromName}]: `).setOrigin(0)
        whoSend.node.classList.add('position-relative')
        whoSend.node.classList.add('d-inline')
        whoSend.node.classList.add(
            `${this.className}__body-wrapper__container__message__block__from`,
        )
        // text
        const text = this.game.add.dom(0, 0, 'span', {}, `${message}`).setOrigin(0)
        text.node.classList.add('position-relative')
        text.node.classList.add('d-inline')
        text.node.classList.add(`${this.className}__body-wrapper__container__message__block__text`)

        messageBlock.node.append(whoSend.node, text.node)
        section.node.append(areaText.node, messageBlock.node)

        return section
    }

    createChatFooter() {
        const className = `${this.className}__footer`
        const section = this.createContainer('section', {})

        const location = this.createContainer('div', {})
        location.node.classList.add(`${className}__location`)
        this.targetMessage = this.createText('span', {}, CONSTANTS.areas.public.value)
        this.targetMessage.setName('')
        this.targetMessage.node.classList.add(className + '__location__text')
        location.node.append(this.targetMessage.node)

        // #region inputContainer
        const inputContainer = this.createContainer('form', {})
        inputContainer.node.classList.add(className + '__input-container')
        inputContainer.addListener('submit').on('submit', this.sendMessage.bind(this))

        const inputWrapper = this.game.add
            .dom(0, 0, 'div', { height: '100%', flex: 1 })
            .setOrigin(0)
        inputWrapper.node.classList.add('position-relative')
        const input = this.game.add.dom(0, 0, 'input', {}).setOrigin(0)
        input.node.classList.add('position-relative')
        input.node.classList.add('d-block')
        input.node.setAttribute('value', '')
        input.node.classList.add(className + '__input-container__input')
        inputWrapper.node.append(input.node)

        const btnSend = this.createContainer('button', {})
        btnSend.node.classList.add(className + '__input-container__btn-send')

        // #region icon send
        const iconSend = this.game.add.dom(0, 0, 'iconify-icon', {}).setOrigin(0)
        iconSend.node.classList.add('position-relative')
        iconSend.node.classList.add(className + '__input-container__btn-send__icon')
        iconSend.node.setAttribute('icon', 'bi:send')
        const iconSendFillBackground = this.game.add
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

        // #region friend
        const friend = this.createContainer('div', {})
            .addListener('click')
            .on('click', (e: any) => {
                console.log('Func friend')
            })
        const friendIcon = this.game.add.dom(0, 0, 'iconify-icon').setOrigin(0)
        friendIcon.node.classList.add('position-relative')
        friendIcon.node.setAttribute('icon', 'fa6-solid:user')
        friendIcon.node.classList.add(className + '__func__friend')
        friend.node.append(friendIcon.node)
        friend.addListener('click').on('click', this.handleClickShowListFriend.bind(this))
        functionContainer.node.appendChild(friend.node)
        // #endregion friend

        // #region icon
        // const icon = this.createContainer('div', {})
        //     .addListener('click')
        //     .on('click', (e: any) => {
        //         console.log('Func icon')
        //     })
        // const iconIcon = this.game.add.dom(0, 0, 'iconify-icon').setOrigin(0)
        // iconIcon.node.classList.add('position-relative')
        // iconIcon.node.setAttribute('icon', 'carbon:face-add')
        // iconIcon.node.classList.add(className + '__func__icon')
        // icon.node.append(iconIcon.node)
        // functionContainer.node.appendChild(icon.node)
        // #endregion icon
        // #endregion other functionality

        section.node.append(location.node, inputContainer.node, functionContainer.node)
        return section
    }

    // #region handle events
    handleClickChatAreaBtn(e: any) {
        const btn = e.currentTarget
        let idTarget = btn.dataset.id // '' | 'room' | '12314124124142...'
        let nameTarget = btn.dataset.name
        if (idTarget === CONSTANTS.areas.room.key) idTarget = this.mainStore.getRoom._id
        this.setTargetMessage({ _id: idTarget, name: nameTarget })
        const children = this.listMessageWrapper?.node.children
        Array.from(children!).find((child) => {
            child.classList.add('d-none')
            child.classList.remove('d-flex')
        })

        const messageWrapper = Array.from(children!).find((child) => {
            console.log(child.getAttribute('data-id'))
            return child.getAttribute('data-id') === idTarget
        })
        messageWrapper?.classList.remove('d-none')
        messageWrapper?.classList.add('d-flex')
    }

    handleAddMessageReceived(data: IChatReceiveMessage) {
        const from = data.sender.name
        const message = data.message
        const target = data.receiver
        this.addMessage(from, target, message)
    }

    handleClickShowListFriend(e: any) {}

    sendMessage(e: any) {
        e.preventDefault()
        const input = e.target.querySelector('input')
        const value = input.value
        const receiver = this.targetMessage!.name
        // console.log('Send Message: ', value, ', sender: ', sender, ', receiver: ', receiver)
        chatService.sendMessage({ receiverId: receiver, message: value })
        input.value = ''
    }
    // #endregion handle events

    // #region listening socket
    listeningSocket() {
        this.mainStore.getWatch.chat.push(this.handleAddMessageReceived.bind(this))
    }
    // #endregion listening socket
}
