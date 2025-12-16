/**
 * Cache header utilities for Payload CMS API responses
 *
 * Adds Cache-Control headers to enable:
 * - Short browser cache (5 min) for fresh content
 * - Longer Cloudflare edge cache (1 hour) with cache tags for purging
 */

import { CACHE_TTL, isCacheableCollection } from './config';

/**
 * Generate Cache-Control header value for cacheable responses
 */
export function getCacheControlHeader(isPublic = true): string {
	if (!isPublic) {
		return 'private, no-cache, no-store, must-revalidate';
	}

	return [
		'public',
		`max-age=${CACHE_TTL.BROWSER}`,
		`s-maxage=${CACHE_TTL.EDGE}`,
		`stale-while-revalidate=${CACHE_TTL.STALE_WHILE_REVALIDATE}`,
	].join(', ');
}

/**
 * Generate cache tags for a collection and optional document
 * Cache tags allow targeted cache purging via Cloudflare API
 */
export function getCacheTags(
	collection: string,
	documentId?: string | number,
	marketAreaId?: string | number,
): string[] {
	const tags: string[] = [];

	// Collection-level tag (for collection list queries)
	tags.push(`collection:${collection}`);

	// Document-specific tag
	if (documentId) {
		tags.push(`doc:${collection}:${documentId}`);
	}

	// Market area tag (for market-area filtered queries)
	if (marketAreaId) {
		tags.push(`market-area:${marketAreaId}`);
	}

	return tags;
}

/**
 * Set cache headers on a Response object
 */
export function setCacheHeaders(
	response: Response,
	collection: string,
	options?: {
		documentId?: string | number;
		marketAreaId?: string | number;
		isAuthenticated?: boolean;
	},
): Response {
	// Don't cache authenticated requests or non-cacheable collections
	if (options?.isAuthenticated || !isCacheableCollection(collection)) {
		const headers = new Headers(response.headers);
		headers.set('Cache-Control', getCacheControlHeader(false));
		headers.set('Vary', 'Authorization, Cookie');
		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers,
		});
	}

	const headers = new Headers(response.headers);

	// Set Cache-Control for browser and edge caching
	headers.set('Cache-Control', getCacheControlHeader(true));

	// Set cache tags for Cloudflare cache purging
	const tags = getCacheTags(
		collection,
		options?.documentId,
		options?.marketAreaId,
	);
	headers.set('Cache-Tag', tags.join(','));

	// Vary header to ensure proper cache key
	headers.set('Vary', 'Accept, Accept-Encoding');

	// CDN-Cache-Control for Cloudflare-specific settings (if different from Cache-Control)
	headers.set('CDN-Cache-Control', `public, max-age=${CACHE_TTL.EDGE}`);

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers,
	});
}

/**
 * Extract collection slug from URL path
 * e.g., /api/blog -> blog, /api/news/123 -> news
 */
export function extractCollectionFromPath(path: string): string | null {
	const match = path.match(/^\/api\/([a-z-]+)/i);
	return match ? match[1] : null;
}

/**
 * Extract document ID from URL path
 * e.g., /api/blog/123 -> 123
 */
export function extractDocumentIdFromPath(path: string): string | null {
	const match = path.match(/^\/api\/[a-z-]+\/([a-z0-9-]+)/i);
	return match ? match[1] : null;
}

/**
 * Extract market area ID from query parameters
 */
export function extractMarketAreaFromQuery(
	searchParams: URLSearchParams,
): string | null {
	// Check for where[marketArea][equals] pattern
	return searchParams.get('where[marketArea][equals]');
}
