"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("./user.controller"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const validation_middleware_1 = __importDefault(require("../../shared/middlewares/validation.middleware"));
const getAllUsers_dto_1 = require("./dto/getAllUsers.dto");
const auth_middleware_1 = require("../../shared/middlewares/auth.middleware");
const UserRoles_enum_1 = require("../../shared/enums/UserRoles.enum");
const updateUser_dto_1 = require("./dto/updateUser.dto");
const multer_middleware_1 = require("../../shared/middlewares/multer.middleware");
const getAllExpert_dto_1 = require("./dto/getAllExpert.dto");
class UserRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.userController = new user_controller_1.default();
        this.initRoutes();
    }
    /**
     * @swagger
     * tags:
     *   name: Users
     *   description: Operations related to users and experts, including profile management, CV/avatar uploads, expert verification, and user searches
     */
    initRoutes() {
        /**
         * @swagger
         * /users/topTenExperts:
         *   get:
         *     tags:
         *       - Users
         *     summary: Get top 10 experts
         *     responses:
         *       200:
         *         description: Top 10 experts fetched successfully
         */
        this.router.get("/topTenExperts", (0, express_async_handler_1.default)(this.userController.getTopTenExperts));
        /**
         * @swagger
         * /users:
         *   get:
         *     summary: Get all users (Admin only)
         *     tags: [Users]
         *     security:
         *       - BearerAuth: []
         *     parameters:
         *       - in: query
         *         name: page
         *         schema:
         *           type: integer
         *           example: 1
         *       - in: query
         *         name: limit
         *         schema:
         *           type: integer
         *           example: 20
         *     responses:
         *       200:
         *         description: List of users retrieved successfully
         */
        this.router.get("/", (0, validation_middleware_1.default)(getAllUsers_dto_1.getAllUserSchema), auth_middleware_1.auth, (0, auth_middleware_1.authRoles)(UserRoles_enum_1.UserRoles.ADMIN), (0, express_async_handler_1.default)(this.userController.gelAllUsers));
        /**
         * @swagger
         * /users/experts:
         *   get:
         *     summary: Get all verified experts
         *     tags: [Users]
         *     security:
         *       - BearerAuth: []
         *     parameters:
         *       - in: query
         *         name: specialty
         *         schema:
         *           type: string
         *           enum: [BUSINESS, IT, MEDICAL]
         *       - in: query
         *         name: yearsOfExperience
         *         schema:
         *           type: integer
         *       - in: query
         *         name: rateing
         *         schema:
         *           type: number
         *       - in: query
         *         name: page
         *         schema:
         *           type: integer
         *       - in: query
         *         name: limit
         *         schema:
         *           type: integer
         *     responses:
         *       200:
         *         description: Experts fetched successfully
         */
        this.router.get("/experts", (0, validation_middleware_1.default)(getAllExpert_dto_1.getAllExpertSchema), auth_middleware_1.auth, (0, auth_middleware_1.authRoles)(UserRoles_enum_1.UserRoles.CLIENT, UserRoles_enum_1.UserRoles.ADMIN), (0, express_async_handler_1.default)(this.userController.gelAllExperts));
        /**
         * @swagger
         * /users/not-verify/experts:
         *   get:
         *     tags:
         *       - Users
         *     summary: Get all not verified experts (Admin only)
         *     security:
         *       - BearerAuth: []
         *     responses:
         *       200:
         *         description: Not verified experts fetched successfully
         */
        this.router.get("/not-verify/experts", auth_middleware_1.auth, (0, auth_middleware_1.authRoles)(UserRoles_enum_1.UserRoles.ADMIN), (0, express_async_handler_1.default)(this.userController.getAllExpertsIsNotverified));
        /**
         * @swagger
         * /users/me:
         *   get:
         *     tags:
         *       - Users
         *     summary: Get current authenticated user profile
         *     security:
         *       - BearerAuth: []
         *     responses:
         *       200:
         *         description: Profile returned successfully
         */
        this.router.get("/me", auth_middleware_1.auth, (0, express_async_handler_1.default)(this.userController.getMe));
        /**
         * @swagger
         * /users/{userId}:
         *   get:
         *     tags:
         *       - Users
         *     summary: Get user by ID
         *     security:
         *       - BearerAuth: []
         *     parameters:
         *       - in: path
         *         name: userId
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: User fetched successfully
         */
        this.router.get("/:userId", auth_middleware_1.auth, (0, express_async_handler_1.default)(this.userController.getOne));
        /**
         * @swagger
         * /users/accept/{userId}:
         *   patch:
         *     tags:
         *       - Users
         *     summary: Accept expert request (Admin only)
         *     security:
         *       - BearerAuth: []
         *     parameters:
         *       - in: path
         *         name: userId
         *         required: true
         *     responses:
         *       200:
         *         description: Expert request accepted
         */
        this.router.patch("/accept/:userId", auth_middleware_1.auth, (0, auth_middleware_1.authRoles)(UserRoles_enum_1.UserRoles.ADMIN), (0, express_async_handler_1.default)(this.userController.acceptRequest));
        /**
         * @swagger
         * /users/reject/{userId}:
         *   delete:
         *     tags:
         *       - Users
         *     summary: Reject expert request (Admin only)
         *     security:
         *       - BearerAuth: []
         *     parameters:
         *       - in: path
         *         name: userId
         *         required: true
         *     responses:
         *       200:
         *         description: Expert request rejected
         */
        this.router.delete("/reject/:userId", auth_middleware_1.auth, (0, auth_middleware_1.authRoles)(UserRoles_enum_1.UserRoles.ADMIN), (0, express_async_handler_1.default)(this.userController.rejectRequest));
        /**
         * @swagger
         * /users/me:
         *   patch:
         *     tags:
         *       - Users
         *     summary: Update user profile
         *     security:
         *       - BearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             example:
         *               username: "NewName"
         *     responses:
         *       200:
         *         description: User updated successfully
         */
        this.router.patch("/me", (0, validation_middleware_1.default)(updateUser_dto_1.updateUserSchema), auth_middleware_1.auth, auth_middleware_1.isAccount, (0, express_async_handler_1.default)(this.userController.update));
        /**
         * @swagger
         * /users/me:
         *   patch:
         *     summary: Update user profile
         *     tags: [Users]
         *     security:
         *       - BearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               username:
         *                 type: string
         *               phone:
         *                 type: string
         *               gender:
         *                 type: string
         *                 enum: [MALE, FEMALE, OTHER]
         *               specialty:
         *                 type: string
         *                 enum: [BUSINESS, IT, MEDICAL]
         *               yearsOfExperience:
         *                 type: number
         *               aboutYou:
         *                 type: string
         *               bio:
         *                 type: string
         *               rateing:
         *                 type: number
         *     responses:
         *       200:
         *         description: User updated successfully
         */
        this.router.delete("/me", auth_middleware_1.auth, auth_middleware_1.isAccount, (0, express_async_handler_1.default)(this.userController.delete));
        /**
         * @swagger
         * /users/upload-cv:
         *   post:
         *     summary: Upload user CV
         *     tags: [Users]
         *     security:
         *       - BearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         multipart/form-data:
         *           schema:
         *             type: object
         *             properties:
         *               cv:
         *                 type: string
         *                 format: binary
         *     responses:
         *       200:
         *         description: CV uploaded successfully
         */
        this.router.post("/upload-cv", auth_middleware_1.auth, multer_middleware_1.uploadFile.single("cv"), (0, express_async_handler_1.default)(this.userController.updateCv));
        /**
         * @swagger
         * /users/expert/search:
         *   get:
         *     summary: Search for experts
         *     tags: [Users]
         *     parameters:
         *       - in: query
         *         name: specialty
         *         schema:
         *           type: string
         *           enum: [BUSINESS, IT, MEDICAL]
         *       - in: query
         *         name: username
         *         schema:
         *           type: string
         *       - in: query
         *         name: email
         *         schema:
         *           type: string
         *       - in: query
         *         name: page
         *         schema:
         *           type: integer
         *       - in: query
         *         name: limit
         *         schema:
         *           type: integer
         *     responses:
         *       200:
         *         description: Experts list returned
         */
        this.router.get("/expert/search", (0, validation_middleware_1.default)(getAllExpert_dto_1.getAllExpertSchema), (0, express_async_handler_1.default)(this.userController.getOneExpert));
        /**
         * @swagger
         * /users/upload-avatar:
         *   post:
         *     summary: Upload user avatar
         *     tags: [Users]
         *     security:
         *       - BearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         multipart/form-data:
         *           schema:
         *             type: object
         *             properties:
         *               avatar:
         *                 type: string
         *                 format: binary
         *     responses:
         *       200:
         *         description: Avatar uploaded successfully
         */
        this.router.post("/upload-avatar", auth_middleware_1.auth, multer_middleware_1.uploadImage.single("avatar"), (0, express_async_handler_1.default)(this.userController.uploadAndUpdateAvatar));
        /**
         * @swagger
         * /users/delete-avatar:
         *   delete:
         *     summary: Delete user avatar
         *     tags: [Users]
         *     security:
         *       - BearerAuth: []
         *     responses:
         *       200:
         *         description: Avatar deleted successfully
         */
        this.router.delete("/delete-avatar", auth_middleware_1.auth, (0, express_async_handler_1.default)(this.userController.deletedAvatar));
    }
}
exports.default = UserRouter;
