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
const axios_1 = __importDefault(require("axios"));
const session_model_1 = __importDefault(require("../../DB/model/session.model"));
const session_service_1 = require("../Session/session.service");
const app_error_1 = __importDefault(require("../../shared/errors/app.error"));
const statusCode_enum_1 = require("../../shared/enums/statusCode.enum");
const session_enum_1 = require("../Session/session.enum");
const expertProfile_model_1 = __importDefault(require("../../DB/model/expertProfile.model"));
const PAYMOB_API = "https://accept.paymob.com/api";
class PaymentService {
    constructor() {
        this.auth = () => __awaiter(this, void 0, void 0, function* () {
            const res = yield axios_1.default.post(`${PAYMOB_API}/auth/tokens`, {
                api_key: process.env.PAYMOB_API_KEY,
            });
            return res.data.token;
        });
        this.createPaymobOrder = (amount, token) => __awaiter(this, void 0, void 0, function* () {
            const res = yield axios_1.default.post(`${PAYMOB_API}/ecommerce/orders`, {
                auth_token: token,
                amount_cents: Math.round(amount * 100),
                currency: "EGP",
                delivery_needed: false,
                items: [],
            });
            return res.data;
        });
        this.createPaymentKey = (amount, orderId, clientEmail, token) => __awaiter(this, void 0, void 0, function* () {
            const billingData = {
                apartment: "NA",
                email: clientEmail,
                floor: "NA",
                first_name: "Client",
                last_name: "User",
                phone_number: "+201000000000",
                street: "NA",
                building: "NA",
                city: "Cairo",
                country: "EG",
                state: "Cairo",
            };
            const res = yield axios_1.default.post(`${PAYMOB_API}/acceptance/payment_keys`, {
                auth_token: token,
                amount_cents: Math.round(amount * 100),
                currency: "EGP",
                order_id: orderId,
                billing_data: billingData,
                integration_id: Number(process.env.PAYMOB_INTEGRATION_ID),
            });
            return res.data;
        });
        this.createPaymentForSession = (sessionId, dto) => __awaiter(this, void 0, void 0, function* () {
            const { clientEmail } = dto;
            const session = yield session_model_1.default.findById(sessionId);
            if (!session)
                throw new app_error_1.default("Session not found", statusCode_enum_1.StatusCode.NOT_FOUND);
            if (session.paymentStatus === session_enum_1.PaymentStatus.PAID)
                throw new app_error_1.default("Already paid", statusCode_enum_1.StatusCode.NOT_FOUND);
            const token = yield this.auth();
            const order = yield this.createPaymobOrder(session.price, token);
            const paymentKey = yield this.createPaymentKey(session.price, order.id, clientEmail, token);
            session.paymobOrderId = order.id;
            session.paymobPaymentToken = paymentKey.token;
            yield session.save();
            const iframeUrl = `https://accept.paymobsolutions.com/api/acceptance/863248?payment_token=${paymentKey.token}`; // or direct accept iframe
            return { iframeUrl, paymentToken: paymentKey.token };
        });
        // Platform payout (placeholder) — implement via bank transfer or Paymob payout if available
        this.payoutToExpert = (sessionId) => __awaiter(this, void 0, void 0, function* () {
            const session = yield session_model_1.default.findById(sessionId);
            if (!session)
                throw new Error("Session not found");
            if (session.status !== session_enum_1.SessionStatus.COMPLETED)
                throw new app_error_1.default("Session not completed yet", statusCode_enum_1.StatusCode.BAD_REQUEST);
            const commissionPercent = Number(process.env.PLATFORM_COMMISSION_PERCENT || 10);
            const commission = Math.round((session.price * commissionPercent) / 100);
            const expertAmount = session.price - commission;
            // For demo: increase expert wallet
            yield expertProfile_model_1.default.findOneAndUpdate({ userId: session.expertId }, { $inc: { wallet: expertAmount } }, { new: true });
            return { commission, expertAmount };
        });
        this.sessionService = new session_service_1.SessionService();
    }
}
exports.default = PaymentService;
