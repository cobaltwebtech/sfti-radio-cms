import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite';

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
	await db.run(sql`CREATE TABLE \`_blog_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_description\` text,
  	\`version_author_id\` integer,
  	\`version_post_date\` text,
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
	await db.run(sql`CREATE TABLE \`_news_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_market_area_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_description\` text,
  	\`version_featured_image_id\` integer,
  	\`version_author_id\` integer,
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
  	FOREIGN KEY (\`version_featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_author_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
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
		sql`CREATE INDEX \`_news_v_version_version_author_idx\` ON \`_news_v\` (\`version_author_id\`);`,
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
	await db.run(sql`CREATE TABLE \`_sports_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_market_area_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_description\` text,
  	\`version_featured_image_id\` integer,
  	\`version_sport_type\` text,
  	\`version_author_id\` integer,
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
  	FOREIGN KEY (\`version_featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_author_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
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
		sql`CREATE INDEX \`_sports_v_version_version_author_idx\` ON \`_sports_v\` (\`version_author_id\`);`,
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
	await db.run(sql`CREATE TABLE \`_weather_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_market_area_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_description\` text,
  	\`version_featured_image_id\` integer,
  	\`version_weather_type\` text,
  	\`version_author_id\` integer,
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
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`weather\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_market_area_id\`) REFERENCES \`market_areas\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_author_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
	await db.run(
		sql`CREATE INDEX \`_weather_v_parent_idx\` ON \`_weather_v\` (\`parent_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_weather_v_version_version_market_area_idx\` ON \`_weather_v\` (\`version_market_area_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_weather_v_version_version_slug_idx\` ON \`_weather_v\` (\`version_slug\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_weather_v_version_version_featured_image_idx\` ON \`_weather_v\` (\`version_featured_image_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_weather_v_version_version_author_idx\` ON \`_weather_v\` (\`version_author_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_weather_v_version_version_updated_at_idx\` ON \`_weather_v\` (\`version_updated_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_weather_v_version_version_created_at_idx\` ON \`_weather_v\` (\`version_created_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_weather_v_version_version__status_idx\` ON \`_weather_v\` (\`version__status\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_weather_v_created_at_idx\` ON \`_weather_v\` (\`created_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_weather_v_updated_at_idx\` ON \`_weather_v\` (\`updated_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_weather_v_latest_idx\` ON \`_weather_v\` (\`latest\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`_weather_v_autosave_idx\` ON \`_weather_v\` (\`autosave\`);`,
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
  	\`version_description\` text,
  	\`version_featured_image_id\` integer,
  	\`version_denomination\` text,
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
	await db.run(sql`CREATE TABLE \`_schools_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_market_area_id\` integer,
  	\`version_name\` text,
  	\`version_slug\` text,
  	\`version_description\` text,
  	\`version_featured_image_id\` integer,
  	\`version_school_type\` text,
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
	await db.run(sql`PRAGMA foreign_keys=OFF;`);
	await db.run(sql`CREATE TABLE \`__new_blog\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`slug\` text,
  	\`description\` text,
  	\`author_id\` integer,
  	\`post_date\` text,
  	\`content\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`author_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
	await db.run(
		sql`INSERT INTO \`__new_blog\`("id", "title", "slug", "description", "author_id", "post_date", "content", "updated_at", "created_at", "_status") SELECT "id", "title", "slug", "description", "author_id", "post_date", "content", "updated_at", "created_at", "_status" FROM \`blog\`;`,
	);
	await db.run(sql`DROP TABLE \`blog\`;`);
	await db.run(sql`ALTER TABLE \`__new_blog\` RENAME TO \`blog\`;`);
	await db.run(sql`PRAGMA foreign_keys=ON;`);
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
	await db.run(sql`CREATE TABLE \`__new_news\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`market_area_id\` integer,
  	\`title\` text,
  	\`slug\` text,
  	\`description\` text,
  	\`featured_image_id\` integer,
  	\`author_id\` integer,
  	\`publish_date\` text,
  	\`content\` text,
  	\`status\` text DEFAULT 'draft',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`market_area_id\`) REFERENCES \`market_areas\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`author_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
	await db.run(
		sql`INSERT INTO \`__new_news\`("id", "market_area_id", "title", "slug", "description", "featured_image_id", "author_id", "publish_date", "content", "status", "updated_at", "created_at", "_status") SELECT "id", "market_area_id", "title", "slug", "description", "featured_image_id", "author_id", "publish_date", "content", "status", "updated_at", "created_at", "_status" FROM \`news\`;`,
	);
	await db.run(sql`DROP TABLE \`news\`;`);
	await db.run(sql`ALTER TABLE \`__new_news\` RENAME TO \`news\`;`);
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
		sql`CREATE INDEX \`news_author_idx\` ON \`news\` (\`author_id\`);`,
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
	await db.run(sql`CREATE TABLE \`__new_sports\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`market_area_id\` integer,
  	\`title\` text,
  	\`slug\` text,
  	\`description\` text,
  	\`featured_image_id\` integer,
  	\`sport_type\` text,
  	\`author_id\` integer,
  	\`publish_date\` text,
  	\`content\` text,
  	\`status\` text DEFAULT 'draft',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`market_area_id\`) REFERENCES \`market_areas\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`author_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
	await db.run(
		sql`INSERT INTO \`__new_sports\`("id", "market_area_id", "title", "slug", "description", "featured_image_id", "sport_type", "author_id", "publish_date", "content", "status", "updated_at", "created_at", "_status") SELECT "id", "market_area_id", "title", "slug", "description", "featured_image_id", "sport_type", "author_id", "publish_date", "content", "status", "updated_at", "created_at", "_status" FROM \`sports\`;`,
	);
	await db.run(sql`DROP TABLE \`sports\`;`);
	await db.run(sql`ALTER TABLE \`__new_sports\` RENAME TO \`sports\`;`);
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
		sql`CREATE INDEX \`sports_author_idx\` ON \`sports\` (\`author_id\`);`,
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
	await db.run(sql`CREATE TABLE \`__new_weather\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`market_area_id\` integer,
  	\`title\` text,
  	\`slug\` text,
  	\`description\` text,
  	\`featured_image_id\` integer,
  	\`weather_type\` text,
  	\`author_id\` integer,
  	\`publish_date\` text,
  	\`content\` text,
  	\`status\` text DEFAULT 'draft',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`market_area_id\`) REFERENCES \`market_areas\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`author_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
	await db.run(
		sql`INSERT INTO \`__new_weather\`("id", "market_area_id", "title", "slug", "description", "featured_image_id", "weather_type", "author_id", "publish_date", "content", "status", "updated_at", "created_at", "_status") SELECT "id", "market_area_id", "title", "slug", "description", "featured_image_id", "weather_type", "author_id", "publish_date", "content", "status", "updated_at", "created_at", "_status" FROM \`weather\`;`,
	);
	await db.run(sql`DROP TABLE \`weather\`;`);
	await db.run(sql`ALTER TABLE \`__new_weather\` RENAME TO \`weather\`;`);
	await db.run(
		sql`CREATE INDEX \`weather_market_area_idx\` ON \`weather\` (\`market_area_id\`);`,
	);
	await db.run(
		sql`CREATE UNIQUE INDEX \`weather_slug_idx\` ON \`weather\` (\`slug\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`weather_featured_image_idx\` ON \`weather\` (\`featured_image_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`weather_author_idx\` ON \`weather\` (\`author_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`weather_updated_at_idx\` ON \`weather\` (\`updated_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`weather_created_at_idx\` ON \`weather\` (\`created_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`weather__status_idx\` ON \`weather\` (\`_status\`);`,
	);
	await db.run(sql`CREATE TABLE \`__new_local_events\` (
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
		sql`INSERT INTO \`__new_local_events\`("id", "market_area_id", "title", "slug", "description", "featured_image_id", "event_date", "event_end_date", "location_venue_name", "location_address", "event_type", "content", "status", "updated_at", "created_at", "_status") SELECT "id", "market_area_id", "title", "slug", "description", "featured_image_id", "event_date", "event_end_date", "location_venue_name", "location_address", "event_type", "content", "status", "updated_at", "created_at", "_status" FROM \`local_events\`;`,
	);
	await db.run(sql`DROP TABLE \`local_events\`;`);
	await db.run(
		sql`ALTER TABLE \`__new_local_events\` RENAME TO \`local_events\`;`,
	);
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
	await db.run(sql`CREATE TABLE \`__new_churches\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`market_area_id\` integer,
  	\`name\` text,
  	\`slug\` text,
  	\`description\` text,
  	\`featured_image_id\` integer,
  	\`denomination\` text,
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
		sql`INSERT INTO \`__new_churches\`("id", "market_area_id", "name", "slug", "description", "featured_image_id", "denomination", "contact_phone", "contact_email", "contact_website", "location_address", "content", "status", "updated_at", "created_at", "_status") SELECT "id", "market_area_id", "name", "slug", "description", "featured_image_id", "denomination", "contact_phone", "contact_email", "contact_website", "location_address", "content", "status", "updated_at", "created_at", "_status" FROM \`churches\`;`,
	);
	await db.run(sql`DROP TABLE \`churches\`;`);
	await db.run(sql`ALTER TABLE \`__new_churches\` RENAME TO \`churches\`;`);
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
	await db.run(sql`CREATE TABLE \`__new_schools\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`market_area_id\` integer,
  	\`name\` text,
  	\`slug\` text,
  	\`description\` text,
  	\`featured_image_id\` integer,
  	\`school_type\` text,
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
		sql`INSERT INTO \`__new_schools\`("id", "market_area_id", "name", "slug", "description", "featured_image_id", "school_type", "district", "contact_phone", "contact_email", "contact_website", "location_address", "grades", "content", "status", "updated_at", "created_at", "_status") SELECT "id", "market_area_id", "name", "slug", "description", "featured_image_id", "school_type", "district", "contact_phone", "contact_email", "contact_website", "location_address", "grades", "content", "status", "updated_at", "created_at", "_status" FROM \`schools\`;`,
	);
	await db.run(sql`DROP TABLE \`schools\`;`);
	await db.run(sql`ALTER TABLE \`__new_schools\` RENAME TO \`schools\`;`);
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
	await db.run(
		sql`ALTER TABLE \`users\` ADD \`role\` text DEFAULT 'staff' NOT NULL;`,
	);
	await db.run(sql`ALTER TABLE \`users\` ADD \`name\` text;`);
}

export async function down({
	db,
	payload,
	req,
}: MigrateDownArgs): Promise<void> {
	await db.run(sql`DROP TABLE \`_blog_v\`;`);
	await db.run(sql`DROP TABLE \`_news_v\`;`);
	await db.run(sql`DROP TABLE \`_sports_v\`;`);
	await db.run(sql`DROP TABLE \`_weather_v\`;`);
	await db.run(sql`DROP TABLE \`_local_events_v\`;`);
	await db.run(sql`DROP TABLE \`_churches_v_version_service_times\`;`);
	await db.run(sql`DROP TABLE \`_churches_v\`;`);
	await db.run(sql`DROP TABLE \`_schools_v\`;`);
	await db.run(sql`PRAGMA foreign_keys=OFF;`);
	await db.run(sql`CREATE TABLE \`__new_blog\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`author_id\` integer NOT NULL,
  	\`post_date\` text NOT NULL,
  	\`content\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`author_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
	await db.run(
		sql`INSERT INTO \`__new_blog\`("id", "title", "slug", "description", "author_id", "post_date", "content", "updated_at", "created_at") SELECT "id", "title", "slug", "description", "author_id", "post_date", "content", "updated_at", "created_at" FROM \`blog\`;`,
	);
	await db.run(sql`DROP TABLE \`blog\`;`);
	await db.run(sql`ALTER TABLE \`__new_blog\` RENAME TO \`blog\`;`);
	await db.run(sql`PRAGMA foreign_keys=ON;`);
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
	await db.run(sql`CREATE TABLE \`__new_news\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`market_area_id\` integer NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`featured_image_id\` integer,
  	\`author_id\` integer NOT NULL,
  	\`publish_date\` text NOT NULL,
  	\`content\` text NOT NULL,
  	\`status\` text DEFAULT 'draft',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`market_area_id\`) REFERENCES \`market_areas\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`author_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
	await db.run(
		sql`INSERT INTO \`__new_news\`("id", "market_area_id", "title", "slug", "description", "featured_image_id", "author_id", "publish_date", "content", "status", "updated_at", "created_at") SELECT "id", "market_area_id", "title", "slug", "description", "featured_image_id", "author_id", "publish_date", "content", "status", "updated_at", "created_at" FROM \`news\`;`,
	);
	await db.run(sql`DROP TABLE \`news\`;`);
	await db.run(sql`ALTER TABLE \`__new_news\` RENAME TO \`news\`;`);
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
		sql`CREATE INDEX \`news_author_idx\` ON \`news\` (\`author_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`news_updated_at_idx\` ON \`news\` (\`updated_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`news_created_at_idx\` ON \`news\` (\`created_at\`);`,
	);
	await db.run(sql`CREATE TABLE \`__new_sports\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`market_area_id\` integer NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`featured_image_id\` integer,
  	\`sport_type\` text,
  	\`author_id\` integer NOT NULL,
  	\`publish_date\` text NOT NULL,
  	\`content\` text NOT NULL,
  	\`status\` text DEFAULT 'draft',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`market_area_id\`) REFERENCES \`market_areas\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`author_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
	await db.run(
		sql`INSERT INTO \`__new_sports\`("id", "market_area_id", "title", "slug", "description", "featured_image_id", "sport_type", "author_id", "publish_date", "content", "status", "updated_at", "created_at") SELECT "id", "market_area_id", "title", "slug", "description", "featured_image_id", "sport_type", "author_id", "publish_date", "content", "status", "updated_at", "created_at" FROM \`sports\`;`,
	);
	await db.run(sql`DROP TABLE \`sports\`;`);
	await db.run(sql`ALTER TABLE \`__new_sports\` RENAME TO \`sports\`;`);
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
		sql`CREATE INDEX \`sports_author_idx\` ON \`sports\` (\`author_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`sports_updated_at_idx\` ON \`sports\` (\`updated_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`sports_created_at_idx\` ON \`sports\` (\`created_at\`);`,
	);
	await db.run(sql`CREATE TABLE \`__new_weather\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`market_area_id\` integer NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`featured_image_id\` integer,
  	\`weather_type\` text,
  	\`author_id\` integer NOT NULL,
  	\`publish_date\` text NOT NULL,
  	\`content\` text NOT NULL,
  	\`status\` text DEFAULT 'draft',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`market_area_id\`) REFERENCES \`market_areas\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`author_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
	await db.run(
		sql`INSERT INTO \`__new_weather\`("id", "market_area_id", "title", "slug", "description", "featured_image_id", "weather_type", "author_id", "publish_date", "content", "status", "updated_at", "created_at") SELECT "id", "market_area_id", "title", "slug", "description", "featured_image_id", "weather_type", "author_id", "publish_date", "content", "status", "updated_at", "created_at" FROM \`weather\`;`,
	);
	await db.run(sql`DROP TABLE \`weather\`;`);
	await db.run(sql`ALTER TABLE \`__new_weather\` RENAME TO \`weather\`;`);
	await db.run(
		sql`CREATE INDEX \`weather_market_area_idx\` ON \`weather\` (\`market_area_id\`);`,
	);
	await db.run(
		sql`CREATE UNIQUE INDEX \`weather_slug_idx\` ON \`weather\` (\`slug\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`weather_featured_image_idx\` ON \`weather\` (\`featured_image_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`weather_author_idx\` ON \`weather\` (\`author_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`weather_updated_at_idx\` ON \`weather\` (\`updated_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`weather_created_at_idx\` ON \`weather\` (\`created_at\`);`,
	);
	await db.run(sql`CREATE TABLE \`__new_local_events\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`market_area_id\` integer NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`featured_image_id\` integer,
  	\`event_date\` text NOT NULL,
  	\`event_end_date\` text,
  	\`location_venue_name\` text,
  	\`location_address\` text,
  	\`event_type\` text,
  	\`content\` text NOT NULL,
  	\`status\` text DEFAULT 'draft',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`market_area_id\`) REFERENCES \`market_areas\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
	await db.run(
		sql`INSERT INTO \`__new_local_events\`("id", "market_area_id", "title", "slug", "description", "featured_image_id", "event_date", "event_end_date", "location_venue_name", "location_address", "event_type", "content", "status", "updated_at", "created_at") SELECT "id", "market_area_id", "title", "slug", "description", "featured_image_id", "event_date", "event_end_date", "location_venue_name", "location_address", "event_type", "content", "status", "updated_at", "created_at" FROM \`local_events\`;`,
	);
	await db.run(sql`DROP TABLE \`local_events\`;`);
	await db.run(
		sql`ALTER TABLE \`__new_local_events\` RENAME TO \`local_events\`;`,
	);
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
	await db.run(sql`CREATE TABLE \`__new_churches\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`market_area_id\` integer NOT NULL,
  	\`name\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`description\` text,
  	\`featured_image_id\` integer,
  	\`denomination\` text,
  	\`contact_phone\` text,
  	\`contact_email\` text,
  	\`contact_website\` text,
  	\`location_address\` text,
  	\`content\` text,
  	\`status\` text DEFAULT 'draft',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`market_area_id\`) REFERENCES \`market_areas\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
	await db.run(
		sql`INSERT INTO \`__new_churches\`("id", "market_area_id", "name", "slug", "description", "featured_image_id", "denomination", "contact_phone", "contact_email", "contact_website", "location_address", "content", "status", "updated_at", "created_at") SELECT "id", "market_area_id", "name", "slug", "description", "featured_image_id", "denomination", "contact_phone", "contact_email", "contact_website", "location_address", "content", "status", "updated_at", "created_at" FROM \`churches\`;`,
	);
	await db.run(sql`DROP TABLE \`churches\`;`);
	await db.run(sql`ALTER TABLE \`__new_churches\` RENAME TO \`churches\`;`);
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
	await db.run(sql`CREATE TABLE \`__new_schools\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`market_area_id\` integer NOT NULL,
  	\`name\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`description\` text,
  	\`featured_image_id\` integer,
  	\`school_type\` text NOT NULL,
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
  	FOREIGN KEY (\`market_area_id\`) REFERENCES \`market_areas\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
	await db.run(
		sql`INSERT INTO \`__new_schools\`("id", "market_area_id", "name", "slug", "description", "featured_image_id", "school_type", "district", "contact_phone", "contact_email", "contact_website", "location_address", "grades", "content", "status", "updated_at", "created_at") SELECT "id", "market_area_id", "name", "slug", "description", "featured_image_id", "school_type", "district", "contact_phone", "contact_email", "contact_website", "location_address", "grades", "content", "status", "updated_at", "created_at" FROM \`schools\`;`,
	);
	await db.run(sql`DROP TABLE \`schools\`;`);
	await db.run(sql`ALTER TABLE \`__new_schools\` RENAME TO \`schools\`;`);
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
	await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`role\`;`);
	await db.run(sql`ALTER TABLE \`users\` DROP COLUMN \`name\`;`);
}
