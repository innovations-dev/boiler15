import { z } from "zod";

export const teamMemberSelectSchema = z.object({
  id: z.string(),
  role: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    image: z.string().nullable(),
  }),
  organization: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

export type TeamMember = z.infer<typeof teamMemberSelectSchema>;
