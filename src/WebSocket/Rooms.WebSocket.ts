import {WebSocket} from 'ws'

const queue: WebSocket[] = []
const rooms: Map<number, WebSocket[]> = new Map()

export class RoomsWebSocket {

}

export {queue}
export default rooms