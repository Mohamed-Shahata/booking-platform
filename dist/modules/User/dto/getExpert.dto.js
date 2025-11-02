"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOneExpertSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const expertProfile_enum_1 = require("../../../shared/enums/expertProfile.enum");
exports.getOneExpertSchema = zod_1.default.object({
    query: zod_1.default.object({
        specialty: zod_1.default
            .enum([
            expertProfile_enum_1.ExpertSpecialty.BUSINESS,
            expertProfile_enum_1.ExpertSpecialty.IT,
            expertProfile_enum_1.ExpertSpecialty.MEDICAL,
        ])
            .optional(),
        username: zod_1.default.string().optional(),
        email: zod_1.default.string().email().optional(),
        page: zod_1.default.string().optional(),
        limit: zod_1.default.string().optional(),
    }),
});
