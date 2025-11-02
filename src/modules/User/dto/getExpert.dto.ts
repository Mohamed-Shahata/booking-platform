import z, { email } from "zod";
import { ExpertSpecialty } from "../../../shared/enums/expertProfile.enum";

export const getOneExpertSchema = z.object({
  query: z.object({
    specialty: z
      .enum([
        ExpertSpecialty.BUSINESS,
        ExpertSpecialty.IT,
        ExpertSpecialty.MEDICAL,
      ])
      .optional(),
    username: z.string().optional(),
    email: z.string().email().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

export type GetOneExpertDto = z.infer<typeof getOneExpertSchema>["query"];
