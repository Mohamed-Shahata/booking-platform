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
exports.sessionController = exports.SessionController = void 0;
const mongoose_1 = require("mongoose");
const session_service_1 = require("./session.service");
const sendResponse_1 = __importDefault(require("../../shared/utils/sendResponse"));
const statusCode_enum_1 = require("../../shared/enums/statusCode.enum");
class SessionController {
    constructor() {
        this.createSession = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = new mongoose_1.Types.ObjectId((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
            const dto = req.body;
            const session = yield this.sessionService.createSession(userId, dto);
            (0, sendResponse_1.default)(res, statusCode_enum_1.StatusCode.CREATED, { data: { session }, success: true });
        });
        this.sessionService = new session_service_1.SessionService();
    }
}
exports.SessionController = SessionController;
exports.sessionController = new SessionController();
