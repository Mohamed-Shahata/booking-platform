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
const loginWithGoogle_dto_1 = require("./dto/loginWithGoogle.dto");
class AuthRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        /**
         * @swagger
         * tags:
         *   name: Auth
         *   description: Authentication and user account management endpoints including registration, login, password reset, and email verification
         */
        this.initRoutes = () => {
            /**
             * @swagger
             * /auth/register-client:
             *   post:
             *     summary: Register a new client
             *     tags: [Auth]
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               username:
             *                 type: string
             *                 example: "JohnDoe"
             *               email:
             *                 type: string
             *                 format: email
             *                 example: "john@example.com"
             *               phone:
             *                 type: string
             *                 example: "01234567890"
             *               password:
             *                 type: string
             *                 example: "Password@123"
             *               gender:
             *                 type: string
             *                 enum: [MALE, FEMALE, OTHER]
             *             required:
             *               - username
             *               - email
             *               - phone
             *               - password
             *               - gender
             *     responses:
             *       201:
             *         description: Client registered successfully
             */
            this.router.post("/register-client", (0, validation_middleware_1.default)(registerClient_dto_1.registerClientSchema), (0, express_async_handler_1.default)(this.authController.registerClient));
            /**
             * @swagger
             * /auth/register-expert:
             *   post:
             *     summary: Register a new expert with CV upload
             *     tags: [Auth]
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
             *               data:
             *                 type: string
             *                 description: JSON string containing the expert's profile
             *             required:
             *               - cv
             *               - data
             *     responses:
             *       201:
             *         description: Expert registered successfully
             */
            this.router.post("/register-expert", multer_middleware_1.uploadFile.single("cv"), (0, validation_middleware_1.default)(registerExpert_dto_1.registerExpertSchema), (0, express_async_handler_1.default)(this.authController.registerExpert));
            /**
             * @swagger
             * /auth/verify:
             *   post:
             *     summary: Verify user email using code sent to inbox
             *     tags: [Auth]
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               email:
             *                 type: string
             *                 format: email
             *               code:
             *                 type: string
             *                 minLength: 6
             *             required:
             *               - email
             *               - code
             *     responses:
             *       200:
             *         description: Email verified successfully
             */
            this.router.post("/verify", (0, validation_middleware_1.default)(verifyEmail_dto_1.verifyEmailSchema), (0, express_async_handler_1.default)(this.authController.verifyEmail));
            /**
             * @swagger
             * /auth/login:
             *   post:
             *     summary: Login using email and password
             *     tags: [Auth]
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               email:
             *                 type: string
             *                 format: email
             *               password:
             *                 type: string
             *                 minLength: 8
             *                 maxLength: 50
             *             required:
             *               - email
             *               - password
             *     responses:
             *       200:
             *         description: Logged in successfully
             */
            this.router.post("/login", (0, validation_middleware_1.default)(login_dto_1.loginSchema), (0, express_async_handler_1.default)(this.authController.login));
            /**
             * @swagger
             * /auth/google-login:
             *   post:
             *     summary: Login using Google OAuth token
             *     tags: [Auth]
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               idToken:
             *                 type: string
             *                 example: "google-id-token"
             *             required:
             *               - idToken
             *     responses:
             *       200:
             *         description: Logged in with Google successfully
             */
            this.router.post("/google-login", (0, validation_middleware_1.default)(loginWithGoogle_dto_1.googleLoginSchema), this.authController.loginWithGoogle);
            /**
             * @swagger
             * /auth/forgetPassword:
             *   patch:
             *     summary: Request a password reset code via email
             *     tags: [Auth]
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               email:
             *                 type: string
             *                 format: email
             *             required:
             *               - email
             *     responses:
             *       200:
             *         description: Reset code sent successfully
             */
            this.router.patch("/forgetPassword", (0, validation_middleware_1.default)(forgetPassword_dto_1.forgetPasswordSchema), (0, express_async_handler_1.default)(this.authController.forgetPassword));
            /**
             * @swagger
             * /auth/restPassword:
             *   patch:
             *     summary: Reset password using the verification code
             *     tags: [Auth]
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               email:
             *                 type: string
             *                 format: email
             *               code:
             *                 type: string
             *                 minLength: 6
             *               password:
             *                 type: string
             *                 minLength: 8
             *                 maxLength: 50
             *             required:
             *               - email
             *               - code
             *               - password
             *     responses:
             *       200:
             *         description: Password reset successfully
             */
            this.router.patch("/restPassword", (0, validation_middleware_1.default)(restPassword_dto_1.restPasswordSchema), (0, express_async_handler_1.default)(this.authController.restPassword));
            /**
             * @swagger
             * /auth/resendCode:
             *   post:
             *     summary: Resend verification code to email
             *     tags: [Auth]
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               email:
             *                 type: string
             *                 format: email
             *             required:
             *               - email
             *     responses:
             *       200:
             *         description: Code resent successfully
             */
            this.router.post("/resendCode", (0, validation_middleware_1.default)(resendCode_dto_1.resendCodeSchema), (0, express_async_handler_1.default)(this.authController.resendCode));
        };
        this.authController = new auth_controller_1.default();
        this.initRoutes();
    }
}
exports.default = AuthRouter;
