"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restPasswordSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.restPasswordSchema = zod_1.default.object({
    body: zod_1.default.object({
        email: zod_1.default.email(),
        code: zod_1.default.string().min(6),
        password: zod_1.default.string().min(8).max(50)
    }),
});
