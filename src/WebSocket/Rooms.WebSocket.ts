import {WebSocket} from 'ws'
import {IncomingMessage} from 'http'

interface Partner {
    WebSocket: WebSocket
    req: IncomingMessage
}

const queue: Partner[] = []
const rooms: Map<number, Partner[]> = new Map()

export {queue}
export default rooms