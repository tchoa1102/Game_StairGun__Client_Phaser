import { useMainStore } from '@/stores'
import type {
    IChangeTurn,
    IUpdateLocationGunGame,
    IUseCardRes,
} from '@/util/interface/index.interface'

class gunService {
    private baseUrl: string

    constructor() {
        this.baseUrl = 'gun-game'
    }

    lie(event: string) {
        const mainStore: any = useMainStore()
        mainStore.getSocket.emit(this.baseUrl + '/lie', { event })
    }

    crawlLeft() {
        const mainStore: any = useMainStore()
        mainStore.getSocket.emit(this.baseUrl + '/to-left')
    }

    crawlRight() {
        const mainStore: any = useMainStore()
        mainStore.getSocket.emit(this.baseUrl + '/to-right')
    }

    gun(data: { angle: number; velocity_0: number }, callback: CallableFunction) {
        const mainStore: any = useMainStore()
        mainStore.getSocket.emit(this.baseUrl + '/gun', data, callback)
    }

    useCard(cardId: String) {
        const mainStore: any = useMainStore()
        mainStore.getSocket.emit(this.baseUrl + '/use-card', { cardId })
    }

    useSkill(skillId: String) {
        const mainStore: any = useMainStore()
        mainStore.getSocket.emit(this.baseUrl + '/use-skill', { skillId })
    }

    chooseVelocity(callback: CallableFunction) {
        const mainStore: any = useMainStore()
        mainStore.getSocket.emit(this.baseUrl + '/choose-velocity', {}, callback)
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

    listeningChangeTurn(callback?: (data: IChangeTurn) => void) {
        const mainStore: any = useMainStore()
        mainStore.getSocket.on(this.baseUrl + '/change-turn/res', (data: IChangeTurn) => {
            callback && callback(data)
            mainStore.updateTurner(data)
        })
    }
}

export default new gunService()
