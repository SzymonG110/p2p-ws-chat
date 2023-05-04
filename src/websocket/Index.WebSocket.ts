import {WebSocketServer, ServerOptions, WebSocket} from 'ws'

export class IndexWebSocket extends WebSocketServer {
    constructor(options: ServerOptions) {
        super(options)

        this.on('connection', (ws: WebSocket) => this.onConnection(ws))
        this.on('close', () => this.onClose())
    }

    private onConnection(ws: WebSocket): void {
        const send = (data: object) => ws.send(JSON.stringify(data))

        send({m: 'Connected to server'})

        send({m: 'Waiting for a partner to join'})
    }

    private onClose(): void {
        console.log('Connection closed')
    }
}

const wss = new IndexWebSocket({
    noServer: true
})

export default wss