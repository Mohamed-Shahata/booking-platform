import z from "zod";
import { ExpertSpecialty } from "../../../shared/enums/expertProfile.enum";

export const getAllExpertSchema = z.object({
  query: z.object({
    specialty: z
      .enum([
        ExpertSpecialty.BUSINESS,
        ExpertSpecialty.IT,
        ExpertSpecialty.MEDICAL,
      ])
      .default(ExpertSpecialty.MEDICAL)
      .optional(),
    yearsOfExperience: z.number().min(2).optional(),
    page: z.string().optional(),
    rate: z
      .number({
        error: "Rate must be a number",
      })
      .min(1, "Rate must be at least 1")
      .max(5, "Rate cannot be more than 5")
      .optional(),
    limit: z.string().optional(),
  }),
});

export type GetAllExpertDto = z.infer<typeof getAllExpertSchema>["query"];
