<script setup lang="ts">
import type { Article } from '@/types'

interface Props {
  articles: Article[]
}

defineProps<Props>()

const categories = ['原创模板', '古典', '清新', '低调']
</script>

<template>
  <div class="topic-list white-bg">
    <h2 class="section-title">
      <span class="nav-links">
        <a v-for="cat in categories" :key="cat" href="/">{{ cat }}</a>
      </span>
      精彩专题
    </h2>
    
    <ul class="topic-grid">
      <li v-for="article in articles.slice(0, 6)" :key="article.id">
        <router-link :to="`/article/${article.id}`" class="topic-pic img-scale">
          <img :src="article.cover" :alt="article.title">
        </router-link>
        <b>{{ article.title }}</b>
        <span>{{ article.summary }}</span>
        <router-link :to="`/article/${article.id}`" class="read-more">文章阅读</router-link>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.topic-list {
  @include card;
}

.section-title {
  @include section-title;
}

.nav-links {
  float: right;
  
  a {
    display: inline-block;
    margin-right: $spacing-sm;
    padding-right: $spacing-sm;
    position: relative;
    
    &::after {
      content: "/";
      position: absolute;
      right: -5px;
      color: #ccc;
    }
    
    &:last-child::after {
      content: "";
    }
    
    &:hover {
      color: $primary;
    }
  }
}

.topic-grid {
  display: flex;
  flex-wrap: wrap;
  padding: $spacing-sm 0 $spacing-lg $spacing-sm;
  position: relative;
  
  &::before {
    content: "";
    position: absolute;
    background: $white-bg;
    width: 1px;
    height: 100%;
    left: $spacing-sm;
  }
  
  &::after {
    content: "";
    position: absolute;
    background: $white-bg;
    width: 100%;
    height: 1px;
    bottom: $spacing-lg;
    left: 0;
  }
  
  li {
    width: calc(33.33% - #{$spacing-lg});
    border-bottom: 1px solid $border-color;
    border-left: 1px solid $border-color;
    overflow: hidden;
    padding: $spacing-lg;
    transition: $transition-slow;
    
    @include respond-to('lg') {
      width: calc(50% - #{$spacing-lg});
    }
    
    @include respond-to('sm') {
      width: 100%;
    }
    
    &:hover {
      background: $white-bg;
      box-shadow: $shadow-card;
    }
  }
}

.topic-pic {
  width: 100%;
  height: 100px;
  overflow: hidden;
  border-radius: $radius-sm;
  background: #ccc;
  display: block;
  margin-bottom: $spacing-sm;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: $transition-slow;
  }
}

.img-scale:hover img {
  transform: scale(1.05);
}

li b {
  display: block;
  width: 100%;
  height: 30px;
  line-height: 30px;
  margin: $spacing-sm 0;
  @include text-ellipsis;
}

li span {
  color: $text-muted;
  @include text-clamp(3);
  font-size: $font-size-sm;
  height: 62px;
  display: block;
}

.read-more {
  margin-top: $spacing-sm;
  color: $success;
  display: block;
  
  &::before {
    content: "+";
    color: color.adjust($success, $lightness: -10%);
    margin-right: 2px;
  }
  
  &:hover {
    color: #000;
  }
}

.white-bg {
  @include card;
}
</style>
