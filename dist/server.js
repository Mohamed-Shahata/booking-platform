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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const dotenv = __importStar(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv.config({ path: path_1.default.resolve("./src/config/.env"), debug: false });
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const app_1 = __importDefault(require("./app"));
const connectionDB_1 = __importDefault(require("./DB/connectionDB"));
const sessionFinalizer_1 = require("./jobs/sessionFinalizer");
const deleteExpiredUser_job_1 = require("./jobs/deleteExpiredUser.job");
const chat_socket_1 = require("./modules/Chat/chat.socket");
const PORT = process.env.PORT || 3000;
const server = (0, http_1.createServer)(app_1.default);
const io = new socket_io_1.Server(server, {
    cors: { origin: "*" },
});
io.on("connection", (socket) => {
    console.log("✅ [Socket.io] New client connected:", socket.id);
    (0, chat_socket_1.registerChatHandlers)(io, socket);
    socket.on("disconnect", () => {
        console.log("❌ [Socket.io] Client disconnected:", socket.id);
    });
});
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, connectionDB_1.default)();
            console.log("1 - ✅ MongoDB connected successfully");
            (0, deleteExpiredUser_job_1.deletetionExpiredUser)();
            console.log(`2 - ✅ Job cron deleteion user`);
            (0, sessionFinalizer_1.startSessionFinalizer)();
            console.log(`3 - ✅ Start job cron sessions`);
            server.listen(PORT, () => {
                console.log(`🚀 Server & Socket.io running on port ${PORT}`);
            });
        }
        catch (err) {
            console.log("Failed to start server: ", err);
            process.exit(1);
        }
    });
}
startServer();
