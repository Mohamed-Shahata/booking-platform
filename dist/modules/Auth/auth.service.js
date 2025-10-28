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
const statusCode_enum_1 = require("../../shared/enums/statusCode.enum");
const app_error_1 = __importDefault(require("../../shared/errors/app.error"));
const constant_1 = require("../../shared/utils/constant");
const generateTokens_1 = require("../../shared/utils/generateTokens");
const mail_service_1 = __importDefault(require("../../shared/Mail/mail.service"));
const expertProfile_model_1 = __importDefault(require("../../DB/model/expertProfile.model"));
const cloudinary_service_1 = __importDefault(require("../../shared/services/cloudinary.service"));
const UserRoles_enum_1 = require("../../shared/enums/UserRoles.enum");
const google_auth_library_1 = require("google-auth-library");
class AuthService {
    constructor() {
        /**
         * Registers a new user client by creating an account, generating an OTP,
         * and sending a verification email.
         *
         * @param dto - The user registration data (email, username, gender, password)
         * @returns A success message indicating that an OTP has been sent
         */
        this.registerClient = (dto) => __awaiter(this, void 0, void 0, function* () {
            const { email, username, gender, password, phone } = dto;
            const userExsits = yield user_model_1.default.findOne({ email });
            if (userExsits)
                throw new app_error_1.default(constant_1.UserError.USER_ALREADY_EXSITS, statusCode_enum_1.StatusCode.CONFLICT);
            // generate a new OTP
            const otp = this.generateOtp();
            const user = yield user_model_1.default.create({
                username,
                email,
                gender,
                password,
                phone,
                verificationCode: otp,
                verificationCodeExpires: this.generateExpiryTime(5),
            });
            // send otp to user email
            yield mail_service_1.default.sendVreficationEmail(email, username, otp);
            return {
                message: "We sent a new otp of your email, check your email please",
            };
        });
        /**
         * Registers a new user expert by creating an account, generating an OTP,
         * and sending a verification email.
         *
         * @param dto - The user registration data (email, username, gender, password, aboutYou, specialty, yearsOfExperience)
         * @returns A success message indicating that an OTP has been sent
         */
        this.registerExpert = (dto, cvFile) => __awaiter(this, void 0, void 0, function* () {
            const { email, username, gender, password, phone, aboutYou, specialty, yearsOfExperience, } = dto;
            const userExsits = yield user_model_1.default.findOne({ email });
            if (userExsits)
                throw new app_error_1.default(constant_1.UserError.USER_ALREADY_EXSITS, statusCode_enum_1.StatusCode.CONFLICT);
            // generate a new OTP
            const otp = this.generateOtp();
            const user = yield user_model_1.default.create({
                username,
                email,
                gender,
                password,
                phone,
                role: UserRoles_enum_1.UserRoles.EXPERT,
                verificationCode: otp,
                verificationCodeExpires: this.generateExpiryTime(5),
            });
            // upload cv file on cloudinary
            const cvUploadedFile = yield cloudinary_service_1.default.uploadStreamFile(cvFile.buffer, constant_1.CloudinaryFolders.CVS);
            // create a expert profile
            yield expertProfile_model_1.default.create({
                userId: user._id,
                specialty,
                aboutYou,
                yearsOfExperience,
                cv: {
                    url: cvUploadedFile.url,
                    publicId: cvUploadedFile.publicId,
                },
            });
            // send otp to user email
            mail_service_1.default.sendVreficationEmail(email, username, otp);
            return {
                message: "We sent a new otp of your email, check your email please",
            };
        });
        /**
         * Verifies user's email by checking the provided OTP code.
         *
         * @param dto - Email and OTP code for verification
         * @returns A success message upon successful verification
         */
        this.verifyEmail = (dto) => __awaiter(this, void 0, void 0, function* () {
            const { email, code } = dto;
            const user = yield this.findUserByEmail(email);
            if (user.isVerified && user.verificationCode === null)
                throw new app_error_1.default(constant_1.UserError.USER_ACCOUNT_IS_VERIFIED, statusCode_enum_1.StatusCode.BAD_REQUEST);
            if (user.verificationCodeExpires &&
                user.verificationCodeExpires < new Date())
                throw new app_error_1.default(constant_1.ValidationError.CODE_EXPIRED, statusCode_enum_1.StatusCode.BAD_REQUEST);
            if (user.verificationCode !== code)
                throw new app_error_1.default(constant_1.ValidationError.CODE_IS_WRONG, statusCode_enum_1.StatusCode.BAD_REQUEST);
            yield user.updateOne({
                isVerified: true,
                $unset: {
                    verificationCode: 0,
                    verificationCodeExpires: 0,
                    resetPasswordToken: 0,
                    resetPasswordExpire: 0,
                    otpSentAt: 0,
                },
            });
            return { message: "User created successfully" };
        });
        /**
         * Authenticates a user using a Google ID token.
         * If the token is valid and the user exists (or is created),
         * returns the user data along with a newly generated access token.
         *
         * @param idToken - The Google ID token obtained from the client-side Google authentication
         * @returns The authenticated user and generated access token
         *
         * @throws {AppError} If the Google token is invalid, the email is unverified,
         *                    or the provider type doesn't match
         */
        this.loginWithGoogle = (idToken) => __awaiter(this, void 0, void 0, function* () {
            // Verify token from Google
            const ticket = yield this.client.verifyIdToken({
                idToken,
                audience: process.env.WEB_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            if (!payload) {
                throw new app_error_1.default("Invalid Google token", statusCode_enum_1.StatusCode.BAD_REQUEST);
            }
            const { email, name, picture, email_verified } = payload;
            if (!email_verified) {
                throw new app_error_1.default("Google account not verified", statusCode_enum_1.StatusCode.BAD_REQUEST);
            }
            //  Check if user exists
            let user = yield user_model_1.default.findOne({ email });
            //  Create user if doesn't exist
            if (!user) {
                user = yield user_model_1.default.create({
                    userName: name,
                    email,
                    avatar: picture,
                    provider: user_model_1.providerTypes.google,
                    isVerified: true,
                });
            }
            // ⚠️ Validate provider
            if (user.provider !== user_model_1.providerTypes.google) {
                throw new app_error_1.default("Invalid provider for this email", statusCode_enum_1.StatusCode.BAD_REQUEST);
            }
            // 🪪 Generate Access Token
            const accessToken = (0, generateTokens_1.generateAccessToken)({ id: user._id, role: user.role });
            // ✅ Return user and token
            return { user, accessToken };
        });
        /**
       * Authenticates a user by validating email and password.
       * If successful, returns the user data along with an access token.
       *
       * @param dto - Login credentials (email and password)
       * @returns Authenticated user and generated access token
       */
        this.login = (dto) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = dto;
            const user = yield this.findUserByEmail(email, constant_1.ValidationError.EMAIL_OR_PASSWORD_IS_WRONG, true);
            if (!user.isVerified)
                throw new app_error_1.default(constant_1.UserError.USER_ACCOUNT_IS_NOT_VERIFIED, statusCode_enum_1.StatusCode.BAD_REQUEST);
            // check account is deleted or no
            if (user.isDeleted) {
                const daysSinceDelete = user.isDeleted
                    ? (Date.now() - user.isDeleted.getTime()) / (1000 * 60 * 60 * 24)
                    : 0;
                if (daysSinceDelete < 7) {
                    yield user.updateOne({ $unset: { isDeleted: 0 } });
                }
            }
            const isMatch = yield user.comparePassword(password);
            if (!isMatch)
                throw new app_error_1.default(constant_1.ValidationError.EMAIL_OR_PASSWORD_IS_WRONG, statusCode_enum_1.StatusCode.BAD_REQUEST);
            // generate a new access token
            const accessToken = (0, generateTokens_1.generateAccessToken)({ id: user._id, role: user.role });
            return { user, accessToken };
        });
        /**
         * Verifies user's email by checking the provided OTP code.
         *
         * @param dto - Email verification
         * @returns A success message upon successful send code
         */
        this.forgetPassword = (dto) => __awaiter(this, void 0, void 0, function* () {
            const { email } = dto;
            const user = yield this.findUserByEmail(email, constant_1.ValidationError.EMAIL_OR_PASSWORD_IS_WRONG, true);
            if (!user.isVerified)
                throw new app_error_1.default(constant_1.UserError.USER_ACCOUNT_IS_NOT_VERIFIED, statusCode_enum_1.StatusCode.BAD_REQUEST);
            // generate a new OTP
            const otp = this.generateOtp();
            // send otp to user email
            yield mail_service_1.default.sendRestPassword(email, user.username, otp);
            yield user.updateOne({
                verificationCode: otp,
                verificationCodeExpires: this.generateExpiryTime(5),
            });
            return { message: "Done" };
        });
        /**
         * Verifies user's email by checking the provided OTP code.
         *
         * @param dto - Email and OTP code and password for verification
         * @returns A success message upon password was changed
         */
        this.restPassword = (dto) => __awaiter(this, void 0, void 0, function* () {
            const { email, code, password } = dto;
            const user = yield this.findUserByEmail(email, constant_1.ValidationError.EMAIL_OR_PASSWORD_IS_WRONG, true);
            if (!user.isVerified)
                throw new app_error_1.default(constant_1.UserError.USER_ACCOUNT_IS_NOT_VERIFIED, statusCode_enum_1.StatusCode.BAD_REQUEST);
            if (user.verificationCodeExpires &&
                user.verificationCodeExpires < new Date())
                throw new app_error_1.default(constant_1.ValidationError.CODE_EXPIRED, statusCode_enum_1.StatusCode.BAD_REQUEST);
            // check the otp = code
            if (user.verificationCode !== code)
                throw new app_error_1.default(constant_1.ValidationError.CODE_IS_WRONG, statusCode_enum_1.StatusCode.BAD_REQUEST);
            yield user.updateOne({
                password,
                isVerified: true,
                chanageCridentialsTime: Date.now(),
                $unset: {
                    verificationCode: 0,
                    verificationCodeExpires: 0,
                    resetPasswordToken: 0,
                    resetPasswordExpire: 0,
                    otpSentAt: 0,
                },
            });
            return { message: "Done" };
        });
        /**
         * Resends a new verification code (OTP) to the user's email.
         *
         * This method:
         * 1. Finds the user by their email.
         * 2. Checks if the user account is verified.
         * 3. Generates a new OTP code.
         * 4. Sends the OTP to the user's email.
         * 5. Updates the user's record with the new OTP, its expiry time, and the timestamp when it was sent.
         *
         * @param {resendCodeDto} dto - The data transfer object containing the user's email.
         * @returns {Promise<{ message: string }>} A confirmation message indicating that the operation was completed.
         *
         * @throws {AppError} If the user is not verified or the email does not exist.
         */
        this.resendCode = (dto) => __awaiter(this, void 0, void 0, function* () {
            const { email } = dto;
            // 1. Find the user by email
            const user = yield this.findUserByEmail(email, constant_1.ValidationError.EMAIL_OR_PASSWORD_IS_WRONG, true);
            // 2. Check if the user is verified
            // if (!user.isVerified)
            //   throw new AppError(
            //     UserError.USER_ACCOUNT_IS_NOT_VERIFIED,
            //     StatusCode.BAD_REQUEST
            //   );
            const now = Date.now();
            const FIVE_MINUTES = 5 * 60 * 1000;
            // 3. Check if a code was sent recently
            if (user.otpSentAt) {
                const diff = now - new Date(user.otpSentAt).getTime();
                if (diff < FIVE_MINUTES) {
                    const remaining = Math.ceil((FIVE_MINUTES - diff) / 1000 / 60);
                    throw new app_error_1.default(`Please wait ${remaining} minute(s) before requesting another code.`, statusCode_enum_1.StatusCode.BAD_REQUEST);
                }
            }
            // 4. Generate a new OTP
            const otp = this.generateOtp();
            // 5. Send the OTP to the user's email
            yield mail_service_1.default.sendRestPassword(email, user.username, otp);
            // 6. Update the user with the new OTP, expiry time, and sent time
            yield user.updateOne({
                verificationCode: otp,
                verificationCodeExpires: this.generateExpiryTime(5),
                otpSentAt: new Date(),
            });
            // 7. Return a success message
            return { message: "Verification code resent successfully" };
        });
        /**
         * Finds a user by email with optional validation message and password selection.
         *
         * @param email - The email address of the user to search for
         * @param messageValidation - (Optional) Custom error message if user is not found
         * @param selectPassword - (Optional) Whether to include the user's password field in the result
         *
         * @returns The user document if found
         * @throws AppError if the user does not exist
         */
        this.findUserByEmail = (email_1, messageValidation_1, ...args_1) => __awaiter(this, [email_1, messageValidation_1, ...args_1], void 0, function* (email, messageValidation, selectPassword = false) {
            const selectPass = "+password";
            const notSelectPass = "-password";
            const user = yield user_model_1.default.findOne({ email }).select(selectPassword ? selectPass : notSelectPass);
            if (!user)
                throw new app_error_1.default(messageValidation || constant_1.UserError.USER_NOT_FOUND, statusCode_enum_1.StatusCode.BAD_REQUEST);
            return user;
        });
        /**
         * Generates a future timestamp for OTP expiration.
         *
         * @param minutes - Expiration time in minutes
         * @returns A Date object representing the expiry time
         */
        this.generateExpiryTime = (minutes) => {
            return new Date(Date.now() + minutes * 60 * 1000);
        };
        /**
         * Generates a random numeric OTP code.
         *
         * @returns A 6 digit OTP as a string
         */
        this.generateOtp = () => {
            return Math.floor(100000 + Math.random() * 900000).toString();
        };
        this.client = new google_auth_library_1.OAuth2Client(process.env.WEB_CLIENT_ID);
    }
}
exports.default = AuthService;
