import Person from '@/characters/person'
import CONSTANT_HOME from '@/scenes/Home/CONSTANT'
import { CardService } from '@/services/http-https'
import FETCH from '@/services/http-https/fetchConfig.service'
import { gunService, stickService } from '@/services/socket'
import { useMainStore } from '@/stores'
import type {
    ICard,
    ICardOnMatch,
    ICardRes,
    IChangeTurn,
    IGameEnd,
    IGunRes,
    IObject,
    IPlayerOnMatch,
    IUpdateLocationGunGame,
    IUseCardRes,
} from '@/util/interface/index.interface'

const CONSTANTS = {
    scene: {
        key: CONSTANT_HOME.key.gunGame,
    },
    background: {
        key: 'background-gun',
    },
    velocity: {
        background: 'src/assets/img/velocity_background.png',
        shape: 'src/assets/img/velocity_status.png',
    },
    wind: 'src/assets/img/wind-flow-sheet.png',
    skills: {
        percent10: 'src/assets/img/skill-10.png',
        percent20: 'src/assets/img/skill-20.png',
        percent30: 'src/assets/img/skill-30.png',
        percent50: 'src/assets/img/skill-50.png',
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
    public isPlay: boolean = true
    public eventListener: IEventListener = {}

    private mainStore: any
    private controls: Phaser.Cameras.Controls.FixedKeyControl | undefined
    // private background: Phaser.GameObjects.Image | undefined
    // private tiledMapConfig: any
    // private map: Phaser.Tilemaps.Tilemap | undefined

    private turnerObj: Phaser.GameObjects.Text | undefined
    // #region gun zone
    private gunAngle: number = 0
    private gunAngleText: Phaser.GameObjects.Text | undefined
    private graphicsFanShaped: Phaser.GameObjects.Graphics | undefined
    private graphicsLine: Phaser.GameObjects.Graphics | undefined
    private __xGunAngleZone: number = 20
    private __yGunAngleZone: number
    private r = 70
    private gunMidAngle: { x: number; y: number }
    private zeroGunAngle = -90
    // #endregion gun zone

    // #region velocity
    private velocity: number = 0
    private velocity_interval: number = 0
    private velocityShape: Phaser.GameObjects.Image | undefined
    // #endregion velocity

    // #region wind force
    private windForceObj: Phaser.GameObjects.Sprite | undefined
    private windForceValueObj: Phaser.GameObjects.Text | undefined
    // #endregion wind force

    // #region STA bar
    private graphicSTABar: Phaser.GameObjects.Graphics | undefined
    // #endregion STA bar

    // #region phase time
    private phaseTime: Phaser.GameObjects.Text | undefined
    private phaseTimeOut: number = 0
    // #endregion phase time

    // run flag
    // false -> true => change battle phase, true -> false => change end battle phase, handle bullet and damage
    public isBattlePhase: boolean = false
    public isMainPhase: boolean = false

    private cardPluginContainer: Phaser.GameObjects.Container | undefined
    private cardPlugins: Array<Phaser.GameObjects.Rectangle> = []
    private cards: Array<Phaser.GameObjects.Image> = []
    private objsMap: Array<Phaser.GameObjects.Image> = []

    private skillContainer: Phaser.GameObjects.Container | undefined

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
            console.log('Person: ', person.thisPlayer.target._id, index)
        })
    }

    init() {}

    preload() {
        this.load.image(CONSTANTS.background.key, this.mainStore!.getMatch.backgroundGunGame)
        this.load.image(CONSTANTS.velocity.background, CONSTANTS.velocity.background)
        this.load.image(CONSTANTS.velocity.shape, CONSTANTS.velocity.shape)
        // this.load.image(CONSTANTS.wind.key, CONSTANTS.wind.src)
        this.load.spritesheet(CONSTANTS.wind, CONSTANTS.wind, {
            frameWidth: 60,
            frameHeight: 20,
        })
        const skills: any = CONSTANTS.skills
        Object.keys(skills).forEach((key) => {
            console.log('Loading: ', skills[key])
            this.load.image(skills[key], skills[key])
        })

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
                if (e.data?._id) {
                    if (!total.hasOwnProperty(e.data._id)) {
                        total[e.data._id] = e.data.src
                    }
                }
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
        ;(this.game.scene.getScene('game-play-scene') as any).loaded()
        this.createGameObject(false)
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
        this.drawVelocityShape()
        // #endregion draw
        this.addEventAngleOfFireZone()
        this.addEventBattle()
        this.addEventCard()
        this.addEventSkill()
        // #region create UI fight
        this.drawUIFight()
        // #endregion create UI fight
        // #region load objects map
        this.drawUIObjectsMap()
        // #endregion load objects map
        // #region create card plugins
        this.drawUICardPlugin()
        // #endregion create card plugins
        this.turnerObj = this.add
            .text(10, 10, '', {
                fontSize: '16px',
                color: '#00cd8b',
                backgroundColor: '#eeefff40',
                padding: { x: 4, y: 6 },
            })
            .setOrigin(0)
        const turner: IPlayerOnMatch | undefined = this.mainStore.getMatch.players.find(
            (p: IPlayerOnMatch) => p.target._id === this.mainStore.getMatch.turner,
        )
        if (turner) {
            this.updateTurnerName(turner.target.name)
        }

        // #region create person
        this.playerPersons.forEach((p) => p.create())
        // #endregion create person

        //#region register
        // this.mainStore.getWatch.turner.push(this.clearWhenChangeTurn.bind(this))
        this.listeningSocket()
        //#endregion register
    }

    update(time: any, delta: any) {
        if (!this.isPlay) return
        this.handleKeyCardEvent()
        this.handleKeyAngleOfFire()
        this.handleKeyChangeBattleFlag()
        this.handleKeyEventSkill()
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
        // #region create circle gun angle zone
        this.add
            .circle(this.__xGunAngleZone, this.__yGunAngleZone, this.r, 0xffffff, 0.3)
            .setOrigin(0)
            .setScrollFactor(0, 0)
        this.add.circle(this.gunMidAngle.x, this.gunMidAngle.y, 2, 0xff00000).setScrollFactor(0, 0)
        this.gunAngleText = this.add
            .text(this.gunMidAngle.x - 5.8, this.__yGunAngleZone, this.gunAngle.toString(), {
                color: '#fff',
                fontSize: '20px',
            })
            .setScrollFactor(0, 0)
            .setOrigin(0.5)
        // #endregion create circle gun angle zone

        // #region create gun zone
        // this.drawUIGunZone({ beginAngle: 0, endAngle: 90 })
        // #endregion create gun zone

        // #region create gun angle
        this.updateGunAngleAndRedrawUIHearthLineGun(0)
        // #endregion create gun angle

        // #region create wind
        this.windForceObj = this.add
            .sprite(this.CAMERA_WIDTH / 2, 20, CONSTANTS.wind)
            .setScrollFactor(0)
        this.anims.create({
            key: CONSTANTS.wind + '--animation',
            frames: this.anims.generateFrameNumbers(CONSTANTS.wind, {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        })
        this.windForceObj.anims.play(CONSTANTS.wind + '--animation')
        this.windForceValueObj = this.add
            .text(this.CAMERA_WIDTH / 2, 30, this.mainStore.getMatch.windForce + '', {
                fontSize: '16px',
                color: '#fff',
            })
            .setScrollFactor(0)
        this.changeWindForce(this.mainStore.getMatch.windForce)
        // #endregion create wind

        // #region time phase
        this.phaseTime = this.add.text(this.CAMERA_WIDTH / 2, 60, '', {
            fontSize: '90px',
            fontStyle: 'Bold',
            color: '#ff0000',
            strokeThickness: 1,
            stroke: '#000',
            shadow: {
                blur: 4,
                color: '#000',
                fill: true,
                offsetX: -1,
                offsetY: 3,
            },
        })
        if (this.mainStore.getMatch.turner === this.mainStore.getPlayer._id) {
            this.updateTimePhase(10)
        }
        // #endregion time phase

        // #region create skills
        this.drawUISkill()
        // #endregion create skills
        if (this.velocityShape) {
            const graphicSTAShadow = this.add.graphics()
            graphicSTAShadow.fillStyle(0x000000, 0.8)
            graphicSTAShadow.fillRoundedRect(
                this.CAMERA_WIDTH / 2 - 298,
                this.gunMidAngle.y - 50,
                150,
                20,
                10,
            )
            const text = this.add
                .text(this.CAMERA_WIDTH / 2 - 238, this.gunMidAngle.y - 48, 'STA', {
                    fontSize: '16px',
                    fontStyle: 'bold',
                    color: '#fff',
                })
                .setDepth(1)
        }
        this.drawUIForceSTABar(this.mainStore.getPlayer.STA)
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
        const keyObjCardPlugins = [
            getChar(this.eventListener?.cardNumberOne!),
            getChar(this.eventListener?.cardNumberTwo!),
            getChar(this.eventListener?.cardNumberThree!),
            getChar(this.eventListener?.cardNumberFour!),
            getChar(this.eventListener?.cardNumberFive!),
        ]
        this.cardPluginContainer = this.add.container(50, 200, []).setScrollFactor(0)
        for (let i = 0; i < 5; i++) {
            let y = 50 * i

            const obj = this.add.rectangle(0, y, 30.5, 44, 0xffffff, 0.3)
            const text = this.add.text(-30, y, keyObjCardPlugins[i], {
                color: '#ffffff70',
                fontSize: 16,
            })

            this.cardPluginContainer.add([obj, text])
            this.cardPlugins.push(obj)
        }

        function getChar(key: Phaser.Input.Keyboard.Key): string {
            return String.fromCharCode(key.keyCode)
        }
    }

    drawUISkill() {
        // console.log('Event listener: ', this.eventListener)
        const keyObjCardPlugins = [
            getChar(this.eventListener?.skill_1!),
            getChar(this.eventListener?.skill_2!),
            getChar(this.eventListener?.skill_3!),
            getChar(this.eventListener?.skill_4!),
        ]

        this.skillContainer = this.add.container(this.CAMERA_WIDTH - 30, 200, []).setScrollFactor(0)
        const skillList: any = CONSTANTS.skills
        let skillY = 0
        let index = 0
        for (const key in skillList) {
            if (Object.prototype.hasOwnProperty.call(skillList, key)) {
                const src = skillList[key]
                const skill = this.add.image(0, skillY, src)
                skill.name = key
                const text = this.add.text(18, skillY, keyObjCardPlugins[index], {
                    color: '#ffffff70',
                    fontSize: 16,
                })
                skillY += skill.height
                index += 1
                this.skillContainer.add([skill, text])
            }
        }

        function getChar(key: Phaser.Input.Keyboard.Key): string {
            return String.fromCharCode(key.keyCode)
        }
    }

    drawUIObjectsMap() {
        const objs: Array<IObject> = this.mainStore.getMatch!.objects
        objs.forEach((obj: IObject) => {
            if (obj?.location?.x) {
                const objMap = this.add
                    .image(obj.location.x, Math.abs(obj.location.y), obj.data._id)
                    .setOrigin(0)
                this.objsMap.push(objMap)
            }
        })
    }

    drawVelocityShape() {
        const velocityShapeContainer = this.add
            .container(this.CAMERA_WIDTH / 2, this.gunMidAngle.y, [])
            .setScrollFactor(0)

        this.velocityShape = this.add.sprite(0, 0, CONSTANTS.velocity.shape).setScrollFactor(0)
        velocityShapeContainer.add([
            this.add.image(0, 0, CONSTANTS.velocity.background).setScrollFactor(0),
            this.velocityShape,
        ])
        this.velocityShape.x -= this.velocityShape.displayWidth / 2
        this.velocityShape.scaleX = 0
        this.velocityShape.setOrigin(0, 0.5)
    }

    drawUIForceSTABar(sta: number) {
        if (!this.velocityShape) return
        this.graphicSTABar && this.graphicSTABar.clear()

        this.graphicSTABar = this.add.graphics()
        this.graphicSTABar.fillStyle(0x009752)
        this.graphicSTABar.fillRoundedRect(
            this.CAMERA_WIDTH / 2 - 298,
            this.gunMidAngle.y - 50,
            (sta / this.mainStore.getPlayer.STA) * 150,
            20,
            10,
        )
        // this.graphicSTABar.fillStyle()
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
        if (this.gunAngleText) {
            this.gunAngleText!.text = this.gunAngle.toFixed(1)
            this.gunAngleText.x = this.gunMidAngle.x - 5.8 + this.gunAngleText.width / 6
        }
    }

    updateTimePhase(time: number): void {
        if (!this.phaseTime) return
        this.phaseTime.text = time.toString()
        this.phaseTime.x = this.CAMERA_WIDTH / 2 - this.phaseTime.width / 2
        clearTimeout(this.phaseTimeOut)
        this.phaseTimeOut = setTimeout(() => {
            if (time === 0) {
                clearTimeout(this.phaseTimeOut)
                if (!this.phaseTime) return
                this.phaseTime.text = ''
                return
            }
            this.updateTimePhase(time - 1)
        }, 1000)
    }

    changeWindForce(value: number) {
        const forceValue = value - 1
        const signLeftToRight = forceValue < 0 ? true : false
        this.windForceObj && this.windForceObj.setFlipX(signLeftToRight)
        forceValue === 0 && this.windForceObj?.setVisible(false)
        forceValue !== 0 && this.windForceObj?.setVisible(true)
        if (this.windForceValueObj) {
            if (forceValue === 0) this.windForceValueObj.setVisible(false)
            else this.windForceValueObj.setVisible(true)
            this.windForceValueObj.setText((Math.abs(forceValue) * 10).toFixed(1))
            this.windForceValueObj.x = this.CAMERA_WIDTH / 2
            this.windForceValueObj.x -= this.windForceValueObj.width / 2
        }
    }

    updateTurnerName(name: string) {
        if (!this.turnerObj) return
        this.turnerObj.text = name
    }
    // #endregion func update state gun game

    // #region handle events
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
            // this.playerPersons.forEach((p) => {
            //     if (p.thisPlayer.target._id === '115421543287322673156111') {
            //         p.updateHP(10)
            //     }
            // })
            // this.updateTimePhase(1)
        }

        if (isDecreaseKeyDown) {
            this.updateGunAngleAndRedrawUIHearthLineGun(this.gunAngle + angleDelta)
        }
    }
    addEventBattle() {
        this.eventListener.toBattlePhaseFlag = this.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.G,
        )
    }
    handleKeyChangeBattleFlag(): void {
        if (!this.eventListener.toBattlePhaseFlag) return
        const isUp: boolean = this.eventListener.toBattlePhaseFlag.isUp
        if (isUp) {
            // console.log('up')
            // The first time, isMainPhase = false.
            // when press down, then isMainPhase is true and when key up, isUp true
            // => change to battle phase
            if (this.isMainPhase === true) {
                // #region Set here, call once. If you wait feedback from server, call more.
                this.isMainPhase = false
                this.isBattlePhase = true
                // #endregion
                // #region test time
                // setTimeout(() => {
                //     console.log('End battle')
                //     // this.velocity = 0
                //     // if (this.velocityShape) {
                //         //     this.velocityShape.scaleX = this.velocity / 100
                //     //     this.velocityShape.setOrigin(0, 0.5)
                //     // }
                // }, 15000)
                // #endregion test time
                clearInterval(this.velocity_interval)
                // send change to battle phase
                const callbackUpdateStateLocal = () => {
                    console.log('Start battle phase')
                }
                gunService.gun(
                    { angle: this.gunAngle, velocity_0: this.velocity },
                    callbackUpdateStateLocal.bind(this),
                )
            }
        } else {
            if (
                !this.mainStore.getMatch &&
                this.mainStore.getMatch.turner !== this.mainStore.getPlayer._id
            ) {
                console.log('The match invalid or The turn is not this player.')
                return
            }

            if (this.isMainPhase !== false || this.isBattlePhase !== false) return
            // this.isMainPhase === false && this.isBattlePhase === false
            const callbackChooseVelocity = () => {
                // send change to main phase
                this.isMainPhase = true
                console.log('Start main phase')
                clearTimeout(this.phaseTimeOut)

                // v = 100 * Math.cos(Math.PI/15000 *t + Math.PI / 2)
                let t = 0
                const interval = setInterval(() => {
                    this.velocity = 100 * Math.cos((Math.PI / 15000) * t - Math.PI / 2)

                    // console.log('time: ', t, this.velocity)
                    t += 50
                    if (this.velocityShape) {
                        this.velocityShape.scaleX = this.velocity / 100
                        this.velocityShape.setOrigin(0, 0.5)
                    }
                    if (t > 15000) clearInterval(interval)
                }, 50)
                this.velocity_interval = interval
            }
            // setTimeout(() => console.log('15s'), 15000)
            gunService.chooseVelocity(callbackChooseVelocity.bind(this))

            // if (this.isMainPhase) {
            //     if (this.velocityShape) {
            //         this.velocityShape.scaleX = this.velocity / 100
            //         this.velocityShape.setOrigin(0, 0.5)
            //     }
            // }
        }
    }
    // #region handle card and skill
    addEventSkill() {
        const keyboardInput = this.input.keyboard
        if (!keyboardInput) return
        const addEvent = (key: string, keyCode: number) => {
            this.eventListener[key] = keyboardInput.addKey(keyCode)
            this.eventListener[key]!.timeUp = 1
        }
        const keyCodes = Phaser.Input.Keyboard.KeyCodes
        addEvent('skill_1', keyCodes.ONE)
        addEvent('skill_2', keyCodes.TWO)
        addEvent('skill_3', keyCodes.THREE)
        addEvent('skill_4', keyCodes.FOUR)
    }
    handleKeyEventSkill() {
        const oneInput = this.eventListener.skill_1
        const twoInput = this.eventListener.skill_2
        const threeInput = this.eventListener.skill_3
        const fourInput = this.eventListener.skill_4
        const arr = [oneInput, twoInput, threeInput, fourInput]
        arr.forEach((input, index) => {
            if (input && input.isDown && input.timeUp !== 0) {
                input.timeUp = 0
                this.handleUseSkill(index * 2)
            }
        })
    }
    handleUseSkill(n: number) {
        if (!this.skillContainer) return
        const listSkillPlugin = this.skillContainer.getAll()
        const skillPlugin = listSkillPlugin[n]
        gunService.useSkill(skillPlugin.name, (STA: number) => this.handleComputedUseSkill(STA))
    }
    handleComputedUseSkill(STA: number) {
        this.drawUIForceSTABar(STA)
    }
    handleUseSkillRes(data: IUseCardRes) {
        if (data._id !== this.mainStore.getMatch._id) return
        // handle display card in game
        const skills: any = CONSTANTS.skills
        const src = skills[data.card]
        this.handleShowUseSkillOrCard(data.owner, src)
    }
    addEventCard() {
        const keyboardInput = this.input.keyboard
        if (!keyboardInput) return
        const addEvent = (key: string, keyCode: number) => {
            this.eventListener[key] = keyboardInput.addKey(keyCode)
            this.eventListener[key]!.timeUp = 1
        }
        const keyCodes = Phaser.Input.Keyboard.KeyCodes
        addEvent('cardNumberOne', keyCodes.Z)
        addEvent('cardNumberTwo', keyCodes.X)
        addEvent('cardNumberThree', keyCodes.C)
        addEvent('cardNumberFour', keyCodes.V)
        addEvent('cardNumberFive', keyCodes.B)
    }
    handleKeyCardEvent() {
        const cardNumberOneDown = this.eventListener.cardNumberOne
        const cardNumberTwoDown = this.eventListener.cardNumberTwo
        const cardNumberThreeDown = this.eventListener.cardNumberThree
        const cardNumberFourDown = this.eventListener.cardNumberFour
        const cardNumberFiveDown = this.eventListener.cardNumberFive
        const arr = [
            cardNumberOneDown,
            cardNumberTwoDown,
            cardNumberThreeDown,
            cardNumberFourDown,
            cardNumberFiveDown,
        ]
        arr.forEach((input, index) => {
            if (!input) return
            if (input && input.isDown && input.timeUp !== 0) {
                input.timeUp = 0
                this.handleUseCard(index)
            }
        })
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
                this.cardPluginContainer?.add(card)
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
    handleUseCard(indexPlugin: number) {
        const cardPlugin = this.cardPlugins[indexPlugin]
        if (!cardPlugin.name) return
        gunService.useCard(cardPlugin.name, () => this.handleClearCardUsed(indexPlugin))
    }
    handleClearCardUsed(indexPlugin: number) {
        const pluginCard = this.cardPlugins[indexPlugin]
        const idCard = pluginCard.name
        this.handleDestroyCard(idCard)
    }
    handleUseCardRes(data: IUseCardRes) {
        if (data._id !== this.mainStore.getMatch._id) return
        // handle display card in game
        this.handleShowUseSkillOrCard(data.owner, data.card)
        // destroy card
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
    handleShowUseSkillOrCard(playerId: string, id: string) {
        const person = this.playerPersons.find((p) => p.thisPlayer.target._id === playerId)
        if (!person) return
        person.addItemSkillShow(id)
    }
    handleClearContainerSkillOrCard(playerId: string) {
        const person = this.playerPersons.find((p) => p.thisPlayer.target._id === playerId)
        if (!person) return
        person.clearItemsShowSkill()
    }
    // #endregion handle card and skill
    handleGunRes(data: IGunRes) {
        const playerGun = this.playerPersons.find(
            (p) => p.thisPlayer.target._id === this.mainStore.getMatch.turner,
        )
        if (!playerGun) return
        console.log('Bullet: ', data)
        playerGun.handleGun(data, this.playerPersons)
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

        gunService.listeningUseCard((data: IUseCardRes) => {
            this.handleUseCardRes(data)
        })

        gunService.listeningUseSkill((data: IUseCardRes) => {
            this.handleUseSkillRes(data)
        })

        gunService.listeningChangeTurn((data: IChangeTurn) => {
            console.log(data)
            this.mainStore.getMatch.turner = data.turner
            this.clearWhenChangeTurn()
            this.changeWindForce(data.windForce)
            data.updateStatuses.forEach((statuses) => {
                if (statuses.target === this.mainStore.getPlayer._id) {
                    this.drawUIForceSTABar(statuses.STA)
                }
            })
            const p: IPlayerOnMatch | undefined = this.mainStore.getMatch.players.find(
                (p: IPlayerOnMatch) => p.target._id === data.turner,
            )
            if (p) {
                this.updateTurnerName(p.target.name)
            }
            if (data.turner === this.mainStore.getPlayer._id) {
                this.updateTimePhase(10)
            }
        })

        gunService.listeningGunRes(this.handleGunRes.bind(this))
        gunService.listeningEndGame((data: IGameEnd) => {
            setTimeout(() => {
                location.reload()
            }, 15000)
            const container = this.add.container(0, 0, []).setDepth(100000).setScrollFactor(0)
            const rect = this.add
                .rectangle(0, 0, this.CAMERA_WIDTH, this.CAMERA_HEIGHT, 0x000000, 0.8)
                .setOrigin(0)
            container.add(rect)
            const p: IPlayerOnMatch = this.mainStore.getMatch.players.find(
                (p: IPlayerOnMatch) => p.target._id === this.mainStore.getPlayer._id,
            )
            const curTeam = p.position < 3 ? 'teamA' : 'teamB'
            const t = data.winner === curTeam ? 'Thắng Lợi' : 'Thất Bại'
            const c = data.winner === curTeam ? '#dfb900' : '#535550'
            const text = this.add.text(0, 10, t, {
                fontSize: '90px',
                fontStyle: 'bold',
                color: c,
            })
            text.x = this.CAMERA_WIDTH / 2 - text.width / 2
            const groupStatus = this.add.container(100, 200, [])
            const infoText = this.add.text(100, 120, 'Trạng thái được cộng vào bên thắng:', {
                fontSize: '44px',
                color: '#ccc',
                wordWrap: {
                    width: this.CAMERA_WIDTH - 100,
                },
            })
            container.add(infoText)
            let i = 0
            for (const key in data.statuses) {
                if (Object.prototype.hasOwnProperty.call(data.statuses, key)) {
                    const element: number = data.statuses[key]
                    const name = this.add.text(0, 0 + i, key + ':', {
                        fontSize: '40px',
                        color: '#ccc',
                    })
                    const value = this.add.text(110, 0 + i, element?.toFixed(0), {
                        fontSize: '40px',
                        color: '#ccc',
                    })
                    i += 60
                    groupStatus.add([name, value])
                }
            }
            container.add(groupStatus)
            container.add(text)
        })
    }
    // #endregion listening socket

    clearWhenChangeTurn() {
        // #region change state flag
        console.log('End phase, next turn')
        this.isMainPhase = false
        this.isBattlePhase = false
        // #endregion change state flag
        // #region reset velocity
        this.velocity = 0
        if (this.velocityShape) {
            this.velocityShape.scaleX = this.velocity / 100
            this.velocityShape.setOrigin(0, 0.5)
        }
        // #endregion reset velocity

        // #region redisplay weapon
        // #endregion redisplay weapon

        this.playerPersons.forEach((p) => {
            p.clearItemsShowSkill()
        })
    }
}

export default GunGame
