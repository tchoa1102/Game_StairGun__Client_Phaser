import BoardListRoom from '@/components/boards/listRoom.board'
import GamePlay from '../GamePLay'
import { roomService } from '@/services/socket'
import PrepareDuel from '../BootGame/prepareDuel'
import BaseScene from '../baseScene'
import BtnFunc from '@/components/btnFunc'
import CONSTANT_HOME from './CONSTANT'
import { useMainStore } from '@/stores'
import type { IRoom } from '@/util/interface/state.main.interface'
import FETCH from '@/services/fetchConfig.service'
import { createAnimation } from '@/util/shares'

class Home extends BaseScene {
    public DOMElement: {
        boardListRoom: BoardListRoom | undefined
    }

    private configDefault: Array<any>

    // public boardListRoom: BoardListRoom | undefined

    private statesScreen: Array<string>
    private section: Phaser.GameObjects.DOMElement | undefined
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

                this.load.atlas(`looks.${key}.default`, config.src[0], config)
            }
        }
    }

    create() {
        const background = this.add.image(0, 0, CONSTANT_HOME.background.key)
        background.setOrigin(0)
        this.physics.pause()

        // #region create body default
        this.configDefault.forEach((config) => {
            console.log('config: ', config)

            createAnimation(this, config.meta.image, config.animations)
        })
        // #endregion create body default

        // DOM
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

        // #region create polygon building
        const duelBuilding = this.add.polygon(
            0,
            0,
            [
                890, 191, 964, 166, 1026, 170, 1106, 192, 1127, 297, 1104, 346, 898, 349, 861, 293,
                867, 202,
            ],
            // 0xfff0,
        )
        duelBuilding.setOrigin(0)
        const shoppingBuilding = this.add.polygon(
            0,
            0,
            [
                296, 211, 357, 187, 395, 247, 430, 170, 470, 226, 514, 241, 521, 264, 569, 182, 529,
                156, 504, 120, 507, 91, 542, 67, 623, 86, 643, 122, 615, 168, 574, 173, 598, 201,
                636, 201, 617, 241, 699, 297, 734, 347, 451, 458, 209, 350, 236, 302, 312, 245, 298,
                210,
            ],
            // 0xfff0,
        )
        shoppingBuilding.setOrigin(0)
        // #endregion

        // #region add event
        var zone = this.add.zone(0, 0, 2960, 1480)
        zone.setInteractive()
        zone.on('pointerdown', (pointer: any) => {
            var x = pointer.x
            var y = pointer.y
            // console.log(x, y)
            if (
                this.statesScreen.length === 0 &&
                Phaser.Geom.Polygon.Contains(duelBuilding.geom, x, y)
            ) {
                console.log('Duel building clicked!')
                this.openBoard(this.DOMElement.boardListRoom)
            }
            if (
                this.statesScreen.length === 0 &&
                Phaser.Geom.Polygon.Contains(shoppingBuilding.geom, x, y)
            ) {
                console.log('Shopping building clicked!')
            }
        })
        // #endregion

        const prepareDuelScene = this.scene.add(CONSTANT_HOME.key.prepareDuel, PrepareDuel, true)
        if (prepareDuelScene) {
            this.visibleScene(prepareDuelScene.scene.key)
        }
    }

    update() {
        // console.log('a')
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
            // this.scene.get(sceneConfig.scene.key)?.section?.node.classList.add('d-flex')
            // this.scene.bringToTop(key)
        }
    }

    visibleScene(key: string) {
        console.log(key)

        this.statesScreen.pop()
        this.scene.setVisible(false, key)
    }

    // #region listening socket
    // #endregion listening socket

    // #region handle events
    // #endregion handle events
}

export default Home
