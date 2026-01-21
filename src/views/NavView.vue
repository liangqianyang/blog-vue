<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { blogSiteApi } from '@/api'
import type { BlogSite } from '@/types'

const sites = ref<BlogSite[]>([])
const loading = ref(true)

// 模拟更多站点数据
const moreSites = [
  '杨青青个人博客', '阮一峰的网络日志', '张鑫旭博客', '廖雪峰的官方网站',
  '月光博客', '卢松松博客', '鸟哥的Linux私房菜', '酷壳',
  '阿里云', '腾讯云', '华为云', '七牛云',
  'GitHub', 'GitLab', 'Gitee', 'Coding',
  '掘金', 'SegmentFault', 'CSDN', '博客园',
  '知乎', '简书', '开源中国', 'V2EX',
  'MDN Web Docs', 'Can I Use', 'CSS-Tricks', 'Smashing Magazine',
  'Stack Overflow', 'Reddit', 'Hacker News', 'Dev.to'
]

onMounted(async () => {
  try {
    sites.value = await blogSiteApi.getList()
  } catch (error) {
    console.error('Failed to load blog sites:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <article class="main-layout">
    <div class="nav-wrapper white-bg">
      <!-- 站点推荐 -->
      <h2 class="section-title">
        <span class="nav-links">
          <a href="/">个人博客</a>
          <a href="/">技术博客</a>
          <a href="/">前端博客</a>
          <a href="/">云服务</a>
        </span>
        优秀博客导航
      </h2>
      
      <ul class="site-grid">
        <li v-for="(site, index) in moreSites" :key="index">
          <a :href="sites[index % sites.length]?.url || ''" target="_blank">
            {{ site }}
          </a>
        </li>
      </ul>
      
      <!-- 更多分类 -->
      <h2 class="section-title">开发工具</h2>
      <ul class="site-grid">
        <li v-for="i in 18" :key="i">
          <a href="/" target="_blank">开发工具 {{ i }}</a>
        </li>
      </ul>
      
      <h2 class="section-title">学习资源</h2>
      <ul class="site-grid">
        <li v-for="i in 18" :key="i">
          <a href="/" target="_blank">学习资源 {{ i }}</a>
        </li>
      </ul>
      
      <h2 class="section-title">设计素材</h2>
      <ul class="site-grid">
        <li v-for="i in 12" :key="i">
          <a href="/" target="_blank">设计素材 {{ i }}</a>
        </li>
      </ul>
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

.nav-wrapper {
  @include card;
}

.section-title {
  @include section-title;
  margin-top: $spacing-lg;
  
  &:first-child {
    margin-top: 0;
  }
}

.nav-links {
  float: right;
  
  a {
    display: inline-block;
    margin-right: $spacing-sm;
    padding-right: $spacing-sm;
    position: relative;
    font-size: $font-size-sm;
    
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

.site-grid {
  display: flex;
  flex-wrap: wrap;
  padding-top: $spacing-lg;
  
  li {
    width: 16.66%;
    text-align: center;
    line-height: 30px;
    margin-bottom: $spacing-sm;
    
    @include respond-to('lg') {
      width: 25%;
    }
    
    @include respond-to('md') {
      width: 33.33%;
    }
    
    @include respond-to('sm') {
      width: 50%;
    }
    
    a {
      display: block;
      border: 1px solid $border-color;
      margin: 0 5px;
      border-radius: $radius-sm;
      @include text-ellipsis;
      transition: $transition-base;
      
      &:hover {
        box-shadow: $shadow-md;
        background: #222;
        color: $text-white;
      }
    }
  }
}

.white-bg {
  @include card;
}
</style>
