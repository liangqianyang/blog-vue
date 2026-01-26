<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { articleApi } from '@/api'
import type { Article, SidebarArticle } from '@/types'

const route = useRoute()

const article = ref<Article | null>(null)
const relatedArticles = ref<SidebarArticle[]>([])
const loading = ref(true)
const isLiked = ref(false)
const liking = ref(false)

const loadArticle = async () => {
  loading.value = true
  isLiked.value = false
  try {
    const id = parseInt(route.params.id as string)
    article.value = await articleApi.getDetail(id)
    relatedArticles.value = await articleApi.getRecommendList(4)
  } catch (error) {
    console.error('Failed to load article:', error)
  } finally {
    loading.value = false
  }
}

// 点赞/取消点赞
const toggleLike = async () => {
  if (!article.value || liking.value) return
  
  liking.value = true
  try {
    if (isLiked.value) {
      const result = await articleApi.unlike(article.value.id)
      article.value.likeCount = result.likeCount
      isLiked.value = false
    } else {
      const result = await articleApi.like(article.value.id)
      article.value.likeCount = result.likeCount
      isLiked.value = true
    }
  } catch (error) {
    console.error('点赞操作失败:', error)
  } finally {
    liking.value = false
  }
}

onMounted(() => {
  loadArticle()
})

watch(() => route.params.id, () => {
  loadArticle()
})
</script>

<template>
  <article class="main-layout">
    <div class="main-content">
      <div class="article-wrapper white-bg" v-if="article">
        <!-- 标题栏 -->
        <div class="article-header">
          <span class="category-tag">{{ article.category.name }}</span>
          <span class="breadcrumb">
            您现在的位置是：
            <router-link to="/">网站首页</router-link>&gt;
            <router-link :to="`/list/${article.category.slug}`">{{ article.category.name }}</router-link>
          </span>
        </div>
        
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        
        <!-- 文章信息 -->
        <div class="article-info">
          <i class="avatar">
            <img src="http://oss.lqy-comic.com/attachments/20260126_IhNbsOYBzBbZJxj7.jpg" alt="头像">
          </i>
          <span class="author">枫叶</span>
          <span class="date">{{ article.createTime }}</span>
          <span class="category">【<router-link :to="`/list/${article.category.id}`">{{ article.category.name }}</router-link>】</span>
          <span class="views">{{ article.viewCount || 0 }}人已围观</span>
        </div>
        
        <!-- 文章摘要 -->
        <div class="article-summary" v-if="article.summary">
          <b>简介</b>
          <p>{{ article.summary }}</p>
        </div>
        
        <!-- 文章内容 -->
        <div class="article-content" v-html="article.content"></div>
        
        <!-- 分享 -->
        <div class="share-box">
          本文链接：<a :href="`/article/${article.id}`">{{ `https://www.yangqq.com/article/${article.id}` }}</a>
        </div>
        
        <!-- 点赞 -->
        <div class="like-btn" :class="{ liked: isLiked, loading: liking }">
          <a href="javascript:;" @click="toggleLike">{{ isLiked ? '已点赞' : '点赞' }} ({{ article.likeCount || 0 }})</a>
        </div>
        
        <!-- 上一篇/下一篇 -->
        <ul class="other-links">
          <li>
            <router-link to="/article/1">上一篇：个人博客，属于我的小世界！</router-link>
          </li>
          <li>
            <router-link to="/article/2">下一篇：安静地做一个爱设计的女子</router-link>
          </li>
        </ul>
        
        <!-- 相似文章推荐 -->
        <div class="related-articles">
          <h3>相关文章</h3>
          <ul>
            <li v-for="item in relatedArticles" :key="item.id">
              <router-link :to="`/article/${item.id}`">
                <i v-if="item.cover"><img :src="item.cover" :alt="item.title"></i>
                <p>{{ item.title }}</p>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
      
      <!-- 加载中 -->
      <div v-else-if="loading" class="loading white-bg">
        加载中...
      </div>
    </div>
    
    <!-- 右侧边栏 -->
    <aside class="sidebar-wrapper">
      <!-- 广告 -->
      <div class="white-bg ad">
        <img src="/images/ad.jpg" alt="广告">
      </div>
      
      <!-- 猜你喜欢 -->
      <div class="white-bg text-list">
        <h2 class="section-title">猜你喜欢</h2>
        <ul>
          <li v-for="item in relatedArticles" :key="item.id">
            <router-link :to="`/article/${item.id}`">{{ item.title }}</router-link>
          </li>
        </ul>
      </div>
    </aside>
  </article>
</template>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.main-layout {
  width: $container-width;
  margin: 0 auto;
  padding-top: $spacing-lg;
  @include clearfix;
  
  @include respond-to('xl') {
    width: 100%;
    padding: $spacing-md;
  }
}

.main-content {
  width: $main-width;
  float: left;
  
  @include respond-to('lg') {
    width: 100%;
    float: none;
  }
}

.sidebar-wrapper {
  width: $sidebar-width;
  float: right;
  
  @include respond-to('lg') {
    width: 100%;
    float: none;
    margin-top: $spacing-lg;
  }
}

.article-wrapper {
  @include card;
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: $spacing-md;
  border-bottom: 1px solid $border-color;
  
  .category-tag {
    font-size: $font-size-md;
    color: $text-primary;
  }
}

.breadcrumb {
  font-size: $font-size-sm;
  color: $text-secondary;
  
  a {
    color: $text-secondary;
    
    &:hover {
      color: #000;
    }
  }
}

.article-title {
  font-size: 24px;
  font-weight: bold;
  margin: $spacing-lg 0 $spacing-md;
  line-height: 1.4;
  color: #333;
}

.article-info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: $spacing-sm;
  padding: $spacing-md 0;
  border-bottom: 1px solid $border-color;
  font-size: $font-size-sm;
  color: #888;
  
  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  .author {
    color: #333;
  }
  
  .category a {
    color: $warning;
    
    &:hover {
      color: $primary;
    }
  }
  
  .views {
    color: #999;
  }
}

.article-summary {
  background: $light-bg;
  padding: $spacing-md $spacing-lg;
  margin: $spacing-lg 0;
  border-left: 3px solid $primary;
  
  b {
    color: #333;
    margin-right: $spacing-sm;
  }
  
  p {
    display: inline;
    color: #666;
    line-height: 1.8;
  }
}

.article-content {
  line-height: 1.8;
  margin-top: $spacing-lg;
  
  :deep(p) {
    margin: $spacing-md 0;
  }
  
  :deep(a) {
    color: $primary;
    word-break: break-all;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  :deep(img) {
    max-width: 100%;
    margin: $spacing-sm auto;
  }
}

.share-box {
  padding: $spacing-sm $spacing-lg;
  background: $hover-bg;
  border-left: 3px solid #000;
  margin-top: $spacing-lg;
  
  a {
    color: $primary;
    word-break: break-all;
  }
}

.like-btn {
  text-align: center;
  margin: $spacing-lg 0;
  
  a {
    display: inline-block;
    padding: $spacing-sm $spacing-xl;
    background: #e2523a;
    color: $text-white;
    border-radius: $radius-sm;
    box-shadow: 1px 2px 6px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    
    &:hover {
      background: color.adjust(#e2523a, $lightness: -10%);
      color: $text-white;
    }
  }
  
  &.liked a {
    background: #999;
  }
  
  &.loading a {
    opacity: 0.6;
    pointer-events: none;
  }
}

.other-links {
  margin: $spacing-sm 0;
  
  li {
    line-height: 26px;
    @include list-dot;
    
    a {
      &:hover {
        text-decoration: underline;
        color: #000;
      }
    }
  }
}

.related-articles {
  margin-top: $spacing-lg;
  
  h3 {
    font-size: $font-size-md;
    margin-bottom: $spacing-md;
    padding-bottom: $spacing-sm;
    border-bottom: 1px solid $border-color;
  }
  
  ul {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-sm;
  }
  
  li {
    width: calc(25% - #{$spacing-sm});
    overflow: hidden;
    
    @include respond-to('md') {
      width: calc(50% - #{$spacing-sm});
    }
    
    a {
      display: block;
      box-shadow: $shadow-sm;
      padding-bottom: $spacing-sm;
    }
    
    i {
      display: block;
      height: 120px;
      overflow: hidden;
      margin-bottom: $spacing-sm;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: $transition-slow;
      }
    }
    
    &:hover i img {
      transform: scale(1.1);
    }
    
    p {
      font-weight: bold;
      padding: 0 8px;
      @include text-ellipsis;
    }
  }
}

.white-bg {
  @include card;
}

.section-title {
  @include section-title;
}

.ad img {
  width: 100%;
}

.text-list {
  li {
    line-height: 22px;
    margin-bottom: $spacing-sm;
    @include list-dot;
  }
}

.loading {
  text-align: center;
  padding: 60px 0;
  color: $text-muted;
}
</style>
