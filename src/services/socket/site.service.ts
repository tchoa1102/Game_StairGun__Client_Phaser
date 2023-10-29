import { useMainStore } from '@/stores'
import type { IFriend } from '@/util/interface/state.main.interface'

class SiteService {
    constructor() {}
    listeningError(callback: CallableFunction) {
        const mainStore: any = useMainStore()
        const socket = mainStore.getSocket
        socket.on('res/error', ({ status, message }: { status: number; message: string }) => {
            console.log('error')

            callback({ status, message })
        })
    }

    // addFriend -> listeningAddFriend -> acceptAddFriend -> listenAddFriendRes
    addFriend(targetId: string) {
        const mainStore: any = useMainStore()
        mainStore.getSocket.emit('player/friends/add', { targetId })
    }

    acceptAddFriend(data: { _id: string; isAccepted: boolean }) {
        const mainStore: any = useMainStore()
        mainStore.getSocket.emit('player/friends/add/res-add', {
            _id: data._id,
            isAccepted: data.isAccepted,
        })
    }

    listeningAddFriend(callback: CallableFunction) {
        const mainStore: any = useMainStore()
        mainStore.getSocket.on('player/friends/add/check', (data: IFriend) => callback(data))
    }
    listeningAddFriendRes() {
        const mainStore: any = useMainStore()
        mainStore.getSocket.on('player/friends/add/res-add/success', (data: IFriend) => {
            mainStore.addFriend(data)
        })
    }
}

export default new SiteService()
