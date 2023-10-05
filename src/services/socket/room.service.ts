import { useMainStore } from '@/stores'
import type { IRoom } from '@/util/interface/state.main.interface'

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
    // #endregion emit

    // #region on
    listeningUpdateRooms(callback: CallableFunction) {
        const mainStore: any = useMainStore()
        const socket = mainStore.getSocket

        socket.on('rooms', ({ type, data }: { type: string; data: any }) => {
            console.log('Receiving....')
            callback({ type, data })
        })
    }

    listeningAddToRoom(callback: (data: { data: IRoom }) => void) {
        const mainStore: any = useMainStore()
        const socket = mainStore.getSocket

        socket.on('rooms/players/add/res', (data: any) => {
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

    listeningAddToRoomError(callback: CallableFunction) {
        const mainStore: any = useMainStore()
        const socket = mainStore.getSocket
        socket.on(
            'rooms/players/add/res/error',
            ({ status, message }: { status: number; message: string }) => {
                console.log('error')

                callback({ status, message })
            },
        )
    }
    // #endregion on
}

export default new RoomService()
