import { useMainStore } from '@/stores'
import type { IMatchRes } from '@/util/interface/index.interface'

class matchService {
    constructor() {}

    listeningCreateMatch(callback: (data: IMatchRes) => void) {
        const mainStore: any = useMainStore()
        const socket = mainStore.getSocket

        socket.on('matches/start/res', ({ data }: { data: IMatchRes }) => {
            callback(data)
        })
    }
}

export default new matchService()
