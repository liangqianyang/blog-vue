<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { articleApi } from '@/api'
import type { Article } from '@/types'

import Pagination from '@/components/common/Pagination.vue'

const articles = ref<Article[]>([])
const loading = ref(true)
const currentPage = ref(1)
const totalPages = ref(1)
const total = ref(0)
const pageSize = 20

// 按日期分组
const groupedArticles = ref<Record<string, Article[]>>({})

const loadArticles = async () => {
  loading.value = true
  try {
    const data = await articleApi.getList({
      page: currentPage.value,
      pageSize
    })
    
    articles.value = data.list
    total.value = data.total
    totalPages.value = Math.ceil(data.total / pageSize)
    
    // 按日期分组
    groupedArticles.value = articles.value.reduce((acc, article) => {
      const date = article.createTime
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(article)
      return acc
    }, {} as Record<string, Article[]>)
  } catch (error) {
    console.error('Failed to load articles:', error)
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  loadArticles()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  loadArticles()
})
</script>

<template>
  <article class="main-layout">
    <div class="timeline-wrapper white-bg">
      <h2 class="page-title">时间轴</h2>
      
      <div class="timeline">
        <template v-for="(items, date) in groupedArticles" :key="date">
          <div class="timeline-date">
            <span>{{ date }}</span>
          </div>
          <ul class="timeline-items">
            <li v-for="article in items" :key="article.id">
              <i>
                <router-link :to="`/article/${article.id}`">{{ article.title }}</router-link>
              </i>
            </li>
          </ul>
        </template>
      </div>
      
      <!-- 分页 -->
      <Pagination 
        :current-page="currentPage"
        :total-pages="totalPages"
        :total="total"
        @update:current-page="handlePageChange"
      />
    </div>
  </article>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.main-layout {
  width: $container-width;
  margin: 0 auto;
  padding: $spacing-lg 0;
  
  @include respond-to('xl') {
    width: 100%;
    padding: $spacing-md;
  }
}

.timeline-wrapper {
  @include card;
  background: url('/images/abbg.png') no-repeat right top $white-bg;
  padding: $spacing-xl;
}

.page-title {
  font-size: $font-size-xl;
  margin-bottom: $spacing-xl;
  padding-bottom: $spacing-sm;
  border-bottom: 1px dashed $border-color;
}

.timeline {
  position: relative;
  padding-left: 100px;
  
  @include respond-to('sm') {
    padding-left: 80px;
  }
  
  &::before {
    content: "";
    position: absolute;
    left: 90px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: #e0dfdf;
    
    @include respond-to('sm') {
      left: 70px;
    }
  }
}

.timeline-date {
  position: relative;
  margin-bottom: $spacing-sm;
  
  span {
    position: absolute;
    left: -100px;
    line-height: 32px;
    padding-right: 40px;
    color: $text-muted;
    
    @include respond-to('sm') {
      left: -80px;
      font-size: $font-size-sm;
      padding-right: 20px;
    }
    
    &::after {
      content: "";
      position: absolute;
      width: 2px;
      height: 100%;
      background: #e0dfdf;
      right: 18px;
      top: 0;
      
      @include respond-to('sm') {
        right: 8px;
      }
    }
  }
}

.timeline-items {
  margin-bottom: $spacing-lg;
  
  li {
    @include text-ellipsis;
    line-height: 32px;
    
    i {
      position: relative;
      font-style: normal;
      
      &::before {
        content: "";
        height: 10px;
        width: 10px;
        border: 2px solid #cccaca;
        background: $white-bg;
        position: absolute;
        top: 11px;
        left: -16px;
        border-radius: $radius-full;
        transition: $transition-slow;
      }
    }
    
    &:hover i::before {
      background: #080808;
    }
  }
}

.white-bg {
  @include card;
}
</style>
