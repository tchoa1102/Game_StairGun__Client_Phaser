import CONSTANT_HOME from '@/scenes/Home/CONSTANT'
import { useMainStore } from '@/stores'
import { createAnimation, initKeyAnimation } from '@/util/shares'
import type { IPlayerOnMatch } from '@/util/interface/index.interface'
import type { IPlayer } from '@/util/interface/state.main.interface'
import { Character } from '..'

export const CONSTANT = {
    textureNotFound: '__MISSING',
    sprites: CONSTANT_HOME.sprites,
    deeps: CONSTANT_HOME.deeps,
    active: 'show',
}

export default class GunShow extends Character {
    update(time: any, delta: any): void {
        throw new Error('Method not implemented.')
    }
    updateData(data: { [key: string]: any }): void {
        throw new Error('Method not implemented.')
    }
    addEvent(): void {
        throw new Error('Method not implemented.')
    }
    handleKeyEvent(): void {
        throw new Error('Method not implemented.')
    }
    private configs: { [key: string]: any } = {
        face: CONSTANT.sprites.face.config,
        body: CONSTANT.sprites.body.config,
        foot: CONSTANT.sprites.foot.config,
    }
    private sprite: {
        [key: string]: Phaser.GameObjects.Sprite | undefined
        face?: Phaser.GameObjects.Sprite
        body?: Phaser.GameObjects.Sprite
        foot?: Phaser.GameObjects.Sprite
    } = { face: undefined, body: undefined, foot: undefined }
    private thisP: IPlayer
    // private x: number = 0
    // private y: number = 0
    private depth: number = 0

    private keysShow: { [key: string]: string } = {}
    constructor(_this: any, name: string, x: number, y: number, idPlayer: string, depth?: number) {
        super(_this, 0, name, x, y, JSON.stringify({}), 1)
        this.mainStore = useMainStore()
        const player: IPlayerOnMatch | undefined = this.mainStore.getMatch.players.find(
            (p: IPlayerOnMatch) => p.target._id === idPlayer,
        )
        if (!player) {
            this.thisP = this.mainStore.getPlayer
        } else {
            this.thisP = player.target as IPlayer
        }
        this.x = x
        this.y = y
        if (depth) this.depth = depth
    }

    preload() {
        const mainStore: any = useMainStore()
        const looks: { [key: string]: string } = this.thisP!.looks
        // console.log(looks)

        const objsSpriteConfig: any = CONSTANT.sprites
        // load default and current display
        // console.log('Config default: ', this.configs)
        for (const key in objsSpriteConfig) {
            if (objsSpriteConfig.hasOwnProperty(key)) {
                const element = objsSpriteConfig[key]
                this.game.load.atlas(element.key, element.img, this.configs[key])
                // console.log(element.key)
                this.keysShow[key] = element.key
                if (looks[key]) {
                    this.keysShow[key] = looks[key]
                    this.game.load.atlas(looks[key], looks[key], this.configs[key])
                }
            }
        }
    }

    create() {
        const configs: { [key: string]: any } = this.configs
        for (const key in configs) {
            if (Object.prototype.hasOwnProperty.call(configs, key)) {
                const config: { [key: string]: any } = configs[key]
                // console.log(config)
                const anim = createAnimation(this, config.meta.name, config.animations)
                // console.log(anim)
            }
        }
        const mainStore: any = useMainStore()
        const looks: any = this.thisP!.looks
        for (const type in looks) {
            if (looks.hasOwnProperty(type)) {
                const src = looks[type]
                this.changeDisplay(type, src)
            }
        }
        console.log('Create show character successfully')
    }

    changeDisplay(type: string, key?: string) {
        // console.log('type: ', type, ', new Key: ', key)
        if (!CONSTANT.sprites.hasOwnProperty(type)) return
        if (!key || key.length === 0) {
            this.keysShow[type] = (CONSTANT.sprites as any)[type].key
            this.changeSprite(type, this.keysShow[type])
            return
        }
        const texture = this.game.textures.get(key)
        // console.log(texture)
        if (texture.key === CONSTANT.textureNotFound) {
            // console.log('texture not found, loading...')
            this.game.load.atlas(key, key, this.configs[type])
            this.game.load.once('complete', () => {
                // console.log('load new texture successfully')
                this.changeSprite(type, key)
            })
            this.game.load.start()
            return
        }
        // console.log('texture found! Adding...')

        this.changeSprite(type, key)
    }

    changeSprite(type: string, key: string) {
        if (!!this.sprite[type]) this.sprite[type]!.destroy()
        this.sprite[type] = this.game.add.sprite(this.x, this.y, key).setOrigin(0, 0)
        const deeps: Record<string, number> = CONSTANT.deeps
        this.sprite[type]?.setDepth(deeps[type] + this.depth)
    }

    rerender() {
        console.log('Rerendering')
        // this.scene.restart()
    }
}
