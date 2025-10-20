import z from "zod";

export const restPasswordSchema = z.object({
  body: z.object({
    email: z.email(),
    code: z.string().min(6),
    password: z.string().min(8).max(50)
  }),
});

export type restPasswordDto = z.infer<typeof restPasswordSchema>["body"];
