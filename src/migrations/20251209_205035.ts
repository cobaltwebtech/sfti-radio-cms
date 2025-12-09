import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite';

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
	await db.run(sql`CREATE TABLE \`market_areas_surrounding_areas\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`market_areas\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
	await db.run(
		sql`CREATE INDEX \`market_areas_surrounding_areas_order_idx\` ON \`market_areas_surrounding_areas\` (\`_order\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`market_areas_surrounding_areas_parent_id_idx\` ON \`market_areas_surrounding_areas\` (\`_parent_id\`);`,
	);
	await db.run(sql`CREATE TABLE \`market_areas_stream_ids\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`stream_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`market_areas\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
	await db.run(
		sql`CREATE INDEX \`market_areas_stream_ids_order_idx\` ON \`market_areas_stream_ids\` (\`_order\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`market_areas_stream_ids_parent_id_idx\` ON \`market_areas_stream_ids\` (\`_parent_id\`);`,
	);
	await db.run(sql`CREATE TABLE \`market_areas_custom_stream_url\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`url\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`market_areas\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
	await db.run(
		sql`CREATE INDEX \`market_areas_custom_stream_url_order_idx\` ON \`market_areas_custom_stream_url\` (\`_order\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`market_areas_custom_stream_url_parent_id_idx\` ON \`market_areas_custom_stream_url\` (\`_parent_id\`);`,
	);
	await db.run(sql`CREATE TABLE \`market_areas\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`description\` text,
  	\`active\` integer DEFAULT true,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `);
	await db.run(
		sql`CREATE UNIQUE INDEX \`market_areas_slug_idx\` ON \`market_areas\` (\`slug\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`market_areas_updated_at_idx\` ON \`market_areas\` (\`updated_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`market_areas_created_at_idx\` ON \`market_areas\` (\`created_at\`);`,
	);
	await db.run(sql`CREATE TABLE \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
	await db.run(
		sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`,
	);
	await db.run(sql`CREATE TABLE \`users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`role\` text DEFAULT 'staff' NOT NULL,
  	\`name\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `);
	await db.run(
		sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`,
	);
	await db.run(
		sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`,
	);
	await db.run(sql`CREATE TABLE \`media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`alt\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric
  );
  `);
	await db.run(
		sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`,
	);
	await db.run(
		sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`,
	);
	await db.run(sql`CREATE TABLE \`blog\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`slug\` text,
  	\`description\` text,
  	\`author_id\` integer,
  	\`publish_date\` text,
  	\`content\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`author_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
	await db.run(
		sql`CREATE UNIQUE INDEX \`blog_slug_idx\` ON \`blog\` (\`slug\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`blog_author_idx\` ON \`blog\` (\`author_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`blog_updated_at_idx\` ON \`blog\` (\`updated_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`blog_created_at_idx\` ON \`blog\` (\`created_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`blog__status_idx\` ON \`blog\` (\`_status\`);`,
	);
	await db.run(sql`CREATE TABLE \`_blog_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_description\` text,
  	\`version_author_id\` integer,
  	\`version_publish_date\` text,
  	\`version_content\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`blog\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_author_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
	await db.run(
		sql`CREATE INDEX \`_blog_v_parent_idx\` ON \`_blog_v\` (\`parent_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_blog_v_version_version_slug_idx\` ON \`_blog_v\` (\`version_slug\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_blog_v_version_version_author_idx\` ON \`_blog_v\` (\`version_author_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_blog_v_version_version_updated_at_idx\` ON \`_blog_v\` (\`version_updated_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_blog_v_version_version_created_at_idx\` ON \`_blog_v\` (\`version_created_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_blog_v_version_version__status_idx\` ON \`_blog_v\` (\`version__status\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_blog_v_created_at_idx\` ON \`_blog_v\` (\`created_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_blog_v_updated_at_idx\` ON \`_blog_v\` (\`updated_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_blog_v_latest_idx\` ON \`_blog_v\` (\`latest\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_blog_v_autosave_idx\` ON \`_blog_v\` (\`autosave\`);`,
	);
	await db.run(sql`CREATE TABLE \`news\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`market_area_id\` integer,
  	\`title\` text,
  	\`slug\` text,
  	\`description\` text,
  	\`featured_image_id\` integer,
  	\`publish_date\` text,
  	\`content\` text,
  	\`status\` text DEFAULT 'draft',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`market_area_id\`) REFERENCES \`market_areas\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
	await db.run(
		sql`CREATE INDEX \`news_market_area_idx\` ON \`news\` (\`market_area_id\`);`,
	);
	await db.run(
		sql`CREATE UNIQUE INDEX \`news_slug_idx\` ON \`news\` (\`slug\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`news_featured_image_idx\` ON \`news\` (\`featured_image_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`news_updated_at_idx\` ON \`news\` (\`updated_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`news_created_at_idx\` ON \`news\` (\`created_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`news__status_idx\` ON \`news\` (\`_status\`);`,
	);
	await db.run(sql`CREATE TABLE \`_news_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_market_area_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_description\` text,
  	\`version_featured_image_id\` integer,
  	\`version_publish_date\` text,
  	\`version_content\` text,
  	\`version_status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`news\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_market_area_id\`) REFERENCES \`market_areas\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
	await db.run(
		sql`CREATE INDEX \`_news_v_parent_idx\` ON \`_news_v\` (\`parent_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_news_v_version_version_market_area_idx\` ON \`_news_v\` (\`version_market_area_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_news_v_version_version_slug_idx\` ON \`_news_v\` (\`version_slug\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_news_v_version_version_featured_image_idx\` ON \`_news_v\` (\`version_featured_image_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_news_v_version_version_updated_at_idx\` ON \`_news_v\` (\`version_updated_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_news_v_version_version_created_at_idx\` ON \`_news_v\` (\`version_created_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_news_v_version_version__status_idx\` ON \`_news_v\` (\`version__status\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_news_v_created_at_idx\` ON \`_news_v\` (\`created_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_news_v_updated_at_idx\` ON \`_news_v\` (\`updated_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_news_v_latest_idx\` ON \`_news_v\` (\`latest\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_news_v_autosave_idx\` ON \`_news_v\` (\`autosave\`);`,
	);
	await db.run(sql`CREATE TABLE \`sports\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`market_area_id\` integer,
  	\`title\` text,
  	\`slug\` text,
  	\`description\` text,
  	\`featured_image_id\` integer,
  	\`publish_date\` text,
  	\`content\` text,
  	\`status\` text DEFAULT 'draft',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`market_area_id\`) REFERENCES \`market_areas\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
	await db.run(
		sql`CREATE INDEX \`sports_market_area_idx\` ON \`sports\` (\`market_area_id\`);`,
	);
	await db.run(
		sql`CREATE UNIQUE INDEX \`sports_slug_idx\` ON \`sports\` (\`slug\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`sports_featured_image_idx\` ON \`sports\` (\`featured_image_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`sports_updated_at_idx\` ON \`sports\` (\`updated_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`sports_created_at_idx\` ON \`sports\` (\`created_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`sports__status_idx\` ON \`sports\` (\`_status\`);`,
	);
	await db.run(sql`CREATE TABLE \`_sports_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_market_area_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_description\` text,
  	\`version_featured_image_id\` integer,
  	\`version_publish_date\` text,
  	\`version_content\` text,
  	\`version_status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`sports\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_market_area_id\`) REFERENCES \`market_areas\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
	await db.run(
		sql`CREATE INDEX \`_sports_v_parent_idx\` ON \`_sports_v\` (\`parent_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_sports_v_version_version_market_area_idx\` ON \`_sports_v\` (\`version_market_area_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_sports_v_version_version_slug_idx\` ON \`_sports_v\` (\`version_slug\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_sports_v_version_version_featured_image_idx\` ON \`_sports_v\` (\`version_featured_image_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_sports_v_version_version_updated_at_idx\` ON \`_sports_v\` (\`version_updated_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_sports_v_version_version_created_at_idx\` ON \`_sports_v\` (\`version_created_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_sports_v_version_version__status_idx\` ON \`_sports_v\` (\`version__status\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_sports_v_created_at_idx\` ON \`_sports_v\` (\`created_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_sports_v_updated_at_idx\` ON \`_sports_v\` (\`updated_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_sports_v_latest_idx\` ON \`_sports_v\` (\`latest\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_sports_v_autosave_idx\` ON \`_sports_v\` (\`autosave\`);`,
	);
	await db.run(sql`CREATE TABLE \`local_events\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`market_area_id\` integer,
  	\`title\` text,
  	\`slug\` text,
  	\`description\` text,
  	\`featured_image_id\` integer,
  	\`event_date\` text,
  	\`event_end_date\` text,
  	\`location_venue_name\` text,
  	\`location_address\` text,
  	\`event_type\` text,
  	\`content\` text,
  	\`status\` text DEFAULT 'draft',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`market_area_id\`) REFERENCES \`market_areas\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
	await db.run(
		sql`CREATE INDEX \`local_events_market_area_idx\` ON \`local_events\` (\`market_area_id\`);`,
	);
	await db.run(
		sql`CREATE UNIQUE INDEX \`local_events_slug_idx\` ON \`local_events\` (\`slug\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`local_events_featured_image_idx\` ON \`local_events\` (\`featured_image_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`local_events_updated_at_idx\` ON \`local_events\` (\`updated_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`local_events_created_at_idx\` ON \`local_events\` (\`created_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`local_events__status_idx\` ON \`local_events\` (\`_status\`);`,
	);
	await db.run(sql`CREATE TABLE \`_local_events_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_market_area_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_description\` text,
  	\`version_featured_image_id\` integer,
  	\`version_event_date\` text,
  	\`version_event_end_date\` text,
  	\`version_location_venue_name\` text,
  	\`version_location_address\` text,
  	\`version_event_type\` text,
  	\`version_content\` text,
  	\`version_status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`local_events\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_market_area_id\`) REFERENCES \`market_areas\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
	await db.run(
		sql`CREATE INDEX \`_local_events_v_parent_idx\` ON \`_local_events_v\` (\`parent_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_local_events_v_version_version_market_area_idx\` ON \`_local_events_v\` (\`version_market_area_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_local_events_v_version_version_slug_idx\` ON \`_local_events_v\` (\`version_slug\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_local_events_v_version_version_featured_image_idx\` ON \`_local_events_v\` (\`version_featured_image_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_local_events_v_version_version_updated_at_idx\` ON \`_local_events_v\` (\`version_updated_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_local_events_v_version_version_created_at_idx\` ON \`_local_events_v\` (\`version_created_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_local_events_v_version_version__status_idx\` ON \`_local_events_v\` (\`version__status\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_local_events_v_created_at_idx\` ON \`_local_events_v\` (\`created_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_local_events_v_updated_at_idx\` ON \`_local_events_v\` (\`updated_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_local_events_v_latest_idx\` ON \`_local_events_v\` (\`latest\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_local_events_v_autosave_idx\` ON \`_local_events_v\` (\`autosave\`);`,
	);
	await db.run(sql`CREATE TABLE \`churches_service_times\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`day\` text,
  	\`time\` text,
  	\`service_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`churches\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
	await db.run(
		sql`CREATE INDEX \`churches_service_times_order_idx\` ON \`churches_service_times\` (\`_order\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`churches_service_times_parent_id_idx\` ON \`churches_service_times\` (\`_parent_id\`);`,
	);
	await db.run(sql`CREATE TABLE \`churches\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`market_area_id\` integer,
  	\`name\` text,
  	\`slug\` text,
  	\`denomination\` text,
  	\`featured_image_id\` integer,
  	\`contact_phone\` text,
  	\`contact_email\` text,
  	\`contact_website\` text,
  	\`location_address\` text,
  	\`content\` text,
  	\`status\` text DEFAULT 'draft',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`market_area_id\`) REFERENCES \`market_areas\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
	await db.run(
		sql`CREATE INDEX \`churches_market_area_idx\` ON \`churches\` (\`market_area_id\`);`,
	);
	await db.run(
		sql`CREATE UNIQUE INDEX \`churches_slug_idx\` ON \`churches\` (\`slug\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`churches_featured_image_idx\` ON \`churches\` (\`featured_image_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`churches_updated_at_idx\` ON \`churches\` (\`updated_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`churches_created_at_idx\` ON \`churches\` (\`created_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`churches__status_idx\` ON \`churches\` (\`_status\`);`,
	);
	await db.run(sql`CREATE TABLE \`_churches_v_version_service_times\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`day\` text,
  	\`time\` text,
  	\`service_name\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_churches_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
	await db.run(
		sql`CREATE INDEX \`_churches_v_version_service_times_order_idx\` ON \`_churches_v_version_service_times\` (\`_order\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_churches_v_version_service_times_parent_id_idx\` ON \`_churches_v_version_service_times\` (\`_parent_id\`);`,
	);
	await db.run(sql`CREATE TABLE \`_churches_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_market_area_id\` integer,
  	\`version_name\` text,
  	\`version_slug\` text,
  	\`version_denomination\` text,
  	\`version_featured_image_id\` integer,
  	\`version_contact_phone\` text,
  	\`version_contact_email\` text,
  	\`version_contact_website\` text,
  	\`version_location_address\` text,
  	\`version_content\` text,
  	\`version_status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`churches\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_market_area_id\`) REFERENCES \`market_areas\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
	await db.run(
		sql`CREATE INDEX \`_churches_v_parent_idx\` ON \`_churches_v\` (\`parent_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_churches_v_version_version_market_area_idx\` ON \`_churches_v\` (\`version_market_area_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_churches_v_version_version_slug_idx\` ON \`_churches_v\` (\`version_slug\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_churches_v_version_version_featured_image_idx\` ON \`_churches_v\` (\`version_featured_image_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_churches_v_version_version_updated_at_idx\` ON \`_churches_v\` (\`version_updated_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_churches_v_version_version_created_at_idx\` ON \`_churches_v\` (\`version_created_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_churches_v_version_version__status_idx\` ON \`_churches_v\` (\`version__status\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_churches_v_created_at_idx\` ON \`_churches_v\` (\`created_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_churches_v_updated_at_idx\` ON \`_churches_v\` (\`updated_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_churches_v_latest_idx\` ON \`_churches_v\` (\`latest\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_churches_v_autosave_idx\` ON \`_churches_v\` (\`autosave\`);`,
	);
	await db.run(sql`CREATE TABLE \`schools\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`market_area_id\` integer,
  	\`name\` text,
  	\`slug\` text,
  	\`description\` text,
  	\`featured_image_id\` integer,
  	\`district\` text,
  	\`contact_phone\` text,
  	\`contact_email\` text,
  	\`contact_website\` text,
  	\`location_address\` text,
  	\`grades\` text,
  	\`content\` text,
  	\`status\` text DEFAULT 'draft',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`market_area_id\`) REFERENCES \`market_areas\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
	await db.run(
		sql`CREATE INDEX \`schools_market_area_idx\` ON \`schools\` (\`market_area_id\`);`,
	);
	await db.run(
		sql`CREATE UNIQUE INDEX \`schools_slug_idx\` ON \`schools\` (\`slug\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`schools_featured_image_idx\` ON \`schools\` (\`featured_image_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`schools_updated_at_idx\` ON \`schools\` (\`updated_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`schools_created_at_idx\` ON \`schools\` (\`created_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`schools__status_idx\` ON \`schools\` (\`_status\`);`,
	);
	await db.run(sql`CREATE TABLE \`_schools_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_market_area_id\` integer,
  	\`version_name\` text,
  	\`version_slug\` text,
  	\`version_description\` text,
  	\`version_featured_image_id\` integer,
  	\`version_district\` text,
  	\`version_contact_phone\` text,
  	\`version_contact_email\` text,
  	\`version_contact_website\` text,
  	\`version_location_address\` text,
  	\`version_grades\` text,
  	\`version_content\` text,
  	\`version_status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`schools\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_market_area_id\`) REFERENCES \`market_areas\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
	await db.run(
		sql`CREATE INDEX \`_schools_v_parent_idx\` ON \`_schools_v\` (\`parent_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_schools_v_version_version_market_area_idx\` ON \`_schools_v\` (\`version_market_area_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_schools_v_version_version_slug_idx\` ON \`_schools_v\` (\`version_slug\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_schools_v_version_version_featured_image_idx\` ON \`_schools_v\` (\`version_featured_image_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_schools_v_version_version_updated_at_idx\` ON \`_schools_v\` (\`version_updated_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_schools_v_version_version_created_at_idx\` ON \`_schools_v\` (\`version_created_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_schools_v_version_version__status_idx\` ON \`_schools_v\` (\`version__status\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_schools_v_created_at_idx\` ON \`_schools_v\` (\`created_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_schools_v_updated_at_idx\` ON \`_schools_v\` (\`updated_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_schools_v_latest_idx\` ON \`_schools_v\` (\`latest\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_schools_v_autosave_idx\` ON \`_schools_v\` (\`autosave\`);`,
	);
	await db.run(sql`CREATE TABLE \`file_uploads\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`form_submission_id\` integer,
  	\`submission_id\` text,
  	\`pending_submission_id\` text,
  	\`field_name\` text,
  	\`submitted_at\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric,
  	FOREIGN KEY (\`form_submission_id\`) REFERENCES \`form_submissions\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
	await db.run(
		sql`CREATE INDEX \`file_uploads_form_submission_idx\` ON \`file_uploads\` (\`form_submission_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`file_uploads_updated_at_idx\` ON \`file_uploads\` (\`updated_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`file_uploads_created_at_idx\` ON \`file_uploads\` (\`created_at\`);`,
	);
	await db.run(
		sql`CREATE UNIQUE INDEX \`file_uploads_filename_idx\` ON \`file_uploads\` (\`filename\`);`,
	);
	await db.run(sql`CREATE TABLE \`forms_blocks_checkbox\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`label\` text,
  	\`width\` numeric,
  	\`required\` integer,
  	\`default_value\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
	await db.run(
		sql`CREATE INDEX \`forms_blocks_checkbox_order_idx\` ON \`forms_blocks_checkbox\` (\`_order\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`forms_blocks_checkbox_parent_id_idx\` ON \`forms_blocks_checkbox\` (\`_parent_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`forms_blocks_checkbox_path_idx\` ON \`forms_blocks_checkbox\` (\`_path\`);`,
	);
	await db.run(sql`CREATE TABLE \`forms_blocks_country\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`label\` text,
  	\`width\` numeric,
  	\`required\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
	await db.run(
		sql`CREATE INDEX \`forms_blocks_country_order_idx\` ON \`forms_blocks_country\` (\`_order\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`forms_blocks_country_parent_id_idx\` ON \`forms_blocks_country\` (\`_parent_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`forms_blocks_country_path_idx\` ON \`forms_blocks_country\` (\`_path\`);`,
	);
	await db.run(sql`CREATE TABLE \`forms_blocks_email\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`label\` text,
  	\`width\` numeric,
  	\`required\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
	await db.run(
		sql`CREATE INDEX \`forms_blocks_email_order_idx\` ON \`forms_blocks_email\` (\`_order\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`forms_blocks_email_parent_id_idx\` ON \`forms_blocks_email\` (\`_parent_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`forms_blocks_email_path_idx\` ON \`forms_blocks_email\` (\`_path\`);`,
	);
	await db.run(sql`CREATE TABLE \`forms_blocks_message\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`message\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
	await db.run(
		sql`CREATE INDEX \`forms_blocks_message_order_idx\` ON \`forms_blocks_message\` (\`_order\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`forms_blocks_message_parent_id_idx\` ON \`forms_blocks_message\` (\`_parent_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`forms_blocks_message_path_idx\` ON \`forms_blocks_message\` (\`_path\`);`,
	);
	await db.run(sql`CREATE TABLE \`forms_blocks_number\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`label\` text,
  	\`width\` numeric,
  	\`default_value\` numeric,
  	\`required\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
	await db.run(
		sql`CREATE INDEX \`forms_blocks_number_order_idx\` ON \`forms_blocks_number\` (\`_order\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`forms_blocks_number_parent_id_idx\` ON \`forms_blocks_number\` (\`_parent_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`forms_blocks_number_path_idx\` ON \`forms_blocks_number\` (\`_path\`);`,
	);
	await db.run(sql`CREATE TABLE \`forms_blocks_select_options\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`value\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms_blocks_select\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
	await db.run(
		sql`CREATE INDEX \`forms_blocks_select_options_order_idx\` ON \`forms_blocks_select_options\` (\`_order\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`forms_blocks_select_options_parent_id_idx\` ON \`forms_blocks_select_options\` (\`_parent_id\`);`,
	);
	await db.run(sql`CREATE TABLE \`forms_blocks_select\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`label\` text,
  	\`width\` numeric,
  	\`default_value\` text,
  	\`placeholder\` text,
  	\`required\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
	await db.run(
		sql`CREATE INDEX \`forms_blocks_select_order_idx\` ON \`forms_blocks_select\` (\`_order\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`forms_blocks_select_parent_id_idx\` ON \`forms_blocks_select\` (\`_parent_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`forms_blocks_select_path_idx\` ON \`forms_blocks_select\` (\`_path\`);`,
	);
	await db.run(sql`CREATE TABLE \`forms_blocks_state\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`label\` text,
  	\`width\` numeric,
  	\`required\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
	await db.run(
		sql`CREATE INDEX \`forms_blocks_state_order_idx\` ON \`forms_blocks_state\` (\`_order\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`forms_blocks_state_parent_id_idx\` ON \`forms_blocks_state\` (\`_parent_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`forms_blocks_state_path_idx\` ON \`forms_blocks_state\` (\`_path\`);`,
	);
	await db.run(sql`CREATE TABLE \`forms_blocks_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`label\` text,
  	\`width\` numeric,
  	\`default_value\` text,
  	\`required\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
	await db.run(
		sql`CREATE INDEX \`forms_blocks_text_order_idx\` ON \`forms_blocks_text\` (\`_order\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`forms_blocks_text_parent_id_idx\` ON \`forms_blocks_text\` (\`_parent_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`forms_blocks_text_path_idx\` ON \`forms_blocks_text\` (\`_path\`);`,
	);
	await db.run(sql`CREATE TABLE \`forms_blocks_textarea\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`label\` text,
  	\`width\` numeric,
  	\`default_value\` text,
  	\`required\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
	await db.run(
		sql`CREATE INDEX \`forms_blocks_textarea_order_idx\` ON \`forms_blocks_textarea\` (\`_order\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`forms_blocks_textarea_parent_id_idx\` ON \`forms_blocks_textarea\` (\`_parent_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`forms_blocks_textarea_path_idx\` ON \`forms_blocks_textarea\` (\`_path\`);`,
	);
	await db.run(sql`CREATE TABLE \`forms_blocks_upload\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`label\` text,
  	\`width\` numeric,
  	\`required\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
	await db.run(
		sql`CREATE INDEX \`forms_blocks_upload_order_idx\` ON \`forms_blocks_upload\` (\`_order\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`forms_blocks_upload_parent_id_idx\` ON \`forms_blocks_upload\` (\`_parent_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`forms_blocks_upload_path_idx\` ON \`forms_blocks_upload\` (\`_path\`);`,
	);
	await db.run(sql`CREATE TABLE \`forms_emails\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`email_to\` text,
  	\`cc\` text,
  	\`bcc\` text,
  	\`reply_to\` text,
  	\`email_from\` text,
  	\`subject\` text DEFAULT 'You''ve received a new message.' NOT NULL,
  	\`message\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
	await db.run(
		sql`CREATE INDEX \`forms_emails_order_idx\` ON \`forms_emails\` (\`_order\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`forms_emails_parent_id_idx\` ON \`forms_emails\` (\`_parent_id\`);`,
	);
	await db.run(sql`CREATE TABLE \`forms\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`submit_button_label\` text,
  	\`confirmation_type\` text DEFAULT 'message',
  	\`confirmation_message\` text,
  	\`redirect_url\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `);
	await db.run(
		sql`CREATE INDEX \`forms_updated_at_idx\` ON \`forms\` (\`updated_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`forms_created_at_idx\` ON \`forms\` (\`created_at\`);`,
	);
	await db.run(sql`CREATE TABLE \`form_submissions_submission_data\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`field\` text NOT NULL,
  	\`value\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`form_submissions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
	await db.run(
		sql`CREATE INDEX \`form_submissions_submission_data_order_idx\` ON \`form_submissions_submission_data\` (\`_order\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`form_submissions_submission_data_parent_id_idx\` ON \`form_submissions_submission_data\` (\`_parent_id\`);`,
	);
	await db.run(sql`CREATE TABLE \`form_submissions\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`form_id\` integer NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`form_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
	await db.run(
		sql`CREATE INDEX \`form_submissions_form_idx\` ON \`form_submissions\` (\`form_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`form_submissions_updated_at_idx\` ON \`form_submissions\` (\`updated_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`form_submissions_created_at_idx\` ON \`form_submissions\` (\`created_at\`);`,
	);
	await db.run(sql`CREATE TABLE \`search\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`priority\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `);
	await db.run(
		sql`CREATE INDEX \`search_updated_at_idx\` ON \`search\` (\`updated_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`search_created_at_idx\` ON \`search\` (\`created_at\`);`,
	);
	await db.run(sql`CREATE TABLE \`search_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`blog_id\` integer,
  	\`churches_id\` integer,
  	\`local_events_id\` integer,
  	\`market_areas_id\` integer,
  	\`news_id\` integer,
  	\`schools_id\` integer,
  	\`sports_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`search\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`blog_id\`) REFERENCES \`blog\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`churches_id\`) REFERENCES \`churches\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`local_events_id\`) REFERENCES \`local_events\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`market_areas_id\`) REFERENCES \`market_areas\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`news_id\`) REFERENCES \`news\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`schools_id\`) REFERENCES \`schools\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`sports_id\`) REFERENCES \`sports\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
	await db.run(
		sql`CREATE INDEX \`search_rels_order_idx\` ON \`search_rels\` (\`order\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`search_rels_parent_idx\` ON \`search_rels\` (\`parent_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`search_rels_path_idx\` ON \`search_rels\` (\`path\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`search_rels_blog_id_idx\` ON \`search_rels\` (\`blog_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`search_rels_churches_id_idx\` ON \`search_rels\` (\`churches_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`search_rels_local_events_id_idx\` ON \`search_rels\` (\`local_events_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`search_rels_market_areas_id_idx\` ON \`search_rels\` (\`market_areas_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`search_rels_news_id_idx\` ON \`search_rels\` (\`news_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`search_rels_schools_id_idx\` ON \`search_rels\` (\`schools_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`search_rels_sports_id_idx\` ON \`search_rels\` (\`sports_id\`);`,
	);
	await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `);
	await db.run(
		sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`,
	);
	await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `);
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`,
	);
	await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`market_areas_id\` integer,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`blog_id\` integer,
  	\`news_id\` integer,
  	\`sports_id\` integer,
  	\`local_events_id\` integer,
  	\`churches_id\` integer,
  	\`schools_id\` integer,
  	\`file_uploads_id\` integer,
  	\`forms_id\` integer,
  	\`form_submissions_id\` integer,
  	\`search_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`market_areas_id\`) REFERENCES \`market_areas\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`blog_id\`) REFERENCES \`blog\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`news_id\`) REFERENCES \`news\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`sports_id\`) REFERENCES \`sports\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`local_events_id\`) REFERENCES \`local_events\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`churches_id\`) REFERENCES \`churches\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`schools_id\`) REFERENCES \`schools\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`file_uploads_id\`) REFERENCES \`file_uploads\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`forms_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`form_submissions_id\`) REFERENCES \`form_submissions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`search_id\`) REFERENCES \`search\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_rels_market_areas_id_idx\` ON \`payload_locked_documents_rels\` (\`market_areas_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_rels_blog_id_idx\` ON \`payload_locked_documents_rels\` (\`blog_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_rels_news_id_idx\` ON \`payload_locked_documents_rels\` (\`news_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_rels_sports_id_idx\` ON \`payload_locked_documents_rels\` (\`sports_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_rels_local_events_id_idx\` ON \`payload_locked_documents_rels\` (\`local_events_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_rels_churches_id_idx\` ON \`payload_locked_documents_rels\` (\`churches_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_rels_schools_id_idx\` ON \`payload_locked_documents_rels\` (\`schools_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_rels_file_uploads_id_idx\` ON \`payload_locked_documents_rels\` (\`file_uploads_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_rels_forms_id_idx\` ON \`payload_locked_documents_rels\` (\`forms_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_rels_form_submissions_id_idx\` ON \`payload_locked_documents_rels\` (\`form_submissions_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_rels_search_id_idx\` ON \`payload_locked_documents_rels\` (\`search_id\`);`,
	);
	await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `);
	await db.run(
		sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`,
	);
	await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
	await db.run(
		sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`,
	);
	await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `);
	await db.run(
		sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`,
	);
}

export async function down({
	db,
	payload,
	req,
}: MigrateDownArgs): Promise<void> {
	await db.run(sql`DROP TABLE \`market_areas_surrounding_areas\`;`);
	await db.run(sql`DROP TABLE \`market_areas_stream_ids\`;`);
	await db.run(sql`DROP TABLE \`market_areas_custom_stream_url\`;`);
	await db.run(sql`DROP TABLE \`market_areas\`;`);
	await db.run(sql`DROP TABLE \`users_sessions\`;`);
	await db.run(sql`DROP TABLE \`users\`;`);
	await db.run(sql`DROP TABLE \`media\`;`);
	await db.run(sql`DROP TABLE \`blog\`;`);
	await db.run(sql`DROP TABLE \`_blog_v\`;`);
	await db.run(sql`DROP TABLE \`news\`;`);
	await db.run(sql`DROP TABLE \`_news_v\`;`);
	await db.run(sql`DROP TABLE \`sports\`;`);
	await db.run(sql`DROP TABLE \`_sports_v\`;`);
	await db.run(sql`DROP TABLE \`local_events\`;`);
	await db.run(sql`DROP TABLE \`_local_events_v\`;`);
	await db.run(sql`DROP TABLE \`churches_service_times\`;`);
	await db.run(sql`DROP TABLE \`churches\`;`);
	await db.run(sql`DROP TABLE \`_churches_v_version_service_times\`;`);
	await db.run(sql`DROP TABLE \`_churches_v\`;`);
	await db.run(sql`DROP TABLE \`schools\`;`);
	await db.run(sql`DROP TABLE \`_schools_v\`;`);
	await db.run(sql`DROP TABLE \`file_uploads\`;`);
	await db.run(sql`DROP TABLE \`forms_blocks_checkbox\`;`);
	await db.run(sql`DROP TABLE \`forms_blocks_country\`;`);
	await db.run(sql`DROP TABLE \`forms_blocks_email\`;`);
	await db.run(sql`DROP TABLE \`forms_blocks_message\`;`);
	await db.run(sql`DROP TABLE \`forms_blocks_number\`;`);
	await db.run(sql`DROP TABLE \`forms_blocks_select_options\`;`);
	await db.run(sql`DROP TABLE \`forms_blocks_select\`;`);
	await db.run(sql`DROP TABLE \`forms_blocks_state\`;`);
	await db.run(sql`DROP TABLE \`forms_blocks_text\`;`);
	await db.run(sql`DROP TABLE \`forms_blocks_textarea\`;`);
	await db.run(sql`DROP TABLE \`forms_blocks_upload\`;`);
	await db.run(sql`DROP TABLE \`forms_emails\`;`);
	await db.run(sql`DROP TABLE \`forms\`;`);
	await db.run(sql`DROP TABLE \`form_submissions_submission_data\`;`);
	await db.run(sql`DROP TABLE \`form_submissions\`;`);
	await db.run(sql`DROP TABLE \`search\`;`);
	await db.run(sql`DROP TABLE \`search_rels\`;`);
	await db.run(sql`DROP TABLE \`payload_kv\`;`);
	await db.run(sql`DROP TABLE \`payload_locked_documents\`;`);
	await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`);
	await db.run(sql`DROP TABLE \`payload_preferences\`;`);
	await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`);
	await db.run(sql`DROP TABLE \`payload_migrations\`;`);
}
