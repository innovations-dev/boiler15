PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_organization` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text,
	`logo` text,
	`test` integer,
	`created_at` integer,
	`updated_at` integer,
	`metadata` text
);
--> statement-breakpoint
INSERT INTO `__new_organization`("id", "name", "slug", "logo", "test", "created_at", "updated_at", "metadata") SELECT "id", "name", "slug", "logo", "test", "created_at", "updated_at", "metadata" FROM `organization`;--> statement-breakpoint
DROP TABLE `organization`;--> statement-breakpoint
ALTER TABLE `__new_organization` RENAME TO `organization`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `organization_slug_unique` ON `organization` (`slug`);