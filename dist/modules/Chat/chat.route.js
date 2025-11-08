"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chat_controller_1 = __importDefault(require("./chat.controller"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const auth_middleware_1 = require("../../shared/middlewares/auth.middleware");
const UserRoles_enum_1 = require("../../shared/enums/UserRoles.enum");
class ChatRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.chatController = new chat_controller_1.default();
        this.initRoutes();
    }
    /**
     * @swagger
     * tags:
     *   name: Chat
     *   description: Endpoints for managing chat messages between clients and experts, accessible only to authorized users
     */
    initRoutes() {
        /**
         * @swagger
         * /chat/{sessionId}:
         *   get:
         *     tags:
         *       - Chat
         *     summary: Get chat messages for a specific session
         *     description: Returns all chat messages belonging to a specific session. Only ADMIN users are allowed.
         *     security:
         *       - BearerAuth: []
         *     parameters:
         *       - in: path
         *         name: sessionId
         *         required: true
         *         schema:
         *           type: string
         *         description: The ID of the chat session
         *     responses:
         *       200:
         *         description: Chat messages retrieved successfully
         *       401:
         *         description: Unauthorized (Invalid or missing token)
         *       403:
         *         description: Forbidden (Only Admin can access this)
         *       404:
         *         description: Session not found
         */
        this.router.get("/:sessionId", auth_middleware_1.auth, (0, auth_middleware_1.authRoles)(UserRoles_enum_1.UserRoles.ADMIN), (0, express_async_handler_1.default)(this.chatController.getMessagesBySession));
    }
}
exports.default = ChatRouter;
