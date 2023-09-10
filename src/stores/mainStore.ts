import { defineStore, type _GettersTree } from 'pinia'
import Phaser from 'phaser'

import { type IIndicator, type IState } from '@/util/interface/index.interface'
import { BootGame, GamePlay } from '@/scenes/index'
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin'

const MIN_WIDTH = 740

const state: IState = {
    game: undefined,
    zoom: 1,
    width: MIN_WIDTH * 2,
    height: MIN_WIDTH,
}

const useMainStore = defineStore('main', {
    state: () => state,
    getters: {
        getWidth(): number {
            return this.width
        },
    },
    actions: {
        init(heightScreen: number, initObject: IIndicator) {
            this.zoom = heightScreen / MIN_WIDTH > 1 ? Math.floor(heightScreen / MIN_WIDTH) : 1
            console.log('zoom: %d', this.zoom)

            const GAME_CONFIG: Phaser.Types.Core.GameConfig = {
                type: Phaser.AUTO,
                width: this.width * this.zoom,
                height: this.height * this.zoom,
                scene: [GamePlay],
                parent: initObject.parent || undefined,
                physics: {
                    default: 'matter',
                    matter: {
                        // debug: true,
                    },
                },
                // backgroundColor: '#E5FB8E',
                plugins: {
                    scene: [
                        {
                            plugin: PhaserMatterCollisionPlugin,
                            key: 'matterCollision',
                            mapping: 'matterCollision',
                        },
                    ],
                },
            }

            // Init game
            console.log(
                '\n%c-- StairGun --\n',
                'color: #fff; background-color: pink; font-size: 28px;',
            )
            try {
                this.game = new Phaser.Game(GAME_CONFIG)
            } catch (error) {
                console.log('%cERROR', 'color: red; font-size: 20px')
            }
        },
    },
})

export default useMainStore
