import { useMainStore } from '@/stores'

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

    listeningAddToRoom(callback: CallableFunction) {
        const mainStore: any = useMainStore()
        const socket = mainStore.getSocket

        console.log('Adding....')
        socket.on('rooms/players/add/res', (data: any) => {
            callback(data)
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
