import ShowCharacter from '@/characters/avatars/show'
import BaseDOM from '@/components/baseDOMElement'
import type { IItemOnBag } from '@/util/interface/state.main.interface'

export default class StatusShowDOM extends BaseDOM {
    private className: string = 'status-info'
    private widthCharacter: number = 204
    private heightCharacter: number = 190
    public gameShowManager: Phaser.Game | undefined
    constructor(game: any) {
        super(game, {})
        this.setOrigin(0)
        this.node.classList.add(this.className)
        // this.create()
    }

    create(): typeof this {
        const avatar = this.createContainer('section', {})
        avatar.node.classList.add(this.className + '__avatar')
        this.createElementShowCharacter(avatar)
        this.node.appendChild(avatar.node)
        return this
    }

    createElementShowCharacter(body: Phaser.GameObjects.DOMElement): Phaser.Game {
        const bodyContainer = body.node.getBoundingClientRect()
        console.log('bodyContainer: ', bodyContainer.width, bodyContainer.height)
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: this.widthCharacter,
            height: this.heightCharacter,
            parent: body.node as HTMLElement,
            scene: [ShowCharacter],
            transparent: true,
        }
        this.gameShowManager = new Phaser.Game(config)
        this.mainStore.getWatch.bag.push(this.handleChangeDisplay.bind(this))
        return this.gameShowManager
    }

    handleChangeDisplay(data: Array<IItemOnBag>): void {
        const itemIsGoingWear = data.find((item) => item.isWear)
        if (!itemIsGoingWear) {
            const itemUnbind = data.find((item) => !item.isWear)
            itemUnbind && this.changeDisplay(itemUnbind.data.type)
            return
        }

        this.changeDisplay(itemIsGoingWear.data.type, itemIsGoingWear.data.texture)
        return
    }

    changeDisplay(type: string, key?: string) {
        setTimeout(() => {
            if (!this.gameShowManager) return
            const sceneGame: any = this.gameShowManager.scene.getScene('character-show')
            // console.log('Scene game: ', sceneGame)
            sceneGame?.changeDisplay(type, key)
        }, 1)
    }
}
