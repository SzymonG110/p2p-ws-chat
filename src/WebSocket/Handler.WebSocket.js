"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const Rooms_WebSocket_1 = __importStar(require("./Rooms.WebSocket"));
const Chats_model_1 = require("../Database/Models/Chats.model");
class HandlerWebSocket {
    constructor(message, ws, req, send) {
        this.message = message;
        this.ws = ws;
        this.req = req;
        this.send = send;
        this.handle();
    }
    handle() {
        if (this.message.m)
            this.message.m = this.message.m.trim();
        switch (this.message.a) {
            case 'ping':
                this.send({ m: 'Pong', a: 'ping' });
                break;
            case 'room:join':
                this.roomJoin();
                break;
            case 'room:send':
                this.roomSend();
                break;
            default:
                this.send({ m: `Invalid action: ${this.message.a}`, a: 'error:invalid_action' });
                break;
        }
    }
    roomJoin() {
        this.send({ m: 'Joining to queue', a: 'room:joining' });
        Rooms_WebSocket_1.queue.push({ WebSocket: this.ws, req: this.req });
        this.send({ m: 'Waiting for a partner to join', a: 'room:waiting' });
        this.ws.on('close', () => {
            Rooms_WebSocket_1.queue.splice(Rooms_WebSocket_1.queue.findIndex(ws => ws.WebSocket === this.ws), 1);
        });
        const findPartner = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            if (Rooms_WebSocket_1.queue.length < 2)
                return;
            const partner = Rooms_WebSocket_1.queue.find(ws => ws.WebSocket !== this.ws);
            if (partner) {
                const roomId = (yield Chats_model_1.Chats.countDocuments().exec()) + 1;
                if (this.ws.readyState !== ws_1.WebSocket.OPEN || partner.WebSocket.readyState !== ws_1.WebSocket.OPEN)
                    return;
                clearInterval(findPartner);
                Rooms_WebSocket_1.queue.splice(Rooms_WebSocket_1.queue.findIndex(ws => ws.WebSocket === this.ws), 1);
                Rooms_WebSocket_1.queue.splice(Rooms_WebSocket_1.queue.indexOf(partner), 1);
                Rooms_WebSocket_1.default.set(roomId, [{ WebSocket: this.ws, req: this.req }, {
                        WebSocket: partner.WebSocket, req: partner.req
                    }]);
                const userIp = this.req.headers['x-forwarded-for'] || '127.0.0.1';
                const partnerIp = partner.req.headers['x-forwarded-for'] || '127.0.0.1';
                Chats_model_1.Chats.create({
                    id: roomId, connectionDate: new Date(), user1: userIp, user2: partnerIp
                });
                const sendPartner = (data) => partner.WebSocket.send(JSON.stringify(data));
                this.send({ m: 'Room created, partner found', roomId: roomId, a: 'room:joined' });
                sendPartner({ m: 'Room created, partner found', roomId: roomId, a: 'room:joined' });
                this.ws.on('close', () => {
                    Rooms_WebSocket_1.default.delete(roomId);
                    sendPartner({ m: 'Partner disconnected', a: 'room:partner_disconnected' });
                    partner.WebSocket.close();
                });
                partner.WebSocket.on('close', () => {
                    Rooms_WebSocket_1.default.delete(roomId);
                    this.send({ m: 'Partner disconnected', a: 'room:partner_disconnected' });
                    this.ws.close();
                });
            }
        }), 500);
    }
    roomSend() {
        return __awaiter(this, void 0, void 0, function* () {
            const roomId = this.message.roomId;
            const room = Rooms_WebSocket_1.default.get(roomId);
            if (!room)
                return this.send({ m: 'Room not found', a: 'error:room_not_found' });
            const partner = room.find(ws => ws.WebSocket !== this.ws);
            if (!partner) {
                this.send({ m: 'Partner not found', a: 'error:partner_not_found' });
                Rooms_WebSocket_1.default.delete(roomId);
                return;
            }
            if (room.findIndex(ws => ws.WebSocket === this.ws) === -1)
                return this.send({ m: 'You are not in this room', a: 'error:room_not_found' });
            if (!this.message.m)
                return this.send({ m: 'Message is empty', a: 'error:empty_message' });
            if (this.message.m.length > 5000)
                return this.send({
                    m: 'Message is too long (max 5000 chars)',
                    a: 'error:long_message'
                });
            yield Chats_model_1.Chats.findOneAndUpdate({ id: roomId }, {
                $push: {
                    messages: {
                        user: this.req.headers['x-forwarded-for'] || '127.0.0.1',
                        message: this.message.m, date: new Date()
                    }
                }
            }).exec();
            this.send({ m: this.message.m, a: 'room:sent' });
            partner.WebSocket.send(JSON.stringify({ m: this.message.m, a: 'room:received' }));
        });
    }
}
exports.default = HandlerWebSocket;
