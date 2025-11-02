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
const user_service_1 = __importDefault(require("./user.service"));
const sendResponse_1 = __importDefault(require("../../shared/utils/sendResponse"));
const statusCode_enum_1 = require("../../shared/enums/statusCode.enum");
const mongoose_1 = require("mongoose");
const constant_1 = require("../../shared/utils/constant");
const app_error_1 = __importDefault(require("../../shared/errors/app.error"));
class UserController {
    constructor() {
        // GET ~/users?page=1&limit=20
        this.gelAllUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const dto = req.query;
            const users = yield this.userService.getAllUsers(dto);
            (0, sendResponse_1.default)(res, statusCode_enum_1.StatusCode.OK, {
                data: users,
                success: true,
                message: constant_1.UserSuccess.GET_ALL_USERS_DONE,
            });
        });
        // GET ~/users/expert?page=1&limit=20
        this.gelAllExperts = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const dto = req.query;
            const users = yield this.userService.getAllExpert(dto);
            (0, sendResponse_1.default)(res, statusCode_enum_1.StatusCode.OK, {
                data: users,
                success: true,
                message: constant_1.UserSuccess.GET_ALL_EXPERT_DONE,
            });
        });
        // GET ~/users/expert/search?page=1&limit=20
        this.getOneExpert = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const dto = req.query;
            const expert = yield this.userService.getExpert(dto);
            (0, sendResponse_1.default)(res, statusCode_enum_1.StatusCode.OK, {
                data: { expert },
                success: true,
                message: "Done",
            });
        });
        // GET ~/users/verify/expert
        this.getAllExpertsIsNotverified = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const experts = yield this.userService.getAllExpertsIsNotverified();
            (0, sendResponse_1.default)(res, statusCode_enum_1.StatusCode.OK, { data: { experts }, success: true });
        });
        /**
         * dto is => Validation data is {username, phone, gender}
         * PATCH ~/users
         *
         * example
         * {
         *  username: "ex_username",
         *  phone: "ex_01" => min length must be 11 digits,
         *  gender: "ex_other"
         * }
         */
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = new mongoose_1.Types.ObjectId((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
            const dto = req.body;
            const user = yield this.userService.update(userId, dto);
            (0, sendResponse_1.default)(res, statusCode_enum_1.StatusCode.OK, {
                data: user,
                success: true,
                message: constant_1.UserSuccess.UPDATED_USER_SUCCESSFULLY,
            });
        });
        // DELETE ~/users
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = new mongoose_1.Types.ObjectId((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
            const { message } = yield this.userService.delete(userId);
            (0, sendResponse_1.default)(res, statusCode_enum_1.StatusCode.OK, {
                success: true,
                message: message,
            });
        });
        // GET ~/users/:userId
        this.getOne = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = new mongoose_1.Types.ObjectId(req.params.userId);
            const user = yield this.userService.getOne(userId);
            (0, sendResponse_1.default)(res, statusCode_enum_1.StatusCode.OK, {
                data: { user },
                success: true,
                message: "Done",
            });
        });
        // GET ~/users/:userId
        this.getTopTenExperts = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const experts = yield this.userService.getTopTenExperts();
            (0, sendResponse_1.default)(res, statusCode_enum_1.StatusCode.OK, {
                data: { experts },
                success: true,
                message: "Done",
            });
        });
        // GET ~/users/me
        this.getMe = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = new mongoose_1.Types.ObjectId((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
            const user = yield this.userService.getMe(userId);
            (0, sendResponse_1.default)(res, statusCode_enum_1.StatusCode.OK, {
                data: { user },
                success: true,
                message: "Done",
            });
        });
        // PATCH ~/users/accept/userId
        this.acceptRequest = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = new mongoose_1.Types.ObjectId(req.params.userId);
            const user = yield this.userService.acceptRequest(userId);
            (0, sendResponse_1.default)(res, statusCode_enum_1.StatusCode.OK, {
                data: { user },
                success: true,
                message: "Done",
            });
        });
        // PATCH ~/users/reject/userId
        this.rejectRequest = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = new mongoose_1.Types.ObjectId(req.params.userId);
            const result = yield this.userService.rejectRequest(userId);
            (0, sendResponse_1.default)(res, statusCode_enum_1.StatusCode.OK, {
                data: { result },
                success: true,
                message: "Rejected Successfully",
            });
        });
        // POST ~/users/update-cv
        this.updateCv = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const file = req.file;
            const userId = new mongoose_1.Types.ObjectId((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
            if (!file)
                throw new app_error_1.default("No file uploaded", statusCode_enum_1.StatusCode.BAD_REQUEST);
            const { message } = yield this.userService.updatedCv(userId, file);
            (0, sendResponse_1.default)(res, statusCode_enum_1.StatusCode.OK, { success: true, message });
        });
        // POST ~/users/upload-avatar
        this.uploadAndUpdateAvatar = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const file = req.file;
            const userId = new mongoose_1.Types.ObjectId((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
            if (!file)
                throw new app_error_1.default("No file uploaded", statusCode_enum_1.StatusCode.BAD_REQUEST);
            const { message } = yield this.userService.uploadAndUpdateAvatar(userId, file.path);
            (0, sendResponse_1.default)(res, statusCode_enum_1.StatusCode.OK, { success: true, message });
        });
        // DELETE ~/users/delete-avatar
        this.deletedAvatar = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = new mongoose_1.Types.ObjectId((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
            const { message } = yield this.userService.deleteAvatar(userId);
            (0, sendResponse_1.default)(res, statusCode_enum_1.StatusCode.OK, { success: true, message });
        });
        this.userService = new user_service_1.default();
    }
}
exports.default = UserController;
