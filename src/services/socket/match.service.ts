import { useMainStore } from '@/stores'
import type { IMatchRes } from '@/util/interface/index.interface'

class matchService {
    constructor() {}

    // #region emit
    loaded() {
        const mainStore: any = useMainStore()
        mainStore.getSocket.emit('matches/loaded', {
            // idMatch: '6528ec20f2b93a00f5a26317'
            idMatch: mainStore.getMatch._id,
            // idRoom: '6528ec17f2b93a00f5a262cd'
            idRoom: mainStore.getRoom._id,
        })
    }
    // #endregion emit

    // #region on
    listeningCreateMatch(callback: (data: IMatchRes) => void) {
        const mainStore: any = useMainStore()

        mainStore.getSocket.on('matches/create/res', ({ data }: { data: IMatchRes }) => {
            mainStore.setMatch(data)
            callback(data)
        })
    }

    listeningStartGame(callback: CallableFunction) {
        const mainStore: any = useMainStore()

        mainStore.getSocket.on('matches/start/res', () => {
            callback()
        })
    }
    // #endregion on
}

export default new matchService()
