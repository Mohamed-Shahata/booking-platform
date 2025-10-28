import { model, Schema } from "mongoose";
import {
  ICV,
  IExpertProfile,
} from "../../modules/User/expertProfile.type";
import { ExpertSpecialty } from "../../shared/enums/expertProfile.enum";

const cvShema = new Schema<ICV>(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const expertProfileSchema = new Schema<IExpertProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    specialty: {
      type: String,
      enum: ExpertSpecialty,
      default: ExpertSpecialty.IT,
      required: true,
    },
    yearsOfExperience: {
      type: Number,
      min: 2,
      required: true,
    },
    cv: cvShema,
    aboutYou: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
    rateing: {
      type: Number,
    },
  },
  { timestamps: true }
);

const ExpertProfile = model<IExpertProfile>(
  "ExpertProfile",
  expertProfileSchema
);
export default ExpertProfile;
