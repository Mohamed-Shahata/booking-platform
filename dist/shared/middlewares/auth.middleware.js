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
exports.isAccount = exports.authRoles = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constant_1 = require("../utils/constant");
const statusCode_enum_1 = require("../enums/statusCode.enum");
const mongoose_1 = require("mongoose");
const UserRoles_enum_1 = require("../enums/UserRoles.enum");
const app_error_1 = __importDefault(require("../errors/app.error"));
const user_model_1 = __importDefault(require("../../DB/model/user.model"));
/**
 * Authentication middleware:
 * - Checks for the presence and format of the Authorization header.
 * - Verifies the JWT token and attaches the decoded user data to the request.
 * - Throws an appropriate AppError for missing or invalid tokens.
 *
 * @param req  Express request object
 * @param res  Express response object
 * @param next Express next middleware function
 */
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            throw new app_error_1.default(constant_1.AuthErrors.NO_TOKEN_PROVIDED, statusCode_enum_1.StatusCode.UNAUTHORIZED);
        const parts = authHeader.split(" ");
        if (parts.length !== 2 && parts[0] === process.env.BEARER_PRIFIX)
            throw new app_error_1.default(constant_1.AuthErrors.BAD_TOKEN_FORMAT, statusCode_enum_1.StatusCode.UNAUTHORIZED);
        const token = parts[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = yield user_model_1.default.findById(decoded.id);
        if (!user)
            throw new app_error_1.default(constant_1.UserError.USER_NOT_FOUND, statusCode_enum_1.StatusCode.NOT_FOUND);
        if (((_a = user.chanageCridentialsTime) === null || _a === void 0 ? void 0 : _a.getTime()) >= decoded.iat * 1000) {
            throw new app_error_1.default(constant_1.AuthErrors.IN_VAILAD_CRIDENTIALSTIME, statusCode_enum_1.StatusCode.UNAUTHORIZED);
        }
        req.user = decoded;
        next();
    }
    catch (err) {
        if (err.name === "TokenExpiredError")
            throw new app_error_1.default(constant_1.AuthErrors.EXPIRED_TOKEN, statusCode_enum_1.StatusCode.UNAUTHORIZED);
        throw new app_error_1.default(constant_1.AuthErrors.INVALID_TOKEN, statusCode_enum_1.StatusCode.FORBIDDEN);
    }
});
exports.auth = auth;
/**
 * Role-Based Authorization Middleware:
 * - Accepts allowed roles as parameters.
 * - Blocks access if the authenticated user's role is not permitted.
 */
const authRoles = (...roles) => {
    return (req, res, next) => {
        if (req.user && !roles.includes(req.user.role))
            throw new app_error_1.default(constant_1.AuthErrors.ACCESS_DENIED, statusCode_enum_1.StatusCode.FORBIDDEN);
        next();
    };
};
exports.authRoles = authRoles;
/**
 * Account Ownership Middleware:
 * - Allows access only if the user is acting on their own account.
 * - Admin users bypass this restriction.
 */
const isAccount = (req, res, next) => {
    const userId = new mongoose_1.Types.ObjectId(req.params.userId);
    if (req.user && req.user.id !== userId && req.user.role !== UserRoles_enum_1.UserRoles.ADMIN)
        throw new app_error_1.default(constant_1.AuthErrors.ACCESS_DENIED, statusCode_enum_1.StatusCode.FORBIDDEN);
    next();
};
exports.isAccount = isAccount;
