/**
 * Cache Purge Webhook API
 *
 * This endpoint allows external services (like your Astro frontend or CI/CD)
 * to trigger cache invalidation.
 *
 * Endpoints:
 * POST /api/cache/purge - Purge cache by tags or URLs
 *
 * Authentication:
 * Requires a valid CACHE_PURGE_SECRET in the Authorization header
 */

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import {
	CACHEABLE_COLLECTIONS,
	type CacheableCollection,
	type CloudflareEnvVars,
	invalidateCollectionCache,
	purgeByTags,
	purgeByUrls,
} from '@/cache';

interface PurgeRequest {
	// Purge by cache tags
	tags?: string[];
	// Purge by URLs
	urls?: string[];
	// Purge entire collection
	collection?: CacheableCollection;
	// Purge all caches (use sparingly)
	purgeAll?: boolean;
}

/**
 * Get Cloudflare env vars from the request context
 */
function getCloudflareEnv(): CloudflareEnvVars | null {
	// In Cloudflare Workers with Next.js, env vars are available via process.env
	// or through the request context when using OpenNext
	const env = {
		CLOUDFLARE_ZONE_ID: process.env.CLOUDFLARE_ZONE_ID || '',
		CLOUDFLARE_CACHE_PURGE_API_TOKEN:
			process.env.CLOUDFLARE_CACHE_PURGE_API_TOKEN || '',
	};

	if (!env.CLOUDFLARE_ZONE_ID || !env.CLOUDFLARE_CACHE_PURGE_API_TOKEN) {
		return null;
	}

	return env;
}

/**
 * Validate the cache purge secret
 */
function validateSecret(request: NextRequest): boolean {
	const authHeader = request.headers.get('Authorization');
	const secret = process.env.CACHE_PURGE_SECRET;

	if (!secret) {
		console.warn('[Cache Purge] CACHE_PURGE_SECRET not configured');
		return false;
	}

	if (!authHeader) {
		return false;
	}

	// Support both "Bearer <token>" and raw token
	const token = authHeader.startsWith('Bearer ')
		? authHeader.slice(7)
		: authHeader;

	return token === secret;
}

export async function POST(request: NextRequest) {
	// Validate authentication
	if (!validateSecret(request)) {
		return NextResponse.json(
			{
				error: 'Unauthorized',
				message: 'Invalid or missing authorization token',
			},
			{ status: 401 },
		);
	}

	// Get Cloudflare credentials
	const env = getCloudflareEnv();
	if (!env) {
		return NextResponse.json(
			{
				error: 'Configuration Error',
				message: 'Cloudflare credentials not configured',
			},
			{ status: 500 },
		);
	}

	// Parse request body
	let body: PurgeRequest;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json(
			{ error: 'Bad Request', message: 'Invalid JSON body' },
			{ status: 400 },
		);
	}

	const results: Array<{
		type: string;
		success: boolean;
		details?: unknown;
		errors?: string[];
	}> = [];

	// Handle purge by tags
	if (body.tags && body.tags.length > 0) {
		const result = await purgeByTags(body.tags, env);
		results.push({
			type: 'tags',
			success: result.success,
			details: { tags: body.tags, purged: result.purgedTags },
			errors: result.errors,
		});
	}

	// Handle purge by URLs
	if (body.urls && body.urls.length > 0) {
		const result = await purgeByUrls(body.urls, env);
		results.push({
			type: 'urls',
			success: result.success,
			details: { urls: body.urls },
			errors: result.errors,
		});
	}

	// Handle purge by collection
	if (body.collection) {
		if (
			!CACHEABLE_COLLECTIONS.includes(body.collection as CacheableCollection)
		) {
			return NextResponse.json(
				{
					error: 'Bad Request',
					message: `Invalid collection: ${body.collection}`,
				},
				{ status: 400 },
			);
		}

		const result = await invalidateCollectionCache(env, body.collection);
		results.push({
			type: 'collection',
			success: result.success,
			details: { collection: body.collection },
			errors: result.errors,
		});
	}

	// Handle purge all
	if (body.purgeAll) {
		// Purge all cacheable collections
		const allTags = CACHEABLE_COLLECTIONS.map((c) => `collection:${c}`);
		const result = await purgeByTags(allTags, env);
		results.push({
			type: 'purgeAll',
			success: result.success,
			details: { collections: CACHEABLE_COLLECTIONS },
			errors: result.errors,
		});
	}

	// Check if any operation was performed
	if (results.length === 0) {
		return NextResponse.json(
			{
				error: 'Bad Request',
				message:
					'No purge operation specified. Provide tags, urls, collection, or purgeAll.',
			},
			{ status: 400 },
		);
	}

	// Return results
	const allSuccess = results.every((r) => r.success);
	return NextResponse.json(
		{
			success: allSuccess,
			results,
		},
		{ status: allSuccess ? 200 : 207 }, // 207 Multi-Status if partial success
	);
}

// Only allow POST method
export async function GET() {
	return NextResponse.json(
		{ error: 'Method Not Allowed', message: 'Use POST to purge cache' },
		{ status: 405 },
	);
}
