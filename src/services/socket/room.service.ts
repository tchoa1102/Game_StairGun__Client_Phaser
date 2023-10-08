import { useMainStore } from '@/stores'
import type { IPlayerOnRoom, IReadyRes, IRoom } from '@/util/interface/state.main.interface'

class RoomService {
    constructor() {}

    // #region emit
    create() {
        const mainStore: any = useMainStore()
        const socket = mainStore.getSocket
        socket.emit('rooms/create')
    }

    addPlayer(idRoom: string) {
        const mainStore: any = useMainStore()
        const socket = mainStore.getSocket

        socket.emit('rooms/players/add', { idRoom })
    }

    goOut() {
        const mainStore: any = useMainStore()
        const socket = mainStore.getSocket

        socket.emit('rooms/players/goOut')
    }

    ready(isReady: boolean) {
        const mainStore: any = useMainStore()
        const socket = mainStore.getSocket

        socket.emit('rooms/players/ready', { idRoom: mainStore.getRoom._id, isReady })
    }
    // #endregion emit

    // #region on
    listeningUpdateRooms(callback: CallableFunction) {
        const mainStore: any = useMainStore()
        const socket = mainStore.getSocket

        socket.on('rooms', ({ type, data }: { type: string; data: any }) => {
            // console.log('Receiving....')
            callback({ type, data })
        })
    }

    listeningAddToRoom(callback: (data: IRoom) => void) {
        const mainStore: any = useMainStore()
        const socket = mainStore.getSocket

        socket.on('rooms/players/add/res', ({ data }: { data: IRoom }) => {
            console.log('Adding....')
            callback(data)
        })
    }

    listeningGoOutRoom(callback: CallableFunction) {
        const mainStore: any = useMainStore()
        const socket = mainStore.getSocket

        socket.on('rooms/players/goOut/res', () => {
            console.log('Go out...')
            mainStore.setCurrentRoom(undefined)
            callback()
        })
    }

    listeningRemovePlayerOnRoom(callback: CallableFunction) {
        const mainStore: any = useMainStore()
        const socket = mainStore.getSocket

        socket.on('rooms/players/remove/res', ({ data }: { data: any }) => {
            console.log('Removing players...')
            callback(data)
        })
    }

    listeningReady(callback: (data: IReadyRes) => void) {
        const mainStore: any = useMainStore()
        const socket = mainStore.getSocket

        socket.on('rooms/players/ready/res', (data: IReadyRes) => {
            for (const p of mainStore.getRoom.players) {
                const plyer: IPlayerOnRoom = p
                if (plyer.player._id === data.player._id) {
                    plyer.isReady = data.player.isReady
                    break
                }
            }
            callback(data)
        })
    }
    // #endregion on
}

export default new RoomService()
