import { defineStore, type _GettersTree } from 'pinia'
import Phaser from 'phaser'

import { type IIndicator, type IState } from '@/util/interface/index.interface'
import { GamePlay } from '@/scenes/index'
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin'
import { io } from 'socket.io-client'

const MIN_HEIGHT = 740

const state: IState = {
    game: undefined,
    socket: io('http://localhost:4000'),
    zoom: 1,
    width: MIN_HEIGHT * 2,
    height: MIN_HEIGHT,
    player: {
        _id: '1',
    },
}
const useMainStore = defineStore('main', {
    state: () => state,
    getters: {
        getSocket(): typeof this.socket {
            return this.socket
        },
        getWidth(): number {
            return this.width
        },
        getHeight(): number {
            return this.height
        },
        getGame(): typeof this.game {
            return this.game
        },
    },
    actions: {
        init(heightScreen: number, initObject: IIndicator) {
            this.zoom = heightScreen / MIN_HEIGHT > 1 ? Math.floor(heightScreen / MIN_HEIGHT) : 1
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
                        debug: true,
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
