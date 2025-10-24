"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// generate a new access Token
const generateAccessToken = (data) => {
    return jsonwebtoken_1.default.sign(data, process.env.JWT_SECRET, { expiresIn: "7d" });
};
exports.generateAccessToken = generateAccessToken;
