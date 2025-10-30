import { Types } from "mongoose";

export interface IReview {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  expertId: Types.ObjectId;
  text: string;
  stars: number;
}
