import z from "zod";
import { UserGender } from "../user.enum";

export const updateUserSchema = z.object({
  body: z.object({
    username: z.string().min(2).max(15).optional(),
    phone: z.string().optional(),
    gender: z
      .enum([UserGender.MALE, UserGender.FEMALE, UserGender.OTHER])
      .optional(),
  }),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>["body"];
