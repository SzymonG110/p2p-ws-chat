import {connect} from 'mongoose'

export default class IndexDatabase {
    constructor() {
        connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`)
        console.log('')
    }
}

export * from './Models/Chats.model'