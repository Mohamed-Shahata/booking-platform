"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const session_controller_1 = require("./session.controller");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const auth_middleware_1 = require("../../shared/middlewares/auth.middleware");
const UserRoles_enum_1 = require("../../shared/enums/UserRoles.enum");
const create_dto_1 = require("./dto/create.dto");
const validation_middleware_1 = __importDefault(require("../../shared/middlewares/validation.middleware"));
class SessionRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.sessionController = new session_controller_1.SessionController();
        this.initRoutes();
    }
    /**
     * @swagger
     * tags:
     *   name: Sessions
     *   description: Managing booking sessions between clients and experts
     */
    initRoutes() {
        /**
         * @swagger
         * /sessions/create:
         *   post:
         *     summary: Create a new session between client and expert
         *     tags: [Sessions]
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               expertId:
         *                 type: string
         *                 description: MongoDB ObjectId of the expert
         *                 example: "64f1c5e2a9f1b2d3c4e5f678"
         *               scheduledAt:
         *                 type: string
         *                 format: date-time
         *                 description: Date and time for the session
         *                 example: "2025-11-10T14:30:00Z"
         *               durationMinutes:
         *                 type: number
         *                 description: Duration of the session in minutes (30-180)
         *                 example: 60
         *               price:
         *                 type: number
         *                 description: Price of the session
         *                 example: 100
         *     responses:
         *       201:
         *         description: Session created successfully
         *       400:
         *         description: Validation failed
         *       401:
         *         description: Unauthorized
         *       403:
         *         description: User is not allowed
         */
        this.router.post("/create", (0, validation_middleware_1.default)(create_dto_1.createSessionSchema), auth_middleware_1.auth, (0, auth_middleware_1.authRoles)(UserRoles_enum_1.UserRoles.CLIENT, UserRoles_enum_1.UserRoles.ADMIN), (0, express_async_handler_1.default)(this.sessionController.createSession));
    }
}
exports.default = SessionRouter;
