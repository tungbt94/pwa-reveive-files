const cacheName = 'pwa-receive-files'
const urlPrefix = '/_media/'
const shareUrl = ['/share']

self.addEventListener('fetch', event => {
  // if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
  //   return
  // }
  if (event.request.method !== 'POST') {
    if (caches.match(event.request))
      return event.respondWith(caches.match(event.request))
    return event.respondWith(fetch(event.request))
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
