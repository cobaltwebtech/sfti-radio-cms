import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite';

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
	await db.run(sql`PRAGMA foreign_keys=OFF;`);
	await db.run(sql`CREATE TABLE \`__new_weather\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`market_area_id\` integer,
  	\`title\` text,
  	\`slug\` text,
  	\`description\` text,
  	\`content\` text,
  	\`status\` text DEFAULT 'draft',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`market_area_id\`) REFERENCES \`market_areas\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
	await db.run(
		sql`INSERT INTO \`__new_weather\`("id", "market_area_id", "title", "slug", "description", "content", "status", "updated_at", "created_at", "_status") SELECT "id", "market_area_id", "title", "slug", "description", "content", "status", "updated_at", "created_at", "_status" FROM \`weather\`;`,
	);
	await db.run(sql`DROP TABLE \`weather\`;`);
	await db.run(sql`ALTER TABLE \`__new_weather\` RENAME TO \`weather\`;`);
	await db.run(sql`PRAGMA foreign_keys=ON;`);
	await db.run(
		sql`CREATE INDEX \`weather_market_area_idx\` ON \`weather\` (\`market_area_id\`);`,
	);
	await db.run(
		sql`CREATE UNIQUE INDEX \`weather_slug_idx\` ON \`weather\` (\`slug\`);`,
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
  	FOREIGN KEY (\`version_market_area_id\`) REFERENCES \`market_areas\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
	await db.run(
		sql`INSERT INTO \`__new__weather_v\`("id", "parent_id", "version_market_area_id", "version_title", "version_slug", "version_description", "version_content", "version_status", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest", "autosave") SELECT "id", "parent_id", "version_market_area_id", "version_title", "version_slug", "version_description", "version_content", "version_status", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest", "autosave" FROM \`_weather_v\`;`,
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
	await db.run(sql`ALTER TABLE \`sports\` DROP COLUMN \`sport_type\`;`);
	await db.run(
		sql`ALTER TABLE \`_sports_v\` DROP COLUMN \`version_sport_type\`;`,
	);
	await db.run(sql`ALTER TABLE \`churches\` DROP COLUMN \`description\`;`);
	await db.run(
		sql`ALTER TABLE \`_churches_v\` DROP COLUMN \`version_description\`;`,
	);
	await db.run(sql`ALTER TABLE \`schools\` DROP COLUMN \`school_type\`;`);
	await db.run(
		sql`ALTER TABLE \`_schools_v\` DROP COLUMN \`version_school_type\`;`,
	);
}

export async function down({
	db,
	payload,
	req,
}: MigrateDownArgs): Promise<void> {
	await db.run(sql`ALTER TABLE \`sports\` ADD \`sport_type\` text;`);
	await db.run(sql`ALTER TABLE \`_sports_v\` ADD \`version_sport_type\` text;`);
	await db.run(
		sql`ALTER TABLE \`weather\` ADD \`featured_image_id\` integer REFERENCES media(id);`,
	);
	await db.run(sql`ALTER TABLE \`weather\` ADD \`weather_type\` text;`);
	await db.run(sql`ALTER TABLE \`weather\` ADD \`publish_date\` text;`);
	await db.run(
		sql`CREATE INDEX \`weather_featured_image_idx\` ON \`weather\` (\`featured_image_id\`);`,
	);
	await db.run(
		sql`ALTER TABLE \`_weather_v\` ADD \`version_featured_image_id\` integer REFERENCES media(id);`,
	);
	await db.run(
		sql`ALTER TABLE \`_weather_v\` ADD \`version_weather_type\` text;`,
	);
	await db.run(
		sql`ALTER TABLE \`_weather_v\` ADD \`version_publish_date\` text;`,
	);
	await db.run(
		sql`CREATE INDEX \`_weather_v_version_version_featured_image_idx\` ON \`_weather_v\` (\`version_featured_image_id\`);`,
	);
	await db.run(sql`ALTER TABLE \`churches\` ADD \`description\` text;`);
	await db.run(
		sql`ALTER TABLE \`_churches_v\` ADD \`version_description\` text;`,
	);
	await db.run(sql`ALTER TABLE \`schools\` ADD \`school_type\` text;`);
	await db.run(
		sql`ALTER TABLE \`_schools_v\` ADD \`version_school_type\` text;`,
	);
}
