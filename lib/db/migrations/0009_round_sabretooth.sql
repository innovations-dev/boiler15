CREATE INDEX `user_id_idx` ON `member` (`user_id`);--> statement-breakpoint
CREATE INDEX `organization_id_idx` ON `member` (`organization_id`);--> statement-breakpoint
CREATE INDEX `slug_idx` ON `organization` (`slug`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `organization` (`name`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE INDEX `active_organization_id_idx` ON `session` (`active_organization_id`);