export default interface WebSocketMessage {
    m?: string // message
    a?: string // action

    [key: string]: any
}