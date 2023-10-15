import FETCH from '@/services/fetchConfig.service'
import { useMainStore } from '@/stores'

class GunGame extends Phaser.Scene {
    // #region declare properties
    public MAX_WIDTH = 1480
    public MAX_HEIGHT = 1000
    public CAMERA_WIDTH: number
    public CAMERA_HEIGHT: number
    public isPlay: boolean = false
    public x: number

    private mainStore: any
    private background: Phaser.GameObjects.Image | undefined
    private cameraGame: Phaser.Cameras.Scene2D.Camera | undefined
    private tiledMapConfig: any
    private map: Phaser.Tilemaps.Tilemap | undefined
    private controls: any
    // #endregion
    constructor() {
        super('gun-game')
        this.mainStore = useMainStore()
        this.CAMERA_WIDTH = ((this.mainStore.width * this.mainStore.zoom) / 24) * 18
        this.x = ((this.mainStore.width * this.mainStore.zoom) / 24) * 6 + 1
        this.CAMERA_HEIGHT = this.mainStore.height * this.mainStore.zoom
    }

    init({ tiledMapConfig }: { tiledMapConfig: any }) {
        this.tiledMapConfig = tiledMapConfig
    }

    preload() {
        this.load.image('background-gun', this.tiledMapConfig.background)
        // this.load.tilemapTiledJSON('tilemap', this.tiledMapConfig)
        // this.load.image(this.tiledMapConfig.tilesets[0].name, this.tiledMapConfig.tilesets[0].image)
    }

    create() {
        // ;(this.game.scene.getScene('game-play-scene') as any).loaded()
        this.createGameObject(true)
    }

    createGameObject(isCreate: boolean = true) {
        if (!isCreate) return
        // #region config world
        console.log('create')
        this.physics.world.setBounds(0, 0, this.MAX_WIDTH, this.MAX_HEIGHT)
        // this.physics.world.gravity.y = 9.8
        // #endregion

        // #region config camera
        this.cameraGame = this.cameras.main
        this.cameraGame.setViewport(this.x, 0, this.CAMERA_WIDTH, this.CAMERA_HEIGHT)
        const JKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.J)
        const IKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.I)
        const LKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.L)
        const KKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.K)
        // #endregion

        // #region config controls
        const controlConfig = {
            camera: this.cameras.main,
            left: JKey,
            right: LKey,
            up: IKey,
            down: KKey,
            speed: 0.5,
        }
        this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig)
        // #endregion

        // #region config background
        this.background = this.add.image(0, 0, 'background-gun')
        this.background.setOrigin(0, 0)
        // #endregion

        // #region config tiled
        // this.map = this.make.tilemap({ key: 'tilemap' })

        // const tileSet = this.map.addTilesetImage(this.tiledMapConfig.tilesets[0].name)
        // const layer = this.map.createLayer(this.tiledMapConfig.layers[0].name, tileSet!)
        // layer?.setSkipCull(true)
        // #endregion
        this.isPlay = true
    }

    update(time: any, delta: any) {
        if (!this.isPlay) return
        this.controls.update(delta)
        // fixed camera static
        this.cameraGame!.scrollX = Phaser.Math.Clamp(
            this.cameraGame?.scrollX!,
            0,
            this.MAX_WIDTH - this.CAMERA_WIDTH,
        )
        this.cameraGame!.scrollY = Phaser.Math.Clamp(
            this.cameraGame?.scrollY!,
            0,
            this.MAX_HEIGHT - this.CAMERA_HEIGHT,
        )
    }
}

export default GunGame
