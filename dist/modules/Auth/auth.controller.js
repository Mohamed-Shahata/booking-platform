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
const sendResponse_1 = __importDefault(require("../../shared/utils/sendResponse"));
const statusCode_enum_1 = require("../../shared/enums/statusCode.enum");
const auth_service_1 = __importDefault(require("./auth.service"));
const app_error_1 = __importDefault(require("../../shared/errors/app.error"));
class AuthController {
    constructor() {
        /**
         * dto is => Validation data is {username, email, password, gender}
         * POST ~/auth/register
         *
         * example
         * {
         *  username: "ex_username",
         *  email: "ex_email@gmail.com",
         *  password: "ex_password123",
         *  gender: "male"
         * }
         */
        this.registerClient = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const dto = req.body;
            const { message } = yield this.authService.registerClient(dto);
            (0, sendResponse_1.default)(res, statusCode_enum_1.StatusCode.OK, { success: true, data: { message } });
        });
        /**
         * dto is => Validation data is {username, email, password, gender}
         * POST ~/auth/register
         *
         * example
         * {
         *  username: "ex_username",
         *  email: "ex_email@gmail.com",
         *  password: "ex_password123",
         *  gender: "male"
         * }
         */
        this.registerExpert = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const dto = req.body;
            const cvFile = req.file;
            if (!cvFile)
                throw new app_error_1.default("no cv file uploaded", statusCode_enum_1.StatusCode.BAD_REQUEST);
            const { message } = yield this.authService.registerExpert(dto, cvFile);
            (0, sendResponse_1.default)(res, statusCode_enum_1.StatusCode.OK, { success: true, data: { message } });
        });
        /**
         * dto is => Validation data is {email , code}
         * POST ~/auth/verify
         *
         * example
         * {
         *  email: "ex_email@gmail.com",
         *  code: "xxxxxx" => 6 digits
         * }
         */
        this.verifyEmail = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const dto = req.body;
            const { message } = yield this.authService.verifyEmail(dto);
            (0, sendResponse_1.default)(res, statusCode_enum_1.StatusCode.OK, { data: { message }, success: true });
        });
        this.getAllExpertsIsNotverified = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const experts = yield this.authService.getAllExpertsIsNotverified();
            (0, sendResponse_1.default)(res, statusCode_enum_1.StatusCode.OK, { data: { experts }, success: true });
        });
        /**
         * dto is => Validation data is {email , password}
         * POST ~/auth/login
         *
         * example
         * {
         *  email: "ex_email@gmail.com",
         *  password: "12345678" => min length must be 8 digits
         * }
         */
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const dto = req.body;
            const { user, accessToken } = yield this.authService.login(dto);
            (0, sendResponse_1.default)(res, statusCode_enum_1.StatusCode.OK, {
                data: { user, accessToken },
                success: true,
            });
        });
        /**
         * dto is => Validation data is {idToken}
         * POST ~/auth/google-login
         *
         * example
         * {
         * "idToken":""
         * }
         */
        this.loginWithGoogle = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const dto = req.body;
            const { user, accessToken } = yield this.authService.loginWithGoogle(dto);
            (0, sendResponse_1.default)(res, statusCode_enum_1.StatusCode.OK, {
                success: true,
                data: { user, accessToken },
            });
        });
        /**
         * dto is => Validation data is {email ,code, password}
         * POST ~/auth/restPassword
         *
         * example
         * {
         *  email: "ex_email@gmail.com",
         *  password: "12345678" => min length must be 8 digits
         * code:"123456"=> min length must be 6 digits
         * }
         */
        this.restPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const dto = req.body;
            const { message } = yield this.authService.restPassword(dto);
            (0, sendResponse_1.default)(res, statusCode_enum_1.StatusCode.OK, {
                data: { message },
                success: true,
            });
        });
        /**
         * dto is => Validation data is {email}
         * POST ~/auth/forgetPassword
         *
         * example
         * {
         *  email: "ex_email@gmail.com",
         * }
         */
        this.forgetPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const dto = req.body;
            const { message } = yield this.authService.forgetPassword(dto);
            (0, sendResponse_1.default)(res, statusCode_enum_1.StatusCode.OK, {
                data: { message },
                success: true,
            });
        });
        /**
         * dto is => Validation data is {email}
         * POST ~/auth/forgetPassword
         *
         * example
         * {
         *  email: "ex_email@gmail.com",
         * }
         */
        this.resendCode = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const dto = req.body;
            const { message } = yield this.authService.resendCode(dto);
            (0, sendResponse_1.default)(res, statusCode_enum_1.StatusCode.OK, {
                data: { message },
                success: true,
            });
        });
        this.authService = new auth_service_1.default();
    }
}
exports.default = AuthController;
