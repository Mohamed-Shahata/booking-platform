import z from "zod";
import { UserGender } from "../../User/user.enum";

export const registerSchema = z.object({
  body: z.object({
    username: z.string().min(2).max(15),
    email: z.email(),
    password: z.string().min(8).max(50),
    gender: z.enum([UserGender.MALE, UserGender.FEMALE, UserGender.OTHER]),
  }),
});

export type RegisterDto = z.infer<typeof registerSchema>["body"];
