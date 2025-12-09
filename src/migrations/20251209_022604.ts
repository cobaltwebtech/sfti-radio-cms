import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite';

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
	await db.run(sql`CREATE TABLE IF NOT EXISTS \`market_areas_custom_stream_url\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`url\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`market_areas\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
	await db.run(
		sql`CREATE INDEX IF NOT EXISTS \`market_areas_custom_stream_url_order_idx\` ON \`market_areas_custom_stream_url\` (\`_order\`);`,
	);
	await db.run(
		sql`CREATE INDEX IF NOT EXISTS \`market_areas_custom_stream_url_parent_id_idx\` ON \`market_areas_custom_stream_url\` (\`_parent_id\`);`,
	);
}

export async function down({
	db,
	payload,
	req,
}: MigrateDownArgs): Promise<void> {
	await db.run(sql`DROP TABLE \`market_areas_custom_stream_url\`;`);
}
