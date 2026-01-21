<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  src: string
  alt?: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  placeholder: '/images/avatar.jpg'
})

const imgRef = ref<HTMLImageElement | null>(null)
const isLoaded = ref(false)
const isError = ref(false)
const currentSrc = ref(props.placeholder)

let observer: IntersectionObserver | null = null

const loadImage = () => {
  const img = new Image()
  img.src = props.src
  
  img.onload = () => {
    currentSrc.value = props.src
    isLoaded.value = true
  }
  
  img.onerror = () => {
    isError.value = true
  }
}

onMounted(() => {
  if (!imgRef.value) return
  
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadImage()
          observer?.unobserve(entry.target)
        }
      })
    },
    {
      rootMargin: '50px 0px',
      threshold: 0.1
    }
  )
  
  observer.observe(imgRef.value)
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <img
    ref="imgRef"
    :src="currentSrc"
    :alt="alt"
    :class="{ loaded: isLoaded, error: isError }"
    loading="lazy"
  />
</template>

<style lang="scss" scoped>
img {
  transition: opacity 0.3s ease;
  
  &:not(.loaded) {
    opacity: 0.5;
    filter: blur(5px);
  }
  
  &.loaded {
    opacity: 1;
    filter: none;
  }
  
  &.error {
    opacity: 0.3;
  }
}
</style>
