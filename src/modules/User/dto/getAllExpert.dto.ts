import z from "zod";
import { ExpertSpecialty } from "../../../shared/enums/expertProfile.enum";

export const getAllExpertSchema = z.object({
  query: z.object({
    filter: z
      .enum([
        ExpertSpecialty.BUSINESS,
        ExpertSpecialty.IT,
        ExpertSpecialty.MEDICAL,
      ])
      .default(ExpertSpecialty.MEDICAL)
      .optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

export type GetAllExpertDto = z.infer<typeof getAllExpertSchema>["query"];
