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
    currentRoom:
        | undefined
        | {
              _id: string
              type: string
              typeMap: string
              players: Array<{
                  player: IPlayer
                  isOnRoom: boolean
                  isRoomMaster: boolean
              }>
              chatRoom: Array<{
                  type: string | undefined
                  value: string
                  from: IPlayer
              }>
              max: number
          }
    chatWorld: Array<{
        type: string | undefined
        value: string
        from: IPlayer
    }>
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
