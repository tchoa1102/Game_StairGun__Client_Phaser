import { Stick } from '@/characters'
import { useMainStore } from '@/stores'
import '../gamePlay.interface'
import type { ICardOnMatch, ICardRes, IPlayerOnMatch } from '@/util/interface/index.interface'
import FETCH from '@/services/fetchConfig.service'
import { stickService } from '@/services/socket'
import CONSTANT_HOME from '@/scenes/Home/CONSTANT'

const CONSTANTS = {
    scene: {
        key: CONSTANT_HOME.key.stairGame,
    },
    background: {
        key: 'stairGame-background',
        src: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/backgrounds/iopp1dd3m8rsghldcgdh.png',
    },
    cardBack: {
        key: 'stairGame-card-back',
        src: 'src/assets/card-back.png',
        width: 30.5,
        height: 44,
    },
}

interface IStairGameReceivingData {
    players: Array<IPlayerOnMatch>
    stairs: string
    configStick: IStickAnimationConfig
}

class StairGame extends Phaser.Scene {
    // #region declarations
    public MAX_WIDTH = 1000
    public MAX_HEIGHT = 3500
    public isPlay = false
    public staticGroup: Phaser.GameObjects.Group | undefined

    private CAMERA_WIDTH: number
    private CAMERA_HEIGHT: number
    private MARGIN_WIDTH: number
    private MARGIN_HEIGHT: number
    private CAMERA_V_X = 0
    private CAMERA_V_Y = 0
    private cameraGame: Phaser.Cameras.Scene2D.Camera | undefined
    private mainStore: any
    private sticks: Array<Stick>
    private background: Phaser.GameObjects.Image | undefined
    private yourPosition: number = 0
    private yourIndex: number = 0
    private players: Array<IPlayerOnMatch> | undefined

    private cardsObj: Array<Phaser.GameObjects.Image> = []
    // #endregion
    constructor() {
        super(CONSTANTS.scene)
        this.mainStore = useMainStore()
        this.CAMERA_WIDTH = ((this.mainStore.width * this.mainStore.zoom) / 24) * 6
        this.CAMERA_HEIGHT = this.mainStore.height * this.mainStore.zoom
        this.MARGIN_WIDTH = this.CAMERA_WIDTH / 2
        this.MARGIN_HEIGHT = this.mainStore.height / 2
        this.sticks = []
    }

    init(data: IStairGameReceivingData) {
        // this.stairs = JSON.parse(data.stairs)
        const mainStore: any = useMainStore()
        this.players = data.players
        console.log('Players received for stairGame: ', data.players)

        // const index = 0
        // const player = this.players[index]
        this.players!.forEach((player: IPlayerOnMatch, index: number) => {
            // console.log(
            //     'Location: ',
            //     Number.parseFloat(player.stairGame.x),
            //     ', ',
            //     Number.parseFloat(player.stairGame.y),
            // )
            if (player.target._id === this.mainStore.getPlayer._id) {
                this.yourPosition = player.position
                this.yourIndex = index
            }
            const stick = new Stick(
                this,
                player.position,
                'circleStick-' + player.position,
                Number.parseFloat(player.stairGame.x),
                Number.parseFloat(player.stairGame.y),
                mainStore.getMatch.stickConfig,
                0.5,
            )
            this.sticks.push(stick)
        })
    }

    preload() {
        const mainStore: any = useMainStore()
        this.sticks.forEach((stick: Stick) => stick.preload())

        this.load.image(CONSTANTS.background.key, CONSTANTS.background.src)
        const stairIsLoading: Array<string> = []
        mainStore.getMatch.stairs?.forEach((stair: IStair) => {
            const isLoaded = stairIsLoading.includes(stair.img)
            if (!isLoaded) {
                this.load.image(stair.img, stair.img)
            }
        })

        this.load.image(CONSTANTS.cardBack.key, CONSTANTS.cardBack.src)
    }

    create(data: IStairGameReceivingData) {
        // ;(this.game.scene.getScene('game-play-scene') as any).loaded()
        this.createGameObject(true)
    }

    createGameObject(isCreate: boolean = true) {
        if (!isCreate) return
        console.log('%cCreate', 'color: pink; font-size: 22px')
        const mainStore: any = useMainStore()

        // #region config matter
        this.physics.world.setBounds(0, 0, this.MAX_WIDTH, this.MAX_HEIGHT)
        this.physics.pause()
        // #endregion

        // #region config background
        this.background = this.add.image(0, 0, CONSTANTS.background.key)
        this.background.setOrigin(0, 0)
        // #endregion

        // #region init stair and card
        mainStore.getMatch.stairs?.forEach((stair: IStair) => {
            const obj = this.add.image(stair.x, stair.y, stair.img).setOrigin(0)

            obj.scaleX = stair.width / obj.width
            obj.scaleY = stair.height / obj.height

            this.staticGroup = this.add.group()
            // const text = this.add.text(
            //     stair.x,
            //     stair.y,
            //     `(${Math.floor(stair.x)}, ${Math.floor(stair.y)}, ${Math.floor(stair.width)}, ${
            //         stair.height
            //     })`,
            //     { color: 'red', backgroundColor: '#fff' },
            // )
            this.staticGroup.add(obj)
        })

        mainStore.getMatch.cards.forEach((card: ICardOnMatch) => {
            const obj = this.add
                .image(JSON.parse(card.x), JSON.parse(card.y), CONSTANTS.cardBack.key)
                .setOrigin(0, 1)
            obj.setScale(
                CONSTANTS.cardBack.width / obj.width,
                CONSTANTS.cardBack.height / obj.height,
            )
            obj.name = card._id
            // console.log(obj.name)
            // const text = this.add.text(
            //     JSON.parse(card.x),
            //     JSON.parse(card.y),
            //     `(${Math.floor(JSON.parse(card.x))}, ${Math.floor(JSON.parse(card.y))})`,
            //     { color: 'red', backgroundColor: '#fff' },
            // )

            this.cardsObj.push(obj)
            // card._id === '65316ff94b30d349bdeb8817' && console.log(card.y)
        })

        // #endregion init stair and card

        // #region init game object
        this.sticks.forEach((stick: Stick, index: number) => {
            stick.create()
            if (this.yourIndex === index) {
                // console.log(index)

                stick.addEvent()
            }
        })
        this.receivingState()
        // #endregion

        // #region config camera
        this.cameraGame = this.cameras.main
        this.cameraGame.setViewport(0, 0, this.CAMERA_WIDTH, this.CAMERA_HEIGHT)
        // #endregion

        this.isPlay = true
    }

    update(time: any, delta: any) {
        if (!this.isPlay) return
        // console.log(this.yourIndex!)
        this.sticks[this.yourIndex].handleKeyEvent()
        this.sticks.forEach((stick: Stick, index: number) => {
            stick.update(time, delta)
        })

        // #region init game'params, again
        this.cameraGame!.startFollow(
            this.sticks[this.yourIndex].character!,
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
        stickService.listeningAnimation((data: any) => {
            // console.log(data)
            const index = this.players?.findIndex((p, index) => p.target._id === data._id) || 0
            this.sticks[index].updateData({ event: data.event, x: data.x, y: data.y })
            // this.updateData({ event: data.event, x: data.x, y: data.y })
        })
        stickService.listeningUpdateCard((data: ICardRes) => {
            this.updateCardState(data._id, data.owner, JSON.parse(data.time))
        })
    }

    updateCardState(_id: string, owner: string, time: number): void {
        const mainStore: any = useMainStore()
        const cardsPickUp = mainStore.getMatch.cardsPickUp || {}
        const timeOut = setTimeout(() => {
            console.log('Destroy')
            const card = this.cardsObj.find((c: Phaser.GameObjects.Image) => c.name === _id)
            card?.destroy()
            this.cardsObj = this.cardsObj.reduce(
                (newArray: Array<Phaser.GameObjects.Image>, card: Phaser.GameObjects.Image) => {
                    if (card.name !== _id) newArray.push(card)

                    return newArray
                },
                [],
            )
            mainStore.getMatch.cards.forEach((card: ICardOnMatch) => {
                if (card._id === _id) {
                    card.isEnable = false
                }
            })
        }, time - new Date().getTime())

        if (Object.prototype.hasOwnProperty.call(cardsPickUp, timeOut)) {
            clearTimeout(cardsPickUp[_id])
            return
        }
        cardsPickUp[_id] = timeOut
    }
}

export default StairGame
