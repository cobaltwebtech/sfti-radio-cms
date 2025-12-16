/**
 * Cache module exports
 */

export {
	withCacheInvalidation,
	withCacheInvalidationAll,
} from './collection-wrapper';
export {
	CACHE_TTL,
	CACHEABLE_COLLECTIONS,
	type CacheableCollection,
	hasMarketAreaRelation,
	isCacheableCollection,
	MARKET_AREA_COLLECTIONS,
	type MarketAreaCollection,
	NON_CACHEABLE_COLLECTIONS,
} from './config';
export {
	extractCollectionFromPath,
	extractDocumentIdFromPath,
	extractMarketAreaFromQuery,
	getCacheControlHeader,
	getCacheTags,
	setCacheHeaders,
} from './headers';

export {
	createCacheInvalidationHook,
	createCacheInvalidationHooks,
} from './hooks';
export {
	buildPurgeTags,
	type CloudflareEnvVars,
	invalidateCollectionCache,
	invalidateDocumentCache,
	type PurgeResult,
	purgeByTags,
	purgeByUrls,
} from './purge';
