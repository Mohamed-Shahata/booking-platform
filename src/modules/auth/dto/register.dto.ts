import z from "zod";

export const registerSchema = z.object({
  body: z.object({
    username: z.string().min(2).max(15),
    email: z.email(),
    password: z.string().min(8).max(50),
    gender: z.enum(["male", "female", "other"]),
  }),
});

export type RegisterDto = z.infer<typeof registerSchema>["body"];
