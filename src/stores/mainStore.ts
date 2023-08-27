import { defineStore } from 'pinia'
import Phaser from 'phaser'

import { type Indicator_ITF } from '@/util/interface/index.interface'
import { BootGame, GamePlay } from '@/scenes/index'

interface state_itf {
    game: Phaser.Game | undefined,
    zoom: number,
    width: number,
    height: number,
}

const MIN_WIDTH = 185

const state : state_itf = {
    game: undefined,
    zoom: 1,
    width: MIN_WIDTH * 2,
    height: MIN_WIDTH
}

const useMainStore = defineStore('main', {
    state: () => ( state ),
    getters: {},
    actions: {
        init(heightScreen: number, initObject: Indicator_ITF) {
            this.zoom = heightScreen / MIN_WIDTH > 1 ? Math.floor(heightScreen / MIN_WIDTH) : 1
            console.log('zoom: %d', this.zoom);
            
            const GAME_CONFIG : Phaser.Types.Core.GameConfig = {
                type: Phaser.AUTO,
                width: this.width * this.zoom,
                height: this.height * this.zoom,
                scene: [GamePlay, BootGame],
                parent: initObject.parent || undefined,
                physics: {
                    default: 'matter',
                    matter: {
                        enabled: true,
                        debug: true,
                        gravity: {
                            y: 9.6
                        },
                    }
                }
                // backgroundColor: '#E5FB8E'
            }

            // Init game
            console.log('\n%c-- StairGun --\n', 'color: #fff; background-color: pink; font-size: 28px;');
            try {
                this.game = new Phaser.Game(GAME_CONFIG)
            } catch (error) {
                console.log('%cERROR', 'color: red; font-size: 20px');
            }
        }
    },
})

export default useMainStore
