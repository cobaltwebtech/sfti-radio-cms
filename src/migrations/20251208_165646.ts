import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite';

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
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
	await db.run(
		sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`search_id\` integer REFERENCES search(id);`,
	);
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_rels_search_id_idx\` ON \`payload_locked_documents_rels\` (\`search_id\`);`,
	);
}

export async function down({
	db,
	payload,
	req,
}: MigrateDownArgs): Promise<void> {
	await db.run(sql`DROP TABLE \`search\`;`);
	await db.run(sql`DROP TABLE \`search_rels\`;`);
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
  	FOREIGN KEY (\`form_submissions_id\`) REFERENCES \`form_submissions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
	await db.run(
		sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "market_areas_id", "users_id", "media_id", "blog_id", "news_id", "sports_id", "local_events_id", "churches_id", "schools_id", "file_uploads_id", "forms_id", "form_submissions_id") SELECT "id", "order", "parent_id", "path", "market_areas_id", "users_id", "media_id", "blog_id", "news_id", "sports_id", "local_events_id", "churches_id", "schools_id", "file_uploads_id", "forms_id", "form_submissions_id" FROM \`payload_locked_documents_rels\`;`,
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
}
