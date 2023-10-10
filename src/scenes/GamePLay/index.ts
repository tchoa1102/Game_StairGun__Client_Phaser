import Phaser from 'phaser'
import StairGame from './stairGame'
import GunGame from './gunGame'
import { useMainStore } from '@/stores'
import { matchService } from '@/services'
import FETCH from '@/services/fetchConfig.service'
import type { IMatchRes } from '@/util/interface/index.interface'

class GamePlay extends Phaser.Scene {
    private dataGame: IMatchRes | null
    private stairGame: Phaser.Scene | null
    private gunGame: Phaser.Scene | null
    constructor() {
        super('game-play-scene')
        this.dataGame = null
        this.stairGame = null
        this.gunGame = null
    }

    init({ data }: { data: IMatchRes }) {
        console.log('data game: ', data)

        this.dataGame = data
    }

    async preload() {
        console.log('%c\nLoading Game Play...\n', 'color: yellow; font-size: 16px;')
        const mainStore = useMainStore()

        const configStick: IStickAnimationConfig = await FETCH(this.dataGame!.stickConfig)
        this.stairGame = this.scene.add('stair-game', StairGame, true, {
            players: this.dataGame!.players,
            stairs: JSON.stringify(this.dataGame!.stairs),
            configStick: configStick,
        })
        // const gameData = await matchService.create({})
        // console.log('GameData: ', gameData)
        // const tiledMap = await FETCH(gameData.data.tiledMapConfig)

        // this.stairGame = this.scene.add('stair-game', StairGame, true, {
        //     players: gameData.data.players,
        //     stairs: JSON.stringify(gameData.data.stairs),
        //     fileConfigStick: JSON.stringify(gameData.data.stickConfig),
        // })
        // this.gunGame = this.scene.add('gun-game', GunGame, true, {
        //     tiledMapConfig: tiledMap,
        // })
    }

    create() {
        // console.log('%c\nCreate Game Play...\n', 'color: red; font-size: 16px;')
    }

    update(time: number, delta: number) {
        // console.log('%c\nUpdating...\n', 'color: blue; font-size: 16px;')
    }

    render() {
        console.log('%c\nRendering...\n', 'color: #363; font-size: 16px;')
    }
}

export default GamePlay
