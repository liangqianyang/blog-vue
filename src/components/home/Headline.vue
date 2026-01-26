<script setup lang="ts">
import type { Article } from '@/types'

interface Props {
  articles: Article[]
}

defineProps<Props>()
</script>

<template>
  <div class="headline">
    <ul>
      <li v-for="article in articles" :key="article.id">
        <router-link :to="`/article/${article.id}`" :title="article.title">
          <img :src="article.cover" :alt="article.title">
          <span>{{ article.title }}</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.headline {
  width: 100%;
  overflow: hidden;
  
  ul {
    height: 260px;
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    
    @include respond-to('md') {
      height: auto;
      flex-direction: row;
    }
  }
  
  li {
    flex: 1;
    background: #000;
    overflow: hidden;
    border-radius: $radius-sm;
    position: relative;
    
    @include respond-to('md') {
      height: 120px;
    }
    
    a {
      display: block;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.7;
      transition: $transition-slow;
    }
    
    &:hover img {
      transform: scale(1.1);
      opacity: 1;
    }
    
    span {
      position: absolute;
      top: 30%;
      left: 0;
      right: 0;
      color: $text-white;
      text-align: center;
      font-size: $font-size-base;
      padding: 0 40px;
      @include text-clamp(2);
      line-height: 24px;
      
      @include respond-to('md') {
        top: 50%;
        transform: translateY(-50%);
        font-size: $font-size-sm;
        padding: 0 $spacing-sm;
      }
    }
  }
}
</style>
