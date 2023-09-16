import type { Socket } from 'socket.io-client'

export default interface IState {
    game: Phaser.Game | undefined
    socket: Socket
    zoom: number
    width: number
    height: number
    player: IPlayer
}

interface IPlayer {
    _id: string | undefined
    uid: string | undefined
    socketId: string | undefined
    clientId: string | undefined
    name: string | undefined
    email: string | undefined
    picture: string | undefined
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
