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
exports.sessionService = exports.SessionService = void 0;
const session_model_1 = __importDefault(require("../../DB/model/session.model"));
const session_enum_1 = require("./session.enum");
const app_error_1 = __importDefault(require("../../shared/errors/app.error"));
const statusCode_enum_1 = require("../../shared/enums/statusCode.enum");
const user_model_1 = __importDefault(require("../../DB/model/user.model"));
class SessionService {
    constructor() {
        this.createSession = (userId, dto) => __awaiter(this, void 0, void 0, function* () {
            const { expertId, scheduledAt, durationMinutes, price } = dto;
            const now = new Date();
            const scheduledAtDate = new Date(scheduledAt);
            const minAllowedTime = new Date(now.getTime() + 30 * 60 * 1000);
            const expert = yield user_model_1.default.findById(expertId);
            if (!expert || !expert.isVerified)
                throw new app_error_1.default("Expert not found", statusCode_enum_1.StatusCode.NOT_FOUND);
            if (scheduledAtDate < minAllowedTime) {
                throw new app_error_1.default("The scheduled time must be at least 30 minutes in the future.", statusCode_enum_1.StatusCode.BAD_REQUEST);
            }
            const session = yield session_model_1.default.create({
                userId,
                expertId,
                scheduledAt,
                durationMinutes,
                price,
            });
            return session;
        });
        this.markPaid = (sessionId, dto) => __awaiter(this, void 0, void 0, function* () {
            const { paymobOrderId, paymobPaymentToken } = dto;
            const session = yield session_model_1.default.findByIdAndUpdate(sessionId, { paymentStatus: session_enum_1.PaymentStatus.PAID, paymobOrderId, paymobPaymentToken }, { new: true });
            if (!session)
                throw new app_error_1.default("Seession not found", statusCode_enum_1.StatusCode.NOT_FOUND);
            return session;
        });
        this.startSession = (sessionId) => __awaiter(this, void 0, void 0, function* () {
            const session = yield session_model_1.default.findByIdAndUpdate(sessionId, { status: session_enum_1.SessionStatus.IN_PROGRESS }, { new: true });
            if (!session)
                throw new app_error_1.default("Seession not found", statusCode_enum_1.StatusCode.NOT_FOUND);
            return session;
        });
        this.completeSession = (sessionId) => __awaiter(this, void 0, void 0, function* () {
            const session = yield session_model_1.default.findByIdAndUpdate(sessionId, { status: session_enum_1.SessionStatus.COMPLETED }, { new: true });
            if (!session)
                throw new app_error_1.default("Seession not found", statusCode_enum_1.StatusCode.NOT_FOUND);
            return session;
        });
        this.refundSession = (sessionId) => __awaiter(this, void 0, void 0, function* () {
            const session = yield session_model_1.default.findByIdAndUpdate(sessionId, {
                paymentStatus: session_enum_1.PaymentStatus.REFUNDED,
                status: session_enum_1.SessionStatus.CANCELLED,
            }, { new: true });
            if (!session)
                throw new app_error_1.default("Seession not found", statusCode_enum_1.StatusCode.NOT_FOUND);
            return session;
        });
    }
}
exports.SessionService = SessionService;
exports.sessionService = new SessionService();
