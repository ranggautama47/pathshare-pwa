/**
 * Cache Strategies Helper
 * 
 * Reusable functions untuk Network First dan Cache First strategies
 * Digunakan di Service Worker
 */

/**
 * Network First Strategy
 * 
 * 1. Try fetch dari network dulu
 * 2. Jika sukses → cache response → return
 * 3. Jika fail/offline → return dari cache
 * 
 * @param {Request} request
 * @param {string} cacheName
 * @returns {Promise<Response>}
 */
export async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName)

  try {
    console.log(`[SW] networkFirst: Fetching ${request.url}`)

    // Try fetch dari network
    const networkResponse = await fetch(request)

    // Cache successful response
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
      console.log(`[SW] networkFirst: Cached ${request.url}`)
    }

    return networkResponse
  } catch (error) {
    // Network failed, try cache
    console.log(
      `[SW] networkFirst: Network failed for ${request.url}, trying cache`
    )

    const cachedResponse = await cache.match(request)

    if (cachedResponse) {
      console.log(`[SW] networkFirst: Serving from cache ${request.url}`)
      return cachedResponse
    }

    // No cache, return error response
    console.warn(`[SW] networkFirst: No cache for ${request.url}`)
    return new Response('Offline and not cached', {
      status: 503,
      statusText: 'Service Unavailable'
    })
  }
}

/**
 * Cache First Strategy
 * 
 * 1. Check cache dulu
 * 2. Jika ada → return dari cache
 * 3. Jika tidak → fetch dari network → cache → return
 * 
 * @param {Request} request
 * @param {string} cacheName
 * @returns {Promise<Response>}
 */
export async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName)

  try {
    // Check cache dulu
    const cachedResponse = await cache.match(request)

    if (cachedResponse) {
      console.log(`[SW] cacheFirst: Serving from cache ${request.url}`)
      return cachedResponse
    }

    console.log(`[SW] cacheFirst: Not in cache, fetching ${request.url}`)

    // Not in cache, fetch from network
    const networkResponse = await fetch(request)

    // Cache successful response
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
      console.log(`[SW] cacheFirst: Cached ${request.url}`)
    }

    return networkResponse
  } catch (error) {
    // Network failed and not in cache
    console.warn(`[SW] cacheFirst: Failed to fetch ${request.url}`, error)

    // Try return placeholder image jika request adalah image
    if (request.headers.get('accept')?.includes('image')) {
      console.log(`[SW] cacheFirst: Returning placeholder for ${request.url}`)
      return new Response(
        `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect fill="#ddd" width="300" height="200"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#999">Image unavailable</text></svg>`,
        {
          headers: { 'Content-Type': 'image/svg+xml' }
        }
      )
    }

    // Return error response
    return new Response('Not available', {
      status: 503,
      statusText: 'Service Unavailable'
    })
  }
}

/**
 * Stale While Revalidate Strategy
 * 
 * 1. Return dari cache (jika ada) langsung
 * 2. Fetch dari network in background
 * 3. Update cache saat network selesai
 * 
 * @param {Request} request
 * @param {string} cacheName
 * @returns {Promise<Response>}
 */
export async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)

  // Try get dari cache
  const cachedResponse = await cache.match(request)

  // Fetch dari network in background (tidak await)
  fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone())
        console.log(`[SW] staleWhileRevalidate: Updated cache ${request.url}`)
      }
    })
    .catch(() => {
      console.log(`[SW] staleWhileRevalidate: Background fetch failed`)
    })

  // Return cache immediately (atau network jika tidak ada cache)
  if (cachedResponse) {
    console.log(
      `[SW] staleWhileRevalidate: Serving stale from cache ${request.url}`
    )
    return cachedResponse
  }

  console.log(
    `[SW] staleWhileRevalidate: No cache, waiting for network ${request.url}`
  )
  return fetch(request)
}

/**
 * Determine URL type untuk routing strategy
 * @param {URL} url
 * @returns {string} 'api' | 'image' | 'other'
 */
export function getUrlType(url) {
  const pathname = url.pathname

  // API routes
  if (pathname.includes('/api/') || url.hostname === 'jsonplaceholder.typicode.com') {
    return 'api'
  }

  // Images
  if (/\.(png|jpg|jpeg|gif|svg|webp)$/i.test(pathname)) {
    return 'image'
  }

  return 'other'
}

/**
 * Get cache name untuk URL type
 * @param {string} urlType
 * @returns {string}
 */
export function getCacheName(urlType) {
  const cacheVersion = 'v1'

  switch (urlType) {
    case 'api':
      return `api-cache-${cacheVersion}`
    case 'image':
      return `image-cache-${cacheVersion}`
    default:
      return `other-cache-${cacheVersion}`
  }
}

/**
 * Delete old cache versions
 * @param {string} namePrefix - e.g. 'api-cache'
 * @param {string} keepVersion - e.g. 'v1'
 */
export async function deleteOldCaches(namePrefix, keepVersion) {
  const cacheNames = await caches.keys()
  const pattern = new RegExp(`^${namePrefix}-`)

  for (const name of cacheNames) {
    if (pattern.test(name) && !name.includes(keepVersion)) {
      console.log(`[SW] Deleting old cache: ${name}`)
      await caches.delete(name)
    }
  }
}