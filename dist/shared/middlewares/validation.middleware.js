"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const app_error_1 = __importDefault(require("../errors/app.error"));
const statusCode_enum_1 = require("../enums/statusCode.enum");
const constant_1 = require("../utils/constant");
const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            params: req.params,
            query: req.query,
        });
        next();
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            throw new app_error_1.default(constant_1.ValidationError.VALIDATION_ERROR, statusCode_enum_1.StatusCode.BAD_REQUEST, err.issues);
        }
        next(err);
    }
};
exports.default = validate;
