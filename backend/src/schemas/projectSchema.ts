import { z } from "zod";

export const projectIdParamsSchema = z.object({
  id: z
    .string()
    .regex(/^[1-9]\d*$/, "Invalid project ID")
    .transform(Number)
    .pipe(z.number().int()),
});

export const projectBodySchema = z.object({
  name: z.string().trim().min(1),
  owner_id: z.number().int(),
});

export type ProjectBody = z.infer<typeof projectBodySchema>;
