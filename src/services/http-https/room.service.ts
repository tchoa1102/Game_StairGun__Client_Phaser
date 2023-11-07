import BaseService from './base.service'

class RoomService extends BaseService {
    constructor() {
        super('http://localhost:4000/api/rooms')
    }
}

export default new RoomService()
