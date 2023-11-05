import type { IItem, IProperty } from '@/util/interface/state.main.interface'
import Board from '../board.game'
import itemService from '@/services/item.service'
import modelConfirm from '../model.confirm'

export default class BoardShop extends Board {
    private classNameShopBoard: string = 'board-shop'
    private listItemClassName: string
    private listItemWrapper: Phaser.GameObjects.DOMElement | undefined
    private itemDetailClassName: string
    private itemDetailWrapper: Phaser.GameObjects.DOMElement | undefined
    constructor(game: any) {
        const name = 'Cửa Hàng'
        super(game, name)
        this.listItemClassName = this.classNameShopBoard + '__list'
        this.itemDetailClassName = this.classNameShopBoard + '__detail'
        this.node.classList.add(this.classNameShopBoard)
    }

    create(): typeof this {
        super.create()

        this.createListItem()
        this.createItemDetail()
        this.appendChildToContent(this.listItemWrapper!.node)
        this.appendChildToContent(this.itemDetailWrapper!.node)

        this.mainStore.getWatch.dataShop.push(this.pushItem.bind(this))
        this.renderData()
        return this
    }

    renderData() {
        itemService.getAll().then(({ data }) => {
            const itemEquipments: Array<IItem> = data
            this.clearAndFillDataItemDetail(itemEquipments[0])

            itemEquipments.forEach((item) => {
                this.mainStore.pushDataShop(item)
            })
        })
    }

    createListItem(): Phaser.GameObjects.DOMElement {
        this.listItemWrapper = this.createContainer('section', {})
        this.listItemWrapper.node.classList.add(this.listItemClassName)
        this.listItemWrapper.node.classList.add('scrollbar')
        return this.listItemWrapper
    }

    pushItem(data: IItem) {
        if (!data.isSale) return
        const item = this.createItem(data)
        this.listItemWrapper?.node.appendChild(item.node)
    }

    createItem(data: IItem): Phaser.GameObjects.DOMElement {
        const className = this.listItemClassName
        const item = this.createBtn('button', {})
        item.node.classList.add('d-flex')
        item.node.setAttribute('data-id', data._id)
        item.addListener('click').on('click', this.handleClickItemShop.bind(this))

        const imgWrapper = this.createContainer('div', {})
        imgWrapper.node.classList.add(className + '__img')
        // imgWrapper.node.classList.remove('position-relative')
        // imgWrapper.node.classList.add('position-static')
        // const imgContainer = this.createContainer('div', {})
        // imgWrapper.node.appendChild(imgContainer.node)
        item.node.appendChild(imgWrapper.node)
        this.game.load.image(data.imgItem, data.imgItem)
        this.game.load.once('complete', () => {
            console.log('Load successfully')
            const sourceImg: any = this.game.textures.get(data.imgItem).getSourceImage()
            imgWrapper.node.appendChild(sourceImg)
        })
        this.game.load.start()

        const quantity = this.createText('div', {}, '')
        quantity.node.classList.add(className + '__quantity')
        item.node.appendChild(quantity.node)

        const name = this.createText('div', {}, data.name)
        // name.node.classList.remove('position-relative')
        // name.node.classList.add('position-static')
        name.node.classList.add(className + '__name')
        item.node.appendChild(name.node)

        const price = this.createText('div', {}, data.price.toString())
        // price.node.classList.remove('position-relative')
        // price.node.classList.add('position-static')
        price.node.classList.add(className + '__price')
        item.node.appendChild(price.node)

        return item
    }

    createItemDetail(): Phaser.GameObjects.DOMElement {
        this.itemDetailWrapper = this.createContainer('section', {})
        this.itemDetailWrapper.node.classList.add(this.itemDetailClassName)

        // #region header
        const classNameHeader = this.itemDetailClassName + '__header'
        const header = this.createContainer('section', {})
        header.node.classList.add(classNameHeader)
        this.itemDetailWrapper.node.appendChild(header.node)

        const imgWrapper = this.createContainer('div', {})
        imgWrapper.node.classList.add(classNameHeader + '__img')
        header.node.appendChild(imgWrapper.node)

        const name = this.createText('div', {}, '')
        name.node.classList.add(classNameHeader + '__name')
        header.node.appendChild(name.node)
        // #endregion header

        // #region body
        const classNameBody = this.itemDetailClassName + '__body'
        const body = this.createContainer('section', {})
        body.node.classList.add(classNameBody)
        this.itemDetailWrapper.node.appendChild(body.node)

        const description = this.createText('div', {}, '')
        description.node.classList.add(classNameBody + '__description')
        description.node.classList.add('scrollbar')
        body.node.appendChild(description.node)

        const propertyWrapper = this.createContainer('div', {})
        propertyWrapper.node.classList.add(classNameBody + '__property-wrapper')
        propertyWrapper.node.classList.add('scrollbar')
        body.node.appendChild(propertyWrapper.node)
        // #endregion body

        // #region footer
        const classNameFooter = this.itemDetailClassName + '__footer'
        const footer = this.createContainer('section', {})
        footer.node.classList.add(classNameFooter)
        this.itemDetailWrapper.node.appendChild(footer.node)

        const btnBuy = this.createBtn('button', {})
        btnBuy.node.textContent = 'Mua'
        btnBuy.node.classList.add(classNameFooter + '__btn-buy')
        btnBuy.node.setAttribute('data-id', '')
        btnBuy.addListener('click').on('click', this.handleClickBuy.bind(this))
        footer.node.appendChild(btnBuy.node)
        // #endregion footer

        return this.itemDetailWrapper
    }

    clearAndFillDataItemDetail(data?: IItem) {
        // console.log('check: ', this.itemDetailWrapper, data)
        if (!this.itemDetailWrapper) return
        const imgWrapper = this.itemDetailWrapper.node.querySelector(`[class*="__img"]`)
        const name = this.itemDetailWrapper.node.querySelector(`[class*="__name"]`)
        const description = this.itemDetailWrapper.node.querySelector(`[class*="__description"]`)
        const propertyWrapper = this.node.querySelector(
            `.${this.classNameShopBoard} [class*="__property-wrapper"]`,
        )
        const btnBuy = this.itemDetailWrapper.node.querySelector(`[class*="__btn-buy"]`)

        if (imgWrapper) imgWrapper.innerHTML = ''
        if (name) name.textContent = ''
        if (description) description.textContent = ''
        if (propertyWrapper) propertyWrapper.innerHTML = ''
        if (btnBuy) btnBuy.setAttribute('data-id', '')
        // console.log('Data test: ', imgWrapper, name, description, propertyWrapper, btnBuy)

        if (!data) return
        if (imgWrapper) {
            const time = new Date().getTime().toString()
            this.game.load.image(data.imgItem + time, data.imgItem)
            this.game.load.once('complete', () => {
                // console.log('Load successfully')
                const sourceImg = this.game.textures
                    .get(data.imgItem + time)
                    .getSourceImage() as Element
                // console.log('img: ', imgWrapper, sourceImg)
                imgWrapper.appendChild(sourceImg)
            })
            this.game.load.start()
        }
        if (name) name.textContent = data.name || ''
        if (description) description.textContent = data.description || ''
        if (propertyWrapper) {
            data.properties.forEach((property) => this.pushPropertyDOM(property))
        }
        if (btnBuy) btnBuy.setAttribute('data-id', data._id)
    }

    pushPropertyDOM(data: IProperty) {
        if (!this.itemDetailWrapper) return
        const propertyWrapper = this.itemDetailWrapper.node.querySelector(
            `[class*="__property-wrapper"]`,
        )

        const propertyContainer = this.createPropertyDOM(data)
        propertyWrapper?.appendChild(propertyContainer.node)
    }

    createPropertyDOM(data: IProperty): Phaser.GameObjects.DOMElement {
        const propertyContainer = this.createContainer('div', {})

        const type = this.createText('span', { 'font-weight': '500' }, data.type.toUpperCase())
        propertyContainer.node.appendChild(type.node)

        const value = this.createText(
            'span',
            { 'margin-left': '4px', 'font-weight': '700', color: '#23c331' },
            data.value.toString(),
        )
        propertyContainer.node.appendChild(value.node)

        return propertyContainer
    }

    // #region handle events
    handleClickItemShop(e: any) {
        const btn = e.currentTarget
        const dataId: string = btn.dataset.id
        const btnBuy: any = this.itemDetailWrapper!.node.querySelector('[class*="__btn-buy"]')
        if (dataId === btnBuy!.dataset.id) return
        // console.log(btn)
        const dataItem = this.mainStore.getDataShop.find((item: IItem) => item._id === dataId)
        this.clearAndFillDataItemDetail(dataItem)
    }
    handleClickBuy(e: any) {
        const btn = e.currentTarget
        const id = btn.dataset.id
        console.log(id)

        const dataItem: IItem = this.mainStore.getDataShop.find((item: IItem) => item._id === id)
        const model = new modelConfirm(this.game, this.handleAcceptBuy.bind(this)).create({
            _id: id,
            text: `Dùng ${dataItem.price} để mua ${dataItem.name}`,
        })
    }
    async handleAcceptBuy(id: string) {
        console.log(id)
        const data = await itemService.buy(id)
    }
    // #endregion handle events
}
