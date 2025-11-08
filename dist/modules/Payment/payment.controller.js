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
exports.PaymentController = void 0;
const statusCode_enum_1 = require("../../shared/enums/statusCode.enum");
const sendResponse_1 = __importDefault(require("../../shared/utils/sendResponse"));
const payment_service_1 = __importDefault(require("./payment.service"));
const mongoose_1 = require("mongoose");
const session_enum_1 = require("../Session/session.enum");
const app_error_1 = __importDefault(require("../../shared/errors/app.error"));
const session_model_1 = __importDefault(require("../../DB/model/session.model"));
class PaymentController {
    constructor() {
        this.createPayment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const dto = req.body;
            const sessionId = new mongoose_1.Types.ObjectId(req.params.sessionId);
            const result = yield this.paymentService.createPaymentForSession(sessionId, dto);
            (0, sendResponse_1.default)(res, statusCode_enum_1.StatusCode.CREATED, { data: { result }, success: true });
        });
        this.handlePaymobWebhook = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = req.body.obj;
            const orderId = data.order.id;
            const success = data.success;
            const session = yield session_model_1.default.findOne({ paymobOrderId: orderId });
            if (!session)
                throw new app_error_1.default("Session not found", statusCode_enum_1.StatusCode.NOT_FOUND);
            if (success) {
                session.paymentStatus = session_enum_1.PaymentStatus.PAID;
                yield session.save();
            }
            (0, sendResponse_1.default)(res, statusCode_enum_1.StatusCode.OK, {
                success: true,
                message: "Webhook received",
            });
        });
        this.paymentService = new payment_service_1.default();
    }
}
exports.PaymentController = PaymentController;
exports.default = PaymentController;
