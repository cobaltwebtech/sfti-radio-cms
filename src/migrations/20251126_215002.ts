import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite';

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
	await db.run(
		sql`ALTER TABLE \`blog\` RENAME COLUMN "post_date" TO "publish_date";`,
	);
	await db.run(
		sql`ALTER TABLE \`_blog_v\` RENAME COLUMN "version_post_date" TO "version_publish_date";`,
	);
	await db.run(sql`PRAGMA foreign_keys=OFF;`);
	await db.run(sql`CREATE TABLE \`__new_news\` (
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
		sql`INSERT INTO \`__new_news\`("id", "market_area_id", "title", "slug", "description", "featured_image_id", "publish_date", "content", "status", "updated_at", "created_at", "_status") SELECT "id", "market_area_id", "title", "slug", "description", "featured_image_id", "publish_date", "content", "status", "updated_at", "created_at", "_status" FROM \`news\`;`,
	);
	await db.run(sql`DROP TABLE \`news\`;`);
	await db.run(sql`ALTER TABLE \`__new_news\` RENAME TO \`news\`;`);
	await db.run(sql`PRAGMA foreign_keys=ON;`);
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
	await db.run(sql`CREATE TABLE \`__new__news_v\` (
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
		sql`INSERT INTO \`__new__news_v\`("id", "parent_id", "version_market_area_id", "version_title", "version_slug", "version_description", "version_featured_image_id", "version_publish_date", "version_content", "version_status", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest", "autosave") SELECT "id", "parent_id", "version_market_area_id", "version_title", "version_slug", "version_description", "version_featured_image_id", "version_publish_date", "version_content", "version_status", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest", "autosave" FROM \`_news_v\`;`,
	);
	await db.run(sql`DROP TABLE \`_news_v\`;`);
	await db.run(sql`ALTER TABLE \`__new__news_v\` RENAME TO \`_news_v\`;`);
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
	await db.run(sql`CREATE TABLE \`__new_sports\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`market_area_id\` integer,
  	\`title\` text,
  	\`slug\` text,
  	\`description\` text,
  	\`featured_image_id\` integer,
  	\`sport_type\` text,
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
		sql`INSERT INTO \`__new_sports\`("id", "market_area_id", "title", "slug", "description", "featured_image_id", "sport_type", "publish_date", "content", "status", "updated_at", "created_at", "_status") SELECT "id", "market_area_id", "title", "slug", "description", "featured_image_id", "sport_type", "publish_date", "content", "status", "updated_at", "created_at", "_status" FROM \`sports\`;`,
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
		sql`CREATE INDEX \`sports_updated_at_idx\` ON \`sports\` (\`updated_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`sports_created_at_idx\` ON \`sports\` (\`created_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`sports__status_idx\` ON \`sports\` (\`_status\`);`,
	);
	await db.run(sql`CREATE TABLE \`__new__sports_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_market_area_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_description\` text,
  	\`version_featured_image_id\` integer,
  	\`version_sport_type\` text,
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
		sql`INSERT INTO \`__new__sports_v\`("id", "parent_id", "version_market_area_id", "version_title", "version_slug", "version_description", "version_featured_image_id", "version_sport_type", "version_publish_date", "version_content", "version_status", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest", "autosave") SELECT "id", "parent_id", "version_market_area_id", "version_title", "version_slug", "version_description", "version_featured_image_id", "version_sport_type", "version_publish_date", "version_content", "version_status", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest", "autosave" FROM \`_sports_v\`;`,
	);
	await db.run(sql`DROP TABLE \`_sports_v\`;`);
	await db.run(sql`ALTER TABLE \`__new__sports_v\` RENAME TO \`_sports_v\`;`);
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
	await db.run(sql`CREATE TABLE \`__new_weather\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`market_area_id\` integer,
  	\`title\` text,
  	\`slug\` text,
  	\`description\` text,
  	\`featured_image_id\` integer,
  	\`weather_type\` text,
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
		sql`INSERT INTO \`__new_weather\`("id", "market_area_id", "title", "slug", "description", "featured_image_id", "weather_type", "publish_date", "content", "status", "updated_at", "created_at", "_status") SELECT "id", "market_area_id", "title", "slug", "description", "featured_image_id", "weather_type", "publish_date", "content", "status", "updated_at", "created_at", "_status" FROM \`weather\`;`,
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
		sql`CREATE INDEX \`weather_updated_at_idx\` ON \`weather\` (\`updated_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`weather_created_at_idx\` ON \`weather\` (\`created_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`weather__status_idx\` ON \`weather\` (\`_status\`);`,
	);
	await db.run(sql`CREATE TABLE \`__new__weather_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_market_area_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_description\` text,
  	\`version_featured_image_id\` integer,
  	\`version_weather_type\` text,
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
  	FOREIGN KEY (\`version_featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
	await db.run(
		sql`INSERT INTO \`__new__weather_v\`("id", "parent_id", "version_market_area_id", "version_title", "version_slug", "version_description", "version_featured_image_id", "version_weather_type", "version_publish_date", "version_content", "version_status", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest", "autosave") SELECT "id", "parent_id", "version_market_area_id", "version_title", "version_slug", "version_description", "version_featured_image_id", "version_weather_type", "version_publish_date", "version_content", "version_status", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest", "autosave" FROM \`_weather_v\`;`,
	);
	await db.run(sql`DROP TABLE \`_weather_v\`;`);
	await db.run(sql`ALTER TABLE \`__new__weather_v\` RENAME TO \`_weather_v\`;`);
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
}

export async function down({
	db,
	payload,
	req,
}: MigrateDownArgs): Promise<void> {
	await db.run(
		sql`ALTER TABLE \`blog\` RENAME COLUMN "publish_date" TO "post_date";`,
	);
	await db.run(
		sql`ALTER TABLE \`_blog_v\` RENAME COLUMN "version_publish_date" TO "version_post_date";`,
	);
	await db.run(
		sql`ALTER TABLE \`news\` ADD \`author_id\` integer REFERENCES users(id);`,
	);
	await db.run(
		sql`CREATE INDEX \`news_author_idx\` ON \`news\` (\`author_id\`);`,
	);
	await db.run(
		sql`ALTER TABLE \`_news_v\` ADD \`version_author_id\` integer REFERENCES users(id);`,
	);
	await db.run(
		sql`CREATE INDEX \`_news_v_version_version_author_idx\` ON \`_news_v\` (\`version_author_id\`);`,
	);
	await db.run(
		sql`ALTER TABLE \`sports\` ADD \`author_id\` integer REFERENCES users(id);`,
	);
	await db.run(
		sql`CREATE INDEX \`sports_author_idx\` ON \`sports\` (\`author_id\`);`,
	);
	await db.run(
		sql`ALTER TABLE \`_sports_v\` ADD \`version_author_id\` integer REFERENCES users(id);`,
	);
	await db.run(
		sql`CREATE INDEX \`_sports_v_version_version_author_idx\` ON \`_sports_v\` (\`version_author_id\`);`,
	);
	await db.run(
		sql`ALTER TABLE \`weather\` ADD \`author_id\` integer REFERENCES users(id);`,
	);
	await db.run(
		sql`CREATE INDEX \`weather_author_idx\` ON \`weather\` (\`author_id\`);`,
	);
	await db.run(
		sql`ALTER TABLE \`_weather_v\` ADD \`version_author_id\` integer REFERENCES users(id);`,
	);
	await db.run(
		sql`CREATE INDEX \`_weather_v_version_version_author_idx\` ON \`_weather_v\` (\`version_author_id\`);`,
	);
}
