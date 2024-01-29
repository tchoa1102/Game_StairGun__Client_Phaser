import BaseService from './base.service'

class MatchService extends BaseService {
    constructor() {
        super(import.meta.env.VITE_API + '/matches')
    }
}

export default new MatchService()
