import {WebSocket} from 'ws'

const queue: WebSocket[] = []
const rooms: Map<number, WebSocket[]> = new Map()

export {queue}
export default rooms