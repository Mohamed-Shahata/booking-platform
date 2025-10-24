"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const user_model_1 = __importStar(require("../../DB/model/user.model"));
const app_error_1 = __importDefault(require("../../shared/errors/app.error"));
const constant_1 = require("../../shared/utils/constant");
const statusCode_enum_1 = require("../../shared/enums/statusCode.enum");
const cloudinary_service_1 = __importDefault(require("../../shared/services/cloudinary.service"));
const UserRoles_enum_1 = require("../../shared/enums/UserRoles.enum");
const expertProfile_model_1 = __importDefault(require("../../DB/model/expertProfile.model"));
class UserService {
    constructor() {
        /**
         * Get all verified users with pagination (for Flutter)
         *
         * This method retrieves all users that have verified their accounts.
         * Supports pagination using `page` and `limit` parameters.
         *
         * @param dto - The pagination data (page, limit)
         * @returns A list of verified users
         *
         * Example:
         *  page = 1, limit = 20 → skips 0 users and gets 20
         */
        this.getAllUsers = (dto) => __awaiter(this, void 0, void 0, function* () {
            const { page, limit } = dto;
            const pageNumber = page ? parseInt(page) : 1;
            const limitNumber = limit ? parseInt(limit) : 20;
            const skip = (pageNumber - 1) * limitNumber;
            const users = yield user_model_1.default.find({ isVerified: true })
                .select("username email image gender phone")
                .limit(limitNumber)
                .skip(skip)
                .exec();
            return users;
        });
        /**
         * Update user data by ID
         *
         * Finds a user by ID and updates their data with the provided body DTO.
         * If the user does not exist, throws a `USER_NOT_FOUND` error.
         *
         * @param id - The user's MongoDB ObjectId
         * @param bodyDto - The data to update
         * @returns The updated user document
         */
        this.update = (id, bodyDto) => __awaiter(this, void 0, void 0, function* () {
            const updatedUser = yield user_model_1.default.findByIdAndUpdate(id, { $set: bodyDto }, { new: true });
            if (!updatedUser)
                throw new app_error_1.default(constant_1.UserError.USER_NOT_FOUND, statusCode_enum_1.StatusCode.NOT_FOUND);
            if (updatedUser.role === UserRoles_enum_1.UserRoles.EXPERT) {
                yield expertProfile_model_1.default.findOneAndUpdate({ userId: id }, { $set: bodyDto }, { new: true });
            }
            return updatedUser;
        });
        /**
         * Soft delete user account by ID
         *
         * Instead of permanently deleting the user, this method marks
         * the account as deleted and sets a `deletedAt` timestamp.
         * Displays a message that the account will be permanently deleted after 7 days.
         *
         * @param id - The user's MongoDB ObjectId
         * @returns A message about the scheduled deletion
         */
        this.delete = (id) => __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findByIdAndUpdate(id, {
                $set: { isDeleted: Date.now() },
            }, { new: true });
            if (!user)
                throw new app_error_1.default(constant_1.UserError.USER_NOT_FOUND, statusCode_enum_1.StatusCode.NOT_FOUND);
            return {
                message: constant_1.UserSuccess.YOUR_ACCOUNT_HAS_BEEN_DEACTIVATED_AND_SCHEDULED_FOR_PERMANENT_DELETION_AFTER_7_DAYS_YOU_CAN_REACTIVATE_IT_ANYTIME_BY_LOGGING_IN_AGAIN_BEFORE_THAT_PERIOD,
            };
        });
        /**
         * Retrieves the authenticated user's data by ID.
         *
         * @param id - The user's ObjectId
         * @returns The user document
         */
        this.getMe = (id) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getOneUser(id);
            return user;
        });
        /**
         * Retrieves a single user by ID.
         *
         * @param id - The user's ObjectId
         * @returns The user document
         */
        this.getOne = (id) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getOneUser(id);
            return user;
        });
        /**
         * Uploads a new avatar to Cloudinary and updates the user's avatar field.
         * If the user already has an avatar, the old one is deleted first.
         *
         * @param userId - The user's ObjectId
         * @param file - The local path of the image to upload
         * @returns A success message
         */
        this.uploadAndUpdateAvatar = (userId, file) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const user = yield this.getOneUser(userId);
            if (!((_a = user.avatar) === null || _a === void 0 ? void 0 : _a.publicId)) {
                const uploadResult = yield cloudinary_service_1.default.uploadImage(file, constant_1.CloudinaryFolders.AVATARS);
                yield user_model_1.default.updateOne({ _id: userId }, {
                    avatar: {
                        url: uploadResult.url,
                        publicId: uploadResult.publicId,
                    },
                });
            }
            else {
                yield cloudinary_service_1.default.deleteImage((_b = user.avatar) === null || _b === void 0 ? void 0 : _b.publicId);
                const uploadResult = yield cloudinary_service_1.default.uploadImage(file, constant_1.CloudinaryFolders.AVATARS);
                yield user_model_1.default.updateOne({ _id: userId }, {
                    avatar: {
                        url: uploadResult.url,
                        publicId: uploadResult.publicId,
                    },
                });
            }
            return { message: constant_1.UserSuccess.UPDATED_USER_SUCCESSFULLY };
        });
        /**
         * Deletes the user's avatar from Cloudinary and clears the avatar field in the database.
         *
         * @param userId - The user's ObjectId
         * @returns A success message
         */
        this.deleteAvatar = (userId) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const user = yield this.getOneUser(userId);
            yield cloudinary_service_1.default.deleteImage((_a = user.avatar) === null || _a === void 0 ? void 0 : _a.publicId);
            yield user_model_1.default.updateOne({ _id: userId }, {
                avatar: {
                    url: user_model_1.DEFAULT_AVATAR.url,
                    publicId: user_model_1.DEFAULT_AVATAR.publicId,
                },
            });
            return { message: constant_1.UserSuccess.DELETED_AVATAR_SUCCESSFULLY };
        });
        /**
         * Get single user by ID (private method)
         *
         * Fetches one user from the database using their ID.
         * Throws an error if the user cannot be found.
         *
         * @param id - The user's MongoDB ObjectId
         * @returns The found user document
         */
        this.getOneUser = (id) => __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findById(id);
            if (!user)
                throw new app_error_1.default(constant_1.UserError.USER_NOT_FOUND, statusCode_enum_1.StatusCode.NOT_FOUND);
            return user;
        });
    }
}
exports.default = UserService;
