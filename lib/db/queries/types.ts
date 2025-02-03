/**
 * @fileoverview Type definitions and schemas for team member data structures
 * @module lib/db/queries/types
 */

import { z } from "zod";

/**
 * Zod schema for validating and typing team member data from the database
 * @description Defines the structure of a team member including their user details and organization information
 *
 * @example
 * // Validate incoming team member data
 * const rawData = await fetchTeamMember();
 * const validatedMember = teamMemberSelectSchema.parse(rawData);
 *
 * @example
 * // Type checking with TypeScript
 * function handleTeamMember(member: TeamMember) {
 *   console.log(`${member.user.name} is a ${member.role} in ${member.organization.name}`);
 * }
 */
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

/**
 * TypeScript type derived from the team member schema
 * @description Use this type for type-safe operations with team member data
 *
 * @example
 * // Using the type in a React component
 * interface Props {
 *   teamMember: TeamMember;
 * }
 *
 * export function TeamMemberCard({ teamMember }: Props) {
 *   return (
 *     <div>
 *       <h2>{teamMember.user.name}</h2>
 *       <p>Role: {teamMember.role}</p>
 *       <p>Organization: {teamMember.organization.name}</p>
 *     </div>
 *   );
 * }
 */
export type TeamMember = z.infer<typeof teamMemberSelectSchema>;
