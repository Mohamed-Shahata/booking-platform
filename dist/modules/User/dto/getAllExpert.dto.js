"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllExpertSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const expertProfile_enum_1 = require("../../../shared/enums/expertProfile.enum");
exports.getAllExpertSchema = zod_1.default.object({
    query: zod_1.default.object({
        filter: zod_1.default
            .enum([
            expertProfile_enum_1.ExpertSpecialty.BUSINESS,
            expertProfile_enum_1.ExpertSpecialty.IT,
            expertProfile_enum_1.ExpertSpecialty.MEDICAL,
        ])
            .default(expertProfile_enum_1.ExpertSpecialty.MEDICAL)
            .optional(),
        page: zod_1.default.string().optional(),
        limit: zod_1.default.string().optional(),
    }),
});
