<template>
  <div>
    <img v-if="type === 'image'" :src="media.src" alt="img" />
    <video
      v-if="type === 'video'"
      :src="media.src"
      width="360"
      controls
      autoplay
    />
  </div>
</template>

<script>
import { getCachedMediaMetadata } from '@@/utils/getCachedMediaMetadata'

export default {
  data() {
    return {
      media: '',
      type: '',
    }
  },

  async mounted() {
    const mimePrefix = this.$route.params.slug
    this.type = mimePrefix
    const cachedMediaMetadatas = await getCachedMediaMetadata(mimePrefix)
    this.media = cachedMediaMetadatas[0]
  },
}
</script>
