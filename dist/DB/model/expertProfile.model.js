"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const expertProfile_enum_1 = require("../../shared/enums/expertProfile.enum");
const cvShema = new mongoose_1.Schema({
    url: {
        type: String,
        required: true,
    },
    publicId: {
        type: String,
        required: true,
    },
}, { _id: false });
const expertProfileSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    specialty: {
        type: String,
        enum: expertProfile_enum_1.ExpertSpecialty,
        default: expertProfile_enum_1.ExpertSpecialty.IT,
        required: true,
    },
    yearsOfExperience: {
        type: Number,
        min: 2,
        required: true,
    },
    cv: cvShema,
    aboutYou: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        default: "",
    },
    wallet: {
        type: Number,
        default: 0,
    },
    rateing: {
        type: Number,
        default: 0,
    },
    totalStars: {
        type: Number,
        default: 0,
    },
    numReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Review",
            required: true,
        },
    ],
}, { timestamps: true });
const ExpertProfile = (0, mongoose_1.model)("ExpertProfile", expertProfileSchema);
exports.default = ExpertProfile;
