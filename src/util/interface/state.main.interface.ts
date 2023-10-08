import type { Socket } from 'socket.io-client'

export default interface IState {
    game: Phaser.Game | undefined
    socket: Socket | null
    zoom: number
    width: number
    height: number
    player: IPlayer
    chatInput: {
        to: {
            name: string
            _id: string
        }
        message: string
    }
    currentRoom: IRoom | undefined
    chatWorld: Array<{
        type: string | undefined
        value: string
        from: IPlayer
    }>
}

export interface IPlayer {
    _id: string | undefined
    uid: string | undefined
    socketId: string | undefined
    clientId: string | undefined
    name: string | undefined
    email: string | undefined
    picture: string | undefined
    looks: { [key: string]: string }
    level: number | undefined
    HP: number | undefined
    STA: number | undefined
    ATK: number | undefined
    DEF: number | undefined
    LUK: number | undefined
    AGI: number | undefined
    character: {
        [key: string]: any
    }
    skills: Array<any>
    bag: Array<any>
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
