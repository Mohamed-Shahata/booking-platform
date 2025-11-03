import { Types } from "mongoose";
import z from "zod";

export const createSessionSchema = z.object({
  body: z.object({
    expertId: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Invalid expertId",
    }),
    scheduledAt: z.date(),
    durationMinutes: z.number().min(30).max(180),
    price: z.number(),
  }),
});

export type CreateSessionDto = z.infer<typeof createSessionSchema>["body"];
