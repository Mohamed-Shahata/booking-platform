"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentForSessionSchema = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = __importDefault(require("zod"));
exports.createPaymentForSessionSchema = zod_1.default.object({
    params: zod_1.default.object({
        sessionId: zod_1.default.string().refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
            message: "Invalid sessionId",
        }),
    }),
    body: zod_1.default.object({
        clientEmail: zod_1.default.email(),
    }),
});
