<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/stores'
import { articleApi, tagApi } from '@/api'
import type { SidebarArticle, Tag } from '@/types'

const appStore = useAppStore()

const hotArticles = ref<SidebarArticle[]>([])
const recommendArticles = ref<SidebarArticle[]>([])
const tags = ref<Tag[]>([])
const showWechat = ref(false)

onMounted(async () => {
  // 使用 Promise.allSettled 让每个请求独立处理，避免一个失败导致全部失败
  const [hotResult, recommendResult, tagsResult] = await Promise.allSettled([
    articleApi.getHotList(7),
    articleApi.getRecommendList(7),
    tagApi.getList()
  ])
  
  if (hotResult.status === 'fulfilled') {
    hotArticles.value = hotResult.value
  } else {
    console.error('Failed to load hot articles:', hotResult.reason)
  }
  
  if (recommendResult.status === 'fulfilled') {
    recommendArticles.value = recommendResult.value
  } else {
    console.error('Failed to load recommend articles:', recommendResult.reason)
  }
  
  if (tagsResult.status === 'fulfilled') {
    tags.value = tagsResult.value
  } else {
    console.error('Failed to load tags:', tagsResult.reason)
  }
})
</script>

<template>
  <aside class="sidebar">
    <!-- 名片 -->
    <div class="card">
      <h2>我的名片</h2>
      <p>网名：LeoLiang | 枫叶</p>
      <p>职业：PHP工程师</p>
      <p>现居：安徽省-合肥市</p>
      <p>Email：liangqy@proton.me</p>
     
    </div>

    <!-- 网站公告 -->
    <div class="white-bg notice">
      <h2 class="section-title">网站公告</h2>
      <ul>
        <li><router-link to="/article/12">十条设计原则教你学会如何设计网页布局!</router-link></li>
        <li><router-link to="/article/1">用js+css3来写一个手机栏目导航</router-link></li>
        <li><router-link to="/article/2">6条网页设计配色原则,让你秒变配色高手</router-link></li>
        <li><router-link to="/article/3">三步实现滚动条触动css动画效果</router-link></li>
      </ul>
    </div>

    <!-- 点击排行 -->
    <div class="white-bg ranking">
      <h2 class="section-title">点击排行</h2>
      <div class="top-news img-scale" v-if="hotArticles[0]">
        <router-link :to="`/article/${hotArticles[0].id}`">
          <img :src="hotArticles[0].cover" :alt="hotArticles[0].title">
          <span>{{ hotArticles[0].title }}</span>
        </router-link>
      </div>
      <ul>
        <li v-for="(article, index) in hotArticles" :key="article.id">
          <i>{{ index + 1 }}</i>
          <router-link :to="`/article/${article.id}`">{{ article.title }}</router-link>
        </li>
      </ul>
    </div>

    <!-- 站长推荐 -->
    <div class="white-bg recommend">
      <h2 class="section-title">站长推荐</h2>
      <div class="top-news img-scale" v-if="recommendArticles[0]">
        <router-link :to="`/article/${recommendArticles[0].id}`">
          <img :src="recommendArticles[0].cover" :alt="recommendArticles[0].title">
          <span>{{ recommendArticles[0].title }}</span>
        </router-link>
      </div>
      <ul>
        <li v-for="article in recommendArticles" :key="article.id">
          <router-link :to="`/article/${article.id}`">
            <i v-if="article.cover">
              <img :src="article.cover" :alt="article.title">
            </i>
            <p>{{ article.title }}</p>
          </router-link>
        </li>
      </ul>
    </div>

    <!-- 广告位 -->
    <div class="white-bg ad img-scale">
      <a href="/">
        <img src="/images/ad.jpg" alt="广告">
      </a>
    </div>

    <!-- 猜你喜欢 -->
    <div class="white-bg text-list">
      <h2 class="section-title">猜你喜欢</h2>
      <ul>
        <li v-for="article in hotArticles.slice(0, 8)" :key="article.id">
          <router-link :to="`/article/${article.id}`">{{ article.title }}</router-link>
        </li>
      </ul>
    </div>


  </aside>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.sidebar {
  width: 100%;
}

// 名片
.card {
  background: url('/images/quote-bg.png') no-repeat top right rgba(42, 42, 42, 1);
  border-radius: $radius-sm;
  padding: $spacing-lg;
  margin-bottom: $spacing-lg;
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 1px 1px rgba(0, 0, 0, 0.7);
  
  h2 {
    font-size: $font-size-xl;
    color: #89919a;
    font-weight: normal;
    padding-bottom: $spacing-sm;
    margin-bottom: $spacing-sm;
  }
  
  p {
    font-size: $font-size-xs;
    line-height: 28px;
    color: #d0d2d4;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  }
}

.link-more {
  display: flex;
  margin-top: $spacing-md;
  gap: $spacing-sm;
  
  li {
    flex: 1;
    
    a {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 53px;
      border-radius: $radius-full;
      box-shadow: 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 1px 1px rgba(0, 0, 0, 0.7);
      transition: $transition-base;
      
      &:hover {
        opacity: 0.5;
      }
      
      img {
        width: 36px;
        height: 36px;
      }
    }
  }
}

.wechat-item {
  position: relative;
}

.wechat-popup {
  position: absolute;
  bottom: 60px;
  right: 0;
  
  img {
    width: 100px;
    height: 100px;
  }
}

// 公告
.notice {
  ul {
    padding-top: 18px;
  }
  
  li {
    font-size: $font-size-xs;
    line-height: 30px;
    margin-bottom: 12px;
    border-radius: $radius-sm;
    background: $light-bg;
    padding: 4px 12px 4px 30px;
    @include text-ellipsis;
    position: relative;
    transition: $transition-base;
    
    &::before {
      content: "";
      position: absolute;
      width: 3px;
      height: 3px;
      background: #000;
      border-radius: $radius-full;
      left: 15px;
      top: 20px;
    }
    
    &:hover {
      background: #f2f2f2;
      box-shadow: $shadow-lg;
    }
  }
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

// 文字列表
.text-list {
  li {
    line-height: 22px;
    margin-bottom: $spacing-sm;
    @include list-dot;
  }
}



.img-scale {
  @include img-scale;
}

.white-bg {
  @include card;
}

.section-title {
  @include section-title;
}
</style>
