<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import BackToTop from '@/components/common/BackToTop.vue'

// 禁止复制
const preventCopy = (e: Event) => {
  e.preventDefault()
  return false
}

const preventContextMenu = (e: MouseEvent) => {
  e.preventDefault()
  return false
}

onMounted(() => {
  document.addEventListener('copy', preventCopy)
  document.addEventListener('cut', preventCopy)
  document.addEventListener('contextmenu', preventContextMenu)
})

onUnmounted(() => {
  document.removeEventListener('copy', preventCopy)
  document.removeEventListener('cut', preventCopy)
  document.removeEventListener('contextmenu', preventContextMenu)
})
</script>

<template>
  <div id="app">
    <AppHeader />
    
    <main class="main-wrapper">
      <router-view v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </router-view>
    </main>
    
    <AppFooter />
    <BackToTop />
  </div>
</template>

<style lang="scss">
@use '@/assets/styles/variables' as *;

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.main-wrapper {
  flex: 1;
}
</style>
