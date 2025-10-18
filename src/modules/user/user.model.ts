import { Document, Schema, model } from "mongoose";
import { UserGender } from "./user.enum";
import { UserRoles } from "../../shared/enums/UserRoles.enum";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  gender: string;
  image?: string;
  phone?: string | null;
  address?: string | null;
  isVerify: boolean;
  verificationCode: number | null;
  verificationCodeExpires: Date | null;
  resetPasswordToken: string | null;
  resetPasswordExpire: Date | null;
  role: string;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
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
      default: "uploads/defaultProfile.png",
    },
    phone: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
    isVerify: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: Number,
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

const User = model<IUser>("User", userSchema);
export default User;
