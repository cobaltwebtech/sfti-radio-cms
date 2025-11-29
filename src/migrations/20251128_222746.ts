import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite';

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
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
	await db.run(
		sql`ALTER TABLE \`file_uploads\` ADD \`form_submission_id\` integer REFERENCES form_submissions(id);`,
	);
	await db.run(
		sql`ALTER TABLE \`file_uploads\` ADD \`pending_submission_id\` text;`,
	);
	await db.run(sql`ALTER TABLE \`file_uploads\` ADD \`field_name\` text;`);
	await db.run(
		sql`CREATE INDEX \`file_uploads_form_submission_idx\` ON \`file_uploads\` (\`form_submission_id\`);`,
	);
}

export async function down({
	db,
	payload,
	req,
}: MigrateDownArgs): Promise<void> {
	await db.run(sql`DROP TABLE \`forms_blocks_upload\`;`);
	await db.run(sql`PRAGMA foreign_keys=OFF;`);
	await db.run(sql`CREATE TABLE \`__new_file_uploads\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`submission_id\` text,
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
  	\`focal_y\` numeric
  );
  `);
	await db.run(
		sql`INSERT INTO \`__new_file_uploads\`("id", "submission_id", "submitted_at", "updated_at", "created_at", "url", "thumbnail_u_r_l", "filename", "mime_type", "filesize", "width", "height", "focal_x", "focal_y") SELECT "id", "submission_id", "submitted_at", "updated_at", "created_at", "url", "thumbnail_u_r_l", "filename", "mime_type", "filesize", "width", "height", "focal_x", "focal_y" FROM \`file_uploads\`;`,
	);
	await db.run(sql`DROP TABLE \`file_uploads\`;`);
	await db.run(
		sql`ALTER TABLE \`__new_file_uploads\` RENAME TO \`file_uploads\`;`,
	);
	await db.run(sql`PRAGMA foreign_keys=ON;`);
	await db.run(
		sql`CREATE INDEX \`file_uploads_updated_at_idx\` ON \`file_uploads\` (\`updated_at\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`file_uploads_created_at_idx\` ON \`file_uploads\` (\`created_at\`);`,
	);
	await db.run(
		sql`CREATE UNIQUE INDEX \`file_uploads_filename_idx\` ON \`file_uploads\` (\`filename\`);`,
	);
}
