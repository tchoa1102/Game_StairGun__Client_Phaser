import { useMainStore } from '@/stores'

class StickService {
    constructor() {}

    // emit
    stand(event: string) {
        const mainStore: any = useMainStore()
        const socket = mainStore.getSocket
        socket.emit('stick-stand', {
            event,
        })
    }

    runLeft(event: string) {
        const mainStore: any = useMainStore()
        const socket = mainStore.getSocket
        socket.emit('stick-left', {
            event,
        })
    }

    runRight(event: string) {
        const mainStore: any = useMainStore()
        const socket = mainStore.getSocket
        socket.emit('stick-right', {
            event,
        })
    }

    jumpLeft(event: string) {
        const mainStore: any = useMainStore()
        const socket = mainStore.getSocket
        socket.emit('stick-jump-left', {
            event,
        })
    }

    jumpRight(event: string) {
        const mainStore: any = useMainStore()
        const socket = mainStore.getSocket
        socket.emit('stick-jump-right', {
            event,
        })
    }

    // on
    listeningAnimation(callback: (data: any) => void) {
        const mainStore: any = useMainStore()
        mainStore.getSocket.on('stick-keyboard-event', (data: any) => {
            callback(data)
        })
    }
}

export default new StickService()
