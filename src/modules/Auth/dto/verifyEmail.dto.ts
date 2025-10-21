import z from "zod";

export const verifyEmailSchema = z.object({
  body: z.object({
    email: z.email(),
    code: z.string().min(6),
  }),
});

export type VerifyEmailDto = z.infer<typeof verifyEmailSchema>["body"];
