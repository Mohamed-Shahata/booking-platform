"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const complaintSuggestion_enum_1 = require("../../modules/Review/complaintSuggestion.enum");
const complaintSuggestionSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    type: {
        type: String,
        enum: Object.values(complaintSuggestion_enum_1.ComplaintType),
        required: true,
    },
    subject: {
        type: String,
        minLength: 5,
        maxLength: 100,
        required: true,
    },
    message: {
        type: String,
        minLength: 10,
        maxLength: 500,
        required: true,
    },
    image: {
        type: {
            url: { type: String, required: true },
            publicId: { type: String, required: true }
        },
    },
    isResolved: {
        type: Boolean,
        default: false,
    },
    adminNote: {
        type: String,
        maxLength: 300,
    },
}, { timestamps: true });
const ComplaintSuggestion = (0, mongoose_1.model)("ComplaintSuggestion", complaintSuggestionSchema);
exports.default = ComplaintSuggestion;
