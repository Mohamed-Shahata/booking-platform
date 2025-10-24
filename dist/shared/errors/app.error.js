"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Custom application error class to handle HTTP status codes
 * and detailed error information
 */
class AppError extends Error {
    constructor(message, status, errors) {
        super(message);
        this.status = status || 500;
        this.errors = errors || {};
    }
}
exports.default = AppError;
