/**
 * Collection wrapper for adding cache invalidation hooks
 *
 * This utility adds afterChange and afterDelete hooks to collections
 * for automatic Cloudflare cache invalidation.
 */

import type { CollectionConfig } from 'payload';
import { isCacheableCollection } from './config';
import {
	createCacheInvalidationDeleteHook,
	createCacheInvalidationHook,
} from './hooks';

/**
 * Wrap a collection config to add cache invalidation hooks
 *
 * @param collection - The original collection config
 * @returns Collection config with cache invalidation hooks
 */
export function withCacheInvalidation(
	collection: CollectionConfig,
): CollectionConfig {
	const slug = collection.slug;

	// Only add hooks to cacheable collections
	if (!isCacheableCollection(slug)) {
		return collection;
	}

	const existingHooks = collection.hooks || {};

	return {
		...collection,
		hooks: {
			...existingHooks,
			afterChange: [
				...(existingHooks.afterChange || []),
				createCacheInvalidationHook(slug),
			],
			afterDelete: [
				...(existingHooks.afterDelete || []),
				createCacheInvalidationDeleteHook(slug),
			],
		},
	};
}

/**
 * Wrap multiple collection configs to add cache invalidation hooks
 *
 * @param collections - Array of collection configs
 * @returns Array of collection configs with cache invalidation hooks
 */
export function withCacheInvalidationAll(
	collections: CollectionConfig[],
): CollectionConfig[] {
	return collections.map(withCacheInvalidation);
}
