import { Types } from "mongoose";
import z from "zod";

export const markPaidSchema = z.object({
  body: z.object({
    paymobOrderId: z.number().optional(),
    paymobPaymentToken: z.string().optional(),
  }),
});

export type MarkPaidDto = z.infer<typeof markPaidSchema>["body"];
