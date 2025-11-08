"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionStatus = exports.PaymentStatus = void 0;
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["PAID"] = "paid";
    PaymentStatus["FAILD"] = "faild";
    PaymentStatus["REFUNDED"] = "refunded";
    PaymentStatus["HELD"] = "held";
    PaymentStatus["RELEASED"] = "released";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var SessionStatus;
(function (SessionStatus) {
    SessionStatus["SCHEDULED"] = "scheduled";
    SessionStatus["IN_PROGRESS"] = "in-progress";
    SessionStatus["COMPLETED"] = "completed";
    SessionStatus["CANCELLED"] = "cancelled";
})(SessionStatus || (exports.SessionStatus = SessionStatus = {}));
