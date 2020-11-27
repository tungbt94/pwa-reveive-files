const cacheName = 'pwa-receive-files'

async function _getCachedMediaMetadata() {
  console.log('_getCachedMediaMetadata >> caches:', caches)
  const cache = await caches.open(cacheName)
  console.log('_getCachedMediaMetadata >> cache:', cache)
  const requests = await cache.keys()
  console.log('_getCachedMediaMetadata >> requests:', requests)
  return Promise.all(requests.reverse().map(async (request) => {
    console.log('_getCachedMediaMetadata >> request:', request)
    const response = await cache.match(request)
    console.log('_getCachedMediaMetadata >> response:', response)
    const responseBlob = await response.blob()
    console.log('_getCachedMediaMetadata >> responseBlob:', responseBlob)
    const size = responseBlob.size
    console.log('_getCachedMediaMetadata >> size:', size)
    return {
      size,
      contentType: response.headers.get('content-type'),
      src: request.url,
    }
  }))
}

export const cachedMediaMetadataPromise = _getCachedMediaMetadata()

export async function getCachedMediaMetadata(contentTypePrefix) {
  console.log('getCachedMediaMetadata >> contentTypePrefix:', contentTypePrefix)
  const cachedMetadata = await cachedMediaMetadataPromise
  console.log('getCachedMediaMetadata >> cachedMetadata:', cachedMetadata)
  const filteredCachedMetadata = cachedMetadata.filter((metadata) =>  metadata.contentType.startsWith(contentTypePrefix))
  console.log('getCachedMediaMetadata >> filteredCachedMetadata:', filteredCachedMetadata)
  return filteredCachedMetadata
}

export async function getCachedMediaMetadataForURL(url) {
  const cachedMetadata = await cachedMediaMetadataPromise
  return cachedMetadata.find((metadata) => metadata.src === url)
}
