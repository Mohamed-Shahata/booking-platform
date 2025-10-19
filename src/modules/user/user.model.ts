import { Schema, model } from "mongoose";
import { UserGender } from "./user.enum";
import { UserRoles } from "../../shared/enums/UserRoles.enum";
import { IUser } from "./user.type";
import bcrypt from "bcryptjs";

const userSchema = new Schema<IUser>(
  {
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
      minLength: 8,
      required: true,
    },
    gender: {
      type: String,
      enum: UserGender,
      default: UserGender.OTHER,
    },
    image: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg",
    },
    phone: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      default: null,
    },
    verificationCodeExpires: {
      type: Date,
      default: null,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpire: {
      default: null,
      type: Date,
    },
    role: {
      type: String,
      enum: UserRoles,
      default: UserRoles.CLIENT,
    },
  },
  {
    timestamps: true,
  }
);

// Hashing the password before saving in database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(+process.env.SALT!);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

const User = model<IUser>("User", userSchema);
export default User;
