<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { aboutApi, articleApi } from '@/api'
import type { AboutInfo } from '@/types'

const aboutInfo = ref<AboutInfo | null>(null)
const loading = ref(true)

// 获取心路历程（个人博客日记）
const loadExperiences = async () => {
  try {
    // 使用 top-ranked 接口获取文章列表
    const list = await articleApi.getTopRanked({
      limit: 8,
      category_id: 1
    })
    
    // 转换为 Experience 类型
    return list.map(item => ({
      id: item.id,
      title: item.title,
      summary: item.summary,
      cover: item.cover || '/images/default-cover.jpg',
      link: `/article/${item.id}`
    }))
  } catch (error) {
    console.error('Failed to load experiences:', error)
  }
  return []
}

onMounted(async () => {
  try {
    // 并行获取个人信息和心路历程
    const [info, experiences] = await Promise.all([
      aboutApi.getInfo(),
      loadExperiences()
    ])
    
    aboutInfo.value = info
    
    // 如果获取到了心路历程数据，覆盖原有数据
    if (experiences.length > 0 && aboutInfo.value) {
      aboutInfo.value.experiences = experiences
    }
  } catch (error) {
    console.error('Failed to load about info:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <article class="main-layout">
    <div class="about-wrapper white-bg" v-if="aboutInfo">
      <!-- 个人介绍 -->
      <div class="about-header">
        <i class="avatar-pic">
          <img :src="aboutInfo.avatar" :alt="aboutInfo.name">
        </i>
        <h3>{{ aboutInfo.name }}</h3>
        <p>{{ aboutInfo.title }}</p>
        <p>{{ aboutInfo.description }}</p>
      </div>
      
      <!-- 内心独白 -->
      <h2 class="section-subtitle">内心独白</h2>
      <p class="intro-text">{{ aboutInfo.intro }}</p>
      <span class="message-btn">
        <a href="http://www.yangqq.com/e/tool/gbook/?bid=1" target="_blank">留言</a>
      </span>
      
      <!-- 心路历程 -->
      <template v-if="aboutInfo.experiences && aboutInfo.experiences.length > 0">
        <h2 class="section-subtitle">心路历程</h2>
        <ul class="experience-list">
          <li v-for="exp in aboutInfo.experiences" :key="exp.id">
            <router-link :to="exp.link">
              <i><img :src="exp.cover" :alt="exp.title"></i>
              <p>{{ exp.title }}</p>
              <span>{{ exp.summary }}</span>
            </router-link>
          </li>
        </ul>
      </template>
      
      <!-- 我的博客 -->
      <template v-if="aboutInfo.blogs && aboutInfo.blogs.length > 0">
        <h2 class="section-subtitle">我的博客</h2>
        <ul class="blog-info-list">
          <li v-for="blog in aboutInfo.blogs" :key="blog.label">
            <b>{{ blog.label }}</b>
            <p>
              <a v-if="blog.link" :href="blog.link" target="_blank">{{ blog.value }}</a>
              <template v-else>{{ blog.value }}</template>
            </p>
            <p>
              <a :href="blog.link || '/'" class="buttons">{{ blog.buttonText }}</a>
            </p>
          </li>
        </ul>
      </template>
      
      <!-- 加入我们/联系方式 (已隐藏) -->
      <!-- <template v-if="aboutInfo.contacts && aboutInfo.contacts.length > 0">
        <h2 class="section-subtitle">联系方式</h2>
        <ul class="contact-list">
          <li v-for="contact in aboutInfo.contacts" :key="contact.title">
            <section>
              <img v-if="contact.qrcode" :src="contact.qrcode" :alt="contact.title">
              <div v-else class="contact-icon">{{ contact.title[0] }}</div>
              <p>{{ contact.title }}</p>
              <p>{{ contact.subtitle }}</p>
            </section>
          </li>
        </ul>
      </template> -->
    </div>
    
    <!-- 加载中 -->
    <div v-else-if="loading" class="loading white-bg">
      加载中...
    </div>
  </article>
</template>

<style lang="scss" scoped>
@use 'sass:color';
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

.about-wrapper {
  @include card;
  background: url('/images/abbg.png') no-repeat right top $white-bg;
  padding: $spacing-lg 40px;
}

.about-header {
  @include clearfix;
  margin-bottom: $spacing-lg;
  
  h3 {
    font-size: $font-size-lg;
    margin: $spacing-sm 0;
  }
  
  p {
    color: $text-secondary;
    margin-bottom: 5px;
  }
}

.avatar-pic {
  position: relative;
  float: left;
  margin-right: $spacing-sm;
  background: $gradient-avatar;
  display: block;
  padding: 2px;
  width: 100px;
  border-radius: $radius-full;
  
  img {
    width: 100%;
    border-radius: $radius-full;
  }
  
  &::before {
    content: "";
    position: absolute;
    background: url('/images/v.png') no-repeat;
    bottom: 0;
    right: $spacing-sm;
    height: 24px;
    width: 24px;
    background-size: 24px;
  }
}

.section-subtitle {
  margin: $spacing-lg 0;
  font-size: $font-size-lg;
  background: url('/images/hline.png') no-repeat bottom right;
  width: 120px;
  clear: both;
  background-size: 40px;
  border-bottom: 1px dashed #000;
  padding-left: $spacing-sm;
  padding-bottom: 5px;
  display: inline-block;
}

.intro-text {
  margin-bottom: $spacing-md;
  line-height: 1.8;
  color: $text-secondary;
}

.message-btn {
  float: right;
  width: 100px;
  background: #000;
  text-align: center;
  border-radius: $radius-sm;
  line-height: 30px;
  
  a {
    color: $text-white;
    display: block;
  }
}

.experience-list {
  display: flex;
  flex-wrap: wrap;
  @include clearfix;
  
  li {
    width: 25%;
    overflow: hidden;
    margin-bottom: $spacing-lg;
    
    @include respond-to('lg') {
      width: 50%;
    }
    
    @include respond-to('sm') {
      width: 100%;
    }
    
    a {
      display: block;
      margin: 0 $spacing-sm;
      background: #f3f3f3;
      padding: $spacing-lg;
    }
    
    i {
      display: block;
      overflow: hidden;
      height: 120px;
      margin-bottom: $spacing-sm;
      
      img {
        width: 100%;
        min-height: 120px;
        object-fit: cover;
        transition: $transition-slow;
      }
      
      &:hover img {
        transform: scale(1.1);
      }
    }
    
    p {
      font-weight: bold;
      margin-bottom: $spacing-sm;
      @include text-ellipsis;
    }
    
    span {
      color: $text-secondary;
      @include text-clamp(3);
      font-size: $font-size-sm;
      height: 62px;
      display: block;
    }
  }
}

.blog-info-list {
  display: flex;
  flex-wrap: wrap;
  @include clearfix;
  
  li {
    width: 20%;
    text-align: center;
    padding-bottom: $spacing-sm;
    position: relative;
    
    @include respond-to('lg') {
      width: 33.33%;
      margin-bottom: $spacing-md;
    }
    
    @include respond-to('sm') {
      width: 50%;
    }
    
    &::after {
      content: "";
      position: absolute;
      right: 0;
      top: 0;
      background: $page-bg;
      height: 100%;
      width: 1px;
    }
    
    &:last-child::after {
      display: none;
    }
    
    b {
      display: block;
      line-height: 30px;
      margin-bottom: $spacing-sm;
    }
    
    p {
      margin-bottom: $spacing-sm;
    }
  }
}

.buttons {
  display: inline-block;
  margin: $spacing-sm auto;
  width: 130px;
  text-align: center;
  background: $primary;
  padding: 5px 0;
  border-radius: $radius-sm;
  color: $text-white;
  
  &:hover {
    background: $primary-dark;
    color: $text-white;
  }
}

li:nth-child(even) .buttons {
  background: $warning;
  
  &:hover {
    background: color.adjust($warning, $lightness: -10%);
  }
}

.contact-list {
  display: flex;
  flex-wrap: wrap;
  
  li {
    width: 25%;
    
    @include respond-to('lg') {
      width: 50%;
      margin-bottom: $spacing-md;
    }
    
    @include respond-to('sm') {
      width: 100%;
    }
    
    section {
      margin: 0 $spacing-lg;
      box-shadow: $shadow-card;
      padding: $spacing-sm;
      overflow: hidden;
      text-align: center;
    }
    
    img {
      width: 90%;
      margin: 0 auto;
      background: $gradient-avatar;
      padding: 5px;
    }

    .contact-icon {
      width: 60px;
      height: 60px;
      margin: 10px auto;
      background: $primary;
      color: $text-white;
      border-radius: 50%;
      line-height: 60px;
      font-size: 24px;
      font-weight: bold;
    }
    
    p {
      margin: $spacing-sm;
    }
    
    b {
      color: #019881;
      margin: 0 5px;
    }
  }
}

.white-bg {
  @include card;
}

.loading {
  text-align: center;
  padding: 60px 0;
  color: $text-muted;
}
</style>
