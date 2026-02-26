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
const perPage = 20

const loadArticles = async () => {
  loading.value = true
  try {
    const data = await articleApi.getPublicList({
      page: currentPage.value,
      per_page: perPage,
      with_top: false
    })

    articles.value = data.list
    total.value = data.total
    totalPages.value = data.lastPage
  } catch (error) {
    console.error('Failed to load articles:', error)
  } finally {
    loading.value = false
  }
}

// 格式化日期：只取 yyyy-MM-dd 部分
const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return dateStr.substring(0, 10)
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
    <div class="timebox">
      <h2 class="htitle">往期文章</h2>

      <div v-if="loading" class="timeline-loading">加载中...</div>
      <ul v-else-if="articles.length">
        <li v-for="article in articles" :key="article.id">
          <span>{{ formatDate(article.createTime) }}</span>
          <i>
            <router-link :to="`/article/${article.id}`">{{ article.title }}</router-link>
          </i>
        </li>
      </ul>
      <div v-else class="timeline-empty">暂无文章</div>

      <!-- 分页 -->
      <Pagination
        v-if="totalPages > 1"
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

.timebox {
  background: url('/images/abbg.png') no-repeat right top $white-bg;
  border-radius: 3px;
  padding: $spacing-xl;
  margin-bottom: $spacing-lg;
  overflow: hidden;

  ul {
    overflow: hidden;
  }

  li {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    line-height: 32px;

    &:hover i::before {
      background: #080808;
    }
  }

  span {
    position: relative;
    line-height: 32px;
    padding-right: 40px;
    color: $text-muted;

    &::after {
      position: absolute;
      content: "";
      width: 2px;
      height: 40px;
      background: #e0dfdf;
      right: 18px;
    }
  }

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
      top: 4px;
      left: -26px;
      border-radius: $radius-full;
      transition: all 0.5s ease;
    }
  }

  i a {
    color: $text-primary;

    &:hover {
      color: #000;
      font-weight: bold;
    }
  }
}

.htitle {
  font-size: 16px;
  line-height: 40px;
  border-bottom: 1px solid $border-color;
  color: #484848;
  font-weight: normal;
  position: relative;
  margin-bottom: $spacing-sm;

  &::after {
    content: "";
    position: absolute;
    width: 60px;
    height: 2px;
    background: #000;
    left: 0;
    bottom: 0;
    transition: all 0.5s ease;
  }

  &:hover::after {
    width: 80px;
  }
}

.timeline-loading,
.timeline-empty {
  text-align: center;
  padding: $spacing-xl 0;
  color: $text-muted;
}

// 分页间距
:deep(.pagelist) {
  margin-top: $spacing-lg;
}

// 响应式
@media (max-width: $breakpoint-md) {
  .timebox {
    padding: $spacing-md;

    span {
      padding-right: 30px;
      font-size: 13px;

      &::after {
        right: 13px;
      }
    }
  }
}

@media (max-width: $breakpoint-sm) {
  .timebox {
    span {
      display: none;
    }

    i::before {
      display: none;
    }

    li {
      padding-left: 0;
    }
  }
}
</style>
