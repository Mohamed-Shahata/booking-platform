"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const auth_controller_1 = __importDefault(require("./auth.controller"));
const validation_middleware_1 = __importDefault(require("../../shared/middlewares/validation.middleware"));
const verifyEmail_dto_1 = require("./dto/verifyEmail.dto");
const registerClient_dto_1 = require("./dto/registerClient.dto");
const login_dto_1 = require("./dto/login.dto");
const restPassword_dto_1 = require("./dto/restPassword.dto");
const forgetPassword_dto_1 = require("./dto/forgetPassword.dto");
const resendCode_dto_1 = require("./dto/resendCode.dto");
const registerExpert_dto_1 = require("./dto/registerExpert.dto");
const multer_middleware_1 = require("../../shared/middlewares/multer.middleware");
class AuthRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.initRoutes = () => {
            // POST ~/auth/register-client
            this.router.post("/register-client", (0, validation_middleware_1.default)(registerClient_dto_1.registerClientSchema), (0, express_async_handler_1.default)(this.authController.registerClient));
            // POST ~/auth/register-expert
            this.router.post("/register-expert", multer_middleware_1.uploadFile.single("cv"), (0, validation_middleware_1.default)(registerExpert_dto_1.registerExpertSchema), (0, express_async_handler_1.default)(this.authController.registerExpert));
            // POST ~/auth/verify
            this.router.post("/verify", (0, validation_middleware_1.default)(verifyEmail_dto_1.verifyEmailSchema), (0, express_async_handler_1.default)(this.authController.verifyEmail));
            // POST ~/auth/login
            this.router.post("/login", (0, validation_middleware_1.default)(login_dto_1.loginSchema), (0, express_async_handler_1.default)(this.authController.login));
            // patch ~/auth/forgetPassword
            this.router.patch("/forgetPassword", (0, validation_middleware_1.default)(forgetPassword_dto_1.forgetPasswordSchema), (0, express_async_handler_1.default)(this.authController.forgetPassword));
            // patch ~/auth/restPassword
            this.router.patch("/restPassword", (0, validation_middleware_1.default)(restPassword_dto_1.restPasswordSchema), (0, express_async_handler_1.default)(this.authController.restPassword));
            // patch ~/auth/resendCode
            this.router.post("/resendCode", (0, validation_middleware_1.default)(resendCode_dto_1.resendCodeSchema), (0, express_async_handler_1.default)(this.authController.resendCode));
        };
        this.authController = new auth_controller_1.default();
        this.initRoutes();
    }
}
exports.default = AuthRouter;
