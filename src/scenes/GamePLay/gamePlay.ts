import Phaser from 'phaser'
import StairGame from './stairGame'
import GunGame from './gunGame'

const stairsData = {
    data: [
        {
            width: 500,
            height: 20,
            img: 'src/assets/stair-img.png',
            x: 0,
            y: 3000,
        },
        {
            width: 500,
            height: 20,
            img: 'src/assets/stair-img.png',
            x: 100,
            y: 2500,
        },
        {
            width: 100,
            height: 20,
            img: 'src/assets/stair-img.png',
            x: 0,
            y: 2000,
        },
    ],
}

class GamePlay extends Phaser.Scene {
    public MAX_WIDTH = 0
    public MAX_HEIGHT = 0
    private stairGame: Phaser.Scene | null
    private gunGame: GunGame
    constructor() {
        super('gamePlay')
        this.stairGame = null
        this.gunGame = new GunGame(this)
    }

    init() {}

    preload() {
        console.log('%c\nLoading...\n', 'color: yellow; font-size: 16px;')
        this.stairGame = this.scene.add('stairGame', StairGame, true, {
            stairs: JSON.stringify(stairsData),
        })
        // this.stairGame
        this.gunGame.preload()
    }

    create() {
        console.log('%c\nCreate...\n', 'color: red; font-size: 16px;')
        // this.gunGame = new GunGame(this)
        this.gunGame.create()
    }

    update(time: number, delta: number) {
        // console.log('%c\nUpdating...\n', 'color: blue; font-size: 16px;');
        this.gunGame.update()
    }

    render() {
        console.log('%c\nRendering...\n', 'color: #363; font-size: 16px;')
    }
}

export default GamePlay
