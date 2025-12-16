/**
 * Payload CMS collection hooks for cache invalidation
 *
 * These hooks automatically purge Cloudflare cache when documents
 * are created, updated, or deleted.
 */

import type {
	CollectionAfterChangeHook,
	CollectionAfterDeleteHook,
} from 'payload';
import {
	type CacheableCollection,
	hasMarketAreaRelation,
	isCacheableCollection,
} from './config';
import { type CloudflareEnvVars, invalidateDocumentCache } from './purge';

// Type for documents that may have marketArea field
interface DocumentWithMarketArea {
	id: string | number;
	marketArea?: string | number | { id: string | number } | null;
	_status?: 'published' | 'draft';
}

/**
 * Extract market area ID from a document
 * Handles both populated (object) and non-populated (id) relationships
 */
function getMarketAreaId(
	doc: DocumentWithMarketArea,
): string | number | undefined {
	if (!doc.marketArea) return undefined;

	if (typeof doc.marketArea === 'object' && 'id' in doc.marketArea) {
		return doc.marketArea.id;
	}

	return doc.marketArea as string | number;
}

/**
 * Get Cloudflare env vars from the request context
 */
function getCloudflareEnv(req: {
	context?: unknown;
}): CloudflareEnvVars | null {
	// In Cloudflare Workers, env vars are available on the request context
	const context = req.context as
		| { cloudflare?: { env?: CloudflareEnvVars } }
		| undefined;

	if (context?.cloudflare?.env) {
		return context.cloudflare.env as CloudflareEnvVars;
	}

	// Fallback to process.env for local development
	return {
		CLOUDFLARE_ZONE_ID: process.env.CLOUDFLARE_ZONE_ID || '',
		CLOUDFLARE_CACHE_PURGE_API_TOKEN:
			process.env.CLOUDFLARE_CACHE_PURGE_API_TOKEN || '',
	};
}

/**
 * Create an afterChange hook for cache invalidation
 */
export function createCacheInvalidationHook(
	collectionSlug: string,
): CollectionAfterChangeHook {
	return async ({ doc, previousDoc, operation, req }) => {
		// Only invalidate cache for cacheable collections
		if (!isCacheableCollection(collectionSlug)) {
			return doc;
		}

		const typedDoc = doc as DocumentWithMarketArea;
		const typedPrevDoc = previousDoc as DocumentWithMarketArea | undefined;

		// Only invalidate cache when document is published
		// Skip for draft saves to avoid unnecessary cache purges
		if (typedDoc._status === 'draft' && operation === 'update') {
			console.log(
				`[Cache] Skipping cache invalidation for draft: ${collectionSlug}/${typedDoc.id}`,
			);
			return doc;
		}

		// Get Cloudflare env vars
		const env = getCloudflareEnv(req);
		if (
			!env ||
			!env.CLOUDFLARE_ZONE_ID ||
			!env.CLOUDFLARE_CACHE_PURGE_API_TOKEN
		) {
			console.warn(
				'[Cache] Missing Cloudflare credentials, skipping cache invalidation',
			);
			return doc;
		}

		try {
			// Get market area IDs for targeted invalidation
			const marketAreaId = hasMarketAreaRelation(collectionSlug)
				? getMarketAreaId(typedDoc)
				: undefined;

			const previousMarketAreaId =
				hasMarketAreaRelation(collectionSlug) && typedPrevDoc
					? getMarketAreaId(typedPrevDoc)
					: undefined;

			const result = await invalidateDocumentCache(
				env,
				collectionSlug as CacheableCollection,
				typedDoc.id,
				{
					marketAreaId,
					previousMarketAreaId,
				},
			);

			if (result.success) {
				console.log(
					`[Cache] Successfully invalidated cache for ${collectionSlug}/${typedDoc.id}`,
					result.purgedTags,
				);
			} else {
				console.error(
					`[Cache] Failed to invalidate cache for ${collectionSlug}/${typedDoc.id}:`,
					result.errors,
				);
			}
		} catch (error) {
			// Don't throw - cache invalidation failure shouldn't break the CMS
			console.error('[Cache] Error during cache invalidation:', error);
		}

		return doc;
	};
}

/**
 * Create an afterDelete hook for cache invalidation
 */
export function createCacheInvalidationDeleteHook(
	collectionSlug: string,
): CollectionAfterDeleteHook {
	return async ({ doc, req }) => {
		if (!isCacheableCollection(collectionSlug)) {
			return doc;
		}

		const typedDoc = doc as DocumentWithMarketArea;

		const env = getCloudflareEnv(req);
		if (
			!env ||
			!env.CLOUDFLARE_ZONE_ID ||
			!env.CLOUDFLARE_CACHE_PURGE_API_TOKEN
		) {
			console.warn(
				'[Cache] Missing Cloudflare credentials, skipping cache invalidation',
			);
			return doc;
		}

		try {
			const marketAreaId = hasMarketAreaRelation(collectionSlug)
				? getMarketAreaId(typedDoc)
				: undefined;

			const result = await invalidateDocumentCache(
				env,
				collectionSlug as CacheableCollection,
				typedDoc.id,
				{ marketAreaId },
			);

			if (result.success) {
				console.log(
					`[Cache] Successfully invalidated cache on delete for ${collectionSlug}/${typedDoc.id}`,
				);
			} else {
				console.error(
					`[Cache] Failed to invalidate cache on delete for ${collectionSlug}/${typedDoc.id}:`,
					result.errors,
				);
			}
		} catch (error) {
			console.error(
				'[Cache] Error during cache invalidation on delete:',
				error,
			);
		}

		return doc;
	};
}

/**
 * Create both afterChange and afterDelete hooks for a collection
 */
export function createCacheInvalidationHooks(collectionSlug: string) {
	return {
		afterChange: [createCacheInvalidationHook(collectionSlug)],
		afterDelete: [createCacheInvalidationDeleteHook(collectionSlug)],
	};
}
