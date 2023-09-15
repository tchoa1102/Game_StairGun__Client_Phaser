class StickService {
    constructor() {}

    stand(socket: any, data: any, event: string) {
        socket.emit('stick-stand', {
            _id: data._id,
            socketId: data.socketId,
            event,
        })
    }

    runLeft(socket: any, data: any, event: string) {
        socket.emit('stick-left', {
            _id: data._id,
            socketId: data.socketId,
            event,
        })
    }

    runRight(socket: any, data: any, event: string) {
        socket.emit('stick-right', {
            _id: data._id,
            socketId: data.socketId,
            event,
        })
    }

    jumpLeft(socket: any, data: any, event: string) {
        socket.emit('stick-jump-left', {
            _id: data._id,
            socketId: data.socketId,
            event,
        })
    }

    jumpRight(socket: any, data: any, event: string) {
        socket.emit('stick-jump-right', {
            _id: data._id,
            socketId: data.socketId,
            event,
        })
    }
}

export default new StickService()
