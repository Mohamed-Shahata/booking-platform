import { Types } from "mongoose";
import z from "zod";

export const createPaymentForSessionSchema = z.object({
  params: z.object({
    sessionId: z.string().refine((val) => Types.ObjectId.isValid(val), {
      message: "Invalid sessionId",
    }),
  }),
  body: z.object({
    clientEmail: z.email(),
  }),
});

export type CreatePaymentForSessionBodyDto = z.infer<
  typeof createPaymentForSessionSchema
>["body"];

export type CreatePaymentForSessionParamsDto = z.infer<
  typeof createPaymentForSessionSchema
>["params"];
