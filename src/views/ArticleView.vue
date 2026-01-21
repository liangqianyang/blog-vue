<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { articleApi } from '@/api'
import type { Article, SidebarArticle } from '@/types'

const route = useRoute()

const article = ref<Article | null>(null)
const relatedArticles = ref<SidebarArticle[]>([])
const loading = ref(true)

const loadArticle = async () => {
  loading.value = true
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
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        
        <!-- 面包屑导航 -->
        <div class="breadcrumb">
          <router-link to="/">首页</router-link> &gt;
          <router-link :to="`/list/${article.category.slug}`">{{ article.category.name }}</router-link> &gt;
          <span>正文</span>
        </div>
        
        <!-- 文章信息 -->
        <div class="article-info">
          <b>作者：</b>{{ article.author.name }}
          <b>发布时间：</b>{{ article.createTime }}
          <b>分类：</b>
          <router-link :to="`/list/${article.category.slug}`">{{ article.category.name }}</router-link>
        </div>
        
        <!-- 文章内容 -->
        <div class="article-content" v-html="article.content"></div>
        
        <!-- 分享 -->
        <div class="share-box">
          本文链接：<a :href="`/article/${article.id}`">{{ `https://www.yangqq.com/article/${article.id}` }}</a>
        </div>
        
        <!-- 点赞 -->
        <div class="like-btn">
          <a href="javascript:;">点赞 ({{ Math.floor(Math.random() * 100) }})</a>
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

.article-title {
  font-size: $font-size-xl;
  margin-top: $spacing-lg;
  line-height: 1.4;
}

.breadcrumb {
  float: right;
  font-size: $font-size-sm;
  color: $text-secondary;
  
  a {
    color: $text-secondary;
    
    &:hover {
      color: #000;
    }
  }
}

.article-info {
  color: #888;
  border: 1px solid #f3f3f3;
  padding: $spacing-sm;
  margin: $spacing-sm auto 0;
  line-height: 23px;
  background: $light-bg;
  
  b {
    margin-right: $spacing-sm;
    color: #000;
  }
  
  a {
    color: $success;
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
    
    &:hover {
      background: color.adjust(#e2523a, $lightness: -10%);
      color: $text-white;
    }
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
