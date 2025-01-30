import { z } from "zod";

export const teamMemberSelectSchema = z.object({
  id: z.string(),
  role: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    image: z.string(),
  }),
  organization: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

export type TeamMember = z.infer<typeof teamMemberSelectSchema>;
