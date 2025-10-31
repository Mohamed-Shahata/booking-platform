import { Types } from "mongoose";
import { ComplaintType } from "./complaintSuggestion.enum";
import { IAvatar } from "../User/user.type";

export interface IComplaintSuggestion {
  userId: Types.ObjectId;
  type: ComplaintType;
  subject: string;
  message: string;
  isResolved?: boolean;
  adminNote?: string;
  createdAt?: Date;
  updatedAt?: Date;
  image?: IAvatar;
}
