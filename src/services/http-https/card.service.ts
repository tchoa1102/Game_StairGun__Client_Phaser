import BaseService from './base.service'

class CardService extends BaseService {
    constructor() {
        super('http://localhost:4000/api/cards')
    }
}

export default new CardService()
