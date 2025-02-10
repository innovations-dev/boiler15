import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";

/**
 * @fileoverview Database schema definitions using Drizzle ORM with SQLite
 * @module lib/db/schema
 *
 * This module defines the database schema for the application using Drizzle ORM.
 * It includes tables for users, sessions, accounts, verifications, organizations,
 * members, and invitations. Each table has corresponding Zod schemas for type validation.
 */

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

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  auditLogs: many(auditLog),
  invitations: many(invitation, { relationName: "inviter" }),
  accounts: many(account),
  members: many(member),
  organizations: many(usersToOrganizations),
}));

export const usersToOrganizations = sqliteTable("users_to_organizations", {
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id),
});

export const usersToOrganizationsRelations = relations(
  usersToOrganizations,
  ({ one }) => ({
    organization: one(organization, {
      fields: [usersToOrganizations.organizationId],
      references: [organization.id],
    }),
    user: one(user, {
      fields: [usersToOrganizations.userId],
      references: [user.id],
    }),
  })
);

export const userSelectSchema = createSelectSchema(user, {
  image: z.string().optional().nullish(),
  banned: z.boolean().optional().nullish(),
  banReason: z.string().optional().nullish(),
  banExpires: z.coerce.date().optional().nullish(),
});
export const userInsertSchema = createInsertSchema(user);
export const userUpdateSchema = createUpdateSchema(user);

export type User = z.infer<typeof userSelectSchema>;
export type UserInsert = typeof user.$inferInsert;

export const session = sqliteTable(
  "session",
  {
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
  },
  (table) => ({
    userIdIdx: index("session_user_id_idx").on(table.userId),
    activeOrganizationIdIdx: index("session_active_organization_id_idx").on(
      table.activeOrganizationId
    ),
  })
);

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
  activeOrganization: one(organization, {
    fields: [session.activeOrganizationId],
    references: [organization.id],
  }),
}));

export const sessionSelectSchemaCoerced = createSelectSchema(session, {
  expiresAt: z.coerce.string(),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string(),
  token: z.string().transform((val) => val.replace(/['"]/g, "")),
});

export const sessionSelectSchema = createSelectSchema(session);
export const sessionInsertSchema = createInsertSchema(session);
export const sessionUpdateSchema = createUpdateSchema(session);

export type SessionCoerced = z.infer<typeof sessionSelectSchemaCoerced>;
export type Session = z.infer<typeof sessionSelectSchema>;
export type SessionInsert = typeof session.$inferInsert;

export const account = sqliteTable(
  "account",
  {
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
  },
  (table) => ({
    userIdIdx: index("account_user_id_idx").on(table.userId),
    accountIdIdx: index("account_account_id_idx").on(table.accountId),
    providerIdIdx: index("account_provider_id_idx").on(table.providerId),
  })
);

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const accountSelectSchema = createSelectSchema(account);
export const accountInsertSchema = createInsertSchema(account);
export const accountUpdateSchema = createUpdateSchema(account);

export type Account = z.infer<typeof accountSelectSchema>;
export type AccountInsert = typeof account.$inferInsert;

export const verification = sqliteTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }),
    updatedAt: integer("updated_at", { mode: "timestamp" }),
  },
  (table) => ({
    identifierIdx: index("verification_identifier_idx").on(table.identifier),
  })
);
export const VerificationSelectSchema = createSelectSchema(verification);
export const VerificationInsertSchema = createInsertSchema(verification);
export const VerificationUpdateSchema = createUpdateSchema(verification);

export type Verification = z.infer<typeof VerificationSelectSchema>;
export type VerificationInsert = typeof verification.$inferInsert;

// export const verificationRelations = relations(verification, ({ one }) => ({
//   // Optional one-to-one with user since not all verifications are tied to existing users
//   // The identifier field is used to link verifications to users/emails
// }));

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

export const organizationRelations = relations(organization, ({ many }) => ({
  members: many(member),
  invitations: many(invitation),
  auditLogs: many(auditLog),
  activeSessions: many(session, { relationName: "activeOrganization" }),
  users: many(usersToOrganizations),
}));

export const organizationSelectSchema = createSelectSchema(organization, {
  metadata: z.string().optional().nullish(),
  logo: z.string().optional().nullish(),
});
export const omittedOrganizationSelectSchema = organizationSelectSchema.omit({
  updatedAt: true,
});
export const organizationInsertSchema = createInsertSchema(organization, {
  id: z.string().optional(),
  slug: z.string(),
});
export const organizationUpdateSchema = createUpdateSchema(organization);

export type Organization = z.infer<typeof omittedOrganizationSelectSchema>;
export type OrganizationInsert = z.infer<typeof organizationInsertSchema>;

export const member = sqliteTable(
  "member",
  {
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
  },
  (table) => ({
    userIdIdx: index("member_user_id_idx").on(table.userId),
    organizationIdIdx: index("member_organization_id_idx").on(
      table.organizationId
    ),
  })
);

export const memberRelations = relations(member, ({ one }) => ({
  organization: one(organization, {
    fields: [member.organizationId],
    references: [organization.id],
  }),
  user: one(user, {
    fields: [member.userId],
    references: [user.id],
  }),
}));

export const memberSelectSchema = createSelectSchema(member);
export const memberInsertSchema = createInsertSchema(member);
export const memberUpdateSchema = createUpdateSchema(member);

export type Member = z.infer<typeof memberSelectSchema>;
export type MemberInsert = typeof member.$inferInsert;

export const invitation = sqliteTable(
  "invitation",
  {
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
  },
  (table) => ({
    inviterIdIdx: index("invitation_inviter_id_idx").on(table.inviterId),
  })
);

export const invitationRelations = relations(invitation, ({ one }) => ({
  inviter: one(user, {
    fields: [invitation.inviterId],
    references: [user.id],
  }),
  organization: one(organization, {
    fields: [invitation.organizationId],
    references: [organization.id],
  }),
}));

export const invitationSelectSchema = createSelectSchema(invitation);
export const invitationInsertSchema = createInsertSchema(invitation);
export const invitationUpdateSchema = createUpdateSchema(invitation);

export type Invitation = z.infer<typeof invitationSelectSchema>;
export type InvitationInsert = typeof invitation.$inferInsert;

export const auditLog = sqliteTable(
  "audit_log",
  {
    id: text("id").primaryKey(),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id").notNull(),
    actorId: text("actor_id")
      .notNull()
      .references(() => user.id),
    metadata: text("metadata"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    actorIdIdx: index("audit_log_actor_id_idx").on(table.actorId),
  })
);

export const auditLogRelations = relations(auditLog, ({ one }) => ({
  actor: one(user, {
    fields: [auditLog.actorId],
    references: [user.id],
  }),
  organization: one(organization, {
    fields: [auditLog.entityId],
    references: [organization.id],
    relationName: "organizationAuditLogs",
  }),
}));
export const auditLogSelectSchema = createSelectSchema(auditLog, {
  createdAt: z.coerce.date(),
});

export const auditLogInsertSchema = createInsertSchema(auditLog, {
  metadata: z.string().optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  createdAt: z.date().optional(),
});

export type AuditLog = z.infer<typeof auditLogSelectSchema>;
export type AuditLogInsert = z.infer<typeof auditLogInsertSchema>;

export const preferences = sqliteTable(
  "preferences",
  {
    entityId: text("entity_id").notNull(),
    entityType: text("entity_type").notNull(),
    key: text("key").notNull(),
    value: text("value").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => sql`CURRENT_TIMESTAMP`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    entityIdIdx: index("preferences_entity_id_idx").on(table.entityId),
    entityTypeIdx: index("preferences_entity_type_idx").on(table.entityType),
    pk: primaryKey({ columns: [table.entityId, table.entityType, table.key] }),
  })
);

export const preferencesRelations = relations(preferences, ({ one }) => ({
  user: one(user, {
    fields: [preferences.entityId],
    references: [user.id],
    relationName: "userPreferences",
  }),
  organization: one(organization, {
    fields: [preferences.entityId],
    references: [organization.id],
    relationName: "organizationPreferences",
  }),
}));

export const preferencesSelectSchema = createSelectSchema(preferences);
export const preferencesInsertSchema = createInsertSchema(preferences);
export const preferencesUpdateSchema = createUpdateSchema(preferences);

export type Preferences = z.infer<typeof preferencesSelectSchema>;
export type PreferencesInsert = typeof preferences.$inferInsert;
