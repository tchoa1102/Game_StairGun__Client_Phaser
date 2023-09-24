import { useMainStore } from '@/stores'

class SiteService {
    constructor() {}

    // async receivingRoomData() {
    //     const mainStore: any = useMainStore()
    //     const socket = mainStore.getSocket
    //     socket.on('receive-data', (data: { [key: string]: any }) => {
    //         for (const key in data) {
    //             if (data.hasOwnProperty(key)) {
    //                 const element = data[key]
    //                 switch (key) {
    //                     case 'listRooms': {
    //                         break
    //                     }
    //                 }
    //             }
    //         }
    //     })
    // }
}

export default new SiteService()
