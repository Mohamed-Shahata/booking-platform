
import z from "zod";

export const resendCodeSchema = z.object({
  body: z.object({
    email: z.email()
  }),
});

export type resendCodeDto = z.infer<typeof resendCodeSchema>["body"];
