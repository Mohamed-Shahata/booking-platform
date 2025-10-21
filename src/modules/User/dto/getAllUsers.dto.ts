import z from "zod";

export const getAllUserSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

export type GetAllUserDto = z.infer<typeof getAllUserSchema>["query"];
