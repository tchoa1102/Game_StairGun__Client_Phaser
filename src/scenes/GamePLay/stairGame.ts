import { Stick } from '@/characters'
import { useMainStore } from '@/stores'
import './gamePlay.interface'
const fileConfigCircleStick = JSON.stringify({
    width: 256,
    height: 441,
    src: 'src/assets/circle.stick.png',
    animation: {
        stand: {
            key: 'stand',
            frames: [
                {
                    frame: 'stand-0',
                    duration: 1,
                    flipX: false,
                },
                {
                    frame: 'stand-1',
                    duration: 1,
                    flipX: false,
                },
            ],
            frameRate: 10,
            repeat: -1,
        },
        runRight: {
            key: 'runRight',
            frames: [
                {
                    frame: 'run-0',
                    duration: 1,
                    flipX: false,
                },
                {
                    frame: 'run-1',
                    duration: 1,
                    flipX: false,
                },
                {
                    frame: 'run-2',
                    duration: 1,
                    flipX: false,
                },
                {
                    frame: 'run-3',
                    duration: 1,
                    flipX: false,
                },
            ],
            frameRate: 10,
            repeat: -1,
        },
        runLeft: {
            key: 'runLeft',
            frames: [
                {
                    frame: 'run-0',
                    duration: 1,
                    flipX: true,
                },
                {
                    frame: 'run-1',
                    duration: 1,
                    flipX: true,
                },
                {
                    frame: 'run-2',
                    duration: 1,
                    flipX: true,
                },
                {
                    frame: 'run-3',
                    duration: 1,
                    flipX: true,
                },
            ],
            frameRate: 10,
            repeat: -1,
        },
        jumpRight: {
            key: 'jumpRight',
            frames: [
                {
                    frame: 'jump-0',
                    duration: 1,
                    flipX: false,
                },
            ],
            frameRate: 10,
            repeat: 0,
        },
        jumpLeft: {
            key: 'jumpLeft',
            frames: [
                {
                    frame: 'jump-0',
                    duration: 1,
                    flipX: true,
                },
            ],
            frameRate: 10,
            repeat: 0,
        },
    },
})

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
    private circleStick: Stick
    private background: Phaser.GameObjects.Image | undefined
    private stairs: Array<IStair> | undefined
    constructor(stairs: string) {
        super('stairGame')
        this.mainStore = useMainStore()
        this.CAMERA_WIDTH = (this.mainStore.width * this.mainStore.zoom) / 3.7
        this.MARGIN_WIDTH = this.CAMERA_WIDTH / 2
        this.MARGIN_HEIGHT = this.mainStore.height / 2

        this.circleStick = new Stick(
            this,
            'circleStick',
            0,
            this.MAX_HEIGHT - 100,
            fileConfigCircleStick,
            0.5,
        )
    }

    init({ stairs }: { stairs: string }) {
        const data = JSON.parse(stairs).data
        this.stairs = data
    }

    preload() {
        this.circleStick.preload()
        this.load.image(
            'background',
            'src/assets/backgorund-fusion-edit-through-increaseShadow.png',
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
        this.circleStick.create()
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
        this.circleStick.update()
        // console.log(this.cameraGame!.x);
        const x = this.circleStick.stickSprite ? this.circleStick.stickSprite.x : 0
        const y = this.circleStick.stickSprite ? this.circleStick.stickSprite.y : 0
        this.cameraGame!.startFollow(
            this.circleStick.stickSprite!,
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
