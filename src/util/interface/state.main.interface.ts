import type { Socket } from 'socket.io-client'

export default interface IState {
    game: Phaser.Game | undefined
    socket: Socket
    zoom: number
    width: number
    height: number
}
