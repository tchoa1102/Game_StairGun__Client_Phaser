import BaseDOM from '../baseDOMElement'
import StatusBoard from '../boards/status/status.board'

export default class Status extends BaseDOM {
    private className: string = 'status'
    private nameDefault: string = 'Status'
    private infoBoard: Phaser.GameObjects.DOMElement | undefined
    constructor(game: any) {
        super(game, {})
        this.node.classList.add(this.className)
    }

    create(): typeof this {
        const avatarWrapper = this.createAvatarStatus()

        this.node.append(avatarWrapper.node)
        return this
    }

    createAvatarStatus(): Phaser.GameObjects.DOMElement {
        const className = this.className + '__avatar-wrapper'
        const wrapper = this.createContainer('section', {})
            .addListener('click')
            .on('click', this.handleClickAvatar.bind(this))

        // #region create status info board
        this.infoBoard = new StatusBoard(this.game, this.nameDefault)
        this.infoBoard.node.classList.add('d-none')
        // #endregion create status info board

        // #region avatar
        const picture = this.mainStore.getPlayer.picture
        const avatar = this.createContainer('section', { background: `url(${picture})` })
        avatar.node.classList.add(className + '__avatar')
        wrapper.node.appendChild(avatar.node)
        // #endregion avatar

        // #region player status
        const playerStatus = this.createContainer('section', {})
        const classNamePlayerStatus = className + '__playerStatus'
        playerStatus.node.classList.add(classNamePlayerStatus)

        const name = this.mainStore.getPlayer.name
        const playerName = this.createText('span', {}, name)
        playerName.node.classList.add(classNamePlayerStatus + '__name')
        playerStatus.node.append(playerName.node)
        wrapper.node.appendChild(playerStatus.node)
        // #endregion player status

        return wrapper
    }

    // #region handle events
    handleClickAvatar(e: any) {
        console.log(e)
        this.infoBoard!.node.classList.remove('d-none')
    }
    // #endregion handle events
}
