import { model, Schema } from "mongoose";
import { IReview } from "../../modules/Review/review.type";

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
    text: {
      type: String,
      minLength: 10,
      max: 300,
      required: true,
    },
    stars: {
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
