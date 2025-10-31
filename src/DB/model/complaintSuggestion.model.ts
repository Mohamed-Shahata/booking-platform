import { model, Schema } from "mongoose";
import { IComplaintSuggestion } from "../../modules/Review/Complaint.type";
import { ComplaintType } from "../../modules/Review/complaintSuggestion.enum";

const complaintSuggestionSchema = new Schema<IComplaintSuggestion>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(ComplaintType),
      required: true,
    },
    subject: {
      type: String,
      minLength: 5,
      maxLength: 100,
      required: true,
    },
    message: {
      type: String,
      minLength: 10,
      maxLength: 500,
      required: true,
    },
    image: {
      type:{
        url: { type: String, required: true  },
        publicId: { type: String, required: true }
      }, 
    },
    isResolved: {
      type: Boolean,
      default: false,
    },
    adminNote: {
      type: String,
      maxLength: 300,
    },
  },
  { timestamps: true }
);

const ComplaintSuggestion = model<IComplaintSuggestion>(
  "ComplaintSuggestion",
  complaintSuggestionSchema
);

export default ComplaintSuggestion;
