<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import type { Banner } from '@/types'

interface Props {
  banners: Banner[]
  autoPlay?: boolean
  interval?: number
}

const props = withDefaults(defineProps<Props>(), {
  autoPlay: true,
  interval: 4000
})

const currentIndex = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

const goToSlide = (index: number) => {
  currentIndex.value = index
}

const prevSlide = () => {
  currentIndex.value = currentIndex.value === 0 
    ? props.banners.length - 1 
    : currentIndex.value - 1
}

const nextSlide = () => {
  currentIndex.value = currentIndex.value === props.banners.length - 1 
    ? 0 
    : currentIndex.value + 1
}

const startAutoPlay = () => {
  stopAutoPlay() // 先清除旧的定时器
  if (props.autoPlay && props.banners.length > 1) {
    timer = setInterval(nextSlide, props.interval)
  }
}

const stopAutoPlay = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

// 监听 banners 变化，当数据加载后启动自动播放
watch(() => props.banners, (newBanners) => {
  if (newBanners && newBanners.length > 0) {
    currentIndex.value = 0
    startAutoPlay()
  }
}, { immediate: true })

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<template>
  <div 
    class="banner"
    @mouseenter="stopAutoPlay"
    @mouseleave="startAutoPlay"
  >
    <div class="banner-wrapper">
      <TransitionGroup name="fade">
        <template v-for="(banner, index) in banners" :key="banner.id">
          <div
            v-if="index === currentIndex"
            class="slide"
          >
            <a v-if="banner.link" :href="banner.link" target="_blank">
              <img :src="banner.image" :alt="banner.title">
            </a>
            <img v-else :src="banner.image" :alt="banner.title">
          </div>
        </template>
      </TransitionGroup>
      
      <!-- 控制按钮 -->
      <div class="controls">
        <button class="prev" @click="prevSlide">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>
        <button class="next" @click="nextSlide">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
        </button>
      </div>
      
      <!-- 分页点 -->
      <ul class="pager">
        <li 
          v-for="(_, index) in banners"
          :key="index"
          :class="{ active: index === currentIndex }"
          @click="goToSlide(index)"
        ></li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.banner {
  width: 100%;
  overflow: hidden;
  border-radius: $radius-sm;
}

.banner-wrapper {
  position: relative;
  width: 100%;
  height: 260px;
  overflow: hidden;
  
  @include respond-to('md') {
    height: 200px;
  }
  
  @include respond-to('sm') {
    height: 150px;
  }
}

.slide {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  
  a {
    display: block;
    width: 100%;
    height: 100%;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.controls {
  button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    @include flex-center;
    background: rgba(0, 0, 0, 0.3);
    color: $text-white;
    cursor: pointer;
    opacity: 0;
    transition: $transition-base;
    border-radius: $radius-sm;
    
    &:hover {
      background: rgba(0, 0, 0, 0.5);
    }
  }
  
  .prev {
    left: 20px;
  }
  
  .next {
    right: 20px;
  }
  
  .banner:hover & button {
    opacity: 0.7;
  }
}

.pager {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 14px;
  z-index: 4;
  
  li {
    width: 10px;
    height: 10px;
    background: $text-white;
    border-radius: $radius-full;
    opacity: 0.9;
    cursor: pointer;
    transition: $transition-base;
    
    &:hover,
    &.active {
      opacity: 1;
      background: $primary;
    }
  }
}

// 淡入淡出动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
