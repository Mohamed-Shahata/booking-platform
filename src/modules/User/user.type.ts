import { Document, Types } from "mongoose";

interface IAvatar {
  url: string;
  publicId: string | null;
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  gender: string;
  avatar?: IAvatar;
  phone?: string | null;
  address?: string | null;
  isVerified: boolean;
  verificationCode: string | null;
  verificationCodeExpires: Date | null;
  resetPasswordToken: string | null;
  resetPasswordExpire: Date | null;
  role: string;
  isDeleted?:Date;
  otpSentAt?: Date;
  chanageCridentialsTime?: Date | null;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
