"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
const statusCode_enum_1 = require("../shared/enums/statusCode.enum");
const app_error_1 = __importDefault(require("../shared/errors/app.error"));
const allowedOrigins = ["http://localhost:3000"];
exports.corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new app_error_1.default("Not allowed by CORS", statusCode_enum_1.StatusCode.BAD_REQUEST));
        }
    },
};
