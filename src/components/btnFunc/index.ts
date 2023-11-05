import CONSTANT_HOME from '@/scenes/Home/CONSTANT'
import BaseDOM from '../baseDOMElement'
import { useMainStore } from '@/stores'
import { roomService } from '@/services/socket'
import BoardBag from '../boards/bag'

const CONSTANTS = {
    character: 'src/assets/character.png',
    goOut: 'src/assets/bye.png',
}

export default class BtnFunc extends BaseDOM {
    private rootClass = 'component__btn-func'
    constructor(game: any) {
        const mainStore = useMainStore()
        super(game, {})
        this.node.classList.add('position-fixed')
        this.node.classList.add('btn-func')
        this.node.classList.add(this.rootClass)
    }

    createFuncMain(): typeof this {
        const character = this.createCharacter([])

        this.node.append(character.node)
        return this
    }

    createFuncRoom(): typeof this {
        const goOut = this.createGoOut([])
        const character = this.createCharacter([])

        this.node.append(goOut.node, character.node)
        return this
    }

    createCharacter(classNames: Array<string>): Phaser.GameObjects.DOMElement {
        const boardBag = new BoardBag(this.game).create()
        boardBag.setCallbackExit(() => {
            ;(this.game.scene.get(CONSTANT_HOME.key.home) as any).closeBoard(boardBag)
        })
        // boardBag.hidden()
        const character = this.createContainer('div', {
            'background-image': `url(${CONSTANTS.character})`,
        })
            .addListener('click')
            .on('click', (e: any) => {
                // console.log('Character clicked')
                ;(this.game.scene.get(CONSTANT_HOME.key.home) as any).openBoard(boardBag)
            })
        character.node.classList.add('btn-30')
        classNames.forEach((className) => character.node.classList.add(className))
        return character
    }

    createGoOut(classNames: Array<string>): Phaser.GameObjects.DOMElement {
        const goOut = this.createContainer('div', {
            'background-image': `url(${CONSTANTS.goOut})`,
        })
            .addListener('click')
            .on('click', this.handleClickVisibleScene.bind(this))
        goOut.node.classList.add('btn-30')

        classNames.forEach((className) => goOut.node.classList.add(className))
        this.listenersSocket()
        return goOut
    }

    update() {
        if (
            // add role to if clause run true
            // this.game.scene.isVisible(`${this.game.scene.key}`) &&
            this!.node.className.includes('d-none')
        ) {
            this!.node.classList.remove('d-none')
        }
    }

    hanldeVisibleScene() {}

    // #region handle events
    handleClickVisibleScene() {
        roomService.goOut()
    }
    // #endregion handle events

    // #region listeners
    listenersSocket() {
        roomService.listeningGoOutRoom(this.goOut.bind(this))
    }
    // #endregion listeners
    // #region handle listeners socket
    goOut() {
        // console.log(this.game.scene.key, this.game.scene.isVisible())
        ;(this.game.scene.get(CONSTANT_HOME.key.home) as any).visibleScene(this.game.scene.key)
        // console.log(this.game.scene.isVisible())
    }
    // #endregion handle listeners socket
}
