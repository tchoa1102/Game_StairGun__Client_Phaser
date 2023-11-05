import type ShowCharacter from '@/characters/avatars/show'
import Board from '../board.game'
import StatusShowDOM from '../status/status.show.dom'
import type { IItemOnBag } from '@/util/interface/state.main.interface'

export default class BoardBag extends Board {
    private classNameBoardBag: string = 'board-bag'
    private previewClassName: string
    private previewData: Phaser.GameObjects.DOMElement | undefined
    private listItemBagClassName: string
    private listItemBag: Phaser.GameObjects.DOMElement | undefined
    private characterView: StatusShowDOM | undefined
    constructor(game: any) {
        const name = 'Túi'
        super(game, name)
        this.node.classList.add(this.classNameBoardBag)
        this.previewClassName = this.classNameBoardBag + '__preview'
        this.listItemBagClassName = this.classNameBoardBag + '__list'
    }

    create(): typeof this {
        super.create()

        this.createPreviewData()
        this.createListItemBag()
        return this
    }

    createPreviewData() {
        this.previewData = this.createContainer('section', {})
        this.previewData.node.classList.add(this.previewClassName)

        const characterWrapper = this.createContainer('section', {
            width: '100%',
            'justify-content': 'center',
        })
        this.characterView = new StatusShowDOM(this.game).create()
        this.characterView.node.classList.add('position-relative')
        characterWrapper.node.appendChild(this.characterView.node)
        this.previewData.node.appendChild(characterWrapper.node)

        const itemsBoxWrapper = this.createContainer('section', {})
        this.previewData.node.appendChild(itemsBoxWrapper.node)
        itemsBoxWrapper.node.classList.add(this.previewClassName + '__list')
        itemsBoxWrapper.node.classList.remove('position-relative')

        const face = this.createItemBoxPreview(itemsBoxWrapper.node, 'Mũ')
        const body = this.createItemBoxPreview(itemsBoxWrapper.node, 'Áo')
        const footer = this.createItemBoxPreview(itemsBoxWrapper.node, 'Quần')

        this.appendChildToContent(this.previewData.node)
    }

    createItemBoxPreview(parentDom: Element, text: string) {
        const wrapper = this.createContainer('section', {})
        const textDom = this.createText('span', {}, text)
        textDom.node.classList.remove('position-relative')
        wrapper.node.appendChild(textDom.node)
        const item = this.createContainer('section', { width: '100%', height: '100%' })
        wrapper.node.appendChild(item.node)

        parentDom.appendChild(wrapper.node)
        return item
    }

    pushItemWasWear(className: string, data: IItemOnBag): Phaser.GameObjects.DOMElement {
        const itemClassName = className + '__item'
        const btn = this.createBtn('button', {})
            .addListener('dblclick')
            .on('dblclick', (e: any) => {
                const btn = e.currentTarget
                // unbind
            })
        btn.node.setAttribute('data-id', data._id)
        btn.node.classList.add(itemClassName)
        this.handleLoadImg(btn.node, data.data.imgItem)
        return btn
    }

    createListItemBag() {
        this.listItemBag = this.createContainer('section', {})
        this.listItemBag.node.classList.add(this.listItemBagClassName)

        this.appendChildToContent(this.listItemBag.node)
    }

    createListChooseFuncForItemBox(className: string): Phaser.GameObjects.DOMElement {
        const section = this.createContainer('section', {})
        section.node.classList.add(className + '__list')

        return section
    }

    pushChooseFuncForItemBox(target: Element, isWear: boolean): void {
        const useBtn = this.createBtn('button', {})
        useBtn.node.textContent = 'Sử dụng'
        target.appendChild(useBtn.node)
        const wearBtn = this.createBtn('button', {})
        wearBtn.node.textContent = 'Mặc'
        target.appendChild(wearBtn.node)
        const buyBtn = this.createBtn('button', {})
        buyBtn.node.textContent = 'Bán'
        target.appendChild(buyBtn.node)
    }

    // #region handle events
    handleLoadImg(dom: Element, src: string) {
        const appendImg = () => {
            const sourceImg = this.game.textures.get(src).getSourceImage() as Element
            dom.appendChild(sourceImg)
        }

        if (this.game.textures.get(src).key !== '__MISSING') {
            appendImg()
            return
        }
        this.game.load.image(src, src)
        this.game.load.once('complete', () => {
            appendImg()
        })
        this.game.load.start()
    }
    // #endregion handle events
}
