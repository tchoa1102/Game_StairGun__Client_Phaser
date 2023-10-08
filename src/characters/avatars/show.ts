import type { Home } from '@/scenes'
import type PrepareDuel from '@/scenes/BootGame/prepareDuel'
import CONSTANT_HOME from '@/scenes/Home/CONSTANT'
import FETCH from '@/services/fetchConfig.service'
import { useMainStore } from '@/stores'
import { createAnimation, initKeyAnimation } from '@/util/shares'

const CONSTANT = {
    sprites: {
        'face.default': {
            key: 'face.default',
            positionY: 65,
        },
        'body.default': {
            key: 'body.default',
            positionY: 65 + 55,
        },
        // 'body.default.hand': {
        //     key: 'body.default.hand',
        //     positionY: 65 + 55
        // },
        'foot.default': {
            key: 'foot.default',
            positionY: 142,
        },
    },
    active: 'show',
}

export default class ShowCharacter extends Phaser.Scene {
    private gameObject: any
    private configDefault: Array<any>
    constructor() {
        super({
            key: 'character-show',
        })
        this.configDefault = []
    }

    init() {
        // this.gameObject = mainStore.getGame.scene.getScene(CONSTANT_HOME.key.home)
    }

    create() {
        const mainStore: any = useMainStore()
        this.gameObject = mainStore.getGame.scene.getScene(CONSTANT_HOME.key.home)

        const dataObj: any = CONSTANT.sprites
        for (const key in dataObj) {
            if (dataObj.hasOwnProperty(key)) {
                const element = dataObj[key]

                this.textures.addAtlas(
                    element.key,
                    this.gameObject.textures.get(element.key).getSourceImage(),
                    // this.gameObject.textures.get(CONSTANT.key.face), -> error
                    JSON.parse(localStorage.getItem(element.key)!),
                )
                // this.anims.createFromAseprite()

                const sprite = this.add
                    .sprite(+this.game.config.width / 2, element.positionY, element.key)
                    .setOrigin(0.5, 0)
            }
        }
    }
}
