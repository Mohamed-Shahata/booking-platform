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
        this.router.get("/", (0, validation_middleware_1.default)(getAllUsers_dto_1.getAllUserSchema), auth_middleware_1.auth, (0, auth_middleware_1.authRoles)(UserRoles_enum_1.UserRoles.ADMIN), (0, express_async_handler_1.default)(this.userController.gelAllUsers));
        this.router.get("/experts", (0, validation_middleware_1.default)(getAllExpert_dto_1.getAllExpertSchema), auth_middleware_1.auth, (0, auth_middleware_1.authRoles)(UserRoles_enum_1.UserRoles.CLIENT, UserRoles_enum_1.UserRoles.ADMIN), (0, express_async_handler_1.default)(this.userController.gelAllExperts));
        this.router.get("/me", auth_middleware_1.auth, (0, express_async_handler_1.default)(this.userController.getMe));
        this.router.get("/:userId", auth_middleware_1.auth, (0, express_async_handler_1.default)(this.userController.getOne));
        this.router.patch("/accept/:userId", auth_middleware_1.auth, (0, auth_middleware_1.authRoles)(UserRoles_enum_1.UserRoles.ADMIN), (0, express_async_handler_1.default)(this.userController.acceptRequest));
        this.router.delete("/reject/:userId", auth_middleware_1.auth, (0, auth_middleware_1.authRoles)(UserRoles_enum_1.UserRoles.ADMIN), (0, express_async_handler_1.default)(this.userController.rejectRequest));
        this.router.patch("/", (0, validation_middleware_1.default)(updateUser_dto_1.updateUserSchema), auth_middleware_1.auth, auth_middleware_1.isAccount, (0, express_async_handler_1.default)(this.userController.update));
        this.router.delete("/", auth_middleware_1.auth, auth_middleware_1.isAccount, (0, express_async_handler_1.default)(this.userController.delete));
        this.router.post("/upload-cv", auth_middleware_1.auth, multer_middleware_1.uploadFile.single("cv"), (0, express_async_handler_1.default)(this.userController.updateCv));
        this.router.post("/upload-avatar", auth_middleware_1.auth, multer_middleware_1.uploadImage.single("avatar"), (0, express_async_handler_1.default)(this.userController.uploadAndUpdateAvatar));
        this.router.delete("/delete-avatar", auth_middleware_1.auth, (0, express_async_handler_1.default)(this.userController.deletedAvatar));
    }
}
exports.default = UserRouter;
