/**
 * Next.js Middleware for Cache Headers
 *
 * This middleware adds Cache-Control headers to API responses
 * for Cloudflare edge caching.
 *
 * Note: Next.js middleware runs BEFORE the route handler.
 * We use request headers to pass cache metadata, then apply
 * response headers in the route handler or via Cloudflare Transform Rules.
 */

import { type NextRequest, NextResponse } from 'next/server';

// Cache TTLs in seconds
const CACHE_TTL = {
	BROWSER: 5 * 60, // 5 minutes
	EDGE: 24 * 60 * 60, // 24 hours
	STALE_WHILE_REVALIDATE: 60, // 1 minute
} as const;

// Collections that support caching (public read access)
const CACHEABLE_COLLECTIONS = [
	'blog',
	'news',
	'churches',
	'local-events',
	'schools',
	'sports',
	'market-areas',
	'media',
	'forms',
] as const;

/**
 * Check if a collection is cacheable
 */
function isCacheableCollection(slug: string): boolean {
	return (CACHEABLE_COLLECTIONS as readonly string[]).includes(slug);
}

/**
 * Extract collection slug from URL path
 */
function extractCollectionFromPath(path: string): string | null {
	const match = path.match(/^\/api\/([a-z-]+)/i);
	return match ? match[1] : null;
}

/**
 * Extract document ID from URL path
 */
function extractDocumentIdFromPath(path: string): string | null {
	const match = path.match(/^\/api\/[a-z-]+\/([a-z0-9-]+)/i);
	return match ? match[1] : null;
}

/**
 * Extract market area ID from query parameters
 */
function extractMarketAreaFromQuery(
	searchParams: URLSearchParams,
): string | null {
	return searchParams.get('where[marketArea][equals]');
}

/**
 * Generate cache tags for a collection and optional document
 */
function getCacheTags(
	collection: string,
	documentId?: string | null,
	marketAreaId?: string | null,
): string[] {
	const tags: string[] = [];

	// Collection-level tag
	tags.push(`collection:${collection}`);

	// Document-specific tag
	if (documentId) {
		tags.push(`doc:${collection}:${documentId}`);
	}

	// Market area tag
	if (marketAreaId) {
		tags.push(`market-area:${marketAreaId}`);
	}

	return tags;
}

/**
 * Check if a request is authenticated
 */
function isAuthenticatedRequest(request: NextRequest): boolean {
	// Check for Authorization header
	if (request.headers.get('Authorization')) {
		return true;
	}

	// Check for payload session cookie
	if (request.cookies.get('payload-token')) {
		return true;
	}

	return false;
}

export async function middleware(request: NextRequest) {
	const url = new URL(request.url);
	const path = url.pathname;

	// Only process API routes (excluding special routes)
	if (!path.startsWith('/api/')) {
		return NextResponse.next();
	}

	// Skip cache, graphql, and other special endpoints
	if (
		path.startsWith('/api/cache/') ||
		path.startsWith('/api/graphql') ||
		path.startsWith('/api/users/') ||
		path.startsWith('/api/form-submissions') ||
		path.startsWith('/api/file-uploads')
	) {
		return NextResponse.next();
	}

	// Only cache GET/HEAD requests
	if (!['GET', 'HEAD'].includes(request.method)) {
		return NextResponse.next();
	}

	// Don't cache authenticated requests
	if (isAuthenticatedRequest(request)) {
		const response = NextResponse.next();
		response.headers.set(
			'Cache-Control',
			'private, no-cache, no-store, must-revalidate',
		);
		response.headers.set('Vary', 'Authorization, Cookie');
		return response;
	}

	// Extract collection from path
	const collection = extractCollectionFromPath(path);

	// Skip non-cacheable collections
	if (!collection || !isCacheableCollection(collection)) {
		return NextResponse.next();
	}

	// Extract document ID and market area for cache tags
	const documentId = extractDocumentIdFromPath(path);
	const marketAreaId = extractMarketAreaFromQuery(url.searchParams);

	// Generate cache tags
	const tags = getCacheTags(collection, documentId, marketAreaId);

	// Pass cache metadata via request headers (middleware can't modify response headers directly)
	// These will be read by the route handler or a Cloudflare Transform Rule
	const requestHeaders = new Headers(request.headers);
	requestHeaders.set('x-cache-tags', tags.join(','));
	requestHeaders.set('x-cache-collection', collection);
	requestHeaders.set('x-cache-ttl-browser', String(CACHE_TTL.BROWSER));
	requestHeaders.set('x-cache-ttl-edge', String(CACHE_TTL.EDGE));
	requestHeaders.set(
		'x-cache-ttl-swr',
		String(CACHE_TTL.STALE_WHILE_REVALIDATE),
	);

	// Rewrite request with cache metadata headers
	const response = NextResponse.next({
		request: {
			headers: requestHeaders,
		},
	});

	// Set response headers (these DO work for cache-control in Next.js middleware)
	response.headers.set(
		'Cache-Control',
		`public, max-age=${CACHE_TTL.BROWSER}, s-maxage=${CACHE_TTL.EDGE}, stale-while-revalidate=${CACHE_TTL.STALE_WHILE_REVALIDATE}`,
	);
	response.headers.set(
		'CDN-Cache-Control',
		`public, max-age=${CACHE_TTL.EDGE}`,
	);
	response.headers.set('Cache-Tag', tags.join(','));
	response.headers.set('Vary', 'Accept, Accept-Encoding');

	return response;
}

// Configure which routes this middleware runs on
export const config = {
	matcher: '/api/:path*',
};
