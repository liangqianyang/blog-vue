<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores'

const router = useRouter()
const appStore = useAppStore()

const keyword = ref('')

const handleSearch = () => {
  if (keyword.value.trim()) {
    router.push({
      path: '/list',
      query: { keyword: keyword.value.trim() }
    })
    appStore.toggleSearch()
    keyword.value = ''
  }
}

const closeSearch = () => {
  appStore.toggleSearch()
}
</script>

<template>
  <div class="search-box">
    <div class="search-content">
      <form @submit.prevent="handleSearch" class="search-form">
        <input 
          v-model="keyword"
          type="text" 
          class="search-input"
          placeholder="请输入关键字词"
          autofocus
        >
        <button type="submit" class="search-btn">搜索</button>
      </form>
    </div>
    <button class="search-close" @click="closeSearch">
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
      </svg>
    </button>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.search-box {
  width: $container-width;
  margin: 0 auto;
  padding: $spacing-lg;
  background: $white-bg;
  position: relative;
  
  @include respond-to('xl') {
    width: 100%;
  }
}

.search-content {
  max-width: 600px;
  margin: 0 auto;
}

.search-form {
  display: flex;
  border: 1px solid #ccc;
  border-radius: $radius-md;
  overflow: hidden;
}

.search-input {
  flex: 1;
  padding: $spacing-sm $spacing-md;
  font-size: $font-size-base;
  border: none;
  outline: none;
  
  &::placeholder {
    color: $text-muted;
  }
}

.search-btn {
  padding: $spacing-sm $spacing-lg;
  background: $dark-bg;
  color: $text-white;
  cursor: pointer;
  transition: $transition-base;
  
  &:hover {
    background: color.adjust($dark-bg, $lightness: 10%);
  }
}

.search-close {
  position: absolute;
  top: $spacing-sm;
  right: $spacing-sm;
  width: 30px;
  height: 30px;
  @include flex-center;
  color: $text-secondary;
  cursor: pointer;
  transition: $transition-base;
  
  &:hover {
    color: $text-primary;
  }
}
</style>
