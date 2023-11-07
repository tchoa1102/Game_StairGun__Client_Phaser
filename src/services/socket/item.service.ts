import { useMainStore } from '@/stores'
import type { IItemOnBag } from '@/util/interface/state.main.interface'

class itemService {
    constructor() {}

    wearOrUnBindWear(_id: string, type: string) {
        const mainStore: any = useMainStore()

        if (!mainStore.getPlayer) return
        const item = mainStore.getPlayer.bag.find((item: IItemOnBag) => item._id === _id)
        // console.log('Item send: ', item)
        if (!item) return

        mainStore.getSocket.emit(
            'items/wear-or-unbind',
            { _id, type },
            (data: {
                status: Record<string, number>
                itemsBag: Array<IItemOnBag>
                looks: Record<string, string>
            }) => {
                mainStore.changeItemOnBag(data.itemsBag)
                mainStore.updateStatusPlayer(data.status)
                mainStore.updateLooks(data.looks)
            },
        )
    }
}

export default new itemService()
