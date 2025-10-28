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
const cloudinary_config_1 = __importDefault(require("../../config/cloudinary.config"));
const fs_1 = __importDefault(require("fs"));
const app_error_1 = __importDefault(require("../errors/app.error"));
const statusCode_enum_1 = require("../enums/statusCode.enum");
class CloudinaryService {
    static uploadImage(filePath_1) {
        return __awaiter(this, arguments, void 0, function* (filePath, folder = "uploads") {
            try {
                const result = yield cloudinary_config_1.default.uploader.upload(filePath, { folder });
                fs_1.default.unlinkSync(filePath);
                return {
                    url: result.secure_url,
                    publicId: result.public_id,
                };
            }
            catch (err) {
                if (filePath)
                    fs_1.default.unlinkSync(filePath);
                console.log(err);
                throw new app_error_1.default("file upload faild", statusCode_enum_1.StatusCode.BAD_REQUEST);
            }
        });
    }
    static deleteImageOrFile(publicId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield cloudinary_config_1.default.uploader.destroy(publicId);
            }
            catch (err) {
                throw new app_error_1.default("Image deletion faild", statusCode_enum_1.StatusCode.BAD_REQUEST);
            }
        });
    }
    static uploadStreamFile(fileBuffer_1) {
        return __awaiter(this, arguments, void 0, function* (fileBuffer, folder = "cv") {
            try {
                const result = yield new Promise((resolve, reject) => {
                    const upload = cloudinary_config_1.default.uploader.upload_stream({ folder }, (error, result) => {
                        if (error || !result) {
                            reject(new app_error_1.default("File upload failed", statusCode_enum_1.StatusCode.BAD_REQUEST));
                        }
                        resolve({
                            url: result === null || result === void 0 ? void 0 : result.secure_url,
                            publicId: result === null || result === void 0 ? void 0 : result.public_id,
                        });
                    });
                    upload.end(fileBuffer);
                });
                return result;
            }
            catch (err) {
                console.error(err);
                throw new app_error_1.default("Stream upload failed", statusCode_enum_1.StatusCode.BAD_REQUEST);
            }
        });
    }
}
exports.default = CloudinaryService;
