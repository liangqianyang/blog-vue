<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isVisible = ref(false)

const checkScroll = () => {
  isVisible.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', checkScroll)
  checkScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll)
})
</script>

<template>
  <Transition name="fade">
    <button 
      v-if="isVisible"
      class="back-to-top"
      @click="scrollToTop"
      title="返回顶部"
    >
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
      </svg>
    </button>
  </Transition>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.back-to-top {
  position: fixed;
  right: 20px;
  bottom: 10%;
  width: 40px;
  height: 40px;
  background: #000 url('/images/top.png') no-repeat center;
  background-size: 20px;
  border-radius: $radius-sm;
  cursor: pointer;
  transition: $transition-base;
  z-index: $z-fixed;
  @include flex-center;
  color: $text-white;
  
  svg {
    display: none;
  }
  
  &:hover {
    background-color: $primary;
  }
  
  @include respond-to('md') {
    right: 10px;
    bottom: 20px;
  }
}
</style>
