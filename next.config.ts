import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    cpus: 1,
  },
  webpack: (webpackConfig: any, { isServer, webpack }: any) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    webpackConfig.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/^node:/, (resource: any) => {
        resource.request = resource.request.replace(/^node:/, '')
      })
    )

    if (!isServer) {
      // Exclude undici from client bundle — Cloudflare Workers use native fetch
      webpackConfig.externals = webpackConfig.externals || []
      webpackConfig.externals.push('undici')

      // Stub file-type — Payload upload code leaks into client bundle
      webpackConfig.externals.push('file-type')

      // Stub ALL Node.js built-ins unavailable in Cloudflare Workers runtime
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        // Worker threads
        worker_threads: false,
        // Assertion utilities
        assert: false,
        // Async hooks (internal)
        async_hooks: false,
        // Buffer utilities
        buffer: false,
        // Console (already polyfilled by Next.js)
        console: false,
        // Filesystem — Payload CMS server code leaks into client bundle
        fs: false,
        'fs/promises': false,
        // Module system
        module: false,
        // Network — undici requires these (server-only)
        net: false,
        tls: false,
        // Diagnostics/tracing (undici internal)
        diagnostics_channel: false,
        // SQLite storage adapter (server-only)
        sqlite: false,
        // Path utilities
        path: false,
        // OS information (server-only)
        os: false,
        // Crypto (use Web Crypto API in Workers instead)
        crypto: false,
        // Stream utilities
        stream: false,
        'stream/web': false,
        // Readable/Writable streams
        'readable-stream': false,
        // URL utilities
        url: false,
        // Child process — used by Payload for some internal operations
        child_process: false,
        // DNS — used by Payload for fetching external files
        dns: false,
      }

      // Stub Payload logging libraries not available in Workers
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        'pino-pretty': false,
        'pino-abstract-transport': false,
      }
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })