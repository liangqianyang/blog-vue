<script setup lang="ts">
import type { Article } from '@/types'

interface Props {
  articles: Article[]
  showTitle?: boolean
}

withDefaults(defineProps<Props>(), {
  showTitle: true
})
</script>

<template>
  <div class="blog-list white-bg">
    <h2 v-if="showTitle" class="section-title">最新博文</h2>
    
    <ul>
      <li v-for="article in articles" :key="article.id" :class="{ 'has-images': article.images }">
        <!-- 文章标题 -->
        <h3 class="blog-title">
          <router-link :to="`/article/${article.id}`" target="_blank">
            <b v-if="article.isTop">【顶】</b>
            {{ article.title }}
          </router-link>
        </h3>
        
        <!-- 多图模式 -->
        <template v-if="article.images && article.images.length > 1">
          <span class="image-list">
            <router-link 
              v-for="(img, index) in article.images.slice(0, 4)" 
              :key="index"
              :to="`/article/${article.id}`"
            >
              <img :src="img" :alt="article.title">
            </router-link>
          </span>
        </template>
        
        <!-- 单图模式 -->
        <template v-else-if="article.cover">
          <span class="blog-pic img-scale">
            <i><router-link :to="`/list/${article.category.slug}`">{{ article.category.name }}</router-link></i>
            <router-link :to="`/article/${article.id}`">
              <img :src="article.cover" :alt="article.title">
            </router-link>
          </span>
        </template>
        
        <!-- 文章摘要 -->
        <p class="blog-text">{{ article.summary }}</p>
        
        <!-- 文章信息 -->
        <p class="blog-info">
          <i class="avatar">
            <img :src="article.author.avatar" :alt="article.author.name">
          </i>
          <span>{{ article.author.name }}</span>
          <span>{{ article.createTime }}</span>
          <span>【<router-link :to="`/list/${article.category.slug}`">{{ article.category.name }}</router-link>】</span>
        </p>
        
        <!-- 阅读更多按钮 -->
        <router-link 
          v-if="!article.images || article.images.length <= 1"
          :to="`/article/${article.id}`" 
          class="view-more"
        >
          阅读更多
        </router-link>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.blog-list {
  @include card;
  
  ul {
    padding: $spacing-sm 0 0;
  }
  
  li {
    overflow: hidden;
    margin-bottom: $spacing-lg;
    border-bottom: 1px dashed $border-color;
    padding-bottom: $spacing-lg;
    position: relative;
    min-height: 120px;
    
    &:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }
  }
}

.section-title {
  @include section-title;
}

.blog-title {
  margin-bottom: $spacing-sm;
  font-size: $font-size-lg;
  
  a {
    &:hover {
      color: $info;
    }
  }
  
  b {
    color: $danger;
  }
}

// 多图模式
.image-list {
  display: flex;
  gap: $spacing-sm;
  margin-bottom: $spacing-sm;
  
  a {
    flex: 1;
    overflow: hidden;
    border-radius: $radius-sm;
    
    img {
      width: 100%;
      height: 140px;
      object-fit: cover;
      transition: $transition-slow;
      
      @include respond-to('md') {
        height: 100px;
      }
      
      @include respond-to('sm') {
        height: 80px;
      }
    }
    
    &:hover img {
      transform: scale(1.05);
    }
  }
}

// 单图模式
.blog-pic {
  float: left;
  width: 23.2%;
  margin-right: $spacing-lg;
  overflow: hidden;
  border-radius: $radius-sm;
  position: relative;
  
  @include respond-to('md') {
    width: 35%;
  }
  
  @include respond-to('sm') {
    width: 100%;
    float: none;
    margin-right: 0;
    margin-bottom: $spacing-sm;
  }
  
  i {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9;
    font-style: normal;
    padding: 3px 5px;
    background: rgba(18, 182, 221, 0.8);
    font-size: $font-size-sm;
    
    a {
      color: $text-white;
    }
  }
  
  img {
    width: 100%;
    transition: $transition-slow;
  }
}

.img-scale:hover img {
  transform: scale(1.1);
}

.blog-text {
  font-size: $font-size-sm;
  color: $text-secondary;
  @include text-clamp(3);
  margin-top: $spacing-lg;
}

.has-images .blog-text {
  margin-top: 0;
}

.blog-info {
  margin-top: $spacing-lg;
  overflow: hidden;
  color: $text-muted;
  line-height: 34px;
  
  span {
    margin: 0 5px;
    
    a {
      color: $success;
    }
  }
}

.avatar {
  @include avatar(30px);
  float: left;
  margin-right: $spacing-sm;
  
  &::after {
    content: "";
    position: absolute;
    background: url('/images/v.png') no-repeat;
    background-size: 12px;
    width: 12px;
    height: 12px;
    right: 0;
    bottom: 0;
  }
}

.view-more {
  display: block;
  position: absolute;
  right: $spacing-sm;
  bottom: $spacing-lg;
  padding: 3px $spacing-sm;
  background: $primary-light;
  color: $text-white;
  border-radius: $radius-sm;
  
  &:hover {
    background: $primary;
    color: $text-white;
  }
}

.white-bg {
  @include card;
}
</style>
