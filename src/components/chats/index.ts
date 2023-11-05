import { useMainStore } from '@/stores'
import BaseDOM from '../baseDOMElement'
import chatService from '@/services/socket/chat.service'
import type { IChatReceiveMessage } from '@/util/interface/index.interface'
import type { IFriend } from '@/util/interface/state.main.interface'

// don't update friend status when offline and online
// has bug when other player send message type private first time, it's create parallel tab table wrapper message

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
        private: {
            key: 'private',
            value: 'Riêng',
        },
    },
}

export default class Chat extends BaseDOM {
    private targetClassName: string
    private className = 'chat'
    private funcFriendClassNameSelector = '__friend'
    private targetMessage: Phaser.GameObjects.DOMElement | undefined
    private listMessageWrapper: Phaser.GameObjects.DOMElement | undefined
    constructor(
        game: any,
        parentClassName: string,
        customClass: Array<string>,
        style: { [key: string]: string },
    ) {
        super(game, style)
        this.mainStore = useMainStore()
        this.targetClassName = parentClassName + this.className
        customClass.forEach((c) => this.node.classList.add(c))
        this.node.classList.add(this.targetClassName)
        this.node.classList.add(this.className)
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
            this.mainStore.getWatch.room.push(this.handleUpdateTargetMessage.bind(this))
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
        const footer = this.createChatFooter.call(this)
        footer.node.classList.add(`${this.className}__footer`)
        isShowRoom &&
            this.setTargetMessage({
                _id: CONSTANTS.areas.room.key,
                name: CONSTANTS.areas.room.value,
            })
        // #endregion footer
        this.node.append(header.node, body.node, footer.node)

        // #region custom data
        this.mainStore.getPlayer.friends.forEach((friend: IFriend) => {
            this.pushItemFriend.call(this, friend)
        })
        // #endregion custom data

        this.listeningSocket()
        return this
    }

    createTargetId(id?: string): string {
        return id || ''
    }

    createStatus(socketId?: string): string {
        return socketId ? 'online' : 'offline'
    }

    createChatAreaBtn(area: string, text: string) {
        const btn = this.createContainer('div', {})
        btn.node.classList.add(`${this.className}__header__btn`)
        btn.node.classList.add(`${this.className}__header__btn--${area}`)
        const btnText = this.createText('div', {}, text)
        btnText.node.classList.add(`${this.className}__header__btn--public__text`)

        btn.node.append(btnText.node)
        btn.addListener('click').on('click', this.handleClickChatAreaBtn.bind(this))

        return btn
    }

    addMessage(fromName: string, receiver: { _id?: string }, message: string) {
        console.log('Add message: ', fromName, receiver, message)
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
        const messageContainer = this.createChatMessage(fromName, receiver._id!, message)
        messageWrapper!.append(messageContainer.node)
    }

    createMessageWrapper(target: { _id?: string }): Phaser.GameObjects.DOMElement {
        const messageWrapper = this.game.createContainer('div', {})
        messageWrapper.node.setAttribute('data-id', this.createTargetId(target._id))
        messageWrapper.node.classList.add(`${this.className}__body-wrapper__container`)

        return messageWrapper
    }

    createChatMessage(fromName: string, receivedId: string, message: string) {
        const className = `${this.className}__body-wrapper__container__message`
        let area = CONSTANTS.areas.private
        if (!receivedId) area = CONSTANTS.areas.public
        else if (receivedId === this.mainStore.getRoom?._id) area = CONSTANTS.areas.room

        const section = this.createContainer('div', {})
        section.node.classList.add('d-block')
        section.node.classList.add(className)

        // area
        const areaTextClassName = `${className}__area`
        const areaText = this.createText('span', {}, `[${area.value}]`)
        areaText.node.classList.add(areaTextClassName)
        areaText.node.classList.add(`${areaTextClassName}--${area.key}`)

        // #region block message
        const messageBlockClassName = `${className}__block`
        const messageBlock = this.game.add.dom(0, 0, 'div', {}).setOrigin(0)
        messageBlock.node.classList.add('position-relative')
        messageBlock.node.classList.add(messageBlockClassName)

        // whoSend
        const whoSend = this.createText('span', {}, `[${fromName}]: `)
        whoSend.node.classList.add('d-inline')
        whoSend.node.classList.add(`${messageBlockClassName}__from`)
        // text
        const text = this.createText('span', {}, `${message}`)
        text.node.classList.add('d-inline')
        text.node.classList.add(`${messageBlockClassName}__text`)
        messageBlock.node.append(whoSend.node, text.node)
        // #endregion block message

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
        const classNameFunctionContainer = className + '__func'
        functionContainer.node.classList.add(classNameFunctionContainer)

        // #region friend
        const classNameFriend = classNameFunctionContainer + this.funcFriendClassNameSelector
        const friend = this.createIconifyButton(classNameFriend, 'fa6-solid:user')
        functionContainer.node.appendChild(friend.node)
        // .addListener('click')
        // .on('click', this.handleClickShowListFriend.bind(this))
        const friendItems = this.createListItemFriendFlex.call(this, classNameFriend + '__list')
        friendItems.node.classList.add('scrollbar')
        friendItems.node.classList.remove('d-flex')
        // friendItems.node.classList.add()
        friend.node.appendChild(friendItems.node)
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
        // iconIcon.node.classList.add(classNameFunctionContainer + '__icon')
        // icon.node.append(iconIcon.node)
        // functionContainer.node.appendChild(icon.node)
        // #endregion icon
        // #endregion other functionality

        section.node.append(location.node, inputContainer.node, functionContainer.node)
        return section
    }

    createIconifyButton(className: string, iconClass: string): Phaser.GameObjects.DOMElement {
        const section = this.createContainer('div', {})
        const icon = this.game.add.dom(0, 0, 'iconify-icon').setOrigin(0)
        icon.node.classList.add('position-relative')
        icon.node.setAttribute('icon', iconClass)
        section.node.classList.add(className)
        section.node.append(icon.node)

        return section
    }

    createListItemFriendFlex(className: string): Phaser.GameObjects.DOMElement {
        const section = this.createContainer('section', {})
        section.node.classList.add(className)
        section.node.classList.remove('d-flex')
        section.node.classList.add('position-absolute')

        return section
    }

    pushItemFriend(friend: IFriend) {
        const parentClassName = `${this.className}__footer__func__friend__list`
        const parentSelector = `.${this.targetClassName}.${this.className} .${parentClassName}`
        const childClassName = `${parentClassName}__item`
        const parentElement: Element | null = document.querySelector(parentSelector)
        // console.log(parentSelector, parentElement)
        if (!parentElement) return

        const childElement = this.createItemFriend(childClassName, friend)
        childElement.addListener('click').on('click', this.handleClickChatAreaBtn.bind(this))
        parentElement.appendChild(childElement.node)
    }

    updateStatusItemFriend(friend: IFriend): void {
        const targetSelector = `.${this.targetClassName}.${this.className} [class*="__footer"][class*="${this.funcFriendClassNameSelector}"][data-id="${friend._id}"]`
        const targetElement: Element | null = document.querySelector(targetSelector)
        if (!targetElement) return

        const avatar = targetElement.querySelector('[class*="__avatar"]')
        const avatarStyle = avatar?.getAttribute('style')
        if (avatarStyle && avatarStyle!.indexOf(friend.picture!) === -1) {
            const newStyle = avatarStyle.replace(
                /background-image:\s*url\((.*?)\)/,
                `background-image: url(${friend.picture})`,
            )
            avatar?.setAttribute('style', newStyle)
        }

        const name = targetElement.querySelector('[class*="__name"')
        if (name && name.textContent !== friend.name) {
            name.textContent = friend.name
        }

        const status = targetElement.querySelector('[class*="__status"')
        if (status && status.textContent !== this.createStatus(friend.socketId)) {
            console.log('avatar selected: ', avatar, avatarStyle!.indexOf(friend.picture!))
        }
    }

    createItemFriend(className: string, data: IFriend): Phaser.GameObjects.DOMElement {
        const container = this.createContainer('div', {})
        container.node.setAttribute('data-id', data._id)
        container.node.setAttribute('data-name', data.name)
        container.node.classList.add(className)

        const avatar = this.createContainer('div', { 'background-image': `url(${data.picture})` })
        avatar.node.classList.add(className + '__avatar')
        container.node.appendChild(avatar.node)

        const name = this.createText('h4', {}, data.name)
        name.node.classList.add(className + '__name')
        const status = this.createText('h5', {}, this.createStatus(data.socketId))
        status.node.classList.add(className + '__status')
        const statusWrapper = this.createContainer('div', {
            'flex-direction': 'column',
            'align-items': 'start',
        })
        statusWrapper.node.append(name.node, status.node)
        container.node.appendChild(statusWrapper.node)

        return container
    }

    // #region handle events
    handleUpdateTargetMessage() {
        this.setTargetMessage({
            _id: this.mainStore.getRoom?._id || '',
            name: CONSTANTS.areas.room.value,
        })
    }

    handleClickChatAreaBtn(e: any) {
        const btn = e.currentTarget
        let idTarget = btn.dataset.id // '' | '12314124124142...'
        let nameTarget = btn.dataset.name
        console.log(idTarget)
        // because init id of btn room is 'room'
        if (idTarget === CONSTANTS.areas.room.key) idTarget = this.mainStore.getRoom._id
        this.setTargetMessage({ _id: idTarget, name: nameTarget })

        const children = this.listMessageWrapper?.node.children
        // hidden all message table
        Array.from(children!).find((child) => {
            child.classList.add('d-none')
            child.classList.remove('d-flex')
        })

        // show message table was chosen
        const messageWrapper = Array.from(children!).find((child) => {
            console.log(child.getAttribute('data-id'), idTarget)
            return child.getAttribute('data-id') === idTarget
        })
        messageWrapper?.classList.remove('d-none')
        messageWrapper?.classList.add('d-flex')
    }

    handleAddMessageReceived(data: IChatReceiveMessage) {
        const from = data.sender.name
        const message = data.message
        let target = data.receiver
        console.log('received, from: ', from, ', target: ', target, ', message: ', message)
        if (data.receiver._id === this.mainStore.getPlayer._id) {
            target = data.sender
        }
        this.addMessage(from, target, message)
    }

    sendMessage(e: any) {
        e.preventDefault()
        const input = e.target.querySelector('input')
        const value = input.value
        const receiver = this.targetMessage!.name
        console.log('Send Message: ', value, ', receiver: ', receiver)
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
