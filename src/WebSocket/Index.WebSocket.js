"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexWebSocket = void 0;
const ws_1 = require("ws");
const Handler_WebSocket_1 = __importDefault(require("./Handler.WebSocket"));
const JSON_util_1 = __importDefault(require("../Utils/JSON.util"));
class IndexWebSocket extends ws_1.WebSocketServer {
    constructor(options) {
        super(options);
        this.on('connection', (ws, req) => {
            this.onConnection(ws, req);
        });
        this.on('close', () => this.onClose());
    }
    onConnection(ws, req) {
        const send = (data) => ws.send(JSON.stringify(data));
        send({ m: 'Connected to server' });
        ws.on('message', (message) => {
            const parsedMessage = new JSON_util_1.default().parse(message);
            if (!parsedMessage)
                return send({ m: 'Invalid provided data', a: 'error' });
            new Handler_WebSocket_1.default(parsedMessage, ws, req, send);
        });
    }
    onClose() {
        console.log('Connection closed');
    }
}
exports.IndexWebSocket = IndexWebSocket;
const wss = new IndexWebSocket({
    noServer: true
});
exports.default = wss;
