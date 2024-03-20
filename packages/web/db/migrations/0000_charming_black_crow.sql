CREATE TABLE `posts` (
	`id` text(191) PRIMARY KEY NOT NULL,
	`title` text(191) NOT NULL,
	`content` text,
	`published` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`authorId` text(191) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text(191) PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer,
	`stripe_customer_id` text(191),
	`stripe_subscription_id` text(191),
	`stripe_price_id` text(191),
	`stripe_current_period_end` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_stripe_customer_id_key` ON `users` (`stripe_customer_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_stripe_subscription_id_key` ON `users` (`stripe_subscription_id`);