const cacheName = 'pwa-receive-files'
const urlPrefix = '/_media/'
const shareUrl = ['/share']

self.addEventListener('fetch', event => {
  if (event.request.method !== 'POST') {
    event.respondWith(fetch(event.request))
    return
  }

  console.log('event:', event)

  event.respondWith((async () => {
    const formData = await event.request.formData()
    console.log('formData:', formData)
    const mediaFiles = formData.getAll('media')
    console.log('mediaFiles:', mediaFiles)

    const cache = await caches.open(cacheName)
    for (const mediaFile of mediaFiles) {
      if (!mediaFile.name) {
        console.log('No media file name')
        continue;
      }

      const cacheKey = new URL(`${urlPrefix}${Date.now()}-${mediaFile.name}`, self.location).href
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
    return Response.redirect(shareUrl, 303)
  })())
})