"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chats = void 0;
const mongoose_1 = require("mongoose");
exports.Chats = (0, mongoose_1.model)('Chats', new mongoose_1.Schema({
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
}));
