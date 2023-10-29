import CONSTANT_HOME from '@/scenes/Home/CONSTANT'
import { CardService } from '@/services'
import FETCH from '@/services/fetchConfig.service'
import { stickService } from '@/services/socket'
import { useMainStore } from '@/stores'
import type { ICard, ICardRes, IObject } from '@/util/interface/index.interface'

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
    public isPlay: boolean = false
    public x: number
    public eventListener: IEventListener = {}

    private mainStore: any
    private cameraGame: Phaser.Cameras.Scene2D.Camera | undefined
    private background: Phaser.GameObjects.Image | undefined
    private tiledMapConfig: any
    private map: Phaser.Tilemaps.Tilemap | undefined
    private controls: any
    private gunAngle: number = 0
    private graphicsFanShaped: Phaser.GameObjects.Graphics | undefined
    private graphicsLine: Phaser.GameObjects.Graphics | undefined
    private cH: number
    private r = 70
    private gunMidAngle: { x: number; y: number }
    private zeroGunAngle = -90

    private cardPlugins: Array<Phaser.GameObjects.Rectangle> = []
    private cards: Array<Phaser.GameObjects.Image> = []
    // #endregion
    constructor() {
        super(CONSTANTS.scene)
        this.mainStore = useMainStore()
        this.CAMERA_WIDTH = ((this.mainStore.width * this.mainStore.zoom) / 24) * 18
        this.x = ((this.mainStore.width * this.mainStore.zoom) / 24) * 6 + 1
        this.CAMERA_HEIGHT = this.mainStore.height * this.mainStore.zoom
        this.cH = this.mainStore.height - 150
        this.gunMidAngle = {
            x: 20 + this.r,
            y: this.cH + this.r,
        }
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
            console.log('Loading: ', key)
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
    }

    create() {
        ;(this.game.scene.getScene('game-play-scene') as any).loaded()
        this.createGameObject(true)
    }

    createGameObject(isCreate: boolean = true) {
        if (!isCreate) return
        const mainStore: any = useMainStore()
        // #region config world
        console.log('create')
        this.isPlay = true
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

        // #region load objects map
        this.createUIObjectsMap()
        // #endregion load objects map

        // #region create UI fight
        this.createUIFight()
        // #endregion create UI fight
        //
        this.listeningSocket()
        this.updateUIHearthLineGun(45)
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

    updateUIHearthLineGun(angle: number) {
        this.graphicsLine && this.graphicsLine.clear()
        this.gunAngle = angle
        this.graphicsLine = this.add.graphics()
        this.graphicsLine.fillStyle(0x000000, 1)
        this.graphicsLine.slice(
            this.gunMidAngle.x,
            this.gunMidAngle.y,
            this.r,
            Phaser.Math.DegToRad(this.zeroGunAngle + this.gunAngle - 0.5),
            Phaser.Math.DegToRad(this.zeroGunAngle + this.gunAngle + 0.5),
            false,
        )
        this.graphicsLine.fillPath()
        this.graphicsLine.setScrollFactor(0, 0)
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

    createUIFight(): void {
        // #region create card plugins
        const keyObjCardPlugins = ['z', 'x', 'c', 'v', 'b']
        for (let i = 0; i < 5; i++) {
            let y = 100 * (i + 1) - 50 * i

            const obj = this.add.rectangle(50, y, 30.5, 44, 0xffffff, 0.3).setScrollFactor(0, 0)
            const text = this.add
                .text(20, y, keyObjCardPlugins[i], {
                    color: '#fff',
                    fontSize: 16,
                })
                .setScrollFactor(0, 0)
            this.cardPlugins.push(obj)
        }
        // #endregion create card plugins

        // #region create create circle
        this.add.circle(20, this.cH, this.r, 0xffffff, 0.3).setOrigin(0).setScrollFactor(0, 0)
        this.add.circle(this.gunMidAngle.x, this.gunMidAngle.y, 4, 0xff00000).setScrollFactor(0, 0)
        this.add
            .text(this.gunMidAngle.x - 5, this.cH, '0', {
                color: '#fff',
                fontSize: '20px',
            })
            .setScrollFactor(0, 0)
        // #endregion create circle

        // #region create gun zone
        this.drawUIGunZone({ beginAngle: 0, endAngle: 90 })
        // #endregion create gun zone

        // #region create gun angle
        this.updateUIHearthLineGun(0)
        // #endregion create gun angle
    }

    createUIObjectsMap() {
        const objs: Array<IObject> = this.mainStore.getMatch!.objects
        objs.forEach((obj: IObject) => {
            this.add
                .image(JSON.parse(obj.location.x), JSON.parse(obj.location.y), obj.data._id)
                .setOrigin(0)
        })
    }

    // #region listening socket
    listeningSocket() {
        stickService.listeningUpdateCard((data: ICardRes) => {
            if (data.owner === this.mainStore.getPlayer._id) {
                const location = this.cardPlugins[this.cards.length]
                console.log('Is loaded?: ', this.textures.exists(data.card._id))
                const card = this.add.image(location.x, location.y, data.card._id).setOrigin(0.5)
                card.scaleX = location.width / card.width
                card.scaleY = location.height / card.height
                card.name = data._id
                this.cards.push(card)
            }
        })
    }
    // #endregion listening socket
}

export default GunGame
