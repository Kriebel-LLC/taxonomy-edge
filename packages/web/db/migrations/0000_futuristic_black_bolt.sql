CREATE TABLE `posts` (
	`id` varchar(191) PRIMARY KEY NOT NULL,
	`title` varchar(191) NOT NULL,
	`content` json,
	`published` tinyint NOT NULL DEFAULT 0,
	`created_at` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updated_at` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`authorId` varchar(191) NOT NULL);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(191) PRIMARY KEY NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updated_at` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`stripe_customer_id` varchar(191),
	`stripe_subscription_id` varchar(191),
	`stripe_price_id` varchar(191),
	`stripe_current_period_end` datetime(3));
--> statement-breakpoint
CREATE UNIQUE INDEX `users_stripe_customer_id_key` ON `users` (`stripe_customer_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_stripe_subscription_id_key` ON `users` (`stripe_subscription_id`);