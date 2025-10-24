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
const node_cron_1 = __importDefault(require("node-cron"));
const user_model_1 = __importDefault(require("../DB/model/user.model"));
const cloudinary_service_1 = __importDefault(require("../shared/services/cloudinary.service"));
node_cron_1.default.schedule("0 0 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const usersToDelete = yield user_model_1.default.find({
        isDeleted: true,
        deletedAt: { $lte: sevenDaysAgo },
    });
    if (usersToDelete.length === 0)
        return;
    yield Promise.all(usersToDelete.map((user) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if ((_a = user.avatar) === null || _a === void 0 ? void 0 : _a.publicId)
            yield cloudinary_service_1.default.deleteImage(user.avatar.publicId);
    })));
    yield user_model_1.default.deleteMany({
        isDeleted: { $lte: sevenDaysAgo },
    });
    console.log("[CRON] Deleted users older than 7 days.");
}));
