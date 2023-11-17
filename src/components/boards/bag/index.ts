import type ShowCharacter from '@/characters/avatars/show'
import Board from '../board.game'
import StatusShowDOM from '../status/status.show.dom'
import type { IItem, IItemOnBag, IProperty } from '@/util/interface/state.main.interface'
import { itemService } from '@/services/socket'
import modelConfirm from '../model.confirm'

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

        this.listItemBagClassName = this.classNameBoardBag + '__bag'
    }

    create(): typeof this {
        super.create()

        this.createPreviewData()
        this.createListItemBag()
        this.mainStore.getWatch.bag.push(this.watchUpdateDataItemWear.bind(this))
        this.mainStore.getWatch.status.push(this.watchUpdateDataStatus.bind(this))
        this.mainStore.getWatch.bag.push(this.watchUpdateDataItemOnBag.bind(this))
        return this
    }

    createPreviewData() {
        this.previewData = this.createContainer('section', {})
        this.appendChildToContent(this.previewData.node)
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
            foot: this.createItemBoxPreview(itemsBoxWrapper.node, 'Quần'),
            weapon: this.createItemBoxPreview(itemsBoxWrapper.node, 'Vũ Khí'),
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
    }

    createItemBoxPreview(parentDom: Element, text: string) {
        const wrapper = this.createContainer('section', {})
        parentDom.appendChild(wrapper.node)
        const textDom = this.createText('span', {}, text)
        textDom.node.classList.remove('position-relative')
        wrapper.node.appendChild(textDom.node)
        const item = this.createContainer('section', { width: '100%', height: '100%' })
        wrapper.node.appendChild(item.node)

        return item
    }

    pushItemWasWear(
        parent: Element,
        className: string,
        data: IItemOnBag,
    ): Phaser.GameObjects.DOMElement {
        // console.log('Render data: ', data._id)
        const itemClassName = className + '__item'
        const btn = this.createBtn('button', {})
            .addListener('dblclick')
            .on('dblclick', this.handleDoubleClickItemWasWearBtn.bind(this))
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
        const element = listDom[data.data.type]
        if (!element) return
        const item: any = element.node.querySelector('[class*="__item"]')
        const isWear: boolean = data.isWear
        if (!item) {
            // => element empty
            if (!isWear) return
            this.pushItemWasWear(element.node, classNameItemBoxWrapper, data)
            return
        }
        // => have old item
        const isOldItem: boolean = data._id === item.dataset.id
        // clear node
        if (isWear || (!isWear && isOldItem) || (isWear && !isOldItem)) element.node.innerHTML = ''
        // old item is unbound
        if (!isWear) return
        // item is going wear
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
        // console.log('Target DOM status: ', targetDOM)
        if (!targetDOM) return
        targetDOM.textContent = '' + data.value
    }

    createListItemBag() {
        this.listItemBag = this.createContainer('section', {})
        this.appendChildToContent(this.listItemBag.node)
        this.listItemBag.node.classList.add(this.listItemBagClassName)
        this.listItemBag.node.classList.add('scrollbar')

        this.mainStore.getBag.forEach((item: IItemOnBag) => {
            this.pushItemBagBox(item)
        })
    }

    pushItemBagBox(data: IItemOnBag): void {
        if (!this.listItemBag || data.isWear) return
        const classNameItem = this.listItemBagClassName + '__item'
        const section = this.createBtn('button', {})
        section.node.setAttribute('data-id', data._id)
        this.listItemBag.node.appendChild(section.node)

        section.node.classList.add('d-flex')
        section.node.classList.add(classNameItem)
        section.node.setAttribute('data-id', data._id)
        this.handleLoadImg(section.node, data.data.imgItem)

        const listFuncForItem = this.createListChooseFuncForItemBox(data)
        section.node.appendChild(listFuncForItem.node)
        listFuncForItem.node.classList.add(classNameItem + '__list-func')

        const itemDetail = this.createDetailItem(data)
        section.node.appendChild(itemDetail.node)
        itemDetail.node.classList.add(classNameItem + '__item-detail')
    }

    createListChooseFuncForItemBox(data: IItemOnBag): Phaser.GameObjects.DOMElement {
        const section = this.createContainer('div', {})
        section.node.classList.add('position-absolute')
        section.node.classList.remove('d-flex')
        // section.node.classList.add('d-none')
        this.pushChooseFuncForItemBox(section.node, data)
        return section
    }

    pushChooseFuncForItemBox(target: Element, data: IItemOnBag): void {
        if (data.data.canWear) {
            const wearBtn = this.createBtn('button', {})
            target.appendChild(wearBtn.node)
            wearBtn.node.textContent = 'Mặc'
            wearBtn.node.setAttribute('data-id', data._id)
            wearBtn.node.setAttribute('data-type', data.data.type)
            wearBtn.addListener('click').on('click', this.handleClickWearBtn.bind(this))
        } else {
            const useBtn = this.createBtn('button', {})
            target.appendChild(useBtn.node)
            useBtn.node.textContent = 'Sử dụng'
            useBtn.node.setAttribute('data-id', data._id)
            useBtn.node.setAttribute('data-type', data.data.type)
            useBtn.addListener('click').on('click', this.handleClickUseBtn.bind(this))
        }
        const sellBtn = this.createBtn('button', {})
        target.appendChild(sellBtn.node)
        sellBtn.node.textContent = 'Bán'
        sellBtn.node.setAttribute('data-id', data._id)
        sellBtn.node.setAttribute('data-type', data.data.type)
        sellBtn.addListener('click').on('click', this.handleClickSellBtn.bind(this))
    }

    createDetailItem(data: IItemOnBag) {
        const section = this.createContainer('section', {})
        section.node.classList.remove('position-relative')

        const name = this.createText('h4', {}, data.data.name)
        section.node.appendChild(name.node)

        const properties = this.createContainer('div', {})
        section.node.appendChild(properties.node)
        data.data.properties.forEach((p) => {
            const propertyDOM = this.createText(
                'div',
                { color: '#03b325' },
                `${p.type.toUpperCase()}: ${p.value}`,
            )
            properties.node.appendChild(propertyDOM.node)
        })

        return section
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
    handleDoubleClickItemWasWearBtn(e: any) {
        const btn = e.currentTarget
        const id = btn.dataset.id
        const type = btn.dataset.type
        itemService.wearOrUnBindWear(id, type)
    }
    handleClickWearBtn(e: any) {
        const btn = e.currentTarget
        const id = btn.dataset.id
        const type = btn.dataset.type
        console.log('Click wear: ', id, type)
        itemService.wearOrUnBindWear(id, type)
    }
    handleClickUseBtn(e: any) {
        const btn = e.currentTarget
        const id = btn.dataset.id
        alert('Chức năng đang được phát triển!')
    }
    handleClickSellBtn(e: any) {
        const btn = e.currentTarget
        const id = btn.dataset.id

        const dataItem: IItemOnBag = this.mainStore.getPlayer.bag.find(
            (item: IItemOnBag) => item._id === id,
        )
        const model = new modelConfirm(this.game, this.handleAcceptSell.bind(this)).create({
            _id: id,
            text: `Thực sự muốn bán ${dataItem.data.name}?`,
        })
    }
    async handleAcceptSell(id: string) {}
    // #endregion handle events

    // #region watch
    watchUpdateDataItemWear(data: Array<IItemOnBag>) {
        this.mainStore.getBag.forEach((item: IItemOnBag) => {
            this.previewItemsWear &&
                this.handleChangeItemWearBox(
                    this.previewItemsWear,
                    this.previewListItemClassName,
                    item,
                )
        })
        // const itemIsGoingWear = data.find((item) => item.isWear)
        // if (!itemIsGoingWear) {
        //     const itemUnbind = data.find((item) => !item.isWear)
        //     this.previewItemsWear &&
        //         itemUnbind &&
        //         this.handleChangeItemWearBox(
        //             this.previewItemsWear,
        //             this.previewListItemClassName,
        //             itemUnbind,
        //         )
        //     return
        // }
        // return
    }
    watchUpdateDataStatus(data: IProperty) {
        this.fillDataPropertyStatusDetail(data)
    }
    watchUpdateDataItemOnBag(data: Array<IItemOnBag>) {
        if (!this.listItemBag) return
        this.listItemBag.node.innerHTML = ''
        this.mainStore.getBag.forEach((item: IItemOnBag) => {
            this.pushItemBagBox(item)
        })
    }
    // #endregion watch
}
