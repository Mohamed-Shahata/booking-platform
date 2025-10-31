import { z } from "zod";
import { ComplaintType } from "../complaintSuggestion.enum";

export const createComplaintSuggestionSchema = z.object({
  type: z.nativeEnum(ComplaintType, {
    error: "Type is required",
  }),
  subject: z
    .string({
      error: "Subject is required",
    })
    .min(5, "Subject must be at least 5 characters")
    .max(100, "Subject cannot exceed 100 characters"),
  message: z
    .string({
      error: "Message is required",
    })
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message cannot exceed 500 characters"),
});

export type CreateComplaintSuggestionDto = z.infer<
  typeof createComplaintSuggestionSchema
>;
