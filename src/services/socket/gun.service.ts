import { useMainStore } from '@/stores'
import type { IUpdateLocationGunGame, IUseCardRes } from '@/util/interface/index.interface'

class gunService {
    private baseUrl: string

    constructor() {
        this.baseUrl = 'gun-game'
    }

    crawlLeft() {
        const mainStore: any = useMainStore()
        mainStore.getSocket.emit(this.baseUrl + '/to-left')
    }

    crawlRight() {
        const mainStore: any = useMainStore()
        mainStore.getSocket.emit(this.baseUrl + '/to-right')
    }

    gun(data: { angle: number; velocity_0: number }) {
        const mainStore: any = useMainStore()
        mainStore.getSocket.emit(this.baseUrl + '/gun', data)
    }

    useCard(cardId: String) {
        const mainStore: any = useMainStore()
        mainStore.getSocket.emit(this.baseUrl + '/use-card', { cardId })
    }

    useSkill(skillId: String) {
        const mainStore: any = useMainStore()
        mainStore.getSocket.emit(this.baseUrl + '/use-skill', { skillId })
    }

    listeningUpdateLocation(callback: (data: IUpdateLocationGunGame) => void) {
        const mainStore: any = useMainStore()
        mainStore.getSocket.on(
            this.baseUrl + '/players/update-location',
            (data: IUpdateLocationGunGame) => {
                callback(data)
            },
        )
    }

    listeningUseCard(callback: (data: IUseCardRes) => void) {
        const mainStore: any = useMainStore()
        mainStore.getSocket.on(this.baseUrl + '/use-card/res', (data: IUseCardRes) => {
            callback(data)
        })
    }
}

export default new gunService()
