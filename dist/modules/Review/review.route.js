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
    /**
     * @swagger
     * tags:
     *   name: Reviews
     *   description: Endpoints related to user reviews and complaints
     */
    initRoutes() {
        /**
         * @swagger
         * /reviews/system:
         *   get:
         *     summary: Get all system reviews (public)
         *     tags: [Reviews]
         *     parameters:
         *       - in: query
         *         name: page
         *         schema:
         *           type: integer
         *           example: 1
         *         description: Page number for pagination (optional)
         *       - in: query
         *         name: limit
         *         schema:
         *           type: integer
         *           example: 20
         *         description: Number of reviews per page (optional)
         *     responses:
         *       200:
         *         description: List of system reviews
         */
        this.router.get("/system", (0, validation_middleware_1.default)(getAll_1.getAllReviewSchema), (0, express_async_handler_1.default)(this.reviewController.getAllReviewsSystem));
        /**
         * @swagger
         * /reviews/experts:
         *   get:
         *     summary: Get all reviews for experts
         *     tags: [Reviews]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: query
         *         name: page
         *         schema:
         *           type: integer
         *           example: 1
         *         description: Page number for pagination (optional)
         *       - in: query
         *         name: limit
         *         schema:
         *           type: integer
         *           example: 20
         *         description: Number of reviews per page (optional)
         *     responses:
         *       200:
         *         description: List of expert reviews
         *       401:
         *         description: Unauthorized
         */
        this.router.get("/experts", (0, validation_middleware_1.default)(getAll_1.getAllReviewSchema), auth_middleware_1.auth, (0, express_async_handler_1.default)(this.reviewController.getAllReviewsExperts));
        /**
         * @swagger
         * /reviews/{expertId}:
         *   get:
         *     summary: Get all reviews for a specific expert
         *     tags: [Reviews]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: expertId
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Reviews for the expert
         *       404:
         *         description: Expert not found
         */
        this.router.get("/:expertId", auth_middleware_1.auth, (0, express_async_handler_1.default)(this.reviewController.getReviewsOneExpert));
        /**
         * @swagger
         * /reviews/complaints-suggestions/find:
         *   get:
         *     summary: Get all complaints and suggestions
         *     tags: [Reviews]
         *     security:
         *       - bearerAuth: []
         *     responses:
         *       200:
         *         description: List of complaints
         *       401:
         *         description: Unauthorized
         */
        this.router.get("/complaints-suggestions/find", auth_middleware_1.auth, (0, express_async_handler_1.default)(this.reviewController.getAllComplaints));
        /**
         * @swagger
         * /reviews/create:
         *   post:
         *     summary: Create a new review
         *     tags: [Reviews]
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               expertId:
         *                 type: string
         *                 description: MongoDB ObjectId of the expert being reviewed
         *                 example: "64f1c5e2a9f1b2d3c4e5f678"
         *               provider:
         *                 type: string
         *                 description: Source of the review (system or manual)
         *                 enum: [SYSTEM, CLIENT]
         *                 default: SYSTEM
         *               text:
         *                 type: string
         *                 description: Review text
         *                 minLength: 10
         *                 maxLength: 300
         *                 example: "Very professional and helpful expert!"
         *               stars:
         *                 type: number
         *                 description: Rating stars (1-5)
         *                 minimum: 1
         *                 maximum: 5
         *                 example: 5
         *     responses:
         *       201:
         *         description: Review created successfully
         *       400:
         *         description: Validation error
         *       401:
         *         description: Unauthorized
         */
        this.router.post("/create", (0, validation_middleware_1.default)(create_dto_1.createReviewSchema), auth_middleware_1.auth, (0, auth_middleware_1.authRoles)(UserRoles_enum_1.UserRoles.ADMIN, UserRoles_enum_1.UserRoles.CLIENT), (0, express_async_handler_1.default)(this.reviewController.create));
        /**
         * @swagger
         * /reviews/create/complaints-suggestions:
         *   post:
         *     summary: Submit a complaint or suggestion (with optional image)
         *     tags: [Reviews]
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       required: false
         *       content:
         *         multipart/form-data:
         *           schema:
         *             type: object
         *             properties:
         *               message:
         *                 type: string
         *               image:
         *                 type: string
         *                 format: binary
         *     responses:
         *       201:
         *         description: Complaint submitted
         *       401:
         *         description: Unauthorized
         */
        this.router.post("/create/complaints-suggestions", auth_middleware_1.auth, multer_middleware_1.uploadFile.single("image"), (0, express_async_handler_1.default)(this.reviewController.createComplaints));
        /**
         * @swagger
         * /reviews/delete/{reviewId}:
         *   delete:
         *     summary: Delete a review
         *     tags: [Reviews]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: reviewId
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Review deleted successfully
         *       404:
         *         description: Review not found
         */
        this.router.delete("/delete/:reviewId", auth_middleware_1.auth, (0, auth_middleware_1.authRoles)(UserRoles_enum_1.UserRoles.ADMIN, UserRoles_enum_1.UserRoles.CLIENT), (0, express_async_handler_1.default)(this.reviewController.delete));
    }
}
exports.default = ReviewRouter;
