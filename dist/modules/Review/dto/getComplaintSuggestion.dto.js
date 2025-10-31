"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindComplaintSuggestionDto = void 0;
const zod_1 = require("zod");
const complaintSuggestion_enum_1 = require("../complaintSuggestion.enum");
exports.FindComplaintSuggestionDto = zod_1.z.object({
    type: zod_1.z.enum([complaintSuggestion_enum_1.ComplaintType.COMPLAINT, complaintSuggestion_enum_1.ComplaintType.SUGGESTION]).optional(),
    userId: zod_1.z.string().optional(),
    page: zod_1.z.string().optional(),
    limit: zod_1.z.string().optional(),
});
