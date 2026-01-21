<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import BackToTop from '@/components/common/BackToTop.vue'
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
}

.main-wrapper {
  flex: 1;
}
</style>
