import BaseService from './base.service'

class CardService extends BaseService {
    constructor() {
        super(import.meta.env.VITE_API + '/cards')
    }
}

export default new CardService()
