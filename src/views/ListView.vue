<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { articleApi, tagApi } from '@/api'
import type { Article, Tag } from '@/types'

import BlogList from '@/components/home/BlogList.vue'
import Pagination from '@/components/common/Pagination.vue'

const route = useRoute()

const articles = ref<Article[]>([])
const tags = ref<Tag[]>([])
const loading = ref(true)
const currentPage = ref(1)
const totalPages = ref(1)
const total = ref(0)
const pageSize = 10

const categoryName = computed(() => {
  const category = route.params.category as string
  const categoryMap: Record<string, string> = {
    diary: '个人博客日记',
    web: '博客网站制作',
    design: '网页设计心得',
    tools: '推荐工具',
    js: 'JS经典实例',
    build: '网站建设',
    css: 'CSS3|Html5',
    notes: '心得笔记'
  }
  return categoryMap[category] || '文章列表'
})

const categoryDesc = computed(() => {
  return '个人博客日记，记录一些优秀个人站长是如何制作个人博客，建个人博客、以及经营个人网站的，本站还会推荐一些优秀的个人博客站长网站。'
})

const loadArticles = async () => {
  loading.value = true
  try {
    const category = route.params.category as string
    // keyword can be used for search filtering in the future
    const _keyword = route.query.keyword as string
    void _keyword // suppress unused variable warning
    
    const data = await articleApi.getList({
      category,
      page: currentPage.value,
      pageSize
    })
    
    articles.value = data.list
    total.value = data.total
    totalPages.value = Math.ceil(data.total / pageSize)
  } catch (error) {
    console.error('Failed to load articles:', error)
  } finally {
    loading.value = false
  }
}

const loadTags = async () => {
  try {
    tags.value = await tagApi.getList()
  } catch (error) {
    console.error('Failed to load tags:', error)
  }
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  loadArticles()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  loadArticles()
  loadTags()
})

watch(() => route.params.category, () => {
  currentPage.value = 1
  loadArticles()
})

watch(() => route.query.keyword, () => {
  currentPage.value = 1
  loadArticles()
})
</script>

<template>
  <article class="main-layout">
    <!-- 左侧主内容 -->
    <div class="main-content">
      <!-- 栏目介绍 -->
      <div class="category-intro white-bg">
        <img src="/images/lm01.jpg" alt="栏目图片">
        <h1>{{ categoryName }}</h1>
        <p>{{ categoryDesc }}</p>
      </div>
      
      <!-- 文章列表 -->
      <BlogList :articles="articles" :show-title="true" />
      
      <!-- 分页 -->
      <Pagination 
        :current-page="currentPage"
        :total-pages="totalPages"
        :total="total"
        @update:current-page="handlePageChange"
      />
    </div>
    
    <!-- 右侧边栏 -->
    <aside class="sidebar-wrapper">
      <!-- 点击排行 -->
      <div class="white-bg ranking">
        <h2 class="section-title">点击排行</h2>
        <div class="top-news img-scale">
          <router-link to="/article/1">
            <img src="/images/h1.jpg" alt="">
            <span>6条网页设计配色原则,让你秒变配色高手</span>
          </router-link>
        </div>
        <ul>
          <li v-for="(article, index) in articles.slice(0, 8)" :key="article.id">
            <i>{{ index + 1 }}</i>
            <router-link :to="`/article/${article.id}`">{{ article.title }}</router-link>
          </li>
        </ul>
      </div>
      
      <!-- 本栏推荐 -->
      <div class="white-bg recommend">
        <h2 class="section-title">本栏推荐</h2>
        <div class="top-news img-scale">
          <router-link to="/article/2">
            <img src="/images/h2.jpg" alt="">
            <span>6条网页设计配色原则,让你秒变配色高手</span>
          </router-link>
        </div>
        <ul>
          <li v-for="article in articles.slice(0, 7)" :key="article.id">
            <router-link :to="`/article/${article.id}`">
              <i v-if="article.cover">
                <img :src="article.cover" :alt="article.title">
              </i>
              <p>{{ article.title }}</p>
            </router-link>
          </li>
        </ul>
      </div>
      
      <!-- 广告 -->
      <div class="white-bg ad img-scale">
        <a href="/"><img src="/images/ad.jpg" alt="广告"></a>
      </div>
      
      <!-- 标签云 -->
      <div class="white-bg cloud">
        <h2 class="section-title">标签云</h2>
        <ul>
          <a 
            v-for="tag in tags" 
            :key="tag.id" 
            href="/"
            :style="{ background: tag.color }"
          >
            {{ tag.name }}
          </a>
        </ul>
      </div>
    </aside>
  </article>
</template>

<style lang="scss" scoped>
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

.category-intro {
  @include card;
  @include clearfix;
  
  img {
    height: 100px;
    float: left;
    margin-right: $spacing-lg;
    
    @include respond-to('sm') {
      float: none;
      width: 100%;
      height: auto;
      margin-right: 0;
      margin-bottom: $spacing-md;
    }
  }
  
  h1 {
    font-size: $font-size-xl;
    margin-bottom: $spacing-md;
  }
  
  p {
    color: $text-secondary;
  }
}

.white-bg {
  @include card;
}

.section-title {
  @include section-title;
}

// 排行榜
.ranking {
  ul {
    overflow: hidden;
  }
  
  li {
    height: 30px;
    line-height: 30px;
    margin-bottom: $spacing-sm;
    padding-left: 5px;
    @include text-ellipsis;
    
    &:nth-child(even) {
      background: $light-bg;
    }
    
    i {
      display: inline-block;
      width: 16px;
      height: 16px;
      background: #b1b1b1;
      margin-right: $spacing-sm;
      font-style: normal;
      font-size: 9px;
      color: $text-white;
      line-height: 16px;
      text-align: center;
      vertical-align: middle;
    }
    
    &:nth-child(-n+3) i {
      background: $warning;
    }
  }
}

// 顶部新闻
.top-news {
  display: block;
  margin: $spacing-lg 0;
  background: #000;
  position: relative;
  overflow: hidden;
  border-radius: $radius-sm;
  max-height: 110px;
  
  img {
    opacity: 0.7;
    width: 100%;
    transition: $transition-slow;
  }
  
  span {
    position: absolute;
    bottom: 30%;
    left: 0;
    right: 0;
    color: $text-white;
    text-align: center;
    font-size: $font-size-base;
    padding: 0 40px;
    @include text-clamp(2);
    line-height: 22px;
  }
  
  &:hover img {
    opacity: 0.9;
    transform: scale(1.1);
  }
}

// 推荐
.recommend {
  ul {
    padding-top: $spacing-sm;
  }
  
  li {
    overflow: hidden;
    margin-bottom: $spacing-sm;
    height: 60px;
    
    &:hover {
      background: $light-bg;
    }
    
    a {
      display: flex;
      align-items: flex-start;
    }
    
    i {
      width: 70px;
      height: 60px;
      margin-right: $spacing-sm;
      overflow: hidden;
      flex-shrink: 0;
      
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
      margin-top: $spacing-sm;
      line-height: 20px;
      max-height: 40px;
      @include text-clamp(2);
      font-size: $font-size-sm;
    }
  }
}

// 广告
.ad {
  border-radius: $radius-sm;
  
  img {
    width: 100%;
  }
}

.img-scale {
  @include img-scale;
}

// 标签云
.cloud {
  ul {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-xs;
    margin-top: $spacing-sm;
  }
  
  a {
    line-height: 24px;
    padding: 3px $spacing-sm;
    border-radius: $radius-sm;
    color: $text-white;
    font-size: $font-size-sm;
    transition: $transition-slow;
    
    &:hover {
      border-radius: 0;
      text-shadow: #000 1px 1px 1px;
    }
  }
}
</style>
