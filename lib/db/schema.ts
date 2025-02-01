import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";

export const user = sqliteTable(
  "user",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: integer("email_verified", { mode: "boolean" }).notNull(),
    image: text("image"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
    role: text("role"),
    banned: integer("banned", { mode: "boolean" }),
    banReason: text("ban_reason"),
    banExpires: integer("ban_expires", { mode: "timestamp" }),
  },
  (table) => ({
    emailIdx: index("user_email_idx").on(table.email),
    nameIdx: index("user_name_idx").on(table.name),
    roleIdx: index("user_role_idx").on(table.role),
  })
);

export const UserSelectSchema = createSelectSchema(user);
export const UserInsertSchema = createInsertSchema(user);
export const UserUpdateSchema = createUpdateSchema(user);

export type User = z.infer<typeof UserSelectSchema>;
export type UserInsert = typeof user.$inferInsert;

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  impersonatedBy: text("impersonated_by"),
  activeOrganizationId: text("active_organization_id"),
});

export const SessionSelectSchemaCoerced = createSelectSchema(session, {
  expiresAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const SessionSelectSchema = createSelectSchema(session);
export const SessionInsertSchema = createInsertSchema(session);
export const SessionUpdateSchema = createUpdateSchema(session);

export type Session = z.infer<typeof SessionSelectSchemaCoerced>;
export type SessionInsert = typeof session.$inferInsert;

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const AccountSelectSchema = createSelectSchema(account);
export const AccountInsertSchema = createInsertSchema(account);
export const AccountUpdateSchema = createUpdateSchema(account);

export type Account = z.infer<typeof AccountSelectSchema>;
export type AccountInsert = typeof account.$inferInsert;

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

export const VerificationSelectSchema = createSelectSchema(verification);
export const VerificationInsertSchema = createInsertSchema(verification);
export const VerificationUpdateSchema = createUpdateSchema(verification);

export type Verification = z.infer<typeof VerificationSelectSchema>;
export type VerificationInsert = typeof verification.$inferInsert;

export const organization = sqliteTable("organization", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique(),
  logo: text("logo"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => sql`CURRENT_TIMESTAMP`
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => sql`CURRENT_TIMESTAMP`
  ),
  metadata: text("metadata"),
});

export const OrganizationSelectSchema = createSelectSchema(organization, {
  metadata: z.string().optional(),
  logo: z.string().nullish(),
});
const omittedOrganizationSelectSchema = OrganizationSelectSchema.omit({
  updatedAt: true,
});
export const OrganizationInsertSchema = createInsertSchema(organization, {
  id: z.string().optional(),
  slug: z.string(),
});
export const OrganizationUpdateSchema = createUpdateSchema(organization);

export type Organization = z.infer<typeof omittedOrganizationSelectSchema>;
export type OrganizationInsert = z.infer<typeof OrganizationInsertSchema>;

export const member = sqliteTable("member", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  role: text("role").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const MemberSelectSchema = createSelectSchema(member);
export const MemberInsertSchema = createInsertSchema(member);
export const MemberUpdateSchema = createUpdateSchema(member);

export type Member = z.infer<typeof MemberSelectSchema>;
export type MemberInsert = typeof member.$inferInsert;

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

export const invitation = sqliteTable("invitation", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id),
  email: text("email").notNull(),
  role: text("role"),
  status: text("status").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  inviterId: text("inviter_id")
    .notNull()
    .references(() => user.id),
});

export const InvitationSelectSchema = createSelectSchema(invitation);
export const InvitationInsertSchema = createInsertSchema(invitation);
export const InvitationUpdateSchema = createUpdateSchema(invitation);

export type Invitation = z.infer<typeof InvitationSelectSchema>;
export type InvitationInsert = typeof invitation.$inferInsert;
