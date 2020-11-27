const cacheName = 'pwa-receive-files'

async function _getCachedMediaMetadata() {
  const cache = await caches.open(cacheName)
  const requests = await cache.keys()
  return Promise.all(
    requests.reverse().map(async (request) => {
      const response = await cache.match(request)
      const responseBlob = await response.blob()
      const size = responseBlob.size
      return {
        size,
        contentType: response.headers.get('content-type'),
        src: request.url,
      }
    })
  )
}

export const cachedMediaMetadataPromise = _getCachedMediaMetadata()

export async function getCachedMediaMetadata(contentTypePrefix) {
  const cachedMetadata = await cachedMediaMetadataPromise
  const filteredCachedMetadata = cachedMetadata.filter((metadata) =>
    metadata.contentType.startsWith(contentTypePrefix)
  )
  return filteredCachedMetadata
}

export async function getCachedMediaMetadataForURL(url) {
  const cachedMetadata = await cachedMediaMetadataPromise
  return cachedMetadata.find((metadata) => metadata.src === url)
}
