import { Schema, model } from "mongoose";
import { UserRoles } from "../../shared/enums/UserRoles.enum";
import bcrypt from "bcryptjs";
import { IUser } from "../../modules/User/user.type";
import { UserGender } from "../../modules/User/user.enum";
export const providerTypes = {
  system: "system",
  google: "google",
  facebook: "facebook",
};
export const DEFAULT_AVATAR = {
  url: "https://res.cloudinary.com/dihm4riw5/image/upload/v1761192839/user-interface-design-computer-icons-default-png-favpng-A0tt8aVzdqP30RjwFGhjNABpm_h4wjdk.jpg",
  publicId:
    "user-interface-design-computer-icons-default-png-favpng-A0tt8aVzdqP30RjwFGhjNABpm_h4wjdk",
};

const avatarSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
      default: DEFAULT_AVATAR.url,
    },
    publicId: {
      type: String,
      default: DEFAULT_AVATAR.publicId,
    },
  },
  { _id: false }
);

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
      required: function (this: IUser) {
        return this.provider === providerTypes.system;
      },
    },
    gender: {
      type: String,
      enum: UserGender,
      default: UserGender.OTHER,
    },
    avatar: {
      type: avatarSchema,
      default: DEFAULT_AVATAR,
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
    resetPasswordExpire: {
      type: Date,
    },
    role: {
      type: String,
      enum: UserRoles,
      default: UserRoles.CLIENT,
    },
    provider: {
      type: String,
      enum: Object.values(providerTypes),
      default: providerTypes.system,
    },
    isDeleted: Date,
    chanageCridentialsTime: {
      type: Date,
    },
    otpSentAt: Date,
    hasExpertProfile: {
      type: Schema.Types.ObjectId,
      ref: "ExpertProfile",
      default: null,
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

// compare the password is match or no
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as any;
  if (update.password) {
    const salt = await bcrypt.genSalt(+process.env.SALT!);
    update.password = await bcrypt.hash(update.password, salt);
    this.setUpdate(update);
  }
  next();
});
userSchema.pre("updateOne", async function (next) {
  const update = this.getUpdate() as any;
  if (update.password) {
    const salt = await bcrypt.genSalt(+process.env.SALT!);
    update.password = await bcrypt.hash(update.password, salt);
    this.setUpdate(update);
  }

  next();
});

const User = model<IUser>("User", userSchema);
export default User;
