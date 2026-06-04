import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite';

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
	await db.run(sql`CREATE TABLE \`daily_prayer_daily_prayers\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`day\` numeric NOT NULL,
  	\`prayer\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`daily_prayer\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
	await db.run(
		sql`CREATE INDEX \`daily_prayer_daily_prayers_order_idx\` ON \`daily_prayer_daily_prayers\` (\`_order\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`daily_prayer_daily_prayers_parent_id_idx\` ON \`daily_prayer_daily_prayers\` (\`_parent_id\`);`,
	);
	await db.run(sql`CREATE TABLE \`daily_prayer\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`month\` text NOT NULL,
  	\`year\` numeric NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `);
	await db.run(
		sql`CREATE INDEX \`daily_prayer_updated_at_idx\` ON \`daily_prayer\` (\`updated_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`daily_prayer_created_at_idx\` ON \`daily_prayer\` (\`created_at\`);`,
	);
	await db.run(sql`CREATE TABLE \`forms_blocks_upload_mime_types\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`mime_type\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms_blocks_upload\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
	await db.run(
		sql`CREATE INDEX \`forms_blocks_upload_mime_types_order_idx\` ON \`forms_blocks_upload_mime_types\` (\`_order\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`forms_blocks_upload_mime_types_parent_id_idx\` ON \`forms_blocks_upload_mime_types\` (\`_parent_id\`);`,
	);
	await db.run(
		sql`ALTER TABLE \`forms_blocks_upload\` ADD \`upload_collection\` text NOT NULL;`,
	);
	await db.run(
		sql`ALTER TABLE \`forms_blocks_upload\` ADD \`max_file_size\` numeric;`,
	);
	await db.run(
		sql`ALTER TABLE \`forms_blocks_upload\` ADD \`multiple\` integer;`,
	);
	await db.run(
		sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`daily_prayer_id\` integer REFERENCES daily_prayer(id);`,
	);
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_rels_daily_prayer_id_idx\` ON \`payload_locked_documents_rels\` (\`daily_prayer_id\`);`,
	);
}

export async function down({
	db,
	payload,
	req,
}: MigrateDownArgs): Promise<void> {
	await db.run(sql`DROP TABLE \`daily_prayer_daily_prayers\`;`);
	await db.run(sql`DROP TABLE \`daily_prayer\`;`);
	await db.run(sql`DROP TABLE \`forms_blocks_upload_mime_types\`;`);
	await db.run(sql`PRAGMA foreign_keys=OFF;`);
	await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
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
		sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "market_areas_id", "users_id", "media_id", "blog_id", "news_id", "sports_id", "local_events_id", "churches_id", "schools_id", "file_uploads_id", "forms_id", "form_submissions_id", "search_id") SELECT "id", "order", "parent_id", "path", "market_areas_id", "users_id", "media_id", "blog_id", "news_id", "sports_id", "local_events_id", "churches_id", "schools_id", "file_uploads_id", "forms_id", "form_submissions_id", "search_id" FROM \`payload_locked_documents_rels\`;`,
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
	await db.run(
		sql`ALTER TABLE \`forms_blocks_upload\` DROP COLUMN \`upload_collection\`;`,
	);
	await db.run(
		sql`ALTER TABLE \`forms_blocks_upload\` DROP COLUMN \`max_file_size\`;`,
	);
	await db.run(
		sql`ALTER TABLE \`forms_blocks_upload\` DROP COLUMN \`multiple\`;`,
	);
}
