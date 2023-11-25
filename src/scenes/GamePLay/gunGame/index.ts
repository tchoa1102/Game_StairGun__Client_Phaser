import Person from '@/characters/person'
import CONSTANT_HOME from '@/scenes/Home/CONSTANT'
import { CardService } from '@/services/http-https'
import FETCH from '@/services/http-https/fetchConfig.service'
import { gunService, stickService } from '@/services/socket'
import { useMainStore } from '@/stores'
import type {
    ICard,
    ICardRes,
    IObject,
    IPlayerOnMatch,
    IUpdateLocationGunGame,
} from '@/util/interface/index.interface'

const CONSTANTS = {
    scene: {
        key: CONSTANT_HOME.key.gunGame,
    },
    background: {
        key: 'background-gun',
    },
}

class GunGame extends Phaser.Scene {
    // #region declare properties
    public MAX_WIDTH = 1480
    public MAX_HEIGHT = 1000
    public CAMERA_WIDTH: number
    public CAMERA_HEIGHT: number
    public cameraGame: Phaser.Cameras.Scene2D.Camera | undefined

    public x: number
    public isPlay: boolean = false
    public eventListener: IEventListener = {}

    private mainStore: any
    private controls: Phaser.Cameras.Controls.FixedKeyControl | undefined
    // private background: Phaser.GameObjects.Image | undefined
    // private tiledMapConfig: any
    // private map: Phaser.Tilemaps.Tilemap | undefined

    // #region gun zone
    private gunAngle: number = 0
    private graphicsFanShaped: Phaser.GameObjects.Graphics | undefined
    private graphicsLine: Phaser.GameObjects.Graphics | undefined
    private __xGunAngleZone: number = 20
    private __yGunAngleZone: number
    private r = 70
    private gunMidAngle: { x: number; y: number }
    private zeroGunAngle = -90
    // #endregion gun zone

    private cardPlugins: Array<Phaser.GameObjects.Rectangle> = []
    private cards: Array<Phaser.GameObjects.Image> = []
    private objsMap: Array<Phaser.GameObjects.Image> = []

    private playerPersons: Array<Person> = []
    // #endregion
    constructor() {
        super(CONSTANTS.scene)
        this.mainStore = useMainStore()
        this.CAMERA_WIDTH = (this.mainStore.getWidth / 24) * 18
        this.x = (this.mainStore.getWidth / 24) * 6 + 1
        this.CAMERA_HEIGHT = this.mainStore.getHeight
        this.__yGunAngleZone = this.mainStore.getHeight - 150
        this.gunMidAngle = {
            x: this.__xGunAngleZone + this.r,
            y: this.__yGunAngleZone + this.r,
        }

        const players = this.mainStore.getMatch.players
        players.forEach((player: IPlayerOnMatch, index: number) => {
            const person = new Person(
                this,
                index,
                player.target.name!,
                player.mainGame.bottomLeft.x,
                Math.abs(player.mainGame.bottomLeft.y),
                '{}',
                1,
            )
            this.playerPersons.push(person)
        })
    }

    init() {}

    preload() {
        this.load.image(CONSTANTS.background.key, this.mainStore!.getMatch.backgroundGunGame)

        CardService.getAll().then((allCard: Array<ICard>) => {
            console.log('All card: ', allCard)
            for (const card of allCard) {
                this.load.image(card._id, card.src)
            }
        })
        // #region load map
        console.log('GunGame', this.mainStore!.getMatch)
        const imgObjectsLoad = this.mainStore!.getMatch.objects.reduce(
            (total: { [_id: string]: string }, e: IObject) => {
                if (!total.hasOwnProperty(e.data._id)) total[e.data._id] = e.data.src
                return total
            },
            {},
        )

        const keysLoadObject: Array<string> = Object.keys(imgObjectsLoad)
        for (const key of keysLoadObject) {
            // console.log('Loading: ', key)
            this.load.image(key, imgObjectsLoad[key])
        }
        // const mapConfigs = this.mainStore!.getMatch.mapConfigs
        // const mapsDataJSON = this.mainStore!.getMatch.mapDataJSON
        // for (const key in this.mainStore!.getMatch.mapDataJSON) {
        //     if (Object.prototype.hasOwnProperty.call(this.mainStore!.getMatch.mapDataJSON, key)) {
        //         const config = this.mainStore!.getMatch.mapDataJSON[key]
        //         this.load.image(config.tilesets[0].name, config.tilesets[0].image)
        //         this.load.tilemapTiledJSON(key, mapsDataJSON[key])
        //         this.keysTileMap.push(key)
        //     }
        // }
        // #endregion load map

        this.playerPersons.forEach((p) => p.preload())
    }

    create() {
        // ;(this.game.scene.getScene('game-play-scene') as any).loaded()
        this.createGameObject(true)
        // const p = [
        //     {
        //         x: 0,
        //         y: 54.5,
        //     },
        //     {
        //         x: 45,
        //         y: 22,
        //     },
        //     {
        //         x: 90.5,
        //         y: 0,
        //     },
        //     {
        //         x: 152.5,
        //         y: 0,
        //     },
        //     {
        //         x: 199.5,
        //         y: 15,
        //     },
        //     {
        //         x: 185.5,
        //         y: 97.5,
        //     },
        //     {
        //         x: 134.5,
        //         y: 140,
        //     },
        //     {
        //         x: 9.5,
        //         y: 140,
        //     },
        // ]
        // p.forEach((i) => {
        //     this.add.circle(i.x + 100, i.y + 400, 3, 0x000000)
        //     this.add.text(i.x + 100, i.y + 403, `(${i.x + 100}, ${i.y + 400})`, {
        //         fontSize: '16px',
        //     })
        // })
    }

    createGameObject(isCreate: boolean = true) {
        if (!isCreate) return
        console.log('create')
        this.isPlay = true
        // #region config
        // #region config world
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
        const controlConfig: Phaser.Types.Cameras.Controls.FixedKeyControlConfig = {
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
        this.add.image(0, 0, CONSTANTS.background.key).setOrigin(0, 0)

        // #endregion

        // #region config tiled => very lags
        // const mapConfigs = this.mainStore!.getMatch.mapConfigs
        // const mapsDataJSON = this.mainStore!.getMatch.mapDataJSON
        // for (let i = 0; i < mapConfigs.length; i++) {
        //     const tileMapConfig = mapsDataJSON[mapConfigs[i].data.name]
        //     const map: Phaser.Tilemaps.Tilemap = this.make.tilemap({ key: this.keysTileMap[0] })
        //     const tileSet: Phaser.Tilemaps.Tileset = map.addTilesetImage(
        //         tileMapConfig.tilesets[0].name,
        //     )!
        //     const layer: Phaser.Tilemaps.TilemapLayer = map
        //         .createLayer(
        //             tileMapConfig.layers[0].name,
        //             tileSet!,
        //             mapConfigs[i].location.x,
        //             mapConfigs[i].location.y,
        //         )
        //         ?.setSkipCull(true)!
        //     // this.objectsMap.push(layer!)
        // }
        // #endregion
        // #endregion config

        // #region draw
        // #region load objects map
        this.drawUIObjectsMap()
        // #endregion load objects map

        // #region create UI fight
        this.drawUIFight()
        // #endregion create UI fight
        // #endregion draw
        this.addEventAngleOfFireZone()

        // #region create person
        this.playerPersons.forEach((p) => p.create())
        // #endregion create person

        //
        this.listeningSocket()
    }

    update(time: any, delta: any) {
        if (!this.isPlay) return
        this.handleKeyAngleOfFire()
        this.controls && this.controls.update(delta)
        this.playerPersons.forEach((p) => p.update(time, delta))
        // fixed camera static
        this.fixedCamera()
    }

    fixedCamera() {
        if (this.cameraGame) {
            this.cameraGame.scrollX = Math.min(
                Math.max(this.cameraGame.scrollX, 0),
                this.MAX_WIDTH - this.CAMERA_WIDTH,
            )

            this.cameraGame.scrollY = Math.min(
                Math.max(this.cameraGame.scrollY, 0),
                this.MAX_HEIGHT - this.CAMERA_HEIGHT,
            )
        }
    }

    drawUIFight(): void {
        // #region create card plugins
        this.drawUICardPlugin()
        // #endregion create card plugins

        // #region create circle gun angle zone
        this.add
            .circle(this.__xGunAngleZone, this.__yGunAngleZone, this.r, 0xffffff, 0.3)
            .setOrigin(0)
            .setScrollFactor(0, 0)
        this.add.circle(this.gunMidAngle.x, this.gunMidAngle.y, 2, 0xff00000).setScrollFactor(0, 0)
        this.add
            .text(this.gunMidAngle.x - 5.8, this.__yGunAngleZone, '0', {
                color: '#fff',
                fontSize: '20px',
            })
            .setScrollFactor(0, 0)
        // #endregion create circle gun angle zone

        // #region create gun zone
        this.drawUIGunZone({ beginAngle: 0, endAngle: 90 })
        // #endregion create gun zone

        // #region create gun angle
        this.updateGunAngleAndRedrawUIHearthLineGun(0)
        // #endregion create gun angle
    }

    drawUIGunZone({ beginAngle, endAngle }: { beginAngle: number; endAngle: number }) {
        this.graphicsFanShaped && this.graphicsFanShaped.clear()
        const graphicsFanShaped = this.add.graphics()
        graphicsFanShaped.fillStyle(0x005dff, 0.3)
        graphicsFanShaped.slice(
            this.gunMidAngle.x,
            this.gunMidAngle.y,
            this.r,
            Phaser.Math.DegToRad(this.zeroGunAngle + beginAngle),
            Phaser.Math.DegToRad(this.zeroGunAngle + endAngle),
            false,
        )
        graphicsFanShaped.fillPath()
        graphicsFanShaped.setScrollFactor(0, 0)
    }

    drawUICardPlugin() {
        this.addEventCard()
        const keyObjCardPlugins = [
            getChar(this.eventListener?.cardNumberOne!),
            getChar(this.eventListener?.cardNumberTwo!),
            getChar(this.eventListener?.cardNumberThree!),
            getChar(this.eventListener?.cardNumberFour!),
            getChar(this.eventListener?.cardNumberFive!),
        ]
        for (let i = 0; i < 5; i++) {
            let y = 100 * (i + 1) - 50 * i

            const obj = this.add.rectangle(50, y, 30.5, 44, 0xffffff, 0.3).setScrollFactor(0, 0)
            const text = this.add
                .text(20, y, keyObjCardPlugins[i], {
                    color: '#ffffff70',
                    fontSize: 16,
                })
                .setScrollFactor(0, 0)
            this.cardPlugins.push(obj)
        }

        function getChar(key: Phaser.Input.Keyboard.Key): string {
            return String.fromCharCode(key.keyCode)
        }
    }

    drawUIObjectsMap() {
        const objs: Array<IObject> = this.mainStore.getMatch!.objects
        objs.forEach((obj: IObject) => {
            const objMap = this.add
                .image(obj.location.x, Math.abs(obj.location.y), obj.data._id)
                .setOrigin(0)
            this.objsMap.push(objMap)
        })
    }

    // #region func update state gun game
    clearObjMap(location: { x: number; y: number }): void {
        const objIndex = this.objsMap.findIndex(
            (obj) => obj.x === location.x && obj.y === location.y,
        )
        if (objIndex === -1) return
        const objMap = this.objsMap.splice(objIndex, 1)[0]
        objMap.destroy()
    }

    updateGunAngleAndRedrawUIHearthLineGun(angle: number) {
        this.graphicsLine && this.graphicsLine.clear()
        this.gunAngle = angle
        this.graphicsLine = this.add.graphics()
        this.graphicsLine.fillStyle(0x000000, 1)
        this.graphicsLine.slice(
            this.gunMidAngle.x,
            this.gunMidAngle.y,
            this.r,
            Phaser.Math.DegToRad(this.zeroGunAngle + this.gunAngle - 1),
            Phaser.Math.DegToRad(this.zeroGunAngle + this.gunAngle + 1),
            false,
        )
        this.graphicsLine.fillPath()
        this.graphicsLine.setScrollFactor(0, 0)
    }
    // #region func update state gun game

    // #region handle events
    addEventCard() {
        this.eventListener.cardNumberOne = this.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.Z,
        )
        this.eventListener.cardNumberTwo = this.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.W,
        )
        this.eventListener.cardNumberThree = this.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.C,
        )
        this.eventListener.cardNumberFour = this.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.V,
        )
        this.eventListener.cardNumberFive = this.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.B,
        )
    }
    handleKeyCardEvent() {}
    addEventAngleOfFireZone() {
        this.eventListener.increaseAngle = this.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.UP,
        )
        this.eventListener.decreaseAngle = this.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.DOWN,
        )
    }
    handleKeyAngleOfFire() {
        const isIncreaseKeyDown: boolean = this.eventListener.increaseAngle?.isDown || false
        const isDecreaseKeyDown: boolean = this.eventListener.decreaseAngle?.isDown || false
        const angleDelta = 0.2

        if (isIncreaseKeyDown) {
            this.updateGunAngleAndRedrawUIHearthLineGun(this.gunAngle - angleDelta)
        }

        if (isDecreaseKeyDown) {
            this.updateGunAngleAndRedrawUIHearthLineGun(this.gunAngle + angleDelta)
        }
    }
    handleDisplayCardPickUp(data: ICardRes) {
        if (data.owner === this.mainStore.getPlayer._id) {
            const displacer = () => {
                const isExist = this.cards.findIndex((card) => card.name === data._id)
                if (isExist !== -1) return
                const pluginCard = this.cardPlugins.find((plugin) => plugin.name.length === 0)
                if (!pluginCard) return
                pluginCard.name = data._id
                // console.log('Is loaded?: ', this.textures.exists(data.card._id))
                const card = this.add
                    .image(pluginCard.x, pluginCard.y, data.card._id)
                    .setOrigin(0.5)
                card.scaleX = pluginCard.width / card.width
                card.scaleY = pluginCard.height / card.height
                card.name = data._id
                this.cards.push(card)
            }
            const time = JSON.parse(data.time)
            if (time === 0) {
                displacer()
                return
            }
            const timeForTimeout = time - new Date().getTime()
            const timeOut = setTimeout(displacer, timeForTimeout > 0 ? timeForTimeout : 0)
        }
    }
    handleDestroyCard(id: string) {
        const cardIndex = this.cards.findIndex((card) => card.name === id)
        if (cardIndex === -1) return
        const card = this.cards.splice(cardIndex, 1)[0]
        card.destroy()
        const pluginCard = this.cardPlugins.find((plugin) => plugin.name === id)
        if (!pluginCard) return
        pluginCard.name = ''
    }
    // #endregion handle events

    // #region listening socket
    listeningSocket() {
        stickService.listeningUpdateCard((data: ICardRes) => {
            this.handleDisplayCardPickUp(data)
        })

        gunService.listeningUpdateLocation((data: IUpdateLocationGunGame) => {
            console.log('Data update location: ', data)
            const pPersonIndex = this.playerPersons.findIndex(
                (pP) => pP.thisPlayer.target._id === data._id,
            )
            if (pPersonIndex === -1) return
            const pPerson = this.playerPersons[pPersonIndex]
            pPerson.updateData(data)
            if (!data.isLive)
                setTimeout(() => {
                    console.log('Player ', data._id, ' is not alive')
                    pPerson.destroy()
                    this.playerPersons.splice(pPersonIndex, 1)
                }, 5000)
        })
    }
    // #endregion listening socket
}

export default GunGame
