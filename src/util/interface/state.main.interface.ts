import type { Socket } from 'socket.io-client'
import type { IMatchRes } from './index.interface'

export default interface IState {
    game: Phaser.Game | undefined
    socket: Socket | null
    zoom: number
    width: number
    height: number
    player: IPlayer
    currentRoom: IRoom | undefined
    chatWorld: Array<IChat>
    match: IMatchRes | undefined
    dataShop: Array<IItem>
    watches: {
        room: Array<CallableFunction>
        chat: Array<CallableFunction>
        match: Array<CallableFunction>
        friend: Array<CallableFunction>
        dataShop: Array<CallableFunction>
        bag: Array<CallableFunction>
    }
}

export interface IItem {
    _id: string
    name: string
    type: string
    canWear: boolean
    imgItem: string
    texture: string
    hasPowerSkill: string
    description: string
    properties: Array<IProperty>
    price: number
    isSale: boolean
}

export interface IProperty {
    type: string
    value: number
}

export interface IChat {
    type: string | undefined
    value: string
    from: IPlayer
}

export interface IPlayer {
    _id: string | undefined
    uid: string | undefined
    socketId: string | undefined
    clientId: string | undefined
    name: string | undefined
    email: string | undefined
    picture: string | undefined
    friends: Array<IFriend>
    looks: { [key: string]: string }
    level: number | undefined
    HP: number | undefined
    STA: number | undefined
    ATK: number | undefined
    DEF: number | undefined
    LUK: number | undefined
    AGI: number | undefined
    gold: number
    character: {
        [key: string]: any
    }
    skills: Array<any>
    bag: Array<IItemOnBag>
}

export interface IItemOnBag {
    _id: string
    data: {
        _id: string
        name: string
        type: string
        canWear: boolean
        imgItem: string
        texture: string
        hasPowerSkill: string
        description: string
        properties: [IProperty]
    }
    isWear: boolean
    levelUp: number
}

export interface IFriend {
    _id: string
    name: string
    level?: number
    picture?: string
    socketId: string
}

export interface IRoom {
    _id: string
    type: string
    typeMap: string
    players: Array<IPlayerOnRoom>
    chatRoom: Array<{
        type: string | undefined
        value: string
        from: IPlayer
    }>
    maxNum: number
}

export interface IPlayerOnRoom {
    player: IPlayer
    isOnRoom: boolean
    isRoomMaster: boolean
    position: number
    isReady: boolean
    updatedAt: string
    createdAt: string
}

export interface IPlayerRemoved {
    player: string
    position: number
    newMaster: string | undefined
}

export interface IReadyRes {
    _id: string
    player: {
        _id: string
        isOnRoom: boolean
        isRoomMaster: boolean
        position: number
        isReady: boolean
        updatedAt: string
        createdAt: string
    }
}
