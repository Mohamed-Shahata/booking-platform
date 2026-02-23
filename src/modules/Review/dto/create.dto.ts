import { Types } from "mongoose";
import z from "zod";
import { ReviewProvider } from "../review.enum";

export const createReviewSchema = z.object({
  body: z.object({
    expertId: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Invalid userId",
    }),
    provider: z.enum(ReviewProvider).default(ReviewProvider.SYSTEM),
    message: z.string().min(10).max(300),
    rating: z.number().min(1).max(5),
  }),
});

export type CreateReviewDto = z.infer<typeof createReviewSchema>["body"];
