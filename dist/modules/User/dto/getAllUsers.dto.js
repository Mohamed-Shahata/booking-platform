"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUserSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.getAllUserSchema = zod_1.default.object({
    query: zod_1.default.object({
        page: zod_1.default.string().optional(),
        limit: zod_1.default.string().optional(),
    }),
});
