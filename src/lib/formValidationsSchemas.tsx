import { z } from "zod";

export const subjectSchema = z.object({
  name: z.string().min(1, { message: "Назва предмету обов'язкова" }),
});

export type SubjectSchema = z.infer<typeof subjectSchema>;
