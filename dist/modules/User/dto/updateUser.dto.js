"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const mongoose_1 = require("mongoose");
const user_enum_1 = require("../user.enum");
const expertProfile_enum_1 = require("../../ExpertProfile/expertProfile.enum");
/**
 * Unified schema for updating both User and ExpertProfile
 * (works for both Client and Expert users)
 */
exports.updateUserSchema = zod_1.default.object({
    body: zod_1.default.object({
        // ---------- USER FIELDS ----------
        username: zod_1.default.string().min(2).max(15).optional(),
        phone: zod_1.default
            .string()
            .regex(/^(?:01[0-2,5]\d{8}|0\d{8})$/, "Phone number must be a valid Egyptian mobile or landline number")
            .optional(),
        gender: zod_1.default
            .enum([user_enum_1.UserGender.MALE, user_enum_1.UserGender.FEMALE, user_enum_1.UserGender.OTHER])
            .optional(),
        // ---------- EXPERT FIELDS ----------
        userId: zod_1.default
            .string()
            .refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
            message: "Invalid userId",
        })
            .optional(),
        specialty: zod_1.default.nativeEnum(expertProfile_enum_1.ExpertSpecialty).optional(),
        yearsOfExperience: zod_1.default.number().min(2).optional(),
        aboutYou: zod_1.default.string().optional(),
        bio: zod_1.default.string().optional(),
        rateing: zod_1.default.number().optional(),
        cv: zod_1.default
            .object({
            fileName: zod_1.default.string().optional(),
            fileUrl: zod_1.default.string().optional(),
        })
            .optional(),
    }),
});
