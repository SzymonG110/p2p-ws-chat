import {WebSocketServer, ServerOptions,} from 'ws'

export class IndexWebSocket extends WebSocketServer {
    constructor(options: ServerOptions) {
        super(options)
    }
}

const wss = new IndexWebSocket({
    noServer: true
})

export default wss