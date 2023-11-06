import type { IChatReceiveMessage } from './../util/interface/index.interface'
import {
    type IChat,
    type IFriend,
    type IRoom,
    type IItem,
    type IItemOnBag,
    type IProperty,
} from './../util/interface/state.main.interface'
import { defineStore, type _GettersTree } from 'pinia'
import Phaser from 'phaser'

import { type IIndicator, type IMatchRes, type IState } from '@/util/interface/index.interface'
import { GamePlay, Home } from '@/scenes'
import { io } from 'socket.io-client'
import { firebaseService } from '@/services/http-https'
import PrepareDuel from '@/scenes/BootGame/prepareDuel'

const MIN_HEIGHT = 740

const state: IState = {
    watches: {
        chat: [],
        room: [],
        match: [],
        friend: [],
        dataShop: [],
        bag: [],
        status: [],
        statusMatch: [],
    },
    game: undefined,
    socket: null,
    zoom: 1,
    width: MIN_HEIGHT * 2,
    height: MIN_HEIGHT,
    player: {
        _id: undefined,
        uid: undefined,
        socketId: undefined,
        clientId: undefined,
        name: undefined,
        email: undefined,
        picture: undefined,
        friends: [],
        looks: {},
        level: undefined,
        HP: undefined,
        STA: undefined,
        ATK: undefined,
        DEF: undefined,
        LUK: undefined,
        AGI: undefined,
        gold: 0,
        character: {},
        skills: [],
        bag: [],
    },
    currentRoom: undefined,
    chatWorld: [],
    match: undefined,
    dataShop: [],
}
const useMainStore = defineStore('main', {
    state: () => state,
    getters: {
        getWatch(): typeof this.watches {
            return this.watches
        },
        getSocket(): typeof this.socket {
            return this.socket
        },
        getPlayer(): typeof this.player {
            return this.player
        },
        getWidth(): number {
            return this.width
        },
        getHeight(): number {
            return this.height
        },
        getZoom(): number {
            return this.zoom
        },
        getGame(): typeof this.game {
            return this.game
        },
        getRoom(): typeof this.currentRoom {
            return this.currentRoom
        },
        getChatWorld(): typeof this.chatWorld {
            return this.chatWorld
        },
        getMatch(): IMatchRes {
            return this.match!
        },
        getDataShop(): Array<IItem> {
            return this.dataShop
        },
        getBag(): Array<IItemOnBag> {
            return this.player.bag
        },
    },
    actions: {
        connection() {
            this.socket = io('http://localhost:4000', {
                auth: async (cb) => {
                    cb({
                        token: await firebaseService.auth.currentUser?.getIdToken(),
                    })
                },
            })
        },
        init(heightScreen: number, initObject: IIndicator) {
            this.zoom = heightScreen / MIN_HEIGHT > 1 ? Math.floor(heightScreen / MIN_HEIGHT) : 1
            console.log('zoom: %d', this.zoom)

            const GAME_CONFIG: Phaser.Types.Core.GameConfig = {
                type: Phaser.AUTO,
                width: this.width * this.zoom,
                height: this.height * this.zoom,
                scene: [Home],
                parent: initObject.parent || undefined,
                physics: {
                    default: 'arcade',
                    // arcade: {
                    //     debug: false,
                    // },
                },
                dom: {
                    createContainer: true,
                },
                plugins: {
                    // scene: [
                    //     {
                    //         plugin: PhaserMatterCollisionPlugin,
                    //         key: 'matterCollision',
                    //         mapping: 'matterCollision',
                    //     },
                    // ],
                },
            }

            // Init game
            console.log(
                '\n%c-- StairGun --\n',
                'color: #fff; background-color: pink; font-size: 28px;',
            )
            try {
                this.game = new Phaser.Game(GAME_CONFIG)
            } catch (error) {
                console.log('%cERROR', 'color: red; font-size: 20px')
            }
        },
        setCurrentRoom(data: IRoom | undefined) {
            this.currentRoom = data
            console.log(this.watches.room)
            this.watches.room.forEach((callback: CallableFunction) => callback())
        },
        setMatch(data?: IMatchRes) {
            this.match = data
            this.watches.match.forEach((callback: CallableFunction) => callback())
        },
        setPropertyMatch(data: { [key: string]: any }) {
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    const element = data[key]
                    const m: any = this.match
                    if (Object.prototype.hasOwnProperty.call(m, key)) {
                        m[key] = element
                    }
                }
            }
            this.watches.match.forEach((callback: CallableFunction) => callback())
        },
        pushChat(data: IChatReceiveMessage) {
            this.watches.chat.forEach((callback: CallableFunction) => callback(data))
        },
        addFriend(data: IFriend) {
            this.player.friends.push(data)
            this.watches.friend.forEach((callback: CallableFunction) => callback(data))
        },
        changeGold(data: number) {
            this.player.gold = data
        },
        pushDataShop(data: IItem) {
            this.dataShop.push({ ...data })
            this.watches.dataShop.forEach((callback) => callback(data))
        },
        pushItemToBag(data: Array<IItemOnBag>) {
            data.forEach((d) => this.player.bag.push({ ...d }))
            this.watches.bag.forEach((callback) => callback(data))
            return
        },
        changeItemOnBag(data: Array<IItemOnBag>) {
            for (const d of data) {
                const item = this.player.bag.find((i) => i._id === d._id)
                if (!item) continue
                item.data = d.data
                item.isWear = d.isWear
                item.levelUp = d.levelUp
            }

            this.watches.bag.forEach((callback) => callback(data))
        },
        updateStatusPlayer(data: Record<string, number>) {
            for (const type in data) {
                if (Object.prototype.hasOwnProperty.call(data, type)) {
                    const value = data[type]
                    const property: IProperty = { type, value }
                    this.watches.status.forEach((callback) => callback(property))
                }
            }
        },
        // setMapDataJSON(name: string, data: string) {
        //     if (!this.match?.mapDataJSON) this.match!.mapDataJSON = {}
        //     this.match!.mapDataJSON[name] = data
        // },
    },
})

export default useMainStore
