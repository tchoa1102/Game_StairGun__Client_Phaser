import { Stick } from '@/characters'
import { useMainStore } from '@/stores'
import './gamePlay.interface'

class StairGame extends Phaser.Scene {
    public MAX_WIDTH = 1000
    public MAX_HEIGHT = 3500
    public staticGroup: Phaser.GameObjects.Group | undefined

    private CAMERA_WIDTH: number
    private MARGIN_WIDTH: number
    private MARGIN_HEIGHT: number
    private CAMERA_V_X = 0
    private CAMERA_V_Y = 0
    private cameraGame: Phaser.Cameras.Scene2D.Camera | undefined
    private mainStore: any
    private sticks: Array<Stick>
    private background: Phaser.GameObjects.Image | undefined
    private stairs: Array<IStair> | undefined
    constructor() {
        super('stairGame')
        this.mainStore = useMainStore()
        this.CAMERA_WIDTH = (this.mainStore.width * this.mainStore.zoom) / 3.7
        this.MARGIN_WIDTH = this.CAMERA_WIDTH / 2
        this.MARGIN_HEIGHT = this.mainStore.height / 2
        this.sticks = []
    }

    init({ stairs, fileConfigStick }: { stairs: string; fileConfigStick: string }) {
        this.stairs = JSON.parse(stairs)
        this.sticks[0] = new Stick(
            this,
            'circleStick',
            0,
            this.MAX_HEIGHT - 100,
            fileConfigStick,
            0.5,
        )
    }

    preload() {
        this.sticks.forEach((stick: Stick) => stick.preload())
        this.load.image(
            'background',
            'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/backgrounds/iopp1dd3m8rsghldcgdh.png',
        )
        const stairIsLoading: Array<string> = []
        this.stairs?.forEach((stair: IStair) => {
            const isLoaded = stairIsLoading.includes(stair.img)
            if (!isLoaded) {
                this.load.image(stair.img, stair.img)
            }
        })
    }

    create() {
        // #region config matter
        this.matter.world.setBounds(0, 0, this.MAX_WIDTH, this.MAX_HEIGHT)
        const marginTopRect = this.matter.add.rectangle(
            this.MAX_WIDTH / 2,
            1,
            this.MAX_WIDTH + 100,
            60,
        )
        marginTopRect.isStatic = true
        this.matter.world.setGravity(0, 9.8)
        // #endregion

        // #region config background
        this.background = this.add.image(0, 0, 'background')
        this.background.setOrigin(0, 0)
        // #endregion

        // #region init stair
        this.stairs?.forEach((stair: IStair) => {
            const obj = this.matter.add.image(stair.x, stair.y, stair.img)
            obj.setStatic(true)

            obj.scaleX = stair.width / obj.width
            obj.scaleY = stair.height / obj.height

            this.staticGroup = this.add.group()
            this.staticGroup.add(obj)
        })

        // #endregion

        // #region init game object
        this.sticks[0].create()
        // #endregion

        // #region config camera
        this.cameraGame = this.cameras.main
        this.cameraGame.setViewport(
            0,
            0,
            this.CAMERA_WIDTH,
            this.mainStore.height * this.mainStore.zoom,
        )
        // #endregion

        //
        this.matter.world.on('collisionstart', (e: any) => {})
    }

    update() {
        this.sticks[0].update()
        const x = this.sticks[0].stickSprite ? this.sticks[0].stickSprite.x : 0
        const y = this.sticks[0].stickSprite ? this.sticks[0].stickSprite.y : 0
        this.cameraGame!.startFollow(
            this.sticks[0].stickSprite!,
            true,
            this.CAMERA_V_X,
            this.CAMERA_V_Y,
        )
        this.cameraGame!.scrollX = Phaser.Math.Clamp(
            this.cameraGame?.scrollX!,
            0,
            this.MAX_WIDTH - this.CAMERA_WIDTH,
        )
        this.cameraGame!.scrollY = Phaser.Math.Clamp(
            this.cameraGame?.scrollY!,
            0,
            this.MAX_HEIGHT - this.MARGIN_HEIGHT * 2,
        )
        // var Clamp = function (value, min, max) {
        //     return Math.max(min, Math.min(max, value))
        // }
    }
}

export default StairGame
