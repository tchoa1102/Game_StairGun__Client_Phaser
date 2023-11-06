import type ShowCharacter from '@/characters/avatars/show'
import Board from '../board.game'
import StatusShowDOM from '../status/status.show.dom'
import type { IItemOnBag, IProperty } from '@/util/interface/state.main.interface'

export default class BoardBag extends Board {
    private classNameBoardBag: string = 'board-bag'
    private previewClassName: string
    private previewListItemClassName: string
    private previewStatusClassName: string
    private previewData: Phaser.GameObjects.DOMElement | undefined
    private previewItemsWear: Record<string, Phaser.GameObjects.DOMElement> | undefined
    private characterView: StatusShowDOM | undefined

    private listItemBagClassName: string
    private listItemBag: Phaser.GameObjects.DOMElement | undefined
    constructor(game: any) {
        const name = 'Túi'
        super(game, name)
        this.node.classList.add(this.classNameBoardBag)
        this.previewClassName = this.classNameBoardBag + '__preview'
        this.previewListItemClassName = this.previewClassName + '__list'
        this.previewStatusClassName = this.previewClassName + '__status-wrapper'

        this.listItemBagClassName = this.classNameBoardBag + '__list'
    }

    create(): typeof this {
        super.create()

        this.createPreviewData()
        this.createListItemBag()
        this.mainStore.getWatch.bag.push(this.watchUpdateDataItemWear.bind(this))
        this.mainStore.getWatch.status.push(this.watchUpdateDataStatus.bind(this))
        return this
    }

    createPreviewData() {
        this.previewData = this.createContainer('section', {})
        this.previewData.node.classList.add(this.previewClassName)

        // #region create character
        const characterWrapper = this.createContainer('section', {
            width: '100%',
            'justify-content': 'center',
        })
        this.characterView = new StatusShowDOM(this.game).create()
        this.characterView.node.classList.add('position-relative')
        characterWrapper.node.appendChild(this.characterView.node)
        this.previewData.node.appendChild(characterWrapper.node)
        // #endregion create character

        // #region create items
        const itemsBoxWrapper = this.createContainer('section', {})
        this.previewData.node.appendChild(itemsBoxWrapper.node)
        itemsBoxWrapper.node.classList.add(this.previewListItemClassName)
        itemsBoxWrapper.node.classList.remove('position-relative')

        this.previewItemsWear = {
            face: this.createItemBoxPreview(itemsBoxWrapper.node, 'Mũ'),
            body: this.createItemBoxPreview(itemsBoxWrapper.node, 'Áo'),
            footer: this.createItemBoxPreview(itemsBoxWrapper.node, 'Quần'),
        }
        const bag: Array<IItemOnBag> = this.mainStore.getPlayer.bag
        for (const item of bag) {
            this.handleChangeItemWearBox(this.previewItemsWear, this.previewListItemClassName, item)
        }
        // #endregion create items

        // #region create status
        const status = this.createPreviewStatus()
        this.previewData.node.appendChild(status.node)
        this.fillDataPropertyStatusDetail({ type: 'HP', value: this.mainStore.getPlayer.HP })
        this.fillDataPropertyStatusDetail({ type: 'STA', value: this.mainStore.getPlayer.STA })
        this.fillDataPropertyStatusDetail({ type: 'ATK', value: this.mainStore.getPlayer.ATK })
        this.fillDataPropertyStatusDetail({ type: 'DEF', value: this.mainStore.getPlayer.DEF })
        this.fillDataPropertyStatusDetail({ type: 'LUK', value: this.mainStore.getPlayer.LUK })
        this.fillDataPropertyStatusDetail({ type: 'AGI', value: this.mainStore.getPlayer.AGI })
        // #endregion create status

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

    pushItemWasWear(
        parent: Element,
        className: string,
        data: IItemOnBag,
    ): Phaser.GameObjects.DOMElement {
        const itemClassName = className + '__item'
        const btn = this.createBtn('button', {})
            .addListener('dblclick')
            .on('dblclick', (e: any) => {
                const btn = e.currentTarget
            })
        parent.appendChild(btn.node)
        btn.node.setAttribute('data-id', data._id)
        btn.node.setAttribute('data-type', data.data.type)
        btn.node.classList.add(itemClassName)
        this.handleLoadImg(btn.node, data.data.imgItem)
        return btn
    }

    handleChangeItemWearBox(
        listDom: Record<string, Phaser.GameObjects.DOMElement>,
        classNameItemBoxWrapper: string,
        data: IItemOnBag,
    ) {
        if (!data.isWear) return
        const element = listDom[data.data.type]
        if (!element) return
        element.node.innerHTML = ''
        this.pushItemWasWear(element.node, classNameItemBoxWrapper, data)
    }

    createPreviewStatus() {
        const section = this.createContainer('section', {})
        section.node.classList.add(this.previewStatusClassName)

        const hp = this.createStatusDetail('hp', '#ff0000')
        section.node.appendChild(hp.node)
        const def = this.createStatusDetail('def', '#5920de')
        section.node.appendChild(def.node)
        const atk = this.createStatusDetail('atk', '#ff0000')
        section.node.appendChild(atk.node)
        const sta = this.createStatusDetail('sta', '#03b325')
        section.node.appendChild(sta.node)
        const luk = this.createStatusDetail('luk', '#c7ca05')
        section.node.appendChild(luk.node)
        const agi = this.createStatusDetail('agi', '#00d0ca')
        section.node.appendChild(agi.node)

        return section
    }

    createStatusDetail(name: string, color: string) {
        const section = this.createText('div', { color, 'font-weight': '700' }, name.toUpperCase())
        const value = this.createContainer('span', { 'margin-left': '4px', 'font-weight': '700' })
        section.node.appendChild(value.node)
        value.node.classList.add(this.previewStatusClassName + '__' + name.toUpperCase())
        value.node.classList.remove('d-flex')
        value.node.classList.add('d-inline-block')

        return section
    }

    fillDataPropertyStatusDetail(data: IProperty) {
        if (!this.previewData) return
        if (!data.value && data.value !== 0) return
        const targetDOM = this.previewData.node.querySelector(
            `.${this.previewStatusClassName}__${data.type.toUpperCase()}`,
        )
        console.log('Target DOM status: ', targetDOM)
        if (!targetDOM) return
        targetDOM.textContent = '' + data.value
    }

    createListItemBag() {
        this.listItemBag = this.createContainer('section', {})
        this.listItemBag.node.classList.add(this.listItemBagClassName)

        this.mainStore.getBag.forEach((item: IItemOnBag) => {
            this.pushItemBagBox(item)
        })

        this.appendChildToContent(this.listItemBag.node)
    }

    pushItemBagBox(data: IItemOnBag): void {
        if (!this.listItemBag || data.isWear) return
        const classNameItem = this.listItemBagClassName + '__item'
        const section = this.createBtn('button', {})
        section.addListener('click').on('click', (e: any) => {})
        section.node.classList.add('d-flex')
        section.node.classList.add(classNameItem)
        section.node.setAttribute('data-id', data._id)
        this.handleLoadImg(section.node, data.data.imgItem)

        const listFuncForItem = this.createListChooseFuncForItemBox(data)
        section.node.appendChild(listFuncForItem.node)
        listFuncForItem.node.classList.add(classNameItem + '__list-func')

        this.listItemBag.node.appendChild(section.node)
    }

    createListChooseFuncForItemBox(data: IItemOnBag): Phaser.GameObjects.DOMElement {
        const section = this.createContainer('section', {})
        section.node.classList.add('position-absolute')
        section.node.classList.remove('d-flex')
        this.pushChooseFuncForItemBox(section.node, data.data.canWear)
        return section
    }

    pushChooseFuncForItemBox(target: Element, canWear: boolean): void {
        if (canWear) {
            const wearBtn = this.createBtn('button', {})
            wearBtn.node.textContent = 'Mặc'
            target.appendChild(wearBtn.node)
        } else {
            const useBtn = this.createBtn('button', {})
            useBtn.node.textContent = 'Sử dụng'
            target.appendChild(useBtn.node)
        }
        const buyBtn = this.createBtn('button', {})
        buyBtn.node.textContent = 'Bán'
        target.appendChild(buyBtn.node)
    }

    // #region handle events
    handleLoadImg(dom: Element, src: string) {
        const appendImg = (time: number) => {
            const sourceImg = this.game.textures.get(src + time).getSourceImage() as Element
            dom.appendChild(sourceImg)
        }
        const time = new Date().getTime()
        this.game.load.image(src + time, src)
        this.game.load.once('complete', () => {
            appendImg(time)
        })
        this.game.load.start()
    }
    // #endregion handle events

    // #region watch
    watchUpdateDataItemWear(data: Array<IItemOnBag>) {
        const itemIsGoingWear = data.find((item) => item.isWear)
        if (!itemIsGoingWear) {
            const itemUnbind = data.find((item) => !item.isWear)
            this.previewItemsWear &&
                itemUnbind &&
                this.handleChangeItemWearBox(
                    this.previewItemsWear,
                    this.previewListItemClassName,
                    itemUnbind,
                )
            return
        }

        this.previewItemsWear &&
            this.handleChangeItemWearBox(
                this.previewItemsWear,
                this.previewListItemClassName,
                itemIsGoingWear,
            )
        return
    }
    watchUpdateDataStatus(data: IProperty) {
        this.fillDataPropertyStatusDetail(data)
    }
    // #endregion watch
}
