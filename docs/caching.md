# HTTP Caching with Cloudflare Cache Invalidation

This document describes the HTTP caching implementation for Payload CMS with Cloudflare Workers.

## Overview

The caching system provides:
- **HTTP Cache-Control headers** on all public API responses
- **Cache tags** for targeted cache invalidation
- **Automatic cache purge** when documents are created, updated, or deleted
- **Manual cache purge API** for external services

## Cache Configuration

### TTL Settings

| Cache Layer | TTL | Purpose |
|-------------|-----|---------|
| Browser (`max-age`) | 5 minutes | Short-lived browser cache for fresh content |
| Edge (`s-maxage`) | 1 hour | Longer CDN cache, purged on content changes |
| Stale-while-revalidate | 1 minute | Grace period for background refresh |

### Cacheable Collections

The following collections support caching:
- `blog`
- `news`
- `churches`
- `local-events`
- `schools`
- `sports`
- `market-areas`
- `media`
- `forms` (form schemas only)

### Non-Cacheable Collections

- `users`
- `form-submissions`
- `file-uploads`

## Environment Variables

Set these via Wrangler secrets or Cloudflare dashboard:

```bash
# Your Cloudflare zone ID (find in Cloudflare dashboard)
wrangler secret put CLOUDFLARE_ZONE_ID

# API token with "Cache Purge" permission
# Create at: https://dash.cloudflare.com/profile/api-tokens
wrangler secret put CLOUDFLARE_CACHE_PURGE_API_TOKEN

# Secret for authenticating cache purge API requests
# Generate a secure random string
wrangler secret put CACHE_PURGE_SECRET
```

### Creating a Cloudflare API Token

1. Go to [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click "Create Token"
3. Use "Custom token" template
4. Set permissions:
   - Zone > Cache Purge > Purge
5. Set Zone Resources:
   - Include > Specific zone > Your domain
6. Create and save the token

## Cache Headers

### Response Headers

Public API responses include:

```http
Cache-Control: public, max-age=300, s-maxage=3600, stale-while-revalidate=60
CDN-Cache-Control: public, max-age=3600
Cache-Tag: collection:blog,doc:blog:123,market-area:456
Vary: Accept, Accept-Encoding
```

### Cache Tags Format

| Tag Format | Description | Example |
|------------|-------------|---------|
| `collection:{slug}` | All documents in a collection | `collection:news` |
| `doc:{slug}:{id}` | Specific document | `doc:news:abc123` |
| `market-area:{id}` | Content filtered by market area | `market-area:xyz789` |

## Automatic Cache Invalidation

Cache is automatically purged when:

1. **Document Created**: Purges collection list cache
2. **Document Updated**: Purges document cache + collection list + market area (if changed)
3. **Document Deleted**: Purges document cache + collection list + market area

### Draft Documents

Draft saves do **not** trigger cache invalidation. Only published documents invalidate cache.

## Manual Cache Purge API

### Endpoint

```
POST /api/cache/purge
```

### Authentication

Include the `CACHE_PURGE_SECRET` in the Authorization header:

```bash
curl -X POST https://your-cms.com/api/cache/purge \
  -H "Authorization: Bearer YOUR_CACHE_PURGE_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"tags": ["collection:blog"]}'
```

### Request Body Options

```typescript
interface PurgeRequest {
  // Purge by cache tags
  tags?: string[];
  
  // Purge by specific URLs
  urls?: string[];
  
  // Purge entire collection
  collection?: 'blog' | 'news' | 'churches' | 'local-events' | 'schools' | 'sports' | 'market-areas' | 'media' | 'forms';
  
  // Purge all caches (use sparingly)
  purgeAll?: boolean;
}
```

### Examples

**Purge by tags:**
```json
{
  "tags": ["collection:blog", "market-area:abc123"]
}
```

**Purge entire collection:**
```json
{
  "collection": "news"
}
```

**Purge specific URLs:**
```json
{
  "urls": [
    "https://your-cms.com/api/blog",
    "https://your-cms.com/api/blog/123"
  ]
}
```

**Purge everything:**
```json
{
  "purgeAll": true
}
```

## Astro Frontend Integration

### Fetching with Service Binding

When fetching from your Astro frontend via Worker-to-Worker binding:

```typescript
// src/lib/cms.ts
import type { Env } from '../env';

export async function fetchFromCMS<T>(
  env: Env,
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  // Service binding automatically handles caching via Cloudflare
  const response = await env.CMS.fetch(
    new Request(`https://sfti-radio-cms-prod-worker/api/${endpoint}`, options)
  );
  
  if (!response.ok) {
    throw new Error(`CMS fetch failed: ${response.status}`);
  }
  
  return response.json();
}

// Example: Fetch published news for a market area
export async function getNewsByMarketArea(env: Env, marketAreaId: string) {
  const params = new URLSearchParams({
    'where[status][equals]': 'published',
    'where[marketArea][equals]': marketAreaId,
    'sort': '-publishDate',
    'limit': '10',
  });
  
  return fetchFromCMS(env, `news?${params}`);
}
```

### Triggering Cache Purge from Astro

```typescript
// src/lib/cache.ts
export async function purgeCMSCache(
  tags: string[],
  options?: { secret: string; cmsUrl: string }
) {
  const response = await fetch(`${options?.cmsUrl}/api/cache/purge`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${options?.secret}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tags }),
  });
  
  return response.json();
}
```

## Cloudflare Cache Configuration

### Cache Rules (Optional)

You can create custom cache rules in Cloudflare dashboard for additional control:

1. Go to **Caching > Cache Rules**
2. Create rule for API endpoints:
   - **If**: URI Path starts with `/api/`
   - **Then**: 
     - Cache eligibility: Eligible for cache
     - Edge TTL: Use cache-control header
     - Browser TTL: Use cache-control header

### Page Rules (Alternative)

For legacy setups, use Page Rules:

```
URL: *your-domain.com/api/*
Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: Respect Existing Headers
```

## Monitoring

### Logs

Cache operations are logged to the Worker console:

```
[Cache] Purging tags for blog/123: ["collection:blog", "doc:blog:123"]
[Cache] Successfully invalidated cache for blog/123 ["collection:blog", "doc:blog:123"]
```

### Cloudflare Analytics

Monitor cache performance in Cloudflare dashboard:
- **Analytics > Traffic**: Cache hit rate
- **Analytics > Cache**: Cache status breakdown

## Troubleshooting

### Cache Not Purging

1. Verify environment variables are set:
   ```bash
   wrangler secret list
   ```

2. Check Worker logs for errors

3. Verify API token has correct permissions

### Cache Headers Not Present

1. Ensure collection is in `CACHEABLE_COLLECTIONS`
2. Check request is not authenticated (no Authorization header)
3. Verify request method is GET or HEAD

### Stale Content After Publish

1. Check if document status is "published" (not draft)
2. Verify cache purge succeeded in logs
3. Try manual purge via API
