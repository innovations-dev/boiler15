CREATE TABLE `audit_log` (
	`id` text PRIMARY KEY NOT NULL,
	`action` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`actor_id` text NOT NULL,
	`metadata` text,
	`ip_address` text,
	`user_agent` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`actor_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `audit_log_action_idx` ON `audit_log` (`action`);--> statement-breakpoint
CREATE INDEX `audit_log_entity_type_idx` ON `audit_log` (`entity_type`);--> statement-breakpoint
CREATE INDEX `audit_log_entity_id_idx` ON `audit_log` (`entity_id`);--> statement-breakpoint
CREATE INDEX `audit_log_actor_id_idx` ON `audit_log` (`actor_id`);--> statement-breakpoint
CREATE INDEX `audit_log_created_at_idx` ON `audit_log` (`created_at`);