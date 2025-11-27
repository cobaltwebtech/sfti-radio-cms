import {
	type MigrateDownArgs,
	type MigrateUpArgs,
	sql,
} from '@payloadcms/db-d1-sqlite';

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
	await db.run(sql`CREATE TABLE \`news\` (
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
	await db.run(sql`CREATE TABLE \`sports\` (
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
	await db.run(sql`CREATE TABLE \`weather\` (
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
	await db.run(sql`CREATE TABLE \`local_events\` (
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
	await db.run(sql`CREATE TABLE \`schools\` (
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
	await db.run(sql`ALTER TABLE \`blog\` ADD \`slug\` text DEFAULT '';`);
	await db.run(
		sql`UPDATE \`blog\` SET \`slug\` = 'blog-' || \`id\` WHERE \`slug\` = '';`,
	);
	await db.run(
		sql`CREATE UNIQUE INDEX \`blog_slug_idx\` ON \`blog\` (\`slug\`);`,
	);
	await db.run(
		sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`news_id\` integer REFERENCES news(id);`,
	);
	await db.run(
		sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`sports_id\` integer REFERENCES sports(id);`,
	);
	await db.run(
		sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`weather_id\` integer REFERENCES weather(id);`,
	);
	await db.run(
		sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`local_events_id\` integer REFERENCES local_events(id);`,
	);
	await db.run(
		sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`churches_id\` integer REFERENCES churches(id);`,
	);
	await db.run(
		sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`schools_id\` integer REFERENCES schools(id);`,
	);
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_rels_news_id_idx\` ON \`payload_locked_documents_rels\` (\`news_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_rels_sports_id_idx\` ON \`payload_locked_documents_rels\` (\`sports_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_rels_weather_id_idx\` ON \`payload_locked_documents_rels\` (\`weather_id\`);`,
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
}

export async function down({
	db,
	payload,
	req,
}: MigrateDownArgs): Promise<void> {
	await db.run(sql`DROP TABLE \`news\`;`);
	await db.run(sql`DROP TABLE \`sports\`;`);
	await db.run(sql`DROP TABLE \`weather\`;`);
	await db.run(sql`DROP TABLE \`local_events\`;`);
	await db.run(sql`DROP TABLE \`churches_service_times\`;`);
	await db.run(sql`DROP TABLE \`churches\`;`);
	await db.run(sql`DROP TABLE \`schools\`;`);
	await db.run(sql`PRAGMA foreign_keys=OFF;`);
	await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`blog_id\` integer,
  	\`market_areas_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`blog_id\`) REFERENCES \`blog\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`market_areas_id\`) REFERENCES \`market_areas\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
	await db.run(
		sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id", "blog_id", "market_areas_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id", "blog_id", "market_areas_id" FROM \`payload_locked_documents_rels\`;`,
	);
	await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`);
	await db.run(
		sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`,
	);
	await db.run(sql`PRAGMA foreign_keys=ON;`);
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
		sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_rels_blog_id_idx\` ON \`payload_locked_documents_rels\` (\`blog_id\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_rels_market_areas_id_idx\` ON \`payload_locked_documents_rels\` (\`market_areas_id\`);`,
	);
	await db.run(sql`DROP INDEX \`blog_slug_idx\`;`);
	await db.run(sql`ALTER TABLE \`blog\` DROP COLUMN \`slug\`;`);
}
