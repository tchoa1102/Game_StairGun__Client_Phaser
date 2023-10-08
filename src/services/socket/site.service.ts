import { useMainStore } from '@/stores'

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
}

export default new SiteService()
