import Phaser from 'phaser'
import StairGame from './stairGame'
import GunGame from './gunGame'
import { useMainStore } from '@/stores'
import { matchService } from '@/services'
import FETCH from '@/services/fetchConfig.service'

class GamePlay extends Phaser.Scene {
    private stairGame: Phaser.Scene | null
    private gunGame: Phaser.Scene | null
    constructor() {
        super('gamePlay')
        this.stairGame = null
        this.gunGame = null
    }

    init() {}

    async preload() {
        console.log('%c\nLoading...\n', 'color: yellow; font-size: 16px;')
        const mainStore = useMainStore()

        const gameData = await matchService.create({})
        console.log('GameData: ', gameData)
        const tiledMap = await FETCH(gameData.data.tiledMapConfig)

        this.stairGame = this.scene.add('stair-game', StairGame, true, {
            players: gameData.data.players,
            stairs: JSON.stringify(gameData.data.stairs),
            fileConfigStick: JSON.stringify(gameData.data.stickConfig),
        })
        this.gunGame = this.scene.add('gun-game', GunGame, true, {
            tiledMapConfig: tiledMap,
        })
    }

    create() {
        console.log('%c\nCreate...\n', 'color: red; font-size: 16px;')
    }

    update(time: number, delta: number) {
        // console.log('%c\nUpdating...\n', 'color: blue; font-size: 16px;')
    }

    render() {
        console.log('%c\nRendering...\n', 'color: #363; font-size: 16px;')
    }
}

export default GamePlay
