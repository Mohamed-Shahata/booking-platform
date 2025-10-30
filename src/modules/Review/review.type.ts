import { Types } from "mongoose";

export interface IReview {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  expertId: Types.ObjectId;
  provider: string;
  text: string;
  stars: number;
}
