import { Stick } from '@/characters'
import { useMainStore } from '@/stores'
import '../gamePlay.interface'

const CONSTANTS = {
    background:
        'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/backgrounds/iopp1dd3m8rsghldcgdh.png',
}

class StairGame extends Phaser.Scene {
    // #region declarations
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
    private yourIndex: number | undefined
    // #endregion
    constructor() {
        super('stair-game')
        this.mainStore = useMainStore()
        this.CAMERA_WIDTH = ((this.mainStore.width * this.mainStore.zoom) / 24) * 6
        this.MARGIN_WIDTH = this.CAMERA_WIDTH / 2
        this.MARGIN_HEIGHT = this.mainStore.height / 2
        this.sticks = []
    }

    init({
        players,
        stairs,
        fileConfigStick,
    }: {
        players: Array<any>
        stairs: string
        fileConfigStick: string
    }) {
        this.mainStore = useMainStore()
        this.stairs = JSON.parse(stairs)
        players.forEach((player: any, index: number) => {
            this.yourIndex = index
            const stick = new Stick(
                this,
                index,
                'circleStick-' + index,
                0,
                this.MAX_HEIGHT - 100,
                fileConfigStick,
                0.5,
            )
            this.sticks.push(stick)
            // if (this.mainStore.player._id === player._id) {
            // }
        })
    }

    preload() {
        this.sticks.forEach((stick: Stick) => stick.preload())
        this.load.image('stairGame-background', CONSTANTS.background)
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
        this.physics.world.setBounds(0, 0, this.MAX_WIDTH, this.MAX_HEIGHT)
        this.physics.pause()
        // #endregion

        // #region config background
        this.background = this.add.image(0, 0, 'stairGame-background')
        this.background.setOrigin(0, 0)
        // #endregion

        // #region init stair
        this.stairs?.forEach((stair: IStair) => {
            const obj = this.add.image(stair.x, stair.y, stair.img)
            // obj.setStatic(true)

            obj.scaleX = stair.width / obj.width
            obj.scaleY = stair.height / obj.height

            this.staticGroup = this.add.group()
            this.staticGroup.add(obj)
        })

        // #endregion

        // #region init game object
        this.sticks.forEach((stick: Stick, index: number) => {
            stick.create()
            if (this.yourIndex === index) {
                stick.addEvent()
            }
        })
        this.receivingState()
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
    }

    async update() {
        this.sticks[this.yourIndex || 0].handleKeyEvent()
        this.sticks.forEach((stick: Stick, index: number) => {
            stick.update()
        })

        // #region init game'params, again
        this.cameraGame!.startFollow(
            this.sticks[this.yourIndex || 0].stickSprite!,
            true,
            this.CAMERA_V_X,
            this.CAMERA_V_Y,
        )
        // #endregion

        // #region fixed camera position
        this.cameraGame!.scrollX = Phaser.Math.Clamp(
            //Clamp = (value, min, max) => Math.max(min, Math.min(max, value))
            this.cameraGame?.scrollX!,
            0,
            this.MAX_WIDTH - this.CAMERA_WIDTH,
        )
        this.cameraGame!.scrollY = Phaser.Math.Clamp(
            this.cameraGame?.scrollY!,
            0,
            this.MAX_HEIGHT - this.MARGIN_HEIGHT * 2,
        )
        // #endregion
    }

    receivingState() {
        this.mainStore.getSocket.on('stick-keyboard-event', (data: any) => {
            // console.log(data)
            this.sticks.forEach((stick: Stick, index: number) => {
                if (data._id === this.mainStore.getPlayer._id) {
                    stick.updateData({ event: data.event })
                }
            })
            // this.updateData({ event: data.event, x: data.x, y: data.y })
        })
    }
}

export default StairGame
