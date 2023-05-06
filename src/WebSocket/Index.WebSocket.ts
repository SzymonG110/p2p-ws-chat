import {ServerOptions, WebSocket, WebSocketServer} from 'ws'
import {IncomingMessage} from 'http'
import HandlerWebSocket from "./Handler.WebSocket";
import JSONUtil from '../Utils/JSON.util'

export class IndexWebSocket extends WebSocketServer {
    constructor(options: ServerOptions) {
        super(options)

        this.on('connection', (ws: WebSocket, req: IncomingMessage) => {
            this.onConnection(ws, req)
        })
        this.on('close', () => this.onClose())
    }

    private onConnection(ws: WebSocket, req: IncomingMessage): void {
        const send = (data: object) => ws.send(JSON.stringify(data))

        send({m: 'Connected to server'})

        ws.on('message', (message: string) => {
            const parsedMessage = new JSONUtil().parse(message)
            if (!parsedMessage)
                return send({m: 'Invalid provided data', a: 'error'})
            new HandlerWebSocket(parsedMessage, ws, req, send)
        })

    }

    private onClose(): void {
        console.log('Connection closed')
    }
}

const wss = new IndexWebSocket({
    noServer: true
})

export default wss