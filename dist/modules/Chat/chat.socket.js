"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerChatHandlers = void 0;
const chat_model_1 = __importDefault(require("../../DB/model/chat.model"));
const user_model_1 = __importDefault(require("../../DB/model/user.model"));
const UserRoles_enum_1 = require("../../shared/enums/UserRoles.enum");
const session_model_1 = __importDefault(require("../../DB/model/session.model"));
const session_enum_1 = require("../Session/session.enum");
const registerChatHandlers = (io, socket) => {
    console.log(`Socket connected: ${socket.id}`);
    socket.on("join-room", (_a) => __awaiter(void 0, [_a], void 0, function* ({ sessionId, userId }) {
        try {
            if (!sessionId || !userId)
                return socket.emit("error", { message: "Missing join-room data" });
            const roomId = String(sessionId);
            const session = yield session_model_1.default.findById(sessionId);
            if (!session) {
                socket.emit("session-closed", {
                    message: "This session does not exist.",
                });
                return;
            }
            if (!session || session.status !== session_enum_1.SessionStatus.IN_PROGRESS) {
                socket.emit("session-closed", {
                    message: `This session is ${session.status}, you can't join.`,
                });
                return;
            }
            socket.join(roomId);
            console.log(`User ${userId} joined room ${roomId}`);
            const user = yield user_model_1.default.findById(userId);
            if ((user === null || user === void 0 ? void 0 : user.role) === UserRoles_enum_1.UserRoles.EXPERT) {
                yield session_model_1.default.findByIdAndUpdate(sessionId, {
                    expertJoinedAt: new Date(),
                });
            }
            socket.to(roomId).emit("user-joined", { userId });
        }
        catch (err) {
            console.error("Error in join-room:", err);
            socket.emit("error", { message: "Server error while joining room" });
        }
    }));
    socket.on("send-message", (_a) => __awaiter(void 0, [_a], void 0, function* ({ sessionId, from, to, message }) {
        try {
            if (!sessionId || !message)
                return socket.emit("error", { message: "Missing message data" });
            const roomId = String(sessionId);
            const session = yield session_model_1.default.findById(sessionId);
            if (!session || session.status !== session_enum_1.SessionStatus.IN_PROGRESS) {
                socket.emit("session-closed", {
                    message: `Can't send message. Session is ${(session === null || session === void 0 ? void 0 : session.status) || "invalid"}.`,
                });
                return;
            }
            const msg = yield chat_model_1.default.create({
                sessionId,
                from,
                to,
                message,
                createdAt: new Date(),
            });
            console.log("Message saved:", msg);
            io.to(roomId).emit("new-message", msg);
        }
        catch (err) {
            console.error("Error in send-message:", err);
            socket.emit("error", { message: "Server error while sending message" });
        }
    }));
    socket.on("leave-room", ({ sessionId, userId }) => {
        const roomId = String(sessionId);
        socket.leave(roomId);
        socket.to(roomId).emit("user-left", { userId });
    });
};
exports.registerChatHandlers = registerChatHandlers;
