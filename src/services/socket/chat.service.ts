import { useMainStore } from '@/stores'

class chatService {
    constructor() {}

    // #region
    sendMessage(message: String) {
        const mainStore: any = useMainStore()
        mainStore.getSocket.emit('send-message', { message })
    }
    // #endregion emit

    // #region on
    // #endregion on
}

export default new chatService()
