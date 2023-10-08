import BoardListRoom from '@/components/boards/listRoom.board'
import { siteService } from '@/services/socket'
import PrepareDuel from '../BootGame/prepareDuel'
import BaseScene from '../baseScene'
import BtnFunc from '@/components/btnFunc'
import CONSTANT_HOME from './CONSTANT'
import { useMainStore } from '@/stores'
import FETCH from '@/services/fetchConfig.service'
import { createAnimation, initKeyAnimation, toast } from '@/util/shares'

class Home extends BaseScene {
    // #region declarations
    public DOMElement: {
        boardListRoom: BoardListRoom | undefined
    }

    private configDefault: Array<any>
    private statesScreen: Array<string>
    private section: Phaser.GameObjects.DOMElement | undefined
    private duelBuilding: Phaser.GameObjects.Polygon | undefined
    private shoppingBuilding: Phaser.GameObjects.Polygon | undefined
    // #endregion declarations
    constructor() {
        super(CONSTANT_HOME.key.home)
        this.statesScreen = []
        this.DOMElement = {
            boardListRoom: undefined,
        }
        this.configDefault = []
    }

    async preload() {
        const mainStore: any = useMainStore()
        this.load.image(CONSTANT_HOME.background.key, CONSTANT_HOME.background.src)

        // #region load skin
        const looks: { [key: string]: string } = mainStore.getPlayer.looks
        for (const key in looks) {
            if (looks.hasOwnProperty(key)) {
                const srcConfig = looks[key]
                const config: any = await FETCH(srcConfig)
                this.configDefault.push(config)
                localStorage.setItem(config.meta.name, JSON.stringify(config))

                this.load.atlas(config.meta.name, config.src[0], config)
            }
        }
        // #endregion load skin
    }

    create() {
        const background = this.add.image(0, 0, CONSTANT_HOME.background.key)
        background.setOrigin(0)
        this.physics.pause()

        // #region listening socket
        this.listeningSocket()
        // #endregion listening socket

        // #region create body default
        this.configDefault.forEach((config) => {
            createAnimation(this, config.meta.name, config.animations)
        })
        // #endregion create body default

        // #region DOM
        this.section = this.createContainer('section', {}).setOrigin(0)
        this.section.node.classList.remove('d-flex')
        this.section.node.classList.add('home')

        // #region create board
        this.DOMElement.boardListRoom = new BoardListRoom(this)
        this.DOMElement.boardListRoom.setCallbackExit(() =>
            this.closeBoard(this.DOMElement.boardListRoom),
        )
        this.DOMElement.boardListRoom.hidden()
        // #endregion create board

        // #region create button functionality
        const sectionFuncBottomRight = new BtnFunc(this).createFuncMain()
        this.section.node.appendChild(sectionFuncBottomRight.node)
        // #endregion create button functionality
        // #endregion DOM

        // #region create polygon building
        this.duelBuilding = this.add.polygon(0, 0, CONSTANT_HOME.building.duel).setOrigin(0)
        this.shoppingBuilding = this.add.polygon(0, 0, CONSTANT_HOME.building.shopping).setOrigin(0)
        // #endregion

        // #region add event
        var zone = this.add.zone(0, 0, 2960, 1480)
        zone.setInteractive()
        zone.on('pointerdown', this.handleClickBuilding.bind(this))
        // #endregion

        const prepareDuelScene = this.scene.add(CONSTANT_HOME.key.prepareDuel, PrepareDuel, true)
        if (prepareDuelScene) {
            this.visibleScene(prepareDuelScene.scene.key)
        }
    }

    update() {
        // console.log(this.statesScreen)
        if (this.statesScreen.length === 0) {
            this.section?.node.classList.remove('d-none')
            for (let dom in this.DOMElement) {
                if (this.DOMElement.hasOwnProperty(dom)) {
                    ;(this.DOMElement as any)[dom].update()
                }
            }
        }
    }

    openBoard(board: any) {
        board.show()
        this.statesScreen.push(board.name)
    }

    closeBoard(board: any) {
        board.hidden()
        this.statesScreen = this.statesScreen.filter(
            (state: string, index: number) => state !== board.name,
        )
    }

    openScene(key: string) {
        console.log(this.scene.get(key).scene.isVisible(key))

        if (this.scene.get(key).scene.isVisible(key)!) return
        let sceneConfig: any = null
        switch (key) {
            case CONSTANT_HOME.key.prepareDuel: {
                sceneConfig = PrepareDuel
                break
            }
        }
        if (sceneConfig) {
            this.statesScreen.push(key)
            try {
                this.scene.add(key, sceneConfig, true)
            } catch (error) {
                console.log(error)

                this.scene.setVisible(true, key)
            }
        }
    }

    visibleScene(key: string) {
        console.log(key)

        this.statesScreen.pop()
        this.scene.setVisible(false, key)
    }

    // #region listening socket
    listeningSocket() {
        siteService.listeningError(({ status, message }: { status: number; message: string }) => {
            toast({ message, status })
        })
    }
    // #endregion listening socket

    // #region handle events
    handleClickBuilding(pointer: any) {
        var x = pointer.x
        var y = pointer.y
        // console.log(x, y)
        if (
            this.statesScreen.length === 0 &&
            Phaser.Geom.Polygon.Contains(this.duelBuilding!.geom, x, y)
        ) {
            console.log('Duel building clicked!')
            this.openBoard(this.DOMElement.boardListRoom)
        }
        if (
            this.statesScreen.length === 0 &&
            Phaser.Geom.Polygon.Contains(this.shoppingBuilding!.geom, x, y)
        ) {
            console.log('Shopping building clicked!')
        }
    }
    // #endregion handle events
}

export default Home
