export interface Message {
    user: string
    message: string
    date: Date
}

export default interface Chat {
    id: number
    user1: string
    user2: string
    connectionDate: Date
    messages: Message[]
}