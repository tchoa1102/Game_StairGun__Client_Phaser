import BaseDOM from '../baseDOMElement'

export default class modelConfirm extends BaseDOM {
    private className: string = 'model-confirm'
    private callbackAccept: (data: any) => Promise<void>
    constructor(game: any, callbackAccept: (data: any) => Promise<void>) {
        super(game, {})
        this.callbackAccept = callbackAccept
        this.node.classList.add('d-flex')
        this.node.classList.add('model')
    }

    create(data: { _id: string; text: string }): typeof this {
        const model = this.createContainer('div', {})
        this.node.appendChild(model.node)
        model.node.classList.add(this.className)

        const text = this.createText('div', {}, `${data.text}`)
        text.node.classList.add(this.className + '__text')
        model.node.appendChild(text.node)

        const btnWrapper = this.createContainer('section', {})
        btnWrapper.node.classList.add(this.className + '__list-btn')
        model.node.appendChild(btnWrapper.node)

        const btnAccept = this.createBtn('button', {})
            .addListener('click')
            .on('click', this.handleClickAcceptBtn.bind(this))
        btnAccept.node.setAttribute('data-id', data._id)
        const textAccept = this.createText('span', {}, 'Đồng ý')
        btnAccept.node.appendChild(textAccept.node)
        btnWrapper.node.appendChild(btnAccept.node)

        const btnDeny = this.createBtn('button', {})
            .addListener('click')
            .on('click', this.handleClickDenyBtn.bind(this))
        const textDeny = this.createText('span', {}, 'Hủy')
        btnDeny.node.appendChild(textDeny.node)
        btnWrapper.node.appendChild(btnDeny.node)
        return this
    }
    async handleClickAcceptBtn(e: any) {
        const btn = e.currentTarget
        const dataId = btn.dataset.id
        await this.callbackAccept(dataId)
        this.destroy()
    }
    handleClickDenyBtn(e: any) {
        this.destroy()
    }
}
