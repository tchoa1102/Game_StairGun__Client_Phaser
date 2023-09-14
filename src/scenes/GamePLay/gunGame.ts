import FETCH from '@/services/fetchConfig.service'
import { useMainStore } from '@/stores'

class GunGame extends Phaser.Scene {
    // #region declare properties
    public MAX_WIDTH = 1480
    public MAX_HEIGHT = 1000
    public CAMERA_WIDTH: number
    public CAMERA_HEIGHT: number
    private MARGIN_WIDTH: number
    private MARGIN_HEIGHT: number
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
        this.MARGIN_WIDTH = this.CAMERA_WIDTH / 2
        this.MARGIN_HEIGHT = this.mainStore.height / 2
    }

    init({ tiledMapConfig }: { tiledMapConfig: any }) {
        console.log('init')
        this.tiledMapConfig = tiledMapConfig
    }

    preload() {
        console.log('pre')

        this.load.image('background-gun', this.tiledMapConfig.background)
        this.load.tilemapTiledJSON('tilemap', this.tiledMapConfig)
        this.load.image(this.tiledMapConfig.tilesets[0].name, this.tiledMapConfig.tilesets[0].image)
    }

    create() {
        // #region config world
        console.log('create')
        this.matter.world.setBounds(0, 0, this.MAX_WIDTH, this.MAX_HEIGHT)
        this.matter.world.setGravity(0, 9.8)
        // #endregion

        // #region config camera
        this.cameraGame = this.cameras.main
        this.cameraGame.setViewport(this.x, 0, this.CAMERA_WIDTH, this.CAMERA_HEIGHT)
        const cursors = this.input.keyboard!.createCursorKeys()
        // #endregion

        // #region config controls
        const controlConfig = {
            camera: this.cameras.main,
            left: cursors.shift && cursors.left,
            right: cursors.shift && cursors.right,
            up: cursors.shift && cursors.up,
            down: cursors.shift && cursors.down,
            speed: 0.5,
        }
        this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig)
        // #endregion

        // #region config background
        this.background = this.add.image(0, 0, 'background-gun')
        this.background.setOrigin(0, 0)
        // #endregion

        // #region config tiled
        this.map = this.make.tilemap({ key: 'tilemap' })

        const tileSet = this.map.addTilesetImage(this.tiledMapConfig.tilesets[0].name)
        const layer = this.map.createLayer('Tile Layer 1', tileSet!)
        layer?.setSkipCull(true)
        // #endregion
    }

    update(time: any, delta: any) {
        // this.controls.update(delta)
        // // fixed camera static
        // this.cameraGame!.scrollX = Phaser.Math.Clamp(
        //     this.cameraGame?.scrollX!,
        //     0,
        //     this.MAX_WIDTH - this.CAMERA_WIDTH,
        // )
        // this.cameraGame!.scrollY = Phaser.Math.Clamp(
        //     this.cameraGame?.scrollY!,
        //     0,
        //     this.MAX_HEIGHT - this.MARGIN_HEIGHT * 2,
        // )
    }
}

export default GunGame
