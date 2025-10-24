"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = exports.uploadImage = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const app_error_1 = __importDefault(require("../errors/app.error"));
const statusCode_enum_1 = require("../enums/statusCode.enum");
const uploadDir = path_1.default.join(__dirname, "../../uploads");
if (!fs_1.default.existsSync(uploadDir))
    fs_1.default.mkdirSync(uploadDir);
/**
 * Configure how files are stored temporarily on disk
 */
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueName + path_1.default.extname(file.originalname));
    },
});
/**
 * File filter to allow only image types
 */
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
        "application/pdf",
    ];
    if (!allowedTypes.includes(file.mimetype))
        return cb(new app_error_1.default("Only image files are allowed (jpg, png, webp)", statusCode_enum_1.StatusCode.BAD_REQUEST), false);
    cb(null, true);
};
/**
 * Initialize Multer upload middleware
 *
 * - Uses the configured storage and file filter
 * - Sets a file size limit (5 MB)
 */
exports.uploadImage = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fieldSize: 5 * 1024 * 1024 }, // 5 MB
});
/**
 * Initialize Multer upload middleware
 *
 * - Uses the configured storage and file filter
 * - Sets a file size limit (5 MB)
 */
exports.uploadFile = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    fileFilter,
    limits: { fieldSize: 5 * 1024 * 1024 }, // 5 MB
});
