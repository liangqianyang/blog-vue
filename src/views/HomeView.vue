<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { bannerApi, articleApi } from '@/api'
import type { Banner as BannerType, Article } from '@/types'

import AppSidebar from '@/components/layout/AppSidebar.vue'
import Banner from '@/components/home/Banner.vue'
import Headline from '@/components/home/Headline.vue'
import NewsTabs from '@/components/home/NewsTabs.vue'
import TopicList from '@/components/home/TopicList.vue'
import BlogList from '@/components/home/BlogList.vue'

const banners = ref<BannerType[]>([])
const headlines = ref<Article[]>([])
const articles = ref<Article[]>([])
const loading = ref(true)

onMounted(async () => {
  // 分别请求，互不影响
  try {
    const bannerData = await bannerApi.getList()
    banners.value = bannerData
  } catch (error) {
    console.error('Failed to load banner data:', error)
  }

  try {
    const headlineData = await articleApi.getTopRanked({ 
      limit: 2, 
      order_by: 'view_count' 
    })
    headlines.value = headlineData
  } catch (error) {
    console.error('Failed to load headline data:', error)
  }
  
  try {
    const articleData = await articleApi.getList({ page: 1, pageSize: 10 })
    articles.value = articleData.list
  } catch (error) {
    console.error('Failed to load article data:', error)
  }
  
  loading.value = false
})
</script>

<template>
  <article class="main-layout">
    <!-- 左侧主内容 -->
    <div class="main-content">
      <!-- 顶部区域：轮播图 + 头条 -->
      <div class="top-section">
        <div class="banner-box">
          <Banner :banners="banners" />
        </div>
        <div class="headline-box">
          <Headline :articles="headlines" />
        </div>
      </div>
      
      <!-- Tab 新闻 -->
      <NewsTabs />
      
      <!-- 精彩专题 -->
      <TopicList :articles="articles" />
      
      <!-- 广告位 -->
      <div class="ad white-bg">
        <img src="/images/longad.jpg" alt="广告">
      </div>
      
      <!-- 最新博文 -->
      <BlogList :articles="articles" />
    </div>
    
    <!-- 右侧边栏 -->
    <aside class="sidebar-wrapper">
      <AppSidebar />
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

.top-section {
  display: flex;
  gap: $spacing-lg;
  margin-bottom: $spacing-lg;
  
  @include respond-to('md') {
    flex-direction: column;
  }
}

.banner-box {
  width: 68.5%;
  flex-shrink: 0;
  
  @include respond-to('md') {
    width: 100%;
  }
}

.headline-box {
  flex: 1;
  
  @include respond-to('md') {
    width: 100%;
  }
}

.ad {
  @include card;
  
  img {
    width: 100%;
  }
}

.white-bg {
  @include card;
}
</style>
