"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Unified response helper:
 * - Sends a consistent JSON response structure across the application.
 * - Accepts a flexible payload object to allow additional custom fields (e.g., token, meta).
 *
 * @param res     Express response object
 * @param status  HTTP status code
 * @param payload Response body (message, data, errors, and any extra fields)
 */
const sendResponse = (res, status, payload) => {
    res.status(status || 500).json(Object.assign({}, payload));
};
exports.default = sendResponse;
