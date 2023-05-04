import express, {Express, Request, Response} from 'express'
import wss, {IndexWebSocket} from './websocket/Index.WebSocket'
import * as process from "process";

require('dotenv').config()


class Index {
    app: Express = express()
    ws: IndexWebSocket = wss

    constructor() {
        this.init()
        this.hanler404()
        this.setup()
    }

    init(): void {
        this.app.set('view engine', 'pug')
        this.app.use(express.static(`${__dirname}/../public`))
        this.app.set('views', `${__dirname}/../views`)
    }

    hanler404(): void {
        this.app.use((req: Request, res: Response) => {
            res.redirect('/')
        })
    }

    setup(): void {
        const server = this.app.listen(process.env.PORT, () => {
            console.log(`Listening on port ${process.env.PORT}`)
        })

        server.on('upgrade', (request, socket, head) => {
            wss.handleUpgrade(request, socket, head, socket => {
                wss.emit('connection', socket, request)
            })
        })
    }
}

new Index()