import z from "zod";
import { UserGender } from "../user.enum";

export const updateUserSchema = z.object({
  body: z.object({
    username: z.string().min(2).max(15).optional(),
    phone: z
      .string()
      .regex(
        /^(?:01[0-2,5]\d{8}|0\d{8})$/,
        "Phone number must be a valid Egyptian mobile or landline number"
      )
      .optional(),
    gender: z
      .enum([UserGender.MALE, UserGender.FEMALE, UserGender.OTHER])
      .optional(),
  }),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>["body"];
