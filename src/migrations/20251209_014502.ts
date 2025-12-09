import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite';

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
	await db.run(sql`CREATE TABLE \`market_areas_stream_id\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`market_areas\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
	await db.run(
		sql`CREATE INDEX \`market_areas_stream_id_order_idx\` ON \`market_areas_stream_id\` (\`_order\`);`,
	);
	await db.run(
		sql`CREATE INDEX \`market_areas_stream_id_parent_id_idx\` ON \`market_areas_stream_id\` (\`_parent_id\`);`,
	);
}

export async function down({
	db,
	payload,
	req,
}: MigrateDownArgs): Promise<void> {
	await db.run(sql`DROP TABLE \`market_areas_stream_id\`;`);
}
