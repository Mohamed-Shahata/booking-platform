import { Types } from "mongoose";

export interface IChat {
  sessionId: Types.ObjectId;
  from: Types.ObjectId;
  to: Types.ObjectId;
  message: string;
}
