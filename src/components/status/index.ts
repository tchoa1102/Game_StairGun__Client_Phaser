import BaseDOM from '../baseDOMElement'
import StatusBoard from '../boards/status/status.board'

export default class Status extends BaseDOM {
    private className: string = 'status'
    private nameDefault: string = 'Status'
    private infoBoard: Phaser.GameObjects.DOMElement | undefined
    private levelDOM: Phaser.GameObjects.DOMElement | undefined
    private goldDOM: Phaser.GameObjects.DOMElement | undefined
    constructor(game: any) {
        super(game, {})
        this.node.classList.add(this.className)
    }

    create(): typeof this {
        const avatarWrapper = this.createAvatarStatus()

        this.mainStore.getWatch.gold.push(this.watchChangeGold.bind(this))

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
        wrapper.node.appendChild(playerStatus.node)
        const classNamePlayerStatus = className + '__playerStatus'
        playerStatus.node.classList.add(classNamePlayerStatus)

        const playerInfoWrapper = this.createContainer('section', {})
        playerStatus.node.append(playerInfoWrapper.node)
        playerInfoWrapper.node.classList.add(classNamePlayerStatus + '__name')

        const name = this.mainStore.getPlayer.name
        const playerName = this.createText('span', {}, name)
        playerInfoWrapper.node.append(playerName.node)
        playerName.node.classList.add()

        this.levelDOM = this.createText('span', {}, 'LV ' + this.mainStore.getPlayer.level)
        playerInfoWrapper.node.append(this.levelDOM.node)

        const goldWrapper = this.createContainer('div', {})
        playerStatus.node.appendChild(goldWrapper.node)
        goldWrapper.node.classList.add(classNamePlayerStatus + '__gold')

        const goldIcon = this.createIcon('cryptocurrency-color:gold', {})
        goldWrapper.node.appendChild(goldIcon.node)
        this.goldDOM = this.createText('span', {}, this.mainStore.getPlayer.gold)
        goldWrapper.node.appendChild(this.goldDOM.node)
        // #endregion player status

        return wrapper
    }

    // #region handle events
    handleClickAvatar(e: any) {
        console.log(e)
        this.infoBoard!.node.classList.remove('d-none')
    }
    // #endregion handle events

    // #region watch
    watchChangeLevel() {
        if (!this.levelDOM) return
        if (!this.mainStore.getPlayer) return
        this.levelDOM.node.textContent = 'LV ' + this.mainStore.getPlayer.level
    }
    watchChangeGold() {
        if (!this.goldDOM) return
        if (!this.mainStore.getPlayer) return
        this.goldDOM.node.textContent = this.mainStore.getPlayer.gold
    }
    // #endregion watch
}
