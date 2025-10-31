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
    initRoutes() {
        // Get ~/users/topTenExperts
        this.router.get("/topTenExperts", (0, express_async_handler_1.default)(this.userController.getTopTenExperts));
        // Get ~/users
        this.router.get("/", (0, validation_middleware_1.default)(getAllUsers_dto_1.getAllUserSchema), auth_middleware_1.auth, (0, auth_middleware_1.authRoles)(UserRoles_enum_1.UserRoles.ADMIN), (0, express_async_handler_1.default)(this.userController.gelAllUsers));
        // Get ~/users/experts
        this.router.get("/experts", (0, validation_middleware_1.default)(getAllExpert_dto_1.getAllExpertSchema), auth_middleware_1.auth, (0, auth_middleware_1.authRoles)(UserRoles_enum_1.UserRoles.CLIENT, UserRoles_enum_1.UserRoles.ADMIN), (0, express_async_handler_1.default)(this.userController.gelAllExperts));
        // Get ~/users/verify/experts
        this.router.get("/not-verify/experts", auth_middleware_1.auth, (0, auth_middleware_1.authRoles)(UserRoles_enum_1.UserRoles.ADMIN), (0, express_async_handler_1.default)(this.userController.getAllExpertsIsNotverified));
        // Get ~/users/me
        this.router.get("/me", auth_middleware_1.auth, (0, express_async_handler_1.default)(this.userController.getMe));
        // Get ~/users/userId
        this.router.get("/:userId", auth_middleware_1.auth, (0, express_async_handler_1.default)(this.userController.getOne));
        // Get ~/users/topTenExperts
        this.router.get("/topTenExperts", (0, express_async_handler_1.default)(this.userController.getTopTenExperts));
        // Patch ~/users/accept/userId
        this.router.patch("/accept/:userId", auth_middleware_1.auth, (0, auth_middleware_1.authRoles)(UserRoles_enum_1.UserRoles.ADMIN), (0, express_async_handler_1.default)(this.userController.acceptRequest));
        // Delete ~/users/reject/userId
        this.router.delete("/reject/:userId", auth_middleware_1.auth, (0, auth_middleware_1.authRoles)(UserRoles_enum_1.UserRoles.ADMIN), (0, express_async_handler_1.default)(this.userController.rejectRequest));
        // Patch ~/users
        this.router.patch("/", (0, validation_middleware_1.default)(updateUser_dto_1.updateUserSchema), auth_middleware_1.auth, auth_middleware_1.isAccount, (0, express_async_handler_1.default)(this.userController.update));
        // Delete ~/users
        this.router.delete("/", auth_middleware_1.auth, auth_middleware_1.isAccount, (0, express_async_handler_1.default)(this.userController.delete));
        // Post ~/users/upload-cv
        this.router.post("/upload-cv", auth_middleware_1.auth, multer_middleware_1.uploadFile.single("cv"), (0, express_async_handler_1.default)(this.userController.updateCv));
        // Post ~/users/upload-avatar
        this.router.post("/upload-avatar", auth_middleware_1.auth, multer_middleware_1.uploadImage.single("avatar"), (0, express_async_handler_1.default)(this.userController.uploadAndUpdateAvatar));
        // Delete ~/users/delete-avatar
        this.router.delete("/delete-avatar", auth_middleware_1.auth, (0, express_async_handler_1.default)(this.userController.deletedAvatar));
    }
}
exports.default = UserRouter;
