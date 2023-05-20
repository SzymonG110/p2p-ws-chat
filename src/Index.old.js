"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = __importDefault(require("ws"));
const app = (0, express_1.default)();
app.set('view engine', 'pug');
app.set('views', `${__dirname}/../views`);
app.use(express_1.default.static(`${__dirname}/../public`));
const wss = new ws_1.default.Server({
    noServer: true
});
const waitingUsers = [];
const findWaitingUser = () => {
    if (waitingUsers.length > 0) {
        const index = Math.floor(Math.random() * waitingUsers.length);
        return {
            index,
            user: waitingUsers[index]
        };
    }
    return null;
};
wss.on('connection', (ws) => {
    ws.send('Waiting for a partner to join');
    const user = {
        id: Date.now(),
        ws
    };
    waitingUsers.push(user);
    ws.on('close', () => {
        waitingUsers.splice(waitingUsers.indexOf(user), 1);
    });
    const interval = setInterval(() => {
        const peer = findWaitingUser();
        if (peer && peer.user.id !== user.id) {
            waitingUsers.splice(peer.index, 1);
            clearInterval(interval);
            ws.send(`Connected to user`);
            const room = [user, peer.user];
            ws.on('message', (message) => {
                room.forEach((user) => {
                    user.ws.send(`User: ${message}`);
                });
            });
            ws.on('close', () => {
                room.forEach((user) => {
                    if (user.ws !== ws) {
                        user.ws.send(`User left the chat`);
                    }
                });
            });
        }
    }, 500);
});
app.get('/', (req, res) => {
    res.render('home');
});
const server = app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, socket => {
        wss.emit('connection', socket, request);
    });
});
