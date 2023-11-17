import { useMainStore } from '@/stores'
import type { IUpdateLocationGunGame } from '@/util/interface/index.interface'

class gunService {
    private baseUrl: string

    constructor() {
        this.baseUrl = 'gun-game'
    }

    crawlLeft() {
        const mainStore: any = useMainStore()
        mainStore.getSocket.emit(this.baseUrl + '/to-left')
    }

    crawRight() {
        const mainStore: any = useMainStore()
        mainStore.getSocket.emit(this.baseUrl + '/to-left')
    }

    gun(data: { angle: number; force: number }) {
        const mainStore: any = useMainStore()
        mainStore.getSocket.emit(this.baseUrl + '/gun', data)
    }

    useCard(cardId: number) {
        const mainStore: any = useMainStore()
        mainStore.getSocket.emit(this.baseUrl + '/use-card', { cardId })
    }

    useSkill(skillId: number) {
        const mainStore: any = useMainStore()
        mainStore.getSocket.emit(this.baseUrl + '/use-skill', { skillId })
    }

    listeningUpdateLocation(callback: (data: IUpdateLocationGunGame) => void) {
        const mainStore: any = useMainStore()
        mainStore.getSocket.on(
            this.baseUrl + '/update-location',
            (data: IUpdateLocationGunGame) => {
                callback(data)
            },
        )
    }
}

export default new gunService()
