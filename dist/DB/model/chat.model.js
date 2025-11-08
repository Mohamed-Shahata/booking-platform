"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const chatSchema = new mongoose_1.Schema({
    sessionId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Session", required: true },
    from: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    to: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
}, { timestamps: true });
const Chat = (0, mongoose_1.model)("Chat", chatSchema);
exports.default = Chat;
