"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSessionSchema = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = __importDefault(require("zod"));
exports.createSessionSchema = zod_1.default.object({
    body: zod_1.default.object({
        expertId: zod_1.default.string().refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
            message: "Invalid expertId",
        }),
        scheduledAt: zod_1.default.date(),
        durationMinutes: zod_1.default.number().min(30).max(180),
        price: zod_1.default.number(),
    }),
});
