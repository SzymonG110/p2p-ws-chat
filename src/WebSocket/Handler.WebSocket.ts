import WebSocketMessage from '../Types/WebSocket.type'
import {WebSocket} from 'ws'
import rooms, {queue} from './Rooms.WebSocket'

export default class HandlerWebSocket {
    constructor(private message: WebSocketMessage, private ws: WebSocket, private send: (data: object) => void) {
        this.handle()
    }

    private handle(): void {
        switch (this.message.a) {
            case 'ping':
                this.send({m: 'Pong', a: 'ping'})
                break;

            case 'room:join':
                this.roomJoin()
                break;

            case 'room:send':
                this.roomSend()
                break;

            default:
                this.send({m: `Invalid action: ${this.message.a}`, a: 'error'})
                break;
        }
    }

    private roomJoin(): void {
        this.send({m: 'Joining to queue', a: 'room:joining'})
        queue.push(this.ws)
        this.send({m: 'Waiting for a partner to join', a: 'room:waiting'})

        this.ws.on('close', () => {
            queue.splice(queue.indexOf(this.ws), 1)
        })

        const findPartner = setInterval(() => {
            if (queue.length < 2) return
            const partner = queue.filter(ws => ws !== this.ws)[0]
            if (partner) {
                const roomId = 1

                if (this.ws.readyState !== WebSocket.OPEN || partner.readyState !== WebSocket.OPEN) return
                clearInterval(findPartner)
                queue.splice(queue.indexOf(this.ws), 1)
                queue.splice(queue.indexOf(partner), 1)
                rooms.set(roomId, [this.ws, partner])

                const sendPartner = (data: object) => partner.send(JSON.stringify(data))

                this.send({m: 'Room created, partner found', roomId: roomId, a: 'room:joined'})
                sendPartner({m: 'Room created, partner found', roomId: roomId, a: 'room:joined'})

                this.ws.on('close', () => {
                    rooms.delete(roomId)
                    sendPartner({m: 'Partner disconnected', a: 'room:partner_disconnected'})
                    partner.close()
                })

                partner.on('close', () => {
                    rooms.delete(roomId)
                    this.ws.send(JSON.stringify({m: 'Partner disconnected', a: 'room:partner_disconnected'}))
                    this.ws.close()
                })
            }
        }, 500)
    }

    private roomSend(): void {
        const roomId = this.message.roomId
        const room = rooms.get(roomId)
        if (!room) return this.send({m: 'Room not found', a: 'error'})

        const partner = room.filter(ws => ws !== this.ws)[0]
        if (!partner) {
            this.send({m: 'Partner not found', a: 'error'})
            room.splice(room.indexOf(this.ws), 1)
            return
        }

        partner.send(JSON.stringify({m: this.message.m, a: 'room:received'}))
    }
}