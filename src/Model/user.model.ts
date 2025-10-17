import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  gender?: string;
  image?: string;
  phone?: string;
  address?: string;
  isVerify?: boolean;
  verificationCode?: number;
  verificationCodeExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  role?: string;
}

const userSchema = new mongoose.Schema<IUser>({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
    },
    image: {
        type: String,
        default: 'default-profile.png'
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },
    isVerify: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: Number,
        default:null
    },
    verificationCodeExpires: {
        type: Date
    },
    resetPasswordToken: {
        type: String,
        default:null
    },
    resetPasswordExpire: {
        type: Date
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'expert'],
        default: 'user'
    }
    }, {
    timestamps: true }
);


export const UserModel=mongoose.model<IUser>('user',userSchema)