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
const mail_service_1 = __importDefault(require("../../shared/Mail/mail.service"));
const pagination_1 = require("../../shared/utils/pagination");
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
            const { limitNumber, skip } = (0, pagination_1.getPagination)(page, limit);
            const users = yield user_model_1.default.find({ isVerified: true })
                .select("username email avatar gender phone")
                .limit(limitNumber)
                .skip(skip)
                .exec();
            return users;
        });
        /**
         * Get all experts with optional filters and pagination (for Flutter)
         *
         * Retrieves a paginated list of experts filtered by specialty, rate, and years of experience.
         * Populates the `userId` field to include basic user data (username, avatar).
         *
         * @param dto - The filter and pagination data (page, limit, specialty, rate, yearsOfExperience)
         * @returns A list of expert profiles matching the provided filters
         *
         * Example:
         *  page = 1, limit = 10, specialty = "Cardiology", rate = 4.5
         *  → returns up to 10 cardiologists with a 4.5 rating or higher
         */
        this.getAllExpert = (dto) => __awaiter(this, void 0, void 0, function* () {
            const { page, limit, specialty, rateing, yearsOfExperience } = dto;
            const { limitNumber, skip } = (0, pagination_1.getPagination)(page, limit);
            const experts = yield user_model_1.default.aggregate([
                {
                    $match: {
                        isVerified: true,
                        role: UserRoles_enum_1.UserRoles.EXPERT,
                    },
                },
                {
                    $lookup: {
                        from: "expertprofiles",
                        localField: "hasExpertProfile",
                        foreignField: "_id",
                        as: "expertProfile",
                    },
                },
                {
                    $unwind: "$expertProfile",
                },
                {
                    $match: Object.assign(Object.assign(Object.assign({}, (specialty && { "expertProfile.specialty": specialty })), (yearsOfExperience && {
                        "expertProfile.yearsOfExperience": {
                            $gte: Number(yearsOfExperience),
                        },
                    })), (rateing && {
                        "expertProfile.rateing": { $gte: Number(rateing) },
                    })),
                },
                {
                    $project: {
                        username: 1,
                        avatar: 1,
                        "expertProfile.specialty": 1,
                        "expertProfile.rateing": 1,
                        "expertProfile.yearsOfExperience": 1,
                        "expertProfile.bio": 1,
                    },
                },
                { $skip: skip },
                { $limit: limitNumber },
            ]);
            return experts;
        });
        /**
         * Get verified experts with optional filters and pagination
         *
         * Retrieves a paginated list of verified experts filtered by specialty, username, and email.
         * Joins each expert with their corresponding expert profile to include additional data
         * such as specialty, rating, years of experience, and bio.
         *
         * @param dto - The query data containing optional filters and pagination parameters
         *              (page, limit, specialty, username, email)
         * @returns A paginated list of experts with their profile details
         *
         * Example:
         *  page = 1, limit = 10, specialty = "IT", username = "rashad"
         *  → returns up to 10 verified IT experts whose username matches "rashad"
         */
        this.getExpert = (dto) => __awaiter(this, void 0, void 0, function* () {
            const { page, limit, specialty, username, email } = dto;
            const { limitNumber, skip } = (0, pagination_1.getPagination)(page, limit);
            const experts = yield user_model_1.default.aggregate([
                {
                    $match: {
                        isVerified: true,
                        role: UserRoles_enum_1.UserRoles.EXPERT,
                    },
                },
                {
                    $lookup: {
                        from: "expertprofiles",
                        localField: "hasExpertProfile",
                        foreignField: "_id",
                        as: "expertProfile",
                    },
                },
                { $unwind: "$expertProfile" },
                {
                    $match: Object.assign(Object.assign(Object.assign({}, (specialty && { "expertProfile.specialty": specialty })), (username && { username: { $regex: username, $options: "i" } })), (email && { email: { $regex: email, $options: "i" } })),
                },
                {
                    $project: {
                        username: 1,
                        avatar: 1,
                        email: 1,
                        "expertProfile.specialty": 1,
                        "expertProfile.rateing": 1,
                        "expertProfile.yearsOfExperience": 1,
                        "expertProfile.bio": 1,
                    },
                },
                { $skip: skip },
                { $limit: limitNumber },
            ]);
            return experts;
        });
        /**
         * Retrieves all expert users who are not verified.
         *
         * @returns {Promise<User[]>} List of unverified expert users.
         */
        this.getAllExpertsIsNotverified = () => __awaiter(this, void 0, void 0, function* () {
            const experts = yield user_model_1.default.find({
                role: UserRoles_enum_1.UserRoles.EXPERT,
                isVerified: false,
            })
                .select("-password")
                .populate("hasExpertProfile");
            return experts;
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
         * Retrieves the top 10 experts based on their rating in descending order.
         *
         * - Fetches all expert profiles from the database.
         * - Sorts them by the `rateing` field (highest first).
         * - Limits the result to 10 experts only.
         * - Populates the `userId` field to include user information related to each expert.
         *
         * @returns {Promise<IExpertProfile[]>} A promise that resolves to an array of the top 10 expert profiles.
         */
        this.getTopTenExperts = () => __awaiter(this, void 0, void 0, function* () {
            const experts = yield expertProfile_model_1.default.find()
                .sort({ rateing: -1 })
                .limit(10)
                .populate("userId");
            return experts;
        });
        /**
         * Accept a user's verification request
         *
         * Updates the specified user's account by setting `isVerified` to true.
         *
         * @param userId - The ObjectId of the user to verify
         * @returns A success message if the user was updated
         */
        this.acceptRequest = (userId) => __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findOneAndUpdate({ _id: userId }, { $set: { isVerified: true } }, { new: true });
            if (!user) {
                throw new app_error_1.default(constant_1.UserError.USER_NOT_FOUND, statusCode_enum_1.StatusCode.NOT_FOUND);
            }
            if (user.verificationCode) {
                throw new app_error_1.default(constant_1.UserError.USER_ACCOUNT_IS_NOT_VERIFIED_CODE, statusCode_enum_1.StatusCode.BAD_REQUEST);
            }
            mail_service_1.default.verifyAcceptEmail(user.email, user.username);
            return { message: "Accepted Successfully" };
        });
        /**
         * Reject a user's verification request
         *
         * Sends a rejection email to the user, deletes their expert profile,
         * and removes their account from the database.
         *
         * @param userId - The ObjectId of the user to reject
         * @returns A success message after rejection and cleanup
         */
        this.rejectRequest = (userId) => __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findById(userId);
            if (!user) {
                throw new app_error_1.default(constant_1.UserError.USER_NOT_FOUND, statusCode_enum_1.StatusCode.NOT_FOUND);
            }
            if (user.verificationCode) {
                throw new app_error_1.default(constant_1.UserError.USER_ACCOUNT_IS_NOT_VERIFIED_CODE, statusCode_enum_1.StatusCode.BAD_REQUEST);
            }
            const expertProfile = yield expertProfile_model_1.default.findOne({ userId });
            if (expertProfile) {
                yield expertProfile_model_1.default.deleteOne({ _id: expertProfile._id });
            }
            yield user_model_1.default.deleteOne({ _id: userId });
            mail_service_1.default.verifyRejectEmail(user.email, user.username);
            return { message: "Rejected Successfully and user deleted" };
        });
        /**
         * Updates the expert's CV file.
         * - Deletes the old CV from Cloudinary.
         * - Uploads the new CV.
         * - Updates the user's expert profile with the new CV details.
         *
         * @param {Types.ObjectId} userId - The user's ObjectId.
         * @param {Express.Multer.File} file - The uploaded CV file.
         * @returns {Promise<{ message: string }>} Success message.
         */
        this.updatedCv = (userId, file) => __awaiter(this, void 0, void 0, function* () {
            const userExpertProfile = yield this.getOneExpertProfile(userId);
            yield cloudinary_service_1.default.deleteImageOrFile(userExpertProfile.cv.publicId);
            const uploadResult = yield cloudinary_service_1.default.uploadStreamFile(file.buffer, constant_1.CloudinaryFolders.CVS);
            yield expertProfile_model_1.default.updateOne({ _id: userId }, {
                cv: {
                    url: uploadResult.url,
                    publicId: uploadResult.publicId,
                },
            });
            return { message: constant_1.UserSuccess.UPDATED_USER_EXPERT_PROFILE_SUCCESSFULLY };
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
                yield cloudinary_service_1.default.deleteImageOrFile((_b = user.avatar) === null || _b === void 0 ? void 0 : _b.publicId);
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
            yield cloudinary_service_1.default.deleteImageOrFile((_a = user.avatar) === null || _a === void 0 ? void 0 : _a.publicId);
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
            const user = yield user_model_1.default.findById(id).populate("hasExpertProfile");
            if (!user)
                throw new app_error_1.default(constant_1.UserError.USER_NOT_FOUND, statusCode_enum_1.StatusCode.NOT_FOUND);
            return user;
        });
        /**
         * Fetches a single expert profile by user ID.
         * @param {Types.ObjectId} id - The user's ObjectId.
         * @returns {Promise<IExpertProfile>} The expert profile document.
         * @throws {AppError} If no profile is found.
         */
        this.getOneExpertProfile = (id) => __awaiter(this, void 0, void 0, function* () {
            const expertProfile = yield expertProfile_model_1.default.findOne({ userId: id });
            if (!expertProfile)
                throw new app_error_1.default(constant_1.UserError.USER_NOT_FOUND, statusCode_enum_1.StatusCode.NOT_FOUND);
            return expertProfile;
        });
    }
}
exports.default = UserService;
