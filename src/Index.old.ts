import express from 'express'
import WebSocket from 'ws'

interface User {
    id: number
    ws: WebSocket
}

const app = express()
app.set('view engine', 'pug')
app.set('views', `${__dirname}/../views`)
app.use(express.static(`${__dirname}/../public`))

const wss = new WebSocket.Server({
    noServer: true
})

const waitingUsers: User[] = []

interface FindWaitingUser {
    index: number
    user: User
}

const findWaitingUser = (): FindWaitingUser | null => {
    if (waitingUsers.length > 0) {
        const index = Math.floor(Math.random() * waitingUsers.length)
        return {
            index,
            user: waitingUsers[index]
        }
    }

    return null
}

wss.on('connection', (ws: WebSocket) => {
    ws.send('Waiting for a partner to join')

    const user: User = {
        id: Date.now(),
        ws
    }
    waitingUsers.push(user)

    ws.on('close', () => {
        waitingUsers.splice(waitingUsers.indexOf(user), 1)
    })

    const interval = setInterval(() => {
        let peer = findWaitingUser()

        if (peer && peer.user.id !== user.id) {
            waitingUsers.splice(peer.index, 1)
            clearInterval(interval)

            ws.send(`Connected to user`)

            const room = [user, peer.user]

            ws.on('message', (message: string) => {
                room.forEach((user) => {
                    user.ws.send(`User: ${message}`)
                })
            })

            ws.on('close', () => {
                room.forEach((user) => {
                    if (user.ws !== ws) {
                        user.ws.send(`User left the chat`)
                    }
                })
            })
        }
    }, 500)
})

app.get('/', (req, res) => {
    res.render('home')
})

const server = app.listen(3000, () => {
    console.log('Server listening on port 3000')
})

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, socket => {
        wss.emit('connection', socket, request)
    })
})