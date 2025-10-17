import mongoose ,{Document, Schema ,  model} from "mongoose";
import {UserGender} from './user.enum'
import {UserRoles } from '../../Shared/enums/UserRoles.enum'

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    gender: string;
    image?: string ;
    phone?: string | null;
    address?: string | null;
    isVerify: boolean;
    verificationCode: number | null;
    verificationCodeExpires: Date | null;
    resetPasswordToken: string | null;
    resetPasswordExpire: Date |null;
    role: string;
}

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: [true, 'Username required'],
        minlength: [6, 'Name too short'],
        maxlength: [15, 'Name too long'],
        validate: {
            validator: function (v: string) {
                return /^[A-Za-z][A-Za-z0-9]*$/.test(v);
            },
            message: 'Username must start with a letter and contain only letters and numbers'
        }
    },
    email: {
        type: String,
        required: [true, 'Email required'],
        unique: [true, 'Email already exists'],
    },
    password: {
        type: String,
        required: [true,'password require']
    },
    gender: {
        type: String,
        enum: UserGender,
        default:UserGender.OTHER
    },
    image: {
        type: String,
        default: 'uploads/defaultProfile.png'
    },
    phone: {
        type: String ,
        default: null
    },
    address: {
        type: String,
        default: null
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
        type: Date,
        default:null
    },
    resetPasswordToken: {
        type: String,
        default:null
    },
    resetPasswordExpire: {
        default:null,
        type: Date
    },
    role: {
        type: String,
        enum:UserRoles,
        default: UserRoles.CLIENT
    }
    }, {
    timestamps: true }
);


export const UserModel= model<IUser>('User',userSchema)

