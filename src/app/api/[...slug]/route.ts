/**
 * Custom API Route Wrapper with Cache Headers
 *
 * This wraps Payload's REST API to add cache headers to responses.
 * Since Payload's route handlers are auto-generated and Next.js middleware
 * can't reliably modify response headers, this wrapper intercepts responses
 * and adds the appropriate cache headers.
 */

import config from '@payload-config';
import { REST_GET } from '@payloadcms/next/routes';
import type { NextRequest } from 'next/server';

// Cache TTLs in seconds
const CACHE_TTL = {
	BROWSER: 5 * 60, // 5 minutes
	EDGE: 24 * 60 * 60, // 24 hours
	STALE_WHILE_REVALIDATE: 60, // 1 minute
} as const;

// Collections that support caching
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

function isCacheableCollection(slug: string): boolean {
	return (CACHEABLE_COLLECTIONS as readonly string[]).includes(slug);
}

function extractCollectionFromPath(path: string): string | null {
	const match = path.match(/^\/api\/([a-z-]+)/i);
	return match ? match[1] : null;
}

function extractDocumentIdFromPath(path: string): string | null {
	const match = path.match(/^\/api\/[a-z-]+\/([a-z0-9-]+)/i);
	return match ? match[1] : null;
}

function getCacheTags(
	collection: string,
	documentId?: string | null,
	marketAreaId?: string | null,
): string[] {
	const tags: string[] = [`collection:${collection}`];
	if (documentId) tags.push(`doc:${collection}:${documentId}`);
	if (marketAreaId) tags.push(`market-area:${marketAreaId}`);
	return tags;
}

function isAuthenticatedRequest(request: NextRequest): boolean {
	if (request.headers.get('Authorization')) return true;
	if (request.cookies.get('payload-token')) return true;
	return false;
}

// Wrap the GET handler to add cache headers
const originalGet = REST_GET(config);

export async function GET(
	request: NextRequest,
	context: { params: Promise<{ slug: string[] }> },
): Promise<Response> {
	// Call the original Payload handler
	const response = await originalGet(request, context);

	// Don't cache non-2xx responses
	if (!response.ok) {
		return response;
	}

	const url = new URL(request.url);
	const path = url.pathname;
	const collection = extractCollectionFromPath(path);

	// Don't cache authenticated requests or non-cacheable collections
	if (
		isAuthenticatedRequest(request) ||
		!collection ||
		!isCacheableCollection(collection)
	) {
		const newHeaders = new Headers(response.headers);
		newHeaders.set(
			'Cache-Control',
			'private, no-cache, no-store, must-revalidate',
		);
		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers: newHeaders,
		});
	}

	// Extract cache tag parameters
	const documentId = extractDocumentIdFromPath(path);
	const marketAreaId = url.searchParams.get('where[marketArea][equals]');
	const tags = getCacheTags(collection, documentId, marketAreaId);

	// Create new response with cache headers
	const newHeaders = new Headers(response.headers);
	newHeaders.set(
		'Cache-Control',
		`public, max-age=${CACHE_TTL.BROWSER}, s-maxage=${CACHE_TTL.EDGE}, stale-while-revalidate=${CACHE_TTL.STALE_WHILE_REVALIDATE}`,
	);
	newHeaders.set('CDN-Cache-Control', `public, max-age=${CACHE_TTL.EDGE}`);
	newHeaders.set('Cache-Tag', tags.join(','));
	newHeaders.set('Vary', 'Accept, Accept-Encoding');

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers: newHeaders,
	});
}

// Re-export other methods unchanged (they don't need caching)
import {
	REST_DELETE,
	REST_OPTIONS,
	REST_PATCH,
	REST_POST,
	REST_PUT,
} from '@payloadcms/next/routes';

export const DELETE = REST_DELETE(config);
export const OPTIONS = REST_OPTIONS(config);
export const PATCH = REST_PATCH(config);
export const POST = REST_POST(config);
export const PUT = REST_PUT(config);
