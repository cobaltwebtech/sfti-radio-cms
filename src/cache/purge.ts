/**
 * Cloudflare Cache Purge API client
 *
 * This module handles cache invalidation via Cloudflare's Cache Purge API.
 * It uses cache tags for targeted purging without purging the entire zone.
 *
 * Required environment variables:
 * - CLOUDFLARE_ZONE_ID: The Cloudflare zone ID for your domain
 * - CLOUDFLARE_CACHE_PURGE_API_TOKEN: API token with "Cache Purge" permission
 */

import { type CacheableCollection, hasMarketAreaRelation } from './config';

export interface CloudflareEnvVars {
	CLOUDFLARE_ZONE_ID: string;
	CLOUDFLARE_CACHE_PURGE_API_TOKEN: string;
}

export interface PurgeResult {
	success: boolean;
	errors?: string[];
	purgedTags?: string[];
}

/**
 * Purge cache by tags via Cloudflare API
 * https://developers.cloudflare.com/cache/how-to/purge-cache/purge-by-tags/
 */
export async function purgeByTags(
	tags: string[],
	env: CloudflareEnvVars,
): Promise<PurgeResult> {
	if (!env.CLOUDFLARE_ZONE_ID || !env.CLOUDFLARE_CACHE_PURGE_API_TOKEN) {
		console.warn(
			'Cloudflare cache purge skipped: missing environment variables',
		);
		return {
			success: false,
			errors: [
				'Missing CLOUDFLARE_ZONE_ID or CLOUDFLARE_CACHE_PURGE_API_TOKEN',
			],
		};
	}

	if (tags.length === 0) {
		return { success: true, purgedTags: [] };
	}

	// Cloudflare allows max 30 tags per request
	const MAX_TAGS_PER_REQUEST = 30;
	const results: PurgeResult[] = [];

	for (let i = 0; i < tags.length; i += MAX_TAGS_PER_REQUEST) {
		const batch = tags.slice(i, i + MAX_TAGS_PER_REQUEST);

		try {
			const response = await fetch(
				`https://api.cloudflare.com/client/v4/zones/${env.CLOUDFLARE_ZONE_ID}/purge_cache`,
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${env.CLOUDFLARE_CACHE_PURGE_API_TOKEN}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ tags: batch }),
				},
			);

			const data = (await response.json()) as {
				success: boolean;
				errors?: Array<{ message: string }>;
			};

			if (!data.success) {
				results.push({
					success: false,
					errors: data.errors?.map((e) => e.message) || ['Unknown error'],
					purgedTags: batch,
				});
			} else {
				results.push({ success: true, purgedTags: batch });
			}
		} catch (error) {
			results.push({
				success: false,
				errors: [error instanceof Error ? error.message : 'Network error'],
				purgedTags: batch,
			});
		}
	}

	// Aggregate results
	const allSuccess = results.every((r) => r.success);
	const allErrors = results.flatMap((r) => r.errors || []);
	const allPurgedTags = results.flatMap((r) => r.purgedTags || []);

	return {
		success: allSuccess,
		errors: allErrors.length > 0 ? allErrors : undefined,
		purgedTags: allPurgedTags,
	};
}

/**
 * Purge cache URLs directly (for specific document URLs)
 * https://developers.cloudflare.com/cache/how-to/purge-cache/purge-by-single-file/
 */
export async function purgeByUrls(
	urls: string[],
	env: CloudflareEnvVars,
): Promise<PurgeResult> {
	if (!env.CLOUDFLARE_ZONE_ID || !env.CLOUDFLARE_CACHE_PURGE_API_TOKEN) {
		console.warn(
			'Cloudflare cache purge skipped: missing environment variables',
		);
		return {
			success: false,
			errors: [
				'Missing CLOUDFLARE_ZONE_ID or CLOUDFLARE_CACHE_PURGE_API_TOKEN',
			],
		};
	}

	if (urls.length === 0) {
		return { success: true };
	}

	// Cloudflare allows max 30 URLs per request
	const MAX_URLS_PER_REQUEST = 30;
	const results: PurgeResult[] = [];

	for (let i = 0; i < urls.length; i += MAX_URLS_PER_REQUEST) {
		const batch = urls.slice(i, i + MAX_URLS_PER_REQUEST);

		try {
			const response = await fetch(
				`https://api.cloudflare.com/client/v4/zones/${env.CLOUDFLARE_ZONE_ID}/purge_cache`,
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${env.CLOUDFLARE_CACHE_PURGE_API_TOKEN}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ files: batch }),
				},
			);

			const data = (await response.json()) as {
				success: boolean;
				errors?: Array<{ message: string }>;
			};

			if (!data.success) {
				results.push({
					success: false,
					errors: data.errors?.map((e) => e.message) || ['Unknown error'],
				});
			} else {
				results.push({ success: true });
			}
		} catch (error) {
			results.push({
				success: false,
				errors: [error instanceof Error ? error.message : 'Network error'],
			});
		}
	}

	const allSuccess = results.every((r) => r.success);
	const allErrors = results.flatMap((r) => r.errors || []);

	return {
		success: allSuccess,
		errors: allErrors.length > 0 ? allErrors : undefined,
	};
}

/**
 * Build cache tags for a document change event
 * Returns all tags that should be purged when a document is created/updated/deleted
 */
export function buildPurgeTags(
	collection: CacheableCollection,
	documentId: string | number,
	marketAreaId?: string | number,
	previousMarketAreaId?: string | number,
): string[] {
	const tags: string[] = [];

	// Always purge the collection list cache
	tags.push(`collection:${collection}`);

	// Purge the specific document cache
	tags.push(`doc:${collection}:${documentId}`);

	// If this collection has market area relations, purge market area tags
	if (hasMarketAreaRelation(collection)) {
		if (marketAreaId) {
			tags.push(`market-area:${marketAreaId}`);
		}
		// If market area changed, also purge the previous market area
		if (previousMarketAreaId && previousMarketAreaId !== marketAreaId) {
			tags.push(`market-area:${previousMarketAreaId}`);
		}
	}

	// For market-areas collection itself, purge all related content
	if (collection === 'market-areas') {
		tags.push(`market-area:${documentId}`);
	}

	return [...new Set(tags)]; // Deduplicate
}

/**
 * Invalidate cache for a document change
 */
export async function invalidateDocumentCache(
	env: CloudflareEnvVars,
	collection: CacheableCollection,
	documentId: string | number,
	options?: {
		marketAreaId?: string | number;
		previousMarketAreaId?: string | number;
	},
): Promise<PurgeResult> {
	const tags = buildPurgeTags(
		collection,
		documentId,
		options?.marketAreaId,
		options?.previousMarketAreaId,
	);

	console.log(`[Cache] Purging tags for ${collection}/${documentId}:`, tags);

	return purgeByTags(tags, env);
}

/**
 * Invalidate all cache for a collection
 * Use sparingly - only for bulk operations
 */
export async function invalidateCollectionCache(
	env: CloudflareEnvVars,
	collection: CacheableCollection,
): Promise<PurgeResult> {
	const tags = [`collection:${collection}`];
	console.log(`[Cache] Purging entire collection cache: ${collection}`);
	return purgeByTags(tags, env);
}
