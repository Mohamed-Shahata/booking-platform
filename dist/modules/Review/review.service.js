"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const review_model_1 = __importDefault(require("../../DB/model/review.model"));
const expertProfile_model_1 = __importDefault(require("../../DB/model/expertProfile.model"));
const app_error_1 = __importDefault(require("../../shared/errors/app.error"));
const statusCode_enum_1 = require("../../shared/enums/statusCode.enum");
const pagination_1 = require("../../shared/utils/pagination");
const review_enum_1 = require("./review.enum");
const complaintSuggestion_model_1 = __importDefault(require("../../DB/model/complaintSuggestion.model"));
const constant_1 = require("../../shared/utils/constant");
const cloudinary_service_1 = __importDefault(require("../../shared/services/cloudinary.service"));
class ReviewService {
    constructor() {
        /**
         * Retrieves all system-generated reviews.
         *
         * @param dto - Pagination parameters (page, limit).
         * @returns Promise resolving to an array of reviews created by the SYSTEM provider.
         */
        this.getAllReviewsSystem = (dto) => __awaiter(this, void 0, void 0, function* () {
            const { page, limit } = dto;
            const { limitNumber, skip } = (0, pagination_1.getPagination)(page, limit);
            const reviews = yield review_model_1.default.find({ provider: review_enum_1.ReviewProvider.SYSTEM })
                .limit(limitNumber)
                .skip(skip);
            return reviews;
        });
        /**
         * Retrieves all expert-generated reviews.
         *
         * @param dto - Pagination parameters (page, limit).
         * @returns Promise resolving to an array of reviews created by EXPERT providers.
         */
        this.getAllReviewsExperts = (dto) => __awaiter(this, void 0, void 0, function* () {
            const { page, limit } = dto;
            const { limitNumber, skip } = (0, pagination_1.getPagination)(page, limit);
            const reviews = yield review_model_1.default.find({ provider: review_enum_1.ReviewProvider.EXPERT })
                .limit(limitNumber)
                .skip(skip);
            return reviews;
        });
        /**
         * Retrieves all reviews for a specific expert.
         *
         * @param expertId - The ID of the expert whose reviews are being fetched.
         * @param dto - Pagination parameters (page, limit).
         * @returns Promise resolving to an array of reviews belonging to the specified expert.
         */
        this.getReviewsOneExpert = (expertId, dto) => __awaiter(this, void 0, void 0, function* () {
            const { page, limit } = dto;
            const { limitNumber, skip } = (0, pagination_1.getPagination)(page, limit);
            const reviews = yield review_model_1.default.find({ expertId })
                .limit(limitNumber)
                .skip(skip);
            return reviews;
        });
        /**
         * Creates a new review for an expert.
         *
         * @param userId - The ID of the user creating the review.
         * @param dto - Review details including expertId, text, stars, and provider.
         * @returns Promise resolving to a success message after creation.
         */
        this.create = (userId, dto) => __awaiter(this, void 0, void 0, function* () {
            const { expertId, text, stars, provider } = dto;
            const newReview = yield review_model_1.default.create({
                userId,
                text,
                stars,
                provider,
                expertId,
            });
            yield expertProfile_model_1.default.findByIdAndUpdate(expertId, [
                {
                    $set: {
                        numReviews: { $add: ["$numReviews", 1] },
                        rateing: {
                            $divide: [
                                { $add: [{ $multiply: ["$rateing", "$numReviews"] }, stars] },
                                { $add: ["$numReviews", 1] },
                            ],
                        },
                    },
                },
                {
                    $addFields: {
                        reviews: { $concatArrays: ["$reviews", [newReview._id]] },
                    },
                },
            ]);
            return { message: "Created a new review successfully" };
        });
        /**
         * Deletes a review if it belongs to the given user.
         *
         * @param userId - The ID of the user requesting deletion.
         * @param reviewId - The ID of the review to delete.
         * @returns Promise resolving to a success message if deletion is successful.
         * @throws AppError if the review is not found or does not belong to the user.
         */
        this.delete = (userId, reviewId) => __awaiter(this, void 0, void 0, function* () {
            const review = yield review_model_1.default.findById(reviewId);
            if (!review)
                throw new app_error_1.default("Review not found", statusCode_enum_1.StatusCode.NOT_FOUND);
            if (review.userId !== userId)
                throw new app_error_1.default("Access deined, you can not deletign this review", statusCode_enum_1.StatusCode.BAD_REQUEST);
            yield expertProfile_model_1.default.findByIdAndUpdate(review.expertId, {
                $pull: { reviews: review._id },
            });
            return { message: "Deleted review successfully" };
        });
        /**
         * Create a new complaint or suggestion
         */
        this.createComplaintSuggestion = (userId, dto, file) => __awaiter(this, void 0, void 0, function* () {
            const { type, subject, message } = dto;
            let image;
            if (file) {
                const uploadResult = yield cloudinary_service_1.default.uploadImage(file.path, constant_1.CloudinaryFolders.Complaint_SUGGESTIONS);
                image = {
                    url: uploadResult.url,
                    publicId: uploadResult.publicId,
                };
            }
            yield complaintSuggestion_model_1.default.create(Object.assign({ userId,
                type,
                subject,
                message }, (image && { image })));
            return { message: "Created a new complaint/suggestion successfully" };
        });
        this.getAllComplaints = (dto) => __awaiter(this, void 0, void 0, function* () {
            const { type, userId } = dto;
            const filter = {};
            if (type)
                filter.type = type;
            if (userId)
                filter.userId = new mongoose_1.Types.ObjectId(userId);
            return complaintSuggestion_model_1.default.find(filter)
                .populate("userId", "name email")
                .sort({ createdAt: -1 });
        });
        // public getByUser = async (userId: Types.ObjectId) => {
        //   return ComplaintSuggestion.find({ userId }).sort({ createdAt: -1 });
        // };
    }
}
exports.default = ReviewService;
