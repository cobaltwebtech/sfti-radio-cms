/**
 * Cache configuration for Payload CMS with Cloudflare Workers
 *
 * This module defines cache TTLs and collection-specific cache settings
 * for HTTP caching with Cloudflare edge cache.
 */

// Cache TTLs in seconds
export const CACHE_TTL = {
	// Browser cache - short TTL for fresh content
	BROWSER: 5 * 60, // 5 minutes

	// Cloudflare edge cache - longer TTL, purged on content changes
	EDGE: 24 * 60 * 60, // 24 hours

	// Stale-while-revalidate window
	STALE_WHILE_REVALIDATE: 60, // 1 minute
} as const;

// Collections that support caching (public read access)
export const CACHEABLE_COLLECTIONS = [
	'blog',
	'news',
	'churches',
	'local-events',
	'schools',
	'sports',
	'market-areas',
	'media',
	'forms', // Form schemas are public
] as const;

// Collections that have marketArea relationships (for targeted cache invalidation)
export const MARKET_AREA_COLLECTIONS = [
	'news',
	'churches',
	'local-events',
	'schools',
	'sports',
] as const;

// Collections that should never be cached
export const NON_CACHEABLE_COLLECTIONS = [
	'users',
	'form-submissions',
	'file-uploads',
	'payload-preferences',
	'payload-migrations',
] as const;

export type CacheableCollection = (typeof CACHEABLE_COLLECTIONS)[number];
export type MarketAreaCollection = (typeof MARKET_AREA_COLLECTIONS)[number];

/**
 * Check if a collection is cacheable
 */
export function isCacheableCollection(
	slug: string,
): slug is CacheableCollection {
	return (CACHEABLE_COLLECTIONS as readonly string[]).includes(slug);
}

/**
 * Check if a collection has market area relationships
 */
export function hasMarketAreaRelation(
	slug: string,
): slug is MarketAreaCollection {
	return (MARKET_AREA_COLLECTIONS as readonly string[]).includes(slug);
}
