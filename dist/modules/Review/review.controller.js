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
const review_service_1 = __importDefault(require("./review.service"));
const sendResponse_1 = __importDefault(require("../../shared/utils/sendResponse"));
const statusCode_enum_1 = require("../../shared/enums/statusCode.enum");
const mongoose_1 = require("mongoose");
const app_error_1 = __importDefault(require("../../shared/errors/app.error"));
class ReviewController {
    constructor() {
        // Get ~/reviews/system
        this.getAllReviewsSystem = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const dto = req.query;
            const reviews = yield this.reviewService.getAllReviewsSystem(dto);
            (0, sendResponse_1.default)(res, statusCode_enum_1.StatusCode.OK, { data: { reviews }, success: true });
        });
        // Get ~/reviews/experts
        this.getAllReviewsExperts = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const dto = req.query;
            const reviews = yield this.reviewService.getAllReviewsExperts(dto);
            (0, sendResponse_1.default)(res, statusCode_enum_1.StatusCode.OK, { data: { reviews }, success: true });
        });
        // Get ~/reviews/:expertId
        this.getReviewsOneExpert = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const dto = req.query;
            const expertId = new mongoose_1.Types.ObjectId(req.params.expertId);
            if (mongoose_1.Types.ObjectId.isValid(expertId))
                throw new app_error_1.default("Invalid expertId", statusCode_enum_1.StatusCode.BAD_REQUEST);
            const user = yield this.reviewService.getReviewsOneExpert(expertId, dto);
            (0, sendResponse_1.default)(res, statusCode_enum_1.StatusCode.OK, {
                data: { user },
                success: true,
                message: "Done",
            });
        });
        // Get ~/reviews/complaints-suggestions/find
        this.getAllComplaints = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const dto = req.query; // query params for filtering
            const data = yield this.reviewService.getAllComplaints(dto);
            (0, sendResponse_1.default)(res, statusCode_enum_1.StatusCode.OK, {
                data,
                success: true,
                message: "Fetched complaints/suggestions successfully",
            });
        });
        // Post ~/reviews/create
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = new mongoose_1.Types.ObjectId((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
            const dto = req.body;
            const { message } = yield this.reviewService.create(userId, dto);
            (0, sendResponse_1.default)(res, statusCode_enum_1.StatusCode.CREATED, { message, success: true });
        });
        // Post ~create/complaints-suggestions/
        this.createComplaints = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = new mongoose_1.Types.ObjectId((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
            const dto = req.body;
            const file = req.file;
            const { message } = yield this.reviewService.createComplaintSuggestion(userId, dto, file);
            (0, sendResponse_1.default)(res, statusCode_enum_1.StatusCode.CREATED, { message, success: true });
        });
        // Delete ~/reviews/delete/:reviewId
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = new mongoose_1.Types.ObjectId((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
            const reviewId = new mongoose_1.Types.ObjectId(req.params.reviewId);
            if (mongoose_1.Types.ObjectId.isValid(reviewId))
                throw new app_error_1.default("Invalid reviewId", statusCode_enum_1.StatusCode.BAD_REQUEST);
            const { message } = yield this.reviewService.delete(userId, reviewId);
            (0, sendResponse_1.default)(res, statusCode_enum_1.StatusCode.CREATED, { message, success: true });
        });
        this.reviewService = new review_service_1.default();
    }
}
exports.default = ReviewController;
