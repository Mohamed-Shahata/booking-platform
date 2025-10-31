"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createComplaintSuggestionSchema = void 0;
const zod_1 = require("zod");
const complaintSuggestion_enum_1 = require("../complaintSuggestion.enum");
exports.createComplaintSuggestionSchema = zod_1.z.object({
    type: zod_1.z.nativeEnum(complaintSuggestion_enum_1.ComplaintType, {
        error: "Type is required",
    }),
    subject: zod_1.z
        .string({
        error: "Subject is required",
    })
        .min(5, "Subject must be at least 5 characters")
        .max(100, "Subject cannot exceed 100 characters"),
    message: zod_1.z
        .string({
        error: "Message is required",
    })
        .min(10, "Message must be at least 10 characters")
        .max(500, "Message cannot exceed 500 characters"),
});
