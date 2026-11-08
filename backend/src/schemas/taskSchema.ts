import z from "zod";

export const taskIdParamsSchema = z.object({
  id: z
    .string()
    .regex(/^[1-9]\d*$/, "Invalid task ID")
    .transform(Number)
    .pipe(z.number().int()),
});

export const taskBodySchema = z.object({
  project_id: z.number().int(),
  title: z.string().trim().min(1),
  description: z.string().trim().optional(),
  status: z.enum(["todo", "in_progress", "done"]),
  position: z.number().int(),
  assignee_id: z.number().int().optional(),
});

export type TaskBody = z.infer<typeof taskBodySchema>;