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
exports.startSessionFinalizer = startSessionFinalizer;
const node_cron_1 = __importDefault(require("node-cron"));
const session_model_1 = __importDefault(require("../DB/model/session.model"));
const session_service_1 = require("../modules/Session/session.service");
const payment_service_1 = __importDefault(require("../modules/Payment/payment.service"));
const session_enum_1 = require("../modules/Session/session.enum");
const sessionService = new session_service_1.SessionService();
const paymentService = new payment_service_1.default();
function startSessionFinalizer() {
    const job = node_cron_1.default.schedule("*/1 * * * *", () => __awaiter(this, void 0, void 0, function* () {
        const now = new Date();
        const gracePeriod = 10 * 60 * 1000; // 10 min
        // 1️⃣ Start sessions when their time arrives
        const toStart = yield session_model_1.default.find({
            status: session_enum_1.SessionStatus.SCHEDULED,
            paymentStatus: session_enum_1.PaymentStatus.PAID,
            scheduledAt: { $lte: now },
        });
        for (const s of toStart) {
            yield sessionService.startSession(s._id);
            console.log(`🚀 Session ${s._id} started`);
        }
        // 2️⃣ Complete sessions when duration time has passed
        const inProgressSessions = yield session_model_1.default.find({
            status: session_enum_1.SessionStatus.IN_PROGRESS,
            paymentStatus: session_enum_1.PaymentStatus.PAID,
        });
        for (const s of inProgressSessions) {
            const sessionEndTime = new Date(s.scheduledAt.getTime() + s.durationMinutes * 60 * 1000);
            if (now >= sessionEndTime) {
                yield sessionService.completeSession(s._id);
                s.paymentStatus = session_enum_1.PaymentStatus.HELD;
                s.payoutReleaseAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
                yield s.save();
                console.log(`💰 Session ${s._id} funds held until ${s.payoutReleaseAt}`);
            }
        }
        // 3️⃣ Refund sessions if expert never joined after grace period
        const toRefund = yield session_model_1.default.find({
            status: session_enum_1.SessionStatus.IN_PROGRESS,
            paymentStatus: session_enum_1.PaymentStatus.PAID,
            expertJoinedAt: null,
            scheduledAt: { $lte: new Date(now.getTime() - gracePeriod) },
        });
        for (const s of toRefund) {
            yield sessionService.refundSession(s._id);
            console.log(`💸 Session ${s._id} refunded (expert not joined)`);
        }
    }));
    job.start();
}
