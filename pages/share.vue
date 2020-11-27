<template>
  <div>
    <img  v-for="image in images" :key="image.src" :src="image.src" alt="img" />
  </div>
</template>

<script>
import { getCachedMediaMetadata } from '@@/utils/getCachedMediaMetadata'

export default {
  data() {
    return {
      images: []
    }
  },

  async mounted() {
    const mimePrefix = 'image/'
    const cachedMediaMetadatas = await getCachedMediaMetadata(mimePrefix)
    console.log('share >> mounted >> cachedMediaMetadatas:', cachedMediaMetadatas)
    this.images = cachedMediaMetadatas

  }
}
</script>
