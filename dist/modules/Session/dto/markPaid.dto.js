"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markPaidSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.markPaidSchema = zod_1.default.object({
    body: zod_1.default.object({
        paymobOrderId: zod_1.default.number().optional(),
        paymobPaymentToken: zod_1.default.string().optional(),
    }),
});
