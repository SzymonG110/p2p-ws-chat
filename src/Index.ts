import express, {Express, Request, Response} from 'express'
import wss, {IndexWebSocket} from './WebSocket/Index.WebSocket'
import RouteHandler from './RouteHandler'

require('dotenv').config()

class Index {
    app: Express = express()
    wss: IndexWebSocket = wss

    constructor() {
        this.init()
        new RouteHandler(this.app)
        this.handler404()
        this.setup()
    }

    init(): void {
        this.app.set('view engine', 'pug')
        this.app.use(express.static(`${__dirname}/../public`))
        this.app.set('views', `${__dirname}/../views`)
    }

    handler404(): void {
        this.app.use((req: Request, res: Response) => {
            res.redirect('/')
        })
    }

    setup(): void {
        const server = this.app.listen(process.env.PORT, () => {
            console.log(`Listening on port ${process.env.PORT}`)
        })

        server.on('upgrade', (request, socket, head) => {
            this.wss.handleUpgrade(request, socket, head, socket => {
                this.wss.emit('connection', socket, request)
            })
        })
    }
}

new Index()