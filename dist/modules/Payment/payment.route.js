"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = __importDefault(require("./payment.controller"));
const auth_middleware_1 = require("../../shared/middlewares/auth.middleware");
const validation_middleware_1 = __importDefault(require("../../shared/middlewares/validation.middleware"));
const createPaymentForSession_dto_1 = require("./dto/createPaymentForSession.dto");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
class PaymentRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.paymentController = new payment_controller_1.default();
        this.initRoutes();
    }
    /**
     * @swagger
     * tags:
     *   name: Payment
     *   description: Endpoints for handling payments and Paymob webhook callbacks
     */
    initRoutes() {
        /**
         * @swagger
         * /payment/pay/{sessionId}:
         *   post:
         *     summary: Create a payment for a specific chat session
         *     tags: [Payment]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: sessionId
         *         required: true
         *         schema:
         *           type: string
         *         description: The ID of the chat session to pay for (MongoDB ObjectId)
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               clientEmail:
         *                 type: string
         *                 format: email
         *                 description: Email of the client making the payment
         *                 example: "client@example.com"
         *     responses:
         *       201:
         *         description: Payment link created successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 paymentToken:
         *                   type: string
         *                   example: "IOSJFIOPSDFOPKFPOIWEG5EF547G5ERHWEG..."
         *       400:
         *         description: Validation error or bad request
         *       401:
         *         description: Unauthorized
         */
        this.router.post("/pay/:sessionId", auth_middleware_1.auth, (0, validation_middleware_1.default)(createPaymentForSession_dto_1.createPaymentForSessionSchema), (0, express_async_handler_1.default)(this.paymentController.createPayment));
        this.router.post("/webhook", (0, express_async_handler_1.default)(this.paymentController.handlePaymobWebhook));
    }
}
exports.default = PaymentRouter;
