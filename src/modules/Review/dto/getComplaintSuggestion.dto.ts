import { z } from "zod";
import { ComplaintType } from "../complaintSuggestion.enum";

export const FindComplaintSuggestionDto = z.object({
  type: z.enum([ComplaintType.COMPLAINT, ComplaintType.SUGGESTION]).optional(),
  userId: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

export type FindComplaintSuggestionDto = z.infer<typeof FindComplaintSuggestionDto>;
