<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { Article, Category } from '@/types'
import { categoryApi, articleApi } from '@/api'

const tabs = ref<Category[]>([])
const activeTab = ref<number | null>(null)
const articlesByCategory = ref<Record<number, Article[]>>({})
const loading = ref(false)

const changeTab = (categoryId: number) => {
  activeTab.value = categoryId
}

// 加载分类下的文章
const loadCategoryArticles = async (categoryId: number) => {
  if (articlesByCategory.value[categoryId]) {
    return // 已加载过
  }
  loading.value = true
  try {
    const articles = await articleApi.getTopRanked({ 
      limit: 2, 
      category_id: categoryId 
    })
    articlesByCategory.value[categoryId] = articles
  } catch (error) {
    console.error('加载分类文章失败:', error)
    articlesByCategory.value[categoryId] = []
  } finally {
    loading.value = false
  }
}

// 监听 activeTab 变化，加载对应分类的文章
watch(activeTab, (newVal) => {
  if (newVal !== null) {
    loadCategoryArticles(newVal)
  }
}, { immediate: true })

onMounted(async () => {
  loading.value = true
  try {
    // 获取分类列表
    const categories = await categoryApi.getArticleCategoriesList()
    tabs.value = categories
    
    // 设置默认选中第一个分类
    if (categories.length > 0 && categories[0]) {
      activeTab.value = categories[0].id
    }
  } catch (error) {
    console.error('加载分类失败:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="news-tabs white-bg">
    <!-- Tab 按钮 -->
    <div class="tab-buttons">
      <ul>
        <li 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="{ active: activeTab === tab.id }"
          @click="changeTab(tab.id)"
        >
          {{ tab.name }}
        </li>
      </ul>
    </div>
    
    <!-- Tab 内容 -->
    <div class="tab-content">
      <TransitionGroup name="fade">
        <div 
          v-for="tab in tabs"
          v-show="activeTab === tab.id"
          :key="tab.id"
          class="tab-panel"
        >
          <!-- 左侧图片 -->
          <div class="news-pic">
            <ul>
              <li v-for="(article, index) in (articlesByCategory[tab.id] || []).slice(0, 2)" :key="index">
                <router-link :to="`/article/${article.id}`">
                  <img :src="article.cover" :alt="article.title">
                  <span>{{ article.title }}</span>
                </router-link>
              </li>
            </ul>
          </div>
          
          <!-- 右侧列表 -->
          <ul class="news-list">
            <li v-for="(article, index) in (articlesByCategory[tab.id] || [])" :key="article.id">
              <i>{{ index + 1 }}</i>
              <router-link :to="`/article/${article.id}`">{{ article.title }}</router-link>
              <p>{{ article.summary }}</p>
            </li>
          </ul>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.news-tabs {
  @include card;
}

.tab-buttons {
  margin-bottom: $spacing-sm;
  border-bottom: 1px solid $border-light;
  
  ul {
    display: flex;
    flex-wrap: wrap;
  }
  
  li {
    font-size: $font-size-md;
    line-height: 40px;
    width: 100px;
    text-align: center;
    cursor: pointer;
    position: relative;
    transition: $transition-base;
    
    @include respond-to('sm') {
      width: auto;
      padding: 0 $spacing-md;
      font-size: $font-size-sm;
    }
    
    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: transparent;
      transition: $transition-base;
    }
    
    &.active::after,
    &:hover::after {
      background: #000;
    }
  }
}

.tab-content {
  position: relative;
  min-height: 230px;
}

.tab-panel {
  display: flex;
  gap: $spacing-lg;
  
  @include respond-to('md') {
    flex-direction: column;
  }
}

.news-pic {
  width: 32%;
  flex-shrink: 0;
  
  @include respond-to('md') {
    width: 100%;
  }
  
  ul {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
  }
  
  li {
    height: 104px;
    position: relative;
    background: rgba(0, 0, 0, 1);
    overflow: hidden;
    border-radius: $radius-sm;
    
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
      opacity: 0.9;
      transform: scale(1.1);
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
  }
}

.news-list {
  flex: 1;
  
  li {
    overflow: hidden;
    line-height: 32px;
    padding: 0 $spacing-lg $spacing-sm;
    transition: $transition-base;
    
    &:hover {
      background: $hover-bg;
      
      a {
        color: #000;
        font-weight: bold;
      }
      
      i {
        background: #222;
      }
    }
    
    i {
      display: inline-block;
      width: 20px;
      height: 20px;
      background: #9a9a9a;
      margin-right: $spacing-lg;
      font-style: normal;
      font-size: 9px;
      color: $text-white;
      line-height: 20px;
      text-align: center;
      vertical-align: middle;
    }
    
    a {
      vertical-align: middle;
    }
    
    p {
      line-height: 24px;
      font-size: $font-size-sm;
      @include text-clamp(2);
      margin-top: $spacing-xs;
      color: $text-secondary;
    }
  }
}

.white-bg {
  @include card;
}

// 淡入淡出
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
