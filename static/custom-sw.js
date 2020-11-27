const cacheName = 'pwa-receive-files'
const urlPrefix = '/_media/'
const shareUrl = '/share'

self.addEventListener('fetch', (event) => {
  console.log('event:', event)
  const isCacheType = ['image', 'video'].includes(event.request.destination)
  const loadFromCache = event.request.cache === 'default' && isCacheType
  if (loadFromCache) {
    return event.respondWith(caches.match(event.request))
  }
  if (event.request.method !== 'POST') {
    console.log('fetch(event.request):', fetch(event.request))
    return event.respondWith(fetch(event.request))
  }

  event.respondWith(
    (async () => {
      const formData = await event.request.formData()
      console.log('formData:', formData)
      const mediaFiles = formData.getAll('media')
      console.log('mediaFiles:', mediaFiles)

      const cache = await caches.open(cacheName)
      for (const mediaFile of mediaFiles) {
        if (!mediaFile.name) {
          console.log('No media file name')
          continue
        }

        const cacheKey = new URL(
          `${urlPrefix}${Date.now()}-${mediaFile.name}`,
          self.location
        ).href
        await cache.put(
          cacheKey,
          new Response(mediaFile, {
            headers: {
              'content-length': mediaFile.size,
              'content-type': mediaFile.type,
            },
          })
        )
      }

      const type = mediaFiles[0].type.split('/')[0]
      const shareEndpoint = `${shareUrl}/${type}`
      return Response.redirect(shareEndpoint, 303)
    })()
  )
})
