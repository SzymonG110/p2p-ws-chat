"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Index_WebSocket_1 = __importDefault(require("./WebSocket/Index.WebSocket"));
const RouteHandler_1 = __importDefault(require("./RouteHandler"));
const Index_database_1 = __importDefault(require("./Database/Index.database"));
require('dotenv').config();
class Index {
    constructor() {
        this.app = (0, express_1.default)();
        this.wss = Index_WebSocket_1.default;
        new Index_database_1.default();
        this.init();
        new RouteHandler_1.default(this.app);
        this.handler404();
        this.setup();
    }
    init() {
        this.app.set('view engine', 'pug');
        this.app.use(express_1.default.static(`${__dirname}/../public`));
        this.app.set('views', `${__dirname}/../views`);
    }
    handler404() {
        this.app.use((req, res) => {
            res.redirect('/');
        });
    }
    setup() {
        const server = this.app.listen(process.env.PORT, () => {
            console.log(`Listening on port ${process.env.PORT}`);
        });
        server.on('upgrade', (request, socket, head) => {
            this.wss.handleUpgrade(request, socket, head, socket => {
                this.wss.emit('connection', socket, request);
            });
        });
    }
}
new Index();
