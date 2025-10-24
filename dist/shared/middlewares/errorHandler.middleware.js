"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
const constant_1 = require("../utils/constant");
/**
 * Global Error Handling Middleware:
 * - Captures thrown AppError instances across the application.
 * - Sends a structured JSON response with status, message, and error details.
 * - Ensures the server responds gracefully instead of crashing.
 *
 * @param err  Thrown error (expected AppError)
 * @param req  Express request object
 * @param res  Express response object
 * @param next Express next function
 */
const errorHandler = (err, req, res, next) => {
    if (err)
        return (0, sendResponse_1.default)(res, err.status, {
            success: false,
            message: err.message || constant_1.ServerErrors.INTERNAL_SERVER_ERROR,
            data: null,
            errors: err.errors,
        });
    next();
};
exports.default = errorHandler;
