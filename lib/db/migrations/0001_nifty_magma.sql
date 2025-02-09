CREATE INDEX `account_user_id_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE INDEX `account_account_id_idx` ON `account` (`account_id`);--> statement-breakpoint
CREATE INDEX `account_provider_id_idx` ON `account` (`provider_id`);--> statement-breakpoint
CREATE INDEX `audit_log_actor_id_idx` ON `audit_log` (`actor_id`);--> statement-breakpoint
CREATE INDEX `invitation_inviter_id_idx` ON `invitation` (`inviter_id`);--> statement-breakpoint
CREATE INDEX `member_user_id_idx` ON `member` (`user_id`);--> statement-breakpoint
CREATE INDEX `member_organization_id_idx` ON `member` (`organization_id`);--> statement-breakpoint
CREATE INDEX `session_user_id_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE INDEX `session_active_organization_id_idx` ON `session` (`active_organization_id`);--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);