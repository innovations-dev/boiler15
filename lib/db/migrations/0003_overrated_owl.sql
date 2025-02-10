CREATE TABLE `preferences` (
	`entity_id` text NOT NULL,
	`entity_type` text NOT NULL,
	`key` text NOT NULL,
	`value` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`entity_id`, `entity_type`, `key`)
);
--> statement-breakpoint
CREATE INDEX `preferences_entity_id_idx` ON `preferences` (`entity_id`);--> statement-breakpoint
CREATE INDEX `preferences_entity_type_idx` ON `preferences` (`entity_type`);