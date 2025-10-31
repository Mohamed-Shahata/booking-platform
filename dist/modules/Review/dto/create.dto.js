"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReviewSchema = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = __importDefault(require("zod"));
const review_enum_1 = require("../review.enum");
exports.createReviewSchema = zod_1.default.object({
    body: zod_1.default.object({
        expertId: zod_1.default.string().refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
            message: "Invalid userId",
        }),
        provider: zod_1.default.enum(review_enum_1.ReviewProvider).default(review_enum_1.ReviewProvider.SYSTEM),
        text: zod_1.default.string().min(10).max(300),
        stars: zod_1.default.number().min(1).max(5),
    }),
});
