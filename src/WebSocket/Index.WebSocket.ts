import {ServerOptions, WebSocket, WebSocketServer} from 'ws'
import HandlerWebSocket from "./Handler.WebSocket";
import JSONUtil from '../Utils/JSON.util'

export class IndexWebSocket extends WebSocketServer {
    constructor(options: ServerOptions) {
        super(options)

        this.on('connection', (ws: WebSocket) => this.onConnection(ws))
        this.on('close', () => this.onClose())
    }

    private onConnection(ws: WebSocket): void {
        const send = (data: object) => ws.send(JSON.stringify(data))

        send({m: 'Connected to server'})

        ws.on('message', (message: string) => {
            const parsedMessage = new JSONUtil().parse(message)
            if (!parsedMessage)
                return send({m: 'Invalid provided data', a: 'error'})
            new HandlerWebSocket(parsedMessage, ws, send)
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