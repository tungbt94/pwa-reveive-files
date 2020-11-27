<template>
  <div>
    Share page
  </div>
</template>

<script>
import { getCachedMediaMetadata } from '@@/utils/getCachedMediaMetadata'

export default {
  async mounted() {
    const mimePrefix = 'image/'
    const cachedMediaMetadataPromise = getCachedMediaMetadata(mimePrefix)
    console.log('share >> mounted >> cachedMediaMetadataPromise:', cachedMediaMetadataPromise)
    const cachedMediaMetadatas = await cachedMediaMetadataPromise()
    console.log('share >> mounted >> cachedMediaMetadatas:', cachedMediaMetadatas)
  }
}
</script>
