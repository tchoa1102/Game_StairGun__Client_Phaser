import { useMainStore } from '@/stores'
import type {
    IChangeTurn,
    IGameEnd,
    IGunRes,
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

    useCard(cardId: String, callback: CallableFunction) {
        const mainStore: any = useMainStore()
        mainStore.getSocket.emit(this.baseUrl + '/use-card', { cardId }, callback)
    }

    useSkill(skillId: String, callback: CallableFunction) {
        const mainStore: any = useMainStore()
        mainStore.getSocket.emit(this.baseUrl + '/use-skill', { skillId }, callback)
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

    listeningUseSkill(callback: (data: IUseCardRes) => void) {
        const mainStore: any = useMainStore()
        mainStore.getSocket.on(this.baseUrl + '/use-skill/res', (data: IUseCardRes) => {
            callback(data)
        })
    }

    listeningChangeTurn(callback?: (data: IChangeTurn) => void) {
        const mainStore: any = useMainStore()
        mainStore.getSocket.on(this.baseUrl + '/change-turn/res', (data: IChangeTurn) => {
            // mainStore.updateTurner(data)
            callback && callback(data)
        })
    }

    listeningGunRes(callback: (data: IGunRes) => any) {
        const mainStore: any = useMainStore()
        mainStore.getSocket.on(this.baseUrl + '/gun-status', (data: IGunRes) => {
            callback(data)
        })
    }

    listeningEndGame(callback: (data: IGameEnd) => any) {
        const mainStore: any = useMainStore()
        mainStore.getSocket.on(this.baseUrl + '/game-end', (data: IGameEnd) => {
            callback(data)
            mainStore.endGame()
        })
    }
}

export default new gunService()
