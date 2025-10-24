import { Document, Types } from "mongoose";

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
