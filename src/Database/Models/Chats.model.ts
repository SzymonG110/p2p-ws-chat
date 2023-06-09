import {model, Schema} from 'mongoose'
import Chat from '../../Types/Database/Chat.type'

export const Chats = model<Chat>('Chats', new Schema<Chat>({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    user1: {
        type: String,
        required: true
    },
    user2: {
        type: String,
        required: true
    },
    connectionDate: {
        type: Date,
        required: true
    },
    messages: {
        type: [
            {
                user: {
                    type: String,
                    required: true
                },
                message: {
                    type: String,
                    required: true
                },
                date: {
                    type: Date,
                    required: true
                }
            }
        ],
        default: []
    }
}))