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
exports.DEFAULT_AVATAR = exports.providerTypes = void 0;
const mongoose_1 = require("mongoose");
const UserRoles_enum_1 = require("../../shared/enums/UserRoles.enum");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_enum_1 = require("../../modules/User/user.enum");
exports.providerTypes = {
    system: "system",
    google: "google",
    facebook: "facebook",
};
exports.DEFAULT_AVATAR = {
    url: "https://res.cloudinary.com/dihm4riw5/image/upload/v1761192839/user-interface-design-computer-icons-default-png-favpng-A0tt8aVzdqP30RjwFGhjNABpm_h4wjdk.jpg",
    publicId: "user-interface-design-computer-icons-default-png-favpng-A0tt8aVzdqP30RjwFGhjNABpm_h4wjdk",
};
const avatarSchema = new mongoose_1.Schema({
    url: {
        type: String,
        required: true,
        default: exports.DEFAULT_AVATAR.url,
    },
    publicId: {
        type: String,
        default: exports.DEFAULT_AVATAR.publicId,
    },
}, { _id: false });
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        minLength: 2,
        maxLength: 15,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: function () {
            return this.provider === exports.providerTypes.system;
        },
    },
    gender: {
        type: String,
        enum: user_enum_1.UserGender,
        default: user_enum_1.UserGender.OTHER,
    },
    avatar: {
        type: avatarSchema,
        default: exports.DEFAULT_AVATAR,
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationCode: {
        type: String,
    },
    verificationCodeExpires: {
        type: Date,
        default: null,
    },
    role: {
        type: String,
        enum: UserRoles_enum_1.UserRoles,
        default: UserRoles_enum_1.UserRoles.CLIENT,
    },
    provider: {
        type: String,
        enum: Object.values(exports.providerTypes),
        default: exports.providerTypes.system,
    },
    isDeleted: {
        type: Date,
        default: null,
    },
    chanageCridentialsTime: {
        type: Date,
    },
    otpSentAt: {
        type: Date,
        default: null,
    },
    hasExpertProfile: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "ExpertProfile",
        default: null,
    },
}, {
    timestamps: true,
});
// Hashing the password before saving in database
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password"))
            return next();
        const salt = yield bcryptjs_1.default.genSalt(+process.env.SALT);
        this.password = yield bcryptjs_1.default.hash(this.password, salt);
        next();
    });
});
// compare the password is match or no
userSchema.methods.comparePassword = function (candidatePassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(candidatePassword, this.password);
    });
};
userSchema.pre("findOneAndUpdate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const update = this.getUpdate();
        if (update.password) {
            const salt = yield bcryptjs_1.default.genSalt(+process.env.SALT);
            update.password = yield bcryptjs_1.default.hash(update.password, salt);
            this.setUpdate(update);
        }
        next();
    });
});
userSchema.pre("updateOne", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const update = this.getUpdate();
        if (update.password) {
            const salt = yield bcryptjs_1.default.genSalt(+process.env.SALT);
            update.password = yield bcryptjs_1.default.hash(update.password, salt);
            this.setUpdate(update);
        }
        next();
    });
});
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
