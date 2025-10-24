"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerClientSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_enum_1 = require("../../User/user.enum");
exports.registerClientSchema = zod_1.default.object({
    body: zod_1.default.object({
        username: zod_1.default.string().min(2).max(15),
        email: zod_1.default.email(),
        phone: zod_1.default
            .string()
            .regex(/^(?:01[0-2,5]\d{8}|0\d{8})$/, "Phone number must be a valid Egyptian mobile or landline number"),
        password: zod_1.default
            .string()
            .min(8)
            .max(128)
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*\(\)\-_=\+\[\]\{\};:'",.<>\/?\\|`~]).+$/, "Password must contain uppercase, lowercase, number, and special character"),
        gender: zod_1.default.enum([user_enum_1.UserGender.MALE, user_enum_1.UserGender.FEMALE, user_enum_1.UserGender.OTHER]),
    }),
});
