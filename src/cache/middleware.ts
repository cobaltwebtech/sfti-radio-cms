/**
 * API Response Middleware for Cache Headers
 *
 * This middleware intercepts API responses and adds appropriate
 * Cache-Control headers based on the collection and request type.
 *
 * Note: This is designed to work with Next.js middleware in Cloudflare Workers.
 * For Payload CMS, cache headers are better handled at the collection level
 * or via a custom endpoint wrapper.
 */

import type { NextRequest, NextResponse } from 'next/server';
import {
	CACHE_TTL,
	extractCollectionFromPath,
	extractDocumentIdFromPath,
	extractMarketAreaFromQuery,
	getCacheControlHeader,
	getCacheTags,
	isCacheableCollection,
} from '@/cache';

/**
 * Check if a request is authenticated
 */
function isAuthenticatedRequest(request: NextRequest): boolean {
	// Check for Authorization header
	if (request.headers.get('Authorization')) {
		return true;
	}

	// Check for payload session cookie
	const cookies = request.cookies;
	if (cookies.get('payload-token')) {
		return true;
	}

	return false;
}

/**
 * Check if the request is a read operation (GET, HEAD)
 */
function isReadOperation(request: NextRequest): boolean {
	return ['GET', 'HEAD'].includes(request.method);
}

/**
 * Add cache headers to the response based on the request
 */
export function addCacheHeaders(
	request: NextRequest,
	response: NextResponse,
): NextResponse {
	const url = new URL(request.url);
	const path = url.pathname;

	// Only cache API routes
	if (!path.startsWith('/api/')) {
		return response;
	}

	// Don't cache non-read operations
	if (!isReadOperation(request)) {
		response.headers.set('Cache-Control', 'no-store');
		return response;
	}

	// Don't cache authenticated requests
	if (isAuthenticatedRequest(request)) {
		response.headers.set('Cache-Control', getCacheControlHeader(false));
		response.headers.set('Vary', 'Authorization, Cookie');
		return response;
	}

	// Extract collection from path
	const collection = extractCollectionFromPath(path);

	// Skip non-cacheable collections
	if (!collection || !isCacheableCollection(collection)) {
		response.headers.set('Cache-Control', getCacheControlHeader(false));
		return response;
	}

	// Extract document ID and market area for cache tags
	const documentId = extractDocumentIdFromPath(path);
	const marketAreaId = extractMarketAreaFromQuery(url.searchParams);

	// Set cache control header
	response.headers.set('Cache-Control', getCacheControlHeader(true));

	// Set CDN-specific cache control (Cloudflare)
	response.headers.set(
		'CDN-Cache-Control',
		`public, max-age=${CACHE_TTL.EDGE}`,
	);

	// Set cache tags for targeted purging
	const tags = getCacheTags(
		collection,
		documentId ?? undefined,
		marketAreaId ?? undefined,
	);
	response.headers.set('Cache-Tag', tags.join(','));

	// Vary header for proper cache key differentiation
	response.headers.set('Vary', 'Accept, Accept-Encoding');

	return response;
}

/**
 * Middleware configuration for Next.js
 */
export const config = {
	matcher: '/api/:path*',
};
