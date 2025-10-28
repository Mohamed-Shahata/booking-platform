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
  provider: string;
  isDeleted?: Date;
  otpSentAt?: Date;
  chanageCridentialsTime?: Date | null;
  hasExpertProfile: IExpertProfile | null;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface ICV {
  url: string;
  publicId: string;
}

export interface IExpertProfile extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  specialty: string;
  yearsOfExperience: number;
  cv: ICV;
  aboutYou: string;
  bio?: string | null;
  rateing?: number;
}
