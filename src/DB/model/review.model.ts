import { model, Schema } from "mongoose";
import { IReview } from "../../modules/Review/review.type";
import { ReviewProvider } from "../../modules/Review/review.enum";

const reviewSchema = new Schema<IReview>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expertId: {
      type: Schema.Types.ObjectId,
      ref: "ExpertProfile",
      required: true,
    },
    provider: {
      type: String,
      enum: ReviewProvider,
      default: ReviewProvider.SYSTEM,
    },
    message: {
      type: String,
      minLength: 10,
      max: 300,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
  },
  { timestamps: true }
);

const Review = model<IReview>("Review", reviewSchema);
export default Review;
