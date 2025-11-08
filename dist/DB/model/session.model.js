"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const session_enum_1 = require("../../modules/Session/session.enum");
const SessionSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    expertId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    scheduledAt: { type: Date, required: true },
    durationMinutes: { type: Number, required: true },
    price: { type: Number, required: true },
    expertJoinedAt: {
        type: Date,
        default: null,
    },
    paymentStatus: {
        type: String,
        enum: session_enum_1.PaymentStatus,
        default: session_enum_1.PaymentStatus.PENDING,
    },
    status: {
        type: String,
        enum: session_enum_1.SessionStatus,
        default: session_enum_1.SessionStatus.SCHEDULED,
    },
    payoutReleaseAt: {
        type: Date,
        default: null,
    },
    paymobOrderId: { type: Number },
    paymobPaymentToken: { type: String },
}, { timestamps: true });
const Session = (0, mongoose_1.model)("Session", SessionSchema);
exports.default = Session;
