import Board from '@/components/board.game'
import BoardListRoom from '@/components/BoardListRoom'
import GamePlay from '../GamePLay'
import { roomService } from '@/services/socket'
import PrepareDuel from '../BootGame/prepareDuel'
import BaseScene from '../baseScene'

const CONSTANTS = {
    character: 'src/assets/character.png',
}

class Home extends BaseScene {
    public boardListRoom: BoardListRoom | undefined

    private statesScreen: Array<string>
    private section: Phaser.GameObjects.DOMElement | undefined
    constructor() {
        super('home')
        this.statesScreen = ['prepareDuel']
        this.listeningSocket()
    }

    preload() {
        this.load.image('home-background', 'src/assets/home-1480x740.png')
    }

    create() {
        const background = this.add.image(0, 0, 'home-background')
        background.setOrigin(0)
        this.physics.pause()

        // #region create board
        this.boardListRoom = new BoardListRoom(this)
        this.boardListRoom.setCallbackExit(() => this.closeBoard(this.boardListRoom))
        this.boardListRoom.hidden()

        // #endregion create board

        this.scene.add('prepareDuel', PrepareDuel, true)

        // #region create button functionality
        this.section = this.createContainer('section', {}).setOrigin(0)
        this.section.node.classList.add('home')

        const sectionFuncBottomRight = this.add.dom(0, 0, 'section').setOrigin(0)
        sectionFuncBottomRight.node.classList.add('position-fixed')
        sectionFuncBottomRight.node.classList.add('home__func-bottom-right')
        const character = this.createContainer('div', {
            width: '50px',
            height: '50px',
            'background-image': `url(${CONSTANTS.character})`,
        })
        sectionFuncBottomRight.node.appendChild(character.node)
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
                this.openBoard(this.boardListRoom)
            }
            if (
                this.statesScreen.length === 0 &&
                Phaser.Geom.Polygon.Contains(shoppingBuilding.geom, x, y)
            ) {
                console.log('Shopping building clicked!')
            }
        })
        // #endregion
    }

    update() {
        // console.log('a')
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
            case 'bootDuel': {
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
            // this.scene.bringToTop(key)
        }
    }

    visibleScene(key: string) {
        console.log(key)

        this.statesScreen.pop()
        this.scene.setVisible(false, key)
    }

    // #region listening socket
    listeningSocket() {
        roomService.listeningAddToRoom((dataRoom: any) => {
            // show waiting room
            console.log('Add player to room: ', dataRoom)
        })
    }
    // #endregion listening socket
}

export default Home
