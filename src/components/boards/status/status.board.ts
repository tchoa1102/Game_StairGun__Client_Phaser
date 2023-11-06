import { signOut } from 'firebase/auth'
import Board from '../board.game'
import StatusShowDOM from './status.show.dom'
import { firebaseService } from '@/services/http-https'

export default class StatusBoard extends Board {
    private content: Phaser.GameObjects.DOMElement | undefined
    private statusContent: Phaser.GameObjects.DOMElement | undefined
    constructor(game: any, name: string) {
        super(game, name)
        super.create()
        this.className = 'status-board'
        this.create()
        this.appendChildToContent(this.content!.node)
        this.setCallbackExit(this.handleClickExit.bind(this))
    }

    create(): typeof this {
        const className = this.className + '__content'
        this.content = this.createContainer('section', {})
        this.content.node.classList.add(className)

        // #region left status
        const characterWrapper = this.createLeftStatus(className)
        this.content.node.appendChild(characterWrapper.node)
        // #endregion left status

        // #region right status
        const setting = this.createRightStatus(className)

        this.content.node.appendChild(setting.node)
        // #endregion right status
        return this
    }

    createLeftStatus(className: string): Phaser.GameObjects.DOMElement {
        const statusCharacterWrapper = this.createContainer('section', {})
        const classStatusCharacterWrapper = className + '__character'
        statusCharacterWrapper.node.classList.add(classStatusCharacterWrapper)

        const characterWrapper = this.createContainer('section', { 'justify-content': 'center' })
        const character = new StatusShowDOM(this.game).create()
        character.node.classList.add('position-relative')
        characterWrapper.node.classList.add('position-relative')
        characterWrapper.node.appendChild(character.node)
        statusCharacterWrapper.node.appendChild(characterWrapper.node)

        this.statusContent = this.createContainer('section', {})
        this.createStatusContent(this.statusContent)

        statusCharacterWrapper.node.appendChild(this.statusContent.node)

        return statusCharacterWrapper
    }

    createRightStatus(className: string): Phaser.GameObjects.DOMElement {
        const setting = this.createContainer('section', {})
        const classNameSetting = className + '__setting'
        setting.node.classList.add(classNameSetting)

        const logOutBtn = this.createBtn('button', { height: '30px' })
            .addListener('click')
            .on('click', this.handleClickLogOut.bind(this))
        logOutBtn.node.classList.add('d-inline-block')
        logOutBtn.node.classList.add(classNameSetting + '__btn-logout')
        const text = this.createText('span', {}, 'Đăng Xuất')
        logOutBtn.node.appendChild(text.node)
        setting.node.appendChild(logOutBtn.node)

        return setting
    }

    createStatusContent(node: Phaser.GameObjects.DOMElement) {
        node.node.innerHTML = ''
        node.node.classList.add(this.className + '__content__character' + '__status')

        // #region render status
        // #endregion render status

        return node
    }

    handleClickLogOut(e: any) {
        console.log(e)
        signOut(firebaseService.auth)
            .then(() => console.log('Sign out'))
            .catch((e) => console.log(e))
    }

    handleClickExit() {
        this.node.classList.add('d-none')
    }
}
