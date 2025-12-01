import z from "zod";
import { Types } from "mongoose";
import { UserGender } from "../user.enum";
import { ExpertSpecialty } from "../../../shared/enums/expertProfile.enum";
import { UserRoles } from "../../../shared/enums/UserRoles.enum";

/**
 * Unified schema for updating both User and ExpertProfile
 * (works for both Client and Expert users)
 */
export const updateUserSchema = z.object({
  body: z.object({
    // ---------- USER FIELDS ----------
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

    // ---------- EXPERT FIELDS ----------

    specialty: z.enum(ExpertSpecialty).optional(),

    yearsOfExperience: z.number().min(2).optional(),

    aboutYou: z.string().optional(),

    bio: z.string().optional(),

    location: z.string().min(3).max(70).optional(),

    nameWorked: z.string().min(3).max(50).optional(),

    role: z.enum([UserRoles.CLIENT, UserRoles.EXPERT]),
  }),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>["body"];
