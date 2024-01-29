import BaseService from './base.service'

class RoomService extends BaseService {
    constructor() {
        super(import.meta.env.VITE_API + '/rooms')
    }
}

export default new RoomService()
