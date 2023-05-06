import WebSocketMessage from '../Types/WebSocket.type'
import {WebSocket} from 'ws'
import {IncomingMessage} from 'http'
import rooms, {queue} from './Rooms.WebSocket'
import {Chats} from "../Database/Models/Chats.model";

export default class HandlerWebSocket {

    constructor(private message: WebSocketMessage, private ws: WebSocket, private req: IncomingMessage, private send: (data: object) => void) {
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
        queue.push({WebSocket: this.ws, req: this.req})
        this.send({m: 'Waiting for a partner to join', a: 'room:waiting'})

        this.ws.on('close', () => {
            queue.splice(queue.findIndex(ws => ws.WebSocket === this.ws), 1)
        })

        const findPartner = setInterval(async (): Promise<void> => {
            if (queue.length < 2) return
            const partner = queue.find(ws => ws.WebSocket !== this.ws)
            if (partner) {
                const roomId = (await Chats.countDocuments().exec()) + 1

                if (this.ws.readyState !== WebSocket.OPEN || partner.WebSocket.readyState !== WebSocket.OPEN) return
                clearInterval(findPartner)
                queue.splice(queue.findIndex(ws => ws.WebSocket === this.ws), 1)
                queue.splice(queue.indexOf(partner), 1)
                rooms.set(roomId, [{WebSocket: this.ws, req: this.req}, {
                    WebSocket: partner.WebSocket, req: partner.req
                }])

                const userIp: string = this.req.headers['x-forwarded-for'] as string || '127.0.0.1'
                const partnerIp: string = partner.req.headers['x-forwarded-for'] as string || '127.0.0.1'
                Chats.create({
                    id: roomId, connectionDate: new Date(), user1: userIp, user2: partnerIp
                })

                const sendPartner = (data: object) => partner.WebSocket.send(JSON.stringify(data))

                this.send({m: 'Room created, partner found', roomId: roomId, a: 'room:joined'})
                sendPartner({m: 'Room created, partner found', roomId: roomId, a: 'room:joined'})

                this.ws.on('close', () => {
                    rooms.delete(roomId)
                    sendPartner({m: 'Partner disconnected', a: 'room:partner_disconnected'})
                    partner.WebSocket.close()
                })

                partner.WebSocket.on('close', () => {
                    rooms.delete(roomId)
                    this.send({m: 'Partner disconnected', a: 'room:partner_disconnected'})
                    this.ws.close()
                })
            }
        }, 500)
    }

    async roomSend(): Promise<void> {
        const roomId = this.message.roomId
        const room = rooms.get(roomId)
        if (!room) return this.send({m: 'Room not found', a: 'error'})

        const partner = room.find(ws => ws.WebSocket !== this.ws)
        if (!partner) {
            this.send({m: 'Partner not found', a: 'error'})
            rooms.delete(roomId)
            return
        }

        await Chats.findOneAndUpdate({id: roomId}, {
            $push: {
                messages: {
                    user: this.req.headers['x-forwarded-for'] as string || '127.0.0.1',
                    message: this.message.m, date: new Date()
                }
            }
        }).exec()

        this.send({m: this.message.m, a: 'room:sent'})
        partner.WebSocket.send(JSON.stringify({m: this.message.m, a: 'room:received'}))
    }
}