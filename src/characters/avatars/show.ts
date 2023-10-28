import type { Home } from '@/scenes'
import type PrepareDuel from '@/scenes/BootGame/prepareDuel'
import CONSTANT_HOME from '@/scenes/Home/CONSTANT'
import FETCH from '@/services/fetchConfig.service'
import { useMainStore } from '@/stores'
import { createAnimation, initKeyAnimation } from '@/util/shares'

export const CONSTANT = {
    sprites: {
        face: {
            key: 'face.default',
            positionY: 65,
        },
        body: {
            key: 'body.default',
            positionY: 65 + 55,
        },
        // 'body.default.hand': {
        //     key: 'body.default.hand',
        //     positionY: 65 + 55
        // },
        foot: {
            key: 'foot.default',
            positionY: 142,
        },
    },
    active: 'show',
}

export default class ShowCharacter extends Phaser.Scene {
    // private gameObject: any
    // private keys: Array<any> = []
    private configDefault: Array<any> = []
    constructor() {
        super({
            key: 'character-show',
        })
    }

    init() {
        // this.gameObject = mainStore.getGame.scene.getScene(CONSTANT_HOME.key.home)
    }

    preload() {
        const mainStore: any = useMainStore()
        // this.gameObject = mainStore.getGame.scene.getScene(CONSTANT_HOME.key.home)

        const looks: { [key: string]: string } = mainStore.getPlayer.looks
        // console.log(looks)
        for (const key in looks) {
            if (looks.hasOwnProperty(key)) {
                const srcConfig = looks[key]
                const element: { [key: string]: any } = CONSTANT.sprites
                if (element.hasOwnProperty(key)) {
                    const e = element[key]
                    const k = e.key
                    const config: any = JSON.parse(localStorage.getItem(k)!)
                    // console.log('Config avatar: ', k, config)
                    this.configDefault.push(config)

                    this.load.atlas(config.meta.name, config.src[0], config)
                }
            }
        }

        // const dataObj: any = CONSTANT.sprites
        // for (const key in dataObj) {
        //     if (dataObj.hasOwnProperty(key)) {
        //         const element = dataObj[key]

        //         this.textures.addAtlas(
        //             element.key,
        //             this.gameObject.textures.get(element.key).getSourceImage(),
        //             // this.gameObject.textures.get(CONSTANT.key.face), -> error
        //             JSON.parse(localStorage.getItem(element.key)!),
        //         )
        //         // this.anims.createFromAseprite()

        //         // this.keys.push(element.key)
        //     }
        // }
    }

    create() {
        this.configDefault.forEach((config) => {
            createAnimation(this, config.meta.name, config.animations)
        })
        const dataObj: any = CONSTANT.sprites
        for (const key in dataObj) {
            if (dataObj.hasOwnProperty(key)) {
                const element = dataObj[key]
                const sprite = this.add
                    .sprite(+this.game.config.width / 2, element.positionY, element.key)
                    .setOrigin(0.5, 0)
            }
        }
    }

    rerender() {
        console.log('Rerendering')
        this.scene.restart()
    }
}
