
import z from "zod";

export const forgetPasswordSchema = z.object({
  body: z.object({
    email: z.email()
  }),
});

export type forgetPasswordDto = z.infer<typeof forgetPasswordSchema>["body"];
