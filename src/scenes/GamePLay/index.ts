import Phaser from 'phaser'
import StairGame from './stairGame'
import GunGame from './gunGame'
import { useMainStore } from '@/stores'
import FETCH from '@/services/fetchConfig.service'
import type { IMatchRes } from '@/util/interface/index.interface'
import CONSTANT_HOME from '../Home/CONSTANT'
import matchService from '@/services/socket/match.service'

class GamePlay extends Phaser.Scene {
    public numOfLoaded: number = 0
    public maxLoaded: number = 2

    // private dataGame: IMatchRes | null = null
    private loadings: Array<any> = []
    constructor() {
        super('game-play-scene')
    }

    getLoading(): Array<any> {
        return this.loadings || []
    }

    init() {
        //{ data }: { data: IMatchRes }
        // console.log('data game: ', data)
        // this.dataGame = data
        // const mainStore = useMainStore()
        // mainStore.setMatch(data)
    }

    async preload() {
        console.log('%c\nLoading Game Play...\n', 'color: yellow; font-size: 16px;')
        const mainStore: any = useMainStore()
        this.load.spritesheet(CONSTANT_HOME.loading.key, CONSTANT_HOME.loading.src, {
            frameWidth: 159,
            frameHeight: 308,
        })

        const configStick: IStickAnimationConfig = await FETCH(mainStore.getMatch!.stickConfig)
        const tiledMap = await FETCH(mainStore.getMatch!.tiledMapConfig)

        mainStore.setPropertyMatch({
            stickConfig: JSON.stringify(configStick),
            tiledMapConfig: JSON.stringify(tiledMap),
        })
        // mainStore
        this.scene.add('stair-game', StairGame, true, {
            players: mainStore.getMatch!.players,
        })

        console.log('%cLoaded!', 'color: red; font-size: 16px;')
        this.scene.add('gun-game', GunGame, true, {
            tiledMapConfig: tiledMap,
        })
    }

    create() {
        // const mainStore: any = useMainStore()
        // const w = mainStore.getWidth * mainStore.getZoom
        // const h = mainStore.getHeight * mainStore.getZoom

        // const rect = this.add.rectangle(0, 0, w, h, 0xffffff, 0.2).setOrigin(0)
        // const loading = this.add.sprite(w / 2, h / 2, CONSTANT_HOME.loading.key)
        // this.anims.create({
        //     key: 'animation__' + CONSTANT_HOME.loading.key,
        //     frames: this.anims.generateFrameNumbers(CONSTANT_HOME.loading.key, {
        //         start: 0,
        //         end: 4,
        //     }),
        //     frameRate: 6,
        //     repeat: -1,
        // })
        // loading.anims.play('animation__' + CONSTANT_HOME.loading.key)
        // this.loadings.push(rect)
        // this.loadings.push(loading)
        console.log('%c\nCreate Game Play...\n', 'color: red; font-size: 16px;')
        this.listeningSocket()
    }

    update(time: number, delta: number) {
        // console.log('%c\nUpdating...\n', 'color: blue; font-size: 16px;')
    }

    render() {
        console.log('%c\nRendering...\n', 'color: #363; font-size: 16px;')
    }

    loaded() {
        this.numOfLoaded += 1
        console.log(this.numOfLoaded)

        if (this.numOfLoaded < this.maxLoaded) return
        matchService.loaded()
    }

    playGame() {
        this.getLoading().forEach((child) => child.setVisible(false))
        ;(this.game.scene.getScene('stair-game') as any).createGameObject(true)
        ;(this.game.scene.getScene('gun-game') as any).createGameObject(true)
        console.log('%cPlay!', 'color: red; font-size: 20px')
    }

    // #region listening socket
    listeningSocket() {
        matchService.listeningStartGame(() => this.playGame())
    }
    // #endregion listening socket
}

export default GamePlay
