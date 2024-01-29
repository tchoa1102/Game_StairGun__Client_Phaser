import type { IPlayer } from './../../util/interface/state.main.interface'
import { useMainStore } from '@/stores'
import BaseService from './base.service'
import type { IItemOnBag } from '@/util/interface/state.main.interface'

class ItemService extends BaseService {
    constructor() {
        super(import.meta.env.VITE_API + '/items')
    }

    // [POST] /buy
    async buy(id: string) {
        const data: { item: IItemOnBag; player: IPlayer } = (
            await this.api.post('/buy', { _id: id })
        ).data.data
        console.log('data res: ', data)
        const mainStore: any = useMainStore()
        mainStore.pushItemToBag([data.item])
        mainStore.changeGold(data.player.gold)
        return data
    }

    // [POST] /sell
    async sellItem(id: string) {
        const data: { item: IItemOnBag; player: IPlayer } = (
            await this.api.post('/sell', { _id: id })
        ).data.data
        console.log('data res from sell: ', data)
        const mainStore: any = useMainStore()
    }
}

export default new ItemService()
