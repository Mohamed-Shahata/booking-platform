import { Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  gender: string;
  image?: string;
  phone?: string | null;
  address?: string | null;
  isVerified: boolean;
  verificationCode: string | null;
  verificationCodeExpires: Date | null;
  resetPasswordToken: string | null;
  resetPasswordExpire: Date | null;
  role: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
