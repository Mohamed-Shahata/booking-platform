import z from "zod";

export const getAllReviewSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

export type GetAllReviewDto = z.infer<typeof getAllReviewSchema>["query"];
