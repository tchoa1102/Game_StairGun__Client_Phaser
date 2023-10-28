import { useMainStore } from '@/stores'
import type { IChatReceiveMessage } from '@/util/interface/index.interface'

class chatService {
    constructor() {}

    // #region
    // sendMessage(message: String) {
    //     const mainStore: any = useMainStore()
    //     mainStore.getSocket.emit('send-message', { message })
    // }
    sendMessage(data: { receiverId: string; message: string }) {
        const mainStore: any = useMainStore()
        mainStore.getSocket.emit('chat/send', data, (res: any) => console.log(res?.status))
    }
    // #endregion emit

    // #region on
    receiveMessage() {
        const mainStore: any = useMainStore()
        mainStore.getSocket.on('chat/receiving', (data: IChatReceiveMessage) => {
            console.log('Chat data: ', data)
            mainStore.pushChat(data)
        })
    }
    // #endregion on
}

export default new chatService()
