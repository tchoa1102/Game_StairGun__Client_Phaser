import Phaser from 'phaser'
import StairGame from './stairGame'
import GunGame from './gunGame'
import { useMainStore } from '@/stores'
import { MatchService } from '@/services'

const stairsData = {
    data: [
        {
            width: 500,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            x: 0,
            y: 3000,
        },
        {
            width: 500,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            x: 100,
            y: 2500,
        },
        {
            width: 100,
            height: 20,
            img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
            x: 0,
            y: 2000,
        },
    ],
}

class GamePlay extends Phaser.Scene {
    public MAX_WIDTH = 0
    public MAX_HEIGHT = 0
    private stairGame: Phaser.Scene | null
    private gunGame: GunGame | null
    constructor() {
        super('gamePlay')
        this.stairGame = null
        this.gunGame = null
    }

    init() {}

    async preload() {
        console.log('%c\nLoading...\n', 'color: yellow; font-size: 16px;')
        const mainStore = useMainStore()

        const data = await MatchService.create({})

        this.stairGame = this.scene.add('stairGame', StairGame, true, {
            stairs: data.stairs,
            fileConfigStick: data.stickConfig,
        })
        this.gunGame = new GunGame(this)
        this.gunGame.preload()
    }

    create() {
        console.log('%c\nCreate...\n', 'color: red; font-size: 16px;')
        // this.gunGame = new GunGame(this)
        this.gunGame?.create()
    }

    update(time: number, delta: number) {
        // console.log('%c\nUpdating...\n', 'color: blue; font-size: 16px;');
        this.gunGame?.update()
    }

    render() {
        console.log('%c\nRendering...\n', 'color: #363; font-size: 16px;')
    }
}

export default GamePlay
