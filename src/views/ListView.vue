<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores'
import { articleApi, tagApi, searchApi, categoryApi } from '@/api'
import type { Article, Label, NavItem, Category } from '@/types'

import BlogList from '@/components/home/BlogList.vue'
import Pagination from '@/components/common/Pagination.vue'

const route = useRoute()
const appStore = useAppStore()

const articles = ref<Article[]>([])
const labels = ref<Label[]>([])
const loading = ref(true)
const currentPage = ref(1)
const totalPages = ref(1)
const total = ref(0)
const pageSize = 10

// 随机颜色列表（更亮的配色）
const tagColors = [
  '#4dd4ac',
  '#fc8d76',
  '#ffba5a',
  '#a8daba',
  '#85c4f3',
  '#f0a0a0',
  '#b399d1',
  '#70c3ff',
  '#ffd966',
  '#ff9f6e'
]

// 为每个标签生成随机颜色
const labelColors = ref<Map<number, string>>(new Map())

const getRandomColor = (id: number): string => {
  if (!labelColors.value.has(id)) {
    const randomIndex = Math.floor(Math.random() * tagColors.length)
    const color = tagColors[randomIndex]
    if (color) {
      labelColors.value.set(id, color)
    }
  }
  return labelColors.value.get(id) || tagColors[0] || '#3c9'
}

const currentNav = computed(() => {
  const findItem = (items: NavItem[]): NavItem | undefined => {
    for (const item of items) {
      if (item.path === route.path) return item
      if (item.children) {
        const found = findItem(item.children)
        if (found) return found
      }
    }
    return undefined
  }
  return findItem(appStore.navItems)
})

const categoryName = computed(() => {
  if (route.query.keyword) {
    return `搜索结果: "${route.query.keyword}"`
  }
  return currentNav.value?.name || '文章列表'
})

const categoryDesc = computed(() => {
  if (route.query.keyword) {
    return `共找到 ${total.value} 篇关于 "${route.query.keyword}" 的文章`
  }
  return currentNav.value?.description || '暂无简介'
})

const categoryCover = computed(() => {
  // Clean up cover URL if it contains backticks or extra spaces as seen in the user input example
  // User input example: " `http://...` "
  let cover = currentNav.value?.cover
  if (cover) {
    cover = cover.replace(/`/g, '').trim()
  }
  return cover || '/images/lm01.jpg'
})

const loadArticles = async () => {
  loading.value = true
  try {
    const categorySlug = route.params.category as string
    const keyword = route.query.keyword as string
    
    let data;
    if (keyword) {
      // 如果有关键词，调用搜索接口
      data = await searchApi.search({
        keyword,
        page: currentPage.value,
        per_page: pageSize
      })
    } else {
      // 获取分类列表以查找 category_id
      let categoryId: number | undefined
      if (categorySlug) {
        // 如果 categorySlug 是数字，直接作为 ID 使用
        if (/^\d+$/.test(categorySlug)) {
          categoryId = parseInt(categorySlug, 10)
        } else {
          // 尝试从导航数据中查找 ID
          const findCategoryInNav = (items: NavItem[]): number | undefined => {
            for (const item of items) {
              // 匹配路径 /list/slug
              if (item.path === `/list/${categorySlug}`) return item.id
              if (item.children) {
                const found = findCategoryInNav(item.children)
                if (found) return found
              }
            }
            return undefined
          }
          
          categoryId = findCategoryInNav(appStore.navItems)
          
          // 如果导航中没找到，尝试从分类列表中查找
          if (!categoryId) {
            // 调用分类接口获取所有分类
            const categories = await categoryApi.getArticleCategoriesList()
            // 尝试匹配 slug 或 name
            const matchedCategory = categories.find(c => c.slug === categorySlug || c.name === categorySlug)
            
            if (matchedCategory) {
              categoryId = matchedCategory.id
            } else {
               console.warn(`未找到分类: ${categorySlug}`)
            }
          }
        }
      }

      // 调用公开文章列表接口
      data = await articleApi.getPublicList({
        category_id: categoryId,
        page: currentPage.value,
        per_page: pageSize
      })
    }
    
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
    labels.value = await tagApi.getPublicList()
  } catch (error) {
    console.error('Failed to load labels:', error)
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
        <img :src="categoryCover" alt="栏目图片">
        <h1>{{ categoryName }}</h1>
        <p>{{ categoryDesc }}</p>
      </div>
      
      <!-- 文章列表 -->
      <BlogList :articles="articles" :show-title="!route.query.keyword" />
      
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
      <div class="white-bg tag-cloud" v-if="labels.length > 0">
        <h2 class="section-title">标签云</h2>
        <div class="tag-list">
          <router-link 
            v-for="label in labels.filter(l => l.title)" 
            :key="label.id" 
            :to="`/list?label_id=${label.id}`"
            class="tag-item"
            :style="{ backgroundColor: getRandomColor(label.id) }"
          >
            {{ label.title }}
          </router-link>
        </div>
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
.tag-cloud {
  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding-top: $spacing-md;
  }
  
  .tag-item {
    display: inline-block;
    padding: 5px 12px;
    border-radius: 3px;
    color: #fff;
    font-size: 13px;
    font-weight: 500;
    line-height: 1.4;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      filter: brightness(1.1);
    }
    
    &:empty {
      display: none;
    }
  }
}
</style>
