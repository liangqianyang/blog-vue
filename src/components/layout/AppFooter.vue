<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="footer-content">
      <!-- 微信二维码 -->
      <div class="wx-box">
        <ul>
          <li>
            <img src="/images/lqy-comic_wxgzh.jpg" alt="微信公众号">
            <span>微信公众号</span>
          </li>
        </ul>
      </div>
      
      <!-- 站点声明 -->
      <div class="footer-nav">
        <p><b>站点声明：</b></p>
        <p>所有文章未经授权禁止转载、摘编、复制或建立镜像，如有违反，追究法律责任。举报邮箱：<a href="mailto:liangqy@proton.me">liangqy@proton.me</a></p>
        <p>
          Copyright © {{ currentYear }} 
          <a href="http://lqy-comic.com" target="_blank">lqy-comic.com</a> 
          All Rights Reserved. 
          备案号：<a href="http://www.miitbeian.gov.cn/" target="_blank" rel="noopener">皖ICP备18005512号-1</a>
        </p>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.footer {
  background: #373d41;
  width: 100%;
  border-top: 10px solid $primary;
  padding: $spacing-xl 0;
  color: $text-light;
  font-size: $font-size-sm;
}

.footer-content {
  width: $container-width;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: $spacing-lg;
  
  @include respond-to('xl') {
    width: 100%;
    padding: 0 $spacing-md;
  }
  
  @include respond-to('md') {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}

.wx-box {
  flex-shrink: 0;
  
  li {
    text-align: center;
    
    img {
      height: 100px;
      margin-bottom: $spacing-xs;
    }
    
    span {
      display: block;
      font-size: $font-size-xs;
    }
  }
}

.footer-nav {
  text-align: left;
  
  @include respond-to('md') {
    text-align: center;
  }
  
  b {
    font-size: $font-size-md;
    color: $primary;
  }
  
  p {
    margin-bottom: $spacing-xs;
    line-height: 1.6;
  }
  
  a {
    color: $text-light;
    
    &:hover {
      color: $primary;
    }
  }
}
</style>
