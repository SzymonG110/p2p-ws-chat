import {WebSocket} from 'ws'
import {IncomingMessage} from 'http'

interface Room {
    WebSocket: WebSocket
    req: IncomingMessage
}

const queue: Room[] = []
const rooms: Map<number, Room[]> = new Map()

export {queue}
export default rooms