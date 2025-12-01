CREATE TABLE `system_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`key` text NOT NULL UNIQUE,
	`value` text NOT NULL,
	`description` text,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);