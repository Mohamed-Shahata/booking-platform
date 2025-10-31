"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const review_enum_1 = require("../../modules/Review/review.enum");
const reviewSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    expertId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "ExpertProfile",
        required: true,
    },
    provider: {
        type: String,
        enum: review_enum_1.ReviewProvider,
        default: review_enum_1.ReviewProvider.SYSTEM,
    },
    text: {
        type: String,
        minLength: 10,
        max: 300,
        required: true,
    },
    stars: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
}, { timestamps: true });
const Review = (0, mongoose_1.model)("Review", reviewSchema);
exports.default = Review;
