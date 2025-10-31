"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const review_controller_1 = __importDefault(require("./review.controller"));
const auth_middleware_1 = require("../../shared/middlewares/auth.middleware");
const UserRoles_enum_1 = require("../../shared/enums/UserRoles.enum");
const validation_middleware_1 = __importDefault(require("../../shared/middlewares/validation.middleware"));
const create_dto_1 = require("./dto/create.dto");
const getAll_1 = require("./dto/getAll");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const multer_middleware_1 = require("../../shared/middlewares/multer.middleware");
class ReviewRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.reviewController = new review_controller_1.default();
        this.initRoutes();
    }
    initRoutes() {
        // GET ~/reviews/system
        this.router.get("/system", (0, validation_middleware_1.default)(getAll_1.getAllReviewSchema), (0, express_async_handler_1.default)(this.reviewController.getAllReviewsSystem));
        // GET ~/reviews/experts
        this.router.get("/experts", (0, validation_middleware_1.default)(getAll_1.getAllReviewSchema), auth_middleware_1.auth, (0, express_async_handler_1.default)(this.reviewController.getAllReviewsExperts));
        // Get ~/reviews/:expertId
        this.router.get("/:expertId", auth_middleware_1.auth, (0, express_async_handler_1.default)(this.reviewController.getReviewsOneExpert));
        // Get ~/reviews/complaints-suggestions/find
        this.router.get("/complaints-suggestions/find", auth_middleware_1.auth, (0, express_async_handler_1.default)(this.reviewController.getAllComplaints));
        // POST ~/reviews/create
        this.router.post("/create", (0, validation_middleware_1.default)(create_dto_1.createReviewSchema), auth_middleware_1.auth, (0, auth_middleware_1.authRoles)(UserRoles_enum_1.UserRoles.ADMIN, UserRoles_enum_1.UserRoles.CLIENT), (0, express_async_handler_1.default)(this.reviewController.create));
        // Post ~/create/complaints-suggestions
        this.router.post("/create/complaints-suggestions", auth_middleware_1.auth, multer_middleware_1.uploadFile.single("image"), (0, express_async_handler_1.default)(this.reviewController.createComplaints));
        // DELETE ~/reviews/delete/:reviewId
        this.router.delete("/delete/:reviewId", auth_middleware_1.auth, (0, auth_middleware_1.authRoles)(UserRoles_enum_1.UserRoles.ADMIN, UserRoles_enum_1.UserRoles.CLIENT), (0, express_async_handler_1.default)(this.reviewController.delete));
    }
}
exports.default = ReviewRouter;
