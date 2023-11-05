import { useMainStore } from '@/stores'
import BaseService from './base.service'
import type { IItemOnBag } from '@/util/interface/state.main.interface'

class ItemService extends BaseService {
    constructor() {
        super('http://localhost:4000/api/items')
    }

    // [POST] /buy
    async buy(id: string) {
        const data: IItemOnBag = (await this.api.post('/buy', { _id: id })).data
        const mainStore: any = useMainStore()
        mainStore.pushItemToBag(data)
        return data
    }
}

export default new ItemService()
