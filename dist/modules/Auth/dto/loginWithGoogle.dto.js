"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleLoginSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.googleLoginSchema = zod_1.default.object({
    body: zod_1.default.object({
        idToken: zod_1.default.string().min(1, "idToken is required"),
    }),
});
